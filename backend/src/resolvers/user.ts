import Joi from "joi"
import mongoose from "mongoose"
import { UserInputError } from "apollo-server-express"
import { signUp, signIn } from "../schemas"
import { attemptSignIn, signOut, createAccessToken, createRefreshToken } from "../auth"
import { User } from "../models"
import { sign } from "jsonwebtoken"
import {
    REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_COOKIE_NAME, ACCESS_TOKEN_COOKIE_NAME
} from "../config"


export default {
    Query: {
        me: (root, args, { req }, info) => {
            //TODO: projection 
            return User.findById(req.userId)
        },
        users: (root, args, { req }, info) => {
            //TODO: auth, projection, pagination,sanitization
            return User.find({});
        },
        user: (root, { id }, { req }, info) => {
            //TODO: auth,projection,sanitization
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new UserInputError(`${id} is not a valid user ID.`)
            }
            return User.findById(id);

        }
    },
    Mutation: {
        signUp: async (root, args, { req , res }, info) => {
            //TODO no auth, validation
            await Joi.validate(args, signUp, { abortEarly: false })
            
            const user = new User(args)

            createAccessToken(req, res, { userId: user.id })

            createRefreshToken(req, res, { userId: user.id })

            user.save()

            return user
        },
        signIn: async (root, args, { req, res }, info) => {

            Joi.validate(args, signIn, { abortEarly: false })

            const { email, password } = args

            const user = await attemptSignIn(args.email, args.password)

            createAccessToken(req, res, { userId: user.id, })

            createRefreshToken(req, res, { userId: user.id, count: user.tokenCount })

            return user
        },
        signOut: (root, args, { req, res }, info) => {
            return signOut(req, res)
        }
    }
}
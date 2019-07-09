import Joi from "joi"
import mongoose from "mongoose"
import { UserInputError } from "apollo-server-express"
import { signUp, signIn } from "../schemas"
import { attemptSignIn, signOut } from "../auth"
import { User } from "../models"



export default {
    Query: {
        me: (root, args, { req }, info) => {
            //TODO: projection 
            return User.findById(req.session.userId)
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
        signUp: async (root, args, { req }, info) => {
            //TODO no auth, validation
            await Joi.validate(args, signUp, { abortEarly: false })

            const user = await User.create(args)

            req.session.userId = user.id

            return user
        },
        signIn: async (root, args, { req }, info) => {
            Joi.validate(args, signIn, { abortEarly: false })

            const { email, password } = args

            const user = await attemptSignIn(args.email, args.password)

            req.session.userId = user.id

            return user
        },
        signOut: (root, args, { req, res }, info) => {
            return signOut(req, res)
        }
    }
}
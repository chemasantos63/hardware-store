import mongoose from "mongoose"
import { UserInputError } from "apollo-server-express"
import { User } from "../models"

export default {
    Query: {
        users: (root, args, context, info) => {
            //TODO: auth, projection, pagination,sanitization

            return User.find({});

        },
        user: (root, { id }, context, info) => {
            //TODO: auth,projection,sanitization

            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new UserInputError(`${id} is not a valid user ID.`)
            }

            return User.findById(id);

        }
    },
    Mutation: {
        singUp: (root, args, context, info) => {
            //TODO no auth
            //validation
            return User.create(args)
        }
    }
}
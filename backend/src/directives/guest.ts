import { SchemaDirectiveVisitor } from "apollo-server-express"
import { defaultFieldResolver, GraphQLField } from "graphql"
import { ensureSignedOut } from "../auth"

class GuestDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: GraphQLField<any, any>) {
        const { resolve = defaultFieldResolver } = field

        field.resolve = function (...args) {
            const [, , context] = args

            ensureSignedOut(context.req)

            return resolve.apply(this, args)
        }
    }
}

export default GuestDirective
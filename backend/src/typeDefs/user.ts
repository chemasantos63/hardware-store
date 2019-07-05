import { gql } from "apollo-server-express"

export default gql`
    extend type Query{
        user(id: ID!):User
        users:[User!]!
    }

    extend type Mutation{
        singUp(email:String!, username:String!, name:String!, password:String!):User
    }

    type User{
        id:ID!,
        email:String!,
        username:String!,
        name:String!,
        createdAt:String!
    }
`
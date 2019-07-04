import { ApolloServer } from "apollo-server-express"
import express from "express"
import  mongoose  from "mongoose"
import typeDefs from "./typeDefs"
import resolvers from "./resolvers"
import { 
    APP_PORT, IN_PROD, DB_USERNAME, DB_HOST,DB_NAME,DB_PASSWORD,DB_PORT, 
} from "../config"

(async () => {
    try {
       await mongoose.connect(
            `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
            { useNewUrlParser:true }
        )
        
        const app = express()
        
        app.disable("x-powered-by")
        
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            playground: IN_PROD
        })
        
        server.applyMiddleware({ app })
        
        app.listen({ port: APP_PORT }, () =>
            console.log(`http://localhost:${APP_PORT}${server.graphqlPath}`)
        )
        
    } catch (e) {
        console.error(e)
    }
})()


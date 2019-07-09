import { ApolloServer } from "apollo-server-express"
import express from "express"
import connectRedis from "connect-redis"
import session from "express-session"
import mongoose from "mongoose"
import typeDefs from "./typeDefs"
import resolvers from "./resolvers"
import schemaDirectives from "./directives"

import {
    APP_PORT, IN_PROD, DB_USERNAME, DB_HOST, DB_NAME, DB_PASSWORD,
    SESS_LIFETIME, SESS_NAME, SESS_SECRET, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT
} from "./config"


(async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
            { useNewUrlParser: true }
        )

        const app = express()

        app.disable("x-powered-by")

        const RedisStore = connectRedis(session)

        const store = new RedisStore({
            host: REDIS_HOST,
            port: REDIS_PORT,
            pass: REDIS_PASSWORD

        })
        
        app.use(session({
            store,
            name: SESS_NAME,
            secret: SESS_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: parseInt(SESS_LIFETIME),
                sameSite: true,
                secure: IN_PROD
            }
        }))
        

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            schemaDirectives,
            playground: IN_PROD ? false : {
                settings: {
                    "request.credentials": "include"
                }
            },
            context: ({ req, res }) => ({ req, res })
        })

        server.applyMiddleware({ app, cors: false })

        app.listen({ port: APP_PORT }, () =>
            console.log(`http://localhost:${APP_PORT}${server.graphqlPath}`)
        )

    } catch (e) {
        console.error(e)
    }
})()


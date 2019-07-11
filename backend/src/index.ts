import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import express from "express";
import { verify } from "jsonwebtoken";
import mongoose from "mongoose";
import { createAccessToken, createRefreshToken, isNotValidateToken } from "./auth";
import { ACCESS_TOKEN_SECRET, APP_PORT, DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME, IN_PROD, REFRESH_TOKEN_SECRET } from "./config";
import schemaDirectives from "./directives";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

(async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
            { useNewUrlParser: true }
        )

        const app = express()

        app.disable("x-powered-by")

        app.use(cookieParser())

        app.use(async (req: any, res: any, next) => {
            const accessToken = req.cookies["access-token"]
            const refreshToken = req.cookies["refresh-token"]

            if (!accessToken && !refreshToken) { return next() } // if can't get some token next

            try {
                // for access token
                const data = verify(accessToken, ACCESS_TOKEN_SECRET) as any

                req.userId = data.userId

                return next()

            } catch { }

            if (!refreshToken) { return next() } //if can't  get refresh token

            //is refresh token is valid
            let data

            try {

                data = verify(refreshToken, REFRESH_TOKEN_SECRET) as any

            } catch{

                return next()
            }

            if (await isNotValidateToken(data.userId, data.count)) { return next() } // if refresh token has invalidate manual // signOut

            createAccessToken(req, res, { userId: data.userId })

            createRefreshToken(req, res, { userId: data.userId, count: data.count })

            next()
        })
        // const RedisStore = connectRedis(session)

        // const store = new RedisStore({
        //     host: REDIS_HOST,
        //     port: REDIS_PORT,
        //     pass: REDIS_PASSWORD

        // })

        // app.use(session({
        //     store,
        //     name: SESS_NAME,
        //     secret: SESS_SECRET,
        //     resave: false,
        //     saveUninitialized: false,
        //     cookie: {
        //         maxAge: parseInt(SESS_LIFETIME),
        //         sameSite: true,
        //         secure: IN_PROD
        //     }
        // }))


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


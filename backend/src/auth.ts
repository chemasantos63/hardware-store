import { AuthenticationError } from "apollo-server-core"
import { sign } from "jsonwebtoken"
import {
    ACCESS_TOKEN_COOKIE_NAME, ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_SECRET
} from "./config"
import { User } from "./models"
import { Request,Response } from "express"

export const attemptSignIn = async (email: string, password: string) => {
    const message: string = "Incorrect email or password. Please try again."
    const user = await User.findOne({ email })

    if (!user) {
        throw new AuthenticationError(message)
    }

    if (!await user.matchesPassword(password)) {
        throw new AuthenticationError(message)
    }

    return user

}

const signedIn = (req:Request) => req.userId

const createToken = (req: Request, res: Response, cookieName: string, tokenName: any,
    expire: number, { userId, expiresIn, secret, count }) => {

    const token = sign({ userId, count }, secret, { expiresIn })

    req[tokenName] = token

    res.cookie(cookieName, token, { expire })

    return token
}

export const ensureSignedIn = (req:Request) => {
    if (!signedIn(req)) {
        throw new AuthenticationError("You must be signed in.")
    }
}

export const ensureSignedOut = (req:Request) => {
    if (signedIn(req)) {
        throw new AuthenticationError("You are already signed in.")
    }
}

export const signOut = async (req:Request, res:Response) => {

    try {

        // res.clearCookie(REFRESH_TOKEN_COOKIE_NAME)

        res.clearCookie(ACCESS_TOKEN_COOKIE_NAME)

        let user = await User.findOne({ _id: req.userId })

        if (!user) { return false }

        user.tokenCount += 1

        const update = {
            "$set": {
                "username": user.name,
                "tokenCount": user.tokenCount
            }
        }

        const query = {
            "email": user.email
        }

        await User.updateOne(query, update)

    } catch (e) {
        console.log(e);
        return false

    }

    return true
}

export const createAccessToken = (req:Request, res:Response, { userId }) => {

    return createToken(req, res, ACCESS_TOKEN_COOKIE_NAME, "accessToken", 60 * 15, {
        userId,
        expiresIn: "10h",
        secret: ACCESS_TOKEN_SECRET,
        count: 0
    })
}

export const createRefreshToken = (req:Request, res:Response, { userId, count }) => {

    createToken(req, res, REFRESH_TOKEN_COOKIE_NAME, "refreshToken", 60 * 60 * 24 * 7, {
        userId,
        expiresIn: "7d",
        secret: REFRESH_TOKEN_SECRET,
        count
    })
}

export const isNotValidateToken = async (userId, count) => {

    const user = await User.findOne({ _id: userId })

    return !user || user.tokenCount !== count
}
import { Document, Model } from "mongoose"

export interface UserDocument extends Document {
    name: string,
    email: string,
    username: string,
    password: string,
    matchesPassword: (password: string) => Promise<boolean>,
    tokenCount: number
}

interface UserQueryHelpers {
    none: () => Promise<boolean>
}

export interface UserModel extends Model<UserDocument, UserQueryHelpers> {
    hash: (password: string) => Promise<string>
}
import { compare, hash } from "bcryptjs"
import { model, Schema, DocumentQuery } from "mongoose"
import { UserDocument, UserModel } from "../types"

const userSchema = new Schema({
    email: {
        type: String,
        validate: [
            //@ts-ignore
            (email: string): boolean => User.where("email", email).none(),
            "Email is already taken."
        ]
    },
    username: {
        type: String,
        validate: [
            //@ts-ignore
            (username:string):boolean => User.where("username",username).none(),
            "Username is already taken."
        ]
    },
    name: {
        type:String,
        required:true,
        maxlength:100,
        trim:true
    },
    password: String,
    tokenCount: {
        type: Number,
        default: 0
    }
}, {
        timestamps: true
    })

userSchema.pre<UserDocument>("save", async function () {
    if (this.isModified("password")) {
        this.password = await User.hash(this.password)
    }
})

userSchema.query.none = async function (
    this: DocumentQuery<any, UserDocument>
): Promise<boolean> {
    return (await this.countDocuments()) === 0
}

userSchema.statics.hash = (password: string): Promise<string> =>
    hash(password, 10)

userSchema.methods.matchesPassword = function (this: UserDocument,
    password: string): Promise<boolean> {
    return compare(password, this.password)
}

const User: UserModel = model<UserDocument, UserModel>("User", userSchema)

export default User
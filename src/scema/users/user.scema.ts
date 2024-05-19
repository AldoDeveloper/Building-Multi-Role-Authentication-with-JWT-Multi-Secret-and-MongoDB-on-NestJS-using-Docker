import { Schema, QueryWithHelpers, HydratedDocument } from "mongoose";
import { IQueryUserHelper, IUserAccount, IUserMethode, RolesAccount, TUserModelhType } from "./users.interace";

export const UserScemaName = "UserScema";

export const UserScema = new Schema<IUserAccount, TUserModelhType, IUserMethode, IQueryUserHelper>({
    
    first_name: { type: String, required: true },
    last_name : { type: String, required: true },
    email     : { type: String, required: true, unique: true },
    password  : { type: String, required: true },
    status    : { type: Boolean, default: () => false },
    account_verified_at : { type: Date, default: () => null },
    roles     : [{ type: String, default: () => RolesAccount.OWNER}],
    created_at: {  type: Date,   default: () => Date.now() },
    updated_at: {  type: Date,   default: () => Date.now() }

}, {
    query:{
        findOneRoleAdmin(this: QueryWithHelpers<any, HydratedDocument<IUserAccount>, IQueryUserHelper>, emailOrId) {
            return this
                .find({roles: {$in: [RolesAccount.ADMIN]}})
                .findOne({$or: [{email: emailOrId, _id: emailOrId }]})
        },
    }
})
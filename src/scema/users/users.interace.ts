import { HydratedDocument, Model, QueryWithHelpers } from "mongoose";

export enum RolesAccount{
    ADMIN="admin",
    OWNER="owner"
}

export interface IUserAccount{
    first_name : String | string | null;
    last_name  : String | string | null;
    email      : String | string | null;
    password   : String | string | null;
    status     : Boolean| null;
    account_verified_at : Date | number | null;
    roles      : Array<RolesAccount>,
    created_at : Date | Number | null;
    updated_at : Date | Number | null;
}

export interface IDtoUser extends IUserAccount{
    repeat_password : String | string | null
}

export interface IUserMethode{

}

export interface IUserMethodStatic{

}

export interface IQueryUserHelper{
    findOneRoleAdmin(email: string) : QueryWithHelpers<Array<HydratedDocument<IUserAccount>> | HydratedDocument<IUserAccount>, HydratedDocument<IUserAccount>, IQueryUserHelper>
}

export type TUserModelhType = IUserMethodStatic & Model<IUserAccount, IQueryUserHelper, IUserMethode>
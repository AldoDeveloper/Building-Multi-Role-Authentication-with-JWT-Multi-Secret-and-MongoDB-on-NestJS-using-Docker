import { Request } from 'express'
import { RolesAccount } from 'src/scema/users/users.interace';

export type RequestAuthJwt = Request & {
    user : any
}

export type ProviderJwtAccount = {
    id : any;
    first_name : String;
    last_name  : String;
    email      : String;
    account_verified_at : Date | null | number;
    status : boolean | Boolean;
    roles  : Array<RolesAccount>
}
import { BadRequestException, Injectable } from "@nestjs/common";
import { IDtoUser, IUserAccount, RolesAccount } from "src/scema/users/users.interace";
import UserScemaService from "src/scema/users/users.service";
import { compare, hash } from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { TDtoLogin } from "./admin.type";
import { ConfigService } from "@nestjs/config";
import ResponseOK from "src/serialization/serial.class";
import { ProviderJwtAccount } from "src/types/type";
export const SALT_AROUND_PASS = 10;

@Injectable({})
export default class AdminService{
    public constructor(
        protected readonly userServiceModel: UserScemaService,
        protected readonly jwt: JwtService,
        protected readonly config: ConfigService){}
    
    public async signupAdmin(dto : IDtoUser) : Promise<ResponseOK> {
        try{
            const bodyCreated : IDtoUser = {
                ...dto,
                roles    : [RolesAccount.ADMIN],
                password : await hash(dto.password as string, SALT_AROUND_PASS)
            };
            const userAccount = await this.userServiceModel.create(bodyCreated);
            return new ResponseOK({
                status: 201,
                message: "create account success",
                data:{
                    first_name: userAccount.first_name,
                    last_name : userAccount.last_name,
                    email: userAccount.email,
                    roles : userAccount.roles,
                }
            })
        }catch(err){
            throw new BadRequestException(err.message)
        }
    }

    public async signInAdmin(dto: TDtoLogin) : Promise<ResponseOK> {
        try{
            const userByEmail   = await this.userServiceModel.findOneByEmail(dto.email);
            if(userByEmail){
                const rolePermision = userByEmail.roles.find((value) => value === RolesAccount.ADMIN);
                const checkPass     = await compare(dto.password, userByEmail.password as string);

                if(!rolePermision) throw new BadRequestException("role not permision!");
                
                if(checkPass){
                    const tokenAccess = await this.jwt.signAsync({...this.payloadJwtAdmin(userByEmail)}, {
                        secret: this.config.get<string>('JWT.ADMIN.SECRET')
                    });
                    return new ResponseOK({
                        status: 201,
                        message: "login success",
                        data: { tokenAccess }
                    });
                }
                throw new BadRequestException('pasword is wrong');
            }
            throw new BadRequestException('user not found');
        }catch(err){
            throw new BadRequestException(err.message)
        }
    }

    private payloadJwtAdmin(data: IUserAccount & { _id: any }) : ProviderJwtAccount {
        return{
            id : data._id,
            first_name: data.first_name,
            last_name : data.last_name,
            email: data.email,
            account_verified_at: data.account_verified_at,
            status : data.status,
            roles : data.roles
        }
    }

    public async removeAll() {
        return await this.userServiceModel.removeAll();
    }
}
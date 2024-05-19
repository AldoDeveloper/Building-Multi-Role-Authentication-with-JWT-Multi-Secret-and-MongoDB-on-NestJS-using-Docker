import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import UserScemaService from "src/scema/users/users.service";
import { TDtoLogin } from "../admin/admin.type";
import { IDtoUser, IUserAccount, RolesAccount } from "src/scema/users/users.interace";
import { compare, hash } from "bcrypt";
import ResponseOK from "src/serialization/serial.class";
import { ProviderJwtAccount } from "src/types/type";

export const SALT_AROUND_PASS_OWNER = 10;

@Injectable({})
export default class OwnerService{
    public constructor(
        protected readonly userScemaService: UserScemaService,
        protected readonly jwt   : JwtService,
        protected readonly config: ConfigService,
    ){}

    public async signUpSeller(dto: IDtoUser) {
        try{
            const bodyCreated: IDtoUser = {
                ...dto,
                roles:[RolesAccount.OWNER],
                password: await hash(dto.password as string, SALT_AROUND_PASS_OWNER),
            }
            const createdOwnerAccount = await this.userScemaService.create(bodyCreated);
            return new ResponseOK({
                status : 201,
                message: "account owner is created",
                data: {
                    first_name: createdOwnerAccount.first_name,
                    last_name : createdOwnerAccount.last_name,
                    email     : createdOwnerAccount.email,
                    roles     : createdOwnerAccount.roles,
                }
            });
        }catch(err){
             throw new BadRequestException(err.message)
        }
    }

    public async signInOwner(dto: TDtoLogin) : Promise<ResponseOK> {
        try{
            const userByEmail = await this.userScemaService.findOneByEmail(dto.email);
            if(userByEmail){
                const rolePermision = userByEmail.roles.find((value) => value === RolesAccount.OWNER);
                const checkPass     = await compare(dto.password, userByEmail.password as string);
                if(!rolePermision) throw new BadRequestException("role not permision!")
                if(checkPass){
                    const tokenAccess = await this.jwt.signAsync({...this.payloadJwtOwner(userByEmail.toObject())}, {
                        secret: this.config.get<string>('JWT.OWNER.SECRET')
                    });
                    return new ResponseOK({
                        status: 201,
                        message: "login owner success",
                        data: { tokenAccess }
                    })
                }
                throw new BadRequestException('pasword is wrong');
            }
            throw new BadRequestException('user not found');
        }catch(err){
            throw new BadRequestException(err.message);
        }
    }

    private payloadJwtOwner(data : IUserAccount & {_id: any}) : ProviderJwtAccount {
        return{
            id        : data._id,
            first_name: data.first_name,
            last_name : data.last_name,
            email     : data.email,
            account_verified_at: data.account_verified_at,
            status    : data.status,
            roles     : data.roles
        }
    }
}
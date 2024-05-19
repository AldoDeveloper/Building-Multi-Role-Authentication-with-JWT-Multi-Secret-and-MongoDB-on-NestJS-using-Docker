import { Bind, Body, Controller, Get, HttpCode, HttpStatus, Post, UsePipes } from "@nestjs/common";
import OwnerService from "./owner.service";
import { NotAutOwner, Role, User } from "src/decorators/helpers.decorators";
import { PipesValidationObject } from "src/pipes/pipes.validation";
import { ScemaValidationDtoIUserLogin, ScemaValidationDtoIUserRegister } from "src/validation/scema.validation";
import { TDtoLogin } from "../admin/admin.type";
import { IDtoUser, IUserAccount, RolesAccount } from "src/scema/users/users.interace";
import ResponseOK from "src/serialization/serial.class";

@Controller({version: '1'})
@Role(RolesAccount.OWNER)
export default class OwnerController{

    public constructor(protected readonly ownerService: OwnerService){}

    @Post('sign-in')
    @NotAutOwner(true)
    @HttpCode(HttpStatus.OK)
    @Bind(Body())
    @UsePipes(new PipesValidationObject(ScemaValidationDtoIUserLogin))
    public async signInOwner(dtoLogin: TDtoLogin) {
        return await this.ownerService.signInOwner(dtoLogin);
    }

    @Post('sign-up')
    @NotAutOwner(true)
    @HttpCode(HttpStatus.OK)
    @Bind(Body())
    @UsePipes(new PipesValidationObject(ScemaValidationDtoIUserRegister))
    public async signUpOwner(dtoRegister: IDtoUser) {
        return await this.ownerService.signUpSeller(dtoRegister)
    }

    @Get('protected-get')
    public async protectedOwner(@User() user: IUserAccount) {
        return new ResponseOK({
            status: 200,
            message: "auth jwt seller success",
            data : {...user}
        })
    }
}
import { Bind, Body, Controller, Get, HttpCode, HttpStatus, Post, UsePipes } from "@nestjs/common";
import { NotAutAdmin, Role, User } from "src/decorators/helpers.decorators";
import { PipesValidationObject } from "src/pipes/pipes.validation";
import { IDtoUser, IUserAccount, RolesAccount } from "src/scema/users/users.interace";
import { ScemaValidationDtoIUserLogin, ScemaValidationDtoIUserRegister } from "src/validation/scema.validation";
import { TDtoLogin } from "./admin.type";
import AdminService from "./admin.service";
import ResponseOK from "src/serialization/serial.class";

@Controller({version: '1'})
@Role(RolesAccount.ADMIN)

export default class AdminController{

    public constructor(protected readonly adminService: AdminService){}
   
    @Post('sign-in')
    @NotAutAdmin(true)
    @HttpCode(HttpStatus.CREATED)
    @Bind(Body())
    @UsePipes(new PipesValidationObject(ScemaValidationDtoIUserLogin))
    public async signInAdmin(dtoLogin: TDtoLogin) {
        return await this.adminService.signInAdmin(dtoLogin)
    }

    @Post('sign-up')
    @NotAutAdmin(true)
    @HttpCode(HttpStatus.CREATED)
    @Bind(Body())
    @UsePipes(new PipesValidationObject(ScemaValidationDtoIUserRegister))
    public async signUpAdmin(dto: IDtoUser) {
        return await this.adminService.signupAdmin(dto)
    }

    @Get('protected-get')
    @HttpCode(HttpStatus.OK)
    public async protectedAdmin(@User() user: IUserAccount) {
        return new ResponseOK({
            status: 200,
            message: "auth jwt admin success",
            data: { ...user }
        })
    }
}
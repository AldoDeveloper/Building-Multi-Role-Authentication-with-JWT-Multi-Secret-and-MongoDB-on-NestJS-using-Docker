import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesAccount } from "src/scema/users/users.interace";
import { RequestAuthJwt } from "src/types/type";

export const NOT_AUTH_ADMIN = "NOT_AUTH_ADMIN";
export const NotAutAdmin = (status: boolean = true) => SetMetadata(NOT_AUTH_ADMIN, status);

export const NOT_AUTH_OWNER = "NOT_AUTH_OWNER";
export const NotAutOwner = (status: boolean = true) => SetMetadata(NOT_AUTH_OWNER, status);

export const Role = Reflector.createDecorator<RolesAccount>();

export const User = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const res = context.switchToHttp().getRequest<RequestAuthJwt>();
    return res.user ? res.user : undefined;
})
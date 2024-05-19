import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { NOT_AUTH_ADMIN, NOT_AUTH_OWNER, Role } from "src/decorators/helpers.decorators";
import { RolesAccount } from "src/scema/users/users.interace";
import { ProviderJwtAccount, RequestAuthJwt } from "src/types/type";
import { Request } from 'express';

@Injectable({})
export default class AuthGuard implements CanActivate{

    public constructor(
        protected readonly jwt      : JwtService, 
        protected readonly reflactor: Reflector,
        protected readonly config   : ConfigService){}

    public async canActivate(context: ExecutionContext) : Promise<boolean> {
        const req = context.switchToHttp().getRequest<RequestAuthJwt>();
        
        const ROLE_PERMISION  = this.reflactor.getAllAndOverride(Role, [context.getHandler(), context.getClass()]);
        const authorizedAdmin = this.reflactor.getAllAndOverride(NOT_AUTH_ADMIN, [context.getHandler(), context.getClass()])
        const authorizedOwner = this.reflactor.getAllAndOverride(NOT_AUTH_OWNER, [context.getHandler(), context.getClass()])
        
        if(req.url.indexOf('admin') !== -1){
            return await this.prefixAdminPath({authorizedAdmin, req, role: ROLE_PERMISION});
        }

        if(req.url.indexOf('owner') !== -1){
            return await this.prefixOwnerPath({authorizedOwner, req, role: ROLE_PERMISION})
        }

        return true
    }

    private async prefixAdminPath({ authorizedAdmin, req, role } : { authorizedAdmin : boolean, req: RequestAuthJwt, role: RolesAccount }) {
        
        const token = this.extractTokenFromHeader(req);
        if(authorizedAdmin) return true;
        if(!token) throw new UnauthorizedException();

        if(!authorizedAdmin){
            if(token){
                try{
                    const payload = await this.payloadToken(token, 'JWT.ADMIN.SECRET');
                    if(payload.roles.find((value: any) => value === role)) req.user = payload;
                    else throw new UnauthorizedException()
                    
                }catch(err){
                    throw new UnauthorizedException(err.message);
                }
            }
            return true;
        }
    }

    private async prefixOwnerPath({ authorizedOwner, req, role } : { authorizedOwner : boolean, req: RequestAuthJwt, role: RolesAccount }) {
        const token = this.extractTokenFromHeader(req);
        if(authorizedOwner) return true;
        if(!token) throw new UnauthorizedException();
        if(!authorizedOwner){
            if(token){
                try{
                    const payload = await this.payloadToken(token, 'JWT.OWNER.SECRET');
                    if(payload.roles.find((value: any) => value === role)) req.user = payload;
                    else throw new UnauthorizedException()
                    
                }catch(err){
                    throw new UnauthorizedException(err.message);
                }
            }
            return true;
        }
    }

    private async payloadToken(token: string, envPath: string) : Promise<ProviderJwtAccount>{
        return await this.jwt.verifyAsync<ProviderJwtAccount>(token, {
            secret: this.config.get<string>(envPath)
        })
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
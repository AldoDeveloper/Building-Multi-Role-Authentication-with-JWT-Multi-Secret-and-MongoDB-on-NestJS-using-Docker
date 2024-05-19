import { Module } from "@nestjs/common";
import AdminService from "./admin.service";
import AdminController from "./admin.controller";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports:[
        JwtModule.registerAsync({
            imports:[ConfigModule],
            inject: [ConfigService],
            useFactory: async(config: ConfigService) => {
                return{
                    global: false,
                    secret: config.get<string>('JWT.ADMIN.SECRET'),
                    signOptions: {
                         expiresIn: config.get<string>('JWT.ADMIN.EXPIRES')
                    }
                }
            }
        })
    ],
    providers:[AdminService],
    controllers:[AdminController]
})
export default class AdminModule{

}
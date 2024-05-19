import { Module } from "@nestjs/common";
import OwnerService from "./owner.service";
import OwnerController from "./owner.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config/dist/config.module";
import { ConfigService } from "@nestjs/config/dist/config.service";

@Module({
    imports:[
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject : [ConfigService],
            useFactory: async(config: ConfigService) => {
                return{
                    global : false,
                    secret : config.get<string>('JWT.OWNER.SECRET'),
                    signOptions: {
                         expiresIn: config.get<string>('JWT.OWNER.EXPIRES')
                    }
                }
            }
        })
    ],
    providers: [OwnerService],
    controllers: [OwnerController],
    exports: [OwnerService]
})

export default class OwnerModule{}
import { DynamicModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserScema, UserScemaName } from "./users/user.scema";
import { RegisterScema } from "./register.scema.service";

export interface ScemaOption{
    isGlobal: boolean
}

@Module({})
export default class ScemaModule{
    public static register(options: Partial<ScemaOption>) : DynamicModule {
        return{
            module: ScemaModule,
            global: options.isGlobal,
            imports:[
                MongooseModule.forFeatureAsync([
                    {
                        name: UserScemaName,
                        useFactory : async() =>{
                            const scema = UserScema;
                            return scema;
                        }
                    }
                ])
            ],
            providers:[...RegisterScema],
            exports:[...RegisterScema]
        }
    }
}
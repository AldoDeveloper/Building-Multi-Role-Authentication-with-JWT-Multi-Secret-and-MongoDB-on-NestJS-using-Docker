import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from './config/config';
import ApiModule from './api/api.module';
import { MongooseModule } from '@nestjs/mongoose';
import ScemaModule from './scema/scema.module';
import { APP_GUARD } from '@nestjs/core';
import AuthGuard from './guard/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ApiModule,

    MongooseModule.forRootAsync({
       imports:[ConfigModule],
       inject: [ConfigService],
       useFactory: async (config: ConfigService) => {
         return{
          uri: config.get<string>('MONGODB.URL'),
          dbName: config.get<string>('MONGODB.DB_NAME')
         }
       }
    }),

    ConfigModule.forRoot({
      isGlobal : true,
      envFilePath: `${process.cwd()}/env/${process.env.NODE_ENV}.env`,
      load: [config]
    }),

    ScemaModule.register({isGlobal: true})
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    JwtService,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
})
export class AppModule implements OnModuleInit {
  public constructor(private readonly config: ConfigService){}
  public async onModuleInit() {
     
    console.log(this.config.get<string>("MONGODB.URL"))
  }
}

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserScemaName } from "./user.scema";
import { IUserAccount, TUserModelhType } from "./users.interace";

@Injectable({})
export default class UserScemaService{
    public constructor(@InjectModel(UserScemaName) protected readonly scemaModel: TUserModelhType){

    }

    public async create(userAccount: Partial<IUserAccount>) {
        const createdUser = new this.scemaModel(userAccount);
        return await createdUser.save();
    }

    public async findOneAdmin(email: string) {
        return this.scemaModel.find().findOneRoleAdmin(email).exec();
    }

    public async findOneByEmail(email: string){
        return await this.scemaModel.findOne({ email }).exec();
    }

    public async removeAll() {
        return await this.scemaModel.deleteMany();
    }
}
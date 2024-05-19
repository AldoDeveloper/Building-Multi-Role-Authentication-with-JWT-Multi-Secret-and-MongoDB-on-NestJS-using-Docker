
import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import * as Joi from "joi";

@Injectable({})
export class PipesValidationObject implements PipeTransform{

    public constructor(private readonly joiObject: Joi.ObjectSchema){}
    public async transform(value: any, metadata: ArgumentMetadata) {
        try{
            const valueJoi = await this.joiObject.validateAsync(value);
            return valueJoi;
        }catch(err){
            throw new BadRequestException(err.message)
        }
    }
}
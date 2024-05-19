import { classToPlain } from "class-transformer";
import { PropsAttrResOK, SerializationResOK } from "./serial.success";

export default class ResponseOK{
    public constructor(partial: Partial<PropsAttrResOK>){
        Object.assign(this, classToPlain(new SerializationResOK(partial)))
    }   
}
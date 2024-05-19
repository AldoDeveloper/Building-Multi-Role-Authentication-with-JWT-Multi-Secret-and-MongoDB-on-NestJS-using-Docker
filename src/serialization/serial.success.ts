import { Exclude, Expose } from "class-transformer";

export interface PropsAttrResOK {
    status  : number;
    message : string;
    data    : any
}

export class SerializationResOK implements PropsAttrResOK{

    @Exclude()
    status: number;

    @Exclude()
    message: string;

    @Exclude()
    data: any;

    public constructor(partial: Partial<PropsAttrResOK>){
        Object.assign(this, partial)
    }

    @Expose({name: 'statusCode'})
    public statusCode() : number {
        return this.status ? this.status : 200;
    }

    @Expose({name: "message"})
    public messages() : string{
        return this.message ? this.message : "Request Success"
    }

    @Expose({name: 'error'})
    public error() : boolean{
        return this.status >= 400 ? true : false;
    }

    @Expose({name: 'data'})
    public dataOk() {
        return this.data ? this.data : undefined
    }
}
import * as Joi from "joi";
import { TDtoLogin } from "src/api/admin/admin.type";
import { IDtoUser, RolesAccount } from "src/scema/users/users.interace";

export const ScemaValidationDtoIUserRegister = Joi.object<IDtoUser>({
    first_name : Joi.string().required(),
    last_name  : Joi.string().required(),
    email      : Joi.string().required().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net', 'id'] },
    }),
    password   : 
        Joi.string() 
        .required()
        .pattern(new RegExp(`^[a-zA-Z0-9]{3,30}$`))
        .min(8)
        .max(16),
    repeat_password : Joi.ref('password'),
    status          : Joi.boolean().default(true),
    roles           : Joi.array().items(Joi.string().valid(RolesAccount.ADMIN, RolesAccount.OWNER))

});

export const ScemaValidationDtoIUserLogin = Joi.object<TDtoLogin>({
    email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ['com', 'net', 'id'],
      },
    }),
   password: Joi.string().required(),
})

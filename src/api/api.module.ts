import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import AdminModule from "./admin/admin.module";
import OwnerModule from "./owner/owner.module";

@Module({
    imports: [
        AdminModule,
        OwnerModule,
        RouterModule.register([
            {
                path  : 'admin',
                module: AdminModule
            },
            {
                path: 'owner',
                module: OwnerModule
            }
        ])
    ]
})

export default class ApiModule{}

export const config = () => ({

    SERVER:{
        PORT : process.env.PORT_SERVER
    },
    
    MONGODB:{
        URL: process.env.MONGODB_URL,
        DB_NAME: process.env.MONGODB_DN_NAME
    },
    
    JWT :{

        ADMIN: {
            SECRET : process.env.JWT_ADMIN_SECRET,
            EXPIRES: process.env.JWT_ADMIN_EXPIRE
        },

        OWNER:{
            SECRET : process.env.JWT_OWNER_SECRET,
            EXPIRES: process.env.JWT_OWNER_EXPIRE
        }
    }
})
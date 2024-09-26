import { Context } from "hono"
import { Users, UsersInformation } from "../../types/user"
import { findUserByUserPassword } from "../../db/users"
import crypto from "crypto"
import { JWTRegister, register } from "../jwtauth"
import { setCookie } from "hono/cookie"

export async function SignIn(c: Context) {
    try{
        const { data } = await c.req.json()
        const user: Users[] = await findUserByUserPassword(<string>data.username, crypto.createHash("sha256").update(<string>data.password).digest("hex"))
        
        if(user.length > 0){
            const jwt: JWTRegister = await register(<Users>{
                _id: user[0]._id,
                username: user[0].username,
                role: user[0].role,
                information: <UsersInformation>{
                    fullname: user[0].information.fullname,
                    email: user[0].information.email,
                    phone: user[0].information.phone,
                    avatar: user[0].information.phone
                }
            })
    
            if(jwt.error != null){
                c.status(500)
                return c.json({
                    status: "JWT_AUTH_ERROR",
                    message: jwt.error
                })
            }
    
            setCookie(c, "jwt", jwt.encoded, {
                httpOnly: true
            })
    
            return c.json({
                status: "OK"
            })
        }
        else{
            c.status(500)
            return c.json({
                status: "FAIL",
                message: "Username or password invalid"
            })
        }
    }
    catch (e: unknown){
        c.status(500)
        return c.json({
            status: "OK",
            message: (e as Error).message
        })
    }
}
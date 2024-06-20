import { Context, Hono } from "hono"
import { setCookie, deleteCookie, getCookie } from "hono/cookie";
import { findUserById, findUserByUserPassword } from "../db/users";
import { Users, UsersInformation } from "../types/user";
import { JWTRegister, JWTVerify, register, verify } from "./jwtauth"
import crypto from "crypto"

export const auth: Hono = new Hono();

auth.get("/find/:id", async (c: Context) => {
    const user: Users[] = await findUserById(c.req.param("id"))

    return c.json(user)
})

auth.get("/", async (c: Context) => {
    const jwt: string = <string>getCookie(c, "jwt");
    const credential: JWTVerify = await verify(jwt);
    if(credential.error != null){
        c.status(500)
        return c.json({
            status: "FAIL"
        })
    }

    return c.json({
        status: "OK",
        data: credential.result
    })
})

auth.post("/", async (c: Context) => {
    try{
        const { username, password } = await c.req.json()
        const user: Users[] = await findUserByUserPassword(<string>username, crypto.createHash("sha256").update(<string>password).digest("hex"))
        
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
            return c.json({
                status: "FAIL"
            })
        }
    }
    catch{
        return c.json({
            status: "FAIL"
        })
    }
})

auth.delete("/", async (c: Context) => {
    try{
        deleteCookie(c, "jwt");
        return c.json({
            status: "OK"
        })
    }
    catch(e){
        return c.json({
            status: "FAIL"
        })
    }
})

auth.get("/signout", async (c: Context) => {
    try{
        deleteCookie(c, "jwt");
        return c.json({
            status: "OK"
        })
    }
    catch(e){
        return c.json({
            status: "FAIL"
        })
    }
})
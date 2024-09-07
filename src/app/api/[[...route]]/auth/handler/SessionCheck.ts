import { Context } from "hono";
import { JWTVerify, verify } from "../jwtauth";
import { getCookie } from "hono/cookie";

export async function SessionCheck(c: Context){
    try{
        const jwt: string = <string>getCookie(c, "jwt");
        const credential: JWTVerify = await verify(jwt);
        if(credential.error != null){
            c.status(500)
            return c.json({
                status: "OK",
                message: "Invalid Cridential"
            })
        }

        return c.json({
            status: "OK",
            data: credential.result
        })
    }
    catch(e: unknown){
        c.status(500)
        return c.json({
            status: "OK",
            message: (e as Error).message
        })
    }
}
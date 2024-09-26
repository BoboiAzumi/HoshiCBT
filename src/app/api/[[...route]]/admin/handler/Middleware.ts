import { Context } from "hono"
import { getCookie } from "hono/cookie"
import { JWTVerify, verify } from "../../auth/jwtauth"

export async function SessionVerify (c: Context, next: Function){
    const jwt: string = <string>getCookie(c, "jwt")
    const encoded: JWTVerify = await verify(jwt)

    if(encoded.error != null){
        c.status(500)
        return c.json({
            status: "FAIL",
            message: encoded.error
        })
    }

    if(encoded.result.role != "admin"){
        c.status(500)
        return c.json({
            status: "FORBIDDEN"
        })
    }

    c.set("encoded", encoded)
    await next()
}
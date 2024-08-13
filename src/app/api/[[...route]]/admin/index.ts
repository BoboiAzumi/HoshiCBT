import { Context, Hono } from "hono"
import { authentication } from "../auth/middleware"
import { JWTVerify, verify } from "../auth/jwtauth"
import { getCookie } from "hono/cookie"
import { upload } from "../upload"

export const Admin = new Hono()

Admin.use(authentication)
Admin.use(async (c: Context, next: Function) => {
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
})

Admin.post("/uploads", upload)

Admin.post("/", async (c: Context) => {
    try{
        const { method } = await c.req.json()

        if(!(method instanceof String)) return c.json({
            status: "FAIL"
        })

        switch(method.toUpperCase()){
            case "ADD_ADMIN":
                break
            case "ADD_INSTRUCTOR":
                break
            case "ADD_USER":
                break
            case "DELETE_ADMIN":
                break
            case "DELETE_INSTRUCTOR":
                break
            case "DELETE_USER":
                break
            default:
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
import { Context, Hono } from "hono"
import { authentication } from "../auth/middleware"
import { JWTVerify, verify } from "../auth/jwtauth"
import { getCookie } from "hono/cookie"
import { upload } from "../upload"
import { addUser, deleteUser, findAdmin, findInstructor, findUser, updateUser } from "../db/users"
import { Users } from "../types/user"

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
        const { method, data } = await c.req.json()

        if(!(typeof method == "string")) return c.json({
            status: "FAIL"
        })

        let ftc : Users[];

        switch(method.toUpperCase()){
            case "ADD_ADMIN":
                await addUser({
                    ...data,
                    role: "admin"
                })

                return c.json({
                    status: "OK"
                })
            case "ADD_INSTRUCTOR":
                await addUser({
                    ...data,
                    role: "instructor"
                })

                return c.json({
                    status: "OK"
                })
            case "ADD_USER":
                await addUser({
                    ...data,
                    role: "user"
                })

                return c.json({
                    status: "OK"
                })
            case "DELETE":
                await deleteUser(data ? data.id ? data.id : "0" : "0")

                return c.json({
                    status: "OK"
                })
            
            case "MODIFY":
                if(data == undefined || data._id == undefined) return c.json({
                    status: "FAIL"
                })

                await updateUser(data ? data : {} as Users)
                
                return c.json({
                    status: "OK"
                })
            case "GET_ADMIN":
                ftc = await findAdmin(data ? data.q ? data.q : "" : "")
                return c.json({
                    status: "OK",
                    data: ftc
                })
            case "GET_INSTRUCTOR":
                ftc = await findInstructor(data ? data.q ? data.q : "" : "")
                return c.json({
                    status: "OK",
                    data: ftc
                })
            case "GET_USER":
                ftc = await findUser(data ? data.q ? data.q : "" : "")
                return c.json({
                    status: "OK",
                    data: ftc
                })
            default:
                return c.json({
                    status: "FAIL"
                })
        }
    }
    catch(e: any){
        return c.json({
            status: "FAIL",
            message: e.message
        })
    }
})
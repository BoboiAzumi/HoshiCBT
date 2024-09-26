import { Context } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "../../auth/jwtauth";
import { insertClass } from "../../db/class";

export async function CreateClassroom(c: Context) {
    try{
        const { data } = await c.req.json();
        const cookie = await verify(<string>getCookie(c, "jwt"))
        const post = await insertClass(data.class_name, data.is_public, cookie.result._id)
        if(!post) {
            return c.json({
                status: "EXIST"
            })
        }
        else{
            return c.json({
                status: "OK"
            })
        }
    }
    catch{
        return c.json({
            status: "FAIL"
        })
    }
}
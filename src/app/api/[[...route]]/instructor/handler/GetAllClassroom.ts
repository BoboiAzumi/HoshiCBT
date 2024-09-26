import { Context } from "hono"
import { getCookie } from "hono/cookie"
import { verify } from "../../auth/jwtauth"
import { findClassByInstructorId } from "../../db/class"

export async function GetAllClassroom (c: Context) {
    try{
        const cookie = await verify(<string>getCookie(c, "jwt"))
        return c.json({
            status: "OK",
            data: await findClassByInstructorId(cookie.result._id)
        })
    }
    catch{
        return c.json({
            status: "FAIL"
        })
    }
}
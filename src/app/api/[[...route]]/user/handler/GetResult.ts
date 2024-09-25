import { Context } from "hono"
import { getCookie } from "hono/cookie"
import { verify } from "../../auth/jwtauth"
import { getResultTest } from "../../db/exam"

export async function GetResult (c: Context) {
    const { data } = await c.req.json()
    const cookie = await verify(<string>getCookie(c, "jwt"))
    const exam = await getResultTest(data.class_id, data.exam_id, cookie.result._id)
    
    return c.json({
        status: "OK",
        data: exam
    })
}
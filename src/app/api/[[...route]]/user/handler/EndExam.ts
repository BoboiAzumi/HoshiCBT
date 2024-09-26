import { Context } from "hono"
import { getCookie } from "hono/cookie"
import { verify } from "../../auth/jwtauth"
import { endQuestions } from "../../db/exam"

export async function EndExam (c: Context)  {
    const { data } = await c.req.json()
    const cookie = await verify(<string>getCookie(c, "jwt"))
    await endQuestions(data.class_id, data.exam_id, cookie.result._id)
    
    return c.json({
        status: "OK"
    })
}
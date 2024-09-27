import { Context } from "hono"
import { verify } from "../../auth/jwtauth"
import { getCookie } from "hono/cookie"
import { examSession } from "../../db/exam"

export async function CreateExamSession (c: Context){
    try{
        const { data } = await c.req.json()
        const cookie = await verify(<string>getCookie(c, "jwt"))
        const exam = await examSession(data.class_id, data.exam_id, cookie.result._id)

        if(!exam){
            return c.json({
                status: "FAIL"
            })  
        }

        return c.json({
            status: "OK",
            data: exam,
        });
    }

    catch(err: unknown){
        return c.json({
            status: "FAIL",
            message: (err as Error).message
        })
    }
}
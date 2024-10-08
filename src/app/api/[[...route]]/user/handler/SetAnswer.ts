import { Context } from "hono"
import { getCookie } from "hono/cookie"
import { verify } from "../../auth/jwtauth"
import { answerQuestion } from "../../db/exam"

export async function SetAnswer (c: Context){
    try{
        const { data } = await c.req.json()
        const cookie = await verify(<string>getCookie(c, "jwt"))
        const setAnswer = await answerQuestion(data.class_id, data.exam_id, cookie.result._id, data.question_index, data.answer)
    
        if(!setAnswer){
            return c.json({
                status: "FAIL",
            })
        }
    
        return c.json({
            status: "OK",
        })
    }
    catch{
        return c.json({
            status: "FAIL",
        });
    }
}
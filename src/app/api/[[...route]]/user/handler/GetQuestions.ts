import { getCookie } from "hono/cookie"
import { verify } from "../../auth/jwtauth"
import { getQuestionByArrayIndex } from "../../db/exam"
import { Context } from "hono"

export async function GetQuestions (c: Context) {
    try{
        const { data } = await c.req.json()
        const cookie = await verify(<string>getCookie(c, "jwt"))
        const getQuestions = await getQuestionByArrayIndex(data.class_id, data.exam_id, cookie.result._id, parseInt(data.index))
        
        if(!getQuestions){
            return c.json({
                status: "FAIL",
            })
        }
        
        return c.json({
            status: "OK",
            data: getQuestions
        })
    }
    catch{
        return c.json({
            status: "FAIL",
        });
    }
}
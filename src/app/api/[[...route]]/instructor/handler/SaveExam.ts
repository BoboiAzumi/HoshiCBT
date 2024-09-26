import { Context } from "hono"
import { Questions } from "../../types/exam"
import { saveExam } from "../../db/exam"

export async function SaveExam (c: Context) {
    try{
        const { data } = await c.req.json()

        await saveExam(data.class_id, data.exam_id, data.exam_name, data.duration, data.questions as Questions[])

        return c.json({
            status: "OK"
        })
    }
    catch(err){
        return c.json({
            status: "FAIL",
        })
    }
}
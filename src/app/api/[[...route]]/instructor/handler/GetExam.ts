import { Context } from "hono"
import { getExam } from "../../db/exam"

export async function GetExam (c: Context) {
    try{
        const { data } = await c.req.json()

        const exam = await getExam(data.class_id, data.exam_id)

        return c.json({
            status: "OK",
            data: exam
        })
    }
    catch(err){
        return c.json({
            status: "FAIL",
        })
    }
}
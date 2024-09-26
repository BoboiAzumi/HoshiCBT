import { Context } from "hono"
import { deleteExam } from "../../db/exam"

export async function DeleteExam(c: Context) {
    try{
        const { data } = await c.req.json()

        await deleteExam(data.class_id, data.exam_id)

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
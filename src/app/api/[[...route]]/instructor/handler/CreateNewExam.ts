import { Context } from "hono"
import { newExam } from "../../db/exam"

export async function CreateNewExam (c: Context) {
    try{
        const { data } = await c.req.json()

        await newExam(data.class_id, data.exam_name)

        return c.json({
            status: "OK"
        })
    }
    catch(err){
        return c.json({
            status: "FAIL",
            message: err
        })
    }
}
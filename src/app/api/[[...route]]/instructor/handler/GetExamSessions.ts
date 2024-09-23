import { Context } from "hono"
import { getAllSessionResult } from "../../db/exam"

export async function GetExamSessions(c: Context) {
    try{
        const { data } = await c.req.json()

        return c.json({
            status: "OK",
            data: await getAllSessionResult(data.class_id, data.exam_id)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL",
        })
    }
}
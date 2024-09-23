import { Context } from "hono"
import { resetSession } from "../../db/exam"

export async function ResetSession (c: Context) {
    try{
        const { data } = await c.req.json()

        await resetSession(data.class_id, data.exam_id)
        
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
import { Context } from "hono"
import { findExamByClassId } from "../../db/exam"

export async function GetExamList (c: Context) {
    try{
        const { data } = await c.req.json()
        const exam = await findExamByClassId(data.id)
    
        return c.json({
            status: "OK",
            data: exam
        })
    }
    catch{
        return c.json({
            status: "FAIL",
        });
    }
}
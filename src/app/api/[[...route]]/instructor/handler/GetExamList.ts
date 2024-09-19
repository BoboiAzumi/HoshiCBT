import { Context } from "hono"
import { getExamList } from "../../db/exam"

export async function GetExamList (c: Context) {
    try{
        const { data } = await c.req.json()
        const exam_list = await getExamList(data.class_id)

        return c.json({
            status: "OK",
            data: exam_list
        })
    }
    catch(err){
        return c.json({
            status: "FAIL",
        })
    }
}
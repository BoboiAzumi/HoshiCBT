import { Context } from "hono";
import { deleteClassById } from "../../db/class";
import { deleteExamByClasId } from "../../db/exam";

export async function DeleteClassroom (c: Context) {
    try{
        const { data } = await c.req.json();

        await deleteClassById(data.class_id)
        await deleteExamByClasId(data.class_id)

        return c.json({
            status: "OK"
        })
    }
    catch(err){
        return c.json({
            status: "FAIL"
        })
    }
}
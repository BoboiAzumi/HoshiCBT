import { Context } from "hono";
import { findClassById } from "../../db/class";

export async function GetClassroomById (c: Context) {
    try{
        const { data } = await c.req.json()
        const class_info = await findClassById(data.class_id);

        return c.json({
            status: "OK",
            data: class_info
        })
    }
    catch{
        return c.json({
            status: "FAIL"
        })
    }
}
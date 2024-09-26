import { Context } from "hono";
import { Classroom } from "../../types/class";
import { updateClassById } from "../../db/class";

export async function UpdateClassroom (c: Context) {
    try{
        const { data } = await c.req.json();

        await updateClassById(<string>data._id, data)

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
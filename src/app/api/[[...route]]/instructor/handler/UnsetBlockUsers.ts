import { Context } from "hono"
import { deleteBlockUser } from "../../db/class"

export async function UnsetBlockUsers (c: Context) {
    try{
        const { data } = await c.req.json()

        return c.json({
            status: "OK",
            data: await deleteBlockUser(data.class_id, data.user_id)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL",
        })
    }
}
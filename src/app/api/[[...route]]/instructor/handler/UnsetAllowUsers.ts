import { Context } from "hono"
import { deleteAllowUser } from "../../db/class"

export async function UnsetAllowUsers (c: Context) {
    try{
        const { data } = await c.req.json()

        return c.json({
            status: "OK",
            data: await deleteAllowUser(data.class_id, data.user_id)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL",
        })
    }
}
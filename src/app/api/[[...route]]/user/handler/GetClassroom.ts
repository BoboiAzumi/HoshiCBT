import { Context } from "hono";
import { findClassByUserId } from "../../db/class";

export async function GetClassroom (c: Context) {
    const classes = await findClassByUserId(await c.get("encoded").result._id);

    return c.json({
        status: "OK",
        data: classes
    })
}
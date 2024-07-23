import { Context, Hono } from "hono"
import { authentication } from "../auth/middleware"
import { JWTVerify, verify } from "../auth/jwtauth"
import { getCookie } from "hono/cookie"
import { deleteClassById, findClassById, findClassByInstructorId, getAllowUser, getAllowUserNotIn, insertClass, updateClassById } from "../db/class"
import { Classes } from "../types/class"
import { deleteExamByClasId } from "../db/exam"

export const Instructor = new Hono()

Instructor.use(authentication)
Instructor.use(async (c: Context, next: Function) => {
    const jwt: string = <string>getCookie(c, "jwt")
    const encoded: JWTVerify = await verify(jwt)

    if(encoded.error != null){
        c.status(500)
        return c.json({
            status: "FAIL",
            message: encoded.error
        })
    }

    if(encoded.result.role != "instructor"){
        c.status(500)
        return c.json({
            status: "FORBIDDEN"
        })
    }

    c.set("encoded", encoded)
    await next()
})

Instructor.get("/", async (c: Context) => {
    return c.json({
        status: "OK",
        data: c.get("encoded")
    })
})

Instructor.get("class", async (c: Context) => {
    try{
        const cookie = await verify(<string>getCookie(c, "jwt"))
        return c.json({
            status: "OK",
            data: await findClassByInstructorId(cookie.result._id)
        })
    }
    catch{
        return c.json({
            status: "FAIL"
        })
    }
})

Instructor.post("class", async(c: Context) => {
    try{
        const { class_name, is_public} = await c.req.json();
        const cookie = await verify(<string>getCookie(c, "jwt"))
        const post = await insertClass(class_name, is_public, cookie.result._id)
        if(!post) {
            return c.json({
                status: "EXIST"
            })
        }
        else{
            return c.json({
                status: "OK"
            })
        }
    }
    catch{
        return c.json({
            status: "FAIL"
        })
    }
})

Instructor.get("class/find/:class_id", async (c: Context) => {
    try{
        const { class_id } = await c.req.param()
        const class_info = await findClassById(class_id);

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
})

Instructor.post("class/update", async (c: Context) => {
    try{
        const class_object: Classes = await c.req.json();

        await updateClassById(class_object._id, class_object)

        return c.json({
            status: "OK"
        })
    }
    catch(err){
        return c.json({
            status: "FAIL"
        })
    }
})

Instructor.delete("class", async (c: Context) => {
    try{
        const { class_id } = await c.req.json();

        await deleteClassById(class_id)
        await deleteExamByClasId(class_id)

        return c.json({
            status: "OK"
        })
    }
    catch(err){
        return c.json({
            status: "FAIL"
        })
    }
})

Instructor.post("class/allow", async (c: Context) => {
    try{
        const { class_id } = await c.req.json();

        return c.json({
            status: "OK",
            data: await getAllowUser(class_id)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL"
        })
    }
})

Instructor.post("class/allow/not_in", async (c: Context) => {
    try{
        const {class_id} = await c.req.json();

        return c.json({
            status: "OK",
            data: await getAllowUserNotIn(class_id)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL"
        })
    }
})
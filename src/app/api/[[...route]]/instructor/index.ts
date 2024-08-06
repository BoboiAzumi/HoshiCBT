import { Context, Hono } from "hono"
import { authentication } from "../auth/middleware"
import { JWTVerify, verify } from "../auth/jwtauth"
import { getCookie } from "hono/cookie"
import { deleteAllowUser, deleteBlockUser, deleteClassById, findClassById, findClassByInstructorId, getAllowUser, getAllowUserNotIn, getBlockUser, getBlockUserNotIn, insertClass, setAllowUser, setBlockUser, updateClassById } from "../db/class"
import { Classroom } from "../types/class"
import { deleteExamByClasId, getExam, getExamList, insertNewAnswer, insertNewAttachment, insertNewQuestion, newExam, saveExam } from "../db/exam"
import { Questions } from "../types/exam"
import { upload } from "../upload"

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

Instructor.post("/uploads", upload)

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
        const { class_id } = c.req.param()
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
        const class_object: Classroom = await c.req.json();

        await updateClassById(<string>class_object._id, class_object)

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
        const { class_id, q } = await c.req.json();

        return c.json({
            status: "OK",
            data: await getAllowUserNotIn(class_id, q)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL"
        })
    }
})

Instructor.post("class/allow/set", async (c: Context) => {
    try{
        const { class_id, user_id } = await c.req.json()

        return c.json({
            status: "OK",
            data: await setAllowUser(class_id, user_id)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL",
        })
    }
})

Instructor.post("class/allow/delete", async (c: Context) => {
    try{
        const { class_id, user_id } = await c.req.json()

        return c.json({
            status: "OK",
            data: await deleteAllowUser(class_id, user_id)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL",
        })
    }
})

// =====

Instructor.post("class/block", async (c: Context) => {
    try{
        const { class_id } = await c.req.json();

        return c.json({
            status: "OK",
            data: await getBlockUser(class_id)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL"
        })
    }
})

Instructor.post("class/block/not_in", async (c: Context) => {
    try{
        const { class_id, q } = await c.req.json();

        return c.json({
            status: "OK",
            data: await getBlockUserNotIn(class_id, q)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL"
        })
    }
})

Instructor.post("class/block/set", async (c: Context) => {
    try{
        const { class_id, user_id } = await c.req.json()

        return c.json({
            status: "OK",
            data: await setBlockUser(class_id, user_id)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL",
        })
    }
})

Instructor.post("class/block/delete", async (c: Context) => {
    try{
        const { class_id, user_id } = await c.req.json()

        return c.json({
            status: "OK",
            data: await deleteBlockUser(class_id, user_id)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL",
        })
    }
})

Instructor.get("class/exam", async (c: Context) => {
    return c.json({
        status: "FAIL"
    })
})

Instructor.get("class/exam/:class_id", async (c: Context) => {
    try{
        const { class_id } = c.req.param()
        const exam_list = await getExamList(class_id)

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
})


Instructor.post("class/exam/:class_id", async (c: Context) => {
    try{
        const { class_id } = c.req.param()
        const { exam_name } = await c.req.json()

        await newExam(class_id, exam_name)

        return c.json({
            status: "OK"
        })
    }
    catch(err){
        return c.json({
            status: "FAIL",
            message: err
        })
    }
})

Instructor.get("class/exam/:class_id/:exam_id", async (c: Context) => {
    try{
        const { class_id, exam_id } = c.req.param()

        const exam_list = await getExam(class_id, exam_id)

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
})

Instructor.post("class/exam/:class_id/:exam_id", async (c: Context) => {
    try{
        const { class_id, exam_id } = c.req.param()

        const { exam_name, duration, questions } = await c.req.json()

        await saveExam(class_id, exam_id, exam_name, duration, questions as Questions)

        return c.json({
            status: "OK"
        })
    }
    catch(err){
        return c.json({
            status: "FAIL",
        })
    }
})

Instructor.post("class/exam/:class_id/:exam_id/question", async (c: Context) => {
    try{
        const { class_id, exam_id } = c.req.param()
        const { method, data } : { method: string, data: any} = await c.req.json()

        if(method.toUpperCase() == "NEW_QUESTION"){
            insertNewQuestion(class_id, exam_id)
        }
        else if(method.toUpperCase() == "NEW_ATTACHMENT"){
            insertNewAttachment(class_id, exam_id, data.i, {type: data.type, from: data.from, source: data.source})
        }
        else if(method.toUpperCase() == "NEW_ANSWER"){
            insertNewAnswer(class_id, exam_id, data.i)
        }

        return c.json({
            status: "OK"
        })
    }
    catch(err){
        return c.json({
            status: "FAIL",
        })
    }
})
import { Context, Hono } from "hono"
import { authentication } from "../auth/middleware"
import { deleteAnswer, deleteAttachment, deleteExam, deleteExamByClasId, deleteQuestion, getAllSessionResult, getExam, getExamList, insertNewAnswer, insertNewAttachment, insertNewQuestion, newExam, resetSession, saveExam } from "../db/exam"
import { upload } from "../upload"
import { SessionVerify } from "./handler/Middleware"
import { RequestHandler } from "./handler/RequestHandler"

export const Instructor = new Hono()

Instructor.use(authentication)
Instructor.use(SessionVerify)

Instructor.post("/uploads", upload)
Instructor.post("/", RequestHandler)

Instructor.delete("class/exam/:class_id/:exam_id", )

Instructor.post("class/exam/:class_id/:exam_id/question", async (c: Context) => {
    try{
        const { class_id, exam_id } = c.req.param()
        const { method, data } : { method: string, data: any} = await c.req.json()

        if(method.toUpperCase() == "NEW_QUESTION"){
            await insertNewQuestion(class_id, exam_id)
        }
        else if(method.toUpperCase() == "NEW_ATTACHMENT"){
            await insertNewAttachment(class_id, exam_id, data.i, {type: data.type, from: data.from, source: data.source})
        }
        else if(method.toUpperCase() == "NEW_ANSWER"){
            await insertNewAnswer(class_id, exam_id, data.i)
        }
        else if(method.toUpperCase() == "DELETE_QUESTION"){
            await deleteQuestion(class_id, exam_id, data.index)
        }
        else if(method.toUpperCase() == "DELETE_ATTACHMENT"){
            await deleteAttachment(class_id, exam_id, data.index, data.aindex)
        }
        else if(method.toUpperCase() == "DELETE_ANSWER"){
            await deleteAnswer(class_id, exam_id, data.i, data.ai)
        }
        else{
            return c.json({
                status: "FAIL"
            })
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

Instructor.get("class/exam/:class_id/:exam_id/question/result", async (c: Context) => {
    try{
        const { class_id, exam_id } = c.req.param()

        return c.json({
            status: "OK",
            data: await getAllSessionResult(class_id, exam_id)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL",
        })
    }
})

Instructor.get("class/exam/:class_id/:exam_id/question/reset", async (c: Context) => {
    try{
        const { class_id, exam_id } = c.req.param()

        await resetSession(class_id, exam_id)
        
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
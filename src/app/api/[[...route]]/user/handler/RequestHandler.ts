import { Context } from "hono";
import { GetUserInfo } from "./GetUserInfo";
import { GetClassroom } from "./GetClassroom";
import { GetExamList } from "./GetExamList";
import { CreateExamSession } from "./CreateExamSession";
import { EndExam } from "./EndExam";
import { SetAnswer } from "./SetAnswer";
import { GetResult } from "./GetResult";
import { GetQuestions } from "./GetQuestions";

export async function RequestHandler(c: Context){
    const { method } = await c.req.json()

    switch(method as string){
        case "GET_USER_INFO":
            return await GetUserInfo(c)

        case "GET_CLASSROOM":
            return await GetClassroom(c)
        
        case "GET_EXAM_LIST":
            return await GetExamList(c)

        case "CREATE_EXAM_SESSION":
            return await CreateExamSession(c)

        case "SET_ANSWER":
            return await SetAnswer(c)

        case "END_EXAM":
            return await EndExam(c)
        
        case "GET_RESULT":
            return await GetResult(c)

        case "GET_QUESTIONS":
            return await GetQuestions(c)
    }
}
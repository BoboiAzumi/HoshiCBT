import { Context } from "hono";
import { GetSession } from "./GetSession";
import { GetAllClassroom } from "./GetAllClassroom"
import { CreateClassroom } from "./CreateClassroom";
import { GetClassroomById } from "./GetClassroomById";
import { UpdateClassroom } from "./UpdateClassroom";
import { DeleteClassroom } from "./DeleteClassroom";
import { GetAllowUsers } from "./GetAllowUsers";
import { GetAllowUsersNotIn } from "./GetAllowUsersNotIn";
import { SetAllowUsers } from "./SetAllowUsers";
import { UnsetAllowUsers } from "./UnsetAllowUsers";
import { GetBlockUsers } from "./GetBlockUsers";
import { SetBlockUsers } from "./SetBlockUsers";
import { UnsetBlockUsers } from "./UnsetBlockUsers";
import { GetBlockUsersNotIn } from "./GetBlockUsersNotIn";
import { GetExamList } from "./GetExamList";
import { CreateNewExam } from "./CreateNewExam";
import { GetExam } from "./GetExam";
import { SaveExam } from "./SaveExam";
import { DeleteExam } from "./DeleteExam";
import { deleteAnswer, deleteAttachment, deleteQuestion, insertNewAnswer, insertNewAttachment, insertNewQuestion } from "../../db/exam";
import { GetExamSessions } from "./GetExamSessions";
import { ResetSession } from "./ResetSession";

export async function RequestHandler(c: Context){
    const { method, data } = await c.req.json()
    const OK_RESPONSE = {
        status: "OK"
    }
    const FAIL_RESPONSE = {
        status: "FAIL"
    }

    switch ((method as string)){
        case "GET_SESSION":
            return await GetSession(c)
        case "GET_ALL_CLASSROOM":
            return await GetAllClassroom(c)
        case "CREATE_CLASSROOM": 
            return await CreateClassroom(c)
        case "GET_CLASSROOM_BY_ID":
            return await GetClassroomById(c)
        case "UPDATE_CLASSROOM":
            return await UpdateClassroom(c)
        case "DELETE_CLASSROOM":
            return await DeleteClassroom(c)
        case "GET_ALLOW_USERS":
            return await GetAllowUsers(c)
        case "GET_ALLOW_USERS_NOT_IN":
            return await GetAllowUsersNotIn(c)
        case "SET_ALLOW_USERS":
            return await SetAllowUsers(c)
        case "UNSET_ALLOW_USERS":
            return await UnsetAllowUsers(c)
        case "GET_BLOCK_USERS":
            return await GetBlockUsers(c)
        case "GET_BLOCK_USERS_NOT_IN":
            return await GetBlockUsersNotIn(c)
        case "SET_BLOCK_USERS":
            return await SetBlockUsers(c)
        case "UNSET_BLOCK_USERS":
            return await UnsetBlockUsers(c)
        case "GET_EXAM_LIST":
            return await GetExamList(c)
        case "CREATE_NEW_EXAM":
            return await CreateNewExam(c)
        case "GET_EXAM":
            return await GetExam(c)
        case "SAVE_EXAM":
            return await SaveExam(c)
        case "DELETE_EXAM":
            return await DeleteExam(c)
        case "NEW_QUESTION":
            insertNewQuestion(data.class_id, data.exam_id)
            .then(() => {
                return c.json(OK_RESPONSE)
            })
            .catch(() => {
                return c.json(FAIL_RESPONSE)
            })
            break

        case "NEW_ATTACHMENT":
            insertNewAttachment(data.class_id, data.exam_id, data.i, {type: data.type, from: data.from, source: data.source})
            .then(() => {
                return c.json(OK_RESPONSE)
            })
            .catch(() => {
                return c.json(FAIL_RESPONSE)
            })
            break

        case "NEW_ANSWER":
            insertNewAnswer(data.class_id, data.exam_id, data.i)
            .then(() => {
                return c.json(OK_RESPONSE)
            })
            .catch(() => {
                return c.json(FAIL_RESPONSE)
            })
            break

        case "DELETE_QUESTION":
            deleteQuestion(data.class_id, data.exam_id, data.index)
            .then(() => {
                return c.json(OK_RESPONSE)
            })
            .catch(() => {
                return c.json(FAIL_RESPONSE)
            })
            break

        case "DELETE_ATTACHMENT":
            deleteAttachment(data.class_id, data.exam_id, data.index, data.aindex)
            .then(() => {
                return c.json(OK_RESPONSE)
            })
            .catch(() => {
                return c.json(FAIL_RESPONSE)
            })
            break

        case "DELETE_ANSWER":
            deleteAnswer(data.class_id, data.exam_id, data.i, data.ai)
            .then(() => {
                return c.json(OK_RESPONSE)
            })
            .catch(() => {
                return c.json(FAIL_RESPONSE)
            })
            break

        case "GET_EXAM_SESSIONS":
            return await GetExamSessions(c)

        case "RESET_SESSION":
            return await ResetSession(c)
    }
}
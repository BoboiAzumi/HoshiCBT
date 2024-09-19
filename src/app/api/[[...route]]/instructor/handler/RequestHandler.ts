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

export async function RequestHandler(c: Context){
    const { method } = await c.req.json()

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
    }
}
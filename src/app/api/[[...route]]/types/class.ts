import { Users } from "./user"

export type Classroom = {
    _id?: string,
    instructor: string,
    name: string,
    is_public: boolean,
    allow_users: string[],
    block_users: string[],
    allow_users_list?: Users[],
    block_users_list?: Users[]
}

export type ClassroomData = {
    classes: Classroom,
    is_blocked: boolean
}
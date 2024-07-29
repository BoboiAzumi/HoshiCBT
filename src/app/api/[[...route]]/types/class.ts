import { Users } from "./user"

export type Classes = {
    _id?: string,
    instructor: string,
    name: string,
    is_public: boolean,
    allow_users: string[],
    block_users: string[],
    allow_users_list?: Users[],
    block_users_list?: Users[]
}

export type ClassesData = {
    classes: Classes,
    is_blocked: boolean
}
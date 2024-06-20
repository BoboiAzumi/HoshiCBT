export type Classes = {
    _id: string,
    instructor: string,
    name: string,
    is_public: boolean,
    allow_users: string[],
    block_users: string[]
}

export type ClassesData = {
    classes: Classes,
    is_blocked: boolean
}
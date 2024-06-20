export type UsersInformation = {
    fullname: string,
    email: string,
    phone: string,
    avatar: string
}
export type Users = {
    _id?: string,
    username: string,
    password?: string,
    role: "instructor" | "user" | "admin",
    information: UsersInformation
}
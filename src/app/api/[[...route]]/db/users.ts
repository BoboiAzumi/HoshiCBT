import { ObjectId } from "mongodb"
import { DB } from "./connection"
import { Users } from "../types/user"

export async function findUserById(id: string): Promise<Users[]>{
    try{
        const User: Users[] = await DB.collection("Users").find<Users>({_id: new ObjectId(id)}).toArray()
        return User
    }
    catch(e){
        throw e
    }
}

export async function findUserByUserPassword(username: string, password: string): Promise<Users[]>{
    try{
        const User: Users[] = await DB.collection("Users").find<Users>({username, password}).toArray()
        return User
    }
    catch(e){
        throw e
    }
}
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

export async function findAdmin(q: string){
    try{
        const User: Users[] = await DB.collection("Users").find<Users>({"information.fullname":{ $regex: q, $options: "i"}, role: "admin"}).toArray()
        return User
    }
    catch(e){
        throw e
    }
}

export async function findInstructor(q: string){
    try{
        const User: Users[] = await DB.collection("Users").find<Users>({"information.fullname":{ $regex: q, $options: "i"}, role: "instructor"}).toArray()
        return User
    }
    catch(e){
        throw e
    }
}

export async function findUser(q: string){
    try{
        const User: Users[] = await DB.collection("Users").find<Users>({"information.fullname":{ $regex: q, $options: "i"}, role: "user"}).toArray()
        return User
    }
    catch(e){
        throw e
    }
}

export async function addUser(set: Users){
    try{
        await DB.collection("Users").insertOne(set as object)
    }
    catch(e){
        throw e
    }
}

export async function deleteUser(id: string){
    try{
        await DB.collection("Users").deleteOne({_id: new ObjectId(id)})
    }
    catch(e){
        throw e
    }
}

export async function updateUser(data: Users){
    try{
        const payload = {
            username: data.username,
            password: data.password,
            role: data.role,
            information: data.information
        }
        await DB.collection("Users").updateOne({_id: new ObjectId(data._id)}, { $set: {...payload}})
    }
    catch(e){
        throw e
    }
}
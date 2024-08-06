import { ObjectId } from "mongodb"
import { DB } from "./connection"
import { Classroom, ClassroomData } from "../types/class"

export async function findClassByUserId(id: string): Promise<ClassroomData[]>{
    const classCollection = DB.collection("Classes");
    let ClassData: ClassroomData[] = [];
    
    let classList: Classroom[] = await classCollection.aggregate<Classroom>([{
            $match: {
                $or: [
                    {
                        allow_users: {
                            $elemMatch: {
                                $eq: new ObjectId(id)
                            }
                        }
                    },
                    {
                        is_public: true
                    }  
                ]
            }
        }
    ]).toArray()

    classList.map((x) => {
        let is_blocked = false
        
        let find = x.block_users.find((y) => y == id)

        if(find){
            is_blocked = true
        }

        ClassData.push({
            classes: x,
            is_blocked
        })
    })

    return ClassData
}

export async function findClassByInstructorId(id: string){
    const collection = DB.collection("Classes")
    const ClassData: Classroom[] = await collection.find<Classroom>({instructor: new ObjectId(id)}).toArray()
    
    return ClassData
}

export async function isClassExist(name: string): Promise<boolean>{
    const collection = DB.collection("Classes")
    const ClassData: Classroom[] = await collection.find<Classroom>({name: name}).toArray()

    return ClassData.length > 0? true : false
}

export async function insertClass(class_name: string, is_public: boolean, instructorId: string){
    if(await isClassExist(class_name)) return false

    const collection = DB.collection("Classes")

    await collection.insertOne({
        instructor: new ObjectId(instructorId),
        name: class_name,
        is_public: is_public,
        allow_users: [],
        block_users: []
    })

    return true
}

export async function findClassById(class_id: string){
    const collection = DB.collection("Classes")

    const class_info: Classroom[] = await collection.find<Classroom>({_id: new ObjectId(class_id)}).toArray()

    return class_info[0]
}

export async function updateClassById(class_id: string, class_object: Classroom){
    const collection = DB.collection("Classes")

    await collection.updateOne({_id: new ObjectId(class_id)}, {$set: {
        name: class_object.name,
        is_public: class_object.is_public
    }})
}

export async function deleteClassById(class_id: string){
    const collection = DB.collection("Classes")
    
    await collection.deleteOne({_id: new ObjectId(class_id)});
}

export async function getAllowUser(class_id: string){
    const collection = DB.collection("Classes")

    const class_info: Classroom = (await collection.aggregate<Classroom>([
        {
            $match:{
                _id: new ObjectId(class_id)
            }
        },
        {
            $lookup:{
                from: "Users",
                    localField: "allow_users",
                    foreignField: "_id",
                    as: "allow_users_list"
                }
            }
    ]).toArray())[0]

    return class_info.allow_users_list;
}

export async function getAllowUserNotIn(class_id: string, q: string = ""){
    const collection_class = DB.collection("Classes")
    const collection_user = DB.collection("Users")

    const class_info = await collection_class.find({_id: new ObjectId(class_id)}).toArray()

    const allowUserNotIn = await collection_user.find({_id: {$nin: class_info[0].allow_users}, role: "user", "information.fullname": {$regex: q, $options: "i"}}).toArray()

    return allowUserNotIn;
}

export async function setAllowUser(class_id: string, user_id: string){
    const uid = new ObjectId(user_id)
    const collection = DB.collection("Classes")
    const class_info = (await collection.find({_id: new ObjectId(class_id)}).toArray())

    const { allow_users } = class_info[0]

    const exist = allow_users.some((users: ObjectId) => users.equals(uid))
    if(exist){
        return false
    }
    
    allow_users.push(new ObjectId(user_id))

    await collection.updateOne({_id: new ObjectId(class_id)}, {$set: {allow_users: allow_users}})
    return true
}

export async function deleteAllowUser(class_id: string, user_id: string){
    const uid = new ObjectId(user_id)
    const collection = DB.collection("Classes")
    const class_info = (await collection.find({_id: new ObjectId(class_id)}).toArray())

    const { allow_users } = class_info[0]

    const exist = allow_users.some((users: ObjectId) => users.equals(uid))
    if(!exist){
        return false
    }
    
    let new_allow_users = allow_users.filter((v: ObjectId) => !v.equals(uid))

    await collection.updateOne({_id: new ObjectId(class_id)}, {$set: {allow_users: new_allow_users}})
    return true
}

// =======

export async function getBlockUser(class_id: string){
    const collection = DB.collection("Classes")

    const class_info: Classroom = (await collection.aggregate<Classroom>([
        {
            $match:{
                _id: new ObjectId(class_id)
            }
        },
        {
            $lookup:{
                from: "Users",
                    localField: "block_users",
                    foreignField: "_id",
                    as: "allow_users_list"
                }
            }
    ]).toArray())[0]

    return class_info.allow_users_list;
}

export async function getBlockUserNotIn(class_id: string, q: string = ""){
    const collection_class = DB.collection("Classes")
    const collection_user = DB.collection("Users")

    const class_info = await collection_class.find({_id: new ObjectId(class_id)}).toArray()

    const allowUserNotIn = await collection_user.find({_id: {$nin: class_info[0].block_users}, role: "user", "information.fullname": {$regex: q, $options: "i"}}).toArray()

    return allowUserNotIn;
}

export async function setBlockUser(class_id: string, user_id: string){
    const uid = new ObjectId(user_id)
    const collection = DB.collection("Classes")
    const class_info = (await collection.find({_id: new ObjectId(class_id)}).toArray())

    const { block_users } = class_info[0]

    const exist = block_users.some((users: ObjectId) => users.equals(uid))
    if(exist){
        return false
    }
    
    block_users.push(new ObjectId(user_id))

    await collection.updateOne({_id: new ObjectId(class_id)}, {$set: {block_users: block_users}})
    return true
}

export async function deleteBlockUser(class_id: string, user_id: string){
    const uid = new ObjectId(user_id)
    const collection = DB.collection("Classes")
    const class_info = (await collection.find({_id: new ObjectId(class_id)}).toArray())

    const { block_users } = class_info[0]

    const exist = block_users.some((users: ObjectId) => users.equals(uid))
    if(!exist){
        return false
    }
    
    let new_block_users = block_users.filter((v: ObjectId) => !v.equals(uid))

    await collection.updateOne({_id: new ObjectId(class_id)}, {$set: {block_users: new_block_users}})
    return true
}
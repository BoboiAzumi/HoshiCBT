import { ObjectId } from "mongodb"
import { DB } from "./connection"
import { Classes, ClassesData } from "../types/class"

export async function findClassByUserId(id: string): Promise<ClassesData[]>{
    const classCollection = DB.collection("Classes");
    let ClassData: ClassesData[] = [];
    
    let classList: Classes[] = await classCollection.aggregate<Classes>([{
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
    const ClassData: Classes[] = await collection.find<Classes>({instructor: new ObjectId(id)}).toArray()
    
    return ClassData
}

export async function isClassExist(name: string): Promise<boolean>{
    const collection = DB.collection("Classes")
    const ClassData: Classes[] = await collection.find<Classes>({name: name}).toArray()

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

    const class_info: Classes[] = await collection.find<Classes>({_id: new ObjectId(class_id)}).toArray()

    return class_info[0]
}

export async function updateClassById(class_id: string, class_object: Classes){
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

    const class_info: Classes = (await collection.aggregate<Classes>([
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
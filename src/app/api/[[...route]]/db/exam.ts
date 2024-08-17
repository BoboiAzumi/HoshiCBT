import { ObjectId } from "mongodb"
import { DB } from "./connection"
import { Answer, Attachment, Exam, Questions } from "../types/exam";
import fs, { link } from "fs"

async function is_inactive(class_id: string, exam_id: string){
    const collection = DB.collection("Exam_Session");

    let exam: Exam[] = await collection.find<Exam>({
        exam_id: new ObjectId(exam_id),
        class_id: new ObjectId(class_id)
    }).toArray();

    if(exam[0].active){
        return false
    }
    else{
        return true
    }
}

async function is_due(class_id: string, exam_id: string){
    const collection = DB.collection("Exam_Session");

    let exam: Exam[] = await collection.find<Exam>({
        exam_id: new ObjectId(exam_id),
        class_id: new ObjectId(class_id)
    }).toArray();

    if(Date.now() > (exam[0].due? exam[0].due : 0)){
        return true
    }
    else{
        return false
    }
}

export async function findExamByClassId(id: string): Promise<Exam[]>{
    const collection = DB.collection("Exam");

    const projection = {
        questions: 0
    }

    const exam: Exam[] = await collection.find<Exam>({
        class_id: new ObjectId(id)
    }, {
        projection
    }).toArray();

    return exam;
}

export async function createExamSession(class_id: string, exam_id: string, user_id: string){
    const examCollection = DB.collection("Exam");
    const examSession = DB.collection("Exam_Session")

    const examSessionExist: Exam[] = await examSession.find<Exam>({
        exam_id: new ObjectId(exam_id),
        class_id: new ObjectId(class_id),
        user_id: new ObjectId(user_id)
    }).toArray();

    if(examSessionExist.length != 0){
        return
    }

    let exam: Exam = (await examCollection.find<Exam>({
        _id: new ObjectId(exam_id),
        class_id: new ObjectId(class_id)
    }).toArray())[0];

    let questions: Questions[] = <Questions[]>exam.questions;
    let newQuestions: Questions[] = []

    questions.map((v, i) => {
        let newAnswer: Answer[] = []
        
        v.list_answer.map((w, j) => {
            newAnswer.push({
                ...w,
                index: j
            })
        })
        let currentIndex = newAnswer.length;
        
        while(currentIndex != 0){
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [newAnswer[currentIndex], newAnswer[randomIndex]] = [newAnswer[randomIndex], newAnswer[currentIndex]]
        }

        newQuestions.push({
            ...v,
            list_answer: newAnswer,
            index: i,
            answer: null
        })
    })

    let currentIndex = newQuestions.length;
        
    while(currentIndex != 0){
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newQuestions[currentIndex], newQuestions[randomIndex]] = [newQuestions[randomIndex], newQuestions[currentIndex]]
    }

    let newExamSession = {
        exam_id: exam._id,
        class_id: exam.class_id,
        user_id: new ObjectId(user_id),
        due: (Date.now() + (exam.duration? exam.duration : 0)),
        active: true,
        exam_name: exam.exam_name,
        questions: newQuestions
    }

    await examSession.insertOne(newExamSession)
}

export async function examSession(class_id: string, exam_id: string, user_id: string): Promise<Exam | boolean>{
    await createExamSession(class_id, exam_id, user_id)

    if(await is_inactive(class_id, exam_id)){
        return false;
    }
    if(await is_due(class_id, exam_id)){
        return false;
    }

    const collection = DB.collection("Exam_Session");
    const projection = {
         "questions.list_answer.correct": 0
    }

    const exam: Exam[] = await collection.find<Exam>({
        exam_id: new ObjectId(exam_id),
        class_id: new ObjectId(class_id)
    }, {
        projection
    }).toArray();
    
    return exam[0]
}

export async function answerQuestion(class_id: string, exam_id: string, user_id: string, questionIndex: number, answer: number | undefined | null): Promise<boolean>{
    if(await is_inactive(class_id, exam_id)){
        return false;
    }
    if(await is_due(class_id, exam_id)){
        return false;
    }
    
    const collection = DB.collection("Exam_Session");

    let exam: Exam[] = await collection.find<Exam>({
        exam_id: new ObjectId(exam_id),
        class_id: new ObjectId(class_id),
        user_id: new ObjectId(user_id),
    }).toArray();

    if(questionIndex >= (exam[0].questions? exam[0].questions.length : 0) || 
    questionIndex < 0){
        return false;
    }

    exam[0]?.questions?.map((v, i) => {
        if(v.index == questionIndex){
            if(exam[0].questions){
                exam[0].questions[i].answer = answer
            }
        }
    })

    await collection.updateOne({
        exam_id: new ObjectId(exam_id),
        class_id: new ObjectId(class_id)
    }, { $set : {
        ...exam[0]
    }})

    return true;
}

export async function getQuestionByArrayIndex(class_id: string, exam_id: string, user_id: string, questionArrayIndex: number): Promise<Questions | undefined | boolean>{
    if(await is_inactive(class_id, exam_id)){
        return false;
    }
    if(await is_due(class_id, exam_id)){
        return false;
    }
    
    const collection = DB.collection("Exam_Session");

    let exam: Exam[] = await collection.find<Exam>({
        exam_id: new ObjectId(exam_id),
        class_id: new ObjectId(class_id),
        user_id: new ObjectId(user_id)
    }).toArray();

    if(questionArrayIndex >= (exam[0].questions? exam[0].questions.length : 0) || 
    questionArrayIndex < 0){
        return false;
    }

    return exam[0].questions?.[questionArrayIndex]
}

export async function endQuestions(class_id: string, exam_id: string, user_id: string){
    const collection = DB.collection("Exam_Session");

    await collection.updateOne({
        exam_id: new ObjectId(exam_id),
        class_id: new ObjectId(class_id),
        user_id: new ObjectId(user_id)
    }, { $set : {
        active: false
    }})
}

export async function getResultTest(class_id: string, exam_id: string, user_id: string){
    const collection = DB.collection("Exam_Session");
    const exam: Exam[] = await collection.find<Exam>({
        exam_id: new ObjectId(exam_id),
        class_id: new ObjectId(class_id),
        user_id: new ObjectId(user_id)
    }).toArray();

    const questions = exam[0].questions
    const total = questions?.length
    let score = 0
    let quest: object[] = []

    questions?.map((v) => {
        if(v.answer == null){
            quest.push({
                question: v.question,
                correct: false
            })
        }
        v.list_answer.map((w) => {
            if(w.index == v.answer){
                let correct = false;
                if(w.correct){
                    score++
                    correct = true
                }
                quest.push({
                    question: v.question,
                    correct
                })
            }
        })
    })

    return {
        total,
        correct_total: score,
        score: (score/<number>total) * 100,
        detail: quest
    }
}

export async function deleteExamByClasId(class_id: string){
    const collection = DB.collection("Exam")
    const exam_session = DB.collection("Exam_Session")

    await collection.deleteMany({class_id: new ObjectId(class_id)})
    await exam_session.deleteMany({class_id: new ObjectId(class_id)})
}

export async function getExamList(class_id: string){
    const collection = DB.collection("Exam")    
    const exam_list: Exam[] = (await collection.find({class_id: new ObjectId(class_id)}).project({questions: 0, duration: 0}).toArray()) as Exam[]

    return exam_list
}

export async function newExam(class_id: string, exam_name: string){
    const collection = DB.collection("Exam")
    let dataToInsert = {
        class_id: new ObjectId(class_id),
        exam_name,
        duration: 0,
        questions: []
    }
    
    await collection.insertOne(dataToInsert)
}

export async function getExam(class_id: string, exam_id: string){
    const collection = DB.collection("Exam")
    const exam = await collection.find({_id: new ObjectId(exam_id), class_id: new ObjectId(class_id)}).toArray()
    
    return exam[0]
}

export async function saveExam(class_id: string, exam_id: string, exam_name: string, duration: number, questions: Questions){
    const collection = DB.collection("Exam")
    await collection.updateOne({_id: new ObjectId(exam_id), class_id: new ObjectId(class_id)}, {$set: {exam_name, duration, questions}})

    return true
}

export async function insertNewQuestion(class_id: string, exam_id: string){
    const collection = DB.collection("Exam")
    const exam = (await collection.find({_id: new ObjectId(exam_id), class_id: new ObjectId(class_id)}).toArray())[0]
    const { questions } = exam

    questions.push({
        question: "",
        attachment: [] as Attachment[],
        list_answer: [] as Answer[]
    } as Questions)

    await collection.updateOne({_id: new ObjectId(exam_id), class_id: new ObjectId(class_id)}, {$set:{questions: questions}})
}

export async function insertNewAttachment(class_id: string, exam_id: string, index: number, attachment: Attachment){
    const collection = DB.collection("Exam")
    const exam = (await collection.find({_id: new ObjectId(exam_id), class_id: new ObjectId(class_id)}).toArray())[0]
    const { questions } = exam

    questions[index].attachment.push(attachment)

    await collection.updateOne({_id: new ObjectId(exam_id), class_id: new ObjectId(class_id)}, {$set:{questions: questions}})
}

export async function insertNewAnswer(class_id: string, exam_id: string, index: number){
    const collection = DB.collection("Exam")
    const exam = (await collection.find({_id: new ObjectId(exam_id), class_id: new ObjectId(class_id)}).toArray())[0]
    const { questions } = exam

    questions[index].list_answer.push({
        text: "",
        correct: false
    })

    await collection.updateOne({_id: new ObjectId(exam_id), class_id: new ObjectId(class_id)}, {$set:{questions: questions}})
}

export async function deleteQuestion(class_id: string, exam_id: string, index: number){
    const collection = DB.collection("Exam")
    const exam = (await collection.find({_id: new ObjectId(exam_id), class_id: new ObjectId(class_id)}).toArray())[0]
    const { questions } = exam

    // Find Attachment
    if(questions[index].attachment.length != 0){
        const attachment: Attachment[] = questions[index].attachment
        attachment.map((v, i) => {
            if(v.from == "upload"){
                const linkPath = v.source.replace("/api/", "./")
                fs.unlinkSync(linkPath)
            }
        })
    }

    const newQuestions = questions.filter((_: Questions, i: number) => i != index)

    await collection.updateOne({_id: new ObjectId(exam_id), class_id: new ObjectId(class_id)}, {$set:{questions: newQuestions}})
}

export async function deleteAttachment(class_id: string, exam_id: string, index: number, attachmentIndex: number){
    const collection = DB.collection("Exam")
    const exam = (await collection.find({_id: new ObjectId(exam_id), class_id: new ObjectId(class_id)}).toArray())[0]
    const { questions } = exam

    const { attachment } = questions[index] as Questions

    const linkPath = attachment[attachmentIndex].source.replace("/api/", "./")
    fs.unlinkSync(linkPath)

    const newAttachment = attachment.filter((v, i) => i != attachmentIndex);
    questions[index].attachment = newAttachment

    await collection.updateOne({_id: new ObjectId(exam_id), class_id: new ObjectId(class_id)}, {$set:{questions: questions}})
}

export async function deleteAnswer(class_id: string, exam_id: string, index: number, answerIndex: number){
    const collection = DB.collection("Exam")
    const exam = (await collection.find({_id: new ObjectId(exam_id), class_id: new ObjectId(class_id)}).toArray())[0]
    const { questions } = exam

    const { list_answer } = questions[index] as Questions

    const newListAnswer = list_answer.filter((v, i) => i != answerIndex);
    questions[index].list_answer = newListAnswer

    await collection.updateOne({_id: new ObjectId(exam_id), class_id: new ObjectId(class_id)}, {$set:{questions: questions}})
}

export async function deleteExam(class_id: string, exam_id: string){
    const collection = DB.collection("Exam")
    const exam = (await collection.find({_id: new ObjectId(exam_id), class_id: new ObjectId(class_id)}).toArray())[0] 
    const questions: Questions[] = exam.questions

    questions.map((v, i) => {
        if(questions[i].attachment.length != 0){
            const attachment: Attachment[] = questions[i].attachment
            attachment.map((v, i) => {
                if(v.from == "upload"){
                    const linkPath = v.source.replace("/api/", "./")
                    fs.unlinkSync(linkPath)
                }
            })
        }
    })

    await collection.deleteOne({_id: new ObjectId(exam_id), class_id: new ObjectId(class_id)})
}
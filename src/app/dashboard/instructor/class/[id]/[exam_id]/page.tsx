"use client"
import { Answer, Attachment, Questions } from "@/app/api/[[...route]]/types/exam";
import { Users } from "@/app/api/[[...route]]/types/user";
import Navbar from "@/components/navbar";
import Splash from "@/components/splash";
import { UserData } from "@/context/UserData";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function ExamEdit(){
    let [userData, setUserData] = useState<Users>()
    let [load, setLoad] = useState(true)
    let [duration, setDuration] = useState("")
    let [examName, setExamName] = useState("")
    let [questions, setQuestions] = useState([] as Questions[])
    const { id, exam_id } = useParams()

    async function loadExamData(){
        let res = await fetch(`/api/instructor/class/exam/${id}/${exam_id}`)
        let json = await res.json()
        let millis = json.data.duration
        let hours = Math.floor(millis / (1000 * 60 * 60))
        let minutes = Math.floor((millis / (1000 * 60 * 60)) / (1000 * 60))
        let format = `${hours < 10 ? "0"+hours : hours}:${minutes < 10 ? "0"+minutes : minutes}`
        console.log(format)
        setDuration(format)
        setQuestions(json.data.questions)
        setExamName(json.data.exam_name)
    }

    async function saving(){

    }

    function addQuestion(){
        let quests = [...questions]
        quests.push({
            question: "",
            attachment: [] as Attachment[],
            list_answer: [] as Answer[]
        } as Questions)
        setQuestions(quests)
    }

    useEffect(() => {
        fetch("/api/auth/")
            .then((r) => r.json())
            .then((json) => {
                if (json.status != "OK") document.location.href = "/signin"
                switch (json.data.role) {
                    case "instructor":
                        setUserData(json.data)
                        loadExamData().then(() => {
                            setLoad(!load)
                        })
                        break
                    case "user":
                        document.location.href = "/dashboard/user"
                        break
                    case "admin":
                        document.location.href = "/dashboard/admin"
                        break
                }
            })
    }, [])

    return (
        <>
            <Splash isLoad={load}></Splash>
            <div className={"bg-white w-full min-h-[100vh]"+ (load? " hidden": "")}>
                <UserData.Provider value={userData as Users}>
                    <Navbar/>
                </UserData.Provider>
                <div className="w-full z-0">
                    <div className="flex flex-col items-center">
                        <h2 className="mt-[7.5rem] mb-5 text-2xl font-semibold text-gray-600">Exam Editor</h2>
                        <div className="w-[50vw]">
                            <form className="text-gray-600 w-full" 
                                onSubmit={(ev) => {
                                    ev.preventDefault()
                                }}
                            >
                                <h4 className="my-2">Exam Name</h4>
                                <input 
                                    type="text"
                                    value={examName}
                                    className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                                />
                                <h4 className="my-2">Duration</h4>
                                <input 
                                    type="time"
                                    value={duration}
                                    onChange={(ev) => {

                                    }}
                                    className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                                />
                                <h4 className="my-2">Questions</h4>
                                {questions.map((v: Questions, i: number) => (
                                    <div className="w-full p-5 border border-slate-300 my-2 rounded-md">
                                        <h4 className="mb-2">Question</h4>
                                        <input 
                                            type="text"
                                            value={v.question}
                                            onChange={
                                                (ev) => {
                                                    let q = [...questions]
                                                    q[i].question = ev.target.value
                                                    setQuestions(q)
                                                }
                                            }
                                            className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                                        />
                                        <h4 className="my-2">Attachment</h4>
                                        {v.attachment.map((w: Attachment, j: number) => (
                                            <div className="flex">
                                                <div className="w-[80%]">
                                                    {w.type == "image" ? (
                                                        <img 
                                                            width={75}
                                                            height={75}
                                                            src={w.source}
                                                            alt="Attachment"
                                                        />
                                                    ) : (<audio controls>
                                                        <source src={w.source} 
                                                                width={200}
                                                                height={0}/>
                                                    </audio>)}
                                                </div>
                                                <div className="w-[20%] flex flex-col justify-center items-center">
                                                    <button className="border shadow-sm shadow-gray-200 w-full px-5 py-2 bg-red-400 hover:bg-red-500 rounded-md text-white">
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="text-center w-full py-2 border border-slate-200 my-2 rounded-md hover:bg-slate-200">
                                            Add Attachment
                                        </button>
                                        <h4 className="my-2">Answer</h4>
                                        {v.list_answer.map((w: Answer, j: number) => (
                                            <div className="flex">
                                                <div className="w-[70%] flex flex-col justify-center items-center">
                                                    <input 
                                                        type="text"
                                                        value={w.text}
                                                        className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                                                    />
                                                </div>
                                                <div className="w-[15%] flex flex-col justify-center items-center">
                                                    {w.correct ? (
                                                        <button className="border shadow-sm shadow-gray-200 w-full px-5 py-2 bg-red-400 hover:bg-red-500 rounded-md text-white">
                                                            Remove Correct
                                                        </button>
                                                    ) : (
                                                        <button className="border shadow-sm shadow-gray-200 w-full px-5 py-2 bg-blue-400 hover:bg-blue-500 rounded-md text-white">
                                                            Set Correct
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="w-[15%] flex flex-col justify-center items-center">
                                                    <button className="border shadow-sm shadow-gray-200 w-full px-5 py-2 bg-red-400 hover:bg-red-500 rounded-md text-white">
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="text-center w-full py-2 border border-slate-200 my-2 rounded-md hover:bg-slate-200">
                                            Add Answer
                                        </button>
                                    </div>
                                ))}
                            <button className="text-center w-full py-2 border border-slate-200 my-2 rounded-md hover:bg-slate-200" onClick={() => addQuestion()}>
                                Add Question
                            </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
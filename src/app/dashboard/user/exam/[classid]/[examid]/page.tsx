"use client"
import { Answer, Exam, Questions } from "@/app/api/[[...route]]/types/exam";
import QuestionsDisplay from "@/components/questions";
import Splash from "@/components/splash";
import { ExamContext } from "@/context/Exam";
import { QuestionsContext } from "@/context/Questions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ExamView(){
    const { examid , classid } = useParams()
    let [load, setLoad] = useState(true)
    let [fail, setFail] = useState(false)
    let [examData, setExamData] = useState({} as Exam)
    let [questions, setQuestions] = useState({} as Questions)

    let ExamContextData = {
        examData, setExamData
    }

    let QuestionsContextData = {
        questions, setQuestions
    }

    useEffect(() => {
        fetch("/api/auth/")
            .then((r) => r.json())
            .then((json) => {
                if (json.status != "OK") document.location.href = "/signin"
                switch (json.data.role) {
                    case "user":
                        setLoad(!load)
                        break
                    case "instructor":
                        document.location.href = "/dashboard/instructor"
                        break
                    case "admin":
                        document.location.href = "/dashboard/admin"
                        break
                }
            })
    }, [])

    useEffect(() => {
        fetch("/api/user/class/"+classid+"/"+examid)
            .then((r) => r.json())
            .then((json) => {
                if (json.status != "OK") setFail(true)
                setExamData(json.data as Exam)
                if(json.data?.questions && json.data?.questions?.length != 0){
                    setQuestions(json.data.questions[0] as Questions)
                }
            })
    }, [load])

    return (
        <>
            <Splash isLoad={load}></Splash>
            {
                fail? (
                    <div
                        className={"bg-white w-full min-h-[100vh] flex justify-center flex-col items-center" + (load ? " hidden" : "")}
                    >
                        <h2 className="text-2xl text-gray-600 font-semibold">
                           The exam has ended
                        </h2>
                        <div className="flex">
                        <a href={"/dashboard/user/class/"+classid} className="bg-[#ff7854] hover:bg-[#ff4c1a] my-5 px-5 py-3 text-lg font-semibold text-gray-100 rounded-3xl mx-3 flex items-center justify-center">Back</a>
                        <a href={"/dashboard/user/result/"+classid+"/"+examid} className="bg-white border border-[#ff7854] hover:text-gray-100 hover:bg-[#ff4c1a] my-5 px-5 py-3 text-lg font-semibold text-gray-600 rounded-3xl mx-3 flex items-center justify-center">Result</a>
                        </div>
                    </div>
                ) : (
                    <ExamContext.Provider value={ExamContextData}>
                        <QuestionsContext.Provider value={QuestionsContextData}>
                            <div
                                className={"bg-white w-full min-h-[100vh]" + (load ? " hidden" : "")}
                            >
                                <QuestionsDisplay />
                            </div>
                        </QuestionsContext.Provider>
                    </ExamContext.Provider>
                )
            }
        </>
    )
}
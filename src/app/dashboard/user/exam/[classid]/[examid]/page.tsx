"use client"
import { Answer, Exam, Questions } from "@/app/api/[[...route]]/types/exam";
import { Users } from "@/app/api/[[...route]]/types/user";
import Navbar from "@/components/ExamNavbar";
import QuestionsDisplay from "@/components/questions";
import Splash from "@/components/splash";
import { ExamContext } from "@/context/Exam";
import { QuestionIndex } from "@/context/QuestionIndex";
import { QuestionsContext } from "@/context/Questions";
import { Timer } from "@/context/Timer";
import { UserData } from "@/context/UserData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ExamView(){
    const { examid , classid } = useParams()
    let [userData, setUserData] = useState<Users>()
    let [load, setLoad] = useState(true)
    let [fail, setFail] = useState(false)
    let [examData, setExamData] = useState({} as Exam)
    let [questions, setQuestions] = useState({} as Questions)
    let [timer, setTimer] = useState({
        hour: 0,
        minutes: 0,
        seconds: 0
    })
    let [index, setIndex] = useState(0)

    let ExamContextData = {
        examData, setExamData
    }

    let QuestionsContextData = {
        questions, setQuestions
    }

    useEffect(() => {
        fetch("/api/auth/", {
            method: "post",
            body: JSON.stringify({
                method: "AUTHENTICATION"
            })
        })
            .then((r) => r.json())
            .then((json) => {
                if (json.status != "OK") document.location.href = "/signin"
                switch (json.data.role) {
                    case "user":
                        setLoad(!load)
                        setUserData(json.data)
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
        if(!load){
            console.log("trigger")
            fetch("/api/user/", {
                method: "post",
                body: JSON.stringify({
                    method: "CREATE_EXAM_SESSION",
                    data: {
                        class_id: classid,
                        exam_id: examid,
                    },
                }),
            })
                .then((r) => r.json())
                .then((json) => {
                    if (json.status != "OK") setFail(true);
                    setExamData(json.data as Exam);
                    if (
                        json.data?.questions &&
                        json.data?.questions?.length != 0
                    ) {
                        setQuestions(json.data.questions[0] as Questions);
                    }
                });
        }
    }, [load])

    return (
        <>
            <Splash isLoad={load}></Splash>
            <div
                className={
                    "bg-white w-full min-h-[100vh]" + (load ? " hidden" : "")
                }
            >
                <UserData.Provider value={userData as Users}>
                    <Timer.Provider value={{ timer, setTimer }}>
                        <ExamContext.Provider value={ExamContextData}>
                            <QuestionsContext.Provider
                                value={QuestionsContextData}
                            >
                                <QuestionIndex.Provider value={{index, setIndex}}>
                                    <Navbar />
                                </QuestionIndex.Provider>
                            </QuestionsContext.Provider>
                        </ExamContext.Provider>
                    </Timer.Provider>
                </UserData.Provider>
                {fail ? (
                    <div
                        className={
                            "bg-white w-full min-h-[100vh] flex justify-center flex-col items-center" +
                            (load ? " hidden" : "")
                        }
                    >
                        <h2 className="text-2xl text-gray-600 font-semibold">
                            The exam has ended
                        </h2>
                        <div className="flex">
                            <a
                                href={"/dashboard/user/class/" + classid}
                                className="btn bg-[#ff7854] hover:bg-[#ff4c1a] text-lg font-semibold text-gray-100 my-5"
                            >
                                Back
                            </a>
                            <a
                                href={
                                    "/dashboard/user/result/" +
                                    classid +
                                    "/" +
                                    examid
                                }
                                className="btn bg-white border border-[#ff7854] hover:text-gray-100 hover:bg-[#ff4c1a] my-5 text-lg font-semibold text-gray-600"
                            >
                                Result
                            </a>
                        </div>
                    </div>
                ) : (
                    <ExamContext.Provider value={ExamContextData}>
                        <QuestionsContext.Provider value={QuestionsContextData}>
                            <Timer.Provider value={{ timer, setTimer }}>
                                <QuestionIndex.Provider value={{index, setIndex}}>
                                    <div
                                        className={
                                            "bg-white w-full min-h-[100vh]" +
                                            (load ? " hidden" : "")
                                        }
                                    >
                                        <QuestionsDisplay />
                                    </div>
                                </QuestionIndex.Provider>
                            </Timer.Provider>
                        </QuestionsContext.Provider>
                    </ExamContext.Provider>
                )}
            </div>
        </>
    );
}
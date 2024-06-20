import { Answer } from "@/app/api/[[...route]]/types/exam"
import { ExamContext } from "@/context/Exam"
import { QuestionsContext } from "@/context/Questions"
import { useParams } from "next/navigation"
import { FormEvent, useContext, useEffect, useState } from "react"

export default function QuestionsDisplay() {
    const { examid , classid } = useParams()
    const { examData, setExamData } = useContext(ExamContext)
    const { questions, setQuestions } = useContext(QuestionsContext)
    let [ confirmEnd, setConfirmEnd ] = useState(false)
    let [timer, setTimer] = useState({
        hour: 0,
        minutes: 0,
        seconds: 0
    })
    let [index, setIndex] = useState(0)

    function setAnswer(answer: number) {
        questions.answer = answer
        setQuestions({
            ...questions
        })

        const listQuestions = examData.questions
        if(listQuestions){
            listQuestions[index] = questions
        }

        examData.questions = listQuestions

        setExamData({
            ...examData
        })

        fetch("/api/user/class/"+classid+"/"+examid, {
            method: "post",
            body: JSON.stringify({
                questionIndex: examData.questions?.[index].index,
                answer
            })
        }).then((res) => res.json())
        .then((json) => {
            if(json.status == "FAIL"){
                document.location.href = "/dashboard/user/exam/"+classid+"/"+examid
            }
        })
    }

    function endSession(){
        fetch("/api/user/class/"+classid+"/"+examid+"/end").then((res) => res.json())
        .then((json) => {
            if(json.status == "OK"){
                document.location.href = "/dashboard/user/class/"+classid+"/"
            }
        })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now()
            const remain = (examData.due? examData.due : 0) - now;
            if(remain >= 0){
                if(remain < 1000){
                    document.location.href = "/dashboard/user/exam/"+classid+"/"+examid
                    return
                }
                const hour = Math.floor(remain / 1000 / 60 / 60);
                const minutes = Math.floor((remain / 1000 / 60 / 60 - hour) * 60);
                const seconds = Math.floor(((remain / 1000 / 60 / 60 - hour) * 60 - minutes) * 60);

                setTimer({
                    hour,
                    minutes,
                    seconds
                })
            }
        }, 1000)
    }, [examData])

    return (
        <>
            <div className={"fixed w-full z-[10] h-[100vh] bg-black bg-opacity-60 flex flex-col justify-center items-center "+(confirmEnd? "" : "hidden")}>
                <div className="bg-white w-[30rem] px-5 py-3 rounded-md">
                    <h3 className="text-center font-bold text-lg text-gray-600">Confirm End Exam Session</h3>
                    <div className="flex justify-center mt-5 gap-5">
                        <button onClick={(ev) => setConfirmEnd(false)} className="border border-[#ff4c1a] text-black min-w-[6rem] py-1 px-5 rounded-md">No</button>
                        <button onClick={(ev) => endSession()} className="bg-[#ff4c1a] text-white min-w-[6rem] py-1 px-5 rounded-md">Yes</button>
                    </div>
                </div>
            </div>
            <div className="flex w-full min-h-[100vh] py-10">
                <div className="bg-white shadow-sm border border-blue-300 rounded-[0.5rem] mb-10 min-h-[80vh] mx-10 w-[20vw]">
                    <h4 className="text-center px-5 py-3 font-bold text-lg bg-blue-300 rounded-t-[0.3rem]">
                        {examData.exam_name}
                    </h4>
                    <h4 className="text-center font-bold text-sm py-2 border border-b-blue-300">
                        {timer.hour}:{timer.minutes}:{timer.seconds}
                    </h4>
                    <div className="grid grid-flow-row-dense md:grid-cols-3 lg:grid-cols-4 my-5 gap-4 px-5">
                        {examData.questions?.map((v, i) => (
                            <button
                                className={"shadow-md cursor-pointer flex justify-center py-2 w-10 rounded-md" + (i == index ? " bg-blue-300" : v.answer != null? " bg-[#ff4c1a] text-white": " bg-white ")}
                                onClick={(ev) =>{ setQuestions(v); setIndex(i)}}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="bg-white shadow-sm border border-[#ff4c1a] rounded-[0.5rem] mb-10 min-h-[80vh] mx-10 w-[70vw]">
                    <h4 className="text-white text-center px-5 py-3 font-bold text-lg bg-[#ff4c1a] rounded-t-[0.3rem]">
                        Questions {index+1}
                    </h4>
                    <h4 className="mx-10 my-4">{questions?.question}</h4>
                    <div className={"flex flex-col items-center mx-10 my-4"+ (questions?.attachment?.length != 0? " my-5": "")}>
                        {questions?.attachment?.map((v, i) => (
                            <>
                                {v.type == "image" ? (
                                    <img
                                        src={v.source}
                                        width={200}
                                        height={0}
                                        alt={"Attachment " + i}
                                    />
                                ) : (
                                    <></>
                                )}
                            </>
                        ))}
                        {questions?.attachment?.map((v, i) => (
                            <>
                                {v.type == "audio" ? (
                                    <audio controls>
                                        <source
                                            src={v.source}
                                            width={200}
                                            height={0}
                                        />
                                    </audio>
                                ) : (
                                    <></>
                                )}
                            </>
                        ))}
                    </div>
                    <div className="flex flex-col justify-start mx-10 my-4">
                        {questions?.list_answer?.map((v: Answer, i) => (
                            <div className="flex flex-row">
                                <input
                                    id={v.index?.toString()}
                                    type="radio"
                                    value={v.index}
                                    checked={questions.answer == v.index}
                                    onClick={(ev: FormEvent) => setAnswer(v.index as number)}
                                />
                                <label
                                    className="ml-5"
                                    htmlFor={v.index?.toString()}
                                >
                                    {v.text}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mx-10 my-4">
                        {index > 0? (
                            <button className="bg-[#ff4c1a] text-white min-w-[6rem] py-1 px-5 rounded-md" onClick={(ev) => { setQuestions(examData.questions?.[index-1]); setIndex(index-1)}}>
                                Previous
                            </button>
                        ) : (<></>)}
                        {index != (examData?.questions? examData.questions.length : 0) - 1 ? (
                            <button className="bg-[#ff4c1a] text-white min-w-[6rem] py-1 px-5 rounded-md" onClick={(ev) => { setQuestions(examData.questions?.[index+1]); setIndex(index+1)}}>
                                Next
                            </button>
                        ) : (
                            <button className="bg-[#ff4c1a] text-white min-w-[6rem] py-1 px-5 rounded-md" onClick={(ev) => setConfirmEnd(true)}>
                                End Session
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

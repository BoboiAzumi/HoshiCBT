import { Answer } from "@/app/api/[[...route]]/types/exam"
import { ExamContext } from "@/context/Exam"
import { QuestionIndex } from "@/context/QuestionIndex"
import { QuestionsContext } from "@/context/Questions"
import { Timer } from "@/context/Timer"
import { useParams } from "next/navigation"
import { FormEvent, useContext, useEffect, useRef, useState } from "react"

export default function QuestionsDisplay() {
    const { examid , classid } = useParams()
    const { examData, setExamData } = useContext(ExamContext)
    const { questions, setQuestions } = useContext(QuestionsContext)
    const timerContext = useContext(Timer)
    let [ confirmEnd, setConfirmEnd ] = useState(false)
    const { index, setIndex } = useContext(QuestionIndex)
    const ConfirmModal = useRef({} as HTMLDialogElement)

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

        fetch("/api/user/", {
            method: "post",
            body: JSON.stringify({
                method: "SET_ANSWER",
                data: {
                    class_id: classid,
                    exam_id: examid,
                    question_index: examData.questions?.[index].index,
                    answer
                }
            })
        }).then((res) => res.json())
        .then((json) => {
            if(json.status == "FAIL"){
                document.location.href = "/dashboard/user/exam/"+classid+"/"+examid
            }
        })
    }

    function endSession(){
        fetch("/api/user/", {
            method: "post",
            body: JSON.stringify({
                method: "END_EXAM",
                data: {
                    class_id: classid,
                    exam_id: examid
                }
            })
        }).then((res) => res.json())
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

                timerContext.setTimer({
                    hour,
                    minutes,
                    seconds
                })
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [examData])

    return (
        <>
            <dialog
                ref={ConfirmModal}
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box">
                    <h3 className="text-center font-bold text-lg text-gray-600">
                        Confirm End Exam Session
                    </h3>
                    <div className="flex justify-center mt-5 gap-5">
                        <button
                            onClick={(ev) => ConfirmModal.current.close()}
                            className="border border-[#ff4c1a] text-black min-w-[6rem] py-1 px-5 rounded-md"
                        >
                            No
                        </button>
                        <button
                            onClick={(ev) => endSession()}
                            className="bg-[#ff4c1a] text-white min-w-[6rem] py-1 px-5 rounded-md"
                        >
                            Yes
                        </button>
                    </div>
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
            
            <div className="flex w-full min-h-[100vh] sm:py-10">
                <div className="bg-white shadow-sm border border-[#ff4c1a] rounded-[0.5rem] sm:mb-10 min-h-[100vh] sm:min-h-[80vh] sm:mx-10 w-full sm:w-[100vw] mt-[4rem]">
                    <h4 className="text-white text-center px-5 py-3 font-bold text-lg bg-[#ff4c1a] rounded-t-[0.3rem]">
                        Questions {index + 1}
                    </h4>
                    <h4 className="mx-10 my-4">{questions?.question}</h4>
                    <div
                        className={
                            "flex flex-col items-center mx-10 my-4" +
                            (questions?.attachment?.length != 0 ? " my-5" : "")
                        }
                    >
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
                                    onClick={(ev: FormEvent) =>
                                        setAnswer(v.index as number)
                                    }
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
                        {index > 0 ? (
                            <button
                                className="btn bg-[#ff4c1a] hover:bg-[#ff4c1a] text-white min-w-[6rem]"
                                onClick={(ev) => {
                                    setQuestions(
                                        examData.questions?.[index - 1]
                                    );
                                    setIndex(index - 1);
                                }}
                            >
                                Previous
                            </button>
                        ) : (
                            <></>
                        )}
                        {index !=
                        (examData?.questions ? examData.questions.length : 0) -
                            1 ? (
                            <button
                                className="btn bg-[#ff4c1a] hover:bg-[#ff4c1a] text-white"
                                onClick={(ev) => {
                                    setQuestions(
                                        examData.questions?.[index + 1]
                                    );
                                    setIndex(index + 1);
                                }}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                className="btn bg-[#ff4c1a] hover:bg-[#ff4c1a] text-white"
                                onClick={(ev) => ConfirmModal.current.showModal()}
                            >
                                End Session
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

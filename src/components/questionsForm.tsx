import { Answer, Attachment, Questions } from "@/app/api/[[...route]]/types/exam"

type QuestionsParam = {
    v: Questions,
    questions: Questions[],
    setQuestions: Function,
    setSaved: Function,
    i: number,
    setModalAttachment: Function,
    setSelectedQIndex: Function,
    setSelectedAIndex: Function,
    correctToggle: Function,
    addAnswer: Function,
    deleteQuestion: Function
}

export default function QuestionsForm(p: QuestionsParam){
    return (
        <div className="w-full p-5 border border-slate-300 my-2 rounded-md">
            <h4 className="mb-2">Question</h4>
            <input 
                type="text"
                value={p.v.question}
                onChange={
                    (ev) => {
                        let q = [...p.questions]
                        q[p.i].question = ev.target.value
                        p.setQuestions(q)
                        p.setSaved(false)
                    }
                }
                className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
            />
            <h4 className="my-2">Attachment</h4>
            {p.v.attachment.map((w: Attachment, j: number) => (
                <div className="flex" key={j}>
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
            <button className="text-center w-full py-2 border border-slate-200 my-2 rounded-md hover:bg-slate-200"
                onClick={() => {
                    p.setModalAttachment(true)
                    p.setSelectedQIndex(p.i)
                }}>
                Add Attachment
            </button>
            <h4 className="my-2">Answer</h4>
            {p.v.list_answer.map((w: Answer, j: number) => (
                <div className="flex">
                    <div className="w-[60%] flex flex-col justify-center items-center">
                        <input 
                            type="text"
                            value={w.text}
                            onChange={(ev) => {
                                let qs = [...p.questions]
                                qs[p.i].list_answer[j].text = ev.target.value
                                p.setQuestions(qs)
                            }}
                            className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                        />
                    </div>
                    <div className="w-[25%] flex flex-col justify-center items-center">
                        {w.correct ? (
                            <button className="border shadow-sm shadow-gray-200 w-full px-5 py-2 bg-red-400 hover:bg-red-500 rounded-md text-white" onClick={() => p.correctToggle(p.i, j)}>
                                Unset Correct
                            </button>
                        ) : (
                            <button className="border shadow-sm shadow-gray-200 w-full px-5 py-2 bg-blue-400 hover:bg-blue-500 rounded-md text-white" onClick={() => p.correctToggle(p.i, j)}>
                                Set Correct
                            </button>
                        )}
                    </div>
                    <div className="w-[15%] flex flex-col justify-center items-center">
                        <button className="border shadow-sm shadow-gray-200 w-full px-5 py-2 bg-red-400 hover:bg-red-500 rounded-md text-white" 
                            onClick={(ev) => {
                                let qs = [...p.questions]
                                let as = qs[p.i].list_answer.filter((_, k: number) => k != j)
                                qs[p.i].list_answer = as
                                p.setQuestions(qs)
                                p.setSaved(false)
                            }}>
                            Delete
                        </button>
                    </div>
                </div>
            ))}
            <button className="text-center w-full py-2 border border-slate-200 my-2 rounded-md hover:bg-slate-200" onClick={(ev) => p.addAnswer(p.i)}>
                Add Answer
            </button>
            <button className="border shadow-sm shadow-gray-200 w-full px-5 py-2 bg-red-400 hover:bg-red-500 rounded-md text-white" onClick={() => p.deleteQuestion(p.i)}>
                Delete Question
            </button>
        </div>
    )
}
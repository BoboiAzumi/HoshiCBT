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
    deleteQuestion: Function,
    saving: Function,
    deleteAttachment: Function
    deleteAnswer: Function
}

export default function QuestionsForm(p: QuestionsParam){
    return (
        <div className="w-full p-5 border border-slate-300 my-2 rounded-md">
            <h4 className="mb-2">Question {p.i + 1}</h4>
            <input
                type="text"
                value={p.v.question}
                onChange={(ev) => {
                    let q = [...p.questions];
                    q[p.i].question = ev.target.value;
                    p.setQuestions(q);
                    p.setSaved(false);
                }}
                className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                onBlur={(ev) => p.saving()}
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
                        ) : (
                            <audio controls>
                                <source src={w.source} width={200} height={0} />
                            </audio>
                        )}
                    </div>
                    <div className="w-[20%] flex flex-col justify-center items-center">
                        <button
                            className="border shadow-sm shadow-gray-200 w-full px-5 py-2 bg-red-400 hover:bg-red-500 rounded-md text-white"
                            onClick={() => {
                                p.deleteAttachment(p.i, j);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
            <button
                className="btn w-full my-2"
                onClick={() => {
                    p.setModalAttachment(true);
                    p.setSelectedQIndex(p.i);
                }}
            >
                Add Attachment
            </button>
            <h4 className="my-2">Answer</h4>
            {p.v.list_answer.map((w: Answer, j: number) => (
                <>
                    <hr />
                    <div className="flex my-1">
                        <div className="w-[60%] flex flex-col justify-center items-center">
                            <input
                                type="text"
                                value={w.text}
                                onChange={(ev) => {
                                    let qs = [...p.questions];
                                    qs[p.i].list_answer[j].text =
                                        ev.target.value;
                                    p.setQuestions(qs);
                                    p.setSaved(false);
                                }}
                                onBlur={(ev) => {
                                    p.saving();
                                }}
                                className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                            />
                        </div>
                        <div className="w-[40%] grid grid-flow-row-dense grid-cols-1 lg:grid-cols-2">
                            {w.correct ? (
                                <button
                                    className="btn shadow-sm shadow-gray-200 w-full bg-red-400 hover:bg-red-500 text-white"
                                    onClick={() => p.correctToggle(p.i, j)}
                                >
                                    Unset Correct
                                </button>
                            ) : (
                                <button
                                    className="btn shadow-sm shadow-gray-200 w-full bg-blue-400 hover:bg-blue-500 text-white"
                                    onClick={() => p.correctToggle(p.i, j)}
                                >
                                    Set Correct
                                </button>
                            )}
                            <button
                                className="btn shadow-sm shadow-gray-200 w-full bg-red-400 hover:bg-red-500 text-white"
                                onClick={(ev) => {
                                    p.deleteAnswer(p.i, j);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </>
            ))}
            <hr />
            <button
                className="btn w-full my-2 shadow-sm shadow-gray-200"
                onClick={(ev) => p.addAnswer(p.i)}
            >
                Add Answer
            </button>
            <button
                className="btn shadow-sm shadow-gray-200 w-full bg-red-400 hover:bg-red-500 text-white"
                onClick={() => p.deleteQuestion(p.i)}
            >
                Delete Question
            </button>
        </div>
    );
}
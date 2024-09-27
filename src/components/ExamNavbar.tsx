import { ClassroomList } from "@/context/ClassroomList";
import { ExamContext } from "@/context/Exam";
import { QuestionIndex } from "@/context/QuestionIndex";
import { QuestionsContext } from "@/context/Questions";
import { Timer } from "@/context/Timer";
import { useContext } from "react"

export default function Navbar(){
    let classrooms = useContext(ClassroomList)
    let timerContext = useContext(Timer)
    const { examData, setExamData } = useContext(ExamContext)
    const { questions, setQuestions } = useContext(QuestionsContext)
    const { index, setIndex} = useContext(QuestionIndex)

    return (
        <>
            <div className="drawer">
                <input
                    type="checkbox"
                    id="drawerToggle"
                    className="drawer-toggle"
                />
                <div className="drawer-content">
                    <div className="navbar bg-base-100 bg-opacity-50 backdrop-blur-lg fixed top-0 shadow-sm z-10">
                        <div className="flex-none">
                            <label
                                htmlFor="drawerToggle"
                                className="btn btn-square btn-ghost"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="inline-block h-5 w-5 stroke-current"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    ></path>
                                </svg>
                            </label>
                        </div>
                        <div className="flex-1">
                            <a className="btn btn-ghost text-xl">
                                <img
                                    src={"/img/HeaderLogo.svg"}
                                    alt="logo"
                                    className="w-[6rem] object-contain"
                                />
                            </a>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-800">
                                {examData ? (
                                    <>
                                        {timerContext.timer.hour}:
                                        {timerContext.timer.minutes}:
                                        {timerContext.timer.seconds}
                                    </>
                                ) : (
                                    <></>
                                )}
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="drawer-side z-10">
                    <label
                        htmlFor="drawerToggle"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    ></label>
                    <div className="menu bg-base-100 h-full w-80 p-4 text-gray-600">
                        <div className="flex w-full min-h-[10vh] justify-center">
                            <img
                                src={"/img/HeaderLogo.svg"}
                                alt="logo"
                                className="w-[6rem] object-contain"
                            />
                        </div>
                        <ul>
                            <li className="my-2">
                                <h3 className="text-xl font-bold btn btn-ghost justify-start hover:bg-white">
                                    {examData?.exam_name}
                                </h3>
                            </li>
                            <div className="grid grid-flow-row-dense grid-cols-3 md:grid-cols-3 lg:grid-cols-4 my-5 gap-4 px-5">
                                {examData?.questions?.map((v, i) => (
                                    <button
                                        className={
                                            "shadow-md cursor-pointer flex justify-center py-2 w-10 rounded-md" +
                                            (i == index
                                                ? " bg-blue-300"
                                                : v.answer != null
                                                ? " bg-[#ff4c1a] text-white"
                                                : " bg-white ")
                                        }
                                        onClick={(ev) => {
                                            setQuestions(v);
                                            setIndex(i);
                                        }}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
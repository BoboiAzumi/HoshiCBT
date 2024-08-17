import { Exam } from "@/app/api/[[...route]]/types/exam"
import Modal from "./modal"

type SessionData = {
    show: boolean,
    setShow: Function,
    examSession: any[]
}

export function SessionList(p: SessionData){
    return (
        <Modal show={p.show} setShow={p.setShow} className="bg-white p-5 w-[70vw] h-[70vh] rounded-md">
            {p.examSession.length > 0 ? (
                <div className="overflow-y-scroll h-[60vh]">
                    <h4 className="text-gray-600 text-center font-semibold">Session Detail</h4>
                    <table className="my-5 rounded-md w-full border border-collapse">
                        <thead>
                            <tr>
                                <th className="text-gray-600 border py-2 px-2">User Name</th>
                                <th className="text-gray-600 border py-2 px-2">Total</th>
                                <th className="text-gray-600 border py-2 px-2">Correct Total</th>
                                <th className="text-gray-600 border py-2 px-2">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {p.examSession.map((v, i) => (
                                <tr>
                                    <td className="text-gray-600 border py-2 px-2 text-center">
                                        {v.user.information.fullname}
                                    </td>
                                    <td className="text-gray-600 border py-2 px-2 text-center">
                                        {v.detail.total}
                                    </td>
                                    <td className="text-gray-600 border py-2 px-2 text-center">
                                        {v.detail.correct_total}
                                    </td>
                                    <td className="text-gray-600 border py-2 px-2 text-center">
                                        {v.detail.score}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className={"flex flex-col items-center justify-center h-[70vh]"}>
                    <img
                        src={"/img/BannerLogo.svg"}
                        alt="logo"
                        className={"w-[10rem] object-contain my-5 animate-bounce"}
                    />
                </div>
            )}
        </Modal>
    )
}
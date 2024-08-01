export type Attachment = {
    type: "image" | "audio",
    from: "upload" | "url"
    source: string
}

export type Answer = {
    text: string,
    correct: boolean,
    index?: number
}

export type Questions = {
    question: string,
    attachment: Attachment[],
    list_answer: Answer[],
    index?: number,
    answer?: number | undefined | null
}

export type Exam = {
    _id?: string,
    class_id: string,
    exam_name: string,
    user_id?: string,
    duration?: number,
    due?: number,
    active?: boolean,
    questions?: Questions[]
}
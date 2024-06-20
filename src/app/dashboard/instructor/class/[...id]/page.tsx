"use client"
import { useParams } from "next/navigation"

export default function AddClass(){
    const { id } = useParams()
    return (
        <>
            {id}
        </>
    )
}
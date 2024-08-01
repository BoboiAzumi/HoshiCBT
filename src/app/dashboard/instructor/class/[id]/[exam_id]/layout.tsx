import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Exam Editor",
    description: "Page for Exam Edit"
}

export default function RootLayout({ children }: { children : React.ReactNode}){
    return (
        <html>
            <body>
                { children }
            </body>
        </html>
    )
}
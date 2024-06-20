import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Add Class",
    description: "Add Class"
}

export default function RootLayout({ children } : { children : React.ReactNode }){
    return (
        <html>
            <body>
                {children}
            </body>
        </html>
    )
}
import LinearLayout from "../components/linearLayout"
import React from "react"
import CircularProgressBar from "../components/CircularProgressBar"
import net from "../tools"
import setCurrentPage from "../index"
import SummaryPage from "./summaryPage"

export default function LoadingPage() {
    net.post("https://api.pegasis.site/public/yrdsb_ta/getmark",
        JSON.parse(localStorage.getItem("account")),
        (statusCode, response) => {
            if (statusCode === 200) {
                sessionStorage.setItem("course-list", response)
                setCurrentPage(<SummaryPage/>)
            } else if (statusCode === 401) {

            } else {
                alert(statusCode)
            }
        })
    return (<LinearLayout className="full-page" vertical align={"center"}>
        <LinearLayout horizontal align={"center"} item={"stretch"}>
            <CircularProgressBar size={64} strokeWidth={6}/>
        </LinearLayout>
    </LinearLayout>)
}
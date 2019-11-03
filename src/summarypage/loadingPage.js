import LinearLayout from "../components/linearLayout"
import React from "react"
import CircularProgressBar from "../components/CircularProgressBar"
import net from "../tools"
import SummaryPage from "./summaryPage"
import Animate from "react-move/Animate"
import {easeQuadInOut} from "d3-ease"

export default function LoadingPage(props) {
    net.post("https://api.pegasis.site/public/yrdsb_ta/getmark",
        JSON.parse(localStorage.getItem("account")),
        (statusCode, response) => {
            if (statusCode === 200) {
                sessionStorage.setItem("course-list", response)
                props.setPage(<SummaryPage setPage={props.setPage}/>)
            } else if (statusCode === 401) {

            } else {
                alert(statusCode)
            }
        })
    return (<Animate
        show={true}
        start={{opacity: 0}}
        enter={{
            opacity: [1],
            timing: {duration: 500, ease: easeQuadInOut}
        }}>
        {({opacity}) => {
            return (<LinearLayout style={{opacity: opacity}} className="full-page background" vertical align={"center"}>
                <LinearLayout horizontal align={"center"} item={"stretch"}>
                    <CircularProgressBar size={64} strokeWidth={6}/>
                </LinearLayout>
            </LinearLayout>)
        }}
    </Animate>)
}
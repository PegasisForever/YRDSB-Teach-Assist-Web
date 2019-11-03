import React from "react"
import {read} from "../dataStore"
import SummaryCard from "./summaryCard"
import "./summary-page.scss"
import LinearLayout from "../components/linearLayout"

export default function SummaryPage() {
    let courseList = read("course-list")
    return (<LinearLayout vertical item={"center"}>

            <LinearLayout className="course-card-list" horizontal wrap>
                {courseList.map(course=>{
                    return <SummaryCard course={course}/>
                })}
            </LinearLayout>
        </LinearLayout>
    )
}
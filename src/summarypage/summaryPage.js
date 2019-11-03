import React from "react"
import SummaryCard from "./summaryCard"
import "./summary-page.scss"
import LinearLayout from "../components/linearLayout"
import {Headline1, Headline5} from "@material/react-typography"
import {Padding} from "../components/padding"
import {SizedBox} from "../components/sizedBox"
import Button from '@material/react-button';
import getString from "../strings"
import LPI from "../components/linearProgressIndicator"

export default function SummaryPage() {
    let courseList = JSON.parse(sessionStorage.getItem("course-list"))
    let total = 0
    let availableCourseCount = 0
    courseList.forEach(course => {
        if (course.overall_mark) {
            total += course.overall_mark
            availableCourseCount++
        }
    })
    let avg = total / availableCourseCount
    return (<LinearLayout vertical item={"center"}>
            <LinearLayout className="full-width" horizontal align={"space-between"} item={"center"}>
                <LinearLayout className="full-width" horizontal align={"start"} item={"center"}>
                    <Padding all={16}>
                        <img src={"/launcher192.png"} width={50} alt={"logo"}/>
                    </Padding>
                    <Headline5 className="title">YRDSB Teach Assist</Headline5>
                </LinearLayout>
                <Button className="logout-btn" outlined onClick={()=>{
                    sessionStorage.removeItem("course-list")
                    localStorage.removeItem("account")
                    window.location.reload();
                }}>
                    {getString("logout")}
                </Button>
                <SizedBox width={16}/>
            </LinearLayout>
            {!Number.isNaN(avg) ? [
                <SizedBox height={8}/>,
                <Headline5>{getString("average")}</Headline5>,
                <SizedBox height={8}/>,
                <Headline1 className="average">{Math.round(avg * 10) / 10 + "%"}</Headline1>,
                <SizedBox height={8}/>,
                <LPI width={400} value={avg}/>
                ] : null}
            <SizedBox height={48}/>
            <LinearLayout className="course-card-list" horizontal wrap align={"center"}>
                {courseList.map(course => {
                    return <SummaryCard key={course.code} course={course}/>
                })}
                <SizedBox width={524}/>
            </LinearLayout>
        </LinearLayout>
    )
}
import React, {Component} from "react"
import Card, {CardPrimaryContent} from "@material/react-card"
import {SizedBox} from "../components/sizedBox"
import {Padding} from "../components/padding"
import {Headline5, Subtitle1} from "@material/react-typography"
import {read} from "../dataStore"
import {getDisplayName} from "../courseUtilities"
import getString from "../strings"
import LPI from "../components/linearProgressIndicator"

function SummaryCard(props) {
    let course=props.course
    let subTitleStrs=[]
    if (course.block!==""){
        subTitleStrs.push(getString("period_number").replace("%s",course.block))
    }
    if (course.room!==""){
        subTitleStrs.push(getString("room_number").replace("%s",course.room))
    }
    return (
        <Card>
            <CardPrimaryContent>
                <Padding all={16}>
                    <Headline5>{getDisplayName(course)}</Headline5>
                    <Subtitle1>{subTitleStrs.join(" - ")}</Subtitle1>
                    <LPI width={300} value={course.overall_mark} text={course.overall_mark+"%"}/>
                </Padding>
            </CardPrimaryContent>
        </Card>
    )
}

export default function SummaryPage() {
    let courseList=read("course-list")
    return <SizedBox width={400} height={150}>
        <SummaryCard course={courseList[0]}/>
    </SizedBox>
}
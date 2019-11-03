import React,{Fragment} from "react"
import {getCourseOverallList, getDisplayName} from "../courseUtilities"
import getString from "../strings"
import Card, {CardPrimaryContent} from "@material/react-card"
import {Padding} from "../components/padding"
import LinearLayout from "../components/linearLayout"
import {Headline5, Subtitle1} from "@material/react-typography"
import {SizedBox} from "../components/sizedBox"
import LPI from "../components/linearProgressIndicator"

function line(pointA, pointB) {
    const lengthX = pointB[0] - pointA[0]
    const lengthY = pointB[1] - pointA[1]
    return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
    }
}

function controlPoint(current, previous, next, reverse) {
    const p = previous || current
    const n = next || current
    const o = line(p, n)

    const angle = o.angle + (reverse ? Math.PI : 0)
    const length = o.length * 0.2

    const x = current[0] + Math.cos(angle) * length
    const y = current[1] + Math.sin(angle) * length
    return [x, y]
}

function bezier(point, i, a) {
    const cps = controlPoint(a[i - 1], a[i - 2], point)

    const cpe = controlPoint(point, a[i - 1], a[i + 1], true)
    return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`
}

function getOverallChart(course, width, height) {
    let space = width / (course.assignments.length - 1)
    let points = getCourseOverallList(course).map(overall => {
        return [overall[0] * space, width - overall[1] * width / 100]
    })
    if (points[0][0]!==0){ //if index of first point isn't zero
        points.unshift([0,points[0][1]])
    }
    let d = points.reduce((acc, point, i, a) => i === 0
        ? `M ${point[0]},${point[1]}`
        : `${acc} ${bezier(point, i, a)}`
        , '')

    return (<div style={{width: width + "px", height: height + "px"}}>
        <svg viewBox={`0 0 ${width} ${height}`} version="1.1" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: "rgb(128,216,255)", stopOpacity: 1}}/>
                    <stop offset="100%" style={{stopColor: "rgb(128,216,255)", stopOpacity: 0.05}}/>
                </linearGradient>
            </defs>
            <path d={d + " v " + (height - points[points.length - 1][1]) + ` h -${width} z`} fill="url(#grad1)"
                  stroke="none"/>
            <path d={d} fill="none" stroke="#038FCE" strokeWidth={2}/>
        </svg>
    </div>)
}

export default function SummaryCard(props) {
    let course = props.course
    let subTitleStrs = []
    if (course.block !== "") {
        subTitleStrs.push(getString("period_number").replace("%s", course.block))
    }
    if (course.room !== "") {
        subTitleStrs.push(getString("room_number").replace("%s", course.room))
    }
    return (<Padding all={16}>
            <SizedBox width={492}>
                <Card>
                    <CardPrimaryContent>
                        <Padding all={24}>
                            <LinearLayout horizontal item={"center"}>
                                <LinearLayout vertical>
                                    <Headline5>{getDisplayName(course)}</Headline5>
                                    <SizedBox height={8}/>
                                    <Subtitle1>{subTitleStrs.join(" - ")}</Subtitle1>
                                    <SizedBox height={24}/>
                                    <LPI width={course.overall_mark ? 300 : 444}
                                         value={course.overall_mark}
                                         text={course.overall_mark ? (course.overall_mark + "%") : getString("marks_unavailable")}/>
                                </LinearLayout>
                                {course.overall_mark ? <Fragment>
                                    <SizedBox width={24}/>
                                    {getOverallChart(course, 120, 94)}
                                </Fragment> : null}
                            </LinearLayout>
                        </Padding>
                    </CardPrimaryContent>
                </Card>
            </SizedBox>
        </Padding>
    )
}
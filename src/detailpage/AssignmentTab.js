import React, {Component, Fragment} from "react"
import LinearLayout from "../components/linearLayout"
import {SizedBox} from "../components/sizedBox"
import {Body1, Headline5} from "@material/react-typography"
import {Padding} from "../components/padding"
import {getAverage, isNoWeight, categories} from "../courseUtilities"
import getString from "../strings"
import Divider from "./Divider"

let smallmarkColors = {
    "KU": "#ffeb3b",
    "T": "#8bc34a",
    "C": "#9fa8da",
    "A": "#ffb74d",
    "O": "#90a4ae",
    "F": "#81d4fa",
}

function SmallmarkBar(props) {
    let smallmark = props.smallmark
    let x = props.x
    let height = props.height
    let category = props.category

    let color = smallmarkColors[category]
    let hPadding = 6
    let vPadding = 34
    let percent = smallmark ? (smallmark.get / smallmark.total) : 0
    let barHeight = (height - vPadding * 2) * percent
    let barCornerR = barHeight <= 5 ? barHeight : 5

    return <Fragment>
        {smallmark ? <path
            d={`M${x + barCornerR + hPadding},${vPadding + (height - vPadding * 2) * (1 - percent)} h${50 - barCornerR * 2 - hPadding * 2}
                a${barCornerR},${barCornerR} 0 0 1 ${barCornerR},${barCornerR}
                v${barHeight - barCornerR} h-${50 - hPadding * 2} v-${barHeight - barCornerR}
                a${barCornerR},${barCornerR} 0 0 1 ${barCornerR},-${barCornerR} z`}
            fill={color} stroke="none" strokeWidth="0"/> : null}

        <text className="category" x={x + 25} y={height - 20}>
            {getString(category.toLowerCase() + "_single")}</text>

        {smallmark ? <Fragment>
                <text className="get" x={x + 25} y={height - vPadding - barHeight - 8}>
                    {Math.floor(smallmark.get * 10) / 10}/{Math.floor(smallmark.total * 10) / 10}</text>
                <text className="percent" x={x + 25} y={height - vPadding - barHeight - 22}>
                    {Math.floor(percent * 10) * 10}</text>
                <text className="weight" x={x + 25} y={height - 6}>
                    {getString("w:") + smallmark.weight}</text>
            </Fragment> :
            <text className="percent" x={x + 25} y={height - vPadding - barHeight - 8}>
                N/A</text>}

    </Fragment>
}

function SmallMarkChart(props) {
    let assi = props.assignment
    let height = 180
    let smallmarkBars = []
    categories.forEach((category, i) => {
        if (i < 4 || assi[category]) {
            if (assi[category]) {
                assi[category].forEach(smallMark => {
                    smallmarkBars.push(<SmallmarkBar key={category} x={smallmarkBars.length * 50} height={height}
                                                     category={category}
                                                     smallmark={smallMark}/>)
                })
            } else {
                smallmarkBars.push(<SmallmarkBar key={category} x={smallmarkBars.length * 50} height={height}
                                                 category={category}
                                                 smallmark={null}/>)
            }
        }
    })
    return <Padding t={16} b={16}>
        <SizedBox width={smallmarkBars.length * 50} height={height}>
            <svg
                width={smallmarkBars.length * 50 + "px"}
                height={height + "px"}>
                {smallmarkBars}
            </svg>
        </SizedBox>
    </Padding>
}

function AssignmentListItem(props) {
    let assi = props.assignment
    let avg = getAverage(assi, props.weights)
    return <SizedBox width={750}>
        <Padding l={32} r={32}>
            <LinearLayout horizontal align={"space-between"}>
                <Padding t={32} b={32} r={16}>
                    <Headline5 className="selectable" style={{marginBottom: "8px"}}>{assi.name}</Headline5>
                    {avg ? <Body1
                        className="assignment-desc selectable">{getString("avg:") + Math.floor(avg * 10) / 10 + "%"}</Body1> : null}
                    {isNoWeight(assi) ?
                        <Body1 className="assignment-desc selectable">{getString("no_weight")}</Body1> : null}
                    {assi.feedback !== "" ?
                        <Body1 className="assignment-feedback selectable">{assi.feedback}</Body1> : null}
                </Padding>
                <SmallMarkChart assignment={assi}/>
            </LinearLayout>
        </Padding>
    </SizedBox>
}

class AssignmentList extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return false
    }

    render() {
        let assignments = this.props.assignments.slice().reverse()
        return assignments.map((assignment, i) => {
            return <Fragment key={assignment.name}>
                <AssignmentListItem assignment={assignment} weights={this.props.weights}/>
                {i === assignments.length - 1 ? null : <Divider/>}
            </Fragment>
        })
    }
}

export default class AssignmentTab extends Component {
    render() {
        let assignments = this.props.assignments
        return <LinearLayout vertical item={"center"} style={{
            transform: `translateX(${this.props.tabOffset}px)`,
            position: "absolute", width: "100%"
        }}>
            {assignments.length > 0 ?
                <AssignmentList assignments={assignments} weights={this.props.weights}/> :
                <Headline5
                    style={{marginTop: (window.innerHeight / 2 - 200) + "px"}}>{getString("assignments_unavailable")}</Headline5>}
        </LinearLayout>
    }
}
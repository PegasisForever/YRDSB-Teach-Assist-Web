import React, {Component, Fragment} from "react"
import SummaryCard from "./summaryCard"
import "./summary-page.scss"
import LinearLayout from "../components/linearLayout"
import {Headline1, Headline5} from "@material/react-typography"
import {Padding} from "../components/padding"
import {SizedBox} from "../components/sizedBox"
import Button from '@material/react-button'
import getString from "../strings"
import LPI from "../components/linearProgressIndicator"
import LoginPage from "../loginpage/loginPage"
import {easeExpInOut, easeQuadInOut} from "d3-ease"
import Animate from "react-move/Animate"
import DetailPage from "../detailpage/detailPage"
import domtoimage from "dom-to-image"
import {getAnimationScale} from "../index"

function AnimateCard(props) {
    return props.url ? <Animate
        show={true}
        start={{x: props.startX, y: props.startY, width: props.width, height: props.height, opacity: 1}}
        enter={{
            x: [300], y: [0], width: [window.innerWidth - 300], height: [window.innerHeight],
            opacity: [-0.5],
            timing: {duration: 500 * getAnimationScale(), ease: easeExpInOut}
        }}>
        {({x, y, width, height, opacity}) => {
            return <img className="animation-card" width={width + "px"}
                        height={height + "px"}
                        style={{left: x + "px", top: y + "px", opacity: opacity}}
                        src={props.url}
                        alt=""/>
        }}
    </Animate> : <SizedBox/>
}

export default class SummaryPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            courseList: JSON.parse(sessionStorage.getItem("course-list")),
            animatedCardSvgUrl: undefined,
            animationStartX: undefined,
            animationStartY: undefined,
            animationWidth: undefined,
            animationHeight: undefined,
            selectedCourseIndex: undefined,
            opacity: 1,
        }
        this.cardRefs = []
        this.logout = this.logout.bind(this)
        this.openDetailPage = this.openDetailPage.bind(this)
        sessionStorage.setItem("state", "summary")
    }

    logout() {
        this.setState({
            opacity: 0
        })
        this.props.setPage(<LoginPage setPage={this.props.setPage}/>, () => {
            sessionStorage.removeItem("course-list")
            localStorage.removeItem("account")
            sessionStorage.removeItem("account")
        })
    }

    openDetailPage(index) {
        let self = this
        let node = this.cardRefs[index].current
        let w = node.offsetWidth
        let h = node.offsetHeight
        let rect = node.getBoundingClientRect()
        domtoimage.toSvg(this.cardRefs[index].current)
            .then(function (dataUrl) {
                self.setState({
                    selectedCourseIndex: index,
                    animatedCardSvgUrl: dataUrl,
                    animationStartX: rect.left,
                    animationStartY: rect.top,
                    animationWidth: w,
                    animationHeight: h
                })
                self.props.setPage(React.createElement(
                    DetailPage,
                    {
                        setPage: self.props.setPage,
                        selectedCourse: index,
                        startX: rect.left,
                        startY: rect.top,
                        startWidth: w,
                        startHeight: h,
                    }
                ), () => {
                }, 400)
            })
    }

    render() {
        let courseList = this.state.courseList
        let total = 0
        let availableCourseCount = 0
        courseList.forEach(course => {
            if (course.overall_mark) {
                total += course.overall_mark
                availableCourseCount++
            }
        })
        let avg = total / availableCourseCount

        return (<Animate
                show={true}
                start={{opacity: 0}}
                enter={{
                    opacity: [this.state.opacity],
                    timing: {duration: 500 * getAnimationScale(), ease: easeQuadInOut}
                }}
                update={{
                    opacity: [this.state.opacity],
                    timing: {duration: 500 * getAnimationScale(), ease: easeQuadInOut},
                }}>
                {({opacity}) => {
                    return <LinearLayout style={{opacity: opacity}} className="full-page" vertical
                                         item={"center"}>
                        <AnimateCard url={this.state.animatedCardSvgUrl}
                                     startX={this.state.animationStartX}
                                     startY={this.state.animationStartY}
                                     width={this.state.animationWidth}
                                     height={this.state.animationHeight}/>
                        <LinearLayout className="full-width" horizontal align={"space-between"} item={"center"}>
                            <LinearLayout className="full-width" horizontal align={"start"} item={"center"}>
                                <Padding all={16}>
                                    <img src={"/launcher192.png"} width={50} alt={"logo"}/>
                                </Padding>
                                <Headline5 className="title">YRDSB Teach Assist</Headline5>
                            </LinearLayout>
                            <LinearLayout horizontal align={"end"} item={"center"}>
                                <Button className="logout-btn" outlined onClick={this.logout}>
                                    {getString("logout")}
                                </Button>
                                <SizedBox width={16}/>
                            </LinearLayout>
                        </LinearLayout>
                        {!Number.isNaN(avg) ? <Fragment>
                            <SizedBox height={8}/>
                            <Headline5>{getString("average")}</Headline5>
                            <SizedBox height={8}/>
                            <Headline1 className="average">{Math.round(avg * 10) / 10 + "%"}</Headline1>
                            <SizedBox height={8}/>
                            <LPI width={400} value={avg}/>
                        </Fragment> : null}
                        <SizedBox height={32}/>
                        <LinearLayout className="course-card-list" horizontal wrap align={"center"}>
                            {courseList.map((course, i) => {
                                if (this.cardRefs.length !== i) {
                                    this.cardRefs = []
                                }
                                let ref = React.createRef()
                                this.cardRefs.push(ref)
                                return i === this.state.selectedCourseIndex ?
                                    <SizedBox key={course.code}
                                              width={this.state.animationWidth + 32}
                                              height={this.state.animationHeight + 32}/> :
                                    <SummaryCard
                                        key={course.code}
                                        r={ref}
                                        course={course}
                                        onClick={() => {
                                            this.openDetailPage(i)
                                        }}/>
                            })}
                            <SizedBox width={524}/>
                        </LinearLayout>
                    </LinearLayout>
                }}
            </Animate>
        )

    }
}
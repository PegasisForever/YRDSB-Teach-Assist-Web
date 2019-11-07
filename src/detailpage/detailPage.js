import React, {Component, Fragment} from "react"
import Card, {CardPrimaryContent} from "@material/react-card"
import {Padding} from "../components/padding"
import {Body1, Headline4, Headline5} from "@material/react-typography"
import LinearLayout from "../components/linearLayout"
import {getDisplayName, getPeriodRoom} from "../courseUtilities"
import LPI from "../components/linearProgressIndicator"
import getString from "../strings"
import {SizedBox} from "../components/sizedBox"
import MaterialIcon from "@material/react-material-icon"
import TabBar from "@material/react-tab-bar"
import Tab from "@material/react-tab"
import {easeCubicInOut, easeExpInOut} from "d3-ease"
import Animate from "react-move/Animate"
import IconButton from '@material/react-icon-button'
import {getAnimationScale} from "../index"
import SummaryPage from "../summarypage/summaryPage"

function SidePanel(props) {
    let selectedCode = props.courseList[props.selected].code
    return <Animate
        show={true}
        start={{offset: props.fadeTransition ? 0 : -300, opacity: 0}}
        enter={{
            offset: [props.offset], opacity: [props.opacity],
            timing: {duration: 500 * getAnimationScale(), ease: easeExpInOut}
        }}
        update={{
            offset: [props.offset], opacity: [props.opacity],
            timing: {duration: 500 * getAnimationScale(), ease: easeExpInOut}
        }}>
        {({offset, opacity}) => {
            return <Card style={{transform: `translate(${offset}px)`, opacity: opacity}} className="side-panel">
                <LinearLayout className="full-width" horizontal align={"start"} item={"center"}>
                    <Padding all={16}>
                        <img src={"/launcher192.png"} width={50} alt={"logo"}/>
                    </Padding>
                    <Headline5 className="title">YRDSB Teach Assist</Headline5>
                </LinearLayout>
                {props.courseList.map((course, i) => {
                    return <CardPrimaryContent className={course.code === selectedCode ? "selected" : ""}
                                               key={course.code}
                                               onClick={() => {
                                                   props.onClick(i)
                                               }}>
                        <Padding all={16}>
                            <LinearLayout horizontal align={"space-between"} item={"center"}>
                                <div>
                                    <Headline5>{getDisplayName(course)}</Headline5>
                                    <SizedBox height={8}/>
                                    <LPI width={228}
                                         height={10}
                                         value={course.overall_mark}/>
                                </div>
                                <MaterialIcon icon="chevron_right"/>
                            </LinearLayout>
                        </Padding>


                    </CardPrimaryContent>
                })}
            </Card>
        }}
    </Animate>
}

class MainPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabIndex: props.initTabIndex
        }
        this.updateTabIndex = this.updateTabIndex.bind(this)
    }

    updateTabIndex(i) {
        sessionStorage.setItem("tab-index", i.toString())
        this.setState({
            tabIndex: i
        })
    }

    render() {
        return <Animate
            show={true}
            start={{
                x: this.props.startX, y: this.props.startY,
                width: this.props.startWidth, height: this.props.startHeight,
                opacity: 0
            }}
            enter={{
                x: [300], y: [0],
                width: [window.innerWidth - 300], height: [window.innerHeight],
                opacity: [this.props.opacity],
                timing: {duration: 550 * getAnimationScale(), ease: easeExpInOut}
            }}
            update={{
                opacity: [this.props.opacity],
                timing: {duration: 500 * getAnimationScale(), ease: easeCubicInOut}
            }}
        >
            {({x, y, width, height, opacity}) => {
                return <div className="main-panel-root"
                            style={opacity === 1 ? undefined : {
                                left: x + "px", top: y + "px",
                                opacity: opacity,
                                width: width + "px",
                                height: height + "px"
                            }}>
                    <TitleBar course={this.props.course}
                              tabIndex={this.state.tabIndex}
                              onUpdate={this.updateTabIndex}
                              onExit={this.props.onExit}/>
                </div>
            }}
        </Animate>
    }
}

function TitleBar(props) {
    let course = props.course
    return <LinearLayout className="title-bar" vertical>
        <IconButton className="back-button" onClick={props.onExit}>
            <MaterialIcon icon="arrow_back"/>
        </IconButton>
        <Padding all={32} l={76}>
            <LinearLayout horizontal item={"end"}>
                <div>
                    {course.name !== "" ? <Fragment>
                        <Headline4>{course.name}</Headline4>
                        <SizedBox height={8}/>
                        <Body1>{course.code}</Body1>
                    </Fragment> : <Fragment>
                        <Headline4>{course.code}</Headline4>
                        <SizedBox height={8}/>
                    </Fragment>}
                    <Body1>{getPeriodRoom(course)}</Body1>
                </div>
                <SizedBox width={128}/>
                <div>
                    <Body1>{getString("course_about_starttime:") + course.start_time}</Body1>
                    <Body1>{getString("course_about_endtime:") + course.end_time}</Body1>
                </div>
            </LinearLayout>
        </Padding>
        <TabBar
            className="tab-bar"
            activeIndex={props.tabIndex}
            handleActiveIndexUpdate={props.onUpdate}>
            <Tab>
                <span className='mdc-tab__text-label'>{getString("assignments")}</span>
            </Tab>
            <Tab>
                <span className='mdc-tab__text-label'>{getString("statistics")}</span>
            </Tab>
        </TabBar>
    </LinearLayout>
}

export default class DetailPage extends Component {
    constructor(props) {
        super(props)
        let courses = JSON.parse(sessionStorage.getItem("course-list"))
        let selectedCourse
        if (props.selectedCourse) {
            selectedCourse = props.selectedCourse
        } else if (sessionStorage.getItem("selected-course")) {
            selectedCourse = parseInt(sessionStorage.getItem("selected-course"))
        } else {
            selectedCourse = 0
        }
        this.initTabIndex = sessionStorage.getItem("tab-index") ?
            parseInt(sessionStorage.getItem("tab-index")) : 0
        this.state = {
            selectedCourse: selectedCourse,
            courseList: courses,
            sidePanelOffset: 0,
            sidePanelOpacity:1,
            mainPanelOpacity: 1,
        }

        sessionStorage.setItem("selected-course", selectedCourse.toString())
        sessionStorage.setItem("state", "detail")
        this.onSidePanelClick = this.onSidePanelClick.bind(this)
        this.onExit = this.onExit.bind(this)
    }

    onSidePanelClick(index) {
        sessionStorage.setItem("selected-course", index.toString())
        sessionStorage.removeItem("tab-index")
        this.initTabIndex = 0
        this.setState({
            selectedCourse: index
        })
    }

    onExit() {
        this.setState({
            sidePanelOffset: -300,
            sidePanelOpacity:0,
            mainPanelOpacity: 0
        })
        this.props.setPage(<SummaryPage setPage={this.props.setPage}/>, () => {
            sessionStorage.removeItem("selected-course")
            sessionStorage.removeItem("tab-index")
        })
    }

    render() {
        let courses = this.state.courseList
        return <div className="full-width">
            <SidePanel courseList={courses}
                       selected={this.state.selectedCourse}
                       onClick={this.onSidePanelClick}
                       offset={this.state.sidePanelOffset}
                       opacity={this.state.sidePanelOpacity}
                       fadeTransition={typeof this.props.startX === "undefined"}/>
            <MainPanel course={courses[this.state.selectedCourse]}
                       initTabIndex={this.initTabIndex}
                       opacity={this.state.mainPanelOpacity}
                       startX={this.props.startX}
                       startY={this.props.startY}
                       startWidth={this.props.startWidth}
                       startHeight={this.props.startHeight}
                       onExit={this.onExit}/>
            <input style={{position: "fixed", left: "-1000000px"}} type="button" autoFocus/>
        </div>
    }
}
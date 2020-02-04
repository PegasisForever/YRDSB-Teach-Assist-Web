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
import {getAnimationScale, getPublicURL, setCurrentPageScroll, setPage} from "../index"
import SummaryPage from "../summarypage/summaryPage"
import AssignmentTab from "./AssignmentTab"
import {StatisticsTab} from "./StatisticsTab"

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
                        <img src={getPublicURL() + "launcher192.png"} width="50px" alt={"logo"}/>
                    </Padding>
                    <Headline5 className="title">YRDSB Teach Assist</Headline5>
                </LinearLayout>
                {props.courseList.map((course, i) => {
                    return <CardPrimaryContent className={course.code === selectedCode ? "selected" : ""}
                                               style={{flexShrink: "0"}}
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
            showSecondBackBtn: false,
            enterAnimationDone: false
        }
        this.scrollListener = this.scrollListener.bind(this)
    }

    componentDidMount() {
        window.addEventListener('scroll', this.scrollListener)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollListener)
    }

    scrollListener(event) {
        let shouldShowButton = event.currentTarget.scrollTop >= 208
        if (shouldShowButton !== this.state.showSecondBackBtn) {
            this.setState({
                showSecondBackBtn: shouldShowButton
            })
        }

    }

    render() {
        return <Animate
            show={true}
            start={{
                tabOffset: -this.props.tabIndex * (window.innerWidth - 300),
                x: this.props.startWidth / 2 + this.props.startX - this.props.startWidth * ((window.innerWidth - 300) / this.props.startWidth) / 2,
                y: this.props.startHeight / 2 + this.props.startY - this.props.startHeight * (window.innerHeight / this.props.startHeight) / 2,
                widthScale: this.props.startWidth / (window.innerWidth - 300),
                heightScale: this.props.startHeight / window.innerHeight,
                opacity: 0
            }}
            enter={{
                x: [300], y: [0],
                widthScale: [1],
                heightScale: [1],
                opacity: [this.props.opacity],
                timing: {duration: 500 * getAnimationScale(), ease: easeExpInOut},
                events: {
                    end: () => this.setState({
                        enterAnimationDone: true
                    })
                }
            }}
            update={{
                tabOffset: [-this.props.tabIndex * (window.innerWidth - 300)],
                opacity: [this.props.opacity],
                timing: {duration: 500 * getAnimationScale(), ease: easeCubicInOut}
            }}>
            {({x, y, widthScale, heightScale, opacity, tabOffset}) => {
                return <div className="main-panel-root"
                            style={{
                                left: x + "px",
                                top: y + "px",
                                opacity: opacity,
                                transform: `scale(${widthScale},${heightScale})`
                            }}
                            onScroll={this.scrollListener}>
                    <Animate
                        show={true}
                        start={{
                            size: 0
                        }}
                        update={{
                            size: [this.state.showSecondBackBtn ? 1 : 0],
                            timing: {duration: 500 * getAnimationScale(), ease: easeCubicInOut}
                        }}>
                        {({size}) => {
                            return <IconButton style={{transform: `scale(${size})`}} className="float-back-button"
                                               onClick={this.props.onExit}>
                                <MaterialIcon icon="arrow_back"/>
                            </IconButton>
                        }}
                    </Animate>
                    <TitleBar course={this.props.course}
                              tabIndex={this.props.tabIndex}
                              onChangeTab={this.props.onChangeTab}
                              onExit={this.props.onExit}
                              showRealBackBtn={this.state.enterAnimationDone}/>
                    {tabOffset > -(window.innerWidth - 300) ?
                        <AssignmentTab
                            key={this.props.course.name ? this.props.course.name : this.props.course.code}
                            assignments={this.props.course.assignments}
                            weights={this.props.course.weight_table}
                            tabOffset={tabOffset}
                            onExit={this.props.onExit}/> : null}
                    {tabOffset < 0 ? <StatisticsTab
                        key={(this.props.course.name ? this.props.course.name : this.props.course.code) + "s"}
                        course={this.props.course}
                        tabOffset={tabOffset + window.innerWidth - 300}/> : null}

                </div>
            }}
        </Animate>
    }
}

function TitleBar(props) {
    let course = props.course
    return <LinearLayout className="title-bar" vertical>
        {props.showRealBackBtn ?
            <IconButton className="back-button" onClick={props.onExit}>
                <MaterialIcon icon="arrow_back"/>
            </IconButton> :
            <Padding className="back-button" all={12}>
                <MaterialIcon icon="arrow_back"/>
            </Padding>}

        <Padding className="selectable" all={32} l={76}>
            <Headline4 style={{whiteSpace: "nowrap"}}>{course.name ? course.name : course.code}</Headline4>
            <SizedBox height={8}/>
            <LinearLayout horizontal>
                <div>
                    {course.name ? <Body1>{course.code}</Body1> : null}
                    <Body1>{getPeriodRoom(course)}</Body1>
                </div>
                <SizedBox width={128}/>
                {(course.start_time && course.end_time) ? <div>
                    <Body1>{getString("course_about_starttime:") + course.start_time}</Body1>
                    <Body1>{getString("course_about_endtime:") + course.end_time}</Body1>
                </div> : null}
            </LinearLayout>
        </Padding>
        <TabBar
            className="tab-bar"
            activeIndex={props.tabIndex}
            handleActiveIndexUpdate={props.onChangeTab}>
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
        let initTabIndex = sessionStorage.getItem("tab-index") ?
            parseInt(sessionStorage.getItem("tab-index")) : 0
        this.state = {
            selectedCourse: selectedCourse,
            tabIndex: initTabIndex,
            courseList: courses,
            sidePanelOffset: 0,
            sidePanelOpacity: 1,
            mainPanelOpacity: 1,
            tabOffset: 0,
        }

        this.onSidePanelClick = this.onSidePanelClick.bind(this)
        this.onChangeTab = this.onChangeTab.bind(this)
        this.onExit = this.onExit.bind(this)
    }

    componentDidMount() {
        sessionStorage.setItem("selected-course", this.state.selectedCourse.toString())
        sessionStorage.setItem("state", "detail")
        document.title = getString("title")
    }

    onSidePanelClick(index) {
        sessionStorage.setItem("selected-course", index.toString())
        this.setState({
            selectedCourse: index
        })
    }

    onChangeTab(index) {
        sessionStorage.setItem("tab-index", index.toString())
        this.setState({
            tabIndex: index
        })
    }

    onExit() {
        this.setState({
            sidePanelOffset: -300,
            sidePanelOpacity: 0,
            mainPanelOpacity: 0
        })
        setPage(<SummaryPage/>, () => {
                sessionStorage.removeItem("selected-course")
                sessionStorage.removeItem("tab-index")
            },
            undefined,
            () => {
                //restore summary page scroll
                let scrollDistance = sessionStorage.getItem("summary-scroll-distance")
                if (scrollDistance) {
                    setCurrentPageScroll(scrollDistance)
                }
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
                       tabIndex={this.state.tabIndex}
                       opacity={this.state.mainPanelOpacity}
                       startX={this.props.startX}
                       startY={this.props.startY}
                       startWidth={this.props.startWidth}
                       startHeight={this.props.startHeight}
                       onExit={this.onExit}
                       onChangeTab={this.onChangeTab}/>
            <input style={{position: "fixed", left: "-1000000px"}} type="button" autoFocus/>
        </div>
    }
}
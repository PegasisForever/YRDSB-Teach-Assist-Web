import React, {Component, Fragment} from "react"
import SummaryCard from "./summaryCard"
import "./summary-page.scss"
import LinearLayout from "../components/linearLayout"
import {Body1, Headline1, Headline5} from "@material/react-typography"
import {Padding} from "../components/padding"
import {SizedBox} from "../components/sizedBox"
import Button from '@material/react-button'
import getString from "../strings"
import LPI from "../components/linearProgressIndicator"
import LoginPage from "../loginpage/loginPage"
import {easeExpInOut, easeQuadInOut} from "d3-ease"
import Animate from "react-move/Animate"
import DetailPage from "../detailpage/detailPage"
import {
    getAnimationScale,
    getCurrentPageScroll,
    getPublicURL,
    setPage,
    showDialog
} from "../index"
import {ConfirmDialog, CustomDialog} from "../components/alert"
import {DialogButton, DialogContent, DialogFooter} from "@material/react-dialog"

function AnimateCard(props) {
    return props.course ? <Animate
        show={true}
        start={{x: props.startX, y: props.startY, widthScale: 1, heightScale: 1, opacity: 1}}
        enter={{
            x: [(window.innerWidth - 300) / 2 + 300 - props.width / 2],
            y: [window.innerHeight / 2 - props.height / 2],
            widthScale: [(window.innerWidth - 300) / (props.width)],
            heightScale: [(window.innerHeight) / (props.height + 2)],
            opacity: [-0.5],
            timing: {duration: 500 * getAnimationScale(), ease: easeExpInOut}
        }}>
        {({x, y, widthScale, heightScale, opacity}) => {
            return (<SummaryCard
                noPadding
                course={props.course}
                onClick={() => {
                }}
                style={{
                    position: "fixed",
                    zIndex: "500",
                    transform: `scale(${widthScale},${heightScale})`,
                    left: x + "px", top: y + "px", opacity: opacity
                }}
            />)
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
        this.openMoodle = this.openMoodle.bind(this)
        this.openAppDialog = this.openAppDialog.bind(this)
        this.openAboutDialog = this.openAboutDialog.bind(this)
        this.openDetailPage = this.openDetailPage.bind(this)
    }

    componentDidMount() {
        sessionStorage.setItem("state", "summary")
        document.title = getString("title")
    }

    logout() {
        showDialog(<ConfirmDialog
            content={getString("are_you_sure_to_logout")}
            confirmText={getString("logout")}
            onConfirm={() => {
                this.setState({
                    opacity: 0
                })
                setPage(<LoginPage/>, () => {
                    sessionStorage.removeItem("course-list")
                    localStorage.removeItem("account")
                    sessionStorage.removeItem("account")
                })
            }
            }/>)
    }

    openMoodle() {
        window.open("https://moodle2.yrdsb.ca/login/index.php")
    }

    openAppDialog() {
        showDialog(<CustomDialog>
            <DialogContent style={{paddingBottom: "0"}}>
                <LinearLayout vertical align={"center"} item={"center"}>
                    <img src={getPublicURL() + "launcher192.png"} width="100px" alt={"logo"}/>
                    <p style={{marginTop: "0"}}>
                        {getString("for_android_ios")}
                    </p>
                    <span>
                        {getString("app_desc").split("\n").reduce((r, a) => r.concat(a, <br/>), [])}
                    </span>
                    <LinearLayout horizontal align={"center"} item={"center"} style={{marginTop:"8px"}}>
                        <a href="https://play.google.com/store/apps/details?id=site.pegasis.yrdsb.ta&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
                           target="_blank">
                            <img alt="Get it on Google Play"
                                 src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                                 width="200px"/>
                        </a>
                        <a href="https://apps.apple.com/us/app/yrdsb-teach-assist/id1483082868?ls=1"
                           target="_blank">
                            <img alt="Download on the App Store"
                                 src={getPublicURL() + "about/app_store_badge.svg"}
                                 width="178px"/>
                        </a>
                    </LinearLayout>
                </LinearLayout>
            </DialogContent>
            <DialogFooter>
                <DialogButton action="ok">{getString("ok")}</DialogButton>
            </DialogFooter>
        </CustomDialog>)
    }

    openAboutDialog() {
        showDialog(<CustomDialog>
            <DialogContent style={{paddingBottom: "0"}}>
                <LinearLayout vertical align={"center"} item={"center"}>
                    <img src={getPublicURL() + "launcher192.png"} width="100px" alt={"logo"}/>
                    <Headline5 style={{paddingTop: "0"}}>
                        YRDSB Teach Assist Web
                    </Headline5>
                    <Body1>By <a href={"https://me.pegasis.site/"} target="_blank">Pegasis</a></Body1>
                    <SizedBox height={16}/>
                    <Body1><a href={"https://github.com/PegasisForever/YRDSB-Teach-Assist-Web"} target="_blank">Repository on Github</a></Body1>
                    <Body1><a href={"https://api.pegasis.site/docs/ta_public_api/"} target="_blank">TA Public API</a></Body1>
                </LinearLayout>
            </DialogContent>
            <DialogFooter>
                <DialogButton action="ok">{getString("ok")}</DialogButton>
            </DialogFooter>
        </CustomDialog>)
    }

    openDetailPage(index) {
        sessionStorage.setItem("summary-scroll-distance", getCurrentPageScroll())

        let self = this
        let node = this.cardRefs[index].current
        let w = node.offsetWidth
        let h = node.offsetHeight
        let rect = node.getBoundingClientRect()

        self.setState({
            selectedCourseIndex: index,
            animationStartX: rect.left,
            animationStartY: rect.top,
            animationWidth: w,
            animationHeight: h
        })

        setPage(React.createElement(
            DetailPage,
            {
                selectedCourse: index,
                startX: rect.left,
                startY: rect.top,
                startWidth: w,
                startHeight: h,
            }
        ), () => {
        }, 400)
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
                        <AnimateCard
                            course={courseList[this.state.selectedCourseIndex]}
                            startX={this.state.animationStartX}
                            startY={this.state.animationStartY}
                            width={this.state.animationWidth}
                            height={this.state.animationHeight}/>
                        <LinearLayout className="full-width" horizontal align={"space-between"} item={"center"}>
                            <LinearLayout className="full-width" horizontal align={"start"} item={"center"}>
                                <Padding all={16}>
                                    <img src={getPublicURL() + "launcher192.png"} width="50px" alt={"logo"}/>
                                </Padding>
                                <Headline5 className="title">YRDSB Teach Assist</Headline5>
                            </LinearLayout>
                            <LinearLayout horizontal align={"end"} item={"center"}>
                                <Button className="nav-btn" outlined onClick={this.openAboutDialog}>
                                    {getString("about")}
                                </Button>
                                <Button className="nav-btn" outlined onClick={this.openAppDialog}>
                                    {getString("app")}
                                </Button>
                                <Button className="nav-btn" outlined onClick={this.openMoodle}>
                                    {getString("moodle")}
                                </Button>
                                <Button className="nav-btn" outlined onClick={this.logout}>
                                    {getString("logout")}
                                </Button>
                                <SizedBox width={16}/>
                            </LinearLayout>
                        </LinearLayout>
                        {Number.isFinite(avg) ? <Fragment>
                            <SizedBox height={8}/>
                            <Headline5>{getString("average")}</Headline5>
                            <SizedBox height={8}/>
                            <Headline1 className="average selectable">{Math.round(avg * 10) / 10 + "%"}</Headline1>
                            <SizedBox height={8}/>
                            <LPI width={400} value={avg}/>
                        </Fragment> : null}
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
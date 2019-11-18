import LinearLayout from "../components/linearLayout"
import React, {Component, Fragment} from "react"
import {SizedBox} from "../components/sizedBox"
import {Headline1, Headline5} from "@material/react-typography"
import getString from "../strings"
import LPI from "../components/linearProgressIndicator"
import Divider from "./Divider"
import {ResponsiveLine} from "@nivo/line"
import {getCourseOverallList} from "../courseUtilities"

const shortNameMap = {
    "KU": "knowledge_understanding",
    "T": "thinking",
    "C": "communication",
    "A": "application"
}

const colorMap = {
    "KU": "#c49000",
    "T": "#388e3c",
    "C": "#3949ab",
    "A": "#ef6c00",
}

const pieDataItems = ["KU", "T", "C", "A", "F"]

function getChartData(course, category) {
    if (category === "overall") {
        return {
            data: [{
                id: category,
                data: getCourseOverallList(course).map((item) => ({"x": item[0], "y": Math.floor(item[1] * 10) / 10}))
            }],
            color: "#03a9f4"
        }
    } else {
        return {
            data: [{
                id: category,
                data: course.assignments.map((assi, i) => (
                    (assi[category] && assi[category].finished) ?
                        {"x": i, "y": Math.floor(assi[category].get / assi[category].total * 10) * 10} : undefined))
                    .filter((point) => point)
            }],
            color: colorMap[category]
        }
    }
}

class Chart extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        let thisCourse = this.props.course.name ? this.props.course.name : this.props.course.code
        let nextCourse = nextProps.course.name ? nextProps.course.name : nextProps.course.code
        return thisCourse !== nextCourse
    }

    render() {
        let course = this.props.course
        let category = this.props.category
        let chartData = getChartData(course, category)
        return <LinearLayout vertical>
            {category !== "overall" ? <Fragment>
                <SizedBox height={32}/>
                <Headline5 className="selectable">{getString(shortNameMap[category])}</Headline5>
            </Fragment> : null}
            <SizedBox width={600} height={300}>
                <ResponsiveLine
                    data={chartData.data}
                    margin={{top: 20, right: 32, bottom: 32, left: 32}}
                    xScale={{type: 'linear', min: 0, max: course.assignments.length - 1}}
                    yScale={{type: 'linear', stacked: true, min: 0, max: 100}}
                    curve="catmullRom"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={null}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 0,
                        tickPadding: 20,
                    }}
                    enableGridX={false}
                    isInteractive={false}
                    colors={chartData.color}
                    pointSize={8}
                    pointColor={"#ffffff"}
                    pointBorderWidth={2}
                    pointBorderColor={{from: 'serieColor'}}
                    enablePointLabel={true}
                    pointLabel="y"
                    pointLabelYOffset={-12}
                    enableCrosshair={false}
                    useMesh={true}
                    legends={[]}
                    animate={false}
                />
            </SizedBox>
        </LinearLayout>
    }
}

class StatisticsList extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return false
    }

    render() {
        let course = this.props.course
        return <Fragment>
            <SizedBox height={32}/>
            <Headline5>{getString("overall")}</Headline5>
            <SizedBox height={8}/>
            <Headline1 className="overall selectable">{Math.round(course.overall_mark * 10) / 10 + "%"}</Headline1>
            <SizedBox height={8}/>
            <LPI width={400} value={course.overall_mark}/>
            <SizedBox height={16}/>
            <Chart course={course} category={"overall"}/>
            <Divider/>
            <Chart course={course} category={"KU"}/>
            <Divider/>
            <Chart course={course} category={"T"}/>
            <Divider/>
            <Chart course={course} category={"C"}/>
            <Divider/>
            <Chart course={course} category={"A"}/>
        </Fragment>
    }
}

export function StatisticsTab(props) {
    let course = props.course
    return <LinearLayout vertical item={"center"} style={{
        transform: `translateX(${props.tabOffset}px)`,
        position: "absolute", width: "100%"
    }}>
        {course.overall_mark ? <StatisticsList course={course}/> :
            <Headline5
                style={{marginTop: (window.innerHeight / 2 - 200) + "px"}}>
                {getString("statistics_unavailable")}</Headline5>}
    </LinearLayout>
}
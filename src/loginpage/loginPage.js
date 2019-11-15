import React, {Component, Fragment} from "react"
import LinearLayout from "../components/linearLayout"
import {Body1, Body2, Headline5, Subtitle1} from "@material/react-typography"
import Checkbox from '@material/react-checkbox'
import TextField, {HelperText, Input} from '@material/react-text-field'
import MaterialIcon from '@material/react-material-icon'
import Button from '@material/react-button'
import {SizedBox} from "../components/sizedBox"
import CircularProgressBar from "../components/CircularProgressBar"
import net, {isMobile} from "../tools"
import getString from "../strings"
import SummaryPage from "../summarypage/summaryPage"
import Animate from "react-move/Animate"
import {easeQuadInOut} from "d3-ease"
import {baseUrl, getAnimationScale, getPublicURL, setPage, showDialog} from "../index"
import {Alert} from "../components/alert"

function TATitle() {
    return (<LinearLayout vertical align={"center"} item={"center"}>
        {isMobile() ? <Fragment>
                <img src={getPublicURL() + "launcher192.png"} width="130px" alt="logo"/>
                <Body1 style={{fontSize: "20px"}}>YRDSB</Body1>
                <Body1 style={{fontSize: "20px"}}>Teach Assist</Body1>
            </Fragment> :
            <Fragment>
                <img src={getPublicURL() + "launcher192.png"} width="130px" alt="logo"/>
                <SizedBox height={16}/>
                <Headline5>YRDSB Teach Assist</Headline5>
            </Fragment>}
    </LinearLayout>)
}

function Divider() {
    return (<div className={"vertical-divider"}/>)
}

class LoginForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            number: "",
            numberValid: true,
            password: "",
            passwordValid: true,
            isLoading: false,
            remember: false,
        }

        this.onLogin = this.onLogin.bind(this)
    }

    getStudentNumberTF() {
        return (<TextField
            style={{width: "300px"}}
            label={getString("student_number")}
            leadingIcon={<MaterialIcon icon="account_circle"/>}>
            <Input
                id={"student_number_tf"}
                pattern="^[0-9]*$"
                value={this.state.number}
                isValid={this.state.numberValid}
                onChange={(e) => {
                    if (/[0-9]|^$/.test(e.currentTarget.value))
                        this.setState({number: e.currentTarget.value, numberValid: true})
                }}/>
        </TextField>)
    }

    getPasswordTF() {
        return (<TextField
            style={{width: "300px"}}
            label={getString("password")}
            leadingIcon={<MaterialIcon icon="lock"/>}
            helperText={!this.state.passwordValid ? <HelperText validation>
                {getString("student_number_or_password_incorrect")}
            </HelperText> : null}>
            <Input
                type="password"
                id={"password_tf"}
                value={this.state.password}
                isValid={this.state.passwordValid}
                onChange={(e) => this.setState({password: e.currentTarget.value, passwordValid: true})}/>
        </TextField>)
    }

    getRememberMeCheckBox() {
        return (
            <LinearLayout horizontal item={"center"}>
                <Checkbox
                    nativeControlId="remember-cb"
                    checked={this.state.remember}
                    onChange={(e) => this.setState({
                        remember: e.target.checked
                    })
                    }
                />
                <label htmlFor="remember-cb">
                    <Body2>{getString("remember_me")}</Body2>
                </label>
            </LinearLayout>
        )
    }

    render() {
        return isMobile() ? <LinearLayout vertical align={"center"} item={"center"}>
                <Body1 style={{fontSize: "20px", fontWeight: "500", textAlign: "center"}}>
                    {getString("login_your_account")}</Body1>
                <SizedBox height={18}/>
                <form onSubmit={this.onLogin}>
                    {this.getStudentNumberTF()}
                    <SizedBox height={12}/>
                    {this.getPasswordTF()}
                    <SizedBox height={4}/>
                    {this.getRememberMeCheckBox()}
                    <LinearLayout horizontal align={"end"} item={"center"}>
                        {this.state.isLoading ? <CircularProgressBar/> : null}
                        <SizedBox width={12}/>
                        <Button disabled={this.state.isLoading} raised type="submit"
                                onClick={this.onLogin}>{getString("login")}</Button>
                        <SizedBox width={12}/>
                    </LinearLayout>
                </form>
            </LinearLayout> :
            <LinearLayout vertical align={"center"} item={"stretch"}>
                <Subtitle1 style={{"textAlign": "center"}}>{getString("login_your_account")}</Subtitle1>
                <SizedBox height={8}/>
                <form onSubmit={this.onLogin}>
                    <SizedBox height={8}/>
                    {this.getStudentNumberTF()}
                    <SizedBox height={8}/>
                    {this.getPasswordTF()}
                    <SizedBox height={4}/>
                    {this.getRememberMeCheckBox()}
                    <LinearLayout horizontal align={"end"} item={"center"}>
                        {this.state.isLoading ? <CircularProgressBar/> : null}
                        <SizedBox width={12}/>
                        <Button disabled={this.state.isLoading} raised type="submit"
                                onClick={this.onLogin}>{getString("login")}</Button>
                        <SizedBox width={12}/>
                    </LinearLayout>
                </form>
            </LinearLayout>
    }

    onLogin(event) {
        if (event) {
            event.preventDefault()
        }

        this.setState({
            numberValid: true,
            passwordValid: true,
        })
        if (this.state.number === "") {
            this.setState({
                numberValid: false,
            })
            return
        }
        if (this.state.password === "") {
            this.setState({
                passwordValid: false,
            })
            return
        }

        this.setState({
            isLoading: true,
        })
        net.post(baseUrl + "/getmark",
            {
                number: this.state.number,
                password: this.state.password
            },
            (statusCode, response) => {
                if (statusCode !== 200) {
                    this.setState({
                        isLoading: false,
                    })
                }
                if (statusCode === 200) {
                    sessionStorage.setItem("course-list", response)
                    let account = JSON.stringify({
                        number: this.state.number,
                        password: this.state.password
                    })
                    sessionStorage.setItem("account", account)
                    if (this.state.remember) {
                        localStorage.setItem("account", account)
                    }
                    this.props.gotoSummary()
                } else if (statusCode === 401) {
                    this.setState({
                        passwordValid: false
                    })
                } else if (statusCode === 500) {
                    showDialog(<Alert content={getString("server_internal_error")}/>)
                } else if (statusCode === 0) {
                    showDialog(<Alert content={getString("connection_failed")}/>)
                } else {
                    showDialog(<Alert content={getString("error_code") + statusCode}/>)
                    alert(statusCode)
                }
            })


    }
}


export default class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            opacity: 1
        }
        this.gotoSummary = this.gotoSummary.bind(this)
    }

    updateIsMobile = () => {
        let isMobileNow = isMobile()
        if (isMobileNow !== this.isMobile) {
            this.isMobile = isMobileNow
            this.forceUpdate()
        }
    }

    componentDidMount() {
        sessionStorage.setItem("state", "login")

        window.addEventListener('resize', this.updateIsMobile)
        document.title = getString("login_title")
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateIsMobile)
    }

    gotoSummary() {
        this.setState({
            opacity: 0
        })
        setPage(<SummaryPage/>)
    }

    render() {
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
                return (<LinearLayout style={{opacity: opacity}} className="full-page" vertical
                                      align={"center"}>
                    {isMobile() ?
                        <Fragment>
                            <TATitle/>
                            <SizedBox height={80}/>
                            <LoginForm gotoSummary={this.gotoSummary}/>
                        </Fragment> :
                        <LinearLayout horizontal align={"center"} item={"stretch"}>
                            <TATitle/>
                            <Divider/>
                            <LoginForm gotoSummary={this.gotoSummary}/>
                        </LinearLayout>}
                </LinearLayout>)
            }}
        </Animate>)
    }
}
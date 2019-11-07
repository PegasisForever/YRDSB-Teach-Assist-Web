import React, {Component} from "react"
import LinearLayout from "../components/linearLayout"
import {Body2, Headline5, Subtitle1} from "@material/react-typography"
import Checkbox from '@material/react-checkbox'
import TextField, {HelperText, Input} from '@material/react-text-field'
import MaterialIcon from '@material/react-material-icon'
import Button from '@material/react-button'
import {SizedBox} from "../components/sizedBox"
import CircularProgressBar from "../components/CircularProgressBar"
import net from "../tools"
import getString from "../strings"
import SummaryPage from "../summarypage/summaryPage"
import Animate from "react-move/Animate"
import {easeQuadInOut} from "d3-ease"
import {getAnimationScale} from "../index"

function TATitle() {
    return (<LinearLayout vertical align={"center"} item={"center"}>
        <img src="/launcher192.png" className="logo" alt="logo"/>
        <SizedBox height={16}/>
        <Headline5>YRDSB Teach Assist</Headline5>
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
            passwordIncorrect: false,
            remember: false,
        }

        this.onLogin = this.onLogin.bind(this)
    }

    getStudentNumberTF() {
        return (<TextField
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
            label={getString("password")}
            leadingIcon={<MaterialIcon icon="lock"/>}
            helperText={<HelperText validation>
                {this.state.passwordIncorrect ? getString("student_number_or_password_incorrect") : null}
            </HelperText>}>
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
        return (<LinearLayout vertical align={"center"} item={"stretch"}>
            <Subtitle1 style={{"textAlign": "center"}}>{getString("login_your_account")}</Subtitle1>
            <SizedBox height={8}/>
            <form onSubmit={this.onLogin}>
                <SizedBox height={8}/>
                {this.getStudentNumberTF()}
                <SizedBox height={8}/>
                {this.getPasswordTF()}
                {this.getRememberMeCheckBox()}
                <LinearLayout horizontal align={"end"} item={"center"}>
                    {this.state.isLoading ? <CircularProgressBar/> : null}
                    <SizedBox width={12}/>
                    <Button disabled={this.state.isLoading} raised type="submit"
                            onClick={this.onLogin}>{getString("login")}</Button>
                    <SizedBox width={12}/>
                </LinearLayout>
            </form>
        </LinearLayout>)
    }

    onLogin(event) {
        if (event) {
            event.preventDefault()
        }
        this.setState({
            numberValid: true,
            passwordValid: true,
            passwordIncorrect: false
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
        net.post("https://api.pegasis.site/public/yrdsb_ta/getmark",
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
                    let account=JSON.stringify({
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
                        passwordValid: false,
                        passwordIncorrect: true
                    })
                } else {
                    alert(statusCode)
                }
            })


    }
}

export default class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state={
            opacity:1
        }
        this.gotoSummary = this.gotoSummary.bind(this)
        sessionStorage.setItem("state", "login")
    }

    gotoSummary(){
        this.setState({
            opacity:0
        })
        this.props.setPage(<SummaryPage setPage={this.props.setPage}/>)
    }

    render() {
        return (<Animate
            show={true}
            start={{opacity: 0}}
            enter={{
                opacity: [this.state.opacity],
                timing: {duration: 500*getAnimationScale(), ease: easeQuadInOut}
            }}
            update={{
                opacity: [this.state.opacity],
                timing: { duration: 500*getAnimationScale(), ease: easeQuadInOut },
            }}>
            {({opacity}) => {
                return (<LinearLayout style={{opacity: opacity}} className="full-page" vertical
                                      align={"center"}>
                    <LinearLayout horizontal align={"center"} item={"stretch"}>
                        <TATitle/>
                        <Divider/>
                        <LoginForm gotoSummary={this.gotoSummary}/>
                    </LinearLayout>
                </LinearLayout>)
            }}
        </Animate>)
    }
}
import React, {Component} from "react"
import LinearLayout from "./linearLayout"
import {Headline5, Subtitle1} from "@material/react-typography"
import TextField, {Input, HelperText} from '@material/react-text-field'
import MaterialIcon from '@material/react-material-icon'
import Button from '@material/react-button'
import {SizedBox} from "./sizedBox"
import CircularProgressBar from "./CircularProgressBar"

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
            passwordIncorrect: false
        }

        this.onLogin = this.onLogin.bind(this)
    }

    getStudentNumberTF() {
        return (<TextField
            label="Student Number"
            leadingIcon={<MaterialIcon icon="account_circle"/>}>
            <Input
                pattern="^[0-9]*$"
                value={this.state.number}
                isValid={this.state.numberValid}
                onChange={(e) => {
                    if (/[0-9]|^$/.test(e.currentTarget.value))
                        this.setState({number: e.currentTarget.value})
                }}/>
        </TextField>)
    }

    getPasswordTF() {
        return (<TextField
            label="Password"
            leadingIcon={<MaterialIcon icon="lock"/>}
            helperText={<HelperText validation>
                {this.state.passwordIncorrect ? "Student number or password incorrect." : null}
            </HelperText>}>
            <Input
                type="password"
                value={this.state.password}
                isValid={this.state.passwordValid}
                onChange={(e) => this.setState({password: e.currentTarget.value})}/>
        </TextField>)
    }

    render() {
        return (<LinearLayout vertical align={"center"} item={"stretch"}>
            <Subtitle1 style={{"textAlign": "center"}}>Login Your Account:</Subtitle1>
            <SizedBox height={8}/>
            {this.getStudentNumberTF()}
            <SizedBox height={8}/>
            {this.getPasswordTF()}
            <SizedBox height={4}/>
            <LinearLayout horizontal align={"end"}>
                {this.state.isLoading ? <CircularProgressBar/> : null}
                <SizedBox width={12}/>
                <Button disabled={this.state.isLoading} raised onClick={this.onLogin}>Login</Button>
                <SizedBox width={12}/>
            </LinearLayout>
        </LinearLayout>)
    }

    onLogin() {
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
            passwordValid: false,
            passwordIncorrect: true
        })
    }
}

export class LoginPage extends React.Component {
    render() {
        return (<LinearLayout className="full-page" vertical align={"center"}>
            <LinearLayout horizontal align={"center"} item={"stretch"}>
                <TATitle/>
                <Divider/>
                <LoginForm/>
            </LinearLayout>
        </LinearLayout>)
    }
}
import React, {Component} from "react"

export class SizedBox extends Component {
    constructor(props) {
        super(props)
        this.width = props.width ? props.width + "px" : "0"
        this.height = props.height ? props.height + "px" : "0"
    }

    render() {
        return (<div style={{width: this.width, height: this.height}}>{this.props.children}</div>)
    }
}
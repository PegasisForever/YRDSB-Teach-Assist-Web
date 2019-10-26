import React from "react"
import "./linear-layout.scss"

export default class LinearLayout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        let classes="linear-layout"
        if (this.props.vertical){
            classes+=" vertical"
        }else if(this.props.horizontal){
            classes+=" horizontal"
        }
        if (this.props.reverse){
            classes+=" reverse"
        }
        if (this.props.align){
            classes+=" align-"+this.props.align
        }
        if (this.props.item){
            classes+=" item-"+this.props.item
        }
        if (this.props.className){
            classes+=" "+this.props.className
        }

        return <div className={classes}>
            {this.props.children}
        </div>
    }
}
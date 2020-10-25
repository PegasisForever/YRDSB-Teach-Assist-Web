import React from "react"
import Dialog, {DialogButton, DialogContent, DialogFooter} from "@material/react-dialog"
import getString from "../strings"
import {delDialog} from "../index"

export function CustomDialog(props) {
    return (
        <Dialog
            onClose={() => delDialog()}
            open>
            {props.children}
        </Dialog>
    )
}

export function Alert(props) {
    return (
        <Dialog
            onClose={() => delDialog()}
            open>
            <DialogContent>
                {props.content ? (<p>{props.content}</p>) : props.html}
            </DialogContent>
            <DialogFooter>
                <DialogButton action="ok">{getString("ok")}</DialogButton>
            </DialogFooter>
            <input style={{position: "fixed", left: "-1000000px"}} type="button" autoFocus/>
        </Dialog>
    )
}

export function ConfirmDialog(props) {
    return (
        <Dialog
            onClose={(action) => {
                if (action === "confirm" && props.onConfirm) {
                    props.onConfirm()
                }
                delDialog()
            }}
            open>
            <DialogContent>
                <p>{props.content}</p>
            </DialogContent>
            <DialogFooter>
                <DialogButton action="cancel">{getString("cancel")}</DialogButton>
                <DialogButton action="confirm">{props.confirmText}</DialogButton>
            </DialogFooter>

        </Dialog>
    )
}

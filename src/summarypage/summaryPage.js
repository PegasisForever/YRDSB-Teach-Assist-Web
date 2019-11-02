import React, {Component} from "react"
import Card, {
    CardPrimaryContent,
    CardMedia,
    CardActions,
    CardActionButtons,
    CardActionIcons
} from "@material/react-card";
import {SizedBox} from "../components/sizedBox"
import {Padding} from "../components/padding"

function SummaryCard() {
    return (
        <Card>
            <CardPrimaryContent>
                <Padding all={10}>
                    123
                </Padding>
            </CardPrimaryContent>
        </Card>
    );
}

export default function SummaryPage() {
    return <SizedBox width={400} height={150}>
        <SummaryCard/>
    </SizedBox>
}
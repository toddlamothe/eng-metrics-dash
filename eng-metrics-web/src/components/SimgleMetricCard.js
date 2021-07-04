import React, {useState, useEffect, useRef} from "react";
import Toast from 'react-bootstrap/Toast';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

function SingleMetricCard(props) {
    console.log("props.width = ", props.width);
    return(
        <div>
            <Card>
                <Card.Header><small>{props.title}</small></Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item><strong>{props.value}</strong></ListGroup.Item>
                </ListGroup>
            </Card>           
        </div>
    )
}

export default SingleMetricCard;
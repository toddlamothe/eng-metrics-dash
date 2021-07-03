import React, {useState, useEffect, useRef} from "react";
import Toast from 'react-bootstrap/Toast';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

function SingleMetricCard(props) {
    return(
        <div>
            <Card style={{ width: '10rem' }}>                    
                <Card.Header>{props.title}</Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item>{props.value}</ListGroup.Item>
                </ListGroup>
            </Card>           
        </div>
    )
}

export default SingleMetricCard;
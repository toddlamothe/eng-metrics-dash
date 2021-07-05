import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

function SingleMetricCard(props) {
    return(
        <div style={{paddingLeft: 0, paddingRight: 0, marginLeft:0, marginRight:0 }}> 
            <Card style={{paddingLeft: 0, paddingRight: 0, marginLeft:0, marginRight:0 }}>
                <Card.Header style={{paddingLeft: 0, paddingRight: 0, marginLeft:0, marginRight:0 }}><small>{props.title}</small></Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item><strong>{props.value}</strong></ListGroup.Item>
                </ListGroup>
            </Card>           
        </div>
    )
}

export default SingleMetricCard;
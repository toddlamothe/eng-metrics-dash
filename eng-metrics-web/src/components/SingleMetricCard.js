import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import '../assets/css/eng-metrics.css';

function SingleMetricCard(props) {
    return(
        <div style={{paddingLeft: 0, paddingRight: 0, marginLeft:0, marginRight:0 }}> 
            <Card style={{paddingLeft: 0, paddingRight: 0, marginLeft:0, marginRight:0 }}>
                <Card.Header className={props.size==="large" ? "cardHeaderBold" : "cardHeaderNormal"} style={{paddingLeft: 0, paddingRight: 0, marginLeft:0, marginRight:0 }}>{props.title}</Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <div className={props.size==="large" ? "cardTextBold" : "cardTextNormal"}>
                            {props.value}
                        </div>                        
                    </ListGroup.Item>
                </ListGroup>
            </Card>           
        </div>
    )
}

export default SingleMetricCard;
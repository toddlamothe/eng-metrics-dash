import {Navbar, Nav} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';
import UsmLogo from '../assets/images/usm_logo.jpg';
import '../assets/css/eng-metrics.css';

function Header(props) {
    return(
        <div className="navNoPadding">
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container fluid>
                    <Navbar.Brand>
                    <Image src={UsmLogo} width={50} height={50} rounded className='mr-2 ml-2'/>
                        <strong>Engineering Metrics Dash</strong>
                    </Navbar.Brand>
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="Project" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/?backlogId=23&project=Map%20Search">
                                Map Search
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/?backlogId=32&project=Beacon">
                                Beacon
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
                </Navbar>
        </div>
    )
}

export default Header;
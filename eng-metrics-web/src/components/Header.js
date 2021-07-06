import {Navbar, Nav} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';
import UsmLogo from '../assets/images/usm_logo.jpg';
import { Link, Route } from "react-router-dom";

function Header(props) {
    return(
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container fluid>
                    <Navbar.Brand>
                    <Image src={UsmLogo} width={50} height={50} rounded className='mr-2 ml-2'/>
                        {/* <img
                            src={UsmLogo}
                            
                            width="40"
                            height="40"                            
                            className="d-inline-block align-top"
                            alt="React Bootstrap logo"
                        /> */}
                        <strong>Engineering Metrics Dash</strong>
                    </Navbar.Brand>
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="Project" id="basic-nav-dropdown">
                            <NavDropdown.Item>
                                <Link to="/?backlogId=23&project=MapSearch">Map Search</Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <Link to="/?backlogId=32&project=Beacon">Beacon</Link>
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
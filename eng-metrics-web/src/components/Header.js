import React, {useState, useEffect, useRef} from "react";
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image';
import UsmLogo from '../assets/images/usm_logo.jpg';

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
                            <NavDropdown.Item href="#action/3.1">Map Search</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Beacon</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
                </Navbar>


        </div>
    )
}

export default Header;
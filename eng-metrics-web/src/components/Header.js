import React, {useState, useEffect, useRef} from "react";
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown'

function Header(props) {
    return(
        <div>
            <Nav>
                <Nav.Item>
                    <h3>Engineering Metrics Dash</h3>
                </Nav.Item>
                <Nav.Item>                    
                    <NavDropdown title="Project">                    
                        <NavDropdown.Item href="#/action-1">Map Search</NavDropdown.Item>
                        <NavDropdown.Item href="#/action-2">Beacon</NavDropdown.Item>
                    </NavDropdown>
                </Nav.Item>
            </Nav>

        </div>
    )
}

export default Header;
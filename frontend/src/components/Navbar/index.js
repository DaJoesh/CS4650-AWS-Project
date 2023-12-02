import React from "react";
import { useState } from "react";
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
} from "./NavbarElements";
 
const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    return (
        <>
            <Nav>
                <Bars />
 
                <NavMenu>
                    <NavLink to="/about" >
                        About
                    </NavLink>
                    <NavLink to="/contact">
                        Contact Us
                    </NavLink>
                    {isLoggedIn && 
                    <NavLink to="/predictor">Stock Predictor</NavLink>}


                    {/* Second Nav */}
                    {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
                </NavMenu>
                <NavBtn>
                    {/*link into the auth0 signin through this button*/}
                    <NavBtnLink to="/signin">
                        Sign In
                    </NavBtnLink>
                </NavBtn>
            </Nav>
        </>
    );
};
 
export default Navbar;
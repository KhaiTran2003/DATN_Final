import React from "react";
import '../compunents/Header.css'
import { Link } from "react-router-dom";
function Header(){
    return(
        <div id="main">
            <div className="header-heading">
                <h2>Welcome to LCMS Khải</h2>
                <h1><span>STUDY</span>WITH US</h1>
                <p className="details">Học - Học nữa - Học mãi</p>
                <div className="header-btns">
                    <Link to="/login" className="header-btn">LOGIN</Link>
                </div>
            </div>

        </div>
    );
}
export default Header
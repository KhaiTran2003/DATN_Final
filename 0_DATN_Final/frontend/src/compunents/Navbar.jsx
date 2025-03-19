import React, {useState} from "react";
import logo from '../images/logo.png'
import {Link} from 'react-router-dom'
import '../compunents/Navbar.css'
function Navbar(){
    const [nav, setNav] = useState(false)
    const changeBackground = () =>{
        if(window.scrollY>=50){
            setNav(true)
        }
        else{
            setNav(false)
        }
    }
    window.addEventListener('scroll', changeBackground)
    return(
        <nav className={nav ? "nav active":"nav"}>
            <Link to="#" className='logo'>
                <img src={logo} alt=""/>
            </Link>
            <input className="menu-btn" type='checkbox' id='menu-btn'/>
            <label className="menu-icon" htmlFor="menu-btn">
                <span className="nav-icon"/>
            </label>
            <ul className="menu">
                <li><Link to='/homepage'>Home</Link></li>
                <li><Link to='/aboutus'>Features</Link></li>
                <li><Link to='/courses'>Courses</Link></li>
                <li><Link to='/reviews'>Reviews</Link></li>
                <li><Link to='/contact'>Contact</Link></li>
            </ul>
        </nav>
    );
}
export default Navbar
import "../styles/navbar.css";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { useSelector } from "react-redux";
import { IoIosMoon, IoMdSunny } from "react-icons/io";
import { HiOutlineBars3 } from "react-icons/hi2";
import { AiOutlineClose } from "react-icons/ai";
import logo from "../assets/votely-logo.png";

const Navbar = () => {

    const [showNav, setShowNav] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('votely-theme') || '');

    const currentVoter = useSelector((state) => state?.vote?.currentVoter);

    // Function to close nav menu on mobile screens
    const closeNav = () => {
        if(window.innerWidth < 600) {
            setShowNav(false);
        } else {
            setShowNav(true);
        }
    }

    // Function to change theme
    const changeThemeHandler = () => {
        if(localStorage.getItem('votely-theme') == 'dark') {
            localStorage.setItem('votely-theme', '')
        } else {
            localStorage.setItem('votely-theme', 'dark');
        }

        setTheme(localStorage.getItem('votely-theme'));
    }

    useEffect(() => {
        document.body.className = localStorage.getItem('votely-theme');
    }, [theme]);

    return (
        <nav>
            <div className="container nav__container">
                <div className="nav__logo-container">
                    <img src={logo} alt="logo" />
                    <Link to="/" className="nav__logo">VOTELY</Link>
                </div>
                <div className="nav__links">
                    <menu className={showNav ? "active" : ""}>
                        {currentVoter && (
                            <>
                                <NavLink to="/elections" onClick={closeNav}>Elections</NavLink>
                                <NavLink to="/results" onClick={closeNav}>Results</NavLink>
                                <NavLink to="/logout" onClick={closeNav}>Logout</NavLink>
                            </>
                        )}
                    </menu>
                    <button className="theme__toggle-btn" onClick={changeThemeHandler}>{theme ? <IoMdSunny /> : <IoIosMoon />}</button>
                    <button className="nav__toggle-btn" onClick={() => setShowNav(!showNav)}>{showNav ? <AiOutlineClose /> : <HiOutlineBars3 />}</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

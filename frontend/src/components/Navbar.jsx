import "../styles/navbar.css";
import { useState } from "react";
import { Link, NavLink } from "react-router";
import { IoIosMoon } from "react-icons/io";
import { HiOutlineBars3 } from "react-icons/hi2";
import { AiOutlineClose } from "react-icons/ai";

const Navbar = () => {

    const [showNav, setShowNav] = useState(false);

    return (
        <nav>
            <div className="container nav__container">
                <Link to="/" className="nav__logo">ELECTIONS APP</Link>
                <div>
                    {
                        showNav && (
                            <menu>
                                <NavLink to="/elections">Elections</NavLink>
                                <NavLink to="/results">Results</NavLink>
                                <NavLink to="/logout">Logout</NavLink>
                            </menu>
                        )
                    }
                    <button className="theme__toggle-btn"><IoIosMoon /></button>
                    <button className="nav__toggle-btn" onClick={() => setShowNav(!showNav)}>{showNav ? <AiOutlineClose /> : <HiOutlineBars3 />}</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

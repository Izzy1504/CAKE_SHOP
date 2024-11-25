import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useStateContext } from '../../context/StateContextProvider';
import styles from '../Navbar/Navbar.module.scss';
import { FaUserCircle } from 'react-icons/fa';
 
const Navbar = () => {
    const { handleCartClick, isNavOpen, handleNavLinks, handleNavMenu, totalQty } = useStateContext();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const location = useLocation();
    useEffect(() => {
        // Check if the user is logged in by checking the presence of a token
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (token) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        // Clear the token from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('token_type');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        // Redirect to home page or login page
        window.location.href = '/';
    };

    const hideIcon = location.pathname === '/userdetail';
    const hideCart = location.pathname === '/PaymentPage';

    return (
        <nav className={styles.navbar}>
            <section className={styles.navWrapper}>
                <div className={styles.rightLinks}>
                    <NavLink to="/#cakes" onClick={handleNavLinks("cakes")}>Cakes</NavLink>
                    <NavLink to='/about'>About</NavLink>
                    <NavLink to="#contact" onClick={handleNavLinks("contact")}>Contact</NavLink>
                </div>
                {
                    isNavOpen ? 
                    <i className="fa-solid fa-x" onClick={handleNavMenu}></i> :
                    <div className={styles.navMenu} onClick={handleNavMenu}>
                        <span></span>
                        <span></span>
                    </div>
                }
                <div style={{display: isNavOpen ? "block" : "none"}} className={styles.navMenuList}>
                    <NavLink to="/#cakes" onClick={handleNavLinks("cakes")}>Cakes</NavLink>
                    <NavLink to="/about" onClick={handleNavLinks("about")}>About</NavLink>
                    <a href="#contact" onClick={handleNavLinks("contact")}>Contact</a>
                </div>
                <div className={styles.leftLinks}>
                {isLoggedIn ? (
                    hideIcon ? (
                        <div className="greeting-container">
                            <p className="greeting-text">Hello <span className="username">{username}</span></p>
                        </div>
                    ) : (
                        <>
                            <NavLink to="/userDetail">
                                <FaUserCircle className={styles.userIcon} />
                            </NavLink>
                            <span className={styles.username}>{username}</span>
                            <NavLink to="/" onClick={handleLogout}>Log Out</NavLink>
                        </>
                    )
                ) : (
                    <>
                        <NavLink to="/login" className={styles.login}>Login</NavLink>
                        <NavLink to="/UserAccountPage" className={styles.register}>Register</NavLink>
                    </>
                )}
                        {
                            !hideCart &&(
                                <div className={styles.cart}>

                                <i className="fa-solid fa-cart-shopping fa-xl" onClick={handleCartClick}></i>
                                <div className={styles.cartCounter}>{totalQty}</div>
                    </div>
                            )
                        }
                </div>
            </section>
        </nav>
    );
};

export default Navbar;
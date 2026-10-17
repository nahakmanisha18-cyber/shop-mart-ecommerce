"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar, Container, Dropdown, Form, Modal } from "react-bootstrap";
import { FaSearch, FaTimes, FaShoppingCart, FaUserCircle, FaTshirt, FaMobileAlt, FaLaptop, FaHome, FaBlender, FaGamepad, FaUtensils, FaMotorcycle, FaBicycle, FaBook, FaChair } from "react-icons/fa";
import Login from "@/Components/LogIn/LogIn";
import SignUp from "@/Components/SignUp/SignUp";
import "./Header.css";
import { GiLipstick } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "@/redux/slice/authSlice";
import { logout } from "@/redux/action/authAction";
import { getCart } from "@/redux/action/cartAction";
import { useRouter, usePathname } from "next/navigation";
import Search from "@/Components/Search/Search";
import { getWishlist } from "@/redux/action/wishlistAction";

const Header = () => {
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.authStore);
    const { cart } = useSelector(
        (state) => state.cartStore
    );

    const { wishlist } = useSelector(
        (state) => state.wishlistStore
    );
    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    console.log(user);
    const [search, setSearch] = useState("");
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        const result = await dispatch(logout());

        if (logout.fulfilled.match(result)) {
            router.push("/");
        }
    };

    useEffect(() => {
        if (user?.role === "admin") {
            router.push("/admin/dashboard");
        }
    }, [user, router]);

    useEffect(() => {

        if (user?.role === "user") {
            dispatch(getCart());
        }

    }, [user, dispatch]);

    useEffect(() => {

        if (user?.role === "user") {
            dispatch(getWishlist());
        }

    }, [user, dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();

        const searchValue = search.trim();

        if (!searchValue) {
            return;
        }

        router.push(`/search?q=${encodeURIComponent(searchValue)}`);
    };

    const cartCount =
        cart?.items?.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        ) || 0;

    const wishlistCount = wishlist?.products?.length || 0;


    return (
        <>
            <Navbar expand="lg" className="header-navbar">
                <Container fluid>

                    {/* Logo */}

                    <div className="header-content">
                        {/* <Navbar.Brand as={Link} href="/" className="logo">
                            Shop<span>Hub</span>
                        </Navbar.Brand> */}
                        <Navbar.Brand as={Link} href="/" className="logo">
                            <img
                                src="/logo.png"
                                alt="ShopMart"
                                className="logo-image"
                            />
                        </Navbar.Brand>

                        {/* Mobile Login */}
                        <div className="mobile-auth">
                            {!user ? (
                                <button
                                    className="login-btn"
                                    onClick={() => setShowLogin(true)}
                                >
                                    Login
                                </button>
                            ) : (


                                < div className="mobile-auth">
                                    {!user ? (
                                        <button
                                            className="login-btn"
                                            onClick={() => setShowLogin(true)}
                                        >
                                            Login
                                        </button>
                                    ) : (
                                        <Link
                                            href="/profile"
                                            className="mobile-profile-link"
                                        >
                                            <img
                                                src={
                                                    user?.profileImage ||
                                                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                                }
                                                alt="Profile"
                                                className="header-profile-img"
                                            />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>


                        {/* Search */}
                        <div className="header-search">
                            <Search />
                        </div>



                        {/* Right Side */}
                        <div className="header-right">

                            {/* Guest */}
                            {!user && (
                                <>
                                    <div className="header-actions">

                                        <Link
                                            href="/wishlist"
                                            className={`header-action ${pathname === "/wishlist" ? "active" : ""
                                                }`}
                                        >
                                            <div className="action-icon">
                                                <i
                                                    className={
                                                        pathname === "/wishlist"
                                                            ? "fa-solid fa-heart"
                                                            : "fa-regular fa-heart"
                                                    }
                                                ></i>
                                            </div>

                                            <span className="action-text">
                                                Wishlist
                                            </span>
                                        </Link>

                                        <Link href="/cart" className={`header-action ${pathname === "/cart" ? "active" : ""}`}>
                                            <div className="action-icon">
                                                {pathname === "/cart" ? (
                                                    <FaShoppingCart />
                                                ) : (
                                                    <i className="bi bi-cart3"></i>
                                                )}
                                            </div>

                                            <span className="action-text">
                                                Cart
                                            </span>
                                        </Link>

                                    </div>

                                    <button
                                        className="login-btn"
                                        onClick={() => setShowLogin(true)}
                                    >
                                        Login
                                    </button>
                                </>
                            )}


                            {/* Login Modal */}
                            <Modal
                                show={showLogin}
                                onHide={() => setShowLogin(false)}
                                centered
                                size="lg"
                            >
                                <Login
                                    closeModal={() => setShowLogin(false)}
                                    openSignUp={() => {
                                        setShowLogin(false);
                                        setShowSignUp(true);
                                    }}
                                />
                            </Modal>

                            {/* SignUp Modal */}
                            <Modal
                                show={showSignUp}
                                onHide={() => setShowSignUp(false)}
                                centered
                                size="lg"
                            >
                                <SignUp
                                    closeModal={() => setShowSignUp(false)}
                                    openLogin={() => {
                                        setShowSignUp(false);
                                        setShowLogin(true);
                                    }}
                                />
                            </Modal>

                            {/* User */}
                            {user?.role === "user" && (
                                <>
                                    <div className="header-actions">

                                        <Link
                                            href="/wishlist"
                                            className={`header-action ${pathname === "/wishlist" ? "active" : ""
                                                }`}
                                        >
                                            <div className="action-icon">

                                                <i
                                                    className={
                                                        pathname === "/wishlist"
                                                            ? "fa-solid fa-heart"
                                                            : "fa-regular fa-heart"
                                                    }
                                                ></i>

                                                {wishlistCount > 0 && (
                                                    <span className="badge-count">
                                                        {wishlistCount}
                                                    </span>
                                                )}

                                            </div>

                                            <span className="action-text">
                                                Wishlist
                                            </span>
                                        </Link>

                                        <Link
                                            href="/cart"
                                            className={`header-action ${pathname === "/cart" ? "active" : ""
                                                }`}
                                        >
                                            <div className="action-icon">

                                                {pathname === "/cart" ? (
                                                    <FaShoppingCart />
                                                ) : (
                                                    <i className="bi bi-cart3"></i>
                                                )}

                                                {cartCount > 0 && (
                                                    <span className="badge-count">
                                                        {cartCount}
                                                    </span>
                                                )}

                                            </div>

                                            <span className="action-text">
                                                Cart
                                            </span>
                                        </Link>

                                    </div>

                                    <Dropdown align="end">
                                        <Dropdown.Toggle
                                            className="profile-btn"
                                            variant="light"
                                        >
                                            <img
                                                src={user?.profileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                                                alt="Profile"
                                                className="header-profile-img"
                                            />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item as={Link} href="/profile">
                                                My Profile
                                            </Dropdown.Item>

                                            <Dropdown.Item as={Link} href="/orders">
                                                My Orders
                                            </Dropdown.Item>

                                            <Dropdown.Item as={Link} href="/return-request/all-return-request">
                                                My Return Requests
                                            </Dropdown.Item>

                                            <Dropdown.Item as={Link} href="/notification">
                                              Notification
                                            </Dropdown.Item>

                                            <Dropdown.Divider />

                                            <Dropdown.Item onClick={handleLogout}>
                                                Logout
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                            )}
                            {/* Admin */}
                            {/* Admin */}
                            {user?.role === "admin" && (
                                <>
                                    <div className="admin-header-right">

                                        {/* Notification */}
                                        <Link
                                            href="/admin/notifications"
                                            className="admin-icon"
                                        >
                                            <i className="bi bi-bell-fill"></i>
                                        </Link>

                                        {/* Admin Profile */}
                                        <Dropdown align="end">
                                            <Dropdown.Toggle
                                                className="profile-btn"
                                                variant="light"
                                            >
                                                <img
                                                    src={
                                                        user?.profileImage ||
                                                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                                    }
                                                    className="header-profile-img"
                                                />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>

                                                <Dropdown.Item
                                                    as={Link}
                                                    href="/admin/profile"
                                                >
                                                    My Profile
                                                </Dropdown.Item>

                                                <Dropdown.Item
                                                    as={Link}
                                                    href="/admin/settings"
                                                >
                                                    Settings
                                                </Dropdown.Item>

                                                <Dropdown.Divider />

                                                <Dropdown.Item
                                                    onClick={handleLogout}
                                                >
                                                    Logout
                                                </Dropdown.Item>

                                            </Dropdown.Menu>
                                        </Dropdown>

                                    </div>
                                </>
                            )}
                        </div>


                    </div>
                </Container>
            </Navbar >


        </>
    );
};

export default Header;
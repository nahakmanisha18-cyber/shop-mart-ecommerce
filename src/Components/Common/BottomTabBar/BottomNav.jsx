"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    FaShoppingCart,
    FaHeart,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { getCart } from "@/redux/action/cartAction";
import { getWishlist } from "@/redux/action/wishlistAction";

import "./BottomNav.css";
import { useEffect } from "react";

const BottomNav = () => {

    const pathname = usePathname();
    const dispatch = useDispatch();

    // ==============================
    // GET CART
    // ==============================

    const { cart } = useSelector(
        (state) => state.cartStore
    );

    // ==============================
    // GET WISHLIST
    // ==============================

    const { wishlist } = useSelector(
        (state) => state.wishlistStore
    );

    // ==============================
    // GET USER
    // ==============================

    const { user } = useSelector(
        (state) => state.authStore
    );


    // ==============================
    // LOAD CART
    // ==============================

    useEffect(() => {

        if (user?.role === "user") {
            dispatch(getCart());
        }

    }, [user, dispatch]);


    // ==============================
    // LOAD WISHLIST
    // ==============================

    useEffect(() => {

        if (user?.role === "user") {
            dispatch(getWishlist());
        }

    }, [user, dispatch]);


    // ==============================
    // CART COUNT
    // ==============================

    const cartCount =
        cart?.items?.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        ) || 0;


    // ==============================
    // WISHLIST COUNT
    // ==============================

    const wishlistCount =
        wishlist?.products?.length || 0;


    return (
        <nav className="bottom-nav">

            {/* Home */}
            <Link
                href="/"
                className={`bottom-nav-item ${pathname === "/" ? "active" : ""
                    }`}
            >
                <div className="bottom-nav-icon">
                    {pathname === "/" ? (
                        <i className="fa-solid fa-house"></i>
                    ) : (
                        <i className="fa-regular fa-house"></i>
                    )}
                </div>

                <span className="fw">Home</span>
            </Link>


            {/* Orders */}
            <Link
                href="/orders"
                className={`bottom-nav-item ${pathname === "/orders" ? "active" : ""
                    }`}
            >
                <div className="bottom-nav-icon">
                    {pathname === "/orders" ? (
                        <i className="bi bi-box-seam-fill"></i>
                    ) : (
                        <i className="bi bi-box-seam"></i>
                    )}
                </div>

                <span className="bt">Orders</span>
            </Link>


            {/* Cart */}
            <Link
                href="/cart"
                className={`bottom-nav-item ${pathname === "/cart" ? "active" : ""
                    }`}
            >
                <div className="bottom-nav-icon">
                    {pathname === "/cart" ? (
                        <FaShoppingCart className="cart-icon"/>
                    ) : (
                        <i className="bi bi-cart3"></i>
                    )}

                    {cartCount > 0 && (
                        <span className="bottom-nav-badge">
                            {cartCount}
                        </span>
                    )}
                </div>
                {pathname === "/cart" ? (
                    <span className="fw">Cart</span>
                ) : (
                        <span className="bt">Cart</span>
                )}
               
            </Link>


            {/* Wishlist */}
            <Link
                href="/wishlist"
                className={`bottom-nav-item ${pathname === "/wishlist" ? "active" : ""
                    }`}
            >
                <div className="bottom-nav-icon">
                    {pathname === "/wishlist" ? (
                        <i className="fa-solid fa-heart"></i>
                    ) : (
                            <i className="fa-regular fa-heart"></i>
                    )}

                    {wishlistCount > 0 && (
                        <span className="bottom-nav-badge">
                            {wishlistCount}
                        </span>
                    )}
                </div>

                <span className="fw">Wishlist</span>
            </Link>


            {/* Notification */}
            <Link
                href="/notification"
                className={`bottom-nav-item ${pathname === "/notifications" ? "active" : ""
                    }`}
            >
                <div className="bottom-nav-icon">
                    {pathname === "/notification" ? (
                        <i className="fa-solid fa-bell"></i>
                    ) : (
                        <i className="fa-regular fa-bell"></i>
                    )}
                </div>

                <span className="fw">Notifications</span>
            </Link>

        </nav>
    );
};

export default BottomNav;
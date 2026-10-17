"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
    FaArrowLeft,
    FaMinus,
    FaPlus,
    FaTrash,
    FaHeart,
    FaShieldAlt,
    FaTruck,
    FaTag,
} from "react-icons/fa";
import { deleteCart, updateCart } from "@/redux/action/cartAction";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "@/redux/slice/authSlice";
import { getCart } from "@/redux/action/cartAction";
import { Modal } from "react-bootstrap";
import Login from "@/Components/LogIn/LogIn";
import SignUp from "@/Components/SignUp/SignUp";
import "./AddToCartPage.css";
import Loading from "../Common/Loding/Loading";


const AddToCartPage = () => {

    const dispatch = useDispatch();
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const {
        cart,
        isLoading,
        isError,
    } = useSelector(
        (state) => state.cartStore
    );

    const {
        user,
        isAuthenticated,
        isAuthChecked,
    } = useSelector(
        (state) => state.authStore
    );


    // ==============================
    // RESTORE AUTH
    // ==============================

    useEffect(() => {

        dispatch(getProfile());

    }, [dispatch]);


    // ==============================
    // GET CART AFTER AUTH CHECK
    // ==============================

    useEffect(() => {

        if (isAuthChecked && isAuthenticated) {

            dispatch(getCart());

        }

    }, [
        dispatch,
        isAuthChecked,
        isAuthenticated
    ]);

    const handleLogin = () => {
        setShowLogin(true);
    }


    // ==============================
    // CHECKING LOGIN
    // ==============================

    if (!isAuthChecked) {

        return (
            <div className="product-loading-overlay">

                <div className="product-loader"></div>

                <p>
                    Checking your account...
                </p>

            </div>
        );

    }
    // ==============================
    // LOGIN REQUIRED
    // ==============================

    if (!isAuthenticated) {

        return (

            <main className="cart-page">

                <div className="cart-login-required">

                    <div className="cart-login-icon">
                        🔐
                    </div>

                    <span className="cart-login-label">
                        YOUR CART IS WAITING
                    </span>

                    <h1>
                        Login to View Your Cart
                    </h1>

                    <p>
                        Please login to access your shopping cart,
                        manage your products and continue to checkout.
                    </p>

                    <div className="cart-login-benefits">

                        <div>
                            <span className="icons"><i className="fa-solid fa-cart-shopping"></i></span>
                            <div>
                                <strong>
                                    Save Your Cart
                                </strong>
                                <small>
                                    Keep your selected products safe
                                </small>
                            </div>
                        </div>

                        <div>
                            <span className="icons"><i className="fa-solid fa-lock"></i></span>
                            <div>
                                <strong>
                                    Secure Checkout
                                </strong>
                                <small>
                                    Safe and secure payment
                                </small>
                            </div>
                        </div>

                        <div>
                            <span className="icons"><FaTruck/></span>
                            <div>
                                <strong>
                                    Easy Delivery
                                </strong>
                                <small>
                                    Track your orders easily
                                </small>
                            </div>
                        </div>

                    </div>

                    <div className="cart-login-actions">

                        <button
                            className="cart-shopping-btn"
                            onClick={handleLogin}
                        >
                            Login
                        </button>




                    </div>

                </div>

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

            </main>

        );

    }
    const handleDecrease = (item) => {

        if (item.quantity <= 1) {
            return;
        }

        dispatch(
            updateCart({
                productId: item.product._id,
                quantity: item.quantity - 1,
            })
        );

    };


    const handleIncrease = (item) => {
        const stock = Number(item.product?.stock || 0);

        if (item.quantity >= stock) {
            return;
        }

        dispatch(
            updateCart({
                productId: item.product._id,
                quantity: item.quantity + 1,
            })
        );
    };


    const handleRemove = (productId) => {

        dispatch(
            deleteCart(productId)
        );

    };
    // ==============================
    // CART ITEMS
    // ==============================

    const cartItems =
        cart?.items || [];


    // ==============================
    // CALCULATE TOTAL
    // ==============================

    const subtotal = cartItems.reduce(
        (total, item) => {

            const product =
                item.product;

            const price =
                Number(
                    product?.discountPrice ||
                    product?.price ||
                    0
                );

            return (
                total +
                price * item.quantity
            );

        },
        0
    );


    // ==============================
    // DISCOUNT
    // ==============================

    const originalTotal =
        cartItems.reduce(
            (total, item) => {

                const product =
                    item.product;

                const price =
                    Number(
                        product?.price || 0
                    );

                return (
                    total +
                    price * item.quantity
                );

            },
            0
        );


    const discount =
        originalTotal - subtotal;


    // ==============================
    // DELIVERY
    // ==============================

    const delivery =
        subtotal >= 500 ? 0 : 40;


    const grandTotal =
        subtotal + delivery;


    // ==============================
    // EMPTY CART
    // ==============================

    if (!isLoading && cartItems.length === 0) {

        return (

            <main className="cart-page">

                <div className="cart-empty">

                    <div className="cart-empty-icon">
                        <i className="fa-solid fa-cart-shopping"></i>
                    </div>

                    <h1>
                        Your Cart is Empty
                    </h1>

                    <p>
                        Looks like you haven't
                        added anything to your cart yet.
                    </p>

                    <Link
                        href="/"
                        className="continue-shopping-btn"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </main>

        );

    }


    return (
        <>
            <main className="cart-page">

                {isLoading && (
                   <Loading/>
                )}
                {/* =========================
                PAGE HEADER
            ========================= */}

                <div className="cart-container">

                    <div className="cart-header">

                        <div>

                            <Link
                                href="/"
                                className="back-shopping"
                            >
                                <FaArrowLeft />
                                Continue Shopping
                            </Link>

                            <h1>
                                Shopping Cart
                            </h1>

                            <p>
                                {cartItems.length}{" "}
                                {cartItems.length === 1
                                    ? "item"
                                    : "items"
                                } in your cart
                            </p>

                        </div>

                    </div>


                    {/* =========================
                    MAIN CART LAYOUT
                ========================= */}

                    <div className="cart-layout">


                        {/* =====================
                        LEFT SIDE
                    ===================== */}

                        <section className="cart-items-section">

                            <div className="cart-items-card">

                                <div className="cart-items-title">

                                    <h2>
                                        Cart Items
                                    </h2>

                                    <span>
                                        {cartItems.length} Items
                                    </span>

                                </div>


                                {cartItems.map(
                                    (item) => {

                                        const product =
                                            item.product;

                                        const price =
                                            Number(
                                                product?.discountPrice ||
                                                product?.price ||
                                                0
                                            );

                                        const total =
                                            price *
                                            item.quantity;


                                        return (

                                            <div
                                                className="cart-item"
                                                key={
                                                    product?._id
                                                }
                                            >

                                                {/* IMAGE */}

                                                <Link
                                                    href={`/details/${product?._id}`}
                                                    className="cart-product-image"
                                                >

                                                    <img
                                                        src={
                                                            product?.images?.[0] ||
                                                            "/images/no-image.png"
                                                        }
                                                        alt={
                                                            product?.productName
                                                        }
                                                    />

                                                </Link>


                                                {/* PRODUCT INFO */}

                                                <div className="cart-product-info">

                                                    <span className="cart-product-brand">
                                                        {
                                                            product?.brand
                                                        }
                                                    </span>

                                                    <Link
                                                        href={`/products/${product?._id}`}
                                                        className="cart-product-name"
                                                    >
                                                        {
                                                            product?.productName
                                                        }
                                                    </Link>

                                                    <div className="cart-product-stock">
                                                        ✓ In Stock
                                                    </div>


                                                    <div className="cart-item-actions">

                                                        <button>
                                                            <FaHeart />
                                                            Move to Wishlist
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleRemove(product._id)
                                                            }
                                                        >
                                                            <FaTrash />
                                                            Remove
                                                        </button>

                                                    </div>

                                                </div>


                                                {/* PRICE + QUANTITY */}

                                                <div className="cart-product-right">

                                                    <div className="cart-product-price">

                                                        ₹
                                                        {price.toLocaleString(
                                                            "en-IN"
                                                        )}

                                                    </div>


                                                    <div className="quantity-box">

                                                        <button
                                                            onClick={() =>
                                                                handleDecrease(item)
                                                            }
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <FaMinus />
                                                        </button>


                                                        <span>
                                                            {item.quantity}
                                                        </span>



                                                        <button
                                                            onClick={() => handleIncrease(item)}
                                                            disabled={
                                                                Number(item.product?.stock || 0) <= 0 ||
                                                                item.quantity >= Number(item.product?.stock || 0)
                                                            }
                                                        >
                                                            <FaPlus />
                                                        </button>


                                                    </div>


                                                    <strong className="cart-item-total">

                                                        ₹
                                                        {total.toLocaleString(
                                                            "en-IN"
                                                        )}

                                                    </strong>

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>


                            {/* =====================
                            BENEFITS
                        ===================== */}

                            <div className="cart-benefits">

                                <div>

                                    <FaTruck />

                                    <div>

                                        <strong>
                                            Free Delivery
                                        </strong>

                                        <span>
                                            On orders above ₹500
                                        </span>

                                    </div>

                                </div>


                                <div>

                                    <FaShieldAlt />

                                    <div>

                                        <strong>
                                            Secure Payment
                                        </strong>

                                        <span>
                                            100% secure checkout
                                        </span>

                                    </div>

                                </div>


                                <div>

                                    <FaTag />

                                    <div>

                                        <strong>
                                            Best Prices
                                        </strong>

                                        <span>
                                            Great deals every day
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* =====================
                        RIGHT SUMMARY
                    ===================== */}

                        <aside className="cart-summary">

                            <h2>
                                Order Summary
                            </h2>


                            <div className="summary-row">

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹
                                    {subtotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>


                            {discount > 0 && (

                                <div className="summary-row discount">

                                    <span>
                                        Discount
                                    </span>

                                    <strong>
                                        - ₹
                                        {discount.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>

                            )}


                            <div className="summary-row">

                                <span>
                                    Delivery
                                </span>

                                <strong>

                                    {delivery === 0
                                        ? "FREE"
                                        : `₹${delivery}`
                                    }

                                </strong>

                            </div>


                            <div className="summary-divider" />


                            <div className="summary-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹
                                    {grandTotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>


                            {/* COUPON */}

                            <div className="coupon-box">

                                <input
                                    type="text"
                                    placeholder="Enter coupon code"
                                />

                                <button>
                                    Apply
                                </button>

                            </div>


                            {/* CHECKOUT */}

                            <Link
                                href="/checkout"
                                className="checkout-btn"
                            >
                                Proceed to Checkout
                            </Link>


                            <div className="secure-checkout">

                                <FaShieldAlt />

                                <span>
                                    Safe & Secure Checkout
                                </span>

                            </div>

                        </aside>

                    </div>

                </div>

            </main>




        </>

    );

};


export default AddToCartPage;
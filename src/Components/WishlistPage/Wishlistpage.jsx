"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import {
    FaHeart,
    FaShoppingCart,
    FaTrash,
    FaArrowLeft,
    FaStar,
    FaShieldAlt,
} from "react-icons/fa";

import {
    getWishlist,
    removeWishlist,
} from "@/redux/action/wishlistAction";

import { addToCart } from "@/redux/action/cartAction";
import { getProfile } from "@/redux/slice/authSlice";

import { Modal } from "react-bootstrap";
import Login from "@/Components/LogIn/LogIn";
import SignUp from "@/Components/SignUp/SignUp";

import "./WishlistPage.css";
import Loading from "../Common/Loding/Loading";


const WishlistPage = () => {

    const dispatch = useDispatch();

    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const {
        wishlist,
        isLoading,
        isError,
    } = useSelector((state) => state.wishlistStore);

    const {
        user,
        isAuthenticated,
        isAuthChecked,
    } = useSelector((state) => state.authStore);


    const products = wishlist?.products || [];

   ;

    const handleRemove = (productId) => {
        dispatch(removeWishlist(productId));
    };


    useEffect(() => {

        dispatch(getProfile());

    }, [dispatch]);


    useEffect(() => {

        if (isAuthChecked && isAuthenticated) {

            dispatch(getWishlist());

        }

    }, [
        dispatch,
        isAuthChecked,
        isAuthenticated
    ]);

    const handleAddToCart = (product) => {

        if (Number(product.stock) <= 0) {
            return;
        }

        dispatch(
            addToCart({
                productId: product._id,
                quantity: 1,
            })
        );
    };


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

    if (!isAuthenticated) {

        return (
            <>
                <main className="wishlist-page">

                    <div className="wishlist-login-required">

                        <div className="wishlist-login-icon">
                            🔐
                        </div>

                        <span className="wishlist-login-label">
                            YOUR WISHLIST IS WAITING
                        </span>

                        <h1>
                            Login to View Your Wishlist
                        </h1>

                        <p>
                            Please login to access your wishlist,
                            save your favorite products and shop anytime.
                        </p>


                        <div className="wishlist-login-benefits">

                            <div>
                                <span className="icons"><i class="fa-solid fa-heart"></i></span>

                                <div>
                                    <strong>
                                        Save Your Favorites
                                    </strong>

                                    <small>
                                        Keep your favorite products saved
                                    </small>
                                </div>
                            </div>


                            <div>
                                <span className="icons"><i className="fa-solid fa-cart-shopping"></i></span>
                                <div>
                                    <strong>
                                        Easy Shopping
                                    </strong>

                                    <small>
                                        Add products to cart anytime
                                    </small>
                                </div>
                            </div>


                            <div>
                                <span className="icons"><i className="fa-solid fa-lock"></i></span>

                                <div>
                                    <strong>
                                        Secure Account
                                    </strong>

                                    <small>
                                        Your wishlist stays محفوظ
                                    </small>
                                </div>
                            </div>

                        </div>


                        <div className="wishlist-login-actions">

                            <button
                                className="wishlist-login-btn"
                                onClick={handleLogin}
                            >
                                Login
                            </button>

                        </div>

                    </div>

                </main>


                {/* LOGIN MODAL */}

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


                {/* SIGNUP MODAL */}

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

            </>
        );
    }

    return (
        <main className="wishlist-page">

            {/* ================= HEADER ================= */}

            <section className="wishlist-header">
               

                    <div className="wishlist-header-content">

                        <div>
                            <div className="wishlist-title-row">
                                <div className="wishlist-title-icon">
                                    <FaHeart />
                                </div>

                                <div>
                                    <h1>My Wishlist</h1>

                                    <p>
                                        Save your favorite products
                                        and shop them anytime.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="wishlist-count">
                            <strong>{products.length}</strong>
                            <span>
                                {products.length === 1
                                    ? "Product"
                                    : "Products"}
                            </span>
                        </div>

                    </div>

                
            </section>


            {/* ================= MAIN ================= */}

            <section className="wishlist-content">

                {/* <div className="wishlist-container"> */}

                    {/* ERROR */}

                    {isError && (
                        <div className="wishlist-error">
                            {typeof isError === "string"
                                ? isError
                                : isError?.message ||
                                "Something went wrong"}
                        </div>
                    )}


                    {/* LOADING */}

                    {isLoading && (
                        <Loading/>
                    )}


                    {/* EMPTY WISHLIST */}

                    {!isLoading && products.length === 0 && (
                        <div className="wishlist-empty">

                            <div className="wishlist-empty-icon">
                                <FaHeart />
                            </div>

                            <h2>Your Wishlist is Empty</h2>

                            <p>
                                You haven't added any products
                                to your wishlist yet.
                            </p>

                            <Link
                                href="/products"
                                className="wishlist-shop-btn"
                            >
                                Start Shopping
                            </Link>

                        </div>
                    )}


                    {/* ================= PRODUCTS ================= */}

                    {!isLoading && products.length > 0 && (

                        <div className="wishlist-layout">

                            {/* PRODUCTS */}

                            <div className="wishlist-products">

                                <div className="wishlist-products-top">

                                    <div>

                                        <Link
                                            href="/products"
                                            className="continue-shopping"
                                        >
                                        <FaArrowLeft />
                                            Continue Shopping
                                            
                                        </Link> 
                                        
                                        
                                        <h2>
                                            Saved Products
                                        </h2>

                                        <span>
                                            {products.length} items
                                        </span>
                                    </div>


                                </div>


                                <div className="wishlist-grid">

                                    {products.map((product) => (

                                        <article
                                            className="wishlist-card"
                                            key={product._id}
                                        >

                                            {/* IMAGE */}

                                            <div className="wishlist-card-image">

                                                <Link
                                                    href={`/details/${product._id}`}
                                                >

                                                    <img
                                                        src={
                                                            product.images?.[0] ||
                                                            "/images/no-image.png"
                                                        }
                                                        alt={
                                                            product.productName ||
                                                            "Product"
                                                        }
                                                    />

                                                </Link>


                                                {/* REMOVE */}

                                                <button
                                                    type="button"
                                                    className="wishlist-remove-btn"
                                                    onClick={() =>
                                                        handleRemove(
                                                            product._id
                                                        )
                                                    }
                                                >
                                                    <FaTrash />
                                                </button>


                                                {product.discountPrice > 0 && (
                                                    <span className="wishlist-discount">
                                                        SALE
                                                    </span>
                                                )}

                                            </div>


                                            {/* CONTENT */}

                                            <div className="wishlist-card-content">

                                                <span className="wishlist-brand">
                                                    {product.brand ||
                                                        "Brand"}
                                                </span>

                                                <Link
                                                    href={`/details/${product._id}`}
                                                    className="wishlist-product-name"
                                                >
                                                    {product.productName}
                                                </Link>


                                                {/* RATING */}

                                                <div className="wishlist-rating">

                                                    <span>
                                                        <FaStar />
                                                        4.3
                                                    </span>

                                                    <small>
                                                        (120 Reviews)
                                                    </small>

                                                </div>


                                                {/* PRICE */}

                                                <div className="wishlist-price">

                                                    <strong>
                                                        ₹
                                                        {Number(
                                                            product.discountPrice ||
                                                            product.price ||
                                                            0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </strong>

                                                    {product.discountPrice > 0 && (
                                                        <del>
                                                            ₹
                                                            {Number(
                                                                product.price ||
                                                                0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </del>
                                                    )}

                                                </div>


                                                {/* CART */}

                                                <button
                                                    type="button"
                                                    className={`wishlist-cart-btn ${Number(product.stock) <= 0
                                                            ? "wishlist-out-of-stock-btn"
                                                            : ""
                                                        }`}
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={Number(product.stock) <= 0}
                                                >
                                                    <FaShoppingCart />

                                                    {Number(product.stock) <= 0
                                                        ? "Out of Stock"
                                                        : "Add to Cart"
                                                    }
                                                </button>
                                            </div>

                                        </article>

                                    ))}

                                </div>

                            </div>

                        </div>

                    )}

                {/* </div> */}

            </section>

        </main>
    );
};

export default WishlistPage;
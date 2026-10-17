"use client";
// import Script from "next/script";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { addToCart } from "@/redux/action/cartAction";
import {
    FaArrowLeft,
    FaHeart,
    FaShoppingCart,
    FaStar,
    FaMinus,
    FaPlus,
    FaTruck,
} from "react-icons/fa";
import {
    getWishlist,
    addWishlist,
    removeWishlist
} from "@/redux/action/wishlistAction";
import { getProduct } from "@/redux/action/productAction";
import { Modal } from "react-bootstrap";
import Login from "@/Components/LogIn/LogIn";
import SignUp from "@/Components/SignUp/SignUp";
import "./ProductDetails.css";
import { useRouter } from "next/navigation";
import Loading from "../Common/Loding/Loading";

const ProductDetailPage = ({ productId }) => {

    const dispatch = useDispatch();
    const router = useRouter()

    const [quantity, setQuantity] = useState(1);
    const increaseQuantity = () => {
        if (quantity < Number(product?.stock || 0)) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decreaseQuantity = () => {
        setQuantity((prev) => Math.max(1, prev - 1));
    };
    const { product, isLoading, isError } = useSelector(
        (state) => state.productStore
    );
    
    const [showOutOfStock, setShowOutOfStock] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const { user } = useSelector((state) => state.authStore);

    const [selectedImage, setSelectedImage] = useState(null);

    const handleAddToCart = () => {

        if (!user) {
            setShowLogin(true);
            return;
        }

        if (!productId) return;

        if (Number(product.stock) <= 0) {
            setShowOutOfStock(true);
            return;
        }

        dispatch(
            addToCart({
                productId: productId,
                quantity: quantity,
            })
        );
    };
    useEffect(() => {

        if (productId) {
            dispatch(getProduct(productId));
        }

    }, [dispatch, productId]);

    useEffect(() => {
        dispatch(getWishlist());
    }, [dispatch]);

    const {
        wishlist,
        isLoading: wishlistLoading,
    } = useSelector(
        (state) => state.wishlistStore
    );

    const isWishlisted =
        wishlist?.products?.some(
            (item) =>
                String(item?._id || item) ===
                String(product?._id)
        ) || false;


    const handleWishlist = () => {
        if (!user) {
            setShowLogin(true);
            return;
        }
        if (isWishlisted) {
            dispatch(removeWishlist(product._id));
        } else {
            dispatch(addWishlist(product._id));
        }
    };
    const handleBuyNow = () => {
        if (!user) {
            setShowLogin(true);
            return
        }
        if (!productId) return;
        console.log("id:", productId)
        router.push(`/buynowForm/${productId}`);
    };


    if (isLoading) {

        return (
            <Loading/>
        );
    }


    /* =========================
       ERROR
    ========================= */

    if (isError) {

        return (
            <div className="product-detail-error">

                <h2>
                    Product Not Found
                </h2>

                <p>
                    {isError}
                </p>

                <Link href="/">
                    Back to Shopping
                </Link>

            </div>
        );
    }


    /* =========================
       PRODUCT NOT AVAILABLE
    ========================= */

    if (!product) {
        return null;
    }

   
    const price = Number(
        product.discountPrice ||
        product.price ||
        0
    );

    const originalPrice = Number(
        product.price || 0
    );

    const discount =
        originalPrice > price
            ? Math.round(
                ((originalPrice - price) /
                    originalPrice) *
                100
            )
            : 0;


    return (
        <>


            <main className="product-detail-page">

                <div className="product-detail-container">

                    <Link
                        href="/"
                        className="product-detail-back"
                    >
                        <FaArrowLeft />

                        Back to Shopping
                    </Link>


                    <div className="product-detail-card">


                        <div className="product-detail-images">

                            <div className="product-main-image">

                                <img
                                    src={
                                        selectedImage ||
                                        product.images?.[0] ||
                                        "/images/no-image.png"
                                    }
                                    alt={product.productName}
                                />

                            </div>

                            {product.images?.length > 1 && (

                                <div className="product-thumbnails">

                                    {product.images.map((image, index) => (

                                        <div
                                            key={index}
                                            className="product-thumbnail"
                                            onClick={() => setSelectedImage(image)}
                                        >

                                            <img
                                                src={image}
                                                alt={`Product ${index + 1}`}
                                            />

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>


                        {/* =====================
                        PRODUCT INFO
                    ===================== */}

                        <div className="product-detail-info">


                            {/* BRAND */}

                            <span className="product-detail-brand">

                                {product.brand}

                            </span>


                            {/* NAME */}

                            <h1>

                                {product.productName}

                            </h1>


                            {/* RATING */}

                            <div className="product-detail-rating">

                                <span className="rating-box">

                                    <FaStar />

                                    4.3

                                </span>

                                <span>
                                    120 Ratings & Reviews
                                </span>

                            </div>


                            {/* PRICE */}

                            <div className="product-detail-price">

                                <strong>

                                    ₹
                                    {price.toLocaleString(
                                        "en-IN"
                                    )}

                                </strong>


                                {originalPrice > price && (

                                    <>
                                        <del>

                                            ₹
                                            {originalPrice.toLocaleString(
                                                "en-IN"
                                            )}

                                        </del>

                                        <span className="discount">

                                            {discount}% OFF

                                        </span>
                                    </>

                                )}

                            </div>


                            {/* STOCK */}

                            <div
                                className={`product-stock ${Number(product.stock) > 0 ? "in-stock" : "out-of-stock"
                                    }`}
                            >
                                <span>
                                    {Number(product.stock) > 0 ? "✓" : "✕"}
                                </span>

                                {Number(product.stock) > 0
                                    ? `In Stock (${product.stock} available)`
                                    : "out-of-stock"}
                            </div>

                            {/* DESCRIPTION */}

                            <div className="product-description">

                                <h3>
                                    Product Description
                                </h3>

                                <p>
                                    {product.description ||
                                        "No product description available."}
                                </p>

                            </div>


                            {/* QUANTITY */}

                            <div className="quantity-control">

                                <button
                                    type="button"
                                    onClick={decreaseQuantity}
                                    disabled={quantity === 1}
                                >
                                    <FaMinus />
                                </button>

                                <span>
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    onClick={increaseQuantity}
                                    disabled={
                                        Number(product?.stock || 0) <= 0 ||
                                        quantity >= Number(product?.stock || 0)
                                    }
                                >
                                    <FaPlus />
                                </button>

                            </div>


                            {/* ACTION BUTTONS */}

                            <div className="product-detail-actions">

                                <button
                                    className="add-cart-detail-btn"
                                    onClick={handleAddToCart}
                                >
                                    <FaShoppingCart />

                                    Add to Cart
                                </button>


                                <button
                                    className="buy-now-detail-btn"
                                    onClick={handleBuyNow}
                                >
                                    Buy Now
                                </button>


                                <button type="button" 
                                    className={`wishlist-detail-btn ${isWishlisted ? "active" : ""
                                }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        handleWishlist();
                                    }}
                                    disabled={wishlistLoading}
                                    >

                                    <FaHeart />

                                </button>

                            </div>


                            {/* DELIVERY INFO */}

                            <div className="product-delivery-info">

                                <div>

                                    <strong className="icons">
                                        <FaTruck className="icons"/> Free Delivery
                                    </strong>

                                    <span>
                                        On orders above ₹500
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        <i className="fa-solid fa-lock"></i> Secure Payment
                                    </strong>

                                    <span>
                                        100% secure payment
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =========================
                    PRODUCT DETAILS
                ========================= */}

                    <div className="product-extra-details">

                        <h2>
                            Product Details
                        </h2>

                        <div className="product-details-grid">

                            <div>

                                <span>
                                    Brand
                                </span>

                                <strong>
                                    {product.brand || "N/A"}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Category
                                </span>

                                <strong>
                                    {product.category || "N/A"}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Price
                                </span>

                                <strong>
                                    ₹
                                    {price.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Stock
                                </span>

                                <strong>
                                    {product.stock ?? "Available"}
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

            </main>


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

        </>

    );
};

export default ProductDetailPage;
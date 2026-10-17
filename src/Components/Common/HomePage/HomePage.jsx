"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import Login from "@/Components/LogIn/LogIn";
import SignUp from "@/Components/SignUp/SignUp";

import {
    FaArrowLeft,
    FaArrowRight,
    FaShoppingCart,
    FaStar
} from "react-icons/fa";

import {
    LuShoppingBag,
    LuShirt,
    LuSmartphone,
    LuMonitor,
    LuLamp,
    LuGamepad2,
    LuUtensils,
    LuBike,
    LuBookOpen,
    LuArmchair,
    LuCarFront,
    LuSparkles,
    LuDumbbell
} from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "@/redux/action/productAction";
import { addToCart } from "@/redux/action/cartAction";
import {
    getWishlist,
    addWishlist,
    removeWishlist
} from "@/redux/action/wishlistAction";


import "./HomePage.css";
import Loading from "../Loding/Loading";
const banners = [
    {
        id: 1,
        image: "https://rukminim1.flixcart.com/fk-p-flap/3200/1560/image/3a5f15a399e6efcf.jpg?q=60",
        title: "Latest Fashion",
        subtitle: "Discover the latest styles",
        button: "Shop Fashion",
        link: "/categories/Fashion",
    },
    {
        id: 2,
        image: "https://rukminim1.flixcart.com/fk-p-flap/3200/1560/image/2c402ea7c43bba42.png?q=60",
        title: "Latest Mobiles",
        subtitle: "Powerful smartphones at best prices",
        button: "Shop Mobiles",
        link: "/categories/Mobiles",
    },
    {
        id: 3,
        image: "https://rukminim1.flixcart.com/fk-p-flap/3200/1560/image/920e91c120a24e5a.png?q=60",
        title: "Beauty Essentials",
        subtitle: "Everything you need for your beauty",
        button: "Shop Beauty",
        link: "/categories/Beauty",
    },
];

const categories = [
    {
        name: "For You",
        value: "all",
        icon: <LuShoppingBag />,
    },
    {
        name: "Fashion",
        value: "fashion",
        icon: <LuShirt />,
    },
    {
        name: "Mobiles",
        value: "mobiles",
        icon: <LuSmartphone />,
    },
    {
        name: "Beauty",
        value: "beauty",
        icon: <LuSparkles />,
    },
    {
        name: "Electronics",
        value: "electronics",
        icon: <LuMonitor />,
    },
    {
        name: "Home",
        value: "home",
        icon: <LuLamp />,
    },
    {
        name: "Appliances",
        value: "appliances",
        icon: <LuMonitor />,
    },
    {
        name: "Toys",
        value: "toys",
        icon: <LuGamepad2 />,
    },
    {
        name: "Food",
        value: "food",
        icon: <LuUtensils />,
    },
    {
        name: "Auto",
        value: "auto",
        icon: <LuCarFront />,
    },
    {
        name: "2 Wheelers",
        value: "2-wheelers",
        icon: <LuBike />,
    },
    {
        name: "Sports",
        value: "sports",
        icon: <LuDumbbell />,
    },
    {
        name: "Books",
        value: "books",
        icon: <LuBookOpen />,
    },
    {
        name: "Furniture",
        value: "furniture",
        icon: <LuArmchair />,
    },
];


const HomePage = () => {
    const [currentBanner, setCurrentBanner] = useState(0);

    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState("all");

    const {
        products,
        isLoading,
        isError,
    } = useSelector((state) => state.productStore);

    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const { user } = useSelector((state) => state.authStore);


    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getWishlist());
    }, [dispatch]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) =>
                prev === banners.length - 1
                    ? 0
                    : prev + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const previousBanner = () => {
        setCurrentBanner((prev) =>
            prev === 0
                ? banners.length - 1
                : prev - 1
        );
    };

    const nextBanner = () => {
        setCurrentBanner((prev) =>
            prev === banners.length - 1
                ? 0
                : prev + 1
        );
    };


    const filteredProducts =
        selectedCategory === "all"
            ? products
            : products.filter(
                (product) =>
                    product.category?.toLowerCase() ===
                    selectedCategory.toLowerCase()
            );


    const ProductCard = ({ product, user, setShowLogin }) => {

        const dispatch = useDispatch();

        const {
            isLoading,
        } = useSelector(
            (state) => state.cartStore
        );

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
                    String(product._id)
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


        const handleAddToCart = () => {

            if (!user) {
                setShowLogin(true);
                return;
            }

            // Stock check
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
        return (
            <div className="foryou-product-card">

                <button
                    type="button"
                    className={`foryou-wishlist-btn ${isWishlisted ? "active" : ""
                        }`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        handleWishlist();
                    }}
                    disabled={wishlistLoading}
                    aria-label={
                        isWishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                >
                    <i
                        className={`fa-heart ${isWishlisted
                            ? "fa-solid active-heart"
                            : "fa-regular"
                            }`}
                    ></i>
                </button>

                <Link
                    href={`/details/${product._id}`}
                    className="foryou-product-image"
                >
                    <img
                        src={
                            product.images?.[0] ||
                            "/images/no-image.png"
                        }
                        alt={product.productName}
                    />
                </Link>


                <div className="foryou-product-content">

                    <span className="foryou-product-brand">
                        {product.brand}
                    </span>


                    <h3>
                        {product.productName}
                    </h3>

                    <div className="foryou-rating">
                        <div className="foryou-stars">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                        </div>

                        <small>(120)</small>
                    </div>

                    <div className="foryou-price">

                        <strong>
                            ₹
                            {Number(
                                product.discountPrice ||
                                product.price
                            ).toLocaleString("en-IN")}
                        </strong>

                        {product.discountPrice > 0 && (
                            <del>
                                ₹
                                {Number(
                                    product.price
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </del>
                        )}

                    </div>

                    <button
                        className={`foryou-cart-btn ${Number(product.stock) <= 0 ? "out-of-stock-btn" : ""
                            }`}
                        onClick={handleAddToCart}
                        disabled={Number(product.stock) <= 0}
                    >
                        <i className="bi bi-cart3"></i>

                        {Number(product.stock) <= 0
                            ? "Out of Stock"
                            : "Add to Cart"
                        }
                    </button>

                    {product.discountPrice > 0 && (
                        <span className="product-discount">
                            SALE
                        </span>
                    )}

                </div>

            </div>
        );
    };

    /* ===============================
       PRODUCT SECTION
    =============================== */

    const ProductSection = ({
        title,
        productsList,
        link,
        user,
        setShowLogin,
    }) => {
        if (!productsList.length) {
            return null;
        }

        return (
            <section className="foryou-product-section">

                <div className="foryou-section-header">

                    <div>
                        <h2>{title}</h2>
                        <p>
                            Explore our latest
                            collection
                        </p>
                    </div>

                    <Link
                        href={link}
                        className="foryou-view-all"
                    >
                        View All
                        <FaArrowRight />
                    </Link>

                </div>

                <div className="foryou-products-grid">

                    {productsList.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            user={user}
                            setShowLogin={setShowLogin}
                        />
                    ))}

                </div>

            </section>
        );
    };

    return (
        <>

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

            <section className="foryou-category-section">
                <Container>
                    <div className="foryou-category-items">

                        {categories.map((category) => {

                            const isActive =
                                selectedCategory === category.value;

                            return (
                                <button
                                    key={category.value}
                                    type="button"
                                    className={`foryou-category-link ${isActive ? "active" : ""
                                        }`}
                                    onClick={() =>
                                        setSelectedCategory(category.value)
                                    }
                                >

                                    <div className="foryou-category-icon">
                                        {category.icon}
                                    </div>

                                    <span>
                                        {category.name}
                                    </span>

                                </button>
                            );

                        })}

                    </div>
                </Container>
            </section>

            <main className="foryou-page">

                {isLoading && (
                    <Loading/>
                )}




                <section className="foryou-banner-slider">

                    <button
                        className="foryou-banner-arrow foryou-banner-prev"
                        onClick={previousBanner}
                    >
                        <FaArrowLeft />
                    </button>

                    <div className="foryou-banner-track">

                       
                        <div className="foryou-banner-card side-card">
                            <img
                                src={
                                    banners[
                                        (currentBanner - 1 + banners.length) %
                                        banners.length
                                    ].image
                                }
                                alt="Banner"
                            />
                        </div>


                        <div className="foryou-banner-card main-card">
                            <img
                                src={banners[currentBanner].image}
                                alt={banners[currentBanner].title}
                            />
                        </div>


                        <div className="foryou-banner-card side-card">
                            <img
                                src={
                                    banners[
                                        (currentBanner + 1) %
                                        banners.length
                                    ].image
                                }
                                alt="Banner"
                            />
                        </div>

                    </div>


                    <button
                        className="foryou-banner-arrow foryou-banner-next"
                        onClick={nextBanner}
                    >
                        <FaArrowRight />
                    </button>


                 
                    <div className="foryou-banner-dots">

                        {banners.map((_, index) => (
                            <button
                                key={index}
                                className={
                                    currentBanner === index
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setCurrentBanner(index)
                                }
                            />
                        ))}

                    </div>

                </section>

                <ProductSection
                    title={
                        selectedCategory === "all"
                            ? "All Products"
                            : categories.find(
                                (category) =>
                                    category.value === selectedCategory
                            )?.name
                    }
                    productsList={filteredProducts}
                    link="/products"
                    user={user}
                    setShowLogin={setShowLogin}
                />
            </main>

        </>

    );
};

export default HomePage;
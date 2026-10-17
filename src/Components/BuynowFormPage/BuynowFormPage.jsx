"use client";

import Script from "next/script";
import React, { useEffect, useState } from "react";
import {
    FaUser,
    FaPhone,
    FaMapMarkerAlt,
    FaCity,
    FaMapPin,
    FaCreditCard,
    FaShieldAlt,
    FaTruck,
    FaMinus,
    FaPlus,
    FaArrowLeft,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "@/redux/action/orderAction";
import { createPaymentOrder, verifyPayment } from "@/redux/action/paymentAction";
import { getProduct } from "@/redux/action/productAction";
import { useRouter } from "next/navigation";
import Link from "next/link";

import "./BuynowFormPage.css";

const BuynowFormPage = ({ productId }) => {

    const dispatch = useDispatch();
    const router = useRouter();
    
    const [paymentMethod, setPaymentMethod] = useState("razorpay");
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const [popup, setPopup] = useState({
        show: false,
        type: "",
        title: "",
        message: "",
    });

    const {
        product,
        isLoading,
        isError,
    } = useSelector(
        (state) => state.productStore
    );

    useEffect(() => {

        if (productId) {

            console.log(
                "BUY NOW PRODUCT ID:",
                productId
            );

            dispatch(getProduct(productId));
        }

    }, [dispatch, productId]);

    const { user } = useSelector(
        (state) => state.authStore
    );



    const [quantity, setQuantity] = useState(1);

    const [formData, setFormData] = useState({
        fullName: "",
        mobile: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });
    useEffect(() => {

        if (user) {

            setFormData({

                fullName:
                    user.profileName || "",

                mobile:
                    user.phoneNumber || "",

                address:
                    user.address || "",

                city:
                    user.city || "",

                state:
                    user.state || "",

                pincode:
                    user.pincode || "",

            });

        }

    }, [user]);


    const price = Number(
        product?.discountPrice ||
        product?.price ||
        0
    );

    const totalPrice = price * quantity;

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const increaseQuantity = () => {

        setQuantity((prev) => {

            if (prev >= Number(product?.stock || 0)) {
                return prev;
            }

            return prev + 1;
        });

    };

    const decreaseQuantity = () => {

        setQuantity((prev) =>
            Math.max(1, prev - 1)
        );

    };

    const handleContinuePayment = async (e) => {

        e.preventDefault();

        // =====================================
        // STOCK CHECK
        // =====================================

        if (!product || Number(product.stock) <= 0) {

            setPopup({
                show: true,
                type: "error",
                title: "Out of Stock",
                message:
                    "Sorry, this product is currently out of stock.",
            });

            return;
        }


        if (quantity > Number(product.stock)) {

            setPopup({
                show: true,
                type: "error",
                title: "Insufficient Stock",
                message:
                    `Only ${product.stock} item(s) are available.`,
            });

            return;
        }


        // =====================================
        // DELIVERY VALIDATION
        // =====================================

        if (
            !formData.fullName ||
            !formData.mobile ||
            !formData.address ||
            !formData.city ||
            !formData.state ||
            !formData.pincode
        ) {

            setPopup({
                show: true,
                type: "error",
                title: "Missing Delivery Details",
                message:
                    "Please fill in all delivery details before continuing.",
            });

            return;
        }


        try {

            // =====================================
            // CASH ON DELIVERY
            // =====================================

            if (paymentMethod === "cod") {

                const orderData = {

                    items: [
                        {
                            productId: productId,
                            quantity: quantity,
                        },
                    ],

                    shippingAddress: {
                        fullName: formData.fullName,
                        mobile: formData.mobile,
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                    },

                    paymentMethod: "cod",

                    razorpayOrderId: "",
                    razorpayPaymentId: "",
                };


                console.log(
                    "========== COD ORDER DATA =========="
                );

                console.log(
                    "Product ID:",
                    productId
                );

                console.log(
                    "Quantity:",
                    quantity
                );

                console.log(
                    "Order Data:",
                    orderData
                );


                // Create COD order directly
                // Razorpay will NOT open

                const orderResult =
                    await dispatch(
                        createOrder(orderData)
                    ).unwrap();


                console.log(
                    "COD ORDER CREATED:",
                    orderResult
                );


                if (!orderResult.success) {

                    setPopup({
                        show: true,
                        type: "error",
                        title: "Order Failed",
                        message:
                            orderResult.message ||
                            "Order creation failed.",
                    });

                    return;
                }


                // =====================================
                // COD SUCCESS
                // =====================================

                setPopup({

                    show: true,

                    type: "success",

                    title:
                        "Order Placed Successfully 🎉",

                    message:
                        "Your order has been placed successfully. Please pay in cash when your order is delivered.",

                    orderId:
                        orderResult.order._id,

                });


                return;
            }


            // =====================================
            // RAZORPAY PAYMENT
            // =====================================

            const result =
                await dispatch(
                    createPaymentOrder(totalPrice)
                ).unwrap();


            console.log(
                "RAZORPAY ORDER:",
                result
            );


            const order =
                result.order;


            const options = {

                key:
                    process.env
                        .NEXT_PUBLIC_RAZORPAY_KEY_ID,

                amount:
                    order.amount,

                currency:
                    order.currency,

                name:
                    "My E-Commerce Store",

                description:
                    product.productName,

                order_id:
                    order.id,


                // =====================================
                // AFTER RAZORPAY PAYMENT
                // =====================================

                handler: async function (
                    paymentResponse
                ) {

                    try {

                        console.log(
                            "RAZORPAY PAYMENT:",
                            paymentResponse
                        );


                        // =====================================
                        // VERIFY PAYMENT
                        // =====================================

                        const verifyResult =
                            await dispatch(
                                verifyPayment({

                                    razorpay_order_id:
                                        paymentResponse
                                            .razorpay_order_id,

                                    razorpay_payment_id:
                                        paymentResponse
                                            .razorpay_payment_id,

                                    razorpay_signature:
                                        paymentResponse
                                            .razorpay_signature,

                                })
                            ).unwrap();


                        console.log(
                            "PAYMENT VERIFIED:",
                            verifyResult
                        );


                        if (!verifyResult.success) {

                            setPopup({

                                show: true,

                                type: "error",

                                title:
                                    "Payment Verification Failed",

                                message:
                                    "We could not verify your payment. Please try again.",

                            });

                            return;
                        }


                        // =====================================
                        // CREATE RAZORPAY ORDER
                        // =====================================

                        const orderData = {

                            items: [
                                {
                                    productId:
                                        productId,

                                    quantity:
                                        quantity,
                                },
                            ],

                            shippingAddress: {

                                fullName:
                                    formData.fullName,

                                mobile:
                                    formData.mobile,

                                address:
                                    formData.address,

                                city:
                                    formData.city,

                                state:
                                    formData.state,

                                pincode:
                                    formData.pincode,

                            },

                            paymentMethod:
                                "razorpay",

                            razorpayOrderId:
                                paymentResponse
                                    .razorpay_order_id,

                            razorpayPaymentId:
                                paymentResponse
                                    .razorpay_payment_id,

                        };


                        console.log(
                            "========== BUY NOW ORDER DATA =========="
                        );

                        console.log(
                            "Order Data:",
                            orderData
                        );


                        const orderResult =
                            await dispatch(
                                createOrder(orderData)
                            ).unwrap();


                        console.log(
                            "ORDER CREATED:",
                            orderResult
                        );


                        if (!orderResult.success) {

                            setPopup({

                                show: true,

                                type: "error",

                                title:
                                    "Order Failed",

                                message:
                                    orderResult.message ||
                                    "Order creation failed.",

                            });

                            return;
                        }


                        // =====================================
                        // RAZORPAY SUCCESS
                        // =====================================

                        setPopup({

                            show: true,

                            type: "success",

                            title:
                                "Payment Successful 🎉",

                            message:
                                "Your payment was successful and your order has been placed successfully.",

                            orderId:
                                orderResult.order._id,

                        });


                    } catch (error) {

                        console.error(
                            "PAYMENT VERIFY / ORDER ERROR:",
                            error
                        );


                        setPopup({

                            show: true,

                            type: "error",

                            title:
                                "Payment Failed",

                            message:
                                error?.message ||
                                "Payment verification failed",

                        });

                    }

                },


                // =====================================
                // RAZORPAY CUSTOMER DETAILS
                // =====================================

                prefill: {

                    name:
                        formData.fullName,

                    contact:
                        formData.mobile,

                },


                theme: {

                    color:
                        "#fa4702",

                },

            };


            // =====================================
            // OPEN RAZORPAY
            // =====================================

            const razorpay =
                new window.Razorpay(options);

            razorpay.open();

        } catch (error) {

            console.error(
                "PAYMENT ERROR:",
                error
            );


            setPopup({

                show: true,

                type: "error",

                title:
                    "Payment Failed",

                message:
                    error?.message ||
                    "Unable to start the payment. Please try again.",

            });

        }

    };

    if (!product) {
        return (
            <div className="buypage-loading-overlay">
                <div className="buypage-loader"></div>
                <p>Loading...</p>
            </div>
        );
    }


     if (Number(product.stock) <= 0) {
            return (
                <main className="buy-now-page">
                    <div
                        className="out-of-stock-page"
                        style={{
                            minHeight: "70vh",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            padding: "40px",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "70px",
                                marginBottom: "20px",
                            }}
                        >
                            ✕
                        </div>
    
                        <h1
                            style={{
                                color: "#dc2626",
                                marginBottom: "10px",
                            }}
                        >
                            Out of Stock
                        </h1>
    
                        <p
                            style={{
                                color: "#666",
                                marginBottom: "25px",
                            }}
                        >
                            Sorry, this product is currently out of stock.
                        </p>
    
                        <Link
                            href="/"
                            className="buy-now-back"
                        >
                            <FaArrowLeft />
                            Back to Shopping
                        </Link>
                    </div>
                </main>
            );
        }


    return (

        <>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="afterInteractive"
            />
            {popup.show && (
                <div className="payment-popup-overlay">

                    <div className={`payment-popup ${popup.type}`}>

                        <div className="payment-popup-icon">

                            {popup.type === "success" ? "✓" : "!"}

                        </div>

                        <h2>
                            {popup.title}
                        </h2>

                        <p>
                            {popup.message}
                        </p>

                        <button
                            className="payment-popup-btn"
                            onClick={() => {

                                if (
                                    popup.type === "success" &&
                                    popup.orderId
                                ) {
                                    router.push(
                                        `/order-success/${popup.orderId}`
                                    );
                                } else {
                                    setPopup({
                                        show: false,
                                        type: "",
                                        title: "",
                                        message: "",
                                    });
                                }

                            }}
                        >
                            {popup.type === "success"
                                ? "View Order"
                                : "Okay"}
                        </button>

                    </div>

                </div>
            )}

            <main className="buy-now-page">

                

                <div className="buy-now-container">


                    {/* =========================
                    HEADER
                ========================= */}

                    <div className="buy-now-header">

                        <Link
                            href="/"
                            className="buy-now-back"
                        >
                            <FaArrowLeft />
                            Back to Shopping
                        </Link>

                        <div>
                            <h1>Buy Now</h1>

                            <p>
                                Complete your details and place your order
                            </p>
                        </div>

                    </div>


                    {/* =========================
                    MAIN CONTENT
                ========================= */}

                    <div className="buy-now-layout">


                        {/* =================================
                        LEFT SIDE - DELIVERY FORM
                    ================================= */}

                        <section className="delivery-card">

                            <div className="section-title">

                                <div className="section-icon">
                                    <FaMapMarkerAlt />
                                </div>

                                <div>
                                    <h2>Delivery Details</h2>

                                    <p>
                                        Enter your delivery information
                                    </p>
                                </div>

                            </div>


                            <form onSubmit={handleContinuePayment}>


                                {/* FULL NAME */}

                                <div className="form-group">

                                    <label>
                                        <FaUser />
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* MOBILE */}

                                <div className="form-group">

                                    <label>
                                        <FaPhone />
                                        Mobile Number
                                    </label>

                                    <input
                                        type="tel"
                                        name="mobile"
                                        placeholder="Enter mobile number"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        maxLength="10"
                                        required
                                    />

                                </div>


                                {/* ADDRESS */}

                                <div className="form-group">

                                    <label>
                                        <FaMapMarkerAlt />
                                        Address
                                    </label>

                                    <textarea
                                        name="address"
                                        placeholder="House No, Street, Area..."
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="4"
                                        required
                                    />

                                </div>


                                {/* CITY + STATE */}

                                <div className="form-row">

                                    <div className="form-group">

                                        <label>
                                            <FaCity />
                                            City
                                        </label>

                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            State
                                        </label>

                                        <input
                                            type="text"
                                            name="state"
                                            placeholder="State"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>

                                </div>


                                {/* PINCODE */}

                                <div className="form-group">

                                    <label>
                                        <FaMapPin />
                                        Pincode
                                    </label>

                                    <input
                                        type="text"
                                        name="pincode"
                                        placeholder="6-digit pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        maxLength="6"
                                        required
                                    />

                                </div>


                                {/* PAYMENT METHOD */}

                                <div className="payment-section">

                                    <div className="payment-heading">

                                        <FaCreditCard />

                                        <div>
                                            <h3>Payment Method</h3>

                                            <p>
                                                Select your preferred payment method
                                            </p>
                                        </div>

                                    </div>


                                    {/* RAZORPAY */}

                                    <label className="payment-option">

                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="razorpay"
                                            checked={paymentMethod === "razorpay"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />

                                        <div className="payment-option-content">

                                            <div className="razorpay-icon">
                                                ₹
                                            </div>

                                            <div>
                                                <strong>
                                                    Razorpay
                                                </strong>

                                                <span>
                                                    UPI, Cards, Net Banking & more
                                                </span>
                                            </div>

                                        </div>

                                        <span className="payment-check">
                                            ✓
                                        </span>

                                    </label>


                                    {/* CASH ON DELIVERY */}

                                    <label className="payment-option">

                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === "cod"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />

                                        <div className="payment-option-content">

                                            <div className="razorpay-icon">
                                                ₹
                                            </div>

                                            <div>
                                                <strong>
                                                    Cash on Delivery
                                                </strong>

                                                <span>
                                                    Pay with cash when your order is delivered
                                                </span>
                                            </div>

                                        </div>

                                        <span className="payment-check">
                                            ✓
                                        </span>

                                    </label>

                                </div>


                                {/* CONTINUE BUTTON */}

                                <button
                                    type="submit"
                                    className="continue-payment-btn"
                                    disabled={isPaymentLoading}
                                >
                                    <FaCreditCard />

                                    {isPaymentLoading
                                        ? "Processing..."
                                        : paymentMethod === "cod"
                                            ? `Place Order ₹${totalPrice.toLocaleString("en-IN")}`
                                            : `Continue & Pay ₹${totalPrice.toLocaleString("en-IN")}`
                                    }
                                </button>


                                <div className="secure-payment">

                                    <FaShieldAlt />

                                    <span>
                                        {paymentMethod === "cod"
                                            ? "Pay in cash when your order is delivered"
                                            : "Secure payment powered by Razorpay"
                                        }
                                    </span>

                                </div>

                            </form>

                        </section>



                        {/* =================================
                        RIGHT SIDE - PRODUCT SUMMARY
                    ================================= */}

                        <aside className="order-summary-card">

                            <div className="summary-title">

                                <h2>
                                    Order Summary
                                </h2>

                                <span>
                                    1 Item
                                </span>

                            </div>


                            {/* PRODUCT */}

                            <div className="summary-product">

                                <div className="summary-image">

                                    <img
                                        src={
                                            product.images?.[0] ||
                                            "/images/no-image.png"
                                        }
                                        alt={product.productName}
                                    />

                                </div>


                                <div className="summary-product-info">

                                    <span className="summary-brand">
                                        {product.brand}
                                    </span>

                                    <h3>
                                        {product.productName}
                                    </h3>

                                    <strong>
                                        ₹{price.toLocaleString("en-IN")}
                                    </strong>

                                </div>

                            </div>


                            {/* QUANTITY */}

                            <div className="summary-quantity">

                                <span>
                                    Quantity
                                </span>

                                <div className="quantity-box">

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
                                        disabled={quantity >= Number(product.stock)}
                                    >
                                        <FaPlus />
                                    </button>

                                </div>

                            </div>


                            {/* PRICE DETAILS */}

                            <div className="price-details">

                                <h3>
                                    Price Details
                                </h3>


                                <div className="price-row">

                                    <span>
                                        Product Price
                                    </span>

                                    <span>
                                        ₹
                                        {price.toLocaleString("en-IN")}
                                    </span>

                                </div>


                                <div className="price-row">

                                    <span>
                                        Quantity
                                    </span>

                                    <span>
                                        × {quantity}
                                    </span>

                                </div>


                                <div className="price-row">

                                    <span>
                                        Delivery
                                    </span>

                                    <span className="free">
                                        FREE
                                    </span>

                                </div>


                                <div className="price-divider"></div>


                                <div className="total-row">

                                    <strong>
                                        Total Amount
                                    </strong>

                                    <strong>
                                        ₹
                                        {totalPrice.toLocaleString("en-IN")}
                                    </strong>

                                </div>

                            </div>


                            {/* BENEFITS */}

                            <div className="order-benefits">

                                <div>

                                    <FaTruck />

                                    <span>
                                        Free Delivery
                                    </span>

                                </div>


                                <div>

                                    <FaShieldAlt />

                                    <span>
                                        Secure Payment
                                    </span>

                                </div>

                            </div>

                        </aside>

                    </div>

                </div>

            </main>
        </>
    );
};

export default BuynowFormPage;
"use client";

import React, { useEffect, useState } from "react";

import {
    FaBoxOpen,
    FaTruck,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaArrowRight,
    FaShoppingBag,
    FaLock,
    FaUser,
} from "react-icons/fa";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import { getOrders, cancelOrder } from "@/redux/action/orderAction";

import { useRouter } from "next/navigation";
import { getProfile} from "@/redux/slice/authSlice";
import "./OrdersPage.css";
import Loading from "../Common/Loding/Loading";


const OrdersPage = () => {

    const dispatch = useDispatch();

    const router = useRouter();
    const {
        orders,
        isLoading,
        isError,
        errorMessage,
    } = useSelector(
        (state) => state.orderStore
    );

    const [popup, setPopup] = useState({
        show: false,
        type: "",
        message: "",
    });

    const {
        user,
        isAuthenticated,
        isAuthChecked,
    } = useSelector(
        (state) => state.authStore
    );
    

    useEffect(() => {

        dispatch(getProfile());

    }, [dispatch]);


    useEffect(() => {

        if (isAuthChecked && isAuthenticated) {

            dispatch(getOrders());

        }

    }, [dispatch, isAuthChecked, isAuthenticated]);

  
    if (!isAuthChecked) {

        return (
            <div className="orders-loading-overlay">

                <div className="orders-loader"></div>

                <p>Checking your account...</p>

            </div>
        );

    }

    if (!isAuthenticated) {

        return (
            <main className="orders-page">

                <div className="orders-container">

                    <div className="login-required-box">

                        <div className="login-required-icon">
                            <FaLock />
                        </div>

                        <h1>
                            Login Required to View Orders
                        </h1>

                        <p className="login-required-description">
                            Your order history is securely linked to your account.
                            Please log in to access your previous orders, track active
                            deliveries, view payment details, and manage your purchases
                            in one place.
                        </p>

                        <div className="order-benefits">

                            <div className="order-benefit">
                                <span>📦</span>
                                <div>
                                    <strong>Track Your Orders</strong>
                                    <p>
                                        Check your order status and delivery updates.
                                    </p>
                                </div>
                            </div>

                            <div className="order-benefit">
                                <span>🧾</span>
                                <div>
                                    <strong>View Order History</strong>
                                    <p>
                                        Access your previous purchases and order details.
                                    </p>
                                </div>
                            </div>

                            <div className="order-benefit">
                                <span>🔒</span>
                                <div>
                                    <strong>Secure & Private</strong>
                                    <p>
                                        Your order and payment information stays protected.
                                    </p>
                                </div>
                            </div>

                        </div>

                        <button
                            className="continue-shopping-btn"
                            onClick={() => router.push("/")}
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>

            </main>
        );
    }


    if (isLoading) {
        return (
           <Loading/>
        );
    }

    if (isError) {

        return (
            <main className="orders-page">

                <div className="orders-container">

                    <div className="orders-error">

                        <FaTimesCircle />

                        <h2>
                            Unable to load orders
                        </h2>

                        <p>
                            {errorMessage ||
                                "Something went wrong"}
                        </p>

                        <button
                            onClick={() =>
                                dispatch(getOrders())
                            }
                        >
                            Try Again
                        </button>

                    </div>

                </div>

            </main>
        );
    }

    const handleCancelOrder = async (orderId) => {

        const result = await dispatch(
            cancelOrder(orderId)
        );

        if (cancelOrder.fulfilled.match(result)) {

            setPopup({
                show: true,
                type: "success",
                message: "Your order has been cancelled successfully.",
            });

           
            dispatch(getOrders());

        } else {

            setPopup({
                show: true,
                type: "error",
                message:
                    result.payload?.message ||
                    "Failed to cancel order.",
            });
        }
    };


    return (

        <main className="orders-page">


            {popup.show && (
                <div className="order-popup-overlay">

                    <div className={`order-popup ${popup.type}`}>

                        <button
                            className="order-popup-close"
                            onClick={() =>
                                setPopup({
                                    show: false,
                                    type: "",
                                    message: "",
                                })
                            }
                        >
                            ×
                        </button>

                        <div className="order-popup-icon">

                            {popup.type === "success" ? (
                                <FaCheckCircle />
                            ) : (
                                <FaTimesCircle />
                            )}

                        </div>

                        <h2>
                            {popup.type === "success"
                                ? "Order Cancelled"
                                : "Cancellation Failed"}
                        </h2>

                        <p>
                            {popup.message}
                        </p>

                        <button
                            className="order-popup-btn"
                            onClick={() =>
                                setPopup({
                                    show: false,
                                    type: "",
                                    message: "",
                                })
                            }
                        >
                            Okay
                        </button>

                    </div>

                </div>
            )}


            <div className="orders-container">


                {/* =================================
                    HEADER
                ================================= */}

                <div className="orders-header">

                    <div>

                        <span className="orders-header-icon">
                            <FaShoppingBag />
                        </span>

                        <div>

                            <h1>
                                My Orders
                            </h1>

                            <p>
                                Track and manage all your orders
                            </p>

                        </div>

                    </div>

                    <span className="orders-count">

                        {orders.length}

                        {orders.length === 1
                            ? " Order"
                            : " Orders"}

                    </span>

                </div>


                {/* =================================
                    EMPTY ORDERS
                ================================= */}

                {orders.length === 0 ? (

                    <div className="empty-orders">

                        {/* Icon */}
                        <div className="empty-orders-icon">
                            <FaBoxOpen />
                        </div>

                        {/* Content */}
                        <div className="empty-orders-content">

                            <span className="empty-orders-label">
                                Your order list is empty
                            </span>

                            <h2>
                                No Orders Yet
                            </h2>

                            <p>
                                You haven't placed any orders yet.
                                Discover amazing products and start
                                shopping today.
                            </p>

                            {/* Features */}
                            <div className="empty-orders-features">

                                <div className="empty-feature">
                                    <FaShoppingBag />
                                    <span>
                                        Explore Products
                                    </span>
                                </div>

                                <div className="empty-feature">
                                    <FaTruck />
                                    <span>
                                        Fast Delivery
                                    </span>
                                </div>

                                <div className="empty-feature">
                                    <FaCheckCircle />
                                    <span>
                                        Easy Ordering
                                    </span>
                                </div>

                            </div>

                            {/* Button */}
                            <button
                                className="empty-orders-btn"
                                onClick={() => router.push("/")}
                            >
                                Start Shopping
                                <FaArrowRight />
                            </button>

                        </div>

                    </div>

                )  : (

                    <div className="orders-list">

                        {orders.map((order) => (

                            <div
                                className="order-card"
                                key={order._id}
                            >


                                {/* =========================
                                    ORDER HEADER
                                ========================= */}

                                <div className="order-card-header">

                                    <div>

                                        <span>
                                            Order ID
                                        </span>

                                        <strong>
                                            #{order._id}
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Ordered On
                                        </span>

                                        <strong>
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}
                                        </strong>

                                    </div>

                                </div>


                                {/* =========================
                                    PRODUCTS
                                ========================= */}

                                <div className="order-products">

                                    {order.items?.map(
                                        (item, index) => (

                                            <div
                                                className="order-product"
                                                key={
                                                    item.product?._id ||
                                                    index
                                                }
                                            >

                                                <div className="order-product-image">

                                                    <img
                                                        src={
                                                            item.image ||
                                                            item.product?.images?.[0] ||
                                                            "/images/no-image.png"
                                                        }
                                                        alt={
                                                            item.productName ||
                                                            "Product"
                                                        }
                                                    />

                                                </div>


                                                <div className="order-product-info">

                                                    <h3>
                                                        {item.productName}
                                                    </h3>

                                                    <p>
                                                        Quantity:
                                                        {" "}
                                                        {item.quantity}
                                                    </p>

                                                    <strong>
                                                        ₹
                                                        {Number(
                                                            item.price
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>


                                {/* =========================
                                    ORDER BOTTOM
                                ========================= */}

                                <div className="order-card-bottom">


                                    {/* STATUS */}

                                    <div className="order-status">

                                        {order.orderStatus ===
                                            "confirmed" && (
                                                <>
                                                    <FaCheckCircle />
                                                    <span>
                                                        Order Confirmed
                                                    </span>
                                                </>
                                            )}

                                        {order.orderStatus ===
                                            "processing" && (
                                                <>
                                                    <FaClock />
                                                    <span>
                                                        Processing
                                                    </span>
                                                </>
                                            )}

                                        {order.orderStatus ===
                                            "shipped" && (
                                                <>
                                                    <FaTruck />
                                                    <span>
                                                        Shipped
                                                    </span>
                                                </>
                                            )}

                                        {order.orderStatus ===
                                            "delivered" && (
                                                <>
                                                    <FaCheckCircle />
                                                    <span>
                                                        Delivered
                                                    </span>
                                                </>
                                            )}

                                        {order.orderStatus ===
                                            "cancelled" && (
                                                <>
                                                    <FaTimesCircle />
                                                    <span>
                                                        Cancelled
                                                    </span>
                                                </>
                                            )}

                                        {order.orderStatus ===
                                            "pending" && (
                                                <>
                                                    <FaClock />
                                                    <span>
                                                        Pending
                                                    </span>
                                                </>
                                            )}

                                    </div>


                                    {/* PAYMENT */}

                                    <div className="order-payment">

                                        <span>
                                            Payment
                                        </span>

                                        <strong
                                            className={
                                                order.paymentStatus ===
                                                    "paid"
                                                    ? "paid"
                                                    : "payment-pending"
                                            }
                                        >
                                            {order.paymentStatus ===
                                                "paid"
                                                ? "Paid"
                                                : order.paymentStatus}
                                        </strong>

                                    </div>


                                    {/* TOTAL */}

                                    <div className="order-total">

                                        <span>
                                            Total
                                        </span>

                                        <strong>
                                            ₹
                                            {Number(
                                                order.totalAmount
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                    </div>

                                    {order.orderStatus !== "delivered" &&
                                        order.orderStatus !== "shipped" &&
                                        order.orderStatus !== "cancelled" && (

                                            <button
                                                className="cancel-order-btn"
                                                onClick={() =>
                                                    handleCancelOrder(order._id)
                                                }
                                                disabled={isLoading}
                                            >
                                                <FaTimesCircle />
                                                Cancel Order
                                            </button>

                                        )}
                                    
                                    {/* VIEW */}

                                    <button
                                        className="view-order-btn"
                                        onClick={() =>
                                            router.push(
                                                `/order-success/${order._id}`
                                            )
                                        }
                                    >

                                        View Details

                                        <FaArrowRight />

                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </main>
    );
};


export default OrdersPage;
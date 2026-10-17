"use client";

import React from "react";
import Link from "next/link";

import {
    FaArrowLeft,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaBoxOpen,
    FaCreditCard,
    FaTruck,
    FaCheckCircle,
    FaClock,
    FaCog,
    FaTimesCircle,
    FaShoppingBag,
} from "react-icons/fa";

import "./OderViewPage.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrder } from "@/redux/action/orderAction";
import Loading from "@/Components/Common/Loding/Loading";

const OrderViewPage = ({ orderId }) => {

    const dispatch = useDispatch();

    const {
        selectedOrder,
        isLoading,
        isError,
        errorMessage,
    } = useSelector((state) => state.orderStore);

    useEffect(() => {
        if (orderId) {
            dispatch(getOrder(orderId));
        }
    }, [dispatch, orderId]);

    const order = selectedOrder;

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return (
            <div className="order-view-page">
                <h2>{errorMessage || "Failed to load order"}</h2>

                <Link href="/admin/orders">
                    <FaArrowLeft />
                    Back to Orders
                </Link>
            </div>
        );
    }

    if (!order) {
        return <Loading />;
    }

    const orderStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
    ];

    const currentStatus = order?.orderStatus;

    const currentStatusIndex =
        orderStatuses.indexOf(currentStatus);

    return (

        <div className="order-view-page">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="order-view-header">

                <div>

                    <Link
                        href="/admin/orders"
                        className="order-back-btn"
                    >

                        <FaArrowLeft />

                        Back to Orders

                    </Link>


                    <div className="order-title-row">

                        <div>

                            <h1>
                                Order #{order._id?.slice(-8).toUpperCase()}
                            </h1>

                            <p>
                                Order placed on{" "}
                                {order.createdAt
                                    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })
                                    : "-"}
                            </p>

                        </div>

                        <span
                            className={`order-view-status ${order.orderStatus}`}
                        >
                            {order.orderStatus === "delivered" && (
                                <FaCheckCircle />
                            )}

                            {order.orderStatus === "processing" && (
                                <FaCog />
                            )}

                            {order.orderStatus === "pending" && (
                                <FaClock />
                            )}

                            {order.orderStatus === "cancelled" && (
                                <FaTimesCircle />
                            )}

                            {order.orderStatus}
                        </span>

                    </div>

                </div>

            </div>



            {/* =========================================
                MAIN GRID
            ========================================= */}

            <div className="order-view-grid">


                {/* =========================================
                    LEFT SIDE
                ========================================= */}

                <div className="order-view-left">


                    {/* =========================================
                        ORDER ITEMS
                    ========================================= */}

                    <div className="order-view-card">

                        <div className="order-card-heading">

                            <div>

                                <h2>
                                    Order Items
                                </h2>

                                <p>
                                    Products included in this order
                                </p>

                            </div>

                            <span className="order-item-count">

                                <FaShoppingBag />

                                {order.items.length} Items

                            </span>

                        </div>



                        <div className="order-items-list">


                            {order.items.map((item) => (

                                <div
                                    className="order-item"
                                   key={item._id}
                                >


                                    {/* IMAGE */}

                                    <div className="order-item-image">

                                        <img
                                            src={
                                                item.image ||
                                                "/images/no-image.png"
                                            }
                                            alt={item.productName}
                                        />

                                    </div>



                                    {/* PRODUCT INFO */}

                                    <div className="order-item-info">

                                        <h3>
                                            {item.productName}
                                        </h3>

                                        <span>
                                            {item.category || item.product?.category || "N/A"}
                                        </span>

                                        <p>
                                            Quantity: {item.quantity}
                                        </p>

                                    </div>



                                    {/* PRICE */}

                                    <div className="order-item-price">

                                        <strong>
                                            ₹
                                            {Number(
                                                item.price * item.quantity
                                            ).toLocaleString("en-IN")}
                                        </strong>

                                        <span>
                                            ₹
                                            {Number(
                                                item.price
                                            ).toLocaleString("en-IN")} ×{" "}
                                            {item.quantity}
                                        </span>

                                    </div>


                                </div>

                            ))}


                        </div>

                    </div>



                    {/* =========================================
                        ORDER TIMELINE
                    ========================================= */}

                    <div className="order-view-card">

                        <div className="order-card-heading">
                            <div>
                                <h2>Order Status</h2>
                                <p>Track the order progress</p>
                            </div>
                        </div>


                        <div className="order-status-timeline">

                            {orderStatuses.map((status, index) => {

                                const completed =
                                    index <= currentStatusIndex;

                                const isCurrent =
                                    index === currentStatusIndex;

                                return (
                                    <div
                                        key={status}
                                        className={`order-status-item ${completed ? "completed" : "pending"
                                            } ${isCurrent ? "current" : ""}`}
                                    >

                                        {/* Line */}
                                        {index < orderStatuses.length - 1 && (
                                            <div className="order-status-connector">
                                                <div
                                                    className={`order-status-connector-fill ${index < currentStatusIndex
                                                            ? "filled"
                                                            : ""
                                                        }`}
                                                />
                                            </div>
                                        )}


                                        {/* Circle */}
                                        <div className="order-status-circle">

                                            {completed ? (
                                                <span className="order-status-check">
                                                    ✓
                                                </span>
                                            ) : (
                                                <span>
                                                    {index + 1}
                                                </span>
                                            )}

                                        </div>


                                        {/* Content */}
                                        <div className="order-status-content">

                                            <h3>
                                                {status === "pending" && "Pending"}
                                                {status === "confirmed" && "Confirmed"}
                                                {status === "processing" && "Processing"}
                                                {status === "shipped" && "Shipped"}
                                                {status === "delivered" && "Delivered"}
                                            </h3>

                                            <p>
                                                {completed
                                                    ? index === 0
                                                        ? new Date(
                                                            order.createdAt
                                                        ).toLocaleString("en-IN", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        })
                                                        : "Order status completed"
                                                    : "Waiting for this step"}
                                            </p>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    </div>


                    {/* =========================================
                        PAYMENT DETAILS
                    ========================================= */}

                    <div className="order-view-card">

                        <div className="order-card-heading">

                            <div>

                                <h2>
                                    Payment Details
                                </h2>

                                <p>
                                    Payment information for this order
                                </p>

                            </div>

                        </div>


                        <div className="payment-details-grid">


                            <div className="payment-detail-item">

                                <span>
                                    Payment Status
                                </span>

                                <strong className="payment-paid">

                                    <FaCheckCircle />

                                    {order.paymentStatus}

                                </strong>

                            </div>


                            <div className="payment-detail-item">
                                <span>
                                    {order.paymentMethod === "cod"
                                        ? "COD Payment ID"
                                        : "Transaction ID"}
                                </span>


                                <strong>
                                    {order.paymentMethod === "cod"
                                        ? order.orderStatus === "delivered" &&
                                            order.paymentStatus === "paid"
                                            ? order.codPaymentId || "Payment ID unavailable"
                                            : "Payment Pending"
                                        : order.razorpayPaymentId ||
                                        order.transactionId ||
                                        "N/A"}
                                </strong>
                            </div>
                          




                            <div className="payment-detail-item">
                                <span>Transaction ID</span>
                                <strong>
                                    {order.paymentMethod === "cod"
                                        ? order.orderStatus === "delivered" &&
                                            order.paymentStatus === "paid"
                                            ? order.codPaymentId || "Payment ID unavailable"
                                            : "Payment Pending"
                                        : order.razorpayPaymentId ||
                                        order.transactionId ||
                                        "N/A"}
                                </strong>
                            </div>


                        </div>

                    </div>


                </div>



                {/* =========================================
                    RIGHT SIDE
                ========================================= */}

                <div className="order-view-right">


                    {/* =========================================
                        CUSTOMER
                    ========================================= */}

                    <div className="order-view-card">

                        <div className="order-card-heading">

                            <div>

                                <h2>
                                    Customer
                                </h2>

                                <p>
                                    Customer information
                                </p>

                            </div>

                        </div>


                        <div className="customer-view-info">


                            <div className="">
                                {order.user?.profileImage ? (
                                    <img
                                        src={order.user.profileImage}
                                        alt={order.user?.profileName || "Customer"}
                                        className="customer-avatar-img"
                                    />
                                ) : (
                                        <FaUser className="customer-view-avatar"/>
                                )}
                            </div>

                            <div>

                                <strong>
                                    {order.user.profileName}
                                </strong>

                                <span>
                                    Customer
                                </span>

                            </div>


                        </div>



                        <div className="customer-contact-item">

                            <i className="fa-solid fa-envelope"></i>

                            <span>
                                {order.user.email}
                            </span>

                        </div>



                        <div className="customer-contact-item">

                            <i className="fa-solid fa-phone"></i>

                            <span>
                                {order.user.phoneNumber}
                            </span>

                        </div>


                    </div>



                    {/* =========================================
                        SHIPPING ADDRESS
                    ========================================= */}

                    <div className="order-view-card">

                        <div className="order-card-heading">

                            <div>

                                <h2>
                                    Shipping Address
                                </h2>

                                <p>
                                    Delivery address
                                </p>

                            </div>

                        </div>


                        <div className="shipping-address">

                            <div className="shipping-icon">

                                <FaMapMarkerAlt />

                            </div>


                            <div>

                                <strong>
                                    {order.shippingAddress.name}
                                </strong>

                                <p>
                                    {order.shippingAddress.address}
                                    <br />
                                    {order.shippingAddress.city},{" "}
                                    {order.shippingAddress.state}
                                    <br />
                                    PIN - {order.shippingAddress.pincode}
                                </p>

                                <span>

                                    <i className="fa-solid fa-phone"></i>

                                    {order.shippingAddress.mobile}

                                </span>

                            </div>

                        </div>

                    </div>



                    {/* =========================================
                        ORDER SUMMARY
                    ========================================= */}

                    <div className="order-view-card order-summary-card">

                        <div className="order-card-heading">

                            <div>

                                <h2>
                                    Order Summary
                                </h2>

                                <p>
                                    Payment breakdown
                                </p>

                            </div>

                        </div>


                        <div className="summary-row">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ₹
                                {Number(
                                    order.subtotal || 0
                                ).toLocaleString("en-IN")}
                            </strong>

                        </div>


                        <div className="summary-row">

                            <span>
                                Delivery Charge
                            </span>

                            <strong>
                                ₹
                                {Number(
                                    order.deliveryCharge || 0
                                ).toLocaleString("en-IN")}
                            </strong>

                        </div>


                        <div className="summary-divider"></div>


                        <div className="summary-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹
                                {Number(
                                    order.totalAmount || 0
                                ).toLocaleString("en-IN")}
                            </strong>

                        </div>


                    </div>


                </div>


            </div>

        </div>

    );

};


export default OrderViewPage;
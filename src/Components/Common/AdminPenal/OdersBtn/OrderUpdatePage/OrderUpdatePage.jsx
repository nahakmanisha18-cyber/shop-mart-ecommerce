"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
    FaArrowLeft,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaBox,
    FaCreditCard,
    FaTruck,
    FaCheckCircle,
} from "react-icons/fa";

import {
    getOrder,
    updateOrder,
} from "@/redux/action/orderAction";

import "./OrderUpdatePage.css";
import Loading from "@/Components/Common/Loding/Loading";


const OrderUpdatePage = () => {

    const router = useRouter();

    const params = useParams();

    const dispatch = useDispatch();


    const orderId = params?.id;


    /* =========================
       REDUX STATE
    ========================= */

    const {
        selectedOrder,
        isLoading,
        isError,
        errorMessage,
        isSuccess,
    } = useSelector((state) => state.orderStore);


    const order = selectedOrder;


    /* =========================
       LOCAL STATES
    ========================= */

    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState("success");

    /* =========================
       GET ORDER FROM DATABASE
    ========================= */

    useEffect(() => {

        if (orderId) {

            dispatch(getOrder(orderId));

        }

    }, [dispatch, orderId]);


    /* =========================
       SET FORM VALUES
       AFTER ORDER LOADS
    ========================= */

    useEffect(() => {

        if (order) {

            setPaymentMethod(
                order.paymentMethod || "razorpay"
            );

            setPaymentStatus(
                order.paymentStatus || "pending"
            );

            setOrderStatus(
                order.orderStatus || "pending"
            );

        }

    }, [order]);


    /* =========================
       UPDATE ORDER
    ========================= */

    const handleUpdate = async (e) => {

        e.preventDefault();


        if (!orderId) {

            return;

        }


        setIsUpdating(true);


        try {

            await dispatch(
                updateOrder({
                    orderId,

                    paymentMethod,

                    paymentStatus,

                    orderStatus,
                })
            ).unwrap();


            setPopupMessage("Order updated successfully");
            setPopupType("success");
            setShowPopup(true);


             // router.push("/admin/orders");


        } catch (error) {

            console.error(
                "UPDATE ORDER ERROR:",
                error
            );

            setPopupMessage(error || "Failed to update order");
            setPopupType("error");
            setShowPopup(true);

        } finally {

            setIsUpdating(false);

        }

    };


    /* =========================
       LOADING
    ========================= */
    if (isLoading) {
        return <Loading />;
    }


    /* =========================
       ERROR
    ========================= */

    if (isError && !order) {

        return (
            <div className="update-order-loading">

                <p>
                    {errorMessage || "Order not found"}
                </p>

            </div>
        );

    }


    /* =========================
       ORDER NOT FOUND
    ========================= */

    if (!order) {

        return (
            <div className="update-order-loading">

                <p>
                    Order not found
                </p>

            </div>
        );

    }


    return (

        <div className="update-order-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="update-order-header">

                <div>

                    <button
                        type="button"
                        className="update-back-btn"
                        onClick={() =>
                            router.push("/admin/orders")
                        }
                    >

                        <FaArrowLeft />

                        Back to Orders

                    </button>


                    <h1>
                        Update Order
                    </h1>


                    <p>
                        Update order information and status
                    </p>

                </div>


                <div className="update-order-id">

                    <span>
                        Order ID
                    </span>


                    <strong>
                        #
                        {order._id
                            ?.slice(-8)
                            .toUpperCase()}
                    </strong>

                </div>

            </div>



            <form
                className="update-order-form"
                onSubmit={handleUpdate}
            >


                {/* =========================
                    LEFT SIDE
                ========================= */}

                <div className="update-order-main">


                    {/* =========================
                        ORDER INFORMATION
                    ========================= */}

                    <div className="update-order-card">

                        <div className="update-card-heading">

                            <div className="update-heading-icon">

                                <FaBox />

                            </div>


                            <div>

                                <h2>
                                    Order Information
                                </h2>

                                <p>
                                    Manage payment and order status
                                </p>

                            </div>

                        </div>



                        <div className="update-fields-grid">


                            {/* PAYMENT METHOD */}

                            <div className="update-form-group">

                                <label>
                                    Payment Method
                                </label>


                                <select
                                    value={paymentMethod}
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="razorpay">
                                        Razorpay
                                    </option>


                                    <option value="cod">
                                        Cash on Delivery
                                    </option>

                                </select>

                            </div>



                            {/* PAYMENT STATUS */}

                            <div className="update-form-group">

                                <label>
                                    Payment Status
                                </label>


                                <select
                                    value={paymentStatus}
                                    onChange={(e) =>
                                        setPaymentStatus(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="pending">
                                        Pending
                                    </option>


                                    <option value="paid">
                                        Paid
                                    </option>


                                    <option value="failed">
                                        Failed
                                    </option>

                                </select>

                            </div>



                            {/* ORDER STATUS */}

                            <div className="update-form-group full-width">

                                <label>
                                    Order Status
                                </label>


                                <select
                                    value={orderStatus}
                                    onChange={(e) =>
                                        setOrderStatus(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="pending">
                                        Pending
                                    </option>


                                    <option value="confirmed">
                                        Confirmed
                                    </option>


                                    <option value="processing">
                                        Processing
                                    </option>


                                    <option value="shipped">
                                        Shipped
                                    </option>


                                    <option value="delivered">
                                        Delivered
                                    </option>


                                    <option value="cancelled">
                                        Cancelled
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>



                    {/* =========================
                        ORDER ITEMS
                    ========================= */}

                    <div className="update-order-card">

                        <div className="update-card-heading">

                            <div className="update-heading-icon">

                                <FaBox />

                            </div>


                            <div>

                                <h2>
                                    Order Items
                                </h2>

                                <p>
                                    Products included in this order
                                </p>

                            </div>

                        </div>



                        <div className="update-items-list">

                            {order.items?.map((item) => (

                                <div
                                    className="update-item"
                                    key={item._id}
                                >


                                    <div className="update-item-image">

                                        {item.image ? (

                                            <img
                                                src={item.image}
                                                alt={
                                                    item.productName ||
                                                    "Product"
                                                }
                                            />

                                        ) : (

                                            <FaBox />

                                        )}

                                    </div>



                                    <div className="update-item-info">

                                        <h3>
                                            {item.productName}
                                        </h3>


                                        <span>
                                            {item.category ||
                                                item.product?.category ||
                                                "N/A"}
                                        </span>


                                        <p>
                                            Quantity:{" "}
                                            {item.quantity}
                                        </p>

                                    </div>



                                    <div className="update-item-price">

                                        <strong>

                                            ₹
                                            {Number(
                                                item.price *
                                                item.quantity
                                            ).toLocaleString(
                                                "en-IN"
                                            )}

                                        </strong>


                                        <span>

                                            ₹
                                            {Number(
                                                item.price
                                            ).toLocaleString(
                                                "en-IN"
                                            )}

                                            {" "}×{" "}

                                            {item.quantity}

                                        </span>

                                    </div>


                                </div>

                            ))}

                        </div>

                    </div>



                    {/* =========================
                        SHIPPING ADDRESS
                    ========================= */}

                    <div className="update-order-card">

                        <div className="update-card-heading">

                            <div className="update-heading-icon">

                                <FaTruck />

                            </div>


                            <div>

                                <h2>
                                    Shipping Address
                                </h2>

                                <p>
                                    Customer delivery address
                                </p>

                            </div>

                        </div>



                        <div className="update-address-box">

                            <div className="update-address-icon">

                                <FaMapMarkerAlt />

                            </div>


                            <div className="update-address-content">

                                <strong>
                                    {
                                        order.shippingAddress
                                            ?.fullName
                                    }
                                </strong>


                                <p>
                                    {
                                        order.shippingAddress
                                            ?.address
                                    }
                                </p>


                                <p>

                                    {
                                        order.shippingAddress
                                            ?.city
                                    }

                                    ,{" "}

                                    {
                                        order.shippingAddress
                                            ?.state
                                    }

                                </p>


                                <p>

                                    PIN -{" "}

                                    {
                                        order.shippingAddress
                                            ?.pincode
                                    }

                                </p>


                                <p className="update-address-mobile">

                                    <i class="fa-solid fa-phone"></i>

                                    {
                                        order.shippingAddress
                                            ?.mobile
                                    }

                                </p>

                            </div>

                        </div>

                    </div>


                </div>



                {/* =========================
                    RIGHT SIDE
                ========================= */}

                <div className="update-order-sidebar">


                    {/* =========================
                        CUSTOMER
                    ========================= */}

                    <div className="update-order-card">

                        <div className="update-card-heading">

                            <div className="update-heading-icon">

                                <FaUser />

                            </div>


                            <div>

                                <h2>
                                    Customer
                                </h2>

                                <p>
                                    Customer information
                                </p>

                            </div>

                        </div>



                        <div className="update-customer">

                            <div className="update-customer-avatar">

                                {order.user?.profileImage ? (

                                    <img
                                        src={
                                            order.user
                                                .profileImage
                                        }
                                        alt={
                                            order.user
                                                ?.profileName ||
                                            "Customer"
                                        }
                                    />

                                ) : (

                                    <FaUser />

                                )}

                            </div>


                            <div className="update-customer-info">

                                <strong>
                                    {
                                        order.user
                                            ?.profileName ||
                                        "Unknown Customer"
                                    }
                                </strong>


                                <span>
                                    Customer
                                </span>

                            </div>

                        </div>



                        <div className="update-customer-details">


                            <div>

                                <i class="fa-solid fa-envelope"></i>

                                <span>
                                    {
                                        order.user?.email ||
                                        "-"
                                    }
                                </span>

                            </div>


                            <div>

                                <i class="fa-solid fa-phone"></i>

                                <span>
                                    {
                                        order.user
                                            ?.phoneNumber ||
                                        "-"
                                    }
                                </span>

                            </div>


                        </div>

                    </div>



                    {/* =========================
                        ORDER SUMMARY
                    ========================= */}

                    <div className="update-order-card">

                        <div className="update-card-heading">

                            <div className="update-heading-icon">

                                <FaCreditCard />

                            </div>


                            <div>

                                <h2>
                                    Order Summary
                                </h2>

                                <p>
                                    Payment breakdown
                                </p>

                            </div>

                        </div>



                        <div className="update-summary-row">

                            <span>
                                Subtotal
                            </span>


                            <strong>

                                ₹
                                {Number(
                                    order.subtotal || 0
                                ).toLocaleString(
                                    "en-IN"
                                )}

                            </strong>

                        </div>



                        <div className="update-summary-row">

                            <span>
                                Delivery Charge
                            </span>


                            <strong>

                                ₹
                                {Number(
                                    order.deliveryCharge || 0
                                ).toLocaleString(
                                    "en-IN"
                                )}

                            </strong>

                        </div>



                        <div className="update-summary-divider"></div>



                        <div className="update-summary-total">

                            <span>
                                Total
                            </span>


                            <strong>

                                ₹
                                {Number(
                                    order.totalAmount || 0
                                ).toLocaleString(
                                    "en-IN"
                                )}

                            </strong>

                        </div>

                    </div>



                    {/* =========================
                        PAYMENT DETAILS
                    ========================= */}

                    <div className="update-order-card">

                        <div className="update-card-heading">

                            <div className="update-heading-icon">

                                <FaCheckCircle />

                            </div>


                            <div>

                                <h2>
                                    Payment Details
                                </h2>

                                <p>
                                    Transaction information
                                </p>

                            </div>

                        </div>



                        <div className="update-payment-details">


                            <div>

                                <span>
                                    Payment Method
                                </span>


                                <strong>

                                    {order.paymentMethod ===
                                        "cod"

                                        ? "Cash on Delivery"

                                        : "Razorpay"}

                                </strong>

                            </div>



                            <div>

                                <span>
                                    Payment Status
                                </span>


                                <strong
                                    className={`payment-${paymentStatus}`}
                                >

                                    {paymentStatus}

                                </strong>

                            </div>



                            {order.razorpayOrderId && (

                                <div>

                                    <span>
                                        Razorpay Order ID
                                    </span>


                                    <strong>
                                        {
                                            order.razorpayOrderId
                                        }
                                    </strong>

                                </div>

                            )}



                            {order.razorpayPaymentId && (

                                <div>

                                    <span>
                                        Payment ID
                                    </span>


                                    <strong>
                                        {
                                            order.razorpayPaymentId
                                        }
                                    </strong>

                                </div>

                            )}

                        </div>

                    </div>



                    {/* =========================
                        UPDATE BUTTON
                    ========================= */}

                    <button
                        type="submit"
                        className="update-order-submit"
                        disabled={isUpdating}
                    >

                        <FaCheckCircle />

                        {isUpdating
                            ? "Updating..."
                            : "Update Order"}

                    </button>


                </div>


            </form>

            {showPopup && (
                <div className="order-popup-overlay">
                    <div className={`order-popup ${popupType}`}>

                        <div className="order-popup-icon">
                            {popupType === "success" ? "✓" : "!"}
                        </div>

                        <h3>
                            {popupType === "success"
                                ? "Success"
                                : "Error"}
                        </h3>

                        <p>{popupMessage}</p>

                        <button
                            type="button"
                            onClick={() => {
                                setShowPopup(false);
                                router.push("/admin/orders");
                            }}
                        >
                            OK
                        </button>

                    </div>
                </div>
            )}
        </div>

    );

};


export default OrderUpdatePage;
"use client";

import React, {
    useEffect,
} from "react";

import {
    FaCheckCircle,
    FaBoxOpen,
    FaMapMarkerAlt,
    FaCreditCard,
    FaTruck,
    FaHome,
    FaShoppingBag,
    FaReceipt,
    FaCheck
} from "react-icons/fa";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import { getOrder } from "@/redux/action/orderAction";

import { useRouter } from "next/navigation";

import "./OrderSuccessPage.css";
import Loading from "../Common/Loding/Loading";


const OrderSuccessPage = ({
    orderId,
}) => {

    const dispatch = useDispatch();

    const router = useRouter();


    // =====================================
    // ORDER STORE
    // =====================================

    const {
        selectedOrder,
        isLoading,
        isError,
        errorMessage,
    } = useSelector(
        (state) => state.orderStore
    );


    // =====================================
    // GET ONE ORDER
    // =====================================

    useEffect(() => {

        if (orderId) {

            console.log(
                "GET ORDER ID:",
                orderId
            );

            dispatch(
                getOrder(orderId)
            );

        }

    }, [
        dispatch,
        orderId,
    ]);


    // =====================================
    // LOADING
    // =====================================

    if (isLoading) {
        return (
           <Loading/>
        );
    }

    // =====================================
    // ERROR
    // =====================================

    if (isError) {

        return (
            <main className="order-success-page">

                <div className="order-error">

                    <div className="error-icon">
                        !
                    </div>

                    <h2>
                        Unable to load order
                    </h2>

                    <p>
                        {errorMessage}
                    </p>

                    <button
                        onClick={() =>
                            dispatch(
                                getOrder(orderId)
                            )
                        }
                    >
                        Try Again
                    </button>

                </div>

            </main>
        );
    }


    // =====================================
    // ORDER NOT FOUND
    // =====================================

    if (!selectedOrder) {

        return (
            <main className="order-success-page">

                <div className="order-error">

                    <div className="error-icon">
                        !
                    </div>

                    <h2>
                        Order Not Found
                    </h2>

                    <p>
                        We couldn't find this order.
                    </p>

                    <button
                        onClick={() =>
                            router.push("/")
                        }
                    >
                        Continue Shopping
                    </button>

                </div>

            </main>
        );
    }


    // =====================================
    // ORDER DATA
    // =====================================

    const order = selectedOrder;

    const firstItem =
        order.items?.[0];

    const orderDate =
        order.createdAt
            ? new Date(
                order.createdAt
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }
            )
            : "";

        
    const statusSteps = [
        {
            key: "confirmed",
            label: "Order Confirmed",
            icon: <FaCheck />,
        },
        {
            key: "shipped",
            label: "Shipped",
            icon: <FaTruck />,
        },
        {
            key: "delivered",
            label: "Delivered",
            icon: <FaHome />,
        },
            ];

    const statusRank = {
        pending: -1,
        confirmed: 0,
        processing: 0,
        shipped: 1,
        delivered: 2,
        cancelled: -1,
    };

    const currentStatusIndex =
        statusRank[order?.orderStatus] ?? -1;

    const getStatusDate = (status) => {
        const history = [...(order?.statusHistory || [])]
            .reverse()
            .find((item) => item.status === status);

        if (!history?.date) {
            return null;
        }

        return new Date(history.date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }
        );
        };
    return (

        <main className="order-success-page">

            <div className="order-success-container">


                {/* =================================
                    SUCCESS HEADER
                ================================= */}

                <section className="success-header">

                    <div className="success-icon">

                        <FaCheckCircle />

                    </div>

                    <h1>
                        Order Placed Successfully!
                    </h1>

                    <p>
                        Thank you for your purchase.
                        Your order has been confirmed.
                    </p>

                </section>


                {/* =================================
                    ORDER INFO
                ================================= */}

                <section className="order-info-card">

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
                            Order Date
                        </span>

                        <strong>
                            {orderDate}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Payment
                        </span>

                        <strong className="paid-status">

                            <FaCheckCircle />

                            {order.paymentStatus === "paid"
                                ? "Paid"
                                : order.paymentStatus}

                        </strong>

                    </div>

                </section>


                {/* =================================
                    MAIN GRID
                ================================= */}

                <div className="success-grid">


                    {/* ==============================
                        LEFT SIDE
                    ============================== */}

                    <div className="success-left">


                        {/* PRODUCT CARD */}

                        <section className="success-card">

                            <div className="card-heading">

                                <div className="heading-icon">
                                    <FaBoxOpen />
                                </div>

                                <div>

                                    <h2>
                                        Ordered Product
                                    </h2>

                                    <p>
                                        Your order details
                                    </p>

                                </div>

                            </div>


                            {order.items?.map(
                                (item, index) => (

                                    <div
                                        className="ordered-product"
                                        key={
                                            item.product?._id ||
                                            index
                                        }
                                    >

                                        <div className="ordered-image">

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


                                        <div className="ordered-product-info">

                                            <span>
                                                Product
                                            </span>

                                            <h3>
                                                {item.productName}
                                            </h3>

                                            <p>
                                                Quantity:
                                                {" "}
                                                {item.quantity}
                                            </p>

                                        </div>


                                        <div className="ordered-price">

                                            <span>
                                                Price
                                            </span>

                                            <strong>
                                                ₹
                                                {(
                                                    item.price *
                                                    item.quantity
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                )
                            )}

                        </section>


                        {/* DELIVERY ADDRESS */}

                        <section className="success-card">

                            <div className="card-heading">

                                <div className="heading-icon">
                                    <FaMapMarkerAlt />
                                </div>

                                <div>

                                    <h2>
                                        Delivery Address
                                    </h2>

                                    <p>
                                        Your order will be delivered here
                                    </p>

                                </div>

                            </div>


                            <div className="address-box">

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

                                    {", "}

                                    {
                                        order.shippingAddress
                                            ?.state
                                    }

                                    {" - "}

                                    {
                                        order.shippingAddress
                                            ?.pincode
                                    }

                                </p>

                                <p>

                                    Mobile:
                                    {" "}
                                    {
                                        order.shippingAddress
                                            ?.mobile
                                    }

                                </p>

                            </div>

                        </section>


                        {/* DELIVERY STATUS */}

                        <section className="success-card">

                            <div className="card-heading">

                                <div className="heading-icon">
                                    <FaTruck />
                                </div>

                                <div>

                                    <h2>
                                        Order Status
                                    </h2>

                                    <p>
                                        Track your order
                                    </p>

                                </div>

                            </div>


                            <div className="status-track">

                                {statusSteps.map((step, index) => {

                                    const completed =
                                        index <= currentStatusIndex;

                                    const isCurrent =
                                        index === currentStatusIndex;

                                    const statusDate =
                                        getStatusDate(step.key);

                                    return (
                                        <React.Fragment key={step.key}>

                                            <div
                                                className={`status-step ${completed
                                                        ? "active"
                                                        : ""
                                                    } ${isCurrent
                                                        ? "current"
                                                        : ""
                                                    }`}
                                            >

                                                <div className="status-icon">

                                                    {completed ? (
                                                        <FaCheck />
                                                    ) : (
                                                        step.icon
                                                    )}

                                                </div>

                                                <div className="status-info">

                                                    <span>
                                                        {step.label}
                                                    </span>

                                                    {statusDate ? (
                                                        <small>
                                                            {statusDate}
                                                        </small>
                                                    ) : (
                                                        <small className="status-waiting">
                                                            Waiting
                                                        </small>
                                                    )}

                                                </div>

                                            </div>


                                            {index <
                                                statusSteps.length - 1 && (

                                                    <div className="status-line">

                                                        <div
                                                            className={
                                                                index <
                                                                    currentStatusIndex
                                                                    ? "status-line-fill"
                                                                    : ""
                                                            }
                                                        />

                                                    </div>

                                                )}

                                        </React.Fragment>
                                    );

                                })}

                            </div>

                        </section>

                    </div>


                    {/* ==============================
                        RIGHT SIDE
                    ============================== */}

                    <aside className="success-right">


                        {/* PRICE SUMMARY */}

                        <section className="summary-card">

                            <div className="summary-heading">

                                <FaReceipt />

                                <h2>
                                    Order Summary
                                </h2>

                            </div>


                            <div className="summary-row">

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹
                                    {order.subtotal?.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>


                            <div className="summary-row">

                                <span>
                                    Delivery
                                </span>

                                <strong className="free-text">
                                    {order.deliveryCharge === 0
                                        ? "FREE"
                                        : `₹${order.deliveryCharge}`}
                                </strong>

                            </div>


                            <div className="summary-divider"></div>


                            <div className="summary-total">

                                <span>
                                    Total Amount
                                </span>

                                <strong>
                                    ₹
                                    {order.totalAmount?.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>


                            <div className="payment-success">

                                <FaCreditCard />

                                <div>
                                    <strong>
                                        {order.paymentMethod === "cod"
                                            ? "Cash on Delivery"
                                            : "Payment Successful"}
                                    </strong>

                                    <span>
                                        {order.paymentMethod === "cod"
                                            ? "Pay when your order is delivered"
                                            : "Razorpay"}
                                    </span>
                                </div>

                            </div>
                        </section>


                        {/* PAYMENT DETAILS */}

                        <section className="summary-card">

                            <h3>
                                Payment Details
                            </h3>

                            <div className="detail-row">

                                <span>
                                    Method
                                </span>

                                <strong>
                                    {order.paymentMethod === "cod"
                                        ? "Cash on Delivery"
                                        : "Razorpay"}
                                </strong>

                            </div>

                            <div className="detail-row">

                                <span>
                                    Payment ID
                                </span>


                                <strong className="payment-id">
                                    {order.paymentMethod === "cod"
                                        ? order.paymentStatus === "paid"
                                            ? order.codPaymentId || "Payment ID unavailable"
                                            : "Payment Pending"
                                        : order.razorpayPaymentId || "Payment ID unavailable"}
                                </strong>

                            </div>

                        </section>


                        {/* BUTTONS */}

                        <button
                            className="primary-action"
                            onClick={() =>
                                router.push("/")
                            }
                        >

                            <FaShoppingBag />

                            Continue Shopping

                        </button>


                        {/* RETURN / REPLACE BUTTON */}
                        {order?.orderStatus?.toLowerCase() === "delivered" && (
                            <button
                                type="button"
                                className="secondary-action"
                                onClick={() =>
                                    router.push(`/return-request/${order._id}`)
                                }
                            >
                                Return / Replace Item
                            </button>
                        )}

                        <button
                            className="secondary-action"
                            onClick={() =>
                                router.push(
                                    "/orders"
                                )
                            }
                        >

                            View My Orders

                        </button>


                    </aside>

                </div>

            </div>

        </main>
    );
};

export default OrderSuccessPage;
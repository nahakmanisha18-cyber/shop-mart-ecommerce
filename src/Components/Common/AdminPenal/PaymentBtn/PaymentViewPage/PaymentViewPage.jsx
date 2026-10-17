"use client";


import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentDetails } from "@/redux/action/paymentAction";
import {
    FaArrowLeft,
    FaCreditCard,
    FaUser,
    FaShoppingBag,
    FaMoneyBillWave,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaReceipt,
    FaCalendarAlt,
    FaHashtag,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
} from "react-icons/fa";

import "./PaymentViewPage.css";
import Loading from "@/Components/Common/Loding/Loading";
const PaymentViewPage = ({ paymentId }) => {
    const dispatch = useDispatch();

    const {
        paymentDetails,
        isLoading,
        isError,
    } = useSelector((state) => state.paymentStore);

    useEffect(() => {
        if (paymentId) {
            dispatch(getPaymentDetails(paymentId));
        }
    }, [dispatch, paymentId]);

    const getStatusIcon = () => {
        if (status === "paid" || status === "completed") {
            return <FaCheckCircle />;
        }

        if (status === "pending") {
            return <FaClock />;
        }

        if (status === "failed") {
            return <FaTimesCircle />;
        }

        return <FaReceipt />;
    };

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return (
            <div className="payment-view-page">
                Error: {String(isError)}
            </div>
        );
    }

    if (!paymentDetails) {
        return (
            <div className="payment-view-page">
                Payment details not found.
            </div>
        );
    }

    const paymentData = paymentDetails;

    console.log("PAYMENT DETAILS:", paymentData);

    const isCOD = paymentData.method?.toLowerCase() === "cod";

    const isCODPaid =
        paymentData.orderStatus?.toLowerCase() === "delivered" &&
        paymentData.status?.toLowerCase() === "paid";

    const displayPaymentId = isCOD
        ? isCODPaid
            ? paymentData.codPaymentId || "N/A"
            : "N/A"
        : paymentData.paymentId || paymentData.razorpayPaymentId || "N/A";

    const displayTransactionId = isCOD
        ? isCODPaid
            ? paymentData.codPaymentId || "N/A"
            : "N/A"
        : paymentData.transactionId || paymentData.razorpayPaymentId || "N/A";
        
    return (

        <div className="payment-view-page">
            <div className="payment-view-header">
                <div>
                    <Link
                        href="/admin/payments"
                        className="payment-back-btn"
                    >
                        <FaArrowLeft />
                        Back to Payments

                    </Link>

                    <h1>
                        Payment Details
                    </h1>
                    <p>
                        View complete payment transaction information
                    </p>
                </div>

                <div className={`payment-view-status ${status}`}>
                    {getStatusIcon()}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>

            </div>



            {/* =========================================
                PAYMENT SUMMARY
            ========================================= */}

            <div className="payment-summary-card">


                <div className="payment-summary-left">

                    <div className="payment-summary-icon">

                        <FaMoneyBillWave />

                    </div>


                    <div>

                        <span>
                            Payment Amount
                        </span>

                        <h2>
                            ₹{Number(paymentData.amount || 0).toLocaleString("en-IN")}
                        </h2>

                        <p>
                            {paymentData.description}
                        </p>

                    </div>

                </div>


                <div className="payment-summary-right">
                    <div>
                        <span>Payment ID</span>
                        <strong>{displayPaymentId}</strong>
                    </div>

                    <div>
                        <span>Transaction ID</span>
                        <strong>{displayTransactionId}</strong>
                    </div>
                </div>

            </div>



            {/* =========================================
                MAIN GRID
            ========================================= */}

            <div className="payment-view-grid">


                {/* =========================================
                    PAYMENT INFORMATION
                ========================================= */}

                <div className="payment-view-card">

                    <div className="payment-card-title">

                        <div className="payment-card-title-icon">

                            <FaCreditCard />

                        </div>

                        <div>

                            <h3>
                                Payment Information
                            </h3>

                            <p>
                                Transaction details
                            </p>

                        </div>

                    </div>


                    <div className="payment-info-list">


                        <div className="payment-info-row">
                            <div>
                                <FaHashtag />
                                <span>Payment ID</span>
                            </div>

                            <strong>{displayPaymentId}</strong>
                        </div>

                        <div className="payment-info-row">
                            <div>
                                <FaReceipt />
                                <span>Transaction ID</span>
                            </div>

                            <strong>{displayTransactionId}</strong>
                        </div>


                        <div className="payment-info-row">

                            <div>

                                <FaShoppingBag />

                                <span>
                                    Order ID
                                </span>

                            </div>

                            <Link
                                href={`/admin/orders/${paymentData.orderId}`}
                                className="payment-order-link"
                            >
                                #{paymentData.orderId}
                            </Link>

                        </div>


                        <div className="payment-info-row">

                            <div>

                                <FaCalendarAlt />

                                <span>
                                    Payment Date
                                </span>

                            </div>

                            <strong>
                                {paymentData.date
                                    ? new Date(paymentData.date).toLocaleString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : "N/A"}
                            </strong>

                        </div>


                        <div className="payment-info-row">

                            <div>

                                <FaCreditCard />

                                <span>
                                    Payment Method
                                </span>

                            </div>

                            <strong>
                                {paymentData.method}
                            </strong>

                        </div>


                        <div className="payment-info-row">

                            <div>

                                <FaMoneyBillWave />

                                <span>
                                    Gateway
                                </span>

                            </div>

                            <strong>
                                {paymentData.gateway}
                            </strong>

                        </div>


                        <div className="payment-info-row">

                            <div>

                                <FaMoneyBillWave />

                                <span>
                                    Currency
                                </span>

                            </div>

                            <strong>
                                {paymentData.currency}
                            </strong>

                        </div>


                    </div>

                </div>



                {/* =========================================
                    CUSTOMER INFORMATION
                ========================================= */}

                <div className="payment-view-card">

                    <div className="payment-card-title">

                        <div className="payment-card-title-icon">

                            <FaUser />

                        </div>

                        <div>

                            <h3>
                                Customer Information
                            </h3>

                            <p>
                                Customer details
                            </p>

                        </div>

                    </div>


                    <div className="customer-profile">


                        <div className="customer-large-avatar">
                            {paymentData.customer?.profileImage ? (
                                <img
                                    src={paymentData.customer.profileImage}
                                    alt={paymentData.customer?.name || "Customer"}
                                    className="customer-large-avatar-img"
                                />
                            ) : (
                                <div className="customer-avatar customer-avatar-fallback">
                                    <FaUser />
                                </div>
                            )}
                        </div>


                        <div>

                            <h3>
                                {paymentData.customer.name}
                            </h3>

                            <span>
                                Customer
                            </span>

                        </div>

                    </div>


                    <div className="customer-info-list">


                        <div className="customer-info-item">

                            <FaEnvelope />

                            <div>

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {paymentData.customer.email}
                                </strong>

                            </div>

                        </div>


                        <div className="customer-info-item">

                            <i className="fa-solid fa-phone"></i>

                            <div>

                                <span>
                                    Phone
                                </span>

                                <strong>
                                    {paymentData.customer.phone}
                                </strong>

                            </div>

                        </div>


                        <div className="customer-info-item">

                            <FaMapMarkerAlt />

                            <div>

                                <span>
                                    Address
                                </span>

                                <strong>
                                    {paymentData.customer.address}
                                </strong>

                            </div>

                        </div>


                    </div>

                </div>

            </div>



            {/* =========================================
                PAYMENT STATUS TIMELINE
            ========================================= */}

            {/* <div className="payment-view-card payment-timeline-card">

                <div className="payment-card-title">

                    <div className="payment-card-title-icon">

                        <FaReceipt />

                    </div>

                    <div>

                        <h3>
                            Payment Timeline
                        </h3>

                        <p>
                            Payment transaction history
                        </p>

                    </div>

                </div>


                <div className="payment-timeline">


                    <div className="timeline-item completed">

                        <div className="timeline-icon">

                            <FaCheckCircle />

                        </div>

                        <div>

                            <strong>
                                Payment Initiated
                            </strong>

                            <span>
                                Customer started the payment process
                            </span>

                        </div>

                    </div>


                    <div className="timeline-line"></div>


                    <div className="timeline-item completed">

                        <div className="timeline-icon">

                            <FaCreditCard />

                        </div>

                        <div>

                            <strong>
                                Payment Processing
                            </strong>

                            <span>
                                Payment is being processed by {paymentData.gateway}
                            </span>

                        </div>

                    </div>


                    <div className="timeline-line"></div>


                    <div className="timeline-item completed">

                        <div className="timeline-icon">

                            <FaCheckCircle />

                        </div>

                        <div>

                            <strong>
                                Payment Successful
                            </strong>

                            <span>
                                Payment successfully received
                            </span>

                        </div>

                    </div>


                </div>

            </div>*/}


            {/* PAYMENT STATUS TIMELINE */}

            <div className="payment-view-card payment-timeline-card">
                <div className="payment-card-title">
                    <div className="payment-card-title-icon">
                        <FaReceipt />
                    </div>

                    <div>
                        <h3>Payment Timeline</h3>
                        <p>Payment transaction history</p>
                    </div>
                </div>

                <div className="payment-timeline">
                    {paymentData.paymentTimeline?.length > 0 ? (
                        [...paymentData.paymentTimeline]
                            .sort(
                                (a, b) =>
                                    new Date(a.timestamp) - new Date(b.timestamp)
                            )
                            .map((item, index) => {
                                const timelineStatus =
                                    (item.status || "pending").toLowerCase();

                                const TimelineIcon =
                                    timelineStatus === "paid"
                                        ? FaCheckCircle
                                        : timelineStatus === "failed"
                                            ? FaTimesCircle
                                            : timelineStatus === "refunded"
                                                ? FaMoneyBillWave
                                                : timelineStatus === "processing"
                                                    ? FaCreditCard
                                                    : FaClock;

                                return (
                                    <React.Fragment key={`${item._id || item.timestamp}-${index}`}>
                                        {index > 0 && (
                                            <div className="timeline-line" />
                                        )}

                                        <div
                                            className={`timeline-item ${timelineStatus}`}
                                        >
                                            <div className="timeline-icon">
                                                <TimelineIcon />
                                            </div>

                                            <div>
                                                <strong>
                                                    {item.status
                                                        ? item.status.charAt(0).toUpperCase() +
                                                        item.status.slice(1)
                                                        : "Payment update"}
                                                </strong>

                                                <span>
                                                    {item.message || "Payment status updated"}
                                                </span>

                                                <span>
                                                    {item.timestamp
                                                        ? new Date(item.timestamp).toLocaleString(
                                                            "en-IN",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )
                                                        : "Date unavailable"}
                                                </span>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })
                    ) : (
                        <p className="payment-timeline-empty">
                            No payment history available yet.
                        </p>
                    )}
                </div>
            </div>
            {/* =========================================
                ACTIONS
            ========================================= */}

            <div className="payment-view-actions">

                <Link
                    href="/admin/payments"
                    className="payment-view-cancel-btn"
                >

                    <FaArrowLeft />

                    Back to Payments

                </Link>


                <Link
                    href={`/admin/orders/${paymentData.orderId}`}
                    className="payment-view-order-btn"
                >

                    <FaShoppingBag />

                    View Order

                </Link>

            </div>


        </div>

    );

};


export default PaymentViewPage;



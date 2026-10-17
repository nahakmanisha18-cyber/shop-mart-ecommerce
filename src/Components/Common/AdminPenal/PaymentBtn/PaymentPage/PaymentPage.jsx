"use client";


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPayments } from "@/redux/action/paymentAction";

import Link from "next/link";

import {
    FaSearch,
    FaDownload,
    FaEye,
    FaCreditCard,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaMoneyBillWave,
    FaFilter,
    FaUser,
} from "react-icons/fa";

import "./PaymentPage.css";
import Loading from "@/Components/Common/Loding/Loading";

const PaymentPage = () => {

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [method, setMethod] = useState("All");
    const dispatch = useDispatch();

    const {
        payments = [],
        isLoading = false,
        isError = null,
    } = useSelector((state) => state.paymentStore || {});

    useEffect(() => {
        dispatch(getPayments());
    }, [dispatch]);

    useEffect(() => {
        console.log("PAYMENT DATA:", payments);
    }, [payments]);

    const getDisplayId = (value, prefix, fallbackId) => {
        const source = String(value || fallbackId || "")
            .replace(/[^a-zA-Z0-9]/g, "")
            .toUpperCase();

        const shortId = source.slice(-8).padStart(8, "0");

        return `${prefix}-${shortId}`;
    };


    // Filter Payments

    const filteredPayments = payments.filter((payment) => {
        const searchValue = search.toLowerCase().trim();

        const searchMatch = [
            payment.paymentId,
            payment.razorpayOrderId,
            payment.orderId,
            payment.customer,
            payment.email,
        ].some((value) =>
            String(value || "").toLowerCase().includes(searchValue)
        );

        const paymentStatus = String(payment.status || "pending").toLowerCase();
        const paymentMethod = String(payment.method || "").toLowerCase();

        const statusMatch =
            status === "All" ||
            paymentStatus === status.toLowerCase();

        const methodMatch =
            method === "All" ||
            paymentMethod === method.toLowerCase();

        return searchMatch && statusMatch && methodMatch;
    });


    const totalRevenue = payments
        .filter((payment) => String(payment.status).toLowerCase() === "paid")
        .reduce((total, payment) => total + Number(payment.amount || 0), 0);

    const successfulPayments = payments.filter(
        (payment) => String(payment.status).toLowerCase() === "paid"
    ).length;

    const pendingPayments = payments
        .filter((payment) => String(payment.status).toLowerCase() === "pending")
        .reduce((total, payment) => total + Number(payment.amount || 0), 0);

    const failedPayments = payments
        .filter((payment) => String(payment.status).toLowerCase() === "failed")
        .reduce((total, payment) => total + Number(payment.amount || 0), 0);

    if (isLoading) {
        return <Loading />;
    }

    return (

        <div className="payments-page">

            {/* ================= HEADER ================= */}

            <div className="payments-heading">

                <div>

                    <h1>
                        Payments
                    </h1>

                    <p>
                        Manage and track all payment transactions
                    </p>

                </div>


                <button className="payment-export-btn">

                    <FaDownload />

                    Export Report

                </button>

            </div>


            {/* ================= STATS ================= */}

            <div className="payment-stats">


                {/* Total Revenue */}

                <div className="payment-stat-card">

                    <div className="payment-stat-icon blue">

                        <FaMoneyBillWave />

                    </div>

                    <div>

                        <span>
                            Total Revenue
                        </span>

                        <h2>
                            ₹{totalRevenue.toLocaleString("en-IN")}
                        </h2>

                    </div>

                </div>


                {/* Successful */}

                <div className="payment-stat-card">

                    <div className="payment-stat-icon green">

                        <FaCheckCircle />

                    </div>

                    <div>

                        <span>
                            Successful Payments
                        </span>

                        <h2>
                            {successfulPayments}
                        </h2>

                    </div>

                </div>


                {/* Pending */}

                <div className="payment-stat-card">

                    <div className="payment-stat-icon orange">

                        <FaClock />

                    </div>

                    <div>

                        <span>
                            Pending Payments
                        </span>

                        <h2>
                            ₹{pendingPayments.toLocaleString("en-IN")}
                        </h2>

                    </div>

                </div>


                {/* Failed */}

                <div className="payment-stat-card">

                    <div className="payment-stat-icon red">

                        <FaTimesCircle />

                    </div>

                    <div>

                        <span>
                            Failed Payments
                        </span>

                        <h2>
                            ₹{failedPayments.toLocaleString("en-IN")}
                        </h2>

                    </div>

                </div>

            </div>


            {/* ================= PAYMENT CARD ================= */}

            <div className="payments-card">


                {/* FILTER HEADER */}

                <div className="payment-filters">


                    {/* Search */}

                    <div className="payment-search">

                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search payment, order or customer..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    {/* Status */}

                    <select
                        className="payment-filter-select"
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >

                        <option value="All">
                            All Status
                        </option>

                        <option value="Paid">
                            Paid
                        </option>

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Failed">
                            Failed
                        </option>

                        <option value="Refunded">
                            Refunded
                        </option>

                    </select>


                    {/* Method */}

                    <select
                        className="payment-filter-select"
                        value={method}
                        onChange={(e) =>
                            setMethod(e.target.value)
                        }
                    >

                        <option value="All">
                            All Methods
                        </option>

                        <option value="Razorpay">
                            Razorpay
                        </option>

                        <option value="Card">
                            Card
                        </option>

                        <option value="COD">
                            COD
                        </option>

                        <option value="Net Banking">
                            Net Banking
                        </option>

                        <option value="Wallet">
                            Wallet
                        </option>

                    </select>

                </div>


                {/* ================= TABLE ================= */}

                <div className="payment-table-container">

                    <table className="payments-table">

                        <thead>

                            <tr>
                                <th>Payment ID</th>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>

                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="no-payments">
                                        Loading payments...
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan="8" className="no-payments">
                                        {isError}
                                    </td>
                                </tr>
                            ) : filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => {
                                    const paymentStatus = String(
                                        payment.status || "pending"
                                    ).toLowerCase();

                                    return (
                                        <tr key={payment._id}>


                                            <td>
                                                <strong className="payment-id">
                                                    {payment.method?.toLowerCase() === "cod"
                                                        ? payment.codPaymentId || "N/A"
                                                        : getDisplayId(
                                                            payment.paymentId,
                                                            "PAY",
                                                            payment._id
                                                        )}
                                                </strong>

                                            </td>

                                            {/* Order ID */}
                                            <td>
                                                <span className="order-id">
                                                    {getDisplayId(
                                                        payment.orderId,
                                                        "ORD",
                                                        payment._id
                                                    )}
                                                </span>
                                            </td>

                                            {/* Customer */}
                                            <td>

                                                <div className="payment-customer">
                                                    {payment.profileImage ? (
                                                        <img
                                                            src={payment.profileImage}
                                                            alt={payment.customer || "Customer"}
                                                            className="customer-avatar-img"
                                                            onError={(e) => {
                                                                console.error(
                                                                    "Profile image failed to load:",
                                                                    payment.profileImage
                                                                );
                                                                e.currentTarget.style.display = "none";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="customer-avatar customer-avatar-fallback">
                                                            <FaUser />
                                                        </div>
                                                    )}

                                                    <div>
                                                        <strong>
                                                            {payment.customer || "Unknown Customer"}
                                                        </strong>

                                                        <span>
                                                            {payment.email || "N/A"}
                                                        </span>
                                                    </div>
                                                </div>

                                            </td>

                                            {/* Date */}
                                            <td>
                                                <span className="payment-date">
                                                    {payment.date
                                                        ? new Date(payment.date).toLocaleDateString("en-IN")
                                                        : "N/A"}
                                                </span>
                                            </td>

                                            {/* Amount */}
                                            <td>
                                                <strong className="payment-amount">
                                                    ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
                                                </strong>
                                            </td>

                                            {/* Method */}
                                            <td>
                                                <span className="payment-method">
                                                    <FaCreditCard />
                                                    {payment.method || "N/A"}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td>
                                                <span className={`payment-status ${paymentStatus}`}>
                                                    {paymentStatus === "paid" && <FaCheckCircle />}
                                                    {paymentStatus === "pending" && <FaClock />}
                                                    {paymentStatus === "failed" && <FaTimesCircle />}
                                                    {paymentStatus === "refunded" && <FaMoneyBillWave />}

                                                    {paymentStatus.charAt(0).toUpperCase() +
                                                        paymentStatus.slice(1)}
                                                </span>
                                            </td>

                                            {/* Action */}
                                            <td>
                                                <div className="payment-actions">
                                                    <Link
                                                        href={`/admin/payments/${payment._id}`}
                                                        className="payment-action-btn view"
                                                        title="View Payment"
                                                    >
                                                        <FaEye />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" className="no-payments">
                                        No payments found
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>

                </div>

            </div >

        </div >

    );

};

export default PaymentPage;
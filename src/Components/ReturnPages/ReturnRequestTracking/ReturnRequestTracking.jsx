
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getReturnRequest } from "@/redux/action/returnAction";
import {
    FaArrowLeft,
    FaBoxOpen,
    FaCalendarAlt,
    FaCheck,
    FaClock,
    FaUndoAlt,
    FaTimesCircle,
    FaTruck,
    FaMoneyBillWave,
} from "react-icons/fa";

import "./ReturnRequestTracking.css";
import Loading from "@/Components/Common/Loding/Loading";

const money = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const date = (value) => {
    if (!value) return "Date not available";

    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime())
        ? "Date not available"
        : parsed.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
};

const statusLabel = (status = "pending") => {
    const value = String(status).toLowerCase().trim();

    const labels = {
        pending: "Pending Review",
        approved: "Return Approved",
        received: "Item Received",
        completed: "Return Completed",
        rejected: "Rejected",
        cancelled: "Cancelled",
        processing: "Refund Processing",
        processed: "Refund Completed",
        failed: "Refund Failed",
    };

    return labels[value] || value;
};


const steps = [
    {
        key: "submitted",
        label: "Request Submitted",
        description: "Your return request has been received.",
        icon: FaUndoAlt,
    },
    {
        key: "approved",
        label: "Return Approved",
        description: "The store has approved your return request.",
        icon: FaCheck,
    },
    {
        key: "received",
        label: "Item Received",
        description: "The returned item has been received by the store.",
        icon: FaBoxOpen,
    },
    {
        key: "refund-pending",
        label: "Refund Pending",
        description: "Your return is complete. Your refund is waiting to be processed.",
        icon: FaClock,
    },
    {
        key: "refund-processing",
        label: "Refund Processing",
        description: "Your refund request is being processed by the payment provider.",
        icon: FaMoneyBillWave,
    },
    {
        key: "refund-processed",
        label: "Refund Completed",
        description: "Your refund has been successfully confirmed.",
        icon: FaCheck,
    },
];



const getStage = (returnStatus, refundStatus) => {
    const status = String(returnStatus || "pending")
        .toLowerCase()
        .trim();

    const refund = String(refundStatus || "")
        .toLowerCase()
        .trim();

    if (["rejected", "cancelled"].includes(status)) {
        return -1;
    }

    if (refund === "processed") return 5;
    if (refund === "processing") return 4;
    if (refund === "failed") return 4;

    if (status === "completed") return 3;
    if (status === "received") return 2;
    if (status === "approved") return 1;

    return 0;
};


export default function ReturnRequestTracking({ returnId }) {
    const dispatch = useDispatch();

    const {
        selectedReturnRequest,
        isLoading,
        isError,
        errorMessage,
    } = useSelector((state) => state.returnStore);

    useEffect(() => {
        if (returnId) {
            dispatch(getReturnRequest(returnId));
        }
    }, [dispatch, returnId]);

    if (isLoading) return <Loading />;

    if (isError) {
        return (
            <main className="urt-page">
                <div className="urt-message-card">
                    <FaTimesCircle />
                    <h2>Unable to load return request</h2>
                    <p>{errorMessage || "Please try again later."}</p>
                    <Link href="/return-request/all-return-request/">Back to My Returns</Link>
                </div>
            </main>
        );
    }

    if (!selectedReturnRequest) {
        return (
            <main className="urt-page">
                <div className="urt-message-card">
                    <FaBoxOpen />
                    <h2>Return request not found</h2>
                    <p>We could not find the requested return details.</p>
                    <Link href="/return-request/all-return-request">Back to My Returns</Link>
                </div>
            </main>
        );
    }


    const request = selectedReturnRequest;

    const status = String(request.status || "pending")
        .toLowerCase()
        .trim();

    const refund = request.refund || null;

    const refundStatus = String(
        refund?.status || request.refundStatus || ""
    )
        .toLowerCase()
        .trim();

  
    const stage = getStage(status, refundStatus);
    console.log("RETURN TRACKING DATA:", request);
    console.log("REFUND OBJECT:", request.refund);
    console.log("REFUND STATUS:", refundStatus);
    console.log("CURRENT TRACKING STAGE:", stage);
    
    const items = Array.isArray(request.items) ? request.items : [];

    const order =
        request.orderId && typeof request.orderId === "object"
            ? request.orderId
            : {};

    const orderId =
        order._id ||
        (typeof request.orderId === "string" ? request.orderId : "");

    const calculatedRefund = items.reduce(
        (sum, item) =>
            sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
    );

    const refundAmount = request.totalRefundAmount ??
        request.refundAmount ??
        calculatedRefund;

    const adminMessage =
        request.adminNotes ||
        request.adminNote ||
        request.adminRemarks ||
        request.rejectionReason ||
        "";

    return (
        <main className="urt-page">
            <div className="urt-container">
                <Link href="/return-request/all-return-request" className="urt-back-link">
                    <FaArrowLeft /> Back to My Returns
                </Link>

                <header className="urt-header">
                    <div className="urt-heading-icon">
                        <FaUndoAlt />
                    </div>

                    <div className="urt-heading-copy">
                        <span className="urt-eyebrow">MY RETURNS</span>
                        <h1>Return Request Details</h1>
                        <p>View your returned items and track your request.</p>
                        <span className="urt-request-id">
                            Request ID: #{String(request._id).slice(-8).toUpperCase()}
                        </span>
                    </div>

                    <span className={`urt-status urt-status-${status.replace(/\s+/g, "-")}`}>
                        {statusLabel(status)}
                    </span>
                </header>

                <section className="urt-summary-grid">
                    <article className="urt-summary-card">
                        <FaCalendarAlt />
                        <div>
                            <span>Request date</span>
                            <strong>{date(request.requestedAt || request.createdAt)}</strong>
                        </div>
                    </article>

                    <article className="urt-summary-card">
                        <FaBoxOpen />
                        <div>
                            <span>Returned quantity</span>
                            <strong>
                                {items.reduce(
                                    (sum, item) => sum + Number(item.quantity || 0),
                                    0
                                )} item(s)
                            </strong>
                        </div>
                    </article>

                    <article className="urt-summary-card">
                        <FaMoneyBillWave />
                        <div>
                            <span>Estimated refund</span>
                            <strong>{money(refundAmount)}</strong>
                        </div>
                    </article>
                </section>

                <div className="urt-layout">
                    <div className="urt-main">
                        <section className="urt-card">
                            <div className="urt-section-heading">
                                <div>
                                    <h2>Returned products</h2>
                                    <p>Products included in this request</p>
                                </div>
                                <span>{items.length} product(s)</span>
                            </div>

                            {items.length ? (
                                <div className="urt-items">
                                    {items.map((item, index) => {
                                        const product =
                                            item.productId &&
                                                typeof item.productId === "object"
                                                ? item.productId
                                                : {};

                                        const image =
                                            product.image ||
                                            product.imageUrl ||
                                            product.thumbnail ||
                                            product.images?.[0];

                                        const imageUrl =
                                            typeof image === "string"
                                                ? image
                                                : image?.url || image?.secure_url || "";

                                        const name =
                                            item.productName ||
                                            product.productName ||
                                            product.name ||
                                            product.title ||
                                            "Product";

                                        const quantity = Number(item.quantity || 0);
                                        const price = Number(item.price || product.price || 0);

                                        return (
                                            <article
                                                className="urt-product"
                                                key={item._id || product._id || index}
                                            >
                                                <div className="urt-product-image">
                                                    {imageUrl ? (
                                                        <img src={imageUrl} alt={name} />
                                                    ) : (
                                                        <FaBoxOpen />
                                                    )}
                                                </div>

                                                <div className="urt-product-copy">
                                                    <h3>{name}</h3>
                                                    <p>Quantity: {quantity}</p>
                                                    <p>Unit price: {money(price)}</p>
                                                    {item.reason && (
                                                        <p>Reason: {item.reason}</p>
                                                    )}
                                                    {item.notes && (
                                                        <p className="urt-notes">{item.notes}</p>
                                                    )}
                                                </div>

                                                <strong className="urt-product-total">
                                                    {money(price * quantity)}
                                                </strong>
                                            </article>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="urt-muted">No item details available.</p>
                            )}

                            <div className="urt-total-row">
                                <span>Total estimated refund</span>
                                <strong>{money(refundAmount)}</strong>
                            </div>
                        </section>

                        {/* REFUND DETAILS */}
                        <section className="urt-card">
                            <div className="urt-section-heading">
                                <div>
                                    <h2>Refund Details</h2>
                                    <p>Track the refund linked to your return request</p>
                                </div>
                            </div>

                            <div className="urt-refund-details">
                                <div className="urt-refund-row">
                                    <span>Refund Amount</span>
                                    <strong>
                                        {money(refund?.amount ?? refundAmount)}
                                    </strong>
                                </div>

                                <div className="urt-refund-row">
                                    <span>Refund Status</span>
                                    <strong
                                        className={`urt-refund-status urt-refund-${refundStatus || "unavailable"
                                            }`}
                                    >
                                        {refundStatus
                                            ? statusLabel(refundStatus)
                                            : "Not initiated"}
                                    </strong>
                                </div>

                                <div className="urt-refund-row">
                                    <span>Payment Method</span>
                                    <strong>
                                        {refund?.paymentMethod
                                            ? String(refund.paymentMethod).toUpperCase()
                                            : "Not available"}
                                    </strong>
                                </div>

                                <div className="urt-refund-row">
                                    <span>
                                        {refund?.paymentMethod?.toLowerCase() === "cod"
                                            ? "COD Payout Reference / UTR"
                                            : "Razorpay Refund ID"}
                                    </span>

                                    <strong className="urt-refund-reference">
                                        {refund?.paymentMethod?.toLowerCase() === "cod"
                                            ? refund?.payoutReference || "Payout reference not available yet"
                                            : refund?.razorpayRefundId || "Not available yet"}
                                    </strong>
                                </div>

                                {refund?.processedAt && (
                                    <div className="urt-refund-row">
                                        <span>Refund Completed On</span>
                                        <strong>{date(refund.processedAt)}</strong>
                                    </div>
                                )}

                                {refund?.failureReason && (
                                    <div className="urt-refund-message">
                                        <span>Refund Update</span>
                                        <p>{refund.failureReason}</p>
                                    </div>
                                )}

                                {!refund && (
                                    <p className="urt-muted">
                                        Refund details will appear here when a refund record
                                        is created for your return request.
                                    </p>
                                )}
                            </div>
                        </section>
                        
                        {status === "rejected" || status === "cancelled" ? (
                            <section className="urt-decision urt-decision-error">
                                <FaTimesCircle />
                                <div>
                                    <h2>
                                        {status === "rejected"
                                            ? "Return request rejected"
                                            : "Return request cancelled"}
                                    </h2>
                                    <p>
                                        {adminMessage ||
                                            (status === "rejected"
                                                ? "Your request was not approved."
                                                : "This return request has been cancelled.")}
                                    </p>
                                </div>
                            </section>
                        ) : (
                            <section className="urt-card">
                                <div className="urt-section-heading">
                                    <div>
                                        <h2>Return tracking</h2>
                                        <p>Track the progress of your request</p>
                                    </div>
                                </div>


                                    <div className="urt-timeline">
                                        {steps.map((step, index) => {
                                            const Icon = step.icon;
                                            const completed = index < stage;
                                            const current = index === stage;

                                            let description = step.description;

                                            if (index === 0) {
                                                description = `Submitted on ${date(
                                                    request.requestedAt || request.createdAt
                                                )}`;
                                            }

                                            if (index === 1 && request.approvedAt) {
                                                description = `Approved on ${date(request.approvedAt)}`;
                                            }

                                            if (index === 2 && request.receivedAt) {
                                                description = `Item received on ${date(request.receivedAt)}`;
                                            }

                                            if (index === 3 && status !== "completed") {
                                                description = "Refund will become available after the return is completed.";
                                            }

                                            if (index === 3 && status === "completed" && !refund) {
                                                description = "Return is complete, but refund details are not available yet.";
                                            }

                                            if (index === 3 && refundStatus === "pending") {
                                                description = "Refund record created. Waiting for processing.";
                                            }

                                            if (index === 4 && refundStatus === "failed") {
                                                description = "The refund could not be processed. Please contact support.";
                                            }

                                            if (index === 5 && refund?.processedAt) {
                                                description = `Refund completed on ${date(refund.processedAt)}`;
                                            }

                                            return (
                                                <div
                                                    key={step.key}
                                                    className={`urt-step ${completed ? "is-complete" : ""
                                                        } ${current ? "is-current" : ""}`}
                                                >
                                                    <div className="urt-step-icon">
                                                        <Icon />
                                                    </div>

                                                    <div className="urt-step-copy">
                                                        <h3>{step.label}</h3>
                                                        <p>{description}</p>

                                                        {current && (
                                                            <span className="urt-current-label">
                                                                Current stage
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                            </section>
                        )}

                        <section className="urt-card">
                            <div className="urt-section-heading">
                                <div>
                                    <h2>Return reason and notes</h2>
                                    <p>Information submitted with your request</p>
                                </div>
                            </div>

                            <div className="urt-info-block">
                                <span>Reason</span>
                                <p>{request.reason || request.returnReason || "Not provided"}</p>
                            </div>

                            <div className="urt-info-block">
                                <span>Your notes</span>
                                <p>{request.notes || request.description || "No additional notes"}</p>
                            </div>

                            {adminMessage && (
                                <div className="urt-info-block">
                                    <span>Store update</span>
                                    <p>{adminMessage}</p>
                                </div>
                            )}
                        </section>
                    </div>

                    <aside className="urt-sidebar">
                        <section className="urt-card urt-latest-card">
                            <span className="urt-eyebrow">LATEST UPDATE</span>
                            <h2>{statusLabel(status)}</h2>
                            <p>
                                {adminMessage ||
                                    (status === "pending"
                                        ? "Your request is waiting for review."
                                        : status === "approved"
                                            ? "Your return has been approved. Please follow the return instructions."
                                            : status === "refunded" || status === "completed"
                                                ? "Your refund has been completed."
                                                : "Your return request is being processed.")}
                            </p>
                        </section>

                        {status === "approved" || status === "pickup scheduled" ? (
                            <section className="urt-card urt-help-card">
                                <FaTruck />
                                <h2>Return approved</h2>
                                <p>
                                    Follow the return instructions provided by the store.
                                    Pickup details will appear here when available.
                                </p>
                            </section>
                        ) : null}

                        <section className="urt-card urt-help-card">
                            <FaClock />
                            <h2>Need help?</h2>
                            <p>Contact support if you have questions about your return.</p>
                            <Link href="/contact">Contact Support</Link>
                        </section>

                        {orderId && (
                            <section className="urt-card urt-order-card">
                                <h2>Original order</h2>
                                <span>Order ID</span>
                                <strong>#{String(orderId).slice(-8).toUpperCase()}</strong>
                                <span>Order date</span>
                                <strong>{date(order.createdAt)}</strong>
                                <span>Order status</span>
                                <strong>{order.orderStatus || "—"}</strong>
                            </section>
                        )}
                    </aside>
                </div>
            </div>
        </main>
    );
}

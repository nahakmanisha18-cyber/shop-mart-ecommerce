
"use client";

import React, { useEffect } from "react";
import {
    FaArrowLeft,
    FaBoxOpen,
    FaCalendarAlt,
    FaCheckCircle,
    FaClock,
    FaEnvelope,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaPhone,
    FaReceipt,
    FaUser,
} from "react-icons/fa";
import "./AdminReturnRequestDetail.css";

import { useDispatch, useSelector } from "react-redux";

import { getReturnRequest } from "@/redux/action/returnAction";
import Loading from "@/Components/Common/Loding/Loading";


const formatMoney = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getStatusLabel = (status = "pending") => {
    const labels = {
        pending: "Pending Review",
        approved: "Approved",
        rejected: "Rejected",
        received: "Return Received",
        completed: "Completed",
        cancelled: "Cancelled",
    };

    return labels[status.toLowerCase()] || status;
};

const AdminReturnRequestDetail = ({ returnId }) => {
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

    const request = selectedReturnRequest;

    if (isLoading) {
        return <Loading/>;
    }

    if (isError) {
        return (
            <main className="return-detail-page">
                <div className="return-detail-card">
                    <h2>Unable to load return request</h2>
                    <p>{errorMessage}</p>
                </div>
            </main>
        );
    }

    if (!request) {
        return (
            <main className="return-detail-page">
                <div className="return-detail-card">
                    <p>Return request not found.</p>
                </div>
            </main>
        );
    }

// Iske baad aapka existing customer, order,
// items, refundAmount aur return JSX rakhein.
    // Actual request nahi milne par abhi sample data dikhayega.

    const customer =
        request.userId && typeof request.userId === "object"
            ? request.userId
            : {};

    const order =
        request.orderId && typeof request.orderId === "object"
            ? request.orderId
            : {};

    const items = Array.isArray(request.items) ? request.items : [];

    const requestId = request._id || request.id || "—";
    const status = String(request.status || "pending").toLowerCase();

    const orderId =
        typeof request.orderId === "object"
            ? request.orderId?._id
            : request.orderId;

    const calculatedRefund = items.reduce(
        (total, item) =>
            total + Number(item.price || 0) * Number(item.quantity || 0),
        0
    );

    const refundAmount =
        request.totalRefundAmount ?? calculatedRefund;

    const itemCount = items.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    return (
        <main className="return-detail-page">
            {/* Page Header */}
            <header className="return-detail-header">
                <div className="return-detail-heading">
                    <button
                        type="button"
                        className="return-back-btn"
                        onClick={() => window.history.back()}
                        aria-label="Go back"
                    >
                        <FaArrowLeft />
                    </button>

                    <div>
                        <div className="return-breadcrumb">
                            Admin Panel <span>/</span> Returns <span>/</span> Details
                        </div>

                        <h1>Return Request Details</h1>

                        <p>Review the customer&apos;s return request and order information.</p>
                    </div>
                </div>

                <span className={`return-detail-status status-${status}`}>
                    <FaClock />
                    {getStatusLabel(status)}
                </span>
            </header>

            {/* Request Summary */}
            <section className="return-overview-grid">
                <article className="return-overview-card">
                    <div className="return-overview-icon purple">
                        <FaReceipt />
                    </div>
                    <div>
                        <span>Return Request ID</span>
                        <strong>{String(requestId).startsWith("RET-")
                            ? requestId
                            : `#${String(requestId).slice(-8).toUpperCase()}`}
                        </strong>
                    </div>
                </article>

                <article className="return-overview-card">
                    <div className="return-overview-icon blue">
                        <FaCalendarAlt />
                    </div>
                    <div>
                        <span>Request Date</span>
                        <strong>{formatDate(request.requestedAt || request.createdAt)}</strong>
                    </div>
                </article>

                <article className="return-overview-card">
                    <div className="return-overview-icon orange">
                        <FaBoxOpen />
                    </div>
                    <div>
                        <span>Return Type</span>
                        <strong>
                            {request.returnType === "partial" ? "Partial Return" : "Full Return"}
                        </strong>
                    </div>
                </article>

                <article className="return-overview-card">
                    <div className="return-overview-icon green">
                        <FaMoneyBillWave />
                    </div>
                    <div>
                        <span>Refund Amount</span>
                        <strong>{formatMoney(refundAmount)}</strong>
                    </div>
                </article>
            </section>

            <div className="return-detail-columns">
                <div className="return-detail-main">
                    {/* Returned Products */}
                    <section className="return-detail-card">
                        <div className="return-section-heading">
                            <div>
                                <h2>Returned Items</h2>
                                <p>{itemCount} item(s) in this return request</p>
                            </div>

                            <span className="return-item-count">{items.length} product(s)</span>
                        </div>

                        {items.length > 0 ? (
                            <div className="return-items-list">
                                {items.map((item, index) => {
                                    const quantity = Number(item.quantity || 0);
                                    const price = Number(item.price || 0);


                                    const productImage =
                                        (typeof item.productId === "object"
                                            ? (
                                                item.productId?.image ||
                                                item.productId?.imageUrl ||
                                                item.productId?.productImage ||
                                                (Array.isArray(item.productId?.images)
                                                    ? (
                                                        typeof item.productId.images[0] === "string"
                                                            ? item.productId.images[0]
                                                            : item.productId.images[0]?.url
                                                    )
                                                    : "")
                                            )
                                            : "") ||
                                        item.productImage ||
                                        item.image ||
                                        "";


                                    return (
                                        <article
                                            className="return-product-row"
                                            key={item._id || item.productId?._id || item.productId || index}
                                        >

                                            <div className="return-product-image">
                                                {productImage ? (
                                                    <>
                                                        <img
                                                            src={productImage}
                                                            alt={
                                                                item.productName ||
                                                                item.productId?.name ||
                                                                "Returned product"
                                                            }
                                                            onError={(event) => {
                                                                event.currentTarget.style.display = "none";
                                                                const fallback = event.currentTarget.nextElementSibling;
                                                                if (fallback) {
                                                                    fallback.style.display = "flex";
                                                                }
                                                            }}
                                                        />
                                                        <span
                                                            className="return-product-image-fallback"
                                                            style={{ display: "none" }}
                                                        >
                                                            <FaBoxOpen />
                                                        </span>
                                                    </>
                                                ) : (
                                                    <FaBoxOpen />
                                                )}
                                            </div>


                                            <div className="return-product-info">
                                                <h3>
                                                    {item.productName ||
                                                        item.productId?.name ||
                                                        "Product name unavailable"}
                                                </h3>

                                                <p>
                                                    Product ID:{" "}
                                                    {item.productId?._id ||
                                                        item.productId ||
                                                        "—"}
                                                </p>

                                                <div className="return-product-meta">
                                                    <span>Qty: {quantity}</span>
                                                    <span>Unit price: {formatMoney(price)}</span>
                                                </div>

                                                {item.reason && (
                                                    <p className="return-product-reason">
                                                        <strong>Reason:</strong> {item.reason}
                                                    </p>
                                                )}

                                                {item.notes && (
                                                    <p className="return-product-notes">{item.notes}</p>
                                                )}
                                            </div>

                                            <div className="return-product-total">
                                                <span>Item total</span>
                                                <strong>{formatMoney(price * quantity)}</strong>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="return-empty-items">
                                <FaBoxOpen />
                                <p>No returned items found.</p>
                            </div>
                        )}
                    </section>

                    {/* Return Reason */}
                    <section className="return-detail-card">
                        <div className="return-section-heading">
                            <div>
                                <h2>Return Reason & Notes</h2>
                                <p>Information submitted with this request</p>
                            </div>
                        </div>

                        <div className="return-reason-box">
                            <span className="return-field-label">Main reason</span>
                            <p>{request.reason || "No reason provided"}</p>
                        </div>

                        <div className="return-notes-box">
                            <span className="return-field-label">Customer notes</span>
                            <p>{request.notes || "No additional notes provided."}</p>
                        </div>

                        <div className="return-notes-box admin-notes">
                            <span className="return-field-label">Admin notes</span>
                            <p>{request.adminNotes || "No admin notes added yet."}</p>
                        </div>
                    </section>

                    {/* Original Order */}
                    <section className="return-detail-card">
                        <div className="return-section-heading">
                            <div>
                                <h2>Original Order</h2>
                                <p>Order associated with this return</p>
                            </div>
                        </div>

                        <div className="return-order-info-grid">
                            <div>
                                <span>Order ID</span>
                                <strong>
                                    {orderId
                                        ? `#${String(orderId).slice(-8).toUpperCase()}`
                                        : "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Order Date</span>
                                <strong>{formatDate(order.createdAt)}</strong>
                            </div>

                            <div>
                                <span>Order Total</span>
                                <strong>{formatMoney(order.totalAmount)}</strong>
                            </div>

                            <div>
                                <span>Payment Status</span>
                                <strong className="return-payment-status">
                                    {order.paymentStatus || "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Order Status</span>
                                <strong>{order.orderStatus || "—"}</strong>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Sidebar */}
                <aside className="return-detail-sidebar">
                    <section className="return-detail-card">
                        <div className="return-section-heading">
                            <div>
                                <h2>Customer Details</h2>
                                <p>Customer who requested the return</p>
                            </div>
                        </div>

                        <div className="return-customer-profile">
                            <div className="return-customer-avatar">
                                {customer.profileImage ? (
                                    <img
                                        src={customer.profileImage}
                                        alt={customer.profileName || "Customer"}
                                        className="customer-large-avatar-img "
                                    />
                                ) : (
                                    <FaUser />
                                )}
                            </div>

                            <div>
                                <h3>{customer.profileName || "Customer name unavailable"}</h3>
                                <span>Customer</span>
                            </div>
                        </div>

                        <div className="return-customer-field">
                            <FaEnvelope />
                            <div>
                                <span>Email address</span>
                                <strong>{customer.email || "—"}</strong>
                            </div>
                        </div>

                        <div className="return-customer-field">
                            <FaPhone />
                            <div>
                                <span>Mobile number</span>
                                <strong>{customer.phoneNumber || "—"}</strong>
                            </div>
                        </div>
                        

                        <div className="return-customer-field">
                            <FaMapMarkerAlt />
                            <div>
                                <span>Shipping address</span>
                                <strong>
                                    {order.shippingAddress
                                        ? [
                                            order.shippingAddress.address,
                                            order.shippingAddress.city,
                                            order.shippingAddress.state,
                                            order.shippingAddress.pincode,
                                        ]
                                            .filter(Boolean)
                                            .join(", ")
                                        : "Address not available"}
                                </strong>
                            </div>
                        </div>
                    </section>

                    <section className="return-detail-card return-refund-card">
                        <div className="return-section-heading">
                            <div>
                                <h2>Refund Summary</h2>
                                <p>Estimated amount for this return</p>
                            </div>
                        </div>

                        <div className="return-refund-line">
                            <span>Returned products</span>
                            <strong>{itemCount}</strong>
                        </div>

                        <div className="return-refund-line">
                            <span>Return type</span>
                            <strong>
                                {request.returnType === "partial" ? "Partial" : "Full"}
                            </strong>
                        </div>

                        <div className="return-refund-divider" />

                        <div className="return-refund-total">
                            <span>Total refund amount</span>
                            <strong>{formatMoney(refundAmount)}</strong>
                        </div>

                        <div className="return-refund-info">
                            <FaCheckCircle />
                            <span>
                                Refund details are shown for review. No refund action is connected yet.
                            </span>
                        </div>
                    </section>
                </aside>
            </div>
        </main>
    );
};

export default AdminReturnRequestDetail;

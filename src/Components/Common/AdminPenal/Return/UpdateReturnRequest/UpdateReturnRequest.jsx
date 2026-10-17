
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
    FaArrowLeft,
    FaBoxOpen,
    FaCheckCircle,
    FaClipboardCheck,
    FaSave,
    FaUndoAlt,
} from "react-icons/fa";

import {
    getReturnRequest,
    updateReturnRequest,
} from "@/redux/action/returnAction";

import "./UpdateReturnRequest.css";
import Loading from "@/Components/Common/Loding/Loading";

const STATUS_OPTIONS = [
    "pending",
    "approved",
    "rejected",
    "received",
    "completed",
    "cancelled",
];

const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getProductName = (item) => {
    if (item?.productName) return item.productName;

    const product = item?.productId;

    if (product && typeof product === "object") {
        return (
            product.productName ||
            product.name ||
            product.title ||
            "Product"
        );
    }

    return "Product";
};

const getProductImage = (item) => {
    const product = item?.productId;

    if (!product || typeof product !== "object") {
        return "";
    }

    const image =
        product.image ||
        product.imageUrl ||
        product.thumbnail ||
        product.images?.[0];

    if (typeof image === "string") return image;

    return image?.url || image?.secure_url || "";
};

export default function UpdateReturnRequest({ id }) {
    const dispatch = useDispatch();
    const router = useRouter();

    const {
        selectedReturnRequest,
        isLoading,
        isError,
        errorMessage,
    } = useSelector((state) => state.returnStore);

    const [form, setForm] = useState({
        status: "pending",
        adminNotes: "",
        totalRefundAmount: "0",
        returnType: "full",
    });

    const [loadingDetails, setLoadingDetails] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pageError, setPageError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!id) {
            setPageError("Return request ID is missing.");
            setLoadingDetails(false);
            return;
        }

        let active = true;

        const loadDetails = async () => {
            setLoadingDetails(true);
            setPageError("");

            try {
                const data = await dispatch(
                    getReturnRequest(id)
                ).unwrap();

                if (!active) return;

                if (!data) {
                    setPageError("Return request not found.");
                    return;
                }

                setForm({
                    status: data.status || "pending",
                    adminNotes: data.adminNotes || "",
                    totalRefundAmount: String(
                        data.totalRefundAmount ?? 0
                    ),
                    returnType: data.returnType || "full",
                });
            } catch (error) {
                if (active) {
                    setPageError(
                        typeof error === "string"
                            ? error
                            : "Unable to load return request details."
                    );
                }
            } finally {
                if (active) {
                    setLoadingDetails(false);
                }
            }
        };

        loadDetails();

        return () => {
            active = false;
        };
    }, [dispatch, id]);

    const returnRequest =
        selectedReturnRequest?._id === id
            ? selectedReturnRequest
            : null;

    const order = returnRequest?.orderId;
    const customer = returnRequest?.userId;

    const orderId =
        order && typeof order === "object"
            ? order.orderNumber ||
            order._id ||
            "Not available"
            : order || "Not available";

    const customerName =
        customer && typeof customer === "object"
            ? customer.profileName ||
            customer.fullName ||
            "Customer"
            : "Customer";

    const customerEmail =
        customer && typeof customer === "object"
            ? customer.email || "Not available"
            : "Not available";

    const items = Array.isArray(returnRequest?.items)
        ? returnRequest.items
        : [];

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setPageError("");
        setSuccessMessage("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setPageError("");
        setSuccessMessage("");

        const refundAmount = Number(form.totalRefundAmount);

        if (
            form.totalRefundAmount.trim() === "" ||
            !Number.isFinite(refundAmount) ||
            refundAmount < 0
        ) {
            setPageError(
                "Please enter a valid refund amount."
            );
            return;
        }

        if (!STATUS_OPTIONS.includes(form.status)) {
            setPageError("Please select a valid status.");
            return;
        }

        setSaving(true);

        try {
            await dispatch(
                updateReturnRequest({
                    returnId: id,
                    updateData: {
                        status: form.status,
                        adminNotes: form.adminNotes,
                        totalRefundAmount: refundAmount,
                        returnType: form.returnType,
                    },
                })
            ).unwrap();

            setSuccessMessage(
                "Return request updated successfully."
            );
            router.push("/admin/returns");
            // Allow the success message to be visible before navigating.
            // No automatic redirect is used here.
        } catch (error) {
            console.error("RETURN UPDATE FAILED:", error);

            setPageError(
                typeof error === "string"
                    ? error
                    : error?.message ||
                    "Failed to update return request."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loadingDetails) {
        return <Loading/>;
    }

    if (!returnRequest) {
        return (
            <main className="urr-page">
                <div className="urr-error-card">
                    <FaBoxOpen />
                    <h2>Return request unavailable</h2>
                    <p>
                        {pageError ||
                            errorMessage ||
                            "The requested return could not be found."}
                    </p>
                    <button
                        type="button"
                        onClick={() =>
                            router.push("/admin/returns")
                        }
                        cla
                    >
                        <FaArrowLeft /> Back to Returns
                    </button>
                </div>
            </main>
        );
    }
    // if (isLoading) {
    //     return <Loading />;
    // }



    return (
        <main className="urr-page">
            <div className="urr-container">
                <button
                    type="button"
                    className="urr-back-button"
                    onClick={() => router.push("/admin/returns")}
                >
                    <FaArrowLeft />
                    Back to Return Requests
                </button>

                <header className="urr-header">
                    <div className="urr-header-icon">
                        <FaUndoAlt />
                    </div>

                    <div className="urr-header-copy">
                        <span className="urr-eyebrow">
                            ADMIN PANEL / RETURNS
                        </span>
                        <h1>Update Return Request</h1>
                        <p>
                            Review the return details and update
                            its status, refund and admin notes.
                        </p>
                    </div>

                    <span
                        className={`urr-status-badge urr-status-${form.status}`}
                    >
                        {form.status}
                    </span>
                </header>

                {pageError && (
                    <div className="urr-alert urr-alert-error">
                        {pageError}
                    </div>
                )}

                {isError && errorMessage && !pageError && (
                    <div className="urr-alert urr-alert-error">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="urr-alert urr-alert-success">
                        <FaCheckCircle />
                        {successMessage}
                    </div>
                )}

                <div className="urr-layout">
                    <section className="urr-main-column">
                        <div className="urr-card">
                            <div className="urr-card-heading">
                                <div className="urr-section-icon">
                                    <FaClipboardCheck />
                                </div>
                                <div>
                                    <h2>Return Information</h2>
                                    <p>
                                        Request details submitted by
                                        the customer.
                                    </p>
                                </div>
                            </div>

                            <div className="urr-info-grid">
                                <div className="urr-info-item">
                                    <span>Return Request ID</span>
                                    <strong className="urr-id-value">
                                        {returnRequest._id}
                                    </strong>
                                </div>

                                <div className="urr-info-item">
                                    <span>Order ID</span>
                                    <strong className="urr-id-value">
                                        {String(orderId)}
                                    </strong>
                                </div>

                                <div className="urr-info-item">
                                    <span>Customer</span>
                                    <strong>{customerName}</strong>
                                </div>

                                <div className="urr-info-item">
                                    <span>Customer Email</span>
                                    <strong>{customerEmail}</strong>
                                </div>

                                <div className="urr-info-item">
                                    <span>Request Date</span>
                                    <strong>
                                        {formatDate(
                                            returnRequest.requestedAt ||
                                            returnRequest.createdAt
                                        )}
                                    </strong>
                                </div>

                                <div className="urr-info-item">
                                    <span>Last Updated</span>
                                    <strong>
                                        {formatDate(
                                            returnRequest.updatedAt
                                        )}
                                    </strong>
                                </div>
                            </div>

                            <div className="urr-reason-box">
                                <span>Return Reason</span>
                                <strong>
                                    {returnRequest.reason || "Not specified"}
                                </strong>

                                {returnRequest.notes && (
                                    <p>{returnRequest.notes}</p>
                                )}
                            </div>
                        </div>

                        <div className="urr-card">
                            <div className="urr-card-heading">
                                <div className="urr-section-icon">
                                    <FaBoxOpen />
                                </div>
                                <div>
                                    <h2>Returned Products</h2>
                                    <p>
                                        {items.length} product
                                        {items.length === 1 ? "" : "s"} in
                                        this request.
                                    </p>
                                </div>
                            </div>

                            {items.length > 0 ? (
                                <div className="urr-items-list">
                                    {items.map((item, index) => {
                                        const image =
                                            getProductImage(item);

                                        return (
                                            <article
                                                className="urr-product"
                                                key={
                                                    item._id ||
                                                    `${item.productId}-${index}`
                                                }
                                            >
                                                <div className="urr-product-image">
                                                    {image ? (
                                                        <img
                                                            src={image}
                                                            alt={getProductName(item)}
                                                            onError={(event) => {
                                                                event.currentTarget.style.display =
                                                                    "none";
                                                            }}
                                                        />
                                                    ) : (
                                                        <FaBoxOpen />
                                                    )}
                                                </div>

                                                <div className="urr-product-details">
                                                    <h3>
                                                        {getProductName(item)}
                                                    </h3>
                                                    <p>
                                                        Quantity:{" "}
                                                        {item.quantity ?? 1}
                                                    </p>
                                                    <p>
                                                        Unit price: ₹
                                                        {Number(
                                                            item.price ?? 0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </p>

                                                    {item.reason && (
                                                        <p>
                                                            Reason:{" "}
                                                            {item.reason}
                                                        </p>
                                                    )}

                                                    {item.notes && (
                                                        <p>
                                                            Note: {item.notes}
                                                        </p>
                                                    )}
                                                </div>

                                                <strong className="urr-item-total">
                                                    ₹
                                                    {(
                                                        Number(item.price ?? 0) *
                                                        Number(item.quantity ?? 1)
                                                    ).toLocaleString("en-IN")}
                                                </strong>
                                            </article>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="urr-no-items">
                                    No product details are available.
                                </p>
                            )}
                        </div>

                        <form
                            className="urr-card urr-edit-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="urr-card-heading">
                                <div className="urr-section-icon">
                                    <FaSave />
                                </div>
                                <div>
                                    <h2>Edit Return Request</h2>
                                    <p>
                                        Changes will be saved to the
                                        return request.
                                    </p>
                                </div>
                            </div>

                            <div className="urr-form-grid">
                                <div className="urr-form-group">
                                    <label htmlFor="status">
                                        Return Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        required
                                    >
                                        {STATUS_OPTIONS.map((status) => (
                                            <option
                                                value={status}
                                                key={status}
                                            >
                                                {status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    status.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    <small>
                                        Select the latest processing status.
                                    </small>
                                </div>

                                <div className="urr-form-group">
                                    <label htmlFor="returnType">
                                        Return Type
                                    </label>
                                    <select
                                        id="returnType"
                                        name="returnType"
                                        value={form.returnType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="full">
                                            Full Return
                                        </option>
                                        <option value="partial">
                                            Partial Return
                                        </option>
                                    </select>
                                </div>

                                <div className="urr-form-group urr-full-width">
                                    <label htmlFor="totalRefundAmount">
                                        Total Refund Amount (₹)
                                    </label>
                                    <div className="urr-amount-input">
                                        <span>₹</span>
                                        <input
                                            id="totalRefundAmount"
                                            name="totalRefundAmount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.totalRefundAmount}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <small>
                                        Confirm the refund amount before saving.
                                    </small>
                                </div>

                                <div className="urr-form-group urr-full-width">
                                    <label htmlFor="adminNotes">
                                        Admin Notes
                                    </label>
                                    <textarea
                                        id="adminNotes"
                                        name="adminNotes"
                                        rows="5"
                                        maxLength="2000"
                                        placeholder="Enter approval details, rejection reason or refund instructions..."
                                        value={form.adminNotes}
                                        onChange={handleChange}
                                    />
                                    <small>
                                        {form.adminNotes.length}/2000 characters
                                    </small>
                                </div>
                            </div>

                            <div className="urr-form-footer">
                                <button
                                    type="button"
                                    className="urr-cancel-button"
                                    onClick={() =>
                                        router.push("/admin/returns")
                                    }
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="urr-save-button"
                                    disabled={saving || isLoading}
                                >
                                    <FaSave />
                                    {saving
                                        ? "Saving Changes..."
                                        : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </section>

                    <aside className="urr-side-column">
                        <div className="urr-card urr-summary-card">
                            <h2>Refund Summary</h2>

                            <div className="urr-refund-amount">
                                <span>Total Refund Amount</span>
                                <strong>
                                    ₹
                                    {Number(
                                        form.totalRefundAmount || 0
                                    ).toLocaleString("en-IN")}
                                </strong>
                            </div>

                            <div className="urr-summary-row">
                                <span>Return Type</span>
                                <strong>
                                    {form.returnType === "full"
                                        ? "Full Return"
                                        : "Partial Return"}
                                </strong>
                            </div>

                            <div className="urr-summary-row">
                                <span>Product Count</span>
                                <strong>{items.length}</strong>
                            </div>

                            <div className="urr-summary-row">
                                <span>Current Status</span>
                                <strong className="urr-summary-status">
                                    {form.status}
                                </strong>
                            </div>

                            <div className="urr-summary-note">
                                Verify the product, order and refund
                                amount before saving the changes.
                            </div>
                        </div>

                        <div className="urr-card urr-timeline-card">
                            <h2>Request Timeline</h2>

                            <div className="urr-timeline">
                                <div className="urr-timeline-item">
                                    <span className="urr-timeline-dot" />
                                    <div>
                                        <strong>Request Submitted</strong>
                                        <p>
                                            {formatDate(
                                                returnRequest.requestedAt ||
                                                returnRequest.createdAt
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {returnRequest.approvedAt && (
                                    <div className="urr-timeline-item">
                                        <span className="urr-timeline-dot" />
                                        <div>
                                            <strong>Approved</strong>
                                            <p>
                                                {formatDate(
                                                    returnRequest.approvedAt
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {returnRequest.receivedAt && (
                                    <div className="urr-timeline-item">
                                        <span className="urr-timeline-dot" />
                                        <div>
                                            <strong>Item Received</strong>
                                            <p>
                                                {formatDate(
                                                    returnRequest.receivedAt
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {returnRequest.completedAt && (
                                    <div className="urr-timeline-item">
                                        <span className="urr-timeline-dot" />
                                        <div>
                                            <strong>Completed</strong>
                                            <p>
                                                {formatDate(
                                                    returnRequest.completedAt
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

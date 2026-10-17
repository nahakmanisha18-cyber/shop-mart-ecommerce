
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FaArrowLeft,
    FaBoxOpen,
    FaCheckCircle,
    FaChevronDown,
    FaInfoCircle,
    FaMinus,
    FaPlus,
    FaUndo,
    FaShieldAlt,
    FaTimes,
    FaTimesCircle,
} from "react-icons/fa";
import "./ReturnRequest.css";

const RETURN_REASONS = [
    { value: "damaged", label: "Product arrived damaged" },
    { value: "wrong_product", label: "Wrong product received" },
    { value: "defective", label: "Product is defective" },
    { value: "not_as_described", label: "Product not as described" },
    { value: "size_issue", label: "Size or fit issue" },
    { value: "other", label: "Other reason" },
];


const ReturnRequest = ({
    order,
    onSubmitReturn,
    submitting = false,
}) => {
    const router = useRouter();

    const [popup, setPopup] = useState({
        show: false,
        type: "",
        message: "",
    });
    const orderItems = useMemo(() => {
        const items = order?.items || order?.products || [];

        return items.map((item, index) => {
            // Your Order schema stores the Product reference in item.product
            const product =
                item.product && typeof item.product === "object"
                    ? item.product
                    : item.productId && typeof item.productId === "object"
                        ? item.productId
                        : {};

            const productId =
                product._id ||
                (typeof item.product === "string" ? item.product : null) ||
                item.productId?._id ||
                (typeof item.productId === "string" ? item.productId : null);

            return {
                // Keep a unique key for this order line
                key: String(item._id || productId || index),

                // Do not use item._id as the product ID fallback
                productId: productId ? String(productId) : "",

                productName:
                    item.productName ||
                    product.productName ||
                    product.name ||
                    item.name ||
                    "Product",

                image:
                    item.image ||
                    item.images?.[0] ||
                    product.images?.[0] ||
                    product.image ||
                    "",

                price: Number(
                    item.price ??
                    item.discountPrice ??
                    product.discountPrice ??
                    product.price ??
                    0
                ),

                quantity: Math.max(0, Number(item.quantity ?? 1)),
            };
        });
    }, [order]);


    const [selectedItems, setSelectedItems] = useState({});
    const [reasons, setReasons] = useState({});
    const [notes, setNotes] = useState({});
    const [error, setError] = useState("");

    const selectedProducts = orderItems.filter(
        (item) => selectedItems[item.key]
    );

    const refundTotal = selectedProducts.reduce(
        (total, item) =>
            total +
            item.price *
            Number(selectedItems[item.key] || 0),
        0
    );

    const changeSelection = (item, checked) => {
        setSelectedItems((previous) => {
            const updated = { ...previous };

            if (checked) {
                updated[item.key] = 1;
            } else {
                delete updated[item.key];
            }

            return updated;
        });

        setError("");
    };

    const changeQuantity = (item, amount) => {
        setSelectedItems((previous) => {
            const current = Number(previous[item.key] || 1);
            const next = Math.min(
                item.quantity,
                Math.max(1, current + amount)
            );

            return {
                ...previous,
                [item.key]: next,
            };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!order?._id) {
            setError("Order details are not available.");
            return;
        }

        if (selectedProducts.length === 0) {
            setError("Please select at least one product.");
            return;
        }
        const invalidProduct = selectedProducts.some(
            (item) => !item.productId
        );

        if (invalidProduct) {
            setError("Product ID is missing. Please refresh the order page.");
            return;
        }
        const missingReason = selectedProducts.some(
            (item) => !reasons[item.key]
        );

        if (missingReason) {
            setError("Please select a return reason for every item.");
            return;
        }

        const payload = {
            orderId: order._id,

            returnType:
                selectedProducts.length === orderItems.length &&
                    selectedProducts.every(
                        (item) =>
                            Number(selectedItems[item.key]) === item.quantity
                    )
                    ? "full"
                    : "partial",

            items: selectedProducts.map((item) => ({
                productId: item.productId,
                quantity: Number(selectedItems[item.key]),
                reason: reasons[item.key],
                notes: notes[item.key] || "",
            })),
        };

        if (typeof onSubmitReturn !== "function") {
            setError(
                "Return API is not connected yet. Connect onSubmitReturn to submit your request."
            );
            return;
        }

        try {
            const result = await onSubmitReturn(payload);

            // Open success popup only after successful API response
            setError("");

            setPopup({
                show: true,
                type: "success",
                message: "Your return request has been submitted successfully.",
            });

        } catch (err) {
            setPopup({
                show: true,
                type: "error",
                message:
                    err?.message ||
                    "Unable to submit your return request.",
            });
        }
    };

    const orderId = order?._id
        ? String(order._id)
        : "";

    if (!order) {
        return (
            <div className="rr-page">
                <div className="rr-message">
                    <FaInfoCircle />
                    <p>
                        Order details are loading or unavailable.
                        Please open this page from your order details.
                    </p>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rr-back-btn"
                    >
                        <FaArrowLeft /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="rr-page">

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
                                ? "Return Request Submitted!"
                                : "Request Failed"}
                        </h2>

                        <p>{popup.message}</p>

                        {popup.type === "success" ? (
                            <button
                                className="order-popup-btn"
                                onClick={() =>
                                    router.push("/return-request/all-return-request")
                                }
                            >
                                View Return Requests
                            </button>
                        ) : (
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
                                Try Again
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="rr-container">
                <button
                    type="button"
                    className="rr-back-link"
                    onClick={() => router.back()}
                >
                    <FaArrowLeft /> Back to Order Details
                </button>

                <header className="rr-heading">
                    <div className="rr-heading-icon">
                        <FaUndo />
                    </div>

                    <h1>Return Your Order</h1>
                    <p>
                        Select the items you want to return and
                        tell us why.
                    </p>
                </header>

                <section className="rr-order-info">
                    <div>
                        <span>Order ID</span>
                        <strong>#{orderId}</strong>
                    </div>

                    <div>
                        <span>Order Date</span>
                        <strong>
                            {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )
                                : "—"}
                        </strong>
                    </div>

                    <div>
                        <span>Order Status</span>
                        <strong className="rr-delivered">
                            <FaCheckCircle /> Delivered
                        </strong>
                    </div>
                </section>

                <form onSubmit={handleSubmit}>
                    <div className="rr-layout">
                        <div className="rr-main-column">
                            <section className="rr-card">
                                <div className="rr-section-heading">
                                    <div className="rr-section-icon">
                                        <FaBoxOpen />
                                    </div>

                                    <div>
                                        <h2>Select Items to Return</h2>
                                        <p>
                                            Select one or more products from your order.
                                        </p>
                                    </div>
                                </div>

                                <div className="rr-product-list">
                                    {orderItems.map((item) => {
                                        const isSelected =
                                            Boolean(selectedItems[item.key]);

                                        return (
                                            <article
                                                className={`rr-product ${isSelected ? "rr-product-selected" : ""
                                                    }`}
                                                key={item.key}
                                            >
                                                <label className="rr-product-check">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={(event) =>
                                                            changeSelection(
                                                                item,
                                                                event.target.checked
                                                            )
                                                        }
                                                    />
                                                    <span className="rr-custom-check">
                                                        <FaCheckCircle />
                                                    </span>
                                                </label>

                                                <div className="rr-product-image">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.productName}
                                                        />
                                                    ) : (
                                                        <FaBoxOpen />
                                                    )}
                                                </div>

                                                <div className="rr-product-details">
                                                    <h3>{item.productName}</h3>
                                                    <p>
                                                        Price: ₹
                                                        {item.price.toLocaleString("en-IN")}
                                                    </p>
                                                    <span>
                                                        Purchased quantity: {item.quantity}
                                                    </span>

                                                    {isSelected && (
                                                        <div className="rr-quantity">
                                                            <span>Return quantity</span>

                                                            <div className="rr-quantity-control">
                                                                <button
                                                                    type="button"
                                                                    aria-label="Decrease return quantity"
                                                                    disabled={
                                                                        selectedItems[item.key] <= 1
                                                                    }
                                                                    onClick={() =>
                                                                        changeQuantity(item, -1)
                                                                    }
                                                                >
                                                                    <FaMinus />
                                                                </button>

                                                                <strong>
                                                                    {selectedItems[item.key]}
                                                                </strong>

                                                                <button
                                                                    type="button"
                                                                    aria-label="Increase return quantity"
                                                                    disabled={
                                                                        selectedItems[item.key] >=
                                                                        item.quantity
                                                                    }
                                                                    onClick={() =>
                                                                        changeQuantity(item, 1)
                                                                    }
                                                                >
                                                                    <FaPlus />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <strong className="rr-product-price">
                                                    ₹
                                                    {(
                                                        item.price *
                                                        Number(selectedItems[item.key] || 0)
                                                    ).toLocaleString("en-IN")}
                                                </strong>
                                            </article>
                                        );
                                    })}

                                    {orderItems.length === 0 && (
                                        <div className="rr-empty">
                                            No order items were found.
                                        </div>
                                    )}
                                </div>
                            </section>

                            {selectedProducts.length > 0 && (
                                <section className="rr-card rr-reason-card">
                                    <div className="rr-section-heading">
                                        <div className="rr-section-icon">
                                            <FaInfoCircle />
                                        </div>

                                        <div>
                                            <h2>Reason for Return</h2>
                                            <p>
                                                Select a reason for each chosen product.
                                            </p>
                                        </div>
                                    </div>

                                    {selectedProducts.map((item) => (
                                        <div
                                            className="rr-reason-group"
                                            key={item.key}
                                        >
                                            <label htmlFor={`reason-${item.key}`}>
                                                {item.productName}
                                                <span>*</span>
                                            </label>

                                            <div className="rr-select-wrap">
                                                <select
                                                    id={`reason-${item.key}`}
                                                    value={reasons[item.key] || ""}
                                                    onChange={(event) =>
                                                        setReasons((previous) => ({
                                                            ...previous,
                                                            [item.key]: event.target.value,
                                                        }))
                                                    }
                                                    required
                                                >
                                                    <option value="">
                                                        Select return reason
                                                    </option>

                                                    {RETURN_REASONS.map((reason) => (
                                                        <option
                                                            value={reason.value}
                                                            key={reason.value}
                                                        >
                                                            {reason.label}
                                                        </option>
                                                    ))}
                                                </select>

                                                <FaChevronDown />
                                            </div>

                                            <label
                                                htmlFor={`notes-${item.key}`}
                                                className="rr-notes-label"
                                            >
                                                Additional details (optional)
                                            </label>

                                            <textarea
                                                id={`notes-${item.key}`}
                                                rows={3}
                                                maxLength={500}
                                                placeholder="Please describe the issue..."
                                                value={notes[item.key] || ""}
                                                onChange={(event) =>
                                                    setNotes((previous) => ({
                                                        ...previous,
                                                        [item.key]: event.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                    ))}
                                </section>
                            )}
                        </div>

                        <aside className="rr-sidebar">
                            <section className="rr-card rr-summary">
                                <h2>Return Summary</h2>

                                <div className="rr-summary-row">
                                    <span>Selected products</span>
                                    <strong>{selectedProducts.length}</strong>
                                </div>

                                <div className="rr-summary-row">
                                    <span>Total quantity</span>
                                    <strong>
                                        {selectedProducts.reduce(
                                            (sum, item) =>
                                                sum +
                                                Number(selectedItems[item.key] || 0),
                                            0
                                        )}
                                    </strong>
                                </div>

                                <div className="rr-summary-row">
                                    <span>Estimated refund</span>
                                    <strong className="rr-refund-amount">
                                        ₹{refundTotal.toLocaleString("en-IN")}
                                    </strong>
                                </div>

                                <div className="rr-refund-note">
                                    <FaInfoCircle />
                                    <p>
                                        Final refund amount will be verified
                                        against your order and payment details.
                                    </p>
                                </div>

                                {error && (
                                    <div className="rr-error" role="alert">
                                        <FaInfoCircle />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="rr-submit-btn"
                                    disabled={
                                        submitting ||
                                        selectedProducts.length === 0
                                    }
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Submit Return Request"}
                                </button>

                                <button
                                    type="button"
                                    className="rr-cancel-btn"
                                    onClick={() => router.back()}
                                >
                                    <FaTimes /> Cancel
                                </button>

                                <div className="rr-secure-note">
                                    <FaShieldAlt />
                                    Your return request is securely processed.
                                </div>
                            </section>
                        </aside>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default ReturnRequest;

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
    FaArrowLeft,
    FaSave,
    FaReceipt,
    FaUser,
    FaCreditCard,
    FaClipboardCheck,
} from "react-icons/fa";

import {
    getRefundDetails,
    updateRefund,
} from "@/redux/action/refundAction";

import {
    clearRefundDetails,
    clearRefundError,
} from "@/redux/slice/refundSlice";

import "./RefundEditPage.css";

export default function RefundEditPage({ refundId }) {
    const router = useRouter();
    const dispatch = useDispatch();

    const {
        refundDetails,
        isLoading,
        isError,
        errorMessage,
        updateLoading,
        updateSuccess,
        updateError,
        updateMessage,
    } = useSelector((state) => state.refundStore);

    const [formData, setFormData] = useState({
        status: "pending",
        adminNotes: "",
        failureReason: "",
    });

    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (refundId) {
            dispatch(getRefundDetails(refundId));
        }

        return () => {
            dispatch(clearRefundDetails());
            dispatch(clearRefundError());
        };
    }, [dispatch, refundId]);

    useEffect(() => {
        if (!refundDetails) return;

        setFormData({
            status: refundDetails.status || "pending",
            adminNotes: refundDetails.adminNotes || "",
            failureReason: refundDetails.failureReason || "",
        });
    }, [refundDetails]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setFormError("");
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");

        if (!refundId) {
            setFormError("Refund ID is missing.");
            return;
        }

        try {
            await dispatch(
                updateRefund({
                    refundId,
                    updateData: {
                        adminNotes: formData.adminNotes,
                        failureReason: formData.failureReason,
                    },
                })
            ).unwrap();

            await dispatch(getRefundDetails(refundId)).unwrap();
        } catch (error) {
            setFormError(
                typeof error === "string"
                    ? error
                    : error?.message || "Unable to save refund notes."
            );
        }
    };
    


    const handleConfirmCodPayout = async () => {
        setFormError("");

        const paymentMethod = String(
            refundDetails?.paymentMethod ||
            refundDetails?.orderId?.paymentMethod ||
            ""
        ).trim().toLowerCase();

        const refundStatus = String(
            refundDetails?.status || ""
        ).trim().toLowerCase();

        if (!refundId) {
            setFormError("Refund ID is missing.");
            return;
        }

        if (paymentMethod !== "cod") {
            setFormError(
                `This action is only for COD refunds. Payment method: ${paymentMethod || "missing"}`
            );
            return;
        }

        if (refundStatus !== "pending") {
            setFormError(
                `COD payout can only be confirmed for a pending refund. Current status: ${refundStatus}`
            );
            return;
        }

        const reference = window.prompt(
            "Enter the actual bank transfer UTR or payout reference:"
        );

        if (!reference?.trim()) {
            setFormError("Payout reference is required.");
            return;
        }

        const confirmed = window.confirm(
            "Have you verified that the customer actually received the payout?"
        );

        if (!confirmed) return;

        try {
            const result = await dispatch(
                updateRefund({
                    refundId,
                    updateData: {
                        action: "confirm_manual_payout",
                        manualPayoutConfirmed: true,
                        payoutReference: reference.trim(),
                        adminNotes: formData.adminNotes,
                    },
                })
            ).unwrap();

            console.log("COD PAYOUT UPDATE RESPONSE:", result);

            await dispatch(getRefundDetails(refundId)).unwrap();

            setFormError("");
        } catch (error) {
            console.error("COD PAYOUT UPDATE ERROR:", error);

            setFormError(
                typeof error === "string"
                    ? error
                    : error?.message ||
                    "Unable to confirm COD payout."
            );
        }
    };
    
    
    const handleProcessRefund = async () => {
        setFormError("");

        if (!refundId || refundDetails?.status !== "pending") {
            setFormError("Only a pending refund can be initiated.");
            return;
        }

        if (refundDetails?.paymentMethod !== "razorpay") {
            setFormError(
                "Use the manual payout confirmation flow for COD refunds."
            );
            return;
        }

        try {
            await dispatch(
                updateRefund({
                    refundId,
                    updateData: {
                        action: "process",
                        adminNotes: formData.adminNotes,
                    },
                })
            ).unwrap();

            await dispatch(getRefundDetails(refundId)).unwrap();
        } catch (error) {
            setFormError(
                typeof error === "string"
                    ? error
                    : error?.message || "Unable to initiate refund."
            );
        }
    };

    const handleCheckRefundStatus = async () => {
        setFormError("");

        if (!refundId || !refundDetails?.razorpayRefundId) {
            setFormError(
                "Razorpay refund ID is missing. Verify it in Razorpay Dashboard."
            );
            return;
        }

        try {
            await dispatch(
                updateRefund({
                    refundId,
                    updateData: {
                        action: "check_status",
                    },
                })
            ).unwrap();

            await dispatch(getRefundDetails(refundId)).unwrap();
        } catch (error) {
            setFormError(
                typeof error === "string"
                    ? error
                    : error?.message || "Unable to check refund status."
            );
        }
    };


    if (isLoading && !refundDetails) {
        return (
            <div className="refund-edit-loading">
                <span className="refund-edit-spinner" />
                <p>Loading refund details...</p>
            </div>
        );
    }

    if (isError && !refundDetails) {
        return (
            <div className="refund-edit-state">
                <h2>Unable to load refund</h2>
                <p>{errorMessage || "Please try again."}</p>
                <button
                    className="refund-edit-back-btn"
                    onClick={() => router.back()}
                >
                    <FaArrowLeft /> Go Back
                </button>
            </div>
        );
    }

    if (!refundDetails) {
        return (
            <div className="refund-edit-state">
                <h2>Refund not found</h2>
                <button
                    className="refund-edit-back-btn"
                    onClick={() => router.back()}
                >
                    <FaArrowLeft /> Go Back
                </button>
            </div>
        );
    }
    const paymentMethod = String(
        refundDetails?.paymentMethod ||
        refundDetails?.orderId?.paymentMethod ||
        ""
    ).trim().toLowerCase();

    const refundStatus = String(
        refundDetails?.status || ""
    ).trim().toLowerCase();

    console.log("REFUND PAYMENT METHOD:", paymentMethod);
    console.log("ORDER PAYMENT METHOD:", refundDetails?.orderId?.paymentMethod);
    console.log("REFUND STATUS:", refundStatus);
    console.log("PAYOUT REFERENCE:", refundDetails?.payoutReference);
    console.log("REFUND PAYMENT METHOD:", paymentMethod);
    console.log("COMPLETE REFUND DETAILS:", refundDetails);
    console.log("PAYMENT METHOD:", refundDetails?.paymentMethod);
    console.log("ORDER PAYMENT METHOD:", refundDetails?.orderId?.paymentMethod);
    console.log("STATUS:", refundDetails?.status);
    console.log("REFUND STATUS:", refundStatus);
    console.log("PAYOUT REFERENCE:", refundDetails.payoutReference);
    
    const customer = refundDetails.userId || {};
    const order = refundDetails.orderId || {};

    const amount = Number(refundDetails.amount || 0).toLocaleString(
        "en-IN",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    );

    return (
        <main className="refund-edit-page">
            <div className="refund-edit-topbar">
                <button
                    type="button"
                    className="refund-edit-back-btn"
                    onClick={() => router.back()}
                >
                    <FaArrowLeft />
                    Back to Refunds
                </button>

                <span className="refund-edit-breadcrumb">
                    Admin <span>/</span> Refunds <span>/</span> Edit
                </span>
            </div>

            <header className="refund-edit-header">
                <div className="refund-edit-heading-icon">
                    <FaReceipt />
                </div>

                <div>
                    <h1>Edit Refund</h1>
                    <p>Review refund information and update its status.</p>
                </div>

                <span
                    className={`refund-edit-status-badge status-${(
                        refundDetails.status || "pending"
                    ).toLowerCase()}`}
                >
                    {(refundDetails.status || "pending").replace(/_/g, " ")}
                </span>
            </header>

            <div className="refund-edit-layout">
                <section className="refund-edit-main">
                    <div className="refund-edit-card">
                        <div className="refund-edit-card-title">
                            <FaClipboardCheck />
                            <div>
                                <h2>Update Refund Status</h2>
                                <p>Change the current refund processing status.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <label htmlFor="status" className="refund-edit-label">
                                Refund Status <span>*</span>
                            </label>

                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="refund-edit-input"
                                required
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="processed">Processed</option>
                                <option value="failed">Failed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                            <p className="refund-edit-help">
                                Select the actual processing status. Saving this form does
                                not transfer money to the customer.
                            </p>

                            <label htmlFor="adminNotes" className="refund-edit-label">
                                Admin Notes
                            </label>

                            <textarea
                                id="adminNotes"
                                name="adminNotes"
                                value={formData.adminNotes}
                                onChange={handleChange}
                                className="refund-edit-input refund-edit-textarea"
                                placeholder="Enter internal notes about this refund..."
                                rows={5}
                            />

                            <label htmlFor="failureReason" className="refund-edit-label">
                                Failure Reason
                            </label>

                            <textarea
                                id="failureReason"
                                name="failureReason"
                                value={formData.failureReason}
                                onChange={handleChange}
                                className="refund-edit-input refund-edit-textarea"
                                placeholder="Enter the reason if the refund failed..."
                                rows={3}
                            />

                            {(formError || updateError) && (
                                <div className="refund-edit-alert refund-edit-alert-error">
                                    {formError || updateMessage}
                                </div>
                            )}

                            {updateSuccess && (
                                <div className="refund-edit-alert refund-edit-alert-success">
                                    Refund updated successfully.
                                </div>
                            )}

                            <div className="refund-edit-actions">
                                <button
                                    type="button"
                                    className="refund-edit-cancel-btn"
                                    onClick={() => router.back()}
                                    disabled={updateLoading}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="refund-edit-save-btn"
                                    disabled={updateLoading}
                                >
                                    <FaSave />
                                    {updateLoading ? "Saving Changes..." : "Save Changes"}
                                </button>


                                {paymentMethod === "cod" && refundStatus === "pending" && (
                                    <button
                                        type="button"
                                        className="refund-edit-save-btn"
                                        onClick={handleConfirmCodPayout}
                                        disabled={updateLoading}
                                    >
                                        {updateLoading ? "Confirming Payout..." : "Confirm COD Payout"}
                                    </button>
                                )}



                                {refundDetails.paymentMethod === "razorpay" &&
                                    refundDetails.status === "pending" && (
                                        <button
                                            type="button"
                                            className="refund-edit-save-btn"
                                            onClick={handleProcessRefund}
                                            disabled={updateLoading}
                                        >
                                            {updateLoading ? "Processing..." : "Initiate Refund"}
                                        </button>
                                    )}

                                {refundDetails.paymentMethod === "razorpay" &&
                                    refundDetails.status === "processing" && (
                                        <button
                                            type="button"
                                            className="refund-edit-save-btn"
                                            onClick={handleCheckRefundStatus}
                                            disabled={updateLoading}
                                        >
                                            {updateLoading
                                                ? "Checking..."
                                                : "Check Refund Status"}
                                        </button>
                                    )}

                            </div>
                        </form>
                    </div>
                </section>

                <aside className="refund-edit-sidebar">
                    <div className="refund-edit-amount-card">
                        <span>Refund Amount</span>
                        <h2>
                            {refundDetails.currency === "INR" ||
                                !refundDetails.currency
                                ? "₹"
                                : `${refundDetails.currency} `}
                            {amount}
                        </h2>
                        <p>Refund reference</p>
                        <strong>{refundDetails._id}</strong>
                    </div>

                    <div className="refund-edit-card">
                        <div className="refund-edit-card-title">
                            <FaUser />
                            <div>
                                <h2>Customer Details</h2>
                                <p>Customer linked to this refund</p>
                            </div>
                        </div>

                        <div className="refund-edit-detail-row">
                            <span>Name</span>
                            <strong>{customer.profileName || "N/A"}</strong>
                        </div>

                        <div className="refund-edit-detail-row">
                            <span>Email</span>
                            <strong>{customer.email || "N/A"}</strong>
                        </div>

                        <div className="refund-edit-detail-row">
                            <span>Phone</span>
                            <strong>{customer.phoneNumber || "N/A"}</strong>
                        </div>
                    </div>

                    <div className="refund-edit-card">
                        <div className="refund-edit-card-title">
                            <FaCreditCard />
                            <div>
                                <h2>Payment Details</h2>
                                <p>Original payment reference</p>
                            </div>
                        </div>

                        <div className="refund-edit-detail-row">
                            <span>Method</span>
                            <strong>
                                {paymentMethod ? paymentMethod.toUpperCase() : "N/A"}
                            </strong>
                        </div>

                        <div className="refund-edit-detail-row">
                            <span>Payment ID</span>
                            <strong className="refund-edit-break">
                                {refundDetails.razorpayPaymentId ||
                                    refundDetails.codPaymentId ||
                                    refundDetails.paymentId ||
                                    "N/A"}
                            </strong>
                        </div>

                        <div className="refund-edit-detail-row">
                            <span>Razorpay Refund ID</span>
                            <strong className="refund-edit-break">
                                {refundDetails.razorpayRefundId || "Not initiated"}
                            </strong>
                        </div>


                        {paymentMethod === "cod" && (
                            <div className="refund-edit-detail-row">
                                <span>COD Payout Reference / UTR</span>
                                <strong className="refund-edit-break">
                                    {refundDetails?.payoutReference || "Not recorded"}
                                </strong>
                            </div>
                        )}

                        <div className="refund-edit-detail-row">
                            <span>Order ID</span>
                            <strong className="refund-edit-break">
                                {order._id || refundDetails.orderId?._id || "N/A"}
                            </strong>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}

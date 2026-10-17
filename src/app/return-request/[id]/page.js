
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { createReturnRequest } from "@/redux/action/returnAction";
import { resetReturnState } from "@/redux/slice/returnSlice";
import { getOrder } from "@/redux/action/orderAction";

import ReturnRequest from "@/Components/ReturnPages/ReturnRequest/ReturnRequest";
import Loading from "@/Components/Common/Loding/Loading";

export default function ReturnRequestPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const {
        selectedOrder,
        isLoading: isOrderLoading,
        isError,
        errorMessage,
    } = useSelector((state) => state.orderStore);

    const {
        isLoading: isReturnLoading,
    } = useSelector((state) => state.returnStore);

    // Reset previous return status and load the selected order
    useEffect(() => {
        dispatch(resetReturnState());

        if (id) {
            dispatch(getOrder(id));
        }
    }, [id, dispatch]);

    // Submit return request
    const handleSubmitReturn = async (payload) => {
        try {
            const result = await dispatch(
                createReturnRequest({
                    orderId: payload.orderId,
                    returnType: payload.returnType,

                    // Use the first selected product's reason and notes
                    reason: payload.items[0]?.reason || "",
                    notes: payload.items[0]?.notes || "",

                    items: payload.items.map((item) => ({
                        productId: item.productId,
                        quantity: Number(item.quantity),
                        reason: item.reason,
                        notes: item.notes || "",
                    })),
                })
            ).unwrap();

            return result;
        } catch (error) {
            throw new Error(
                typeof error === "string"
                    ? error
                    : error?.message || "Failed to create return request."
            );
        }
    };

    // Loading state
    if (isOrderLoading || !selectedOrder) {
        if (isError) {
            return (
                <div className="text-center p-4">
                    <h3>Unable to load order</h3>
                    <p>{errorMessage || "Please try again."}</p>

                    <button
                        type="button"
                        onClick={() => dispatch(getOrder(id))}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return <Loading />;
    }

    // Verify that the loaded order matches the URL
    if (String(selectedOrder._id) !== String(id)) {
        return <Loading />;
    }

    const order = selectedOrder;

    // Only delivered orders can be returned
    if (order.orderStatus?.toLowerCase() !== "delivered") {
        return (
            <div className="text-center p-4">
                <h3>Return is not available</h3>
                <p>You can request a return after your order is delivered.</p>

                <button
                    type="button"
                    onClick={() => router.push("/orders")}
                >
                    Back to Orders
                </button>
            </div>
        );
    }

    return (
        <ReturnRequest
            order={order}
            onSubmitReturn={handleSubmitReturn}
            submitting={isReturnLoading}
        />
    );
}
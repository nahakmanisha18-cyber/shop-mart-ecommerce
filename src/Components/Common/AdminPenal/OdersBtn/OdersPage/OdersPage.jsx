"use client";

import Link from "next/link";

import {
    FaSearch,
    FaEye,
    FaEdit,
    FaTrash,
    FaShoppingCart,
    FaClock,
    FaCog,
    FaCheckCircle,
    FaTimesCircle,
    FaMoneyBillWave,
    FaUser,
} from "react-icons/fa";

import "./OrdersPage.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders, deleteOrder } from "@/redux/action/orderAction";
import Loading from "@/Components/Common/Loding/Loading";

const OrdersPage = () => {

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [paymentStatus, setPaymentStatus] = useState("All");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
   
    const dispatch = useDispatch();

    const {
        orders,
        isLoading,
        isError,
        errorMessage,
    } = useSelector((state) => state.orderStore);

    useEffect(() => {

        dispatch(getOrders());

    }, [dispatch]);

    if (isLoading) {
        return <Loading />;
    }


    const adminOrders = orders.map((order) => ({
        id: order._id,

        customer:
            order.user?.profileName ||
            order.shippingAddress?.fullName ||
            "Unknown User",

        email:
            order.user?.email || "",

        profileImage:
            order.user?.profileImage || "",

        products:
            order.items?.reduce(
                (total, item) =>
                    total + item.quantity,
                0
            ) || 0,

        amount:
            order.totalAmount || 0,

        payment:
            order.paymentStatus
                ? order.paymentStatus
                    .charAt(0)
                    .toUpperCase() +
                order.paymentStatus.slice(1)
                : "Pending",

        status:
            order.orderStatus
                ? order.orderStatus
                    .charAt(0)
                    .toUpperCase() +
                order.orderStatus.slice(1)
                : "Pending",

        date:
            order.createdAt
                ? new Date(order.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }
                )
                : "-",
    }));


    /* =========================================
       FILTER ORDERS
    ========================================= */

    const filteredOrders = adminOrders.filter((order) => {

        const searchMatch =
            order.id.toLowerCase().includes(search.toLowerCase()) ||
            order.id.slice(-8).toLowerCase().includes(search.toLowerCase()) ||
            order.customer.toLowerCase().includes(search.toLowerCase()) ||
            order.email.toLowerCase().includes(search.toLowerCase());

        const statusMatch =
            status === "All" ||
            order.status === status;


        const paymentMatch =
            paymentStatus === "All" ||
            order.payment === paymentStatus;


        return (
            searchMatch &&
            statusMatch &&
            paymentMatch
        );

    });


    /* =========================================
       STATS
    ========================================= */

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) => order.orderStatus === "pending"
    ).length;

    const processingOrders = orders.filter(
        (order) => order.orderStatus === "processing"
    ).length;

    const deliveredOrders = orders.filter(
        (order) => order.orderStatus === "delivered"
    ).length;

    const cancelledOrders = orders.filter(
        (order) => order.orderStatus === "cancelled"
    ).length;

    /* =========================================
       DELETE
    ========================================= */

    const openDeleteModal = (orderId) => {

        setSelectedOrderId(orderId);
        setShowDeleteModal(true);

    };


    const handleDelete = async () => {
        console.log("hello")
        if (!selectedOrderId) return;

        try {
            await dispatch(
                deleteOrder(selectedOrderId)
            ).unwrap();

            setShowDeleteModal(false);
            setSelectedOrderId(null);

        } catch (error) {
            console.error("DELETE ORDER ERROR:", error);

            alert(
                error || "Failed to delete order"
            );
        }
    };


    return (

        <div className="orders-page">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="orders-heading">

                <div>

                    <h1>
                        Orders
                    </h1>

                    <p>
                        Manage and track customer orders
                    </p>

                </div>


                <button className="export-orders-btn">

                    <FaShoppingCart />

                    Export Orders

                </button>

            </div>



            {/* =========================================
                STATS
            ========================================= */}

            <div className="order-stats">


                {/* Total */}

                <div className="order-stat-card">

                    <div className="order-stat-icon blue">

                        <FaShoppingCart />

                    </div>

                    <div>

                        <span>
                            Total Orders
                        </span>

                        <h2>
                            {totalOrders}
                        </h2>

                    </div>

                </div>



                {/* Pending */}

                <div className="order-stat-card">

                    <div className="order-stat-icon orange">

                        <FaClock />

                    </div>

                    <div>

                        <span>
                            Pending
                        </span>

                        <h2>
                            {pendingOrders}
                        </h2>

                    </div>

                </div>



                {/* Processing */}

                <div className="order-stat-card">

                    <div className="order-stat-icon purple">

                        <FaCog />

                    </div>

                    <div>

                        <span>
                            Processing
                        </span>

                        <h2>
                            {processingOrders}
                        </h2>

                    </div>

                </div>



                {/* Delivered */}

                <div className="order-stat-card">

                    <div className="order-stat-icon green">

                        <FaCheckCircle />

                    </div>

                    <div>

                        <span>
                            Delivered
                        </span>

                        <h2>
                            {deliveredOrders}
                        </h2>

                    </div>

                </div>



                {/* Cancelled */}

                <div className="order-stat-card">

                    <div className="order-stat-icon red">

                        <FaTimesCircle />

                    </div>

                    <div>

                        <span>
                            Cancelled
                        </span>

                        <h2>
                            {cancelledOrders}
                        </h2>

                    </div>

                </div>


            </div>



            {/* =========================================
                ORDERS CARD
            ========================================= */}

            <div className="orders-card">


                {/* FILTERS */}

                <div className="orders-filters">


                    {/* Search */}

                    <div className="orders-search">

                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search order ID, customer..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>



                    {/* Status */}

                    <select
                        className="order-filter-select"
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >

                        <option value="All">
                            All Status
                        </option>

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Processing">
                            Processing
                        </option>

                        <option value="Delivered">
                            Delivered
                        </option>

                        <option value="Cancelled">
                            Cancelled
                        </option>

                    </select>



                    {/* Payment */}

                    <select
                        className="order-filter-select"
                        value={paymentStatus}
                        onChange={(e) =>
                            setPaymentStatus(e.target.value)
                        }
                    >

                        <option value="All">
                            All Payment
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

                    </select>


                </div>



                {/* =========================================
                    TABLE
                ========================================= */}

                <div className="orders-table-container">

                    <table className="orders-table">


                        <thead>

                            <tr>

                                <th>
                                    Order
                                </th>

                                <th>
                                    Customer
                                </th>

                                <th>
                                    Products
                                </th>

                                <th>
                                    Amount
                                </th>

                                <th>
                                    Payment
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>



                        <tbody>


                            {filteredOrders.length > 0 ? (

                                filteredOrders.map((order) => (

                                    <tr key={order.id}>


                                        {/* ORDER */}

                                        <td>

                                            <div className="order-id">

                                                <strong>
                                                    #{order.id?.slice(-8).toUpperCase()}
                                                </strong>

                                                <span>
                                                    Order ID
                                                </span>

                                            </div>

                                        </td>



                                        {/* CUSTOMER */}

                                        <td>

                                            <div className="order-customer">

                                                {order.profileImage ? (
                                                    <img
                                                        src={order.profileImage}
                                                        alt={order.customer}
                                                        className="customer-avatar-img"
                                                    />
                                                ) : (
                                                    <div className="customer-avatar customer-avatar-fallback">
                                                        <FaUser />
                                                    </div>
                                                )}

                                                <div>
                                                    <strong>
                                                        {order.customer}
                                                    </strong>

                                                    <span>
                                                        {order.email}
                                                    </span>
                                                </div>

                                            </div>

                                        </td>



                                        {/* PRODUCTS */}

                                        <td>

                                            <span className="order-products">

                                                {order.products}

                                                {" "}

                                                {order.products === 1
                                                    ? "Item"
                                                    : "Items"
                                                }

                                            </span>

                                        </td>



                                        {/* AMOUNT */}

                                        <td>

                                            <strong className="order-amount">

                                                ₹
                                                {Number(
                                                    order.amount
                                                ).toLocaleString("en-IN")}

                                            </strong>

                                        </td>



                                        {/* PAYMENT */}

                                        <td>

                                            <span
                                                className={`payment-badge ${order.payment.toLowerCase()}`}
                                            >

                                                <FaMoneyBillWave />

                                                {order.payment}

                                            </span>

                                        </td>



                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={`order-status ${order.status.toLowerCase()}`}
                                            >

                                                {order.status === "Delivered" && (
                                                    <FaCheckCircle />
                                                )}

                                                {order.status === "Processing" && (
                                                    <FaCog />
                                                )}

                                                {order.status === "Pending" && (
                                                    <FaClock />
                                                )}

                                                {order.status === "Cancelled" && (
                                                    <FaTimesCircle />
                                                )}

                                                {order.status}

                                            </span>

                                        </td>



                                        {/* DATE */}

                                        <td>

                                            <span className="order-date">

                                                {order.date}

                                            </span>

                                        </td>



                                        {/* ACTIONS */}

                                        <td>

                                            <div className="order-actions">


                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="order-action-btn view"
                                                    title="View"
                                                >

                                                    <FaEye />

                                                </Link>



                                                <Link
                                                    href={`/admin/orders/update/${order.id}`}
                                                    className="order-action-btn edit"
                                                    title="Edit"
                                                >

                                                    <FaEdit />

                                                </Link>



                                               

                                              
                                                    <button
                                                        type="button"
                                                        className="order-action-btn delete"
                                                        title="Delete"
                                                        onClick={() => openDeleteModal(order.id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                     


                                            </div>

                                        </td>


                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="no-orders"
                                    >

                                        <FaShoppingCart />

                                        <strong>
                                            No orders found
                                        </strong>

                                        <span>
                                            Try changing your search or filters.
                                        </span>

                                    </td>

                                </tr>

                            )}


                        </tbody>


                    </table>

                </div>



                {/* =========================================
                    DELETE MODAL
                ========================================= */}

                {showDeleteModal && (

                    <div className="order-delete-modal-overlay">


                        <div className="order-delete-modal">


                            <div className="order-delete-modal-icon">

                                <FaTrash />

                            </div>


                            <h2>
                                Delete Order?
                            </h2>


                            <p>

                                Are you sure you want to delete this order?

                                <br />

                                This action cannot be undone.

                            </p>


                            <div className="order-delete-modal-actions">


                                <button
                                    type="button"
                                    className="order-cancel-delete-btn"
                                    onClick={() => {

                                        setShowDeleteModal(false);
                                        setSelectedOrderId(null);

                                    }}
                                >

                                    Cancel

                                </button>


                                <button
                                    type="button"
                                    className="order-confirm-delete-btn"
                                    onClick={handleDelete}
                                >

                                    <FaTrash />

                                    Delete Order

                                </button>


                            </div>


                        </div>

                    </div>

                )}


            </div>


        </div>

    );

};


export default OrdersPage;
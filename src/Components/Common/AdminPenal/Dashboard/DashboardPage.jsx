"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    FaDollarSign,
    FaShoppingCart,
    FaBoxOpen,
    FaUsers,
    FaArrowUp,
    FaArrowDown,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
    FaEye,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";

import {
    getDashboardData
} from "@/redux/action/adminAction";
import {
    CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import "./DashboardPage.css";
import Loading from "../../Loding/Loading";


const DashboardPage = () => {

    const dispatch = useDispatch();

    const {
        dashboard,
        isLoading,
        isError,
    } = useSelector(
        (state) => state.adminStore
    );


    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const currentDate = new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date());


    // =========================
    // DASHBOARD DATA
    // =========================

    const {
        stats: dashboardStats,
        orderStatus: dashboardOrderStatus,
        recentOrders: dashboardRecentOrders,
        topProducts: dashboarTopProducts,
        lowStockProducts: dashboardLowStockProducts,
        salesOverview: dashboardSalesOverview,
    } = dashboard;


    // =========================
    // FILTER 7 DAYS SALES
    // =========================

    const filteredSales = (dashboardSalesOverview || []).map((item) => {
        const date = new Date(`${item.date}T00:00:00+05:30`);

        return {
            date: item.date,
            label: date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
            }),
            revenue: Number(item.revenue) || 0,
        };
    });
    // =========================
    // GET DASHBOARD DATA
    // =========================

    useEffect(() => {

        dispatch(getDashboardData(selectedDate));

    }, [dispatch, selectedDate]);

    if (isLoading) {
        return <Loading />;
    }


    // =========================
    // STAT CARDS
    // =========================
    // const maxRevenue = Math.max(
    //     ...dashboardSalesOverview.map(
    //         (item) => Number(item.revenue) || 0
    //     ),
    //     1
    // );
    const maxRevenue = Math.max(
        ...filteredSales.map(
            (item) => Number(item.revenue) || 0
        ),
        1
    );
    const statCards = [

        {
            title: "Total Revenue",

            value: `₹${dashboardStats.totalRevenue.toLocaleString("en-IN")}`,

            change: "+12.5%",

            icon: <FaDollarSign />,

            positive: true,
        },


        {
            title: "Total Orders",

            value: dashboardStats.totalOrders,

            change: "+8.2%",

            icon: <FaShoppingCart />,

            positive: true,
        },


        {
            title: "Total Products",

            value: dashboardStats.totalProducts,

            change: "+4.5%",

            icon: <FaBoxOpen />,

            positive: true,
        },


        {
            title: "Total Users",

            value: dashboardStats.totalUsers,

            change: "+10.8%",

            icon: <FaUsers />,

            positive: true,
        },

    ];



    return (
        <div className="dashboard-page">

            {/* ================= HEADER ================= */}

            <div className="dashboard-heading">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back, Admin 👋</p>
                </div>

                <div className="dashboard-date">
                    <span>Today</span>
                    <strong>{currentDate}</strong>
                </div>
            </div>


            {/* ================= STATS ================= */}

            <div className="stats-grid">

                {statCards.map((item, index) => (
                    <div className="stat-card" key={index}>

                        <div className="stat-card-top">

                            <div className="stat-icon">
                                {item.icon}
                            </div>

                            <span
                                className={
                                    item.positive
                                        ? "growth positive"
                                        : "growth negative"
                                }
                            >
                                {item.positive ? (
                                    <FaArrowUp />
                                ) : (
                                    <FaArrowDown />
                                )}

                                {item.change}
                            </span>

                        </div>

                        <div className="stat-content">

                            <p>{item.title}</p>

                            <h2>{item.value}</h2>

                        </div>

                        <span className="stat-period">
                            Compared to last month
                        </span>

                    </div>
                ))}

            </div>


            {/* ================= CHART + ORDER STATUS ================= */}

            <div className="dashboard-two-column">

                {/* SALES CHART */}

                <div className="dashboard-card sales-card">

                    {/* <div className="card-header">

                        <div>
                            <h3>Sales Overview</h3>
                            <p>Monthly revenue performance</p>
                        </div>

                        <select>
                            <option>2026</option>
                            <option>2025</option>
                        </select>

                    </div> */}

                    <div className="card-header">
                        <div>
                            <h3>Sales Overview</h3>
                            <p>Daily revenue performance</p>
                        </div>

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}

                            className="sales-date-picker"
                        />
                    </div>

                    <div className="sales-chart">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                                data={filteredSales}
                                margin={{ top: 10, right: 15, left: 5, bottom: 5 }}
                            >
                                <CartesianGrid
                                    stroke="#edf1f7"
                                    strokeDasharray="4 4"
                                    vertical={true}
                                />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                                    axisLine={true}
                                    tickLine={true}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                                    axisLine={true}
                                    tickLine={true}
                                    width={58}
                                    tickFormatter={(value) =>
                                        `₹${value >= 1000
                                            ? `${(value / 1000).toFixed(1)}k`
                                            : value}`
                                    }
                                    domain={[0, "auto"]}
                                />
                                <Tooltip
                                    cursor={{ stroke: "#fecaca", strokeDasharray: "4 4" }}
                                    formatter={(value) => [
                                        `₹${Number(value).toLocaleString("en-IN")}`,
                                        "Revenue",
                                    ]}
                                    labelFormatter={(_, payload) =>
                                        payload?.[0]?.payload?.date || ""
                                    }
                                    contentStyle={{
                                        borderRadius: "10px",
                                        border: "1px solid #e5e7eb",
                                        fontSize: "12px",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    name="Revenue"
                                    stroke="#fa4602"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#ffffff", strokeWidth: 2 }}
                                    activeDot={{ r: 7, fill: "#fa4602", stroke: "#ffffff", strokeWidth: 3 }}
                                    connectNulls
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                </div>


                {/* ORDER STATUS */}

                <div className="dashboard-card order-status-card">

                    <div className="card-header">

                        <div>
                            <h3>Order Status</h3>
                            <p>Current order summary</p>
                        </div>

                        <FaShoppingCart className="header-card-icon" />

                    </div>

                    <div className="order-status-list">

                        <div className="status-row">

                            <div className="status-name">
                                <span className="status-icon pending">
                                    <FaClock />
                                </span>

                                <span>Pending</span>
                            </div>

                            <strong>{dashboardOrderStatus.pending}</strong>

                        </div>


                        <div className="status-row">

                            <div className="status-name">
                                <span className="status-icon processing">
                                    <FaBoxOpen />
                                </span>

                                <span>Processing</span>
                            </div>

                            <strong>{dashboardOrderStatus.processing}</strong>

                        </div>


                        <div className="status-row">

                            <div className="status-name">
                                <span className="status-icon delivered">
                                    <FaCheckCircle />
                                </span>

                                <span>Delivered</span>
                            </div>

                            <strong>{dashboardOrderStatus.delivered}</strong>

                        </div>


                        <div className="status-row">

                            <div className="status-name">
                                <span className="status-icon cancelled">
                                    <FaTimesCircle />
                                </span>

                                <span>Cancelled</span>
                            </div>

                            <strong>{dashboardOrderStatus.cancelled}</strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================= RECENT ORDERS ================= */}

            <div className="dashboard-card recent-orders-card">

                <div className="card-header">

                    <div>
                        <h3>Recent Orders</h3>
                        <p>Latest customer orders</p>
                    </div>

                    <button className="view-all-btn">
                        View All
                    </button>

                </div>


                <div className="table-responsive">

                    <table className="orders-table">

                        <thead>

                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>

                        </thead>



                        <tbody>

                            {dashboardRecentOrders.map((order, index) => (

                                <tr key={order._id || index}>


                                    <td>
                                        <strong>
                                            #{order._id?.slice(-8).toUpperCase()}
                                        </strong>
                                    </td>


                                    <td>
                                        {order.user?.profileName || "Unknown User"}
                                    </td>



                                    <td>
                                        {order.items?.[0]?.productName || "No Product"}

                                        {order.items?.length > 1 && (
                                            <span style={{ marginLeft: "5px" }}>
                                                +{order.items.length - 1} more
                                            </span>
                                        )}
                                    </td>



                                    <td>
                                        <strong>
                                            ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                                        </strong>
                                    </td>


                                    <td>

                                        <span
                                            className={`payment-badge ${order.paymentStatus?.toLowerCase()
                                                }`}
                                        >
                                            {order.paymentStatus === "paid"
                                                ? "Paid"
                                                : order.paymentStatus === "failed"
                                                    ? "Failed"
                                                    : "Pending"}
                                        </span>

                                    </td>



                                    <td>

                                        <span
                                            className={`order-badge ${order.orderStatus?.toLowerCase()
                                                }`}
                                        >
                                            {order.orderStatus
                                                ? order.orderStatus.charAt(0).toUpperCase() +
                                                order.orderStatus.slice(1)
                                                : "Pending"}
                                        </span>

                                    </td>



                                    <td>

                                        {/* <button className="view-btn">
                                            <FaEye />
                                        </button> */}


                                        <Link
                                            href={`/admin/orders/${order._id}`}
                                            className="view-btn"
                                            title="View"
                                        >
                                            <FaEye />
                                        </Link>

                                    </td>

                                </tr>

                            ))}

                        </tbody>


                    </table>

                </div>

            </div>


            {/* ================= BOTTOM SECTION ================= */}

            <div className="dashboard-bottom-grid">

                {/* TOP PRODUCTS */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>
                            <h3>Top Selling Products</h3>
                            <p>Best performing products</p>
                        </div>

                    </div>

                    <div className="top-products-list">

                        {dashboarTopProducts.map((product, index) => (

                            <div className="product-row" key={product._id || index}>

                                <div className="product-number">
                                    {index + 1}
                                </div>

                                <div className="product-details">

                                    <strong>
                                        {product.name || "Unknown Product"}
                                    </strong>

                                    <span>
                                        {product.sold} sold
                                    </span>

                                </div>

                                <strong className="product-revenue">
                                    ₹{Number(product.revenue || 0).toLocaleString("en-IN")}
                                </strong>

                            </div>

                        ))}

                    </div>
                </div>


                {/* LOW STOCK */}

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>
                            <h3>Low Stock Products</h3>
                            <p>Products that need attention</p>
                        </div>

                        <FaExclamationTriangle className="warning-icon" />

                    </div>


                    {/* <div className="low-stock-list">

                        {lowStockCards.map((product, index) => (

                            <div className="stock-row" key={index}>

                                <div className="stock-product">

                                    <div className="stock-product-icon">
                                        <FaBoxOpen />
                                    </div>

                                    <div>
                                        <strong>{product.name}</strong>
                                        <span>Only {product.stock} left</span>
                                    </div>

                                </div>

                                <span className="stock-warning">
                                    Low Stock
                                </span>

                            </div>

                        ))}

                    </div> */}

                    <div className="low-stock-list">

                        {dashboardLowStockProducts.map((product, index) => (

                            <div className="stock-row" key={product._id || index}>

                                <div className="stock-product">

                                    <div className="stock-product-icon">
                                        <FaBoxOpen />
                                    </div>

                                    <div>
                                        <strong>
                                            {product.productName || "Unknown Product"}
                                        </strong>

                                        <span>
                                            Only {product.stock} left
                                        </span>
                                    </div>

                                </div>

                                <span className="stock-warning">
                                    Low Stock
                                </span>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default DashboardPage;
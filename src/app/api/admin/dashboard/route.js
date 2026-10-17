import { NextResponse } from "next/server";

import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";

import User from "@/lib/model/user";
import Product from "@/lib/model/product";
import Order from "@/lib/model/order";

export async function GET(request) {
    try {
        await dbConnect();

        // =========================
        // ADMIN AUTHENTICATION
        // =========================

        const user = await verifyToken(request);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login first",
                },
                {
                    status: 401,
                }
            );
        }

        if (user.role !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Admin access required",
                },
                {
                    status: 403,
                }
            );
        }

        // =========================
        // BASIC COUNTS
        // =========================

        const totalUsers = await User.countDocuments({
            role: "user",
        });

        const totalProducts = await Product.countDocuments();

        const totalOrders = await Order.countDocuments();

        // =========================
        // TOTAL REVENUE
        // Only PAID orders
        // =========================

        const revenueResult = await Order.aggregate([
            {
                $match: {
                    paymentStatus: "paid",
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount",
                    },
                },
            },
        ]);

        const totalRevenue =
            revenueResult[0]?.totalRevenue || 0;

        // =========================
        // ORDER STATUS
        // =========================

        const orderStatusResult = await Order.aggregate([
            {
                $group: {
                    _id: "$orderStatus",
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);

        const orderStatus = {
            pending: 0,
            confirmed: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
        };

        orderStatusResult.forEach((item) => {
            if (orderStatus[item._id] !== undefined) {
                orderStatus[item._id] = item.count;
            }
        });

        // =========================
        // RECENT ORDERS
        // =========================

        const recentOrders = await Order.find()
    .populate("user", "profileName email")
            .sort({
                createdAt: -1,
            })
            .limit(5)
            .lean();

        // =========================
        // TOP SELLING PRODUCTS
        // =========================

        const topProducts = await Order.aggregate([
            {
                $match: {
                    paymentStatus: "paid",
                },
            },

            {
                $unwind: "$items",
            },

            {
                $group: {
                    _id: "$items.product",

                    name: {
                        $first: "$items.productName",
                    },

                    sold: {
                        $sum: "$items.quantity",
                    },

                    revenue: {
                        $sum: {
                            $multiply: [
                                "$items.price",
                                "$items.quantity",
                            ],
                        },
                    },
                },
            },

            {
                $sort: {
                    sold: -1,
                },
            },

            {
                $limit: 4,
            },
        ]);

        // =========================
        // LOW STOCK PRODUCTS
        // =========================

        const lowStockProducts = await Product.find({
            stock: {
                $lte: 5,
            },
            status: "active",
        })
            .sort({
                stock: 1,
            })
            .limit(4)
            .select("productName stock");

        // ==============================
        // DAILY SALES - LAST 7 DAYS
        // ==============================

        const today = new Date();

        today.setHours(23, 59, 59, 999);

        const sevenDaysAgo = new Date(today);

        sevenDaysAgo.setDate(today.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const salesResult = await Order.aggregate([
            {
                $match: {
                    paymentStatus: "paid",
                    orderStatus: { $ne: "cancelled" },
                    createdAt: {
                        $gte: sevenDaysAgo,
                        $lte: today,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                            timezone: "Asia/Kolkata",
                        },
                    },
                    revenue: {
                        $sum: "$totalAmount",
                    },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]);

        const salesMap = {};

        salesResult.forEach((item) => {
            salesMap[item._id] = item.revenue;
        });

        const salesOverview = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();

            date.setDate(date.getDate() - i);

            const dateString = date.toLocaleDateString("en-CA", {
                timeZone: "Asia/Kolkata",
            });

            salesOverview.push({
                date: dateString,
                revenue: salesMap[dateString] || 0,
            });
            }

        // =========================
        // RESPONSE
        // =========================

        return NextResponse.json(
            {
                success: true,

                stats: {
                    totalUsers,
                    totalProducts,
                    totalOrders,
                    totalRevenue,
                },

                orderStatus,

                recentOrders,

                topProducts,

                lowStockProducts,

                salesOverview,
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(
            "ADMIN DASHBOARD ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to get dashboard data",
            },
            {
                status: 500,
            }
        );
    }
}
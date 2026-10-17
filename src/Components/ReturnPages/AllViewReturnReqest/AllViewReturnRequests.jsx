"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getAllReturnRequest } from "@/redux/action/returnAction";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaCalendarAlt,
  FaChevronRight,
  FaClock,
  FaUndoAlt,
} from "react-icons/fa";
import "./AllViewReturnRequests.css";
import Loading from "@/Components/Common/Loding/Loading";
import { useRouter } from "next/navigation";

const formatDate = (date) => {
  if (!date) return "Date not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeStatus = (status = "Pending") => {
  const normalized = String(status).toLowerCase().trim();

  const statusMap = {
    pending: "Pending",
    approved: "Approved",
    "pickup scheduled": "Pickup Scheduled",
    "item received": "Item Received",
    "refund processing": "Refund Processing",
    refunded: "Refunded",
    rejected: "Rejected",
  };

  return statusMap[normalized] || status;
};

const getProductImage = (product) => {
  if (!product) return "";

  const image =
    product.image ||
    product.imageUrl ||
    product.thumbnail ||
    product.images?.[0];

  if (typeof image === "string") return image;

  return image?.url || image?.secure_url || "";
};

const normalizeReturnRequests = (requests = []) => {
  if (!Array.isArray(requests)) return [];

  return requests.flatMap((request) => {
    const items =
      Array.isArray(request.items) && request.items.length
        ? request.items
        : [request];

    return items.map((item, index) => {
      const product =
        item.productId && typeof item.productId === "object"
          ? item.productId
          : item.product && typeof item.product === "object"
            ? item.product
            : {};

      const order = request.orderId;

      const orderId =
        order && typeof order === "object"
          ? order._id?.toString() ||
          order.orderId?.toString() ||
          order.orderNumber ||
          "N/A"
          : order?.toString() || "N/A";

      const status = normalizeStatus(
        request.status || request.returnStatus
      );

      return {
        rowId: `${request._id}-${index}`,
        _id: String(request._id || ""),
        orderId,

        productName:
          product.productName ||
          product.name ||
          product.title ||
          item.productName ||
          request.productName ||
          "Product",

        productImage:
          getProductImage(product) ||
          item.productImage ||
          request.productImage ||
          "",

        quantity: item.quantity ?? request.quantity ?? 1,

        price:
          item.price ??
          product.price ??
          request.price ??
          0,

        reason:
          item.reason ||
          request.reason ||
          request.returnReason ||
          "Not specified",

        notes: request.notes || request.description || "",

        requestDate: formatDate(
          request.createdAt || request.requestDate
        ),

        status,

        adminNote:
          request.adminNote ||
          request.adminRemarks ||
          request.rejectionReason ||
          "",

          refundAmount:
            item.refundAmount ??
            item.totalRefundAmount ??
            request.totalRefundAmount ??
            request.refundAmount ??
            request.refund?.amount ??
            0,
         
      };
    });
  });
};

const statusClass = (status = "") =>
  status.toLowerCase().replace(/\s+/g, "-");

export default function AllViewReturnRequests() {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    returnRequests = [],
    isLoading,
    isError,
    errorMessage,
  } = useSelector((state) => state.returnStore);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    dispatch(getAllReturnRequest());
  }, [dispatch]);

  const returns = normalizeReturnRequests(returnRequests);
  console.log("RETURN REQUESTS API DATA:", returnRequests);
  const filteredReturns = returns.filter((item) => {
    const query = search.toLowerCase();

    const matchesSearch =
      item.productName.toLowerCase().includes(query) ||
      item.orderId.toLowerCase().includes(query) ||
      item._id.toLowerCase().includes(query);

    const matchesStatus =
      filter === "All" || item.status === filter;

    return matchesSearch && matchesStatus;
  });

  const getStatusMessage = (item) => {
    if (item.status === "Rejected") {
      return item.adminNote || "Your return request was rejected.";
    }

    if (item.status === "Pending") {
      return "Your request is waiting for the admin's review.";
    }

    if (item.status === "Approved") {
      return (
        item.adminNote ||
        "Your return is approved. Follow the next instructions for returning the item."
      );
    }

    if (item.status === "Refunded") {
      return item.adminNote || "Your refund has been completed.";
    }

    return item.adminNote || "Your return is being processed.";
  };

  const handleViewDetails = (item) => {
    const id = item._id;

    if (!id || id === "Return request") {
      console.error("Return request ID is missing:", item);
      return;
    }

    router.push(`/return-request/details/${id}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="user-returns-page">
      <div className="user-returns-container">
        <Link href="/orders" className="ur-back-link">
          <FaArrowLeft /> Back to My Orders
        </Link>

        <header className="ur-page-heading">
          <div className="ur-heading-icon">
            <FaUndoAlt />
          </div>

          <div>
            <h1>My Return Requests</h1>
            <p>
              View your return requests and track their latest updates.
            </p>
          </div>
        </header>

        <div className="ur-toolbar">
          <div className="ur-search">
            <span aria-hidden="true">⌕</span>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product, order or return ID"
              aria-label="Search return requests"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter return requests by status"
            className="ur-filter"
          >
            <option value="All">All return requests</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Pickup Scheduled">Pickup Scheduled</option>
            <option value="Item Received">Item Received</option>
            <option value="Refund Processing">Refund Processing</option>
            <option value="Refunded">Refunded</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {isError && (
          <p>{errorMessage || "Failed to load return requests."}</p>
        )}

        <div className="ur-list-heading">
          <h2>Your returned products</h2>
          <span>{filteredReturns.length} requests</span>
        </div>

        {filteredReturns.length > 0 ? (
          <div className="ur-product-list">
            {filteredReturns.map((item) => (
              <article className="ur-product-card" key={item.rowId}>
                <div className="ur-product-image">
                  {item.productImage && (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}

                  <FaBoxOpen className="ur-image-fallback" />
                </div>

                <div className="ur-product-info">
                  <div className="ur-product-topline">
                    <span className="ur-return-id">{item._id}</span>

                    <span
                      className={`ur-status ${statusClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3>{item.productName}</h3>

                  <p className="ur-order-id">
                    Order ID: {item.orderId}
                  </p>

                  <div className="ur-product-meta">
                    <span>Qty: {item.quantity}</span>

                    <span>
                      ₹
                      {Number(item.refundAmount || 0).toLocaleString("en-IN")}
                      {" "}refund
                    </span>

                    <span>
                      <FaCalendarAlt /> {item.requestDate}
                    </span>
                  </div>

                  <p className="ur-latest-update">
                    <FaClock /> {getStatusMessage(item)}
                  </p>

                  <button
                    type="button"
                    className="ur-details-btn"
                    onClick={() => handleViewDetails(item)}
                    disabled={!item._id}
                  >
                    View Details &amp; Track <FaChevronRight />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="ur-empty">
            <FaBoxOpen />

            <h3>No return requests found</h3>

            <p>
              {search || filter !== "All"
                ? "Try changing your search or status filter."
                : "Your return requests will appear here once you submit one."}
            </p>

            {search || filter !== "All" ? (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                }}
              >
                Clear Filters
              </button>
            ) : (
              <Link href="/orders">Go to My Orders</Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
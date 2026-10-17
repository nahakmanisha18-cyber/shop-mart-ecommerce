"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getAllReturnRequest } from "@/redux/action/returnAction";
import Loading from "@/Components/Common/Loding/Loading";
import {
  FaUndo,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaSearch,
  FaEye,
  FaEdit,
  FaSyncAlt,
  FaBoxOpen,
} from "react-icons/fa";

import "./AdminReturnRequests.css";

const AdminReturnRequests = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const {
    returnRequests = [],
    isLoading = false,
    isError = false,
    errorMessage = "",
  } = useSelector((state) => state.returnStore);

  // Ensure the component always works with an array.
  const returns = Array.isArray(returnRequests)
    ? returnRequests
    : [];

  useEffect(() => {
    dispatch(getAllReturnRequest());
  }, [dispatch]);

  const error = isError
    ? errorMessage || "Failed to load return requests."
    : "";

  // Get ID from a string or populated MongoDB object.
  const getId = (value) => {
    if (!value) return "";

    if (typeof value === "object") {
      return String(value._id || value.id || "");
    }

    return String(value);
  };



  const formatReturnId = (id) => {
    const value = String(id || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    if (!value) return "—";

    return `#${value.slice(-8)}`;
  };
  

  // Normalize status values from the database.
  const getStatus = (item) => {
    const status = String(item?.status || "pending")
      .trim()
      .toLowerCase()
      .replace(/_/g, " ");

    return status === "received" ? "return received" : status;
  };

  // Search and filters.
  const filteredReturns = useMemo(() => {
    const query = search.trim().toLowerCase();

    return returns.filter((item) => {
      const orderId = getId(item.orderId);

      const customer =
        item.userId?.profileName ||
        item.userId?.name ||
        item.userId?.fullName ||
        item.userId?.email ||
        "";

      const productNames = (Array.isArray(item.items) ? item.items : [])
        .map(
          (entry) =>
            entry.productId?.name ||
            entry.productId?.title ||
            entry.productName ||
            ""
        )
        .join(" ");

      const searchable = [
        item.returnId,
        item._id,
        orderId,
        customer,
        item.userId?.email,
        item.reason,
        productNames,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchable.includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        getStatus(item) === statusFilter;

      const matchesType =
        typeFilter === "all" ||
        String(item.returnType || "").toLowerCase() === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [returns, search, statusFilter, typeFilter]);

  // Dashboard statistics.
  const counts = useMemo(() => {
    const countStatus = (status) =>
      returns.filter((item) => getStatus(item) === status).length;

    return {
      total: returns.length,
      pending: countStatus("pending"),
      approved: countStatus("approved"),
      rejected: countStatus("rejected"),
      refunded: countStatus("refunded"),
    };
  }, [returns]);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatMoney = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")} `;

  const statusLabel = (status) => {
    const labels = {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      "return received": "Return Received",
      "refund processing": "Refund Processing",
      refunded: "Refunded",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return (
      labels[status] ||
      status.replace(/\b\w/g, (char) => char.toUpperCase())
    );
  };

  const getItemName = (entry) =>
    entry.productId?.name ||
    entry.productId?.title ||
    entry.productName ||
    "Product";

  const getItemCount = (item) =>
    (Array.isArray(item.items) ? item.items : []).reduce(
      (total, entry) => total + Number(entry.quantity || 1),
      0
    );

  if (isLoading) {
    return <Loading />;
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


  return (
    <main className="return-page">
      <div className="return-page-header">
        <div>
          <h1>Return Requests</h1>
          <p>Manage customer returns and track refund requests</p>
        </div>

        <button
          type="button"
          className="return-refresh-btn"
          onClick={() => dispatch(getAllReturnRequest())}
          disabled={isLoading}
        >
          <FaSyncAlt className={isLoading ? "spin-icon" : ""} />
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <section className="return-stats">
        <div className="return-stat-card">
          <div className="return-stat-icon orange">
            <FaUndo />
          </div>
          <div>
            <p>Total Returns</p>
            <h2>{counts.total}</h2>
          </div>
        </div>

        <div className="return-stat-card">
          <div className="return-stat-icon yellow">
            <FaClock />
          </div>
          <div>
            <p>Pending</p>
            <h2>{counts.pending}</h2>
          </div>
        </div>

        <div className="return-stat-card">
          <div className="return-stat-icon purple">
            <FaCheckCircle />
          </div>
          <div>
            <p>Approved</p>
            <h2>{counts.approved}</h2>
          </div>
        </div>

        <div className="return-stat-card">
          <div className="return-stat-icon red">
            <FaTimesCircle />
          </div>
          <div>
            <p>Rejected</p>
            <h2>{counts.rejected}</h2>
          </div>
        </div>

        <div className="return-stat-card">
          <div className="return-stat-icon green">
            <FaMoneyBillWave />
          </div>
          <div>
            <p>Refunded</p>
            <h2>{counts.refunded}</h2>
          </div>
        </div>
      </section>

      <section className="return-table-card">
        <div className="return-filters">
          <div className="return-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search return ID, order ID, customer..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="return received">Return Received</option>
            <option value="refund processing">Refund Processing</option>
            <option value="refunded">Refunded</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="Filter by return type"
          >
            <option value="all">All Return Types</option>
            <option value="full">Full Return</option>
            <option value="partial">Partial Return</option>
          </select>
        </div>

        {isError && (
          <div className="return-error">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => dispatch(getAllReturnRequest())}
              disabled={isLoading}
            >
              Try Again
            </button>
          </div>
        )}

        <div className="return-table-scroll">
          <table className="return-table">
            <thead>
              <tr>
                <th>RETURN</th>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>PRODUCTS</th>
                <th>REFUND AMOUNT</th>
                <th>REASON</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredReturns.map((item) => {
                  const returnKey = getId(item._id) || item.returnId;
                  const orderId = getId(item.orderId);

                  const customerName =
                    item.userId?.profileName ||
                    item.userId?.name ||
                    item.userId?.fullName ||
                    "Customer";

                  const customerEmail = item.userId?.email || "—";
                  const status = getStatus(item);
                  const firstProduct = (
                    Array.isArray(item.items) ? item.items : []
                  )[0];

                  return (
                    <tr key={returnKey}>
                      <td>
                        <strong
                          className="return-id"
                          title={item.returnId || returnKey || ""}
                        >
                          {formatReturnId(item.returnId || returnKey)}
                        </strong>
                        <small>Return ID</small>
                      </td>

                      <td>
                        <strong className="return-order-id">
                          {orderId
                            ? `#${orderId.slice(-8).toUpperCase()} `
                            : "—"}
                        </strong>
                        <small>Order ID</small>
                      </td>

                        <td>
                          <div className="return-customer">
                            <div className="return-avatar">
                              {item.userId?.profileImage ? (
                                <img
                                  src={item.userId.profileImage}
                                  alt={`${customerName}'s profile`}
                                  onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <span>{customerName.charAt(0).toUpperCase()}</span>
                              )}
                            </div>

                            <div>
                              <strong>{customerName}</strong>
                              <small>{customerEmail}</small>
                            </div>
                          </div>
                        </td>

                      <td>
                        <span className="return-product-count">
                          {getItemCount(item)}{" "}
                          {getItemCount(item) === 1 ? "Item" : "Items"}
                        </span>
                        <small className="return-product-name">
                          {firstProduct ? getItemName(firstProduct) : "—"}
                        </small>
                      </td>

                      <td>
                        <strong className="return-amount">
                          {formatMoney(item.totalRefundAmount)}
                        </strong>
                      </td>

                      <td>
                        <span className="return-reason">
                          {item.reason || "—"}
                        </span>
                      </td>

                      <td>
                        <span className={`return-status status-${status.replace(/\s+/g, "-")}`}>
                          {statusLabel(status)}
                        </span>
                      </td>

                      <td>
                        {formatDate(item.requestedAt || item.createdAt)}
                      </td>

                      <td>
                        <div className="return-actions">
                          <Link
                            href={`/admin/returns/details/${returnKey}`}
                            className="return-action-btn view"
                            title="View return"
                            aria-label="View return"
                          >
                            <FaEye />
                          </Link>

                          <Link
                            href={`/admin/returns/edit/${returnKey}`}
                            className="return-action-btn edit"
                            title="Update return"
                            aria-label="Update return"
                          >
                            <FaEdit />
                          </Link>
                        </div>
                      </td>

                    </tr >
                  );
                })
              }
            </tbody >
          </table >
        </div >

        
      </section >
    </main >
  );
};

export default AdminReturnRequests;
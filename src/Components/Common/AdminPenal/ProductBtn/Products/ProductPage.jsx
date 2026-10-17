"use client";

import Link from "next/link";
import {
    FaPlus,
    FaSearch,
    FaEye,
    FaEdit,
    FaTrash,
    FaBoxOpen,
    FaCheckCircle,
    FaExclamationTriangle,
    FaTimesCircle,
} from "react-icons/fa";

import "./ProductsPage.css";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getAllProducts } from "@/redux/action/productAction";

const ProductsPage = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [status, setStatus] = useState("All");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const dispatch = useDispatch();

    const {
        products,
        isLoading,
        isError,
    } = useSelector((state) => state.productStore);

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);


    // Search + Filter
    const filteredProducts = products.filter((product) => {
        const searchMatch = (product.productName || "")
            .toLowerCase()
            .includes(search.toLowerCase());

        const categoryMatch =
            category === "All" ||
            product.category?.toLowerCase() === category.toLowerCase();

        let statusMatch = true;

        if (status === "active") {
            statusMatch = product.status?.toLowerCase() === "active";
        }

        else if (status === "inactive") {
            statusMatch = product.status?.toLowerCase() === "inactive";
        }

        else if (status === "lowStock") {
            statusMatch =
                Number(product.stock) > 0 &&
                Number(product.stock) <= 5;
        }

        else if (status === "outOfStock") {
            statusMatch = Number(product.stock) === 0;
        }

        return searchMatch && categoryMatch && statusMatch;
    });
    // Stats
    const totalProducts = products.length;

    const activeProducts = products.filter(
        (product) => product.status === "active"
    ).length;

    const outOfStock = products.filter(
        (product) => product.stock === 0
    ).length;

    const lowStock = products.filter(
        (product) => product.stock > 0 && product.stock <= 5
    ).length;

    const openDeleteModal = (productId) => {
        setSelectedProductId(productId);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {

        if (!selectedProductId) {
            return;
        }

        const result = await dispatch(
            deleteProduct(selectedProductId)
        );

        if (deleteProduct.fulfilled.match(result)) {

            console.log("Product deleted successfully");

        } else {

            console.log(
                result.payload?.message ||
                "Failed to delete product"
            );
        }

        setShowDeleteModal(false);
        setSelectedProductId(null);
    };

    return (
        <div className="products-page">

            {isLoading && (
                <div className="product-loading-overlay">
                    <div className="product-loader"></div>
                    <p>Loading...</p>
                </div>
            )}

            {/* ================= HEADER ================= */}

            <div className="products-heading">

                <div>
                    <h1>Products</h1>
                    <p>Manage your store products</p>
                </div>

                <Link
                    href="/admin/products/addProduct"
                    className="add-product-btn"
                >
                    <FaPlus />
                    Add Product
                </Link>

            </div>


            {/* ================= STATS ================= */}

            <div className="product-stats">

                <div className="product-stat-card">

                    <div className="product-stat-icon blue">
                        <FaBoxOpen />
                    </div>

                    <div>
                        <span>Total Products</span>
                        <h2>{totalProducts}</h2>
                    </div>

                </div>


                <div className="product-stat-card">

                    <div className="product-stat-icon green">
                        <FaCheckCircle />
                    </div>

                    <div>
                        <span>Active Products</span>
                        <h2>{activeProducts}</h2>
                    </div>

                </div>


                <div className="product-stat-card">

                    <div className="product-stat-icon orange">
                        <FaExclamationTriangle />
                    </div>

                    <div>
                        <span>Low Stock</span>
                        <h2>{lowStock}</h2>
                    </div>

                </div>


                <div className="product-stat-card">

                    <div className="product-stat-icon red">
                        <FaTimesCircle />
                    </div>

                    <div>
                        <span>Out of Stock</span>
                        <h2>{outOfStock}</h2>
                    </div>

                </div>

            </div>


            {/* ================= PRODUCT CARD ================= */}

            <div className="products-card">

                {/* Filters */}

                <div className="product-filters">

                    <div className="product-search">

                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    <select
                        className="product-filter-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Mobiles">Mobiles</option>
                        <option value="Beauty">Beauty</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Home">Home</option>
                        <option value="Appliances">Appliances</option>
                        <option value="Toys">Toys</option>
                        <option value="Food">Food</option>
                        <option value="Auto">Auto</option>
                        <option value="2 Wheelers">2 Wheelers</option>
                        <option value="Sports">Sports</option>
                        <option value="Books">Books</option>
                        <option value="Furniture">Furniture</option>
                    </select>


                    <select
                        className="product-filter-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="lowStock">Low Stock</option>
                        <option value="outOfStock">Out of Stock</option>
                    </select>

                </div>


                {/* ================= TABLE ================= */}

                <div className="table-container">

                    <table className="products-table">

                        <thead>

                            <tr>

                                <th>Product</th>

                                <th>Category</th>

                                <th>Price</th>

                                <th>Stock</th>

                                <th>Status</th>

                                <th>Actions</th>

                            </tr>

                        </thead>


                        <tbody>

                            {isError ? (

                                <tr>
                                    <td colSpan="6" className="no-products">
                                        {isError}
                                    </td>
                                </tr>

                            ) : filteredProducts.length > 0 ? (

                                filteredProducts.map((product) => (
                                    <tr key={product._id}>

                                        <td>
                                            <div className="product-info">

                                                <div className="product-image">
                                                    <img
                                                        src={product.images?.[0] || "/images/no-image.png"}
                                                        alt={product.productName}
                                                    />
                                                </div>

                                                <div>
                                                    <strong>
                                                        {product.productName}
                                                    </strong>

                                                    <span>
                                                        {product.sku}
                                                    </span>
                                                </div>

                                            </div>
                                        </td>

                                        <td>
                                            {product.category}
                                        </td>

                                        <td>
                                            <strong>
                                                ₹{Number(product.price).toLocaleString("en-IN")}
                                            </strong>
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    product.stock === 0
                                                        ? "stock out"
                                                        : product.stock <= 5
                                                            ? "stock low"
                                                            : "stock"
                                                }
                                            >
                                                {product.stock}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    product.status === "active"
                                                        ? "status active"
                                                        : "status inactive"
                                                }
                                            >
                                                {product.status === "active"
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="product-actions">

                                                <Link
                                                    href={`/admin/products/${product._id}`}
                                                    className="action-btn view"
                                                    title="View"
                                                >
                                                    <FaEye />
                                                </Link>

                                                <Link
                                                    href={`/admin/products/updateProduct/${product._id}`}
                                                    className="action-btn edit"
                                                    title="Edit"
                                                    onClick={() => console.log(product._id)}
                                                >
                                                    <FaEdit />
                                                </Link>

                                                <button
                                                    className="action-btn delete"
                                                    title="Delete"
                                                    onClick={() => openDeleteModal(product._id)}
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
                                        colSpan="6"
                                        className="no-products"
                                    >
                                        No products found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                    {showDeleteModal && (
                        <div className="delete-modal-overlay">

                            <div className="delete-modal">

                                <div className="delete-modal-icon">
                                    <FaTrash />
                                </div>

                                <h2>Delete Product?</h2>

                                <p>
                                    Are you sure you want to delete this product?
                                    This action cannot be undone.
                                </p>

                                <div className="delete-modal-actions">

                                    <button
                                        type="button"
                                        className="cancel-delete-btn"
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setSelectedProductId(null);
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        className="confirm-delete-btn"
                                        onClick={handleDelete}
                                    >
                                        <FaTrash />
                                        Delete Product
                                    </button>

                                </div>

                            </div>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default ProductsPage;
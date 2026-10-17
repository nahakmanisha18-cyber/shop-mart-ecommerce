"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
    FaArrowLeft,
    FaBoxOpen,
    FaTag,
    FaWarehouse,
    FaBarcode,
    FaPalette,
    FaRuler,
    FaCheckCircle,
    FaTimesCircle,
    FaStar,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";

import { getProduct } from "@/redux/action/productAction";

import "./ProductDetailsPage.css";

const ProductDetailsPage = ({ productId }) => {

    const dispatch = useDispatch();

    const [selectedImage, setSelectedImage] = useState(null);

    const {
        product,
        isLoading,
        isError,
    } = useSelector((state) => state.productStore);


    useEffect(() => {

        if (productId) {
            dispatch(getProduct(productId));
        }

    }, [dispatch, productId]);


    if (isLoading) {
        return (
            <div className="product-loading-overlay">
                <div className="product-loader"></div>
                <p>Loading...</p>
            </div>
        );
    }


    if (isError) {

        return (
            <div className="product-details-error">
                {isError}
            </div>
        );

    }


    if (!product) {

        return (
            <div className="product-details-error">
                Product not found
            </div>
        );

    }


    return (

        <div className="product-details-page">

            {/* ================= HEADER ================= */}

            <div className="product-details-header">

                <div>

                    <Link
                        href="/admin/products"
                        className="back-products-btn"
                    >
                        <FaArrowLeft />
                        Back to Products
                    </Link>

                    <h1>
                        Product Details
                    </h1>

                    <p>
                        View complete product information
                    </p>

                </div>

            </div>


            {/* ================= PRODUCT MAIN CARD ================= */}

            <div className="product-main-card">

                {/* IMAGE SECTION */}

                <div className="product-details-image-section">

                    <div className="product-main-image">
                        <img
                            src={
                                selectedImage ||
                                product.images?.[0] ||
                                "/images/no-image.png"
                            }
                            alt={product.productName}
                        />

                    </div>


                    {/* Multiple Images */}

                    {product.images?.length > 1 && (

                        <div className="product-thumbnail-list">

                            {product.images.map(
                                (image, index) => (

                                    <div
                                        className="product-thumbnail"
                                        key={index}
                                        onClick={() => setSelectedImage(image)}
                                    >

                                        <img
                                            src={image}
                                            alt={`${product.productName} ${index + 1}`}
                                        />

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* PRODUCT INFORMATION */}

                <div className="product-details-info">

                    <div className="product-title-row">

                        <div>

                            <span className="product-category">
                                {product.category}
                            </span>

                            <h2>
                                {product.productName}
                            </h2>

                            <p className="product-sku">
                                SKU: {product.sku || "N/A"}
                            </p>

                        </div>


                        <span
                            className={
                                product.status === "active"
                                    ? "product-status active"
                                    : "product-status inactive"
                            }
                        >

                            {product.status === "active"
                                ? <FaCheckCircle />
                                : <FaTimesCircle />
                            }

                            {product.status}

                        </span>

                    </div>


                    {/* PRICE */}

                    <div className="product-price-section">

                        <span className="current-price">
                            ₹{Number(product.discountPrice || product.price).toLocaleString("en-IN")}
                        </span>

                        {product.discountPrice > 0 &&
                            Number(product.discountPrice) < Number(product.price) && (

                                <span className="original-price">
                                    ₹{Number(product.price).toLocaleString("en-IN")}
                                </span>

                            )
                        }

                    </div>


                    {/* DESCRIPTION */}

                    <div className="product-description">

                        <h3>
                            Description
                        </h3>

                        <p>
                            {product.description || "No description available."}
                        </p>

                    </div>


                    {/* PRODUCT INFO GRID */}

                    <div className="product-info-grid">

                        <div className="info-item">

                            <div className="info-icon">
                                <FaWarehouse />
                            </div>

                            <div>
                                <span>Stock</span>

                                <strong>
                                    {product.stock}
                                </strong>
                            </div>

                        </div>


                        <div className="info-item">

                            <div className="info-icon">
                                <FaTag />
                            </div>

                            <div>
                                <span>Brand</span>

                                <strong>
                                    {product.brand || "N/A"}
                                </strong>
                            </div>

                        </div>


                        <div className="info-item">

                            <div className="info-icon">
                                <FaRuler />
                            </div>

                            <div>
                                <span>Size</span>

                                <strong>
                                    {product.size || "N/A"}
                                </strong>
                            </div>

                        </div>


                        <div className="info-item">

                            <div className="info-icon">
                                <FaPalette />
                            </div>

                            <div>
                                <span>Color</span>

                                <strong>
                                    {product.color || "N/A"}
                                </strong>
                            </div>

                        </div>


                        <div className="info-item">

                            <div className="info-icon">
                                <FaBarcode />
                            </div>

                            <div>
                                <span>SKU</span>

                                <strong>
                                    {product.sku || "N/A"}
                                </strong>
                            </div>

                        </div>


                        <div className="info-item">

                            <div className="info-icon">
                                <FaBoxOpen />
                            </div>

                            <div>
                                <span>Category</span>

                                <strong>
                                    {product.category}
                                </strong>
                            </div>

                        </div>

                    </div>


                    {/* FEATURED */}

                    <div className="featured-product">

                        <div>

                            <FaStar />

                            <div>
                                <strong>
                                    Featured Product
                                </strong>

                                <span>
                                    {product.featured
                                        ? "This product is featured"
                                        : "This product is not featured"
                                    }
                                </span>
                            </div>

                        </div>

                        <span
                            className={
                                product.featured
                                    ? "featured-badge yes"
                                    : "featured-badge no"
                            }
                        >
                            {product.featured ? "Yes" : "No"}
                        </span>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default ProductDetailsPage;
"use client";

import React, { useEffect, useState } from "react";
import {
    FaArrowLeft,
    FaImage,
    FaTrash,
} from "react-icons/fa";
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";

import {
    getProduct,
    updateProduct,
} from "@/redux/action/productAction";

import {
    clearProductError,
} from "@/redux/slice/productSlice";

import { productValidate } from "@/utils/validate";
import { productImageUpload } from "@/services/product/productImageUpload";

import "./UpdateProdductForm.css";
import { useRouter } from "next/navigation";


const UpdateProductForm = ({ productId }) => {

    const initialState = {
        productName: "",
        category: "",
        brand: "",
        description: "",
        price: "",
        discountPrice: "",
        stock: "",
        sku: "",
        size: "",
        color: "",
        status: "active",
        featured: false,
    };


    const [formData, setFormData] = useState(initialState);

    const [errors, setErrors] = useState({});


    const [existingImages, setExistingImages] = useState([]);


    const [newImages, setNewImages] = useState([]);


    const dispatch = useDispatch();

    const router = useRouter()

    const {
        product,
        isLoading,
        isError,
    } = useSelector(
        (state) => state.productStore
    );


    useEffect(() => {

        if (productId) {
            dispatch(getProduct(productId));
        }

    }, [dispatch, productId]);

    useEffect(() => {

        if (product) {

            setFormData({
                productName: product.productName || "",
                category: product.category || "",
                brand: product.brand || "",
                description: product.description || "",
                price: product.price || "",
                discountPrice: product.discountPrice || "",
                stock: product.stock || "",
                sku: product.sku || "",
                size: product.size || "",
                color: product.color || "",
                status: product.status || "active",
                featured: product.featured || false,
            });


            setExistingImages(
                product.images || []
            );

        }

    }, [product]);

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;


        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));


        dispatch(clearProductError());

    };


    const handleImageChange = (e) => {

        const files = Array.from(
            e.target.files
        );


        setNewImages((prev) => [
            ...prev,
            ...files,
        ]);

    };


    const removeExistingImage = (index) => {

        setExistingImages((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        );

    };


    const removeNewImage = (index) => {

        setNewImages((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        );

    };


    const handleSubmit = async (e) => {

        e.preventDefault();


        const validationErrors =
            productValidate({
                ...formData,
                images: [
                    ...existingImages,
                    ...newImages,
                ],
            });


        if (
            Object.keys(validationErrors).length > 0
        ) {

            setErrors(validationErrors);

            return;

        }


        setErrors({});


        try {

            let uploadedImages = [];
            if (newImages.length > 0) {

                uploadedImages =
                    await productImageUpload(
                        newImages
                    );

            }
            const finalImages = [
                ...existingImages,
                ...uploadedImages,
            ];

            const productData = {

                ...formData,
                price: Number(
                    formData.price
                ),

                discountPrice:
                    formData.discountPrice
                        ? Number(
                            formData.discountPrice
                        )
                        : 0,

                stock: Number(
                    formData.stock
                ),

                images: finalImages,

            };

            console.log(
                "Updated Product Data:",
                productData
            );


            const result = await dispatch(
                updateProduct({
                    productId,
                    productData,
                })
            );


            if (
                updateProduct.fulfilled.match(
                    result
                )
            ) {

                console.log(
                    "Product updated successfully"
                );

                router.push("/admin/products");
            }


        } catch (error) {

            console.log(
                "Product Update Error:",
                error
            );

        }
    


    };


    /* =========================================
       LOADING / PRODUCT NOT FOUND
    ========================================= */

    if (
        isLoading &&
        !product
    ) {

        return (

            <div className="update-product-page">

                <div className="update-product-loading-overlay">

                    <div className="update-product-loader"></div>

                    <p>
                        Loading...
                    </p>

                </div>

            </div>

        );

    }


    if (isError) {

        return (

            <div className="update-product-error">

                {isError}

            </div>

        );

    }


    if (!product) {

        return (

            <div className="update-product-error">

                Product not found

            </div>

        );

    }


    return (

        <div className="update-product-page">


            {/* =================================
                LOADING OVERLAY
            ================================= */}

            {isLoading && (

                <div className="update-product-loading-overlay">

                    <div className="update-product-loader"></div>

                    <p>
                        Updating Product...
                    </p>

                </div>

            )}


            {/* =================================
                HEADER
            ================================= */}

            <div className="update-product-header">

                <div>

                    <Link
                        href="/admin/products"
                        className="update-back-products-btn"
                    >

                        <FaArrowLeft />

                        Back to Products

                    </Link>


                    <h1>
                        Update Product
                    </h1>


                    <p>
                        Update your product information.
                    </p>

                </div>

            </div>


            {/* =================================
                FORM
            ================================= */}

            <form
                className="update-product-form"
                onSubmit={handleSubmit}
            >


                {/* =================================
                    BASIC INFORMATION
                ================================= */}

                <div className="update-product-form-card">

                    <div className="update-form-card-header">

                        <div>

                            <h3>
                                Basic Information
                            </h3>

                            <p>
                                Update the basic details of your product.
                            </p>

                        </div>

                    </div>


                    <div className="update-form-grid">


                        {/* Product Name */}

                        <div className="update-form-group update-full-width">

                            <label>
                                Product Name
                            </label>

                            <input
                                type="text"
                                name="productName"
                                placeholder="Enter product name"
                                value={
                                    formData.productName
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            {errors.productName && (

                                <span className="update-error">
                                    {errors.productName}
                                </span>

                            )}

                        </div>


                        {/* Category */}

                        <div className="update-form-group">

                            <label>
                                Category
                            </label>

                            <select
                                name="category"
                                value={
                                    formData.category
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="">
                                    Select Category
                                </option>

                                <option value="Fashion">
                                    Fashion
                                </option>

                                <option value="Mobiles">
                                    Mobiles
                                </option>

                                <option value="Beauty">
                                    Beauty
                                </option>

                                <option value="Electronics">
                                    Electronics
                                </option>

                                <option value="Home">
                                    Home
                                </option>

                                <option value="Appliances">
                                    Appliances
                                </option>

                                <option value="Toys">
                                    Toys
                                </option>

                                <option value="Food">
                                    Food
                                </option>

                                <option value="Auto">
                                    Auto
                                </option>

                                <option value="2 Wheelers">
                                    2 Wheelers
                                </option>

                                <option value="Sports">
                                    Sports
                                </option>

                                <option value="Books">
                                    Books
                                </option>

                                <option value="Furniture">
                                    Furniture
                                </option>

                            </select>


                            {errors.category && (

                                <span className="update-error">
                                    {errors.category}
                                </span>

                            )}

                        </div>


                        {/* Brand */}

                        <div className="update-form-group">

                            <label>
                                Brand
                            </label>

                            <input
                                type="text"
                                name="brand"
                                placeholder="Enter brand name"
                                value={
                                    formData.brand
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            {errors.brand && (

                                <span className="update-error">
                                    {errors.brand}
                                </span>

                            )}

                        </div>


                        {/* Description */}

                        <div className="update-form-group update-full-width">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                rows="5"
                                placeholder="Write product description..."
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                            />


                            {errors.description && (

                                <span className="update-error">
                                    {errors.description}
                                </span>

                            )}

                        </div>

                    </div>

                </div>


                {/* =================================
                    PRICE & INVENTORY
                ================================= */}

                <div className="update-product-form-card">

                    <div className="update-form-card-header">

                        <div>

                            <h3>
                                Price & Inventory
                            </h3>

                            <p>
                                Update product pricing and stock information.
                            </p>

                        </div>

                    </div>


                    <div className="update-form-grid">


                        {/* Price */}

                        <div className="update-form-group">

                            <label>
                                Price (₹)
                            </label>

                            <input
                                type="number"
                                name="price"
                                placeholder="0"
                                value={
                                    formData.price
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            {errors.price && (

                                <span className="update-error">
                                    {errors.price}
                                </span>

                            )}

                        </div>


                        {/* Discount */}

                        <div className="update-form-group">

                            <label>
                                Discount Price (₹)
                            </label>

                            <input
                                type="number"
                                name="discountPrice"
                                placeholder="0"
                                min="0"
                                value={
                                    formData.discountPrice
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            {errors.discountPrice && (

                                <span className="update-error">
                                    {errors.discountPrice}
                                </span>

                            )}

                        </div>


                        {/* Stock */}

                        <div className="update-form-group">

                            <label>
                                Stock Quantity
                                <span>*</span>
                            </label>

                            <input
                                type="number"
                                name="stock"
                                placeholder="0"
                                min="0"
                                value={
                                    formData.stock
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            {errors.stock && (

                                <span className="update-error">
                                    {errors.stock}
                                </span>

                            )}

                        </div>


                        {/* SKU */}

                        <div className="update-form-group">

                            <label>
                                SKU
                            </label>

                            <input
                                type="text"
                                name="sku"
                                placeholder="e.g. SHOE-001"
                                value={
                                    formData.sku
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            {errors.sku && (

                                <span className="update-error">
                                    {errors.sku}
                                </span>

                            )}

                        </div>

                    </div>

                </div>


                {/* =================================
                    PRODUCT OPTIONS
                ================================= */}

                <div className="update-product-form-card">

                    <div className="update-form-card-header">

                        <div>

                            <h3>
                                Product Options
                            </h3>

                            <p>
                                Update product variations if applicable.
                            </p>

                        </div>

                    </div>


                    <div className="update-form-grid">


                        {/* Size */}

                        <div className="update-form-group">

                            <label>
                                Size
                            </label>

                            <input
                                type="text"
                                name="size"
                                placeholder="e.g. S, M, L, XL"
                                value={
                                    formData.size
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        {/* Color */}

                        <div className="update-form-group">

                            <label>
                                Color
                            </label>

                            <input
                                type="text"
                                name="color"
                                placeholder="e.g. Black"
                                value={
                                    formData.color
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                    </div>

                </div>


                {/* =================================
                    PRODUCT IMAGES
                ================================= */}

                <div className="update-product-form-card">

                    <div className="update-form-card-header">

                        <div>

                            <h3>
                                Product Images
                            </h3>

                            <p>
                                Update images of your product.
                            </p>

                        </div>

                    </div>


                    {/* Upload */}

                    <div className="update-image-upload-box">

                        <input
                            type="file"
                            id="updateProductImages"
                            accept="image/*"
                            multiple
                            onChange={
                                handleImageChange
                            }
                            hidden
                        />


                        <label
                            htmlFor="updateProductImages"
                            className="update-image-upload-label"
                        >

                            <FaImage />

                            <strong>
                                Upload Product Images
                            </strong>

                            <span>
                                PNG, JPG or WEBP
                            </span>

                        </label>

                    </div>


                    {/* =================================
                        EXISTING IMAGES
                    ================================= */}

                    {existingImages.length > 0 && (

                        <div className="update-image-preview-container">

                            {existingImages.map(
                                (image, index) => (

                                    <div
                                        className="update-image-preview"
                                        key={`existing-${index}`}
                                    >

                                        <img
                                            src={image}
                                            alt={`Product ${index + 1}`}
                                        />


                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeExistingImage(
                                                    index
                                                )
                                            }
                                        >

                                            <FaTrash />

                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    )}


                    {/* =================================
                        NEW IMAGES
                    ================================= */}

                    {newImages.length > 0 && (

                        <div className="update-image-preview-container">

                            {newImages.map(
                                (image, index) => (

                                    <div
                                        className="update-image-preview"
                                        key={`new-${index}`}
                                    >

                                        <img
                                            src={
                                                URL.createObjectURL(
                                                    image
                                                )
                                            }
                                            alt={`New Product ${index + 1}`}
                                        />


                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeNewImage(
                                                    index
                                                )
                                            }
                                        >

                                            <FaTrash />

                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* =================================
                    PRODUCT SETTINGS
                ================================= */}

                <div className="update-product-form-card">

                    <div className="update-form-card-header">

                        <div>

                            <h3>
                                Product Settings
                            </h3>

                            <p>
                                Configure product visibility.
                            </p>

                        </div>

                    </div>


                    {/* STATUS */}

                    <div className="update-settings-row">

                        <div>

                            <strong>
                                Product Status
                            </strong>

                            <p>
                                Choose whether this product is visible
                                to customers.
                            </p>

                        </div>


                        <select
                            name="status"
                            value={
                                formData.status
                            }
                            onChange={
                                handleChange
                            }
                            className={`update-status-select ${formData.status}`}
                        >

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>

                        </select>

                    </div>


                    {/* FEATURED */}

                    <div className="update-settings-row">

                        <div>

                            <strong>
                                Featured Product
                            </strong>

                            <p>
                                Show this product as a featured product.
                            </p>

                        </div>


                        <label className="update-switch">

                            <input
                                type="checkbox"
                                name="featured"
                                checked={
                                    formData.featured
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <span className="update-slider"></span>

                        </label>

                    </div>

                </div>


                {/* =================================
                    ACTIONS
                ================================= */}

                <div className="update-form-actions">

                    <Link
                        href="/admin/products"
                        className="update-cancel-btn"
                    >
                        Cancel
                    </Link>


                    <button
                        type="submit"
                        className="update-product-submit"
                        disabled={isLoading}
                    >

                        {isLoading
                            ? "Updating Product..."
                            : "Update Product"
                        }

                    </button>

                </div>

            </form>

        </div>

    );

};


export default UpdateProductForm;
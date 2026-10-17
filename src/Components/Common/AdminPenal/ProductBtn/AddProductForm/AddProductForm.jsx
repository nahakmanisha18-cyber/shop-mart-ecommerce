"use client";

import React, { useState } from "react";
import { FaArrowLeft, FaImage, FaPlus, FaTrash } from "react-icons/fa";
import Link from "next/link";
import "./AddProductForm.css";
import { useDispatch, useSelector } from "react-redux";
import { productValidate } from "@/utils/validate";
import { addProduct } from "@/redux/action/productAction";
import { clearProductError, clearProductSuccess } from "@/redux/slice/productSlice";
import { productImageUpload } from "@/services/product/productImageUpload"
import { useRouter } from "next/navigation";

const AddProductForm = () => {

    const intialState = {
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
        status: "",
        featured: false,
    }
    const [formData, setFormData] = useState(intialState);
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();

    const { isLoading, isError, isSuccess } = useSelector((state) => state.productStore);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        dispatch(clearProductError());
    };

    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        setImages((prev) => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = productValidate({
            ...formData,
            images,
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            // 1️⃣ Upload all images to Cloudinary
            const imageUrls = await productImageUpload(images);

            // Agar upload fail ho gaya
            if (imageUrls.length !== images.length) {
                console.log("Some images failed to upload");
                return;
            }

            // 2️⃣ Product data
            const productData = {
                ...formData,
                price: Number(formData.price),
                discountPrice: formData.discountPrice
                    ? Number(formData.discountPrice)
                    : 0,
                stock: Number(formData.stock),

                // Cloudinary URLs
                images: imageUrls,
            };

            console.log("Product Data:", productData);

            // 3️⃣ Save product in MongoDB
            const result = await dispatch(addProduct(productData));

            if (addProduct.fulfilled.match(result)) {
                setFormData(intialState);
                setImages([]);

                console.log("Product added successfully");
                router.push("/admin/products");
            }

        } catch (error) {
            console.log("Product Submit Error:", error);
        }
    };

    return (
       
        <div className="add-product-page">

            {isLoading && (
                <div className="product-loading-overlay">
                    <div className="product-loader"></div>
                    <p>Loading...</p>
                </div>
            )}
            {/* ================= HEADER ================= */}
            <div className="add-product-header">

                <div>
                    <Link
                        href="/admin/products"
                        className="back-products-btn"
                    >
                        <FaArrowLeft />
                        Back to Products
                    </Link>

                    <h1>Add Product</h1>

                    <p>
                        Add a new product to your store.
                    </p>
                </div>

            </div>


            {/* ================= FORM ================= */}

            <form className="add-product-form" onSubmit={handleSubmit}>

                <div className="product-form-card">

                    <div className="form-card-header">
                        <div>
                            <h3>Basic Information</h3>
                            <p>
                                Enter the basic details of your product.
                            </p>
                        </div>
                    </div>


                    <div className="form-grid">

                        {/* Product Name */}

                        <div className="form-group full-width">
                            <label>Product Name </label>
                            <input
                                type="text"
                                name="productName"
                                placeholder="Enter product name"
                                value={formData.productName}
                                onChange={handleChange}
                            />

                            {errors.productName && (
                                <span className="error">{errors.productName}</span>
                            )}
                        </div>


                        {/* Category */}

                        <div className="form-group">
                            <label>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">Select Category</option>
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

                            {errors.category && (
                                <span className="error">{errors.category}</span>
                            )}
                        </div>


                        {/* Brand */}

                        <div className="form-group">
                            <label>Brand</label>
                            <input type="text" name="brand" placeholder="Enter brand name" value={formData.brand}
                                onChange={handleChange} />

                            {errors.brand && (
                                <span className="error">{errors.brand}</span>
                            )}
                        </div>


                        {/* Description */}

                        <div className="form-group full-width">

                            <label> Description</label>

                            <textarea
                                name="description"
                                rows="5"
                                placeholder="Write product description..."
                                value={formData.description}
                                onChange={handleChange}
                            />

                            {errors.description && (
                                <span className="error">{errors.description}</span>
                            )}
                        </div>

                    </div>

                </div>


                {/* ================= PRICE & INVENTORY ================= */}

                <div className="product-form-card">

                    <div className="form-card-header">

                        <div>

                            <h3>Price & Inventory</h3>

                            <p>
                                Set product pricing and stock information.
                            </p>

                        </div>

                    </div>


                    <div className="form-grid">

                        {/* Price */}

                        <div className="form-group">

                            <label>
                                Price (₹)
                            </label>

                            <input
                                type="number"
                                name="price"
                                placeholder="0"
                                value={formData.price}
                                onChange={handleChange}
                            />

                            {errors.price && (
                                <span className="error">{errors.price}</span>
                            )}

                        </div>


                        {/* Discount */}

                        <div className="form-group">

                            <label>
                                Discount Price (₹)
                            </label>

                            <input
                                type="number"
                                name="discountPrice"
                                placeholder="0"
                                min="0"
                                value={formData.discountPrice}
                                onChange={handleChange}
                            />
                            {errors.discountPrice && (
                                <span className="error">{errors.discountPrice}</span>
                            )}

                        </div>


                        {/* Stock */}

                        <div className="form-group">

                            <label>
                                Stock Quantity <span>*</span>
                            </label>

                            <input
                                type="number"
                                name="stock"
                                placeholder="0"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                            />
                            {errors.stock && (
                                <span className="error">{errors.stock}</span>
                            )}

                        </div>


                        {/* SKU */}

                        <div className="form-group">

                            <label>SKU</label>

                            <input
                                type="text"
                                name="sku"
                                placeholder="e.g. SHOE-001"
                                value={formData.sku}
                                onChange={handleChange}
                            />
                            {errors.sku && (
                                <span className="error">{errors.sku}</span>
                            )}

                        </div>

                    </div>

                </div>

                <div className="product-form-card">
                    <div className="form-card-header">
                        <div>
                            <h3>Product Options</h3>
                            <p> Add product variations if applicable.</p>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Size</label>
                            <input type="text" name="size" placeholder="e.g. S, M, L, XL" value={formData.size}
                                onChange={handleChange} />
                        </div>

                        {/* Color */}
                        <div className="form-group">
                            <label>Color</label>
                            <input type="text" name="color" placeholder="e.g. Black" value={formData.color}
                                onChange={handleChange} />
                        </div>
                    </div>
                </div>


                {/*  IMAGES  */}

                <div className="product-form-card">

                    <div className="form-card-header">

                        <div>

                            <h3>Product Images</h3>

                            <p>
                                Upload images of your product.
                            </p>

                        </div>

                    </div>


                    <div className="image-upload-box">

                        <input
                            type="file"
                            id="productImages"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            hidden

                        />

                        <label
                            htmlFor="productImages"
                            className="image-upload-label"
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


                    {/* Image Preview */}

                    {images.length > 0 && (

                        <div className="image-preview-container">

                            {images.map((image, index) => (

                                <div
                                    className="image-preview"
                                    key={index}
                                >

                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Product ${index + 1}`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeImage(index)
                                        }
                                    >
                                        <FaTrash />
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </div>


                {/* ================= STATUS ================= */}

                <div className="product-form-card">

                    <div className="form-card-header">

                        <div>

                            <h3>Product Settings</h3>

                            <p>
                                Configure product visibility.
                            </p>

                        </div>

                    </div>


                    <div className="settings-row">

                        <div>

                            <strong>Product Status</strong>

                            <p>
                                Choose whether this product is visible
                                to customers.
                            </p>

                        </div>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={`status-select ${formData.status}`}
                        >
                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>
                        </select>

                    </div>


                    <div className="settings-row">

                        <div>

                            <strong>Featured Product</strong>

                            <p>
                                Show this product as a featured product.
                            </p>

                        </div>

                        <label className="switch">

                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                            />

                            <span className="slider"></span>

                        </label>

                    </div>

                </div>


                {/* ================= ACTIONS ================= */}

                <div className="form-actions">

                    <Link
                        href="/admin/products"
                        className="cancel-btn"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        className="add-product-submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Adding Product..." : "Add Product"}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default AddProductForm;
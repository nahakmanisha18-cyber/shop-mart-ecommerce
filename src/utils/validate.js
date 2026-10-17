// =======================================|| REGISTER VALIDATOR ||======================================= //
export const validate = (formData) => {
    let newErrors = {};

    // User Name
    if (!formData.profileName.trim()) {
        newErrors.profileName = "User Name is required";
    }

    // Email
    if (!formData.email.trim()) {
        newErrors.email = "Email is required";
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
        newErrors.email = "Please enter a valid email address";
    }

    // Password
    if (!formData.password.trim()) {
        newErrors.password = "Password is required";
    }

    // Confirm Password
    if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "Confirm Password is required";
    }

    // Password Match
    if (
        formData.password &&
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
    ) {
        newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
};

// =======================================|| LOGIN VALIDATOR ||======================================= //
export const loginValidate = (formData) => {
    let newErrors = {};

    // Email Required
    if (!formData.email.trim()) {
        newErrors.email = "Email is required";
    }
    // Email Format Check
    else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
        newErrors.email = "Please enter a valid email address";
    }

    // Password Required
    if (!formData.password.trim()) {
        newErrors.password = "Password is required";
    }

    return newErrors;
};

// =======================================|| PRODUCT VALIDATOR ||======================================= //
export const productValidate = (formData) => {
    const errors = {};

    // Product Name
    if (!formData.productName?.trim()) {
        errors.productName = "Product name is required";
    }

    // Description
    if (!formData.description?.trim()) {
        errors.description = "Product description is required";
    }

    // Category
    if (!formData.category?.trim()) {
        errors.category = "Category is required";
    }

    // Brand
    if (!formData.brand?.trim()) {
        errors.brand = "Brand is required";
    }

    // Price
    if (!formData.price) {
        errors.price = "Price is required";
    } else if (Number(formData.price) <= 0) {
        errors.price = "Price must be greater than 0";
    }

    // Discount Price
    if (
        formData.discountPrice !== "" &&
        Number(formData.discountPrice) < 0
    ) {
        errors.discountPrice = "Discount price cannot be negative";
    }

    // SKU
    if (!formData.sku?.trim()) {
        errors.sku = "SKU is required";
    }

    // Stock
    if (formData.stock === "") {
        errors.stock = "Stock is required";
    } else if (Number(formData.stock) < 0) {
        errors.stock = "Stock cannot be negative";
    }

    // Images
    if (!formData.images || formData.images.length === 0) {
        errors.images = "At least one product image is required";
    }

    return errors;
};



export const validateRefundForm = (formData) => {
    const validationErrors = {};

    if (!formData.orderId?.trim()) {
        validationErrors.orderId = "Order ID is required";
    }

    if (!formData.paymentId?.trim()) {
        validationErrors.paymentId = "Payment ID is required";
    }

    if (!formData.customerName?.trim()) {
        validationErrors.customerName = "Customer name is required";
    }

    if (!formData.customerEmail?.trim()) {
        validationErrors.customerEmail = "Customer email is required";
    } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            formData.customerEmail
        )
    ) {
        validationErrors.customerEmail = "Enter a valid email";
    }

    if (
        !formData.amount ||
        !Number.isFinite(Number(formData.amount)) ||
        Number(formData.amount) <= 0
    ) {
        validationErrors.amount = "Enter a valid refund amount";
    }

    if (!formData.reason) {
        validationErrors.reason = "Please select a reason";
    }

    return validationErrors;
};
import { createSlice } from "@reduxjs/toolkit";
import { addProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../action/productAction";

const initialState = {
    product: null,
    isLoading: false,
    isError: null,
    isSuccess: false,
    products: []
};

const productSlice = createSlice({
    name: "product",

    initialState,

    reducers: {
        clearProductError: (state) => {
            state.isError = null;
        },

        clearProductSuccess: (state) => {
            state.isSuccess = false;
        },
    },

    extraReducers: (builder) => {

        //ADD PRODUCT
        builder.addCase(addProduct.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
                state.isSuccess = false;
            })

        builder.addCase(addProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.product = action.payload.product;
                state.isError = null;
            })
        
        builder.addCase(addProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = action.payload?.message || "Failed to add product";
            });

        //GET ALL PRODUCTS
        builder.addCase(getAllProducts.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
            })

        builder.addCase(getAllProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.products = action.payload.products;
        })

        builder.addCase(getAllProducts.rejected, (state, action) => {
            state.isLoading = false;

            state.isError =
                action.payload?.message ||
                "Failed to fetch products";
            });
            
        //DELETE PRODUCT
        builder.addCase(deleteProduct.pending, (state) => {

                state.isLoading = true;
                state.isError = null;

            })

        builder.addCase(deleteProduct.fulfilled, (state, action) => {

            state.isLoading = false;
            state.isSuccess = true;

            const deletedId = action.payload.product._id;

            state.products = state.products.filter(
                (product) => product._id !== deletedId
            );

        })

        builder.addCase(deleteProduct.rejected, (state, action) => {

            state.isLoading = false;
            state.isError =
                action.payload?.message ||
                "Failed to delete product";

            });
        
        //GET ONE PRODUCT
        builder.addCase(getProduct.pending, (state) => {

                state.isLoading = true;
                state.isError = null;
                state.product = null;

            })

        builder.addCase(getProduct.fulfilled, (state, action) => {

            state.isLoading = false;

            state.product = action.payload.product;

        })

        builder.addCase(getProduct.rejected, (state, action) => {

            state.isLoading = false;

            state.isError =
                action.payload?.message ||
                "Failed to get product";

            })

     
        // UPDATE PRODUCT
        // UPDATE PRODUCT
builder.addCase(updateProduct.pending, (state) => {

    state.isLoading = true;
    state.isError = null;
    state.isSuccess = false;

});


builder.addCase(updateProduct.fulfilled, (state, action) => {

    state.isLoading = false;
    state.isSuccess = true;
    state.isError = null;

    const updatedProduct = action.payload.product;

    // Single product
    state.product = updatedProduct;

    // Product list ke andar bhi update karo
    const index = state.products.findIndex(
        (product) =>
            product._id === updatedProduct._id
    );

    if (index !== -1) {

        state.products[index] = updatedProduct;

    }

});


builder.addCase(updateProduct.rejected, (state, action) => {

    state.isLoading = false;
    state.isSuccess = false;

    state.isError =
        action.payload?.message ||
        "Failed to update product";

});
    },

    
});

export const { clearProductError, clearProductSuccess } = productSlice.actions;

export default productSlice.reducer;
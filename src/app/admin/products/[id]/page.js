
import ProductDetailsPage from "@/Components/Common/AdminPenal/ProductBtn/ProductDetailsPage/ProductDetailsPage";

const ProductDetails = async ({ params }) => {

    const { id } = await params;

    return (
        <>
            <ProductDetailsPage productId={id} />
        </>
    );
};

export default ProductDetails;
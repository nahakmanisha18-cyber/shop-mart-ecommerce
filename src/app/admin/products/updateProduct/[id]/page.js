// import UpdateProductForm from "@/components/UpdateProductForm";

import UpdateProductForm from "@/Components/Common/AdminPenal/ProductBtn/UpdateProductForm/UpdateProdductForm";

const UpdateProductPage = async ({ params }) => {

    const { id } = await params;

    console.log("PAGE PRODUCT ID:", id);

    return (
        <UpdateProductForm productId={id} />
    );
};

export default UpdateProductPage;
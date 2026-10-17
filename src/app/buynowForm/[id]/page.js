import BuynowFormPage from "@/Components/BuynowFormPage/BuynowFormPage";

const BuyNowPage = async ({ params }) => {

    const { id } = await params;

    return (
        <BuynowFormPage productId={id} />
    );
};

export default BuyNowPage;
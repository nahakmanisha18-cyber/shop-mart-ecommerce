import OrderSuccessPage from "@/Components/OrderSuccessPage/OrderSuccessPage";

const Page = async ({ params }) => {

    const { id } = await params;

    return (
        <OrderSuccessPage orderId={id} />
    );
};

export default Page;
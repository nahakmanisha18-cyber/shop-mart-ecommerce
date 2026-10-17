import OrderViewPage from "@/Components/Common/AdminPenal/OdersBtn/OderViewPage/OderViewPage";


export default async function Page({ params }) {

    const { id } = await params;

    return <OrderViewPage orderId={id} />;
}
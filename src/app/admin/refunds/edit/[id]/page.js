import RefundEditPage from "@/Components/Common/AdminPenal/Refund/RefundEditPage/RefundEditPage";



export default async function Page({ params }) {
    const { id } = await params;

    return <RefundEditPage refundId={id} />;
}

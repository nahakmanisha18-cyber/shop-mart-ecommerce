import RefundDetailsPage from "@/Components/Common/AdminPenal/Refund/RefundDetailsPage/RefundDetailsPage";


export default async function AdminRefundDetailsRoute({ params }) {
    const { id } = await params;

    return <RefundDetailsPage refundId={id} />;
}

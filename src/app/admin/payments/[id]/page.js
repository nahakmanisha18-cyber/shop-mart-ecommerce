import PaymentViewPage from "@/Components/Common/AdminPenal/PaymentBtn/PaymentViewPage/PaymentViewPage";


export default async function Page({ params }) {

    const { id } = await params;

    console.log("PAYMENT ID:", id);

    return (
        <PaymentViewPage paymentId={id} />
    );
}
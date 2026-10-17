import UpdateReturnRequest from "@/Components/Common/AdminPenal/Return/UpdateReturnRequest/UpdateReturnRequest";

export default async function UpdateReturnPage({ params }) {
    const { id } = await params;

    return <UpdateReturnRequest id={id} />;
}

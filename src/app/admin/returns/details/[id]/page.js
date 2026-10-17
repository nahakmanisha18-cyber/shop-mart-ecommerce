import AdminReturnRequestDetail from "@/Components/Common/AdminPenal/Return/AdminReturnRequestDetail/AdminReturnRequestDetail";

const AdminReturnRequestDetailPage = async ({ params }) => {
    const { id } = await params;

    return(
        <>
            <AdminReturnRequestDetail returnId={id} />
        </>
    )
}

export default AdminReturnRequestDetailPage;

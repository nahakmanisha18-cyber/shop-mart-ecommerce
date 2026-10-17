import UserDetailsPage from "@/Components/Common/AdminPenal/User/UserDetailsPage/UserDetailsPage";


export default async function Page({ params }) {
    const { id } = await params;

    return <UserDetailsPage id={id} />;
}
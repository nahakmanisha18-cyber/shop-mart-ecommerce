import ProductDetailPage from "@/Components/ProductDetails/ProductDetails";

export default async function Page({ params }) {
    const { id } = await params;

    return (
        <ProductDetailPage productId={id} />
    );
}
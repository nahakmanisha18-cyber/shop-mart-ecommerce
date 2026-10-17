
"use client";

import ReturnRequestTracking from "@/Components/ReturnPages/ReturnRequestTracking/ReturnRequestTracking";
import { useParams } from "next/navigation";

export default function ReturnRequestDetailsPage() {
    const params = useParams();
    const id = params.id;

    return <ReturnRequestTracking returnId={id} />;
}

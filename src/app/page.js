"use client";
import HomePage from "@/Components/Common/HomePage/HomePage";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";

export default function Home() {

  // const router = useRouter();

  // const { user } = useSelector((state) => state.authStore);

  // useEffect(() => {

  //   if (user?.role === "admin") {

  //     router.replace("/admin/dashboard");

  //   }

  // }, [user]);

  return (
    <>
      <HomePage/>
    </>
  );
}
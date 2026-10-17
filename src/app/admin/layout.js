"use client";

import AdminSidebarPage from "@/Components/Common/AdminPenal/AdminSidebar/AdminSidebarPage";
import AdminHeader from "@/Components/Common/AdminPenal/AdminHeader/AdminHeader";
import "./admin.css";

export default function AdminLayout({ children }) {
    return (
        <div className="admin-layout">

            <AdminSidebarPage />

            <div className="admin-content">

                <AdminHeader />

                <main className="admin-main">
                    {children}
                </main>

            </div>

        </div>
    );
}
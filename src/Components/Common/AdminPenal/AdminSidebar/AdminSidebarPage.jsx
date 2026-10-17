"use client";

import Link from "next/link";
import {
    FaChartPie,
    FaBoxOpen,
    FaUsers,
    FaCreditCard,
    FaShoppingCart,
    FaUndo,
    FaCog,
    FaSignOutAlt,
    FaWallet,
} from "react-icons/fa";
import { Navbar, Dropdown } from "react-bootstrap";
import { usePathname, useRouter } from "next/navigation";
import "./AdminSidebarPage.css";

const AdminSidebarPage = () => {

    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: <FaChartPie />,
        },
        {
            name: "Products",
            path: "/admin/products",
            icon: <FaBoxOpen />,
        },
        {
            name: "Orders",
            path: "/admin/orders",
            icon: <FaShoppingCart />,
        },
        {
            name: "Payments",
            path: "/admin/payments",
            icon: <FaCreditCard />,
        },

        {
            name: "Returns",
            path: "/admin/returns",
            icon: <FaUndo />,
        },

        {
            name: "Refunds ",
            path: "/admin/refunds",
            icon: <FaWallet />,
        },
        
        {
            name: "Users",
            path: "/admin/users",
            icon: <FaUsers />,
        },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: <FaCog />,
        },
    ];

    const handleLogout = () => {
        // yaha baad me Redux logout action laga sakti ho
        router.push("/");
    };

    return (
        <aside className="admin-sidebar">

            {/* Logo */}
            {/* <Navbar.Brand
                as={Link}
                href="/admin/dashboard"
                className="sidebar-logo"
            >
                <h2>
                    Shop<span>Hub</span>
                </h2>

                <p>Admin Panel</p>
            </Navbar.Brand> */}
            <Navbar.Brand
                as={Link}
                href="/admin/dashboard" className="sidebar-logo">
                <img
                    src="/logo.png"
                    alt="ShopMart"
                    className="sidebar-logo-image"
                />
                <p>Admin Panel</p>
                
            </Navbar.Brand>

            <hr className="sidebar-divider" />
            


            {/* Menu */}
            <div className="sidebar-menu">

                {menuItems.map((item) => {

                    const isActive =
                        pathname === item.path ||
                        pathname.startsWith(`${item.path}/`);

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`sidebar-item ${isActive ? "active" : ""
                                }`}
                        >
                            <span className="sidebar-icon">
                                {item.icon}
                            </span>

                            <span>{item.name}</span>
                        </Link>
                    );

                })}

            </div>


            {/* Footer */}
            <div className="sidebar-footer">

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt className="sidebar-icon" />

                    <span>Logout</span>
                </button>

            </div>

        </aside>
    );
};

export default AdminSidebarPage;
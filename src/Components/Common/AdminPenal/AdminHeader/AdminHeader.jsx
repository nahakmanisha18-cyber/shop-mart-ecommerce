import "./AdminHeader.css";
import Link from "next/link";
import { Dropdown } from "react-bootstrap";
import {
    FaSearch,
    FaBell,
    FaEnvelope,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/action/authAction";
import { useRouter } from "next/navigation";

const AdminHeader = () => {

    const dispatch = useDispatch();
    const router = useRouter();

    const { user } = useSelector((state) => state.authStore);
    const handleLogout = async () => {

        const result = await dispatch(logout());

        if (logout.fulfilled.match(result)) {

            router.push("/");

        }

    };
    return (
        <header className="admin-header">

            {/* Left Side */}

            {/* <div className="header-left">

                <h4 className="page-title">
                    Dashboard
                </h4>

            </div> */}

            {/* Center */}

            <div className="header-center">

                <div className="search-box">

                    <FaSearch className="search-icon" />

                    <input
                        type="text"
                        placeholder="Search products, orders..."
                    />

                </div>

            </div>

            {/* Right Side */}
            <div className="header-right">

                <button className="icon-btn">
                    <FaEnvelope />
                </button>

                <button className="icon-btn">
                    <FaBell />
                </button>

                <Dropdown align="end">

                    <Dropdown.Toggle
                        className="admin-profile-btn"
                        variant="light"
                    >

                        <div className="admin-profile">

                            <img
                                src={
                                    user?.profileImage ||
                                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                }
                                alt="Admin"
                            />

                            <div className="admin-info">

                                <h6>
                                    {user?.profileName || "Admin"}
                                </h6>

                                <span>
                                    Administrator
                                </span>

                            </div>

                        </div>

                    </Dropdown.Toggle>

                    <Dropdown.Menu>

                        <Dropdown.Item
                            as={Link}
                            href="/admin/profile"
                        >
                            My Profile
                        </Dropdown.Item>

                        <Dropdown.Item
                            as={Link}
                            href="/admin/settings"
                        >
                            Settings
                        </Dropdown.Item>

                        <Dropdown.Divider />

                        <Dropdown.Item
                            onClick={handleLogout}
                        >
                            Logout
                        </Dropdown.Item>

                    </Dropdown.Menu>

                </Dropdown>

            </div>

        </header>
    );
};

export default AdminHeader;
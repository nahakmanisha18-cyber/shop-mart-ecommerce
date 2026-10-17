"use client"
import { useState, useEffect } from "react";
import "./LogIn.css";
import { FaArrowLeft } from "react-icons/fa";
import { loginValidate } from "@/utils/validate";
import { useDispatch, useSelector } from "react-redux";
import { logIn } from "@/redux/action/authAction";
import { clearError } from "@/redux/slice/authSlice";


const Login = ({ openSignUp, closeModal }) => {
    const dispatch = useDispatch()
    const { user, isError, isLoading } = useSelector(state => state.authStore);


    const intialState = {
        email: "",
        password: ""
    }

    const [formData, setFormData] = useState(intialState);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
        if (name === "email") {
            dispatch(clearError());
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearError());

        const validationErrors = loginValidate(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        dispatch(logIn(formData));
        console.log(formData)

    };
    useEffect(() => {
        if (user) {

            closeModal();
        }
    }, [user, closeModal]);
    


    return (
        <>

            <div className="login-container">
                <div className="login-left">
                    <div
                        className="back-btn"
                        onClick={() => {
                            dispatch(clearError());
                            closeModal();
                        }}
                    >
                        <FaArrowLeft />
                    </div>
                    <div className="mobile-logo">
                        Shop<span>Hub</span>
                    </div>
                    <h2>Login to Your Account</h2>

                    <p>
                        Continue shopping and manage your orders.
                    </p>

                    {isError && (
                        <span className="user-error">
                            {isError}
                        </span>
                    )}

                    <form className="login-form" onSubmit={handleSubmit}>

                        <input type="text" placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} />
                        <span className="error">
                            {errors.email}
                        </span>

                        <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
                        {errors.password && (
                            <span className="error">
                                {errors.password}
                            </span>
                        )}
                        <button
                            type="submit"
                            className="pop-login-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="login-loader"></span>
                                    Creating Account...
                                </>
                            ) : (
                                " Log in"
                            )}
                        </button>

                    </form>


                    <p className="login-link">
                        Don't have an account?{" "}
                        <span
                            onClick={() => {
                                dispatch(clearError());
                                openSignUp();
                            }}
                        >
                            Sign Up
                        </span>
                    </p>
                </div>

                {/* Right Side Content */}
                <div className="login-right">
                    <h1>Welcome Back! 👋</h1>

                    <p>
                        Access your wishlist, orders, and exclusive offers.
                    </p>

                    <div className="circle"></div>
                </div>

            </div>
            
        </>
    );
};

export default Login;

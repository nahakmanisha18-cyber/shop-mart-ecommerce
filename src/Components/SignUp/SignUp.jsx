"use client";
import { FaArrowLeft } from "react-icons/fa";
import "./SignUp.css"
import { validate } from "@/utils/validate";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "@/redux/action/authAction";
import { clearError } from "@/redux/slice/authSlice";

const SignUp = ({ openLogin, closeModal }) => {
    const { isError, isLoading } = useSelector(state => state.authStore);
    const intialState = {
        profileName: "",
        email: "",
        password: "",
        confirmPassword: "",
    }
    const [formData, setFormData] = useState(intialState);


    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
        dispatch(clearError());

    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});


        const resultAction = await dispatch(signUp(formData));

        if (signUp.fulfilled.match(resultAction)) {

            setFormData(intialState);

            openLogin();

        }
    };
    return (
        <div className="signUp-container">

            <div className="signUp-left">

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

                <h2>Create Your Account</h2>

                <p>
                    Join ShopHub and start shopping today.
                </p>

                {isError && (
                    <span className="user-error">
                        {isError}
                    </span>
                )}

                <form
                    className="signUp-form"
                    onSubmit={handleSubmit}
                >

                    <input type="text" placeholder="Full Name" name="profileName" value={formData.profileName} onChange={handleChange} />
                    {errors.profileName && (
                        <span className="error">
                            {errors.profileName}
                        </span>
                    )}

                    <input type="text" placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && (
                        <span className="error">
                            {errors.email}
                        </span>
                    )}

                    <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
                    {errors.password && (
                        <span className="error">
                            {errors.password}
                        </span>
                    )}

                    <input type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                    {errors.confirmPassword && (
                        <span className="error">
                            {errors.confirmPassword}
                        </span>
                    )}

                    <button
                        type="submit"
                        className="signUp-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="sign-loader"></span>
                                Creating Account...
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </button>

                </form>



                <p className="signUp-link">
                    Already have an account?{" "}
                    <span
                        onClick={() => {
                            dispatch(clearError());
                            openLogin();
                        }}
                    >
                        Log In
                    </span>
                </p>

            </div>

            <div className="signUp-right">

                <h1>Join ShopHub 🎉</h1>

                <p>
                    Create your account and enjoy wishlist, orders,
                    secure checkout, and exclusive member deals.
                </p>

                <div className="circle"></div>

            </div>

        </div>
    );
};

export default SignUp;
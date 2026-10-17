"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

import "./Search.css";

const Search = () => {
    const [search, setSearch] = useState("");
    const [showResults, setShowResults] = useState(false);

    const { products = [] } = useSelector(
        (state) => state.productStore
    );

    const filteredProducts = products
        .filter((product) =>
            product.productName
                ?.toLowerCase()
                .includes(search.toLowerCase())
        )
        .slice(0, 8);

    return (
        <div className="search-container">

            <div className="search-box">

                <FaSearch />

                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                />

            </div>

            {showResults && search.trim() !== "" && (
                <div className="search-results">

                    {filteredProducts.length > 0 ? (

                        filteredProducts.map((product) => (

                            <Link
                                key={product._id}
                                href={`/details/${product._id}`}
                                className="search-result-item"
                                onClick={() => {
                                    setSearch("");
                                    setShowResults(false);
                                }}
                            >

                                <img
                                    src={
                                        product.images?.[0] ||
                                        "/images/no-image.png"
                                    }
                                    alt={product.productName}
                                />

                                <div className="search-result-info">

                                    <h4>
                                        {product.productName}
                                    </h4>

                                    <span>
                                        in {product.category}
                                    </span>

                                </div>

                            </Link>

                        ))

                    ) : (

                        <div className="search-no-result">
                            No products found
                        </div>

                    )}

                </div>
            )}

        </div>
    );
};

export default Search;
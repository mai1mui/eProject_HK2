import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const url = new URL(window.location.href);

        // Google trả về access_token qua hash (#)
        const hashParams = new URLSearchParams(
            window.location.hash.substring(1)
        );
        const accessToken = hashParams.get("access_token");

        // Facebook & Apple trả về code qua query string
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state"); // để phân biệt provider

        if (accessToken) {
            // Google login
            axios
                .post("http://127.0.0.1:8000/api/social-login/google", {
                    access_token: accessToken,
                })
                .then((res) => {
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                    navigate("/");
                })
                .catch(() => navigate("/login"));
        } else if (code && state) {
            // Facebook / Apple
            axios
                .post(`http://127.0.0.1:8000/api/social-login/${state}`, {
                    code,
                    redirect_uri: window.location.origin + "/auth/callback",
                })
                .then((res) => {
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                    navigate("/");
                })
                .catch(() => navigate("/login"));
        }
    }, []);

    return <h2 style={{ color: "white" }}>Processing login...</h2>;
}

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../lib/api";

export default function Checkout() {
    const [params] = useSearchParams();
    const courseId = params.get("course_id");
    const [course, setCourse] = useState(null);
    const [method, setMethod] = useState("cod"); // demo: cod/stripe/vnpay/paypal
    const [placing, setPlacing] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        if (!courseId) return;
        api.get(`/courses/${courseId}`)
            .then((r) => setCourse(r.data))
            .catch(() => {});
    }, [courseId]);

    const placeOrder = async () => {
        setPlacing(true);
        try {
            const r = await api.post("/payments/checkout", {
                course_id: courseId,
                method,
            });
            if (r.data.redirect_url) {
                window.location.href = r.data.redirect_url;
            } else if (r.data.status === "success") {
                nav(`/checkout/success?payment_id=${r.data.id}`);
            } else {
                alert("Checkout failed!");
            }
        } finally {
            setPlacing(false);
        }
    };

    if (!courseId)
        return (
            <div className="container">
                <p>Missing course_id.</p>
            </div>
        );
    if (!course)
        return (
            <div className="container">
                <p>Loading…</p>
            </div>
        );

    return (
        <div className="container">
            <h1>Checkout</h1>
            <div className="checkout">
                <div className="summary">
                    <h3>{course.CName}</h3>
                    <p className="muted">
                        {course.CDescription?.slice(0, 140)}
                    </p>
                    <div className="price">
                        {money(course.price_final ?? course.price ?? 0)}
                    </div>
                </div>
                <div className="pay">
                    <label>Payment method</label>
                    <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                    >
                        <option value="cod">Cash / Manual</option>
                        <option value="vnpay">VNPay</option>
                        <option value="paypal">PayPal</option>
                        <option value="stripe">Stripe</option>
                    </select>

                    <button
                        className="btn primary"
                        disabled={placing}
                        onClick={placeOrder}
                    >
                        {placing ? "Processing…" : "Place order"}
                    </button>
                    <p className="muted">
                        <Link to={`/courses/${courseId}`}>Back to course</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
function money(n) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(Number(n || 0));
}

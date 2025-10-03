import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../lib/api";

export default function OrderSuccess() {
    const [params] = useSearchParams();
    const id = params.get("payment_id");
    const [invoice, setInvoice] = useState(null);

    useEffect(() => {
        if (!id) return;
        api.get(`/payments/${id}`)
            .then((r) => setInvoice(r.data))
            .catch(() => {});
    }, [id]);

    return (
        <div className="container">
            <h1>Payment successful 🎉</h1>
            {invoice ? (
                <>
                    <p>
                        Course:{" "}
                        <b>{invoice.course?.CName || invoice.course_id}</b>
                    </p>
                    <p>
                        Amount: <b>{money(invoice.amount)}</b>
                    </p>
                    <p>Method: {invoice.method}</p>
                    <p>Status: {invoice.status}</p>
                    <div className="row">
                        <Link className="btn" to={`/invoice/${id}`}>
                            View invoice
                        </Link>
                        <Link className="btn primary" to="/my-learning">
                            Go to My Learning
                        </Link>
                    </div>
                </>
            ) : (
                <p>Loading invoice…</p>
            )}
        </div>
    );
}
function money(n) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(Number(n || 0));
}

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";

export default function Invoice() {
    const { paymentId } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        api.get(`/payments/${paymentId}`)
            .then((r) => setData(r.data))
            .catch(() => {});
    }, [paymentId]);

    if (!data)
        return (
            <div className="container">
                <p>Loading…</p>
            </div>
        );

    return (
        <div className="container">
            <h1>Invoice #{data.id || paymentId}</h1>
            <p>
                Course: <b>{data.course?.CName || data.course_id}</b>
            </p>
            <p>
                Buyer: <b>{data.buyer?.AName || data.user_id}</b> (
                {data.buyer?.Email})
            </p>
            <p>
                Amount: {money(data.amount)} • Method: {data.method} • Status:{" "}
                {data.status}
            </p>
            <p>Date: {new Date(data.created_at).toLocaleString()}</p>
            <div className="row">
                <Link className="btn" to="/my-learning">
                    My Learning
                </Link>
                <Link className="btn" to={`/courses/${data.course_id}`}>
                    Course page
                </Link>
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

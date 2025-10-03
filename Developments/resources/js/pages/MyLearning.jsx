import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function MyLearning() {
    const [items, setItems] = useState(null);

    useEffect(() => {
        api.get("/me/courses")
            .then((r) => setItems(r.data.items || []))
            .catch(() => setItems([]));
    }, []);

    if (items === null)
        return (
            <div className="container">
                <p>Loading…</p>
            </div>
        );
    if (items.length === 0)
        return (
            <div className="container">
                <p>You haven’t purchased any course yet.</p>
            </div>
        );

    return (
        <div className="container">
            <h1>My Learning</h1>
            <ul className="grid">
                {items.map((c) => (
                    <li className="card" key={c.CourseID}>
                        <div className="card-body">
                            <h3>
                                <Link to={`/courses/${c.CourseID}`}>
                                    {c.CName}
                                </Link>
                            </h3>
                            <p className="muted">
                                {(c.CDescription || "").slice(0, 120)}
                            </p>
                            <div className="muted">
                                Progress: {Math.round(c.progress || 0)}%
                            </div>
                        </div>
                        <div className="card-footer">
                            <Link
                                className="btn primary"
                                to={`/courses/${c.CourseID}/lesson/${
                                    c.next_lesson_id || ""
                                }`}
                            >
                                Continue
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

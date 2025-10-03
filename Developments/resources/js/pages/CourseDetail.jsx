import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../lib/api";
import BuyButton from "../components/BuyButton";
import useOwnership from "../hooks/useOwnership";
import "../../css/CourseDetail.css"; // tùy bạn có/không

const Star = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FFC531">
        <path d="M12 3l2.6 5.6 6.2.9-4.5 4.3 1.1 6.1L12 17.9 6.6 20l1.1-6.1L3.2 9.5l6.2-.9L12 3z" />
    </svg>
);

export default function CourseDetail() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [myRating, setMyRating] = useState(5);
    const [myComment, setMyComment] = useState("");

    const { own } = useOwnership(id);

    useEffect(() => {
        let live = true;
        setLoading(true);
        Promise.all([
            api.get(`/courses/${id}`),
            api.get(`/courses/${id}/lessons`),
            api.get(`/courses/${id}/feedback`, { params: { limit: 10 } }),
        ])
            .then(([c, l, f]) => {
                if (!live) return;
                setCourse(c.data);
                setLessons(l.data || []);
                setFeedbacks(f.data?.items || []);
            })
            .catch(() => {})
            .finally(() => live && setLoading(false));
        return () => (live = false);
    }, [id]);

    const avg = useMemo(() => {
        if (!course) return 0;
        return (
            course.rating_avg ??
            (course.feedback_count
                ? course.rating_sum / course.feedback_count
                : 0)
        );
    }, [course]);

    const submitFeedback = async (e) => {
        e.preventDefault();
        if (!myComment.trim()) return;
        setSending(true);
        try {
            const r = await api.post(`/courses/${id}/feedback`, {
                rating: myRating,
                comment: myComment,
            });
            setFeedbacks((v) => [r.data, ...v]);
            setMyRating(5);
            setMyComment("");
        } finally {
            setSending(false);
        }
    };

    if (loading)
        return (
            <div className="container">
                <p>Loading…</p>
            </div>
        );
    if (!course)
        return (
            <div className="container">
                <p>Course not found.</p>
            </div>
        );

    return (
        <div className="container">
            <nav className="crumbs">
                <Link to="/courses">Courses</Link> <span>/</span>{" "}
                <span>{course.Category || "General"}</span>
            </nav>

            <header className="hero">
                <div className="left">
                    <h1 className="title">{course.CName}</h1>
                    <p className="subtitle">{course.CDescription}</p>

                    <div className="row">
                        <div className="rating">
                            <Star />
                            <b>{avg.toFixed(1)}</b>
                            <span>({course.feedback_count || 0} ratings)</span>
                        </div>
                        <span>•</span>
                        <div>{course.students_count || 0} students</div>
                        <span>•</span>
                        <div>
                            Instructor:{" "}
                            {course.InstructorName || course.CreatorID}
                        </div>
                    </div>
                </div>

                <aside className="right">
                    <div className="thumb" />
                    <div className="box">
                        <div className="price">
                            <span className="now">
                                {money(course.price_final ?? course.price ?? 0)}
                            </span>
                            {course.price_discount ? (
                                <>
                                    <span className="old">
                                        {money(course.price)}
                                    </span>
                                    <span className="off">
                                        -{course.price_discount}%
                                    </span>
                                </>
                            ) : null}
                        </div>

                        {own ? (
                            <Link
                                className="btn primary"
                                to={`/courses/${course.CourseID}/lesson/${
                                    lessons[0]?.LessonID || ""
                                }`}
                            >
                                Start learning
                            </Link>
                        ) : (
                            <BuyButton
                                courseId={course.CourseID}
                                className="btn primary"
                            />
                        )}
                        <p className="muted small">
                            30-day refund • Lifetime access
                        </p>
                    </div>
                </aside>
            </header>

            <section className="curriculum">
                <div className="cur-head">
                    <h2>Course content</h2>
                    <span className="muted">
                        {lessons.length} lessons • {sum(lessons, "DurationMin")}{" "}
                        min
                    </span>
                </div>
                <div className="accordion">
                    {lessons.map((ls, i) => (
                        <details key={ls.LessonID} open={i < 1}>
                            <summary>
                                <span>{ls.LName}</span>
                                <span className="muted">
                                    {ls.DurationMin || 0} min{" "}
                                    {ls.IsPreview ? "• Preview" : ""}
                                </span>
                            </summary>
                            {ls.Content && (
                                <p className="muted">{ls.Content}</p>
                            )}
                        </details>
                    ))}
                </div>
            </section>

            <section className="feedback">
                <div className="fb-head">
                    <h2>Student feedback</h2>
                    <div className="score">
                        <div className="big">{avg.toFixed(1)}</div>
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} />
                            ))}
                        </div>
                        <div className="muted">
                            {course.feedback_count || 0} ratings
                        </div>
                    </div>
                </div>

                <ul className="fb-list">
                    {feedbacks.map((f) => (
                        <li key={f.id || f.FeedbackID} className="fb-item">
                            <div className="avatar">
                                {(f.user_name || f.AccountID || "U").slice(
                                    0,
                                    1
                                )}
                            </div>
                            <div>
                                <div className="muted">
                                    <b>{f.user_name || f.AccountID}</b> •{" "}
                                    {fmtDate(f.created_at || f.CreatedAt)} •{" "}
                                    <Star />{" "}
                                    {Number(f.rating || f.Rate).toFixed(1)}
                                </div>
                                <p>{f.comment || f.Content}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                {own ? (
                    <form className="fb-form" onSubmit={submitFeedback}>
                        <label>Rate this course</label>
                        <div className="rate-row">
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="1"
                                value={myRating}
                                onChange={(e) =>
                                    setMyRating(Number(e.target.value))
                                }
                            />
                            <span className="badge">{myRating}.0</span>
                        </div>
                        <textarea
                            value={myComment}
                            onChange={(e) => setMyComment(e.target.value)}
                            placeholder="Share your experience…"
                            rows={3}
                            required
                        />
                        <button className="btn primary" disabled={sending}>
                            {sending ? "Submitting…" : "Submit feedback"}
                        </button>
                    </form>
                ) : (
                    <p className="muted">
                        Log in and purchase the course to leave a review.
                    </p>
                )}
            </section>
        </div>
    );
}

function money(n) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(Number(n || 0));
}
function fmtDate(s) {
    try {
        return new Date(s).toLocaleDateString();
    } catch {
        return s || "";
    }
}
function sum(list, k) {
    return list.reduce((t, x) => t + (+x[k] || 0), 0);
}

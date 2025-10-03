import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";

export default function LessonPlayer() {
    const { id: courseId, lessonId } = useParams();
    const [lessons, setLessons] = useState([]);
    const [current, setCurrent] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        let live = true;
        Promise.all([
            api.get(`/courses/${courseId}/lessons`),
            lessonId
                ? api.get(`/lessons/${lessonId}`)
                : Promise.resolve({ data: null }),
        ])
            .then(([ls, cur]) => {
                if (!live) return;
                setLessons(ls.data || []);
                setCurrent(cur.data || (ls.data || [])[0] || null);
            })
            .catch(() => {});
        return () => {
            live = false;
        };
    }, [courseId, lessonId]);

    const idx = useMemo(
        () => lessons.findIndex((x) => x.LessonID === current?.LessonID),
        [lessons, current]
    );
    const next = lessons[idx + 1];

    const markDone = async () => {
        if (!current) return;
        await api.post(`/lessons/${current.LessonID}/complete`);
        if (next) {
            nav(`/courses/${courseId}/lesson/${next.LessonID}`);
        } else {
            alert("Great job! Course finished.");
            nav(`/courses/${courseId}`);
        }
    };

    if (!current)
        return (
            <div className="container">
                <p>Loading…</p>
            </div>
        );

    return (
        <div className="container">
            <nav className="crumbs">
                <Link to={`/courses/${courseId}`}>← Back to course</Link>
            </nav>

            <div className="player">
                <div className="video">
                    {/* Demo: nếu Content là link video/pdf, bạn có thể nhúng theo nhu cầu */}
                    <h2>{current.LName}</h2>
                    <p className="muted">
                        Type: {current.LessonType} • {current.DurationMin || 0}{" "}
                        min
                    </p>
                    <div className="content-box">
                        <p className="muted">
                            Content:{" "}
                            {current.Content || "(no content url provided)"}
                        </p>
                    </div>
                    <button className="btn primary" onClick={markDone}>
                        Mark as complete
                    </button>
                </div>

                <aside className="sidebar">
                    <ol>
                        {lessons.map((ls) => (
                            <li
                                key={ls.LessonID}
                                className={
                                    ls.LessonID === current.LessonID
                                        ? "active"
                                        : ""
                                }
                            >
                                <Link
                                    to={`/courses/${courseId}/lesson/${ls.LessonID}`}
                                >
                                    {ls.Ordinal}. {ls.LName}{" "}
                                    <span className="muted">
                                        ({ls.DurationMin || 0}m)
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ol>
                </aside>
            </div>
        </div>
    );
}

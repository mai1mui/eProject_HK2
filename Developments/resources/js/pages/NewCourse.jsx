import React, { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import s from "../../css/Courses.module.css";

/* Small inline icons */
const Star = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="#FFC531"
        aria-hidden="true"
    >
        <path d="M12 3l2.6 5.6 6.2.9-4.5 4.3 1.1 6.1L12 17.9 6.6 20l1.1-6.1L3.2 9.5l6.2-.9L12 3z" />
    </svg>
);
const Clock = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path
            d="M12 7v6l4 2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
        />
    </svg>
);
const Book = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
    >
        <path
            d="M4 5h11a3 3 0 013 3v11H7a3 3 0 01-3-3V5z"
            stroke="currentColor"
            strokeWidth="1.6"
        />
        <path
            d="M4 5h11v11H7a3 3 0 01-3-3V5z"
            stroke="currentColor"
            strokeWidth="1.6"
        />
    </svg>
);

/* Mock data — bạn nối API sau vẫn giữ layout này */
const ALL_COURSES = [
    {
        id: "react-essentials",
        title: "React Essentials",
        level: "Beginner",
        category: "Web Dev",
        tags: ["React", "JSX", "Hooks"],
        hours: 8,
        lessons: 24,
        rating: 4.8,
        instructor: "Jane Miller",
    },
    {
        id: "react-advanced",
        title: "Advanced React Patterns",
        level: "Advanced",
        category: "Web Dev",
        tags: ["Patterns", "Hooks", "Perf"],
        hours: 10,
        lessons: 30,
        rating: 4.7,
        instructor: "Eric Zhou",
    },
    {
        id: "nextjs-pro",
        title: "Next.js Full-Stack Pro",
        level: "Intermediate",
        category: "Web Dev",
        tags: ["Next.js", "SSR", "API"],
        hours: 12,
        lessons: 36,
        rating: 4.9,
        instructor: "Sofia Tran",
    },
    {
        id: "node-api",
        title: "Node.js REST API",
        level: "Intermediate",
        category: "Backend",
        tags: ["Node", "Express", "JWT"],
        hours: 9,
        lessons: 28,
        rating: 4.6,
        instructor: "Liam Clark",
    },
    {
        id: "ds-python",
        title: "Data Science with Python",
        level: "Beginner",
        category: "Data",
        tags: ["Pandas", "Numpy", "EDA"],
        hours: 14,
        lessons: 40,
        rating: 4.9,
        instructor: "Anya Gupta",
    },
    {
        id: "ml-found",
        title: "Machine Learning Foundations",
        level: "Intermediate",
        category: "Data",
        tags: ["ML", "Sklearn"],
        hours: 16,
        lessons: 48,
        rating: 4.7,
        instructor: "Carlos Vega",
    },
    {
        id: "ui-ux",
        title: "UI/UX Fundamentals",
        level: "Beginner",
        category: "Design",
        tags: ["Figma", "Wireframe"],
        hours: 7,
        lessons: 22,
        rating: 4.8,
        instructor: "Mina Park",
    },
    {
        id: "english-ielts",
        title: "IELTS Speaking Mastery",
        level: "Intermediate",
        category: "Languages",
        tags: ["IELTS", "Speaking"],
        hours: 6,
        lessons: 18,
        rating: 4.5,
        instructor: "David Nguyen",
    },
    {
        id: "sec-basics",
        title: "Cybersecurity Basics",
        level: "Beginner",
        category: "Security",
        tags: ["Threats", "2FA", "Network"],
        hours: 8,
        lessons: 24,
        rating: 4.6,
        instructor: "Priya Shah",
    },
    {
        id: "ds-sql",
        title: "Practical SQL for Analysts",
        level: "Beginner",
        category: "Data",
        tags: ["SQL", "Joins", "Window"],
        hours: 9,
        lessons: 26,
        rating: 4.7,
        instructor: "Omar Ali",
    },
    {
        id: "py-bootcamp",
        title: "Python Bootcamp",
        level: "Beginner",
        category: "Backend",
        tags: ["Python", "CLI", "OOP"],
        hours: 12,
        lessons: 32,
        rating: 4.8,
        instructor: "Sara Kim",
    },
    {
        id: "react-native",
        title: "React Native Apps",
        level: "Intermediate",
        category: "Mobile",
        tags: ["React Native", "Expo"],
        hours: 11,
        lessons: 30,
        rating: 4.6,
        instructor: "John Lee",
    },
];

/* Helpers */
const CATEGORIES = [
    "All",
    "Web Dev",
    "Backend",
    "Data",
    "Design",
    "Languages",
    "Security",
    "Mobile",
];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];
const SORTS = [
    { key: "relevance", label: "Relevance" },
    { key: "rating_desc", label: "Rating (high → low)" },
    { key: "hours_asc", label: "Duration (short → long)" },
    { key: "hours_desc", label: "Duration (long → short)" },
    { key: "title_asc", label: "Title (A → Z)" },
];

export default function Courses() {
    const [params, setParams] = useSearchParams();
    const [query, setQuery] = useState(params.get("q") || "");
    const [category, setCategory] = useState(params.get("cat") || "All");
    const [level, setLevel] = useState(params.get("lvl") || "All");
    const [sort, setSort] = useState(params.get("sort") || "relevance");
    const [page, setPage] = useState(Number(params.get("p") || 1));
    const pageSize = 9;

    /* Sync URL params for shareability */
    useEffect(() => {
        const next = new URLSearchParams();
        if (query) next.set("q", query);
        if (category !== "All") next.set("cat", category);
        if (level !== "All") next.set("lvl", level);
        if (sort !== "relevance") next.set("sort", sort);
        if (page !== 1) next.set("p", String(page));
        setParams(next, { replace: true });
    }, [query, category, level, sort, page, setParams]);

    const filtered = useMemo(() => {
        let list = ALL_COURSES.slice();

        if (category !== "All")
            list = list.filter((c) => c.category === category);
        if (level !== "All") list = list.filter((c) => c.level === level);

        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(
                (c) =>
                    c.title.toLowerCase().includes(q) ||
                    c.tags.join(" ").toLowerCase().includes(q) ||
                    c.instructor.toLowerCase().includes(q)
            );
        }

        switch (sort) {
            case "rating_desc":
                list.sort((a, b) => b.rating - a.rating);
                break;
            case "hours_asc":
                list.sort((a, b) => a.hours - b.hours);
                break;
            case "hours_desc":
                list.sort((a, b) => b.hours - a.hours);
                break;
            case "title_asc":
                list.sort((a, b) => a.title.localeCompare(b.title));
                break;
            default:
                /* relevance */ break;
        }
        return list;
    }, [query, category, level, sort]);

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);

    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [totalPages, page]);

    return (
        <div className={s.page}>
            <div className={`${s.container} ${s.header}`}>
                <h1 className={s.title}>Public Courses</h1>
                <p className={s.subtitle}>
                    Browse top-rated courses curated by our instructors.
                </p>

                {/* Controls */}
                <div className={s.controls}>
                    <div className={s.search} role="search">
                        <svg
                            className={s.searchIcon}
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <circle
                                cx="11"
                                cy="11"
                                r="7"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />
                            <path
                                d="M16.5 16.5L21 21"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                        <input
                            className={s.input}
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search courses (e.g., React, Data Science, IELTS)…"
                            aria-label="Search courses"
                        />
                    </div>

                    <select
                        className={s.select}
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setPage(1);
                        }}
                        aria-label="Filter by category"
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                    <select
                        className={s.select}
                        value={level}
                        onChange={(e) => {
                            setLevel(e.target.value);
                            setPage(1);
                        }}
                        aria-label="Filter by level"
                    >
                        {LEVELS.map((l) => (
                            <option key={l} value={l}>
                                {l}
                            </option>
                        ))}
                    </select>
                    <select
                        className={s.select}
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            setPage(1);
                        }}
                        aria-label="Sort courses"
                    >
                        {SORTS.map((sv) => (
                            <option key={sv.key} value={sv.key}>
                                {sv.label}
                            </option>
                        ))}
                    </select>

                    <span className={s.counter} aria-live="polite">
                        {total} course{sPlural(total)}
                    </span>
                </div>

                {/* Quick chips (optional shortcuts) */}
                <div className={s.chips}>
                    {["React", "Next.js", "Python", "SQL", "IELTS"].map((x) => (
                        <button
                            key={x}
                            className={`${s.chip} ${
                                query.toLowerCase() === x.toLowerCase()
                                    ? s.chipActive
                                    : ""
                            }`}
                            onClick={() => {
                                setQuery(x);
                                setPage(1);
                            }}
                        >
                            {x}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className={s.container}>
                <div className={s.grid}>
                    {pageItems.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>

                {/* Pagination */}
                <nav className={s.pager} aria-label="Pagination">
                    <button
                        className={s.pageBtn}
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        aria-label="Previous page"
                    >
                        ‹
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const n = i + 1;
                        return (
                            <button
                                key={n}
                                className={`${s.pageBtn} ${
                                    n === page ? s.current : ""
                                }`}
                                onClick={() => setPage(n)}
                                aria-current={n === page ? "page" : undefined}
                            >
                                {n}
                            </button>
                        );
                    })}
                    <button
                        className={s.pageBtn}
                        disabled={page >= totalPages}
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        aria-label="Next page"
                    >
                        ›
                    </button>
                </nav>
            </div>
        </div>
    );
}

/* ===== Course Card Component ===== */
function CourseCard({ course }) {
    return (
        <article className={s.card}>
            <Link
                to={`/courses/${course.id}`}
                aria-label={`Open course ${course.title}`}
            >
                <div className={s.thumb} />
            </Link>

            <div className={s.body}>
                <div className={s.titleRow}>
                    <span className={s.badge}>
                        {course.level.toUpperCase()}
                    </span>
                    <h3 className={s.cardTitle}>{course.title}</h3>
                </div>

                <div className={s.meta}>
                    <span
                        className={s.rating}
                        title={`${course.rating} out of 5`}
                    >
                        <Star />
                        <span>{course.rating}</span>
                    </span>
                    <span className={s.dot}>•</span>
                    <span title="Duration">
                        <Clock /> {course.hours}h
                    </span>
                    <span className={s.dot}>•</span>
                    <span title="Lessons">
                        <Book /> {course.lessons} lessons
                    </span>
                </div>

                <div className={s.tags}>
                    <span className={s.tag}>{course.category}</span>
                    {course.tags.map((t) => (
                        <span className={s.tag} key={t}>
                            {t}
                        </span>
                    ))}
                </div>

                <div className={s.footer}>
                    <Link
                        className={`${s.btn} ${s.primary}`}
                        to={`/courses/${course.id}`}
                    >
                        View details
                    </Link>
                    <Link className={s.btn} to={`/enroll/${course.id}`}>
                        Enroll
                    </Link>
                    <span style={{ marginLeft: "auto", color: "var(--muted)" }}>
                        By {course.instructor}
                    </span>
                </div>
            </div>
        </article>
    );
}

/* plural helper */
function sPlural(n) {
    return n === 1 ? "" : "s";
}

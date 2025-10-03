import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/UserManagement.css";
import "../../css/QuizBuilder.css";

const API = "http://127.0.0.1:8000/api";

/* ----------------------------- Helpers ----------------------------- */
const fmtDateTime = (s) => {
    if (!s) return "-";
    const str = String(s).includes(" ")
        ? String(s).replace(" ", "T")
        : String(s);
    const d = new Date(str);
    return isNaN(d.getTime()) ? String(s) : d.toLocaleString();
};
const badgeStatusClass = (st) => {
    if (!st) return "pill gray";
    const key = String(st).toLowerCase();
    if (["paid", "active", "published"].includes(key)) return "pill learner";
    if (["processing", "pending"].includes(key)) return "pill instructor";
    return "pill gray";
};

/* =========================================================================
   QUIZ PREVIEW (đọc-only)
   ========================================================================= */
function QuizPreview({ show, onClose, lessonId, title, questions }) {
    if (!show) return null;

    return (
        <div className="qb-modal" onClick={onClose}>
            <div className="qb-card" onClick={(e) => e.stopPropagation()}>
                <div className="qb-head">
                    <div className="qb-title">
                        Preview — {title || lessonId}
                    </div>
                    <div className="qb-head-actions">
                        <button
                            className="qb-btn ghost qb-mini"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>

                <div className="qp-body">
                    {!questions?.length ? (
                        <div className="qp-empty">No questions.</div>
                    ) : (
                        questions.map((q, idx) => (
                            <div key={q.id || idx} className="qb-question">
                                <div className="qp-counter">
                                    Question {idx + 1}
                                </div>
                                {q.imageUrl ? (
                                    <div className="qp-qimg-wrap">
                                        <img
                                            className="qp-qimg"
                                            src={q.imageUrl}
                                            alt=""
                                        />
                                    </div>
                                ) : null}
                                <div className="qp-qtext">
                                    {q.question || "(no text)"}
                                </div>
                                <div className="qp-options">
                                    {(q.options || []).map((op, i) => (
                                        <label className="qp-option" key={i}>
                                            <input
                                                type="checkbox"
                                                disabled
                                                checked={!!op.correct}
                                            />
                                            <span>
                                                {op.text || `Option ${i + 1}`}
                                            </span>
                                            {op.imageUrl ? (
                                                <img
                                                    className="qp-oimg"
                                                    src={op.imageUrl}
                                                    alt=""
                                                />
                                            ) : null}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

/* =========================================================================
   QUIZ BUILDER (nhiều đáp án đúng)
   ========================================================================= */
function QuizBuilder({
    show,
    onClose,
    lessonId,
    lessonTitle,
    value,
    setValue,
    onSave,
    onPreview,
    headers,
}) {
    const questions = value || [];

    const setQ = (qi, patch) => {
        const next = [...questions];
        next[qi] = { ...next[qi], ...patch };
        setValue(next);
    };

    const setOpt = (qi, oi, patch) => {
        const next = [...questions];
        const opts = [...(next[qi].options || [])];
        opts[oi] = { ...opts[oi], ...patch };
        next[qi].options = opts;
        setValue(next);
    };

    const addQuestion = () =>
        setValue([
            ...questions,
            {
                id: Date.now(),
                question: "",
                imageUrl: "",
                options: [
                    { text: "", imageUrl: "", correct: false },
                    { text: "", imageUrl: "", correct: false },
                ],
            },
        ]);

    const removeQuestion = (qi) => {
        const next = [...questions];
        next.splice(qi, 1);
        setValue(next);
    };

    const addOption = (qi) => {
        const next = [...questions];
        next[qi].options = [
            ...(next[qi].options || []),
            { text: "", imageUrl: "", correct: false },
        ];
        setValue(next);
    };

    const removeOption = (qi, oi) => {
        const next = [...questions];
        const opts = [...(next[qi].options || [])];
        opts.splice(oi, 1);
        next[qi].options = opts.length
            ? opts
            : [{ text: "", imageUrl: "", correct: false }];
        setValue(next);
    };

    const uploadImage = async (file, cb) => {
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("kind", "image");
            const res = await axios.post(`${API}/admin/uploads`, fd, {
                headers: { ...headers, "Content-Type": "multipart/form-data" },
            });
            cb?.(res.data?.url || "");
        } catch (e) {
            console.error(e);
            alert("Upload image failed");
        }
    };

    if (!show) return null;

    return (
        <div className="qb-modal" onClick={onClose}>
            <div className="qb-card" onClick={(e) => e.stopPropagation()}>
                <div className="qb-head">
                    <div className="qb-title">
                        Quiz Builder — {lessonTitle || lessonId}
                    </div>
                    <div className="qb-head-actions">
                        <button
                            className="qb-btn secondary qb-mini"
                            onClick={onPreview}
                        >
                            Preview
                        </button>
                        <button className="qb-close" onClick={onClose}>
                            ✕
                        </button>
                    </div>
                </div>

                <div className="qb-body">
                    {/* LEFT (scroll) */}
                    <div className="qb-col qb-scroll">
                        {!questions.length && (
                            <div
                                className="qb-chip"
                                style={{ marginBottom: 12 }}
                            >
                                Chưa có câu hỏi nào. Nhấn{" "}
                                <strong>+ Add question</strong> ở cột phải để
                                bắt đầu.
                            </div>
                        )}
                        {questions.map((q, qi) => (
                            <div className="qb-question" key={q.id || qi}>
                                <div
                                    className="qb-row"
                                    style={{ marginBottom: 8 }}
                                >
                                    <div className="qb-label">Question</div>
                                    <span className="qb-badge">#{qi + 1}</span>
                                </div>

                                <input
                                    className="qb-input"
                                    placeholder="Type your question…"
                                    value={q.question || ""}
                                    onChange={(e) =>
                                        setQ(qi, { question: e.target.value })
                                    }
                                />

                                <div
                                    className="qb-label"
                                    style={{ marginTop: 8 }}
                                >
                                    Question image (optional)
                                </div>
                                <div className="qb-upload">
                                    {q.imageUrl ? (
                                        <img
                                            className="qb-thumb"
                                            src={q.imageUrl}
                                            alt=""
                                        />
                                    ) : (
                                        <div className="qb-thumb" />
                                    )}
                                    <input
                                        className="qb-input"
                                        placeholder="Paste image URL…"
                                        value={q.imageUrl || ""}
                                        onChange={(e) =>
                                            setQ(qi, {
                                                imageUrl: e.target.value,
                                            })
                                        }
                                    />
                                    <label className="qb-btn qb-mini">
                                        Upload
                                        <input
                                            className="qb-file"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                e.target.files?.[0] &&
                                                uploadImage(
                                                    e.target.files[0],
                                                    (url) =>
                                                        setQ(qi, {
                                                            imageUrl: url,
                                                        })
                                                )
                                            }
                                        />
                                    </label>
                                    <button
                                        className="qb-btn danger qb-mini"
                                        onClick={() => removeQuestion(qi)}
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div
                                    className="qb-label"
                                    style={{ marginTop: 12 }}
                                >
                                    Options
                                </div>

                                {(q.options || []).map((op, oi) => (
                                    <div className="qb-option" key={oi}>
                                        <input
                                            className="qb-input"
                                            placeholder={`Option ${oi + 1}`}
                                            value={op.text || ""}
                                            onChange={(e) =>
                                                setOpt(qi, oi, {
                                                    text: e.target.value,
                                                })
                                            }
                                        />

                                        {/* checkbox = nhiều đáp án đúng */}
                                        <input
                                            className="qb-radio"
                                            type="checkbox"
                                            checked={!!op.correct}
                                            title="Mark as correct"
                                            onChange={() =>
                                                setOpt(qi, oi, {
                                                    correct: !op.correct,
                                                })
                                            }
                                        />

                                        <div className="qb-inline">
                                            <label className="qb-btn secondary qb-mini">
                                                Img
                                                <input
                                                    className="qb-file"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) =>
                                                        e.target.files?.[0] &&
                                                        uploadImage(
                                                            e.target.files[0],
                                                            (url) =>
                                                                setOpt(qi, oi, {
                                                                    imageUrl:
                                                                        url,
                                                                })
                                                        )
                                                    }
                                                />
                                            </label>
                                            <button
                                                className="qb-btn danger qb-mini"
                                                onClick={() =>
                                                    removeOption(qi, oi)
                                                }
                                            >
                                                –
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div className="qb-actions">
                                    <button
                                        className="qb-btn ghost"
                                        onClick={() => addOption(qi)}
                                    >
                                        + Add option
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT */}
                    <div className="qb-col">
                        <div className="qb-chip" style={{ marginBottom: 10 }}>
                            <div className="qb-label">LessonID:</div>
                            <div style={{ fontWeight: 700 }}>{lessonId}</div>
                        </div>

                        <div className="qb-helper" style={{ marginBottom: 12 }}>
                            Dán URL ảnh hoặc dùng Upload. Ảnh lưu tại
                            <code> /storage/lessons/images</code>.
                        </div>

                        <div
                            className="qb-actions"
                            style={{ position: "sticky", top: 0 }}
                        >
                            <button className="qb-btn" onClick={addQuestion}>
                                + Add question
                            </button>
                            <button
                                className="qb-btn secondary"
                                onClick={onPreview}
                            >
                                Preview
                            </button>
                            <button className="qb-btn" onClick={onSave}>
                                Save quiz
                            </button>
                            <button className="qb-btn ghost" onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* =========================================================================
   MAIN: LESSON MANAGEMENT
   ========================================================================= */
export default function LessonManagement() {
    const navigate = useNavigate();

    // Filters/Search/Paging
    const [courseFilter, setCourseFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [query, setQuery] = useState("");

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // Data
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modals
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [current, setCurrent] = useState(null);

    // Courses
    const [courses, setCourses] = useState([]);
    const [courseLoading, setCourseLoading] = useState(false);

    // Quiz builder
    const [openQB, setOpenQB] = useState(false);
    const [qbLessonId, setQbLessonId] = useState("");
    const [qbLessonTitle, setQbLessonTitle] = useState("");
    const [qbQuestions, setQbQuestions] = useState([]);
    const [openPreview, setOpenPreview] = useState(false);

    const headers = useMemo(
        () => ({
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        }),
        []
    );

    /* ---------- fetch courses ---------- */
    const fetchCourses = async () => {
        setCourseLoading(true);
        try {
            const res = await axios.get(`${API}/courses`, {
                params: { per_page: 1000 },
                headers,
            });
            const data = Array.isArray(res.data)
                ? res.data
                : res.data.data || res.data.items || [];
            const mapped = data.map((c) => ({
                id: c.CourseID,
                name: c.CName || c.CourseID,
            }));
            setCourses(mapped);
        } catch (e) {
            console.error("Fetch courses failed", e);
            setCourses([]);
        } finally {
            setCourseLoading(false);
        }
    };

    /* ---------- fetch lessons ---------- */
    const fetchLessons = async (newPage = 1) => {
        setLoading(true);
        try {
            const params = { page: newPage, per_page: perPage };
            if (query) params.search = query;
            if (courseFilter) params.course = courseFilter;
            if (typeFilter) params.type = typeFilter;
            if (statusFilter) params.status = statusFilter;

            const res = await axios.get(`${API}/lessons`, { params, headers });

            let data = Array.isArray(res.data)
                ? res.data
                : res.data.data || res.data.items || [];
            let metaTotal = res.data.total ?? data.length;
            let metaPer = res.data.per_page ?? perPage;
            let metaPage = res.data.current_page ?? newPage;

            if (Array.isArray(res.data)) {
                data = data.filter((r) => {
                    const byCourse = courseFilter
                        ? String(r.CourseID || "").toLowerCase() ===
                          courseFilter.toLowerCase()
                        : true;
                    const byType = typeFilter
                        ? String(r.LessonType || "").toLowerCase() ===
                          typeFilter.toLowerCase()
                        : true;
                    const byStatus = statusFilter
                        ? String(r.LStatus || "").toLowerCase() ===
                          statusFilter.toLowerCase()
                        : true;
                    const q = query.toLowerCase();
                    const byQuery = query
                        ? String(r.LessonID || "")
                              .toLowerCase()
                              .includes(q) ||
                          String(r.LName || "")
                              .toLowerCase()
                              .includes(q) ||
                          String(r.Content || "")
                              .toLowerCase()
                              .includes(q)
                        : true;
                    return byCourse && byType && byStatus && byQuery;
                });
                metaTotal = data.length;
                const start = (newPage - 1) * perPage;
                data = data.slice(start, start + perPage);
                metaPer = perPage;
                metaPage = newPage;
            }

            setRows(data);
            setTotal(metaTotal);
            setPerPage(metaPer);
            setPage(metaPage);
        } catch (e) {
            console.error(e);
            alert("Failed to load lessons.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLessons(1);
        fetchCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [perPage]);

    /* ---------- CRUD: create ---------- */
    const [createForm, setCreateForm] = useState({
        LessonID: "",
        CourseID: "",
        LName: "",
        Content: "",
        LessonType: "Video",
        Ordinal: 1,
        LStatus: "Paid",
    });

    const submitCreate = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...createForm,
                Ordinal: Number(createForm.Ordinal) || 0,
            };
            await axios.post(`${API}/lessons`, payload, { headers });
            alert("Created successfully!");
            setOpenCreate(false);
            setCreateForm({
                LessonID: "",
                CourseID: "",
                LName: "",
                Content: "",
                LessonType: "Video",
                Ordinal: 1,
                LStatus: "Paid",
            });
            fetchLessons(page);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Create failed!");
        }
    };

    /* ---------- CRUD: edit ---------- */
    const [editForm, setEditForm] = useState({
        CourseID: "",
        LName: "",
        Content: "",
        LessonType: "",
        Ordinal: "",
        LStatus: "",
    });

    const openEditModal = (row) => {
        setCurrent(row);
        setEditForm({
            CourseID: row.CourseID || "",
            LName: row.LName || "",
            Content: row.Content || "",
            LessonType: row.LessonType || "",
            Ordinal: row.Ordinal ?? "",
            LStatus: row.LStatus || "",
        });
        setOpenEdit(true);
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        if (!current) return;
        try {
            const payload = {
                ...editForm,
                Ordinal: Number(editForm.Ordinal) || 0,
            };
            await axios.put(`${API}/lessons/${current.LessonID}`, payload, {
                headers,
            });
            alert("Updated successfully!");
            setOpenEdit(false);
            setCurrent(null);
            fetchLessons(page);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Update failed!");
        }
    };

    /* ---------- CRUD: delete ---------- */
    const confirmDelete = (row) => {
        setCurrent(row);
        setOpenDelete(true);
    };
    const doDelete = async () => {
        if (!current) return;
        try {
            await axios.delete(`${API}/lessons/${current.LessonID}`, {
                headers,
            });
            alert("Deleted successfully!");
            setOpenDelete(false);
            setCurrent(null);
            const lastPage = Math.max(1, Math.ceil((total - 1) / perPage));
            fetchLessons(Math.min(page, lastPage));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Delete failed!");
        }
    };

    /* ---------- QUIZ: open builder / preview / save ---------- */
    const openQuizFor = async (lesson) => {
        try {
            setQbLessonId(lesson.LessonID);
            setQbLessonTitle(lesson.LName || "");
            const res = await axios.get(
                `${API}/admin/quizzes/${lesson.LessonID}`,
                {
                    headers,
                }
            );
            // convert answerIndex -> multi-correct flags (back-compat)
            let qs = res.data?.questions || [];
            qs = qs.map((q) => {
                let options = Array.isArray(q.options) ? q.options : [];
                if (typeof q.answerIndex === "number") {
                    options = options.map((op, i) => ({
                        ...op,
                        correct: i === q.answerIndex,
                    }));
                    delete q.answerIndex;
                } else {
                    options = options.map((op) => ({ correct: false, ...op }));
                }
                return {
                    id: q.id || Date.now(),
                    question: "",
                    imageUrl: "",
                    ...q,
                    options,
                };
            });
            setQbQuestions(qs);
            setOpenQB(true);
        } catch (e) {
            // Không có file quiz -> tạo mới rỗng
            setQbLessonId(lesson.LessonID);
            setQbLessonTitle(lesson.LName || "");
            setQbQuestions([]);
            setOpenQB(true);
        }
    };

    const saveQuiz = async () => {
        try {
            // optional: cảnh báo nếu có câu chưa chọn đáp án đúng
            const hasAtLeastOne = qbQuestions.every((q) =>
                (q.options || []).some((op) => op.correct)
            );
            if (!hasAtLeastOne) {
                const ok = window.confirm(
                    "Có câu hỏi chưa chọn đáp án đúng. Vẫn lưu chứ?"
                );
                if (!ok) return;
            }

            await axios.post(
                `${API}/admin/quizzes`,
                { LessonID: qbLessonId, questions: qbQuestions },
                { headers }
            );
            alert("Quiz saved!");
            setOpenQB(false);
        } catch (e) {
            console.error(e);
            alert("Save quiz failed.");
        }
    };

    const openPreviewFor = async (lesson) => {
        try {
            setQbLessonId(lesson.LessonID);
            setQbLessonTitle(lesson.LName || "");
            const res = await axios.get(
                `${API}/admin/quizzes/${lesson.LessonID}`,
                {
                    headers,
                }
            );
            let qs = res.data?.questions || [];
            qs = qs.map((q) => {
                let options = Array.isArray(q.options) ? q.options : [];
                if (typeof q.answerIndex === "number") {
                    options = options.map((op, i) => ({
                        ...op,
                        correct: i === q.answerIndex,
                    }));
                    delete q.answerIndex;
                } else {
                    options = options.map((op) => ({ correct: false, ...op }));
                }
                return {
                    id: q.id || Date.now(),
                    question: "",
                    imageUrl: "",
                    ...q,
                    options,
                };
            });
            setQbQuestions(qs);
            setOpenPreview(true);
        } catch (e) {
            console.error(e);
            alert("Cannot load quiz file.");
        }
    };

    const totalPages = Math.max(1, Math.ceil(total / perPage));

    /* ============================== RENDER ============================== */
    return (
        <div className="card-section">
            {/* Header */}
            <div className="um-header">
                <div className="um-title">Lesson Management</div>

                <div className="um-row1">
                    <div className="um-filters">
                        <select
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                            onFocus={() =>
                                !courses.length &&
                                !courseLoading &&
                                fetchCourses()
                            }
                        >
                            <option value="">
                                {courseLoading
                                    ? "Loading courses…"
                                    : courses.length
                                    ? "-- Filter by Course --"
                                    : "No course"}
                            </option>
                            {courses.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.id} — {c.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="">-- Filter by Type --</option>
                            <option value="Video">Video</option>
                            <option value="Quiz">Quiz</option>
                            <option value="Assignment">Assignment</option>
                            <option value="Doc">Doc</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">-- Filter by Status --</option>
                            <option value="Paid">Paid</option>
                            <option value="Processing">Processing</option>
                            <option value="Not Confirmed">Not Confirmed</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="search-box">
                        <input
                            placeholder="Search by lesson id/name/content…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && fetchLessons(1)
                            }
                        />
                        <button
                            className="btn sm"
                            onClick={() => fetchLessons(1)}
                        >
                            Search
                        </button>
                    </div>
                </div>

                <div className="um-row2">
                    <button className="btn" onClick={() => setOpenCreate(true)}>
                        + Add new lesson
                    </button>

                    <button
                        className="btn ghost"
                        onClick={() => navigate("/admin")}
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ width: 60 }}>#</th>
                            <th>LessonID</th>
                            <th>CourseID</th>
                            <th>Lesson name</th>
                            <th>Content</th>
                            <th>Type</th>
                            <th>Ordinal</th>
                            <th>Status</th>
                            <th>Date created</th>
                            <th style={{ width: 220 }} className="center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={10} className="center muted">
                                    Loading...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="center muted">
                                    No data
                                </td>
                            </tr>
                        ) : (
                            rows.map((r, idx) => (
                                <tr key={r.LessonID || idx}>
                                    <td>{(page - 1) * perPage + idx + 1}</td>
                                    <td className="muted">{r.LessonID}</td>
                                    <td className="muted">{r.CourseID}</td>
                                    <td>{r.LName}</td>
                                    <td>
                                        <span className="muted">
                                            {r.Content}
                                        </span>
                                    </td>
                                    <td>{r.LessonType}</td>
                                    <td className="center">{r.Ordinal}</td>
                                    <td>
                                        <span
                                            className={badgeStatusClass(
                                                r.LStatus
                                            )}
                                        >
                                            {r.LStatus}
                                        </span>
                                    </td>
                                    <td className="muted">
                                        {fmtDateTime(
                                            r.CreatedAt || r.created_at || ""
                                        )}
                                    </td>
                                    <td className="center">
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: 8,
                                                justifyContent: "center",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <button
                                                className="btn sm"
                                                onClick={() => openEditModal(r)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn sm danger"
                                                onClick={() => confirmDelete(r)}
                                            >
                                                Delete
                                            </button>

                                            {/* Chỉ hiện khi là bài Quiz */}
                                            {String(
                                                r.LessonType
                                            ).toLowerCase() === "quiz" && (
                                                <>
                                                    <button
                                                        className="btn sm"
                                                        onClick={() =>
                                                            openQuizFor(r)
                                                        }
                                                    >
                                                        Quiz
                                                    </button>
                                                    <button
                                                        className="btn sm ghost"
                                                        onClick={() =>
                                                            openPreviewFor(r)
                                                        }
                                                    >
                                                        Preview
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button
                    className="btn sm ghost"
                    disabled={page <= 1 || loading}
                    onClick={() => fetchLessons(page - 1)}
                >
                    ← Prev
                </button>

                <span className="muted">
                    Page {page} / {totalPages}
                </span>

                <button
                    className="btn sm ghost"
                    disabled={page >= totalPages || loading}
                    onClick={() => fetchLessons(page + 1)}
                >
                    Next →
                </button>

                <select
                    className="pp"
                    value={perPage}
                    onChange={(e) =>
                        setPerPage(parseInt(e.target.value || "10", 10))
                    }
                >
                    <option value={5}>5 / page</option>
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                    <option value={50}>50 / page</option>
                </select>
            </div>

            {/* Create */}
            {openCreate && (
                <div
                    className="modal-overlay"
                    onClick={() => setOpenCreate(false)}
                >
                    <div
                        className="modal-profile"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="profile-header-modal">
                            <h2>Create new lesson</h2>
                            <p className="muted">
                                Use this form to add a new lesson
                            </p>
                        </div>

                        <form
                            className="settings-form1"
                            onSubmit={submitCreate}
                        >
                            <div className="form-section1">
                                <div className="form-group1">
                                    <label>LessonID</label>
                                    <input
                                        value={createForm.LessonID}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                LessonID: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Course</label>
                                    <select
                                        value={createForm.CourseID}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                CourseID: e.target.value,
                                            })
                                        }
                                        onFocus={() =>
                                            !courses.length &&
                                            !courseLoading &&
                                            fetchCourses()
                                        }
                                    >
                                        <option value="">
                                            {courseLoading
                                                ? "Loading…"
                                                : courses.length
                                                ? "-- Select course --"
                                                : "No course"}
                                        </option>
                                        {courses.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.id} — {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        placeholder="Or type CourseID (e.g. CCPL001)"
                                        style={{ marginTop: 8 }}
                                        value={createForm.CourseID}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                CourseID: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Lesson name</label>
                                    <input
                                        value={createForm.LName}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                LName: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Content (URL or file key)</label>
                                    <input
                                        placeholder="VD: link:intro01.pdf hoặc https://…"
                                        value={createForm.Content}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                Content: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Lesson type</label>
                                    <select
                                        value={createForm.LessonType}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                LessonType: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Video">Video</option>
                                        <option value="Quiz">Quiz</option>
                                        <option value="Assignment">
                                            Assignment
                                        </option>
                                        <option value="Doc">Doc</option>
                                    </select>
                                </div>

                                <div className="form-group1">
                                    <label>Ordinal</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={createForm.Ordinal}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                Ordinal: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Status</label>
                                    <select
                                        value={createForm.LStatus}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                LStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Paid">Paid</option>
                                        <option value="Processing">
                                            Processing
                                        </option>
                                        <option value="Not Confirmed">
                                            Not Confirmed
                                        </option>
                                        <option value="Inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button
                                    type="button"
                                    className="btn ghost"
                                    onClick={() => setOpenCreate(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit */}
            {openEdit && (
                <div
                    className="modal-overlay"
                    onClick={() => setOpenEdit(false)}
                >
                    <div
                        className="modal-profile"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="profile-header-modal">
                            <h2>Edit lesson</h2>
                            <p className="muted">Update the selected lesson</p>
                        </div>

                        <form className="settings-form1" onSubmit={submitEdit}>
                            <div className="form-section1">
                                <div className="form-group1">
                                    <label>Course</label>
                                    <select
                                        value={editForm.CourseID}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                CourseID: e.target.value,
                                            })
                                        }
                                        onFocus={() =>
                                            !courses.length &&
                                            !courseLoading &&
                                            fetchCourses()
                                        }
                                    >
                                        <option value="">
                                            {courseLoading
                                                ? "Loading…"
                                                : courses.length
                                                ? "-- Select course --"
                                                : "No course"}
                                        </option>
                                        {courses.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.id} — {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        placeholder="Or type CourseID"
                                        style={{ marginTop: 8 }}
                                        value={editForm.CourseID}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                CourseID: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Lesson name</label>
                                    <input
                                        value={editForm.LName}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                LName: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Content</label>
                                    <input
                                        value={editForm.Content}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                Content: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Lesson type</label>
                                    <select
                                        value={editForm.LessonType}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                LessonType: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Video">Video</option>
                                        <option value="Quiz">Quiz</option>
                                        <option value="Assignment">
                                            Assignment
                                        </option>
                                        <option value="Doc">Doc</option>
                                    </select>
                                </div>

                                <div className="form-group1">
                                    <label>Ordinal</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={editForm.Ordinal}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                Ordinal: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Status</label>
                                    <select
                                        value={editForm.LStatus}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                LStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Paid">Paid</option>
                                        <option value="Processing">
                                            Processing
                                        </option>
                                        <option value="Not Confirmed">
                                            Not Confirmed
                                        </option>
                                        <option value="Inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button
                                    type="button"
                                    className="btn ghost"
                                    onClick={() => setOpenEdit(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn">
                                    Save changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete confirm */}
            {openDelete && (
                <div
                    className="modal-overlay"
                    onClick={() => setOpenDelete(false)}
                >
                    <div
                        className="modal-profile"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="profile-header-modal">
                            <h2>Delete lesson</h2>
                            <p className="muted">
                                Are you sure you want to delete{" "}
                                <strong>{current?.LName}</strong> (
                                {current?.LessonID})?
                            </p>
                        </div>
                        <div className="profile-actions">
                            <button
                                className="btn ghost"
                                onClick={() => setOpenDelete(false)}
                            >
                                Cancel
                            </button>
                            <button className="btn danger" onClick={doDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Quiz Builder */}
            <QuizBuilder
                show={openQB}
                onClose={() => setOpenQB(false)}
                lessonId={qbLessonId}
                lessonTitle={qbLessonTitle}
                value={qbQuestions}
                setValue={setQbQuestions}
                onSave={saveQuiz}
                onPreview={() => {
                    setOpenQB(false);
                    setOpenPreview(true);
                }}
                headers={headers}
            />

            {/* Preview */}
            <QuizPreview
                show={openPreview}
                onClose={() => setOpenPreview(false)}
                lessonId={qbLessonId}
                title={qbLessonTitle}
                questions={qbQuestions}
            />
        </div>
    );
}

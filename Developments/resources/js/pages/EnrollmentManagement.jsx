import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../css/UserManagement.css"; // tái dùng style hiện có

const API = "http://127.0.0.1:8000/api";

export default function EnrollmentManagement() {
    const navigate = useNavigate();
    const location = useLocation();

    // ===== Filters/Search/Paging =====
    const [courseFilter, setCourseFilter] = useState("");
    const [accountFilter, setAccountFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [query, setQuery] = useState("");

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // ===== Data =====
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    // ===== Selection for bulk actions =====
    const [selected, setSelected] = useState({});
    const selectedIds = Object.entries(selected)
        .filter(([, v]) => v)
        .map(([k]) => k);

    // ===== Dropdown data =====
    const [courses, setCourses] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loadingMeta, setLoadingMeta] = useState(false);

    // ===== Modals =====
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [current, setCurrent] = useState(null);

    // ===== Auth header =====
    const headers = useMemo(
        () => ({
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        }),
        []
    );

    // ===== Helpers =====
    const fmtDateTime = (s) => {
        if (!s) return "-";
        const str = String(s).includes(" ")
            ? String(s).replace(" ", "T")
            : String(s);
        const d = new Date(str);
        return isNaN(d.getTime()) ? String(s) : d.toLocaleString();
    };

    const normalizeDTForAPI = (s) => {
        if (!s) return null;
        return s.replace("T", " ") + ":00";
    };

    const badgeStatusClass = (st) => {
        if (!st) return "pill gray";
        const key = String(st).toLowerCase();
        if (key === "paid") return "pill learner";
        if (key === "processing") return "pill instructor";
        if (key === "not confirmed") return "pill gray";
        if (key === "refunded" || key === "canceled") return "pill danger";
        return "pill gray";
    };

    const resetSelection = () => setSelected({});

    // ===== Fetch dropdowns (courses + accounts) =====
    const fetchMeta = async () => {
        setLoadingMeta(true);
        try {
            const [c, a] = await Promise.all([
                axios.get(`${API}/courses`, {
                    params: { per_page: 1000 },
                    headers,
                }),
                axios.get(`${API}/users`, {
                    params: { per_page: 1000 },
                    headers,
                }),
            ]);

            const coursesData = Array.isArray(c.data)
                ? c.data
                : c.data.data || [];
            const usersData = Array.isArray(a.data)
                ? a.data
                : a.data.data || [];

            setCourses(
                coursesData.map((x) => ({
                    id: x.CourseID,
                    name: x.CName || x.CourseID,
                }))
            );
            setAccounts(
                usersData.map((u) => ({
                    id: u.AccountID,
                    name: u.AName || u.Email || u.AccountID,
                }))
            );
        } catch (e) {
            console.error(
                "Fetch meta failed:",
                e?.response?.status,
                e?.response?.data
            );
            setCourses([]);
            setAccounts([]);
        } finally {
            setLoadingMeta(false);
        }
    };

    // ===== Fetch enrollments =====
    const fetchEnrollments = async (newPage = 1) => {
        setLoading(true);
        try {
            const params = { page: newPage, per_page: perPage };
            if (query) params.search = query;
            if (courseFilter) params.course = courseFilter;
            if (accountFilter) params.account = accountFilter;
            if (statusFilter) params.status = statusFilter;

            const res = await axios.get(`${API}/enrollments`, {
                params,
                headers,
            });

            let data = Array.isArray(res.data) ? res.data : res.data.data || [];
            let metaTotal = res.data.total ?? data.length;
            let metaPer = res.data.per_page ?? perPage;
            let metaPage = res.data.current_page ?? newPage;

            if (Array.isArray(res.data)) {
                // fallback client filter nếu BE trả mảng thô
                data = data.filter((r) => {
                    const byCourse = courseFilter
                        ? String(r.CourseID).toLowerCase() ===
                          String(courseFilter).toLowerCase()
                        : true;
                    const byAccount = accountFilter
                        ? String(r.AccountID).toLowerCase() ===
                          String(accountFilter).toLowerCase()
                        : true;
                    const byStatus = statusFilter
                        ? String(r.EStatus || "").toLowerCase() ===
                          String(statusFilter).toLowerCase()
                        : true;
                    const q = query.toLowerCase();
                    const byQuery = query
                        ? String(r.EnrollmentID || "")
                              .toLowerCase()
                              .includes(q) ||
                          String(r.AccountID || "")
                              .toLowerCase()
                              .includes(q) ||
                          String(r.CourseID || "")
                              .toLowerCase()
                              .includes(q)
                        : true;
                    return byCourse && byAccount && byStatus && byQuery;
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
            resetSelection();
        } catch (e) {
            console.error(
                "GET /api/enrollments failed:",
                e?.response?.status,
                e?.response?.data
            );
            alert(
                `Failed to load enrollments${
                    e?.response?.status ? ` (${e.response.status})` : ""
                }.`
            );
        } finally {
            setLoading(false);
        }
    };

    // ===== Deep-link: read query params once =====
    useEffect(() => {
        const sp = new URLSearchParams(location.search);
        const c = sp.get("course");
        const a = sp.get("account");
        const s = sp.get("status");
        const q = sp.get("q");
        if (c) setCourseFilter(c);
        if (a) setAccountFilter(a);
        if (s) setStatusFilter(s);
        if (q) setQuery(q);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchMeta();
        fetchEnrollments(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [perPage, courseFilter, accountFilter, statusFilter]);

    // ====== Create ======
    const [createForm, setCreateForm] = useState({
        EnrollmentID: "",
        AccountID: "",
        CourseID: "",
        EnrollDate: "",
        EStatus: "Processing",
    });

    const checkDuplicate = async (accountId, courseId) => {
        try {
            const res = await axios.get(`${API}/enrollments`, {
                params: {
                    account: accountId,
                    course: courseId,
                    per_page: 1,
                    page: 1,
                },
                headers,
            });
            const data = Array.isArray(res.data)
                ? res.data
                : res.data.data || [];
            return data.length > 0;
        } catch {
            return false;
        }
    };

    const submitCreate = async (e) => {
        e.preventDefault();
        try {
            if (!createForm.AccountID || !createForm.CourseID) {
                alert("Please select Account and Course.");
                return;
            }
            const dup = await checkDuplicate(
                createForm.AccountID,
                createForm.CourseID
            );
            if (dup) {
                if (
                    !window.confirm(
                        "This learner already enrolled this course. Create anyway?"
                    )
                )
                    return;
            }

            const payload = {
                ...createForm,
                EnrollDate: normalizeDTForAPI(createForm.EnrollDate),
            };
            await axios.post(`${API}/enrollments`, payload, { headers });
            alert("Created successfully!");
            setOpenCreate(false);
            setCreateForm({
                EnrollmentID: "",
                AccountID: "",
                CourseID: "",
                EnrollDate: "",
                EStatus: "Processing",
            });
            fetchEnrollments(page);
        } catch (err) {
            console.error(
                "POST /api/enrollments failed:",
                err?.response?.status,
                err?.response?.data
            );
            alert(err.response?.data?.message || "Create failed!");
        }
    };

    // ====== Edit ======
    const [editForm, setEditForm] = useState({
        AccountID: "",
        CourseID: "",
        EnrollDate: "",
        EStatus: "",
    });

    const openEditModal = (row) => {
        setCurrent(row);
        setEditForm({
            AccountID: row.AccountID || "",
            CourseID: row.CourseID || "",
            EnrollDate: (row.EnrollDate || "").replace(" ", "T").slice(0, 16),
            EStatus: row.EStatus || "",
        });
        setOpenEdit(true);
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        if (!current) return;
        try {
            const payload = {
                ...editForm,
                EnrollDate: normalizeDTForAPI(editForm.EnrollDate),
            };
            await axios.put(
                `${API}/enrollments/${current.EnrollmentID}`,
                payload,
                { headers }
            );
            alert("Updated successfully!");
            setOpenEdit(false);
            setCurrent(null);
            fetchEnrollments(page);
        } catch (err) {
            console.error(
                "PUT /api/enrollments/{id} failed:",
                err?.response?.status,
                err?.response?.data
            );
            alert(err.response?.data?.message || "Update failed!");
        }
    };

    // ====== Delete ======
    const confirmDelete = (row) => {
        setCurrent(row);
        setOpenDelete(true);
    };

    const doDelete = async () => {
        if (!current) return;
        try {
            await axios.delete(`${API}/enrollments/${current.EnrollmentID}`, {
                headers,
            });
            alert("Deleted successfully!");
            setOpenDelete(false);
            setCurrent(null);
            const lastPage = Math.max(1, Math.ceil((total - 1) / perPage));
            fetchEnrollments(Math.min(page, lastPage));
        } catch (err) {
            console.error(
                "DELETE /api/enrollments/{id} failed:",
                err?.response?.status,
                err?.response?.data
            );
            alert(err.response?.data?.message || "Delete failed!");
        }
    };

    // ====== Quick actions ======
    const markAsPaid = async (row) => {
        try {
            await axios.put(
                `${API}/enrollments/${row.EnrollmentID}`,
                { EStatus: "Paid" },
                { headers }
            );
            fetchEnrollments(page);
        } catch (e) {
            console.error(
                "Mark as paid failed:",
                e?.response?.status,
                e?.response?.data
            );
            alert("Mark as paid failed!");
        }
    };

    const markRefunded = async (row) => {
        try {
            await axios.put(
                `${API}/enrollments/${row.EnrollmentID}`,
                { EStatus: "Refunded" },
                { headers }
            );
            fetchEnrollments(page);
        } catch (e) {
            console.error(
                "Mark as refunded failed:",
                e?.response?.status,
                e?.response?.data
            );
            alert("Mark as refunded failed!");
        }
    };

    const markCanceled = async (row) => {
        try {
            await axios.put(
                `${API}/enrollments/${row.EnrollmentID}`,
                { EStatus: "Canceled" },
                { headers }
            );
            fetchEnrollments(page);
        } catch (e) {
            console.error(
                "Mark as canceled failed:",
                e?.response?.status,
                e?.response?.data
            );
            alert("Mark as canceled failed!");
        }
    };

    // ====== Bulk actions ======
    const bulkSetStatus = async (newStatus) => {
        if (!selectedIds.length) {
            alert("No rows selected.");
            return;
        }
        if (
            !window.confirm(
                `Apply status "${newStatus}" to ${selectedIds.length} enrollments?`
            )
        )
            return;

        try {
            await Promise.all(
                selectedIds.map((id) =>
                    axios.put(
                        `${API}/enrollments/${id}`,
                        { EStatus: newStatus },
                        { headers }
                    )
                )
            );
            alert("Bulk update done!");
            fetchEnrollments(page);
        } catch (e) {
            console.error(
                "Bulk set status failed:",
                e?.response?.status,
                e?.response?.data
            );
            alert("Bulk set status failed.");
        }
    };

    const bulkDelete = async () => {
        if (!selectedIds.length) {
            alert("No rows selected.");
            return;
        }
        if (!window.confirm(`Delete ${selectedIds.length} enrollments?`))
            return;

        try {
            await Promise.all(
                selectedIds.map((id) =>
                    axios.delete(`${API}/enrollments/${id}`, { headers })
                )
            );
            alert("Bulk delete done!");
            fetchEnrollments(page);
        } catch (e) {
            console.error(
                "Bulk delete failed:",
                e?.response?.status,
                e?.response?.data
            );
            alert("Bulk delete failed.");
        }
    };

    // ===== Export CSV (theo filter hiện tại – toàn bộ) =====
    const exportCSV = async () => {
        try {
            const params = { page: 1, per_page: 100000 };
            if (query) params.search = query;
            if (courseFilter) params.course = courseFilter;
            if (accountFilter) params.account = accountFilter;
            if (statusFilter) params.status = statusFilter;

            const res = await axios.get(`${API}/enrollments`, {
                params,
                headers,
            });
            const data = Array.isArray(res.data)
                ? res.data
                : res.data.data || [];

            const header = [
                "EnrollmentID",
                "AccountID",
                "CourseID",
                "EnrollDate",
                "EStatus",
            ];
            const lines = [
                header.join(","),
                ...data.map((r) =>
                    [
                        r.EnrollmentID,
                        r.AccountID,
                        r.CourseID,
                        (r.EnrollDate || "").replace(",", ""),
                        r.EStatus || "",
                    ]
                        .map((x) => `"${String(x).replace(/"/g, '""')}"`)
                        .join(",")
                ),
            ];
            const blob = new Blob([lines.join("\n")], {
                type: "text/csv;charset=utf-8;",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `enrollments_${Date.now()}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(
                "Export CSV failed:",
                e?.response?.status,
                e?.response?.data
            );
            alert("Export failed.");
        }
    };

    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const allChecked =
        rows.length > 0 && rows.every((r) => selected[r.EnrollmentID]);

    return (
        <div className="card-section">
            {/* ===== Header ===== */}
            <div className="um-header">
                <div className="um-title">Enrollment Management</div>

                {/* Row 1: Filters + Search */}
                <div className="um-row1">
                    <div className="um-filters">
                        <select
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                            onFocus={() =>
                                !courses.length && !loadingMeta && fetchMeta()
                            }
                        >
                            <option value="">
                                {loadingMeta
                                    ? "Loading courses…"
                                    : "-- Filter by Course --"}
                            </option>
                            {courses.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.id} — {c.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={accountFilter}
                            onChange={(e) => setAccountFilter(e.target.value)}
                            onFocus={() =>
                                !accounts.length && !loadingMeta && fetchMeta()
                            }
                        >
                            <option value="">
                                {loadingMeta
                                    ? "Loading accounts…"
                                    : "-- Filter by Account --"}
                            </option>
                            {accounts.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.id} — {a.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">-- Filter by Status --</option>
                            <option value="Paid">Paid</option>
                            <option value="Processing">Processing</option>
                            <option value="Not Confirmed">Not Confirmed</option>
                            <option value="Refunded">Refunded</option>
                            <option value="Canceled">Canceled</option>
                        </select>
                    </div>

                    <div className="search-box">
                        <input
                            placeholder="Search by enrollment/account/course…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && fetchEnrollments(1)
                            }
                        />
                        <button
                            className="btn sm"
                            onClick={() => fetchEnrollments(1)}
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Row 2: Actions + Back */}
                <div className="um-row2" style={{ gap: 8, flexWrap: "wrap" }}>
                    <button className="btn" onClick={() => setOpenCreate(true)}>
                        + Add new enrollment
                    </button>

                    {/* Bulk actions */}
                    <div
                        style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <span className="muted">
                            Selected: {selectedIds.length}
                        </span>
                        <button
                            className="btn ghost"
                            onClick={() => bulkSetStatus("Paid")}
                        >
                            Set Paid
                        </button>
                        <button
                            className="btn ghost"
                            onClick={() => bulkSetStatus("Processing")}
                        >
                            Set Processing
                        </button>
                        <button
                            className="btn ghost"
                            onClick={() => bulkSetStatus("Not Confirmed")}
                        >
                            Set Not Confirmed
                        </button>
                        {/* NEW */}
                        <button
                            className="btn ghost"
                            onClick={() => bulkSetStatus("Refunded")}
                        >
                            Set Refunded
                        </button>
                        <button
                            className="btn danger"
                            onClick={() => bulkSetStatus("Canceled")}
                        >
                            Set Canceled
                        </button>
                        <button className="btn" onClick={exportCSV}>
                            Export CSV
                        </button>
                    </div>

                    <button
                        className="btn ghost"
                        onClick={() => navigate("/admin")}
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>

            {/* ===== Table ===== */}
            <div className="table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ width: 40 }}>
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={(e) => {
                                        const chk = e.target.checked;
                                        const next = {};
                                        rows.forEach(
                                            (r) => (next[r.EnrollmentID] = chk)
                                        );
                                        setSelected(next);
                                    }}
                                />
                            </th>
                            <th style={{ width: 60 }}>#</th>
                            <th>EnrollmentID</th>
                            <th>AccountID</th>
                            <th>CourseID</th>
                            <th>Enroll date</th>
                            <th>Status</th>
                            <th style={{ width: 420 }} className="center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="center muted">
                                    Loading...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="center muted">
                                    No data
                                </td>
                            </tr>
                        ) : (
                            rows.map((r, idx) => (
                                <tr key={r.EnrollmentID || idx}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={!!selected[r.EnrollmentID]}
                                            onChange={(e) =>
                                                setSelected((prev) => ({
                                                    ...prev,
                                                    [r.EnrollmentID]:
                                                        e.target.checked,
                                                }))
                                            }
                                        />
                                    </td>
                                    <td>{(page - 1) * perPage + idx + 1}</td>
                                    <td className="muted">{r.EnrollmentID}</td>
                                    <td className="muted" title={r.AccountID}>
                                        {r.AccountID}
                                    </td>
                                    <td className="muted" title={r.CourseID}>
                                        {r.CourseID}
                                    </td>
                                    <td className="muted">
                                        {fmtDateTime(r.EnrollDate)}
                                    </td>
                                    <td>
                                        <span
                                            className={badgeStatusClass(
                                                r.EStatus
                                            )}
                                        >
                                            {r.EStatus}
                                        </span>
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
                                            {String(r.EStatus).toLowerCase() !==
                                                "paid" && (
                                                <button
                                                    className="btn sm"
                                                    onClick={() =>
                                                        markAsPaid(r)
                                                    }
                                                >
                                                    Mark as paid
                                                </button>
                                            )}
                                            {/* NEW: quick actions revoke */}
                                            {String(r.EStatus).toLowerCase() !==
                                                "refunded" && (
                                                <button
                                                    className="btn sm ghost"
                                                    onClick={() =>
                                                        markRefunded(r)
                                                    }
                                                >
                                                    Mark refunded
                                                </button>
                                            )}
                                            {String(r.EStatus).toLowerCase() !==
                                                "canceled" && (
                                                <button
                                                    className="btn sm danger"
                                                    onClick={() =>
                                                        markCanceled(r)
                                                    }
                                                >
                                                    Cancel access
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ===== Pagination ===== */}
            <div className="pagination">
                <button
                    className="btn sm ghost"
                    disabled={page <= 1 || loading}
                    onClick={() => fetchEnrollments(page - 1)}
                >
                    ← Prev
                </button>

                <span className="muted">
                    Page {page} / {totalPages}
                </span>

                <button
                    className="btn sm ghost"
                    disabled={page >= totalPages || loading}
                    onClick={() => fetchEnrollments(page + 1)}
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

            {/* ===== Modal: Create ===== */}
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
                            <h2>Create new enrollment</h2>
                            <p className="muted">
                                Use this form to enroll a learner into a course
                            </p>
                        </div>

                        <form
                            className="settings-form1"
                            onSubmit={submitCreate}
                        >
                            <div className="form-section1">
                                <div className="form-group1">
                                    <label>EnrollmentID</label>
                                    <input
                                        value={createForm.EnrollmentID}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                EnrollmentID: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Account</label>
                                    <select
                                        value={createForm.AccountID}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                AccountID: e.target.value,
                                            })
                                        }
                                        onFocus={() =>
                                            !accounts.length &&
                                            !loadingMeta &&
                                            fetchMeta()
                                        }
                                        required
                                    >
                                        <option value="">
                                            {loadingMeta
                                                ? "Loading…"
                                                : "-- Select account --"}
                                        </option>
                                        {accounts.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.id} — {a.name}
                                            </option>
                                        ))}
                                    </select>
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
                                            !loadingMeta &&
                                            fetchMeta()
                                        }
                                        required
                                    >
                                        <option value="">
                                            {loadingMeta
                                                ? "Loading…"
                                                : "-- Select course --"}
                                        </option>
                                        {courses.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.id} — {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group1">
                                    <label>Enroll date</label>
                                    <input
                                        type="datetime-local"
                                        value={createForm.EnrollDate}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                EnrollDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Status</label>
                                    <select
                                        value={createForm.EStatus}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                EStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Processing">
                                            Processing
                                        </option>
                                        <option value="Paid">Paid</option>
                                        <option value="Not Confirmed">
                                            Not Confirmed
                                        </option>
                                        <option value="Refunded">
                                            Refunded
                                        </option>
                                        <option value="Canceled">
                                            Canceled
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

            {/* ===== Modal: Edit ===== */}
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
                            <h2>Edit enrollment</h2>
                            <p className="muted">
                                Update the selected enrollment
                            </p>
                        </div>

                        <form className="settings-form1" onSubmit={submitEdit}>
                            <div className="form-section1">
                                <div className="form-group1">
                                    <label>Account</label>
                                    <select
                                        value={editForm.AccountID}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                AccountID: e.target.value,
                                            })
                                        }
                                        onFocus={() =>
                                            !accounts.length &&
                                            !loadingMeta &&
                                            fetchMeta()
                                        }
                                    >
                                        <option value="">
                                            {loadingMeta
                                                ? "Loading…"
                                                : "-- Select account --"}
                                        </option>
                                        {accounts.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.id} — {a.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

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
                                            !loadingMeta &&
                                            fetchMeta()
                                        }
                                    >
                                        <option value="">
                                            {loadingMeta
                                                ? "Loading…"
                                                : "-- Select course --"}
                                        </option>
                                        {courses.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.id} — {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group1">
                                    <label>Enroll date</label>
                                    <input
                                        type="datetime-local"
                                        value={editForm.EnrollDate}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                EnrollDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Status</label>
                                    <select
                                        value={editForm.EStatus}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                EStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Processing">
                                            Processing
                                        </option>
                                        <option value="Paid">Paid</option>
                                        <option value="Not Confirmed">
                                            Not Confirmed
                                        </option>
                                        <option value="Refunded">
                                            Refunded
                                        </option>
                                        <option value="Canceled">
                                            Canceled
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

            {/* ===== Modal: Delete confirm ===== */}
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
                            <h2>Delete enrollment</h2>
                            <p className="muted">
                                Are you sure you want to delete{" "}
                                <strong>{current?.EnrollmentID}</strong>?
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
        </div>
    );
}

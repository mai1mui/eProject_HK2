import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/UserManagement.css"; // tái dùng style đã có

const API = "http://127.0.0.1:8000/api";

export default function CourseManagement() {
    const navigate = useNavigate();

    // ===== Filters / Search / Paging =====
    const [status, setStatus] = useState(""); // Active / Inactive
    const [creator, setCreator] = useState(""); // CreatorID (INSxxx)
    const [query, setQuery] = useState("");

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // ===== Data =====
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    // ===== Modals =====
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [current, setCurrent] = useState(null);

    // ===== Instructors (for dropdown) =====
    const [instructors, setInstructors] = useState([]);
    const [insLoading, setInsLoading] = useState(false);

    // ===== Auth header for protected endpoints =====
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

    const fmtDateOnly = (s) => {
        if (!s) return "";
        const d = new Date(s);
        if (isNaN(d.getTime())) return s;
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const badgeStatusClass = (st) => {
        if (!st) return "pill gray";
        return String(st).toLowerCase() === "active"
            ? "pill learner"
            : "pill gray";
    };

    // ===== Fetch instructors from PUBLIC route /api/creators =====
    const fetchInstructors = async () => {
        if (insLoading) return;
        setInsLoading(true);
        try {
            const res = await axios.get(`${API}/creators`); // public, không cần headers
            const raw = Array.isArray(res.data)
                ? res.data
                : res.data?.data || res.data?.items || [];
            const mapped = raw
                .map((u) => ({
                    id: u.AccountID || u.id || u.accountId || u.code,
                    name: u.AName || u.name || u.fullname || u.fullName || "",
                }))
                .filter((x) => !!x.id);
            setInstructors(mapped);
        } catch (e) {
            console.error("Fetch creators failed", e);
            setInstructors([]);
        } finally {
            setInsLoading(false);
        }
    };

    // ===== Fetch courses =====
    const fetchCourses = async (newPage = 1) => {
        setLoading(true);
        try {
            const params = { page: newPage, per_page: perPage };
            if (query) params.search = query;
            if (status) params.status = status;
            if (creator) params.creator = creator;

            const res = await axios.get(`${API}/courses`, { params, headers });

            let data = Array.isArray(res.data)
                ? res.data
                : res.data.data || res.data.items || [];
            let metaTotal = res.data.total ?? data.length;
            let metaPer = res.data.per_page ?? perPage;
            let metaPage = res.data.current_page ?? newPage;

            // Nếu BE trả mảng thô -> filter/paginate phía client
            if (Array.isArray(res.data)) {
                data = data.filter((r) => {
                    const byStatus = status
                        ? String(r.CStatus || "").toLowerCase() ===
                          status.toLowerCase()
                        : true;
                    const byCreator = creator
                        ? String(r.CreatorID || "").toLowerCase() ===
                          creator.toLowerCase()
                        : true;
                    const q = query.toLowerCase();
                    const byQuery = query
                        ? String(r.CName || "")
                              .toLowerCase()
                              .includes(q) ||
                          String(r.CourseID || "")
                              .toLowerCase()
                              .includes(q) ||
                          String(r.CDescription || "")
                              .toLowerCase()
                              .includes(q)
                        : true;
                    return byStatus && byCreator && byQuery;
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
            alert("Failed to load courses.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses(1);
        fetchInstructors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [perPage]);

    // ===== Create =====
    const [createForm, setCreateForm] = useState({
        CourseID: "",
        CName: "",
        CDescription: "",
        StartDate: "",
        CreatorID: "",
        CStatus: "Active",
    });

    const submitCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/courses`, createForm, { headers });
            alert("Created successfully!");
            setOpenCreate(false);
            setCreateForm({
                CourseID: "",
                CName: "",
                CDescription: "",
                StartDate: "",
                CreatorID: "",
                CStatus: "Active",
            });
            fetchCourses(page);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Create failed!");
        }
    };

    // ===== Edit =====
    const [editForm, setEditForm] = useState({
        CName: "",
        CDescription: "",
        StartDate: "",
        CreatorID: "",
        CStatus: "",
    });

    const openEditModal = (row) => {
        setCurrent(row);
        setEditForm({
            CName: row.CName || "",
            CDescription: row.CDescription || "",
            StartDate: fmtDateOnly(row.StartDate || ""),
            CreatorID: row.CreatorID || "",
            CStatus: row.CStatus || "",
        });
        setOpenEdit(true);
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        if (!current) return;
        try {
            await axios.put(`${API}/courses/${current.CourseID}`, editForm, {
                headers,
            });
            alert("Updated successfully!");
            setOpenEdit(false);
            setCurrent(null);
            fetchCourses(page);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Update failed!");
        }
    };

    // ===== Delete =====
    const confirmDelete = (row) => {
        setCurrent(row);
        setOpenDelete(true);
    };

    const doDelete = async () => {
        if (!current) return;
        try {
            await axios.delete(`${API}/courses/${current.CourseID}`, {
                headers,
            });
            alert("Deleted successfully!");
            setOpenDelete(false);
            setCurrent(null);
            const lastPage = Math.max(1, Math.ceil((total - 1) / perPage));
            fetchCourses(Math.min(page, lastPage));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Delete failed!");
        }
    };

    const totalPages = Math.max(1, Math.ceil(total / perPage));

    return (
        <div className="card-section">
            {/* ===== Header ===== */}
            <div className="um-header">
                <div className="um-title">Course Management</div>

                {/* HÀNG 1: Filters + Search */}
                <div className="um-row1">
                    <div className="um-filters">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">-- Filter by Status --</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>

                        <select
                            value={creator}
                            onChange={(e) => setCreator(e.target.value)}
                            onFocus={() =>
                                !instructors.length &&
                                !insLoading &&
                                fetchInstructors()
                            }
                        >
                            <option value="">
                                {insLoading
                                    ? "Loading…"
                                    : instructors.length
                                    ? "-- Filter by Creator --"
                                    : "No instructor"}
                            </option>
                            {instructors.map((ins) => (
                                <option key={ins.id} value={ins.id}>
                                    {ins.id} — {ins.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="search-box">
                        <input
                            placeholder="Search by ID/name/description…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && fetchCourses(1)
                            }
                        />
                        <button
                            className="btn sm"
                            onClick={() => fetchCourses(1)}
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* HÀNG 2: Add + Back */}
                <div className="um-row2">
                    <button className="btn" onClick={() => setOpenCreate(true)}>
                        + Add new course
                    </button>

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
                            <th style={{ width: 60 }}>#</th>
                            <th>CourseID</th>
                            <th>Course name</th>
                            <th>Description</th>
                            <th>Start date</th>
                            <th>CreatorID</th>
                            <th>Status</th>
                            <th>Date created</th>
                            <th style={{ width: 140 }} className="center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={9} className="center muted">
                                    Loading...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="center muted">
                                    No data
                                </td>
                            </tr>
                        ) : (
                            rows.map((r, idx) => (
                                <tr key={r.CourseID || idx}>
                                    <td>{(page - 1) * perPage + idx + 1}</td>
                                    <td className="muted">{r.CourseID}</td>
                                    <td>{r.CName}</td>
                                    <td className="truncate">
                                        {r.CDescription}
                                    </td>
                                    <td className="muted">
                                        {fmtDateOnly(r.StartDate)}
                                    </td>
                                    <td className="muted">{r.CreatorID}</td>
                                    <td>
                                        <span
                                            className={badgeStatusClass(
                                                r.CStatus
                                            )}
                                        >
                                            {r.CStatus}
                                        </span>
                                    </td>
                                    <td className="muted">
                                        {fmtDateTime(
                                            r.CreatedAt ||
                                                r.created_at ||
                                                r.createdAt ||
                                                r.created ||
                                                ""
                                        )}
                                    </td>
                                    <td className="center">
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: 8,
                                                justifyContent: "center",
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
                    onClick={() => fetchCourses(page - 1)}
                >
                    ← Prev
                </button>

                <span className="muted">
                    Page {page} / {totalPages}
                </span>

                <button
                    className="btn sm ghost"
                    disabled={page >= totalPages || loading}
                    onClick={() => fetchCourses(page + 1)}
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
                            <h2>Create new course</h2>
                            <p className="muted">
                                Use this form to add a new course
                            </p>
                        </div>

                        <form
                            className="settings-form1"
                            onSubmit={submitCreate}
                        >
                            <div className="form-section1">
                                <div className="form-group1">
                                    <label>CourseID</label>
                                    <input
                                        value={createForm.CourseID}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                CourseID: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group1">
                                    <label>Course name</label>
                                    <input
                                        value={createForm.CName}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                CName: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group1">
                                    <label>Description</label>
                                    <textarea
                                        rows={3}
                                        value={createForm.CDescription}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                CDescription: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-group1">
                                    <label>Start date</label>
                                    <input
                                        type="date"
                                        value={createForm.StartDate}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                StartDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-group1">
                                    <label>Creator (Instructor)</label>
                                    <select
                                        value={createForm.CreatorID}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                CreatorID: e.target.value,
                                            })
                                        }
                                        onFocus={() =>
                                            !instructors.length &&
                                            !insLoading &&
                                            fetchInstructors()
                                        }
                                    >
                                        <option value="">
                                            {insLoading
                                                ? "Loading…"
                                                : instructors.length
                                                ? "-- Select instructor --"
                                                : "No instructor"}
                                        </option>
                                        {instructors.map((ins) => (
                                            <option key={ins.id} value={ins.id}>
                                                {ins.id} — {ins.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        placeholder="Or type CreatorID (e.g. INS003)"
                                        style={{ marginTop: 8 }}
                                        value={createForm.CreatorID}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                CreatorID: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-group1">
                                    <label>Status</label>
                                    <select
                                        value={createForm.CStatus}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                CStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Active">Active</option>
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
                            <h2>Edit course</h2>
                            <p className="muted">Update the selected course</p>
                        </div>

                        <form className="settings-form1" onSubmit={submitEdit}>
                            <div className="form-section1">
                                <div className="form-group1">
                                    <label>Course name</label>
                                    <input
                                        value={editForm.CName}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                CName: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group1">
                                    <label>Description</label>
                                    <textarea
                                        rows={3}
                                        value={editForm.CDescription}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                CDescription: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-group1">
                                    <label>Start date</label>
                                    <input
                                        type="date"
                                        value={editForm.StartDate}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                StartDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-group1">
                                    <label>Creator (Instructor)</label>
                                    <select
                                        value={editForm.CreatorID}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                CreatorID: e.target.value,
                                            })
                                        }
                                        onFocus={() =>
                                            !instructors.length &&
                                            !insLoading &&
                                            fetchInstructors()
                                        }
                                    >
                                        <option value="">
                                            {insLoading
                                                ? "Loading…"
                                                : instructors.length
                                                ? "-- Select instructor --"
                                                : "No instructor"}
                                        </option>
                                        {instructors.map((ins) => (
                                            <option key={ins.id} value={ins.id}>
                                                {ins.id} — {ins.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        placeholder="Or type CreatorID"
                                        style={{ marginTop: 8 }}
                                        value={editForm.CreatorID}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                CreatorID: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-group1">
                                    <label>Status</label>
                                    <select
                                        value={editForm.CStatus}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                CStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Active">Active</option>
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
                            <h2>Delete course</h2>
                            <p className="muted">
                                Are you sure you want to delete{" "}
                                <strong>{current?.CName}</strong> (
                                {current?.CourseID})?
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

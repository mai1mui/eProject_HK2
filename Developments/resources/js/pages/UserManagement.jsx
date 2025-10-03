import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/UserManagement.css";

const API = "http://127.0.0.1:8000/api";

export default function UserManagement() {
    const navigate = useNavigate();

    // ==== Filters/Search/Paging ====
    const [role, setRole] = useState(""); // Admin/Instructor/Learner
    const [status, setStatus] = useState(""); // Active/Inactive
    const [approval, setApproval] = useState(""); // Approved/Pending/Rejected
    const [query, setQuery] = useState("");

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // ==== Data ====
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    // ==== Modals ====
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [current, setCurrent] = useState(null); // record đang edit/delete

    // ✅ luôn lấy token mới nhất
    const getAuthHeaders = () => {
        const token = localStorage.getItem("token") || "";
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // ===== Helpers =====
    const avatarUrl = (r) => {
        if (r?.avatarUrl || r?.AvatarUrl) return r.avatarUrl || r.AvatarUrl;
        const p = r?.Avatar || r?.avatar || "avatars/avatar.jpg";
        return `${API.replace("/api", "")}/storage/${p}`;
    };

    const fmtDate = (s) => {
        if (!s) return "-";
        const str = String(s).includes(" ")
            ? String(s).replace(" ", "T")
            : String(s);
        const d = new Date(str);
        return isNaN(d.getTime()) ? String(s) : d.toLocaleString();
    };

    const badgeRoleClass = (r) => {
        if (!r) return "pill gray";
        const k = String(r).toLowerCase();
        if (k === "admin") return "pill admin";
        if (k === "instructor") return "pill instructor";
        if (k === "learner") return "pill learner";
        return "pill gray";
    };
    const badgeStatusClass = (st) =>
        !st
            ? "pill gray"
            : String(st).toLowerCase() === "active"
            ? "pill learner"
            : "pill gray";

    // ===== Fetch list =====
    const fetchAccounts = async (newPage = 1) => {
        setLoading(true);
        try {
            const params = { page: newPage, per_page: perPage };
            if (query) params.search = query;
            if (role) params.role = role;
            if (status) params.status = status;
            if (approval) params.approval = approval;

            const res = await axios.get(`${API}/users`, {
                params,
                headers: getAuthHeaders(),
            });

            let data = Array.isArray(res.data)
                ? res.data
                : res.data.data || res.data.items || [];
            let metaTotal = res.data.total ?? data.length;
            let metaPer = res.data.per_page ?? perPage;
            let metaPage = res.data.page ?? res.data.current_page ?? newPage;

            // Nếu BE trả mảng thô → filter client (đảm bảo filter vẫn hoạt động)
            if (Array.isArray(res.data)) {
                data = data.filter((r) => {
                    const byRole = role
                        ? String(r.ARole).toLowerCase() === role.toLowerCase()
                        : true;
                    const byStatus = status
                        ? String(r.AStatus).toLowerCase() ===
                          status.toLowerCase()
                        : true;
                    const byApproval = approval
                        ? String(r.ApprovalStatus).toLowerCase() ===
                          approval.toLowerCase()
                        : true;
                    const byQuery = query
                        ? String(r.AName || "")
                              .toLowerCase()
                              .includes(query.toLowerCase()) ||
                          String(r.Email || "")
                              .toLowerCase()
                              .includes(query.toLowerCase()) ||
                          String(r.AccountID || "")
                              .toLowerCase()
                              .includes(query.toLowerCase())
                        : true;
                    return byRole && byStatus && byApproval && byQuery;
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
        } catch (err) {
            console.error(
                "GET /users error:",
                err?.response?.status,
                err?.response?.data || err.message
            );
            alert(err?.response?.data?.message || "Failed to load accounts.");
        } finally {
            setLoading(false);
        }
    };

    // Auto fetch: khi đổi Role/Status/Approval hoặc perPage → tự lọc/fetch về trang 1
    useEffect(() => {
        fetchAccounts(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role, status, approval, perPage]);

    // ====== Create (đủ cột + avatar) ======
    const [createForm, setCreateForm] = useState({
        AccountID: "",
        AName: "",
        Email: "",
        Pass: "",
        ARole: "Learner",
        AStatus: "Active",
        ApprovalStatus: "",
    });
    const [createAvatarFile, setCreateAvatarFile] = useState(null);
    const [createAvatarPreview, setCreateAvatarPreview] = useState("");

    const onPickCreateAvatar = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setCreateAvatarFile(f);
        setCreateAvatarPreview(URL.createObjectURL(f));
    };
    const clearCreateAvatar = () => {
        setCreateAvatarFile(null);
        setCreateAvatarPreview("");
    };

    // Tạo mới: register rồi update bổ sung (status/approval/avatar/AccountID)
    const submitCreate = async (e) => {
        e.preventDefault();
        try {
            // B1: register
            const regBody = {
                AccountID: createForm.AccountID || undefined, // nếu hệ thống tự sinh, có thể để trống
                AName: createForm.AName,
                Email: createForm.Email,
                Pass: createForm.Pass,
                ARole: createForm.ARole,
            };

            const regRes = await axios.post(`${API}/register`, regBody, {
                headers: getAuthHeaders(),
            });

            // Lấy AccountID vừa tạo
            let newId =
                regRes?.data?.data?.AccountID ||
                regRes?.data?.user?.AccountID ||
                regRes?.data?.AccountID ||
                createForm.AccountID ||
                "";

            // fallback tìm theo email nếu BE không trả AccountID
            if (!newId) {
                const list = await axios.get(`${API}/users`, {
                    headers: getAuthHeaders(),
                });
                const all = Array.isArray(list.data)
                    ? list.data
                    : list.data.data || [];
                const found = all.find(
                    (u) =>
                        String(u.Email || "").toLowerCase() ===
                        String(createForm.Email).toLowerCase()
                );
                newId = found?.AccountID || "";
            }

            // B2: cập nhật thêm (status/approval/avatar/AccountID)
            if (newId) {
                const fd = new FormData();
                fd.append("_method", "PUT");

                fd.append("AccountID", createForm.AccountID || newId);
                fd.append("AName", createForm.AName || "");
                fd.append("Email", createForm.Email || "");
                fd.append("ARole", createForm.ARole || "");
                fd.append("AStatus", createForm.AStatus || "");
                fd.append("ApprovalStatus", createForm.ApprovalStatus || "");

                // alias snake_case cho chắc
                fd.append("account_id", createForm.AccountID || newId);
                fd.append("name", createForm.AName || "");
                fd.append("email", createForm.Email || "");
                fd.append("role", createForm.ARole || "");
                fd.append("status", createForm.AStatus || "");
                fd.append("approval_status", createForm.ApprovalStatus || "");

                if (createAvatarFile) {
                    fd.append("avatar", createAvatarFile);
                    fd.append("Avatar", createAvatarFile);
                }

                await axios.post(`${API}/users/${newId}`, fd, {
                    headers: getAuthHeaders(), // KHÔNG set Content-Type
                });
            }

            alert("Created successfully!");
            setOpenCreate(false);
            setCreateForm({
                AccountID: "",
                AName: "",
                Email: "",
                Pass: "",
                ARole: "Learner",
                AStatus: "Active",
                ApprovalStatus: "",
            });
            setCreateAvatarFile(null);
            setCreateAvatarPreview("");
            fetchAccounts(page);
        } catch (err) {
            console.error(
                "CREATE error:",
                err?.response?.status,
                err?.response?.data || err.message
            );
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Create failed!";
            alert(msg);
        }
    };

    // ====== Edit (AccountID & Avatar) ======
    const [editForm, setEditForm] = useState({
        AccountID: "",
        AName: "",
        Email: "",
        ARole: "",
        AStatus: "",
        ApprovalStatus: "",
    });
    const [avatarPreview, setAvatarPreview] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);

    const openEditModal = (row) => {
        setCurrent(row);
        setEditForm({
            AccountID: row.AccountID || "",
            AName: row.AName || "",
            Email: row.Email || "",
            ARole: row.ARole || "",
            AStatus: row.AStatus || "",
            ApprovalStatus: row.ApprovalStatus || "",
        });
        setAvatarPreview(avatarUrl(row));
        setAvatarFile(null);
        setOpenEdit(true);
    };

    const onPickAvatar = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setAvatarFile(f);
        setAvatarPreview(URL.createObjectURL(f));
    };

    const clearPickedAvatar = () => {
        setAvatarFile(null);
        if (current) setAvatarPreview(avatarUrl(current));
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        if (!current) return;

        try {
            const fd = new FormData();
            // dùng POST spoof PUT để chắc chắn Laravel parse multipart
            fd.append("_method", "PUT");

            // gửi đủ 2 bộ key
            fd.append("AccountID", editForm.AccountID || "");
            fd.append("AName", editForm.AName || "");
            fd.append("Email", editForm.Email || "");
            fd.append("ARole", editForm.ARole || "");
            fd.append("AStatus", editForm.AStatus || "");
            fd.append("ApprovalStatus", editForm.ApprovalStatus || "");

            fd.append("account_id", editForm.AccountID || "");
            fd.append("name", editForm.AName || "");
            fd.append("email", editForm.Email || "");
            fd.append("role", editForm.ARole || "");
            fd.append("status", editForm.AStatus || "");
            fd.append("approval_status", editForm.ApprovalStatus || "");

            if (avatarFile) {
                fd.append("avatar", avatarFile);
                fd.append("Avatar", avatarFile);
            }

            await axios.post(`${API}/users/${current.AccountID}`, fd, {
                headers: getAuthHeaders(), // đừng set Content-Type
            });

            alert("Updated successfully!");
            setOpenEdit(false);
            setCurrent(null);
            setAvatarFile(null);
            fetchAccounts(page);
        } catch (err) {
            console.error(
                "UPDATE error:",
                err?.response?.status,
                err?.response?.data || err.message
            );
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                `Update failed! (HTTP ${err?.response?.status ?? "?"})`;
            alert(msg);
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
            await axios.delete(`${API}/users/${current.AccountID}`, {
                headers: getAuthHeaders(),
            });
            alert("Deleted successfully!");
            setOpenDelete(false);
            setCurrent(null);

            const lastPage = Math.max(1, Math.ceil((total - 1) / perPage));
            fetchAccounts(Math.min(page, lastPage));
        } catch (err) {
            console.error(
                "DELETE error:",
                err?.response?.status,
                err?.response?.data || err.message
            );
            const msg = err?.response?.data?.message || "Delete failed!";
            alert(msg);
        }
    };

    const totalPages = Math.max(1, Math.ceil(total / perPage));

    // Khi đổi filter → đưa UI về trang 1 (tức thì)
    const onChangeRole = (v) => {
        setRole(v);
        setPage(1);
    };
    const onChangeStatus = (v) => {
        setStatus(v);
        setPage(1);
    };
    const onChangeApproval = (v) => {
        setApproval(v);
        setPage(1);
    };

    return (
        <div className="card-section">
            {/* ===== Header ===== */}
            <div className="um-header">
                <div className="um-title">Account Management</div>

                {/* Row 1: Filters + Search */}
                <div className="um-row1">
                    <div className="um-filters">
                        <select
                            value={role}
                            onChange={(e) => onChangeRole(e.target.value)}
                        >
                            <option value="">-- Filter by Role --</option>
                            <option value="Admin">Admin</option>
                            <option value="Instructor">Instructor</option>
                            <option value="Learner">Learner</option>
                        </select>

                        <select
                            value={status}
                            onChange={(e) => onChangeStatus(e.target.value)}
                        >
                            <option value="">-- Filter by Status --</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>

                        <select
                            value={approval}
                            onChange={(e) => onChangeApproval(e.target.value)}
                        >
                            <option value="">-- Filter by Approval --</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="search-box">
                        <input
                            placeholder="Search by name/email/account id…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && fetchAccounts(1)
                            }
                        />
                        <button
                            className="btn sm"
                            onClick={() => fetchAccounts(1)}
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Row 2: Add + Back */}
                <div className="um-row2">
                    <button className="btn" onClick={() => setOpenCreate(true)}>
                        + Add new account
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
                            <th>Avatar</th>
                            <th>AccountID</th>
                            <th>Full name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Approval</th>
                            <th>Date created</th>
                            <th style={{ width: 140 }} className="center">
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
                                <tr key={r.AccountID || idx}>
                                    <td>{(page - 1) * perPage + idx + 1}</td>
                                    <td>
                                        <img src={avatarUrl(r)} alt="avatar" />
                                    </td>
                                    <td className="muted">{r.AccountID}</td>
                                    <td>{r.AName}</td>
                                    <td>{r.Email}</td>
                                    <td>
                                        <span
                                            className={badgeRoleClass(r.ARole)}
                                        >
                                            {r.ARole}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={badgeStatusClass(
                                                r.AStatus
                                            )}
                                        >
                                            {r.AStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="pill gray">
                                            {r.ApprovalStatus || "-"}
                                        </span>
                                    </td>
                                    <td className="muted">
                                        {fmtDate(r.CreatedAt || r.created_at)}
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
                    onClick={() => fetchAccounts(page - 1)}
                >
                    ← Prev
                </button>
                <span className="muted">
                    Page {page} / {totalPages}
                </span>
                <button
                    className="btn sm ghost"
                    disabled={page >= totalPages || loading}
                    onClick={() => fetchAccounts(page + 1)}
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

            {/* ===== Modal: Create (đủ cột + password + avatar) ===== */}
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
                            <h2>Create new account</h2>
                            <p className="muted">
                                Use this form to add a new user
                            </p>
                        </div>

                        <form
                            className="settings-form1"
                            onSubmit={submitCreate}
                        >
                            <div className="form-section1">
                                <div className="form-group1">
                                    <label>AccountID</label>
                                    <input
                                        value={createForm.AccountID}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                AccountID: e.target.value,
                                            })
                                        }
                                        placeholder="VD: ADM007"
                                    />
                                    <small className="muted">
                                        Có thể để trống nếu hệ thống tự sinh.
                                    </small>
                                </div>

                                <div className="form-group1">
                                    <label>Full name</label>
                                    <input
                                        value={createForm.AName}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                AName: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={createForm.Email}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                Email: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        value={createForm.Pass}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                Pass: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Role</label>
                                    <select
                                        value={createForm.ARole}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                ARole: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Learner">Learner</option>
                                        <option value="Instructor">
                                            Instructor
                                        </option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>

                                <div className="form-group1">
                                    <label>Status</label>
                                    <select
                                        value={createForm.AStatus}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                AStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group1">
                                    <label>Approval</label>
                                    <select
                                        value={createForm.ApprovalStatus}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                ApprovalStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">(none)</option>
                                        <option value="Approved">
                                            Approved
                                        </option>
                                        <option value="Pending">Pending</option>
                                        <option value="Rejected">
                                            Rejected
                                        </option>
                                    </select>
                                </div>

                                {/* Avatar uploader */}
                                <div className="form-group1">
                                    <label>Avatar</label>
                                    <div className="avatar-edit-row">
                                        <div className="avatar-preview">
                                            {createAvatarPreview ? (
                                                <img
                                                    src={createAvatarPreview}
                                                    alt="preview"
                                                    style={{
                                                        width: 80,
                                                        height: 80,
                                                        borderRadius: 12,
                                                        objectFit: "cover",
                                                        border: "1px solid rgba(255,255,255,0.08)",
                                                    }}
                                                />
                                            ) : (
                                                <div className="muted">
                                                    No preview
                                                </div>
                                            )}
                                        </div>
                                        <div className="avatar-actions">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={onPickCreateAvatar}
                                            />
                                            {createAvatarFile && (
                                                <button
                                                    type="button"
                                                    className="btn sm ghost"
                                                    onClick={clearCreateAvatar}
                                                >
                                                    Remove selected
                                                </button>
                                            )}
                                            <small className="muted">
                                                Tùy chọn: jpg/png, &lt; 2MB (tùy
                                                cấu hình BE).
                                            </small>
                                        </div>
                                    </div>
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
                            <h2>Edit account</h2>
                            <p className="muted">Update the selected user</p>
                        </div>

                        <form className="settings-form1" onSubmit={submitEdit}>
                            <div className="form-section1">
                                <div className="form-group1">
                                    <label>AccountID</label>
                                    <input
                                        value={editForm.AccountID}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                AccountID: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                    <small className="muted">
                                        Bạn có thể thay đổi mã người dùng nếu
                                        cần.
                                    </small>
                                </div>

                                <div className="form-group1">
                                    <label>Full name</label>
                                    <input
                                        value={editForm.AName}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                AName: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={editForm.Email}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                Email: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>Role</label>
                                    <select
                                        value={editForm.ARole}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                ARole: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Learner">Learner</option>
                                        <option value="Instructor">
                                            Instructor
                                        </option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>

                                <div className="form-group1">
                                    <label>Status</label>
                                    <select
                                        value={editForm.AStatus}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                AStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">(none)</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group1">
                                    <label>Approval</label>
                                    <select
                                        value={editForm.ApprovalStatus}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                ApprovalStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">(none)</option>
                                        <option value="Approved">
                                            Approved
                                        </option>
                                        <option value="Pending">Pending</option>
                                        <option value="Rejected">
                                            Rejected
                                        </option>
                                    </select>
                                </div>

                                {/* Avatar uploader */}
                                <div className="form-group1">
                                    <label>Avatar</label>
                                    <div className="avatar-edit-row">
                                        <div className="avatar-preview">
                                            {avatarPreview ? (
                                                <img
                                                    src={avatarPreview}
                                                    alt="preview"
                                                    style={{
                                                        width: 80,
                                                        height: 80,
                                                        borderRadius: 12,
                                                        objectFit: "cover",
                                                        border: "1px solid rgba(255,255,255,0.08)",
                                                    }}
                                                />
                                            ) : (
                                                <div className="muted">
                                                    No preview
                                                </div>
                                            )}
                                        </div>
                                        <div className="avatar-actions">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={onPickAvatar}
                                            />
                                            {avatarFile && (
                                                <button
                                                    type="button"
                                                    className="btn sm ghost"
                                                    onClick={clearPickedAvatar}
                                                >
                                                    Remove selected
                                                </button>
                                            )}
                                            <small className="muted">
                                                Chọn ảnh để thay đổi avatar
                                                (jpg/png, &lt; 2MB tuỳ cấu hình
                                                BE).
                                            </small>
                                        </div>
                                    </div>
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
                            <h2>Delete account</h2>
                            <p className="muted">
                                Are you sure you want to delete{" "}
                                <strong>{current?.AName}</strong> (
                                {current?.AccountID})?
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

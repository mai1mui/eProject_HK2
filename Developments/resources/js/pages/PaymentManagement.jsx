import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/UserManagement.css";

const API = "http://127.0.0.1:8000/api";

export default function PaymentManagement() {
    const navigate = useNavigate();

    // ==== Filters/Search/Paging ====
    const [pstatus, setPStatus] = useState(""); // Paid / Processing / Failed (tuỳ DB)
    const [fAccount, setFAccount] = useState(""); // AccountID
    const [fCourse, setFCourse] = useState(""); // CourseID
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const [dateFrom, setDateFrom] = useState(""); // YYYY-MM-DD
    const [dateTo, setDateTo] = useState(""); // YYYY-MM-DD
    const [query, setQuery] = useState("");

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // ==== Data ====
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    // ==== Options ====
    const [accountOpts, setAccountOpts] = useState([]);
    const [courseOpts, setCourseOpts] = useState([]);

    // ==== Modals ====
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [current, setCurrent] = useState(null);

    // ===== Token headers =====
    const getAuthHeaders = () => {
        const token = localStorage.getItem("token") || "";
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // ===== Helpers =====
    const fmtDateTime = (s) => {
        if (!s) return "-";
        const str = String(s).includes(" ")
            ? String(s).replace(" ", "T")
            : String(s);
        const d = new Date(str);
        return isNaN(d.getTime()) ? String(s) : d.toLocaleString();
    };
    const fmtMoney = (n) => {
        const v = Number(n);
        if (Number.isNaN(v)) return "-";
        return v.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };
    const badgePStatus = (st) => {
        if (!st) return "pill gray";
        const k = String(st).toLowerCase();
        if (k === "paid") return "pill learner"; // xanh
        if (k === "failed") return "pill admin"; // đỏ
        return "pill gray"; // processing/khác
    };

    // ===== Fetch options =====
    const fetchAccountOpts = async () => {
        try {
            const res = await axios.get(`${API}/users`, {
                params: { per_page: 1000 },
                headers: getAuthHeaders(),
            });
            const data = Array.isArray(res.data)
                ? res.data
                : res.data.data || [];
            const ids = Array.from(
                new Set(data.map((u) => u.AccountID).filter(Boolean))
            ).sort();
            setAccountOpts(ids);
        } catch {
            const setIds = new Set(
                rows.map((r) => r.AccountID).filter(Boolean)
            );
            setAccountOpts(Array.from(setIds).sort());
        }
    };
    const fetchCourseOpts = async () => {
        try {
            const res = await axios.get(`${API}/courses`, {
                params: { per_page: 1000 },
                headers: getAuthHeaders(),
            });
            const data = Array.isArray(res.data)
                ? res.data
                : res.data.data || [];
            const cids = Array.from(
                new Set(
                    data
                        .map((c) => c.CourseID || c.course_id || c.CID)
                        .filter(Boolean)
                )
            ).sort();
            setCourseOpts(cids);
        } catch {
            const setC = new Set(rows.map((r) => r.CourseID).filter(Boolean));
            setCourseOpts(Array.from(setC).sort());
        }
    };

    useEffect(() => {
        fetchAccountOpts();
        fetchCourseOpts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (accountOpts.length === 0 && rows.length > 0) {
            const s = new Set(rows.map((r) => r.AccountID).filter(Boolean));
            setAccountOpts(Array.from(s).sort());
        }
        if (courseOpts.length === 0 && rows.length > 0) {
            const s = new Set(rows.map((r) => r.CourseID).filter(Boolean));
            setCourseOpts(Array.from(s).sort());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);

    // ===== Fetch list =====
    const fetchPayments = async (newPage = 1) => {
        setLoading(true);
        try {
            const params = { page: newPage, per_page: perPage };

            // Đồng bộ cách gửi params như Results/User
            if (query) params.search = query;
            if (pstatus) params.pstatus = pstatus;
            if (fAccount) params.account_id = fAccount;
            if (fCourse) params.course_id = fCourse;
            if (minAmount !== "") params.min_amount = minAmount;
            if (maxAmount !== "") params.max_amount = maxAmount;
            if (dateFrom) params.date_from = dateFrom; // YYYY-MM-DD
            if (dateTo) params.date_to = dateTo;

            const res = await axios.get(`${API}/payments`, {
                params,
                headers: getAuthHeaders(),
            });

            let data = Array.isArray(res.data)
                ? res.data
                : res.data.data || res.data.items || [];
            let metaTotal = res.data.total ?? data.length;
            let metaPer = res.data.per_page ?? perPage;
            let metaPage = res.data.page ?? res.data.current_page ?? newPage;

            // Fallback filter client nếu BE trả mảng thô
            if (Array.isArray(res.data)) {
                data = data.filter((r) => {
                    const byStatus = pstatus
                        ? String(r.PStatus || "").toLowerCase() ===
                          pstatus.toLowerCase()
                        : true;
                    const byAccount = fAccount
                        ? String(r.AccountID || "").toLowerCase() ===
                          fAccount.toLowerCase()
                        : true;
                    const byCourse = fCourse
                        ? String(r.CourseID || "").toLowerCase() ===
                          fCourse.toLowerCase()
                        : true;

                    const amt = Number(r.Amount);
                    const byMinAmt =
                        minAmount !== "" && !Number.isNaN(Number(minAmount))
                            ? amt >= Number(minAmount)
                            : true;
                    const byMaxAmt =
                        maxAmount !== "" && !Number.isNaN(Number(maxAmount))
                            ? amt <= Number(maxAmount)
                            : true;

                    // date from-to (so sánh theo ngày)
                    const paid = r.PayDate
                        ? new Date(String(r.PayDate).replace(" ", "T"))
                        : null;
                    const byFrom = dateFrom
                        ? paid
                            ? paid >= new Date(`${dateFrom}T00:00:00`)
                            : false
                        : true;
                    const byTo = dateTo
                        ? paid
                            ? paid <= new Date(`${dateTo}T23:59:59`)
                            : false
                        : true;

                    const q = String(query || "").toLowerCase();
                    const byQuery = q
                        ? String(r.PaymentID || "")
                              .toLowerCase()
                              .includes(q) ||
                          String(r.AccountID || "")
                              .toLowerCase()
                              .includes(q) ||
                          String(r.CourseID || "")
                              .toLowerCase()
                              .includes(q) ||
                          String(r.PStatus || "")
                              .toLowerCase()
                              .includes(q) ||
                          String(r.TransactionRef || "")
                              .toLowerCase()
                              .includes(q)
                        : true;

                    return (
                        byStatus &&
                        byAccount &&
                        byCourse &&
                        byMinAmt &&
                        byMaxAmt &&
                        byFrom &&
                        byTo &&
                        byQuery
                    );
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
                "GET /payments error:",
                err?.response?.status,
                err?.response?.data || err.message
            );
            alert(err?.response?.data?.message || "Failed to load payments.");
        } finally {
            setLoading(false);
        }
    };

    // Auto fetch khi đổi filter/perPage
    useEffect(() => {
        fetchPayments(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        pstatus,
        fAccount,
        fCourse,
        minAmount,
        maxAmount,
        dateFrom,
        dateTo,
        perPage,
    ]);

    // ====== Create ======
    const [createForm, setCreateForm] = useState({
        PaymentID: "",
        AccountID: "",
        CourseID: "",
        Amount: "",
        PayDate: "",
        PStatus: "Paid",
        TransactionRef: "",
    });

    const submitCreate = async (e) => {
        e.preventDefault();
        try {
            const body = {
                PaymentID: createForm.PaymentID || undefined, // có thể để trống nếu BE tự sinh
                AccountID: createForm.AccountID,
                CourseID: createForm.CourseID,
                Amount:
                    createForm.Amount === "" ? null : Number(createForm.Amount),
                PayDate: createForm.PayDate, // "YYYY-MM-DDTHH:mm" (input datetime-local)
                PStatus: createForm.PStatus,
                TransactionRef: createForm.TransactionRef || "",
            };

            await axios.post(`${API}/payments`, body, {
                headers: {
                    ...getAuthHeaders(),
                    "Content-Type": "application/json",
                },
            });

            alert("Created successfully!");
            setOpenCreate(false);
            setCreateForm({
                PaymentID: "",
                AccountID: "",
                CourseID: "",
                Amount: "",
                PayDate: "",
                PStatus: "Paid",
                TransactionRef: "",
            });
            fetchPayments(page);
        } catch (err) {
            console.error(
                "CREATE /payments error:",
                err?.response?.status,
                err?.response?.data || err.message
            );
            alert(
                err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Create failed!"
            );
        }
    };

    // ====== Edit ======
    const [editForm, setEditForm] = useState({
        PaymentID: "",
        AccountID: "",
        CourseID: "",
        Amount: "",
        PayDate: "",
        PStatus: "",
        TransactionRef: "",
    });

    const openEditModal = (row) => {
        setCurrent(row);
        setEditForm({
            PaymentID: row.PaymentID || "",
            AccountID: row.AccountID || "",
            CourseID: row.CourseID || "",
            Amount: row.Amount || "",
            PayDate: row.PayDate
                ? String(row.PayDate).replace(" ", "T").slice(0, 16)
                : "",
            PStatus: row.PStatus || "",
            TransactionRef: row.TransactionRef || "",
        });
        setOpenEdit(true);
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        if (!current) return;
        try {
            const body = {
                AccountID: editForm.AccountID,
                CourseID: editForm.CourseID,
                Amount: editForm.Amount === "" ? null : Number(editForm.Amount),
                PayDate: editForm.PayDate,
                PStatus: editForm.PStatus,
                TransactionRef: editForm.TransactionRef || "",
            };

            const fd = new FormData();
            fd.append("_method", "PUT");
            Object.entries(body).forEach(([k, v]) =>
                fd.append(k, v === null || v === undefined ? "" : v)
            );

            await axios.post(`${API}/payments/${current.PaymentID}`, fd, {
                headers: getAuthHeaders(),
            });

            alert("Updated successfully!");
            setOpenEdit(false);
            setCurrent(null);
            fetchPayments(page);
        } catch (err) {
            console.error(
                "UPDATE /payments error:",
                err?.response?.status,
                err?.response?.data || err.message
            );
            alert(
                err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    `Update failed! (HTTP ${err?.response?.status ?? "?"})`
            );
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
            await axios.delete(`${API}/payments/${current.PaymentID}`, {
                headers: getAuthHeaders(),
            });
            alert("Deleted successfully!");
            setOpenDelete(false);
            setCurrent(null);

            const lastPage = Math.max(1, Math.ceil((total - 1) / perPage));
            fetchPayments(Math.min(page, lastPage));
        } catch (err) {
            console.error(
                "DELETE /payments error:",
                err?.response?.status,
                err?.response?.data || err.message
            );
            alert(err?.response?.data?.message || "Delete failed!");
        }
    };

    const totalPages = Math.max(1, Math.ceil(total / perPage));

    // Khi đổi filter → về trang 1
    const onChangePStatus = (v) => {
        setPStatus(v);
        setPage(1);
    };
    const onChangeAccount = (v) => {
        setFAccount(v);
        setPage(1);
    };
    const onChangeCourse = (v) => {
        setFCourse(v);
        setPage(1);
    };
    const onChangeMinAmt = (v) => {
        setMinAmount(v);
        setPage(1);
    };
    const onChangeMaxAmt = (v) => {
        setMaxAmount(v);
        setPage(1);
    };
    const onChangeFrom = (v) => {
        setDateFrom(v);
        setPage(1);
    };
    const onChangeTo = (v) => {
        setDateTo(v);
        setPage(1);
    };

    const resetFilters = () => {
        setPStatus("");
        setFAccount("");
        setFCourse("");
        setMinAmount("");
        setMaxAmount("");
        setDateFrom("");
        setDateTo("");
        setQuery("");
        setPage(1);
        fetchPayments(1);
    };

    return (
        <div className="card-section">
            <div className="um-header">
                <div className="um-title">Payment Management</div>

                {/* Row 1: Filters + Search */}
                <div className="um-row1">
                    <div className="um-filters">
                        <select
                            value={pstatus}
                            onChange={(e) => onChangePStatus(e.target.value)}
                        >
                            <option value="">
                                -- Filter by Payment Status --
                            </option>
                            <option value="Paid">Paid</option>
                            <option value="Processing">Processing</option>
                            <option value="Failed">Failed</option>
                        </select>

                        <select
                            value={fAccount}
                            onChange={(e) => onChangeAccount(e.target.value)}
                        >
                            <option value="">-- Filter by Account --</option>
                            {accountOpts.map((a) => (
                                <option key={a} value={a}>
                                    {a}
                                </option>
                            ))}
                        </select>

                        <select
                            value={fCourse}
                            onChange={(e) => onChangeCourse(e.target.value)}
                        >
                            <option value="">-- Filter by Course --</option>
                            {courseOpts.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            step="0.01"
                            placeholder="Min Amount"
                            value={minAmount}
                            onChange={(e) => onChangeMinAmt(e.target.value)}
                            className="filter-input"
                        />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Max Amount"
                            value={maxAmount}
                            onChange={(e) => onChangeMaxAmt(e.target.value)}
                            className="filter-input"
                        />

                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => onChangeFrom(e.target.value)}
                            className="filter-input"
                            title="PayDate From"
                        />
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => onChangeTo(e.target.value)}
                            className="filter-input"
                            title="PayDate To"
                        />

                        <button
                            className="btn sm ghost"
                            type="button"
                            onClick={resetFilters}
                        >
                            Reset
                        </button>
                    </div>

                    <div className="search-box">
                        <input
                            placeholder="Search by PaymentID / AccountID / CourseID / Status / Ref"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && fetchPayments(1)
                            }
                        />
                        <button
                            className="btn sm"
                            onClick={() => fetchPayments(1)}
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Row 2 */}
                <div className="um-row2">
                    <button className="btn" onClick={() => setOpenCreate(true)}>
                        + Add payment
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
                            <th>PaymentID</th>
                            <th>AccountID</th>
                            <th>CourseID</th>
                            <th>Amount</th>
                            <th>PayDate</th>
                            <th>PStatus</th>
                            <th>TransactionRef</th>
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
                                <tr
                                    key={
                                        r.PaymentID ||
                                        `${r.AccountID}-${r.CourseID}-${idx}`
                                    }
                                >
                                    <td>{(page - 1) * perPage + idx + 1}</td>
                                    <td className="muted">{r.PaymentID}</td>
                                    <td>{r.AccountID}</td>
                                    <td>{r.CourseID}</td>
                                    <td>{fmtMoney(r.Amount)}</td>
                                    <td className="muted">
                                        {fmtDateTime(r.PayDate)}
                                    </td>
                                    <td>
                                        <span
                                            className={badgePStatus(r.PStatus)}
                                        >
                                            {r.PStatus || "-"}
                                        </span>
                                    </td>
                                    <td className="muted">
                                        {r.TransactionRef || "-"}
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

            {/* Pagination */}
            <div className="pagination">
                <button
                    className="btn sm ghost"
                    disabled={page <= 1 || loading}
                    onClick={() => fetchPayments(page - 1)}
                >
                    ← Prev
                </button>
                <span className="muted">
                    Page {page} / {Math.max(1, Math.ceil(total / perPage))}
                </span>
                <button
                    className="btn sm ghost"
                    disabled={
                        page >= Math.max(1, Math.ceil(total / perPage)) ||
                        loading
                    }
                    onClick={() => fetchPayments(page + 1)}
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

            {/* Create Modal */}
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
                            <h2>Create new payment</h2>
                            <p className="muted">
                                Use this form to add a new payment
                            </p>
                        </div>

                        <form
                            className="settings-form1"
                            onSubmit={submitCreate}
                        >
                            <div className="form-section1">
                                <div className="form-group1">
                                    <label>PaymentID</label>
                                    <input
                                        value={createForm.PaymentID}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                PaymentID: e.target.value,
                                            })
                                        }
                                        placeholder="P001 (có thể để trống)"
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>AccountID</label>
                                    <select
                                        value={createForm.AccountID}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                AccountID: e.target.value,
                                            })
                                        }
                                        required
                                    >
                                        <option value="">
                                            -- choose account --
                                        </option>
                                        {accountOpts.map((a) => (
                                            <option key={a} value={a}>
                                                {a}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group1">
                                    <label>CourseID</label>
                                    <select
                                        value={createForm.CourseID}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                CourseID: e.target.value,
                                            })
                                        }
                                        required
                                    >
                                        <option value="">
                                            -- choose course --
                                        </option>
                                        {courseOpts.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group1">
                                    <label>Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={createForm.Amount}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                Amount: e.target.value,
                                            })
                                        }
                                        required
                                        className="filter-input"
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>PayDate</label>
                                    <input
                                        type="datetime-local"
                                        value={createForm.PayDate}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                PayDate: e.target.value,
                                            })
                                        }
                                        required
                                        className="filter-input"
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>PStatus</label>
                                    <select
                                        value={createForm.PStatus}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                PStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="Paid">Paid</option>
                                        <option value="Processing">
                                            Processing
                                        </option>
                                        <option value="Failed">Failed</option>
                                    </select>
                                </div>

                                <div className="form-group1">
                                    <label>TransactionRef</label>
                                    <input
                                        value={createForm.TransactionRef}
                                        onChange={(e) =>
                                            setCreateForm({
                                                ...createForm,
                                                TransactionRef: e.target.value,
                                            })
                                        }
                                        placeholder="TXNxxxx"
                                    />
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

            {/* Edit Modal */}
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
                            <h2>Edit payment</h2>
                            <p className="muted">Update the selected payment</p>
                        </div>

                        <form className="settings-form1" onSubmit={submitEdit}>
                            <div className="form-section1">
                                <div className="form-group1">
                                    <label>PaymentID</label>
                                    <input
                                        value={editForm.PaymentID}
                                        disabled
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>AccountID</label>
                                    <select
                                        value={editForm.AccountID}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                AccountID: e.target.value,
                                            })
                                        }
                                        required
                                    >
                                        <option value="">
                                            -- choose account --
                                        </option>
                                        {accountOpts.map((a) => (
                                            <option key={a} value={a}>
                                                {a}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group1">
                                    <label>CourseID</label>
                                    <select
                                        value={editForm.CourseID}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                CourseID: e.target.value,
                                            })
                                        }
                                        required
                                    >
                                        <option value="">
                                            -- choose course --
                                        </option>
                                        {courseOpts.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group1">
                                    <label>Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editForm.Amount}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                Amount: e.target.value,
                                            })
                                        }
                                        required
                                        className="filter-input"
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>PayDate</label>
                                    <input
                                        type="datetime-local"
                                        value={editForm.PayDate}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                PayDate: e.target.value,
                                            })
                                        }
                                        required
                                        className="filter-input"
                                    />
                                </div>

                                <div className="form-group1">
                                    <label>PStatus</label>
                                    <select
                                        value={editForm.PStatus}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                PStatus: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">(none)</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Processing">
                                            Processing
                                        </option>
                                        <option value="Failed">Failed</option>
                                    </select>
                                </div>

                                <div className="form-group1">
                                    <label>TransactionRef</label>
                                    <input
                                        value={editForm.TransactionRef}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                TransactionRef: e.target.value,
                                            })
                                        }
                                    />
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

            {/* Delete Modal */}
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
                            <h2>Delete payment</h2>
                            <p className="muted">
                                Are you sure you want to delete{" "}
                                <strong>{current?.PaymentID}</strong>?
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

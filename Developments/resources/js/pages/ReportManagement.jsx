import React, { useEffect, useMemo, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";
import "../../css/ReportManagement.css";

const API = "http://127.0.0.1:8000/api";

/* ===== Helpers ===== */
const nf = (n) =>
    new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
        Number(n || 0)
    );

const nfVND = (n) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(Number(n || 0));

function useAuthHeaders() {
    return useMemo(
        () => ({
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        }),
        []
    );
}
const norm = (x) =>
    String(x ?? "")
        .replace(/\s+/g, " ")
        .trim();

async function safeGet(url, headers) {
    const h = { Accept: "application/json", ...(headers || {}) };
    if (h.Authorization && h.Authorization.endsWith(" "))
        delete h.Authorization;
    const res = await fetch(url, { headers: h, credentials: "same-origin" });
    if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error(
            "[Report API] FAIL",
            res.status,
            res.statusText,
            url,
            txt
        );
        throw new Error(`${res.status} ${res.statusText}`);
    }
    return (await res.json().catch(() => ({}))) ?? {};
}

const toArraySafe = (x) =>
    Array.isArray(x)
        ? x
        : (x && Array.isArray(x.data) && x.data) ||
          (x && Array.isArray(x.items) && x.items) ||
          (x && Array.isArray(x.rows) && x.rows) ||
          [];

function normalizeLineSeries(raw) {
    // backend trả về {labels, counts}
    if (raw && Array.isArray(raw.labels)) {
        const values = raw.counts ?? raw.values ?? [];
        const n = Math.min(raw.labels.length, values.length);
        return Array.from({ length: n }, (_, i) => ({
            date: String(raw.labels[i]),
            value: Number(values[i]) || 0,
        }));
    }
    return [];
}

function normalizePie(raw) {
    const arr = toArraySafe(raw);
    if (arr.length && arr[0]?.name != null && arr[0]?.value != null) return arr;
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        return Object.entries(raw).map(([k, v]) => ({
            name: String(k),
            value: Number(v) || 0,
        }));
    }
    return [];
}

const PIE_COLORS = ["#22c55e", "#8b5cf6", "#f59e0b", "#06b6d4", "#ef4444"];

/* ===== Component ===== */
export default function ReportManagement() {
    const navigate = useNavigate();
    const headers = useAuthHeaders();

    const [range, setRange] = useState("this_week"); // today | this_week | this_month | this_year
    const [loading, setLoading] = useState(false);

    const [summary, setSummary] = useState({
        users: 0,
        courses: 0,
        revenue: 0,
        completeRate: 0,
    });
    const [barData, setBarData] = useState([]);
    const [lineData, setLineData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [latestUsers, setLatestUsers] = useState([]);

    const rangeLabel =
        range === "today"
            ? "Today"
            : range === "this_week"
            ? "This week"
            : range === "this_month"
            ? "This month"
            : range === "this_year"
            ? "This year"
            : "Overview";

    // label trắng “Role: value” bên ngoài donut
    const renderPieLabel = (props) => {
        const { cx, cy, midAngle, outerRadius, name, value } = props;
        const RAD = Math.PI / 180;
        const r = outerRadius + 22;
        const x = cx + r * Math.cos(-midAngle * RAD);
        const y = cy + r * Math.sin(-midAngle * RAD);
        return (
            <text
                x={x}
                y={y}
                fill="#ffffff"
                fontSize={12}
                fontWeight={600}
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${name}: ${value}`}
            </text>
        );
    };

    async function loadAll() {
        setLoading(true);
        try {
            const q = `?range=${encodeURIComponent(range)}`;
            const base = `${API}/reports`;

            const [sum, barRaw, lineRaw, pieRaw, latestRaw] = await Promise.all(
                [
                    safeGet(`${base}/summary${q}`, headers),
                    safeGet(`${base}/students-per-course${q}`, headers),
                    safeGet(`${base}/registrations-series${q}`, headers),
                    safeGet(`${base}/roles-pie${q}`, headers),
                    safeGet(`${base}/latest-users${q}`, headers),
                ]
            );

            setSummary({
                users: Number(sum?.users ?? sum?.userCount) || 0,
                courses: Number(sum?.courses ?? sum?.courseCount) || 0,
                revenue: Number(sum?.revenue ?? sum?.revenueMonth) || 0,
                completeRate:
                    Number(sum?.completeRate ?? sum?.completePct) || 0,
            });

            setBarData(
                toArraySafe(barRaw).map((x) => ({
                    course: String(x.course ?? x.CourseID ?? x.name ?? "-"),
                    students: Number(x.students ?? x.count ?? x.total ?? 0),
                }))
            );
            setLineData(normalizeLineSeries(lineRaw));
            setPieData(normalizePie(pieRaw));

            const lu = toArraySafe(latestRaw).map((u) => ({
                AccountID: String(u.AccountID ?? u.id ?? ""),
                AName: norm(u.AName ?? u.name ?? u.Name),
                ARole: norm(u.ARole ?? u.role ?? u.Role ?? u.aRole),
                AStatus: norm(u.AStatus ?? u.status ?? u.Status ?? u.aStatus),
                CreatedAt: u.CreatedAt ?? null, // backend đã alias chính xác
            }));
            setLatestUsers(lu);
        } catch (err) {
            console.error("[Report] loadAll error:", err);
            alert("Failed to load report data.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [range]);

    return (
        <div className="reports-wrap">
            {/* Toolbar */}
            <div className="rm-toolbar">
                <div className="rm-title">
                    <span className="rm-icon" aria-hidden="true">
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <rect
                                x="3"
                                y="10"
                                width="4"
                                height="10"
                                rx="1.2"
                                fill="#60a5fa"
                            />
                            <rect
                                x="10"
                                y="6"
                                width="4"
                                height="14"
                                rx="1.2"
                                fill="#22c55e"
                            />
                            <rect
                                x="17"
                                y="3"
                                width="4"
                                height="17"
                                rx="1.2"
                                fill="#f59e0b"
                            />
                        </svg>
                    </span>
                    <div>
                        <h1 className="rm-h1">Report Management</h1>
                        <p className="rm-sub">Overview • {rangeLabel}</p>
                    </div>
                </div>

                <div className="rm-actions">
                    <select
                        className="ui-select ui-select--pill"
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                        title="Chọn khoảng thời gian"
                    >
                        <option value="today">Today</option>
                        <option value="this_week">This week</option>
                        <option value="this_month">This month</option>
                        <option value="this_year">This year</option>
                    </select>

                    <button
                        className="btn btn--ghost"
                        onClick={() => navigate("/admin")}
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="kpi-row">
                <div className="kpi-card">
                    <div className="kpi-title">User</div>
                    <div className="kpi-value">{nf(summary.users)}</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-title">Course</div>
                    <div className="kpi-value">{nf(summary.courses)}</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-title">Revenue (month)</div>
                    <div className="kpi-value">{nfVND(summary.revenue)}</div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-title">Complete</div>
                    <div className="kpi-value">{nf(summary.completeRate)}%</div>
                    <div className="progress" style={{ marginTop: 8 }}>
                        <div
                            style={{
                                width: `${Math.min(
                                    100,
                                    Math.max(0, summary.completeRate)
                                )}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid-3">
                {/* Bar */}
                <div className="panel">
                    <h3>Bar chart: Students registered / course</h3>
                    <div className="chart-box">
                        <ResponsiveContainer>
                            <BarChart
                                data={barData}
                                margin={{
                                    top: 8,
                                    right: 10,
                                    left: 0,
                                    bottom: 28,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#1e293b"
                                />
                                <XAxis
                                    dataKey="course"
                                    interval={0}
                                    angle={-20}
                                    tickMargin={10}
                                    height={40}
                                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                                />
                                <YAxis
                                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: "#ffffff",
                                        border: "1px solid #e5e7eb",
                                        color: "#0b1220",
                                    }}
                                    labelStyle={{ color: " #e5e7eb" }}
                                    itemStyle={{ color: " #e5e7eb" }}
                                />
                                <Legend />
                                <Bar
                                    dataKey="students"
                                    name="Students"
                                    fill="#60a5fa"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Line */}
                <div className="panel">
                    <h3>Line chart: Registrations</h3>
                    <div className="chart-box">
                        <ResponsiveContainer>
                            <LineChart data={lineData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#1e293b"
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                                />
                                <YAxis
                                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: "#ffffff",
                                        border: "1px solid #e5e7eb",
                                        color: "#0b1220",
                                    }}
                                    labelStyle={{ color: " #e5e7eb" }}
                                    itemStyle={{ color: " #e5e7eb" }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    name="Registrations"
                                    stroke="#22c55e"
                                    strokeWidth={3}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie */}
                <div className="panel">
                    <h3>Pie chart: User distribution by role</h3>
                    <div className="chart-box">
                        <ResponsiveContainer>
                            <PieChart margin={{ right: 40 }}>
                                <Tooltip
                                    contentStyle={{
                                        background: "#ffffff",
                                        border: "1px solid #e5e7eb",
                                        color: "#0b1220",
                                    }}
                                    labelStyle={{ color: "#0b1220" }}
                                    itemStyle={{ color: " #e5e7eb" }}
                                />
                                <Legend />
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    labelLine
                                    label={renderPieLabel}
                                >
                                    {pieData.map((_, idx) => (
                                        <Cell
                                            key={idx}
                                            fill={
                                                PIE_COLORS[
                                                    idx % PIE_COLORS.length
                                                ]
                                            }
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Latest users */}
            <div className="panel" style={{ marginTop: 12 }}>
                <h3>New user list</h3>
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: 60 }}>#</th>
                                <th>AccountID</th>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Date created</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="tiny">
                                        Loading…
                                    </td>
                                </tr>
                            ) : latestUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="tiny">
                                        No data
                                    </td>
                                </tr>
                            ) : (
                                latestUsers.map((u, idx) => {
                                    const roleVal = u.ARole || "-";
                                    const statusVal = u.AStatus || "-";
                                    const roleCls =
                                        roleVal.toLowerCase() === "admin"
                                            ? "dot dot--admin"
                                            : roleVal.toLowerCase() ===
                                              "instructor"
                                            ? "dot dot--instructor"
                                            : "dot dot--learner";
                                    const statusCls =
                                        statusVal.toLowerCase() === "active"
                                            ? "dot dot--ok"
                                            : "dot dot--off";
                                    return (
                                        <tr key={u.AccountID || idx}>
                                            <td>{idx + 1}</td>
                                            <td className="tiny">
                                                {u.AccountID}
                                            </td>
                                            <td>{u.AName || "-"}</td>
                                            <td title={roleVal}>
                                                <span
                                                    className={roleCls}
                                                    aria-hidden="true"
                                                ></span>
                                                <span className="cell-text-strong">
                                                    {roleVal}
                                                </span>
                                            </td>
                                            <td className="tiny">
                                                {u.CreatedAt
                                                    ? new Date(
                                                          String(
                                                              u.CreatedAt
                                                          ).includes(" ")
                                                              ? String(
                                                                    u.CreatedAt
                                                                ).replace(
                                                                    " ",
                                                                    "T"
                                                                )
                                                              : String(
                                                                    u.CreatedAt
                                                                )
                                                      ).toLocaleString()
                                                    : "-"}
                                            </td>
                                            <td title={statusVal}>
                                                <span
                                                    className={statusCls}
                                                    aria-hidden="true"
                                                ></span>
                                                <span className="cell-text-strong">
                                                    {statusVal}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

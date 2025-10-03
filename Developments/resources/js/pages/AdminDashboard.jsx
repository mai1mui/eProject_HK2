import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "../../css/AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // ==== API client (một lần, có interceptor 401) ====
  const API_BASE = import.meta?.env?.VITE_API_URL || "http://127.0.0.1:8000/api";

  const apiRef = useRef(null);
  if (!apiRef.current) {
    const instance = axios.create({
      baseURL: API_BASE,
      headers: { Accept: "application/json" },
    });

    // Gắn token mỗi request
    instance.interceptors.request.use((cfg) => {
      const t = localStorage.getItem("token");
      if (t) cfg.headers.Authorization = `Bearer ${t}`;
      return cfg;
    });

    // Bắt 401 → logout 1 lần
    let loggingOut = false;
    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        const status = err?.response?.status;
        if (status === 401 && !loggingOut) {
          loggingOut = true;
          try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          } finally {
            setTimeout(() => navigate("/login"), 0);
          }
        }
        return Promise.reject(err);
      }
    );

    apiRef.current = instance;
  }
  const api = apiRef.current;

  // ==== Search ====
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);

  // 🔔 Notifications
  const [notifCount, setNotifCount] = useState(0);
  const [notifList, setNotifList] = useState([]);
  const [openNotif, setOpenNotif] = useState(false);

  // ✉️ Feedback
  const [fbCount, setFbCount] = useState(0);
  const [fbList, setFbList] = useState([]);
  const [openFb, setOpenFb] = useState(false);

  // 🌗 Dark mode
  const [isDark, setIsDark] = useState(true);

  // 👤 Profile dropdown / modals
  const [openProfile, setOpenProfile] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);

  // Avatar
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Refs
  const notifRef = useRef(null);
  const fbRef = useRef(null);
  const profileRef = useRef(null);

  // Current user (from localStorage)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // Cache-buster for avatar
  const [avatarTick, setAvatarTick] = useState(0);
  const computedAvatarUrl =
    previewUrl ||
    (user?.avatarUrl || user?.AvatarUrl || "storage/avatars/avatar.jpg") +
      (previewUrl ? "" : `?v=${avatarTick}`);

  // Dọn preview khi unmount/đổi ảnh
  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  // Dark mode toggle class on <body>
  useEffect(() => {
    if (isDark) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, [isDark]);

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    try {
      await api.post(`/logout`, {});
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    }
  };

  // ===== ColumnChartPro (Bar chart with labels + money tooltip) =====
  function ColumnChartPro({
    points = [],
    labels = [],
    height = 160,
    barWidth = 16,
    gap = 10,
    locale = "vi-VN",
    currency = "VND",
    colors,
  }) {
    const c = resolveChartColors(colors);

    const fmtMoney = (n) =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }).format(Number(n || 0));

    const H = Math.max(height, 120);
    const pad = 18;
    const max = Math.max(...points, 1);
    const min = 0;
    const range = Math.max(max - min, 1);

    const n = points.length || 0;
    const usableW = Math.max(0, n * barWidth + Math.max(0, n - 1) * gap);
    const W = Math.max(usableW + pad * 2, 560);

    const xOf = (i) => pad + i * (barWidth + gap);
    const yOf = (v) =>
      pad + (H - pad * 2) - ((v - min) / range) * (H - pad * 2);
    const hOf = (v) => ((v - min) / range) * (H - pad * 2);

    const gridY = [];
    for (let i = 0; i <= 4; i++) gridY.push(pad + (i * (H - pad * 2)) / 4);

    const [hover, setHover] = React.useState(null);

    return (
      <div style={{ width: "100%", height: H }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${W} ${H}`}
          onMouseLeave={() => setHover(null)}
          style={{ display: "block" }}
        >
          {gridY.map((gy, i) => (
            <line
              key={i}
              x1={pad}
              x2={W - pad}
              y1={gy}
              y2={gy}
              stroke={c.grid}
              strokeWidth="1"
            />
          ))}

          {points.map((v, i) => {
            const x = xOf(i);
            const y = yOf(v);
            const h = hOf(v);
            const active = hover === i;
            return (
              <g
                key={i}
                onMouseEnter={() => setHover(i)}
                onMouseMove={() => setHover(i)}
                style={{ cursor: "default" }}
              >
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(0, h)}
                  rx="4"
                  ry="4"
                  fill={active ? c.barActive : c.bar}
                  fillOpacity={active ? 0.95 : 0.85}
                />
                <circle cx={x + barWidth / 2} cy={y} r="2.5" fill={c.dot} />
              </g>
            );
          })}

          {hover != null && points[hover] != null && (
            <>
              <line
                x1={xOf(hover) + barWidth / 2}
                x2={xOf(hover) + barWidth / 2}
                y1={pad}
                y2={H - pad}
                stroke={c.guide}
                strokeDasharray="4 4"
              />
              <g
                transform={`translate(${Math.min(
                  xOf(hover) + barWidth + 8,
                  W - 172
                )}, ${Math.max(yOf(points[hover]) - 40, 8)})`}
              >
                <rect width="168" height="36" rx="8" ry="8" fill={c.tooltipBg} />
                <text
                  x="10"
                  y="15"
                  fill="#e9f0ff"
                  fontSize="12"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {labels?.[hover] ?? `#${hover + 1}`}
                </text>
                <text
                  x="10"
                  y="27"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {fmtMoney(points[hover])}
                </text>
              </g>
            </>
          )}
        </svg>
      </div>
    );
  }

  // ===== RevenueBarsXLabels =====
  function RevenueBarsXLabels({
    points = [],
    labels = [],
    height = 220,
    barWidth = 18,
    gap = 12,
    maxLabels = "auto",
    labelAngle = -25,
    fontSize = 11,
  }) {
    const darkMode =
      typeof document !== "undefined" &&
      document.body?.classList?.contains("dark-mode");

    const gridColor = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const barColor = darkMode ? "#7aa2ff" : "#3b82f6";
    const barActiveColor = darkMode ? "#a9c2ff" : "#60a5fa";
    const topDotColor = darkMode ? "#e5edff" : "#111827";
    const baselineDotColor = darkMode
      ? "rgba(255,255,255,0.75)"
      : "rgba(0,0,0,0.45)";
    const axisTextColor = darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)";
    const tooltipBg = darkMode ? "rgba(0,0,0,0.6)" : "rgba(17,24,39,0.85)";

    const H = Math.max(190, height);
    const padTop = 12,
      padBottom = 48,
      padSide = 24;

    const n = Math.max(points.length, 1);
    const usableW = n * barWidth + (n - 1) * gap;
    const W = Math.max(usableW + padSide * 2, 560);

    const max = Math.max(...points, 1);
    const span = Math.max(max, 1);
    const innerH = H - padTop - padBottom;

    const x = (i) => padSide + i * (barWidth + gap);
    const y = (v) => padTop + innerH * (1 - v / span);
    const h = (v) => innerH * (v / span);

    const lab =
      Array.isArray(labels) && labels.length === n
        ? labels
        : Array.from({ length: n }, (_, i) => `#${i + 1}`);

    let targetMax;
    if (maxLabels === "full") targetMax = n;
    else if (typeof maxLabels === "number") targetMax = Math.max(1, maxLabels);
    else targetMax = Math.min(12, n);
    const step = Math.max(1, Math.ceil(n / targetMax));

    const fmtMoney = (v) =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(Number(v || 0));

    const [hover, setHover] = React.useState(null);

    const gridY = [0.2, 0.4, 0.6, 0.8].map((p) => padTop + p * innerH);

    return (
      <div style={{ width: "100%", height: H }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${W} ${H}`}
          onMouseLeave={() => setHover(null)}
          style={{ display: "block" }}
        >
          {gridY.map((gy, i) => (
            <line
              key={i}
              x1={padSide}
              x2={W - padSide}
              y1={gy}
              y2={gy}
              stroke={gridColor}
              strokeWidth="1"
            />
          ))}

          {Array.from({ length: n }).map((_, i) => (
            <circle
              key={i}
              cx={x(i) + barWidth / 2}
              cy={padTop + innerH + 10}
              r="2.2"
              fill={baselineDotColor}
            />
          ))}

          {points.map((v, i) => {
            const xi = x(i),
              yi = y(v),
              hi = h(v);
            const active = hover === i;
            return (
              <g key={i} onMouseEnter={() => setHover(i)}>
                <rect
                  x={xi}
                  y={yi}
                  width={barWidth}
                  height={Math.max(0, hi)}
                  rx="6"
                  ry="6"
                  fill={active ? barActiveColor : barColor}
                  opacity={active ? 1 : 0.95}
                />
                <circle cx={xi + barWidth / 2} cy={yi} r="3" fill={topDotColor} />
              </g>
            );
          })}

          {lab.map((t, i) =>
            i % step === 0 ? (
              <text
                key={`lbl-${i}`}
                x={x(i) + barWidth / 2}
                y={padTop + innerH + 30}
                fill={axisTextColor}
                fontSize={fontSize}
                textAnchor="middle"
                transform={`rotate(${labelAngle} ${x(i) + barWidth / 2} ${
                  padTop + innerH + 30
                })`}
              >
                {t}
              </text>
            ) : null
          )}

          {hover != null && points[hover] != null && (
            <g
              transform={`translate(${Math.min(
                x(hover) + barWidth + 8,
                W - 140
              )}, ${Math.max(y(points[hover]) - 34, 8)})`}
            >
              <rect width="130" height="26" rx="6" ry="6" fill={tooltipBg} />
              <text x="10" y="17" fill="#fff" fontSize="12" fontWeight="600">
                {fmtMoney(points[hover])}
              </text>
            </g>
          )}
        </svg>
      </div>
    );
  }

  // ========= Pretty Sparkline v2 (labels + currency tooltip) =========
  function SparklinePro({
    points = [],
    labels = [],
    height = 140,
    strokeWidth = 2.5,
    showDots = true,
    locale = "vi-VN",
    currency = "VND",
  }) {
    const fmtMoney = (n) =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }).format(Number(n || 0));

    const padding = 14;
    const H = Math.max(height, 80);
    const W = 560;
    const n = Math.max(points.length, 2);

    const min = Math.min(...points, 0);
    const max = Math.max(...points, 1);
    const span = Math.max(max - min, 1);

    const x = (i) => {
      if (n <= 1) return padding;
      return padding + (i * (W - padding * 2)) / (n - 1);
    };
    const y = (v) =>
      padding + (H - padding * 2) - ((v - min) / span) * (H - padding * 2);

    const toSmoothPath = (arr) => {
      if (arr.length < 2) return "";
      const cps = 0.25;
      let d = `M ${x(0)} ${y(arr[0])}`;
      for (let i = 0; i < arr.length - 1; i++) {
        const x0 = x(i),
          y0 = y(arr[i]);
        const x1 = x(i + 1),
          y1 = y(arr[i + 1]);
        const dx = (x1 - x0) * cps;
        d += ` C ${x0 + dx} ${y0}, ${x1 - dx} ${y1}, ${x1} ${y1}`;
      }
      return d;
    };

    const linePath = toSmoothPath(points);
    const areaPath = linePath
      ? `${linePath} L ${x(n - 1)} ${y(min)} L ${x(0)} ${y(min)} Z`
      : "";

    const gridY = [];
    for (let i = 0; i <= 4; i++) {
      gridY.push(padding + (i * (H - padding * 2)) / 4);
    }

    const [hover, setHover] = React.useState(null);
    const svgRef = React.useRef(null);

    const handleMove = (evt) => {
      if (!points.length || !svgRef.current) return;
      const bbox = svgRef.current.getBoundingClientRect();
      const relX = evt.clientX - bbox.left;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < points.length; i++) {
        const xi = ((x(i) - padding) / (W - padding * 2)) * bbox.width;
        const dist = Math.abs(xi - relX);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      setHover(best);
    };

    return (
      <div style={{ width: "100%", height: H }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${W} ${H}`}
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
          style={{ display: "block" }}
        >
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopOpacity="0.28" stopColor="#7aa2ff" />
              <stop offset="100%" stopOpacity="0.02" stopColor="#7aa2ff" />
            </linearGradient>
            <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
              <feOffset dy="1" result="off" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.35" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="off" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {gridY.map((gy, i) => (
            <line
              key={i}
              x1={padding}
              x2={W - padding}
              y1={gy}
              y2={gy}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          ))}

          {areaPath && (
            <path d={areaPath} fill="url(#revGrad)" filter="url(#soft)" />
          )}

          {linePath && (
            <path d={linePath} fill="none" stroke="#8fb3ff" strokeWidth={strokeWidth} />
          )}

          {showDots &&
            points.map((v, i) => (
              <circle
                key={i}
                cx={x(i)}
                cy={y(v)}
                r={i === hover ? 4 : 2.6}
                fill={i === hover ? "#cfe0ff" : "#a9c2ff"}
              />
            ))}

          {hover != null && points[hover] != null && (
            <>
              <line
                x1={x(hover)}
                x2={x(hover)}
                y1={padding}
                y2={H - padding}
                stroke="rgba(255,255,255,0.15)"
                strokeDasharray="4 4"
              />
              <circle cx={x(hover)} cy={y(points[hover])} r="5.5" fill="#ffffff" />
              <g
                transform={`translate(${Math.min(
                  x(hover) + 10,
                  W - 180
                )}, ${Math.max(y(points[hover]) - 42, 8)})`}
              >
                <rect width="170" height="36" rx="8" ry="8" fill="rgba(0,0,0,0.6)" />
                <text
                  x="10"
                  y="16"
                  fill="#eaf1ff"
                  fontSize="12"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {labels?.[hover] ?? `#${hover + 1}`}
                </text>
                <text
                  x="10"
                  y="28"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {fmtMoney(points[hover])}
                </text>
              </g>
            </>
          )}
        </svg>
      </div>
    );
  }

  // --- Pills ---
  const StatusPill = ({ ok, textOk = "OK", textBad = "Issue" }) => (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${
        ok
          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
          : "bg-rose-500/15 text-rose-300 border-rose-500/30"
      }`}
      style={{ display: "inline-flex" }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-emerald-400" : "bg-rose-400"}`} />
      {ok ? textOk : textBad}
    </span>
  );

  // ===== Helpers =====
  const isDarkMode = () => document.body.classList.contains("dark-mode");
  function resolveChartColors(overrides) {
    const dark = {
      grid: "rgba(255,255,255,0.08)",
      bar: "#7aa2ff",
      barActive: "#a9c2ff",
      dot: "#e5edff",
      baselineDot: "rgba(255,255,255,0.75)",
      axisText: "rgba(255,255,255,0.7)",
      tooltipBg: "rgba(0,0,0,0.6)",
      guide: "rgba(255,255,255,0.18)",
    };
    const light = {
      grid: "rgba(0,0,0,0.08)",
      bar: "#3b82f6",
      barActive: "#60a5fa",
      dot: "#111827",
      baselineDot: "rgba(0,0,0,0.45)",
      axisText: "rgba(0,0,0,0.6)",
      tooltipBg: "rgba(17,24,39,0.8)",
      guide: "rgba(0,0,0,0.18)",
    };
    const base = isDarkMode() ? dark : light;
    return { ...base, ...(overrides || {}) };
  }
  const currency = (n) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(n || 0));
  const fmt = (n) => new Intl.NumberFormat().format(Number(n || 0));

  // Anim
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  // ===== Announcements & Admin Tasks =====
  const [annLoading, setAnnLoading] = useState(false);
  const [anns, setAnns] = useState([]);
  const [taskLoading, setTaskLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const LS_ANN = "adm_anns";
  const LS_TASK = "adm_tasks";

  // LocalStorage helpers
  const loadLS = (k, def = []) => {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? def;
    } catch {
      return def;
    }
  };
  const saveLS = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  };

  // toArraySafe (dùng chung)
  function toArraySafe(res) {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.items)) return res.items;
    if (Array.isArray(res?.data?.data)) return res.data.data;
    if (res && typeof res === "object") return Object.values(res);
    return [];
  }

  // Announcements
  async function fetchAnnouncements() {
    setAnnLoading(true);
    try {
      const r = await getJSON("/admin/announcements");
      const arr = toArraySafe(r).map((a, i) => ({
        id: a.id ?? `a_${i}`,
        icon: a.icon ?? "📢",
        text: a.text ?? a.title ?? String(a),
        url: a.url ?? null,
        created_at: a.created_at ?? a.CreatedAt ?? null,
      }));
      setAnns(arr);
      saveLS(LS_ANN, arr);
    } catch {
      const fallback = loadLS(LS_ANN, [
        {
          id: "a1",
          icon: "🚀",
          text: "Payment gateway sandbox is available. Test before switching live.",
          created_at: new Date().toISOString(),
        },
        {
          id: "a2",
          icon: "📈",
          text: "Quarterly report template updated. Visit Reports to export.",
          created_at: new Date().toISOString(),
        },
        {
          id: "a3",
          icon: "🛡️",
          text: "Enable 2FA for all Admin accounts this week.",
          created_at: new Date().toISOString(),
        },
      ]);
      setAnns(fallback);
    } finally {
      setAnnLoading(false);
    }
  }

  async function dismissAnn(id) {
    setAnns((prev) => prev.filter((x) => x.id !== id));
    saveLS(LS_ANN, anns.filter((x) => x.id !== id));
    // Nếu có API xoá thì gọi ở đây: await api.delete(`/admin/announcements/${id}`);
  }

  // Tasks (ưu tiên API nếu có, fallback LS)
  async function fetchTasks() {
    setTaskLoading(true);
    try {
      const r = await getJSON("/admin/tasks");
      const arr = toArraySafe(r).map((t, i) => ({
        id: t.id ?? `t_${i}`,
        title: t.title ?? t.label ?? String(t),
        done: !!(t.done ?? t.completed),
      }));
      setTasks(arr);
      saveLS(LS_TASK, arr);
    } catch {
      const fromLS = loadLS(LS_TASK, []);
      if (fromLS.length) {
        setTasks(fromLS);
      } else {
        const seed = [
          { id: "t1", title: "Review pending refunds", done: false },
          { id: "t2", title: "Approve 4 new instructors", done: false },
          { id: "t3", title: "Archive expired courses", done: false },
        ];
        setTasks(seed);
        saveLS(LS_TASK, seed);
      }
    } finally {
      setTaskLoading(false);
    }
  }

  function addTask(title) {
    const t = String(title || "").trim();
    if (!t) return;
    const next = [
      { id: crypto.randomUUID?.() || String(Date.now()), title: t, done: false },
      ...tasks,
    ];
    setTasks(next);
    saveLS(LS_TASK, next);
    // Nếu có API: await api.post(`/admin/tasks`, { title: t });
  }

  function toggleTask(id) {
    const next = tasks.map((x) => (x.id === id ? { ...x, done: !x.done } : x));
    setTasks(next);
    saveLS(LS_TASK, next);
    // Nếu có API: await api.patch(`/admin/tasks/${id}`, { done: ... });
  }

  function removeTask(id) {
    const next = tasks.filter((t) => t.id !== id);
    setTasks(next);
    saveLS(LS_TASK, next);
    // Nếu có API: await api.delete(`/admin/tasks/${id}`);
  }

  // ===== Text helpers =====
  function pickAccountName(obj) {
    if (!obj || typeof obj !== "object") return null;
    return (
      obj.AName ?? obj.FullName ?? obj.name ?? obj.Email ?? obj.AccountID ?? null
    );
  }
  function pickCourseTitle(obj) {
    if (!obj || typeof obj !== "object") return null;
    return obj.Title ?? obj.CName ?? obj.title ?? obj.CourseID ?? null;
  }
  function toPlainText(v) {
    if (v == null) return "—";
    if (typeof v === "string" || typeof v === "number") return String(v);
    if (v instanceof Date) return v.toLocaleString();
    if (Array.isArray(v)) return v.map(toPlainText).join(", ");
    if (typeof v === "object") {
      const course = pickCourseTitle(v);
      if (course) return String(course);
      const acc = pickAccountName(v);
      if (acc) return String(acc);
      try {
        return JSON.stringify(v);
      } catch {
        return "—";
      }
    }
    return String(v);
  }
  function formatDateLoose(v) {
    if (!v) return "";
    if (v instanceof Date) return v.toLocaleString();
    const s = String(v);
    const isoish = s.includes(" ") ? s.replace(" ", "T") : s;
    const d = new Date(isoish);
    return isNaN(d.getTime()) ? s : d.toLocaleString();
  }
  function openProfileFor(accLike) {
    if (!accLike) return;
    const preview = {
      AccountID: accLike.AccountID ?? accLike.id ?? "",
      AName: accLike.AName ?? accLike.name ?? "",
      Email: accLike.Email ?? accLike.email ?? "",
      ARole: accLike.ARole ?? accLike.role ?? "Instructor",
      AStatus: accLike.AStatus ?? accLike.status ?? "Active",
      CreatedAt:
        accLike.CreatedAt ?? accLike.created_at ?? accLike.createdAt ?? "",
      AvatarUrl:
        accLike.avatar ??
        accLike.avatarUrl ??
        accLike.AvatarUrl ??
        "storage/avatars/avatar.jpg",
    };
    setProfilePreview(preview);
    setOpenPreviewModal(true);
  }

  function buildSeriesFromPayments(items, range = "7d") {
    const now = new Date();
    const keyOfDay = (d) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate())
        .toISOString()
        .slice(0, 10);
    const keyOfMonth = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    let labels = [];
    if (range === "12m") {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(keyOfMonth(d));
      }
    } else {
      const days = range === "30d" ? 30 : 7;
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        labels.push(keyOfDay(d));
      }
    }

    const sums = Object.create(null);
    for (const it of items) {
      const status = String(it.status || "").toLowerCase();
      if (!["paid", "refunded", "processing", "pending"].includes(status)) {
        // nếu chỉ muốn Paid: if (status !== 'paid') continue;
      }
      const amount = Number(it.amount || 0);
      if (!amount) continue;

      const raw = it.date || it.PayDate || it.created_at || it.updated_at;
      const d = raw ? new Date(String(raw).replace(" ", "T")) : null;
      if (!d || Number.isNaN(d.getTime())) continue;

      const key = range === "12m" ? keyOfMonth(d) : keyOfDay(d);
      sums[key] = (sums[key] || 0) + amount;
    }

    const series = labels.map((k) => Number(sums[k] || 0));
    return { labels, series };
  }

  // ===== Normalizers / Mappers =====
  function pickArrayPayload(res) {
    if (Array.isArray(res?.data?.data)) return res.data.data;
    if (Array.isArray(res?.data?.items)) return res.data.items;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res)) return res;
    return [];
  }

  function normStatus(value) {
    if (value === 1 || value === "1" || /^active$/i.test(String(value)))
      return "Active";
    if (value === 0 || value === "0" || /^inactive$/i.test(String(value)))
      return "Inactive";
    return String(value ?? "");
  }

  function mapPaymentRow(p) {
    const payerRaw =
      p.Payer ??
      p.AName ??
      p.FullName ??
      p.payer ??
      p.account_name ??
      p.account ??
      (p?.account ? p.account : null);

    const courseRaw =
      p.Course ?? p.CName ?? p.title ?? p.course ?? (p?.course ? p.course : null);

    return {
      id: p.PaymentID ?? p.id ?? p.payment_id,
      payer: toPlainText(payerRaw),
      course: toPlainText(courseRaw),
      amount: Number(p.Amount ?? p.amount ?? 0),
      status: toPlainText(p.Status ?? p.status ?? p.PStatus),
      date: formatDateLoose(p.PayDate ?? p.date ?? p.created_at ?? p.updated_at),
    };
  }

  function mapCourseRow(c) {
    const title = toPlainText(c.Title ?? c.CName ?? c.title ?? c);
    return {
      id: c.CourseID ?? c.id,
      title,
      students: Number(
        c.Students ??
          c.students ??
          c.student_count ??
          c.enrollments_count ??
          c.payments_count ??
          0
      ),
    };
  }

  function mapUserRow(u) {
    const name = toPlainText(u.FullName ?? u.AName ?? u.name ?? u);
    return {
      id: u.AccountID ?? u.id,
      name,
      role: toPlainText(u.Role ?? u.ARole ?? u.role),
      status: normStatus(u.Status ?? u.AStatus ?? u.status),
    };
  }

  function normCourseId(c) {
    const v = c?.CourseID ?? c?.course_id ?? c?.id ?? null;
    return v === undefined || v === null || v === "" ? null : String(v);
  }

  function normCreatorId(c) {
    const v = c?.CreatorID ?? c?.creator ?? c?.created_by ?? null;
    return v === undefined || v === null || v === "" ? null : String(v);
  }

  function mapAccountBasic(a) {
    const avatarUrl =
      a.AvatarUrl ??
      a.Avatar ??
      a.avatarUrl ??
      a.avatar ??
      "storage/avatars/avatar.jpg";
    const createdAt = a.CreatedAt ?? a.created_at ?? a.createdAt ?? "";
    const email = a.Email ?? a.email ?? "";

    return {
      id: a.AccountID ?? a.id ?? "",
      name: a.AName ?? a.FullName ?? a.name ?? "",
      role: a.ARole ?? a.Role ?? a.role ?? "Instructor",
      status: a.AStatus ?? a.Status ?? a.status ?? "Active",
      email,
      createdAt,
      avatarUrl,
      // alias
      Email: email,
      CreatedAt: createdAt,
      AvatarUrl: avatarUrl,
      avatar: avatarUrl,
    };
  }

  const [tiLoading, setTiLoading] = useState(false);
  const [topInst, setTopInst] = useState([]);
  const [topInstructors, setTopInstructors] = useState([]); // giữ cho tương thích nơi khác

  async function fetchTopInstructors(limit = 5) {
    setTiLoading(true);
    try {
      let courses = [];
      try {
        const r = await getJSON("/courses", { per_page: 300 });
        courses = pickArrayPayload(r);
      } catch (_) {
        courses = [];
      }

      const OK_STATUSES = new Set(["Paid"]);
      let enrollments = [];
      try {
        const rE = await getJSON("/enrollments", { per_page: 1000 });
        enrollments = pickArrayPayload(rE);
      } catch (_) {
        enrollments = [];
      }

      const courseCounts = new Map();
      for (const e of enrollments) {
        const cid = e?.CourseID ?? e?.course_id ?? null;
        if (!cid) continue;
        const st = String(e?.EStatus ?? e?.status ?? "").trim();
        if (!OK_STATUSES.has(st)) continue;
        courseCounts.set(cid, (courseCounts.get(cid) || 0) + 1);
      }

      const byCreator = new Map();
      for (const c of courses) {
        const creator = normCreatorId(c);
        const cid = normCourseId(c);
        if (!creator || !cid) continue;
        const cnt = courseCounts.get(cid) || 0;
        if (!byCreator.has(creator)) {
          byCreator.set(creator, { totalStudents: 0, totalCourses: 0 });
        }
        const node = byCreator.get(creator);
        node.totalStudents += cnt;
        node.totalCourses += 1;
      }

      if (byCreator.size === 0) {
        setTopInst([]);
        return;
      }

      let accRows = [];
      try {
        const rAcc = await getJSON("/admin/list/accounts", { per_page: 300 });
        accRows = pickArrayPayload(rAcc);
      } catch (_) {
        try {
          const rAcc2 = await getJSON("/accounts", { per_page: 300 });
          accRows = pickArrayPayload(rAcc2);
        } catch {
          accRows = [];
        }
      }

      const accMap = new Map(
        accRows.map((a) => [a?.AccountID ?? a?.id ?? "", mapAccountBasic(a)])
      );

      const list = Array.from(byCreator.entries())
        .map(([creatorId, meta]) => {
          const acc = accMap.get(creatorId) || {
            id: creatorId,
            name: creatorId,
            role: "Instructor",
            status: "Active",
            email: "",
            createdAt: "",
            avatarUrl: "storage/avatars/avatar.jpg",
          };
          return {
            id: creatorId,
            name: acc.name,
            role: acc.role,
            status: acc.status,
            email: acc.email,
            createdAt: acc.createdAt,
            avatarUrl: acc.avatarUrl,
            totalStudents: meta.totalStudents,
            totalCourses: meta.totalCourses,
          };
        })
        .filter((x) => /instructor/i.test(String(x.role)))
        .sort((a, b) => b.totalStudents - a.totalStudents)
        .slice(0, limit);

      setTopInst(list);
    } catch (e) {
      console.error("fetchTopInstructors error:", e);
      setTopInst([]);
    } finally {
      setTiLoading(false);
    }
  }

  async function getJSON(path, params) {
    try {
      const res = await api.get(path, { params });
      return res;
    } catch (err) {
      console.error(
        `[GET ${path}]`,
        err?.response?.status,
        err?.response?.data || err.message
      );
      throw err;
    }
  }

  // ===== CreatedAt formatter =====
  const rawCreatedAt = user?.CreatedAt ?? user?.created_at ?? user?.createdAt ?? null;
  const toDisplayDate = (s) => {
    if (!s) return "-";
    const isoish = typeof s === "string" && s.includes(" ") ? s.replace(" ", "T") : s;
    const d = new Date(isoish);
    return isNaN(d.getTime()) ? String(s) : d.toLocaleString();
  };
  const displayCreatedAt = toDisplayDate(rawCreatedAt);

  // ===== Activity Log modal =====
  const [openActivityModal, setOpenActivityModal] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logPage, setLogPage] = useState(1);
  const [logTotal, setLogTotal] = useState(0);
  const [logPerPage, setLogPerPage] = useState(10);
  const [logLoading, setLogLoading] = useState(false);
  const [logFilter, setLogFilter] = useState("");

  useEffect(() => {
    if (openActivityModal) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [openActivityModal]);

  const fetchMyLogs = async (page = 1, filter = "") => {
    setLogLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("per_page", logPerPage);
      if (filter) params.set("action", filter);

      const res = await api.get(`/my/activity-logs?${params.toString()}`);

      setLogs(res.data?.data || []);
      setLogTotal(res.data?.total || 0);
      setLogPerPage(res.data?.per_page || 10);
      setLogPage(res.data?.page || page);
    } catch (e) {
      console.error("Fetch logs error:", e);
    } finally {
      setLogLoading(false);
    }
  };
  const totalPages = Math.max(1, Math.ceil(logTotal / logPerPage));

  // ===== Dashboard data =====
  const [kpiData, setKpiData] = useState(null);
  const [sysHealth, setSysHealth] = useState({ api: true, db: true, jobs: true });
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [revLabels, setRevLabels] = useState([]);
  const [latestPayments, setLatestPayments] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [latestUsers, setLatestUsers] = useState([]);

  // --- Revenue controls ---
  const [revRange, setRevRange] = useState("7d"); // "7d" | "30d" | "12m"
  const [revGranularity, setRevGranularity] = useState("day");
  const [revLoading, setRevLoading] = useState(false);

  // Revenue fetcher
  async function fetchRevenueSeries(range = "7d") {
    const gran = range === "12m" ? "month" : "day";
    setRevGranularity(gran);
    setRevLoading(true);
    try {
      const r = await getJSON("/reports/revenue-series", { range, granularity: gran });
      const series = Array.isArray(r?.data?.series) ? r.data.series : [];
      const labels = Array.isArray(r?.data?.labels) ? r.data.labels : [];
      if (series.length && labels.length) {
        setRevenueTrend(series.map(Number));
        setRevLabels(labels);
        return;
      }
      throw new Error("Empty series from server");
    } catch (e) {
      console.warn("revenue-series API failed, using FE fallback:", e?.message || e);
      try {
        let res;
        try {
          res = await getJSON("/admin/list/payments", { per_page: 200 });
        } catch {
          res = await getJSON("/payments", { per_page: 200 });
        }
        const items = pickArrayPayload(res).map(mapPaymentRow);
        const { labels, series } = buildSeriesFromPayments(items, range);
        setRevLabels(labels);
        setRevenueTrend(series);
      } catch (feErr) {
        console.error("fallback from payments failed:", feErr);
        setRevLabels([]);
        setRevenueTrend([]);
      }
    } finally {
      setRevLoading(false);
    }
  }

  // ===== Effects =====
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchAnnouncements();
    fetchTasks();
  }, []);

  // Interval 5 phút — chỉ chạy khi có token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const t = setInterval(() => {
      fetchAnnouncements();
      fetchTasks();
    }, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const r = await getJSON("/admin/summary");
        setKpiData(r?.data || null);
      } catch (_) {}

      try {
        await getJSON("/health");
        setSysHealth({ api: true, db: true, jobs: true });
      } catch (_) {
        setSysHealth({ api: false, db: false, jobs: false });
      }

      try {
        const r = await getJSON("/admin/list/payments", { per_page: 5 });
        const rows = pickArrayPayload(r).map(mapPaymentRow);
        setLatestPayments(rows);
      } catch {
        try {
          const r2 = await getJSON("/payments", { per_page: 5 });
          const rows2 = pickArrayPayload(r2).map(mapPaymentRow);
          setLatestPayments(rows2);
        } catch {
          setLatestPayments([]);
        }
      }

      try {
        const r = await getJSON("/admin/list/courses", { sort: "top", per_page: 5 });
        const rows = pickArrayPayload(r).map(mapCourseRow);
        setTopCourses(rows);
      } catch {
        try {
          const r2 = await getJSON("/courses", { per_page: 5 });
          const rows2 = pickArrayPayload(r2).map(mapCourseRow);
          setTopCourses(rows2);
        } catch {
          setTopCourses([]);
        }
      }

      try {
        const r = await getJSON("/admin/list/accounts", { per_page: 4 });
        const rows = pickArrayPayload(r).map(mapUserRow);
        setLatestUsers(rows);
      } catch {
        try {
          const r2 = await getJSON("/accounts", { per_page: 4 });
          const rows2 = pickArrayPayload(r2).map(mapUserRow);
          setLatestUsers(rows2);
        } catch {
          setLatestUsers([]);
        }
      }
    })();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchRevenueSeries(revRange);
  }, [revRange]);

  const handleSearch = async () => {
    if (searchTerm.trim().length < 2) {
      setResults([]);
      setShowSuggest(false);
      return;
    }
    try {
      const res = await api.get(`/search`, { params: { query: searchTerm } });
      const items = Array.isArray(res?.data) ? res.data : res?.data?.items || [];
      setResults(items);
      setShowSuggest(true);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleSelect = (path) => {
    setSearchTerm("");
    setResults([]);
    setShowSuggest(false);
    navigate(path);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchTopInstructors(5);
  }, []);

  // Outside click to close popups
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setOpenNotif(false);
      if (fbRef.current && !fbRef.current.contains(e.target)) setOpenFb(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setOpenProfile(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Notifications polling — guard token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchNotifications = async () => {
      try {
        const res1 = await api.get(`/notifications`);
        setNotifCount(res1.data?.unread || 0);
        setNotifList(res1.data?.items || []);

        const res2 = await api.get(`/notifications/feedback`);
        setFbCount(res2.data?.unread || 0);
        setFbList(res2.data?.items || []);
      } catch (err) {
        console.error("Fetch notifications error:", err);
      }
    };

    fetchNotifications();
    const t = setInterval(fetchNotifications, 30000);
    return () => clearInterval(t);
  }, []);

  const markAllRead = async () => {
    await api.post(`/notifications/mark-all-read`, {});
    setNotifCount(0);
    const res = await api.get(`/notifications`);
    setNotifList(res.data?.items || []);
  };

  const markAllFbRead = async () => {
    await api.post(`/notifications/feedback/mark-all-read`, {});
    setFbCount(0);
    const res = await api.get(`/notifications/feedback`);
    setFbList(res.data?.items || []);
  };

  const markSingleAndNavigate = async (id, link, isFeedback = false) => {
    try {
      await api.post(`/notifications/${id}/read`, {});
      if (isFeedback) {
        const res = await api.get(`/notifications/feedback`);
        setFbList(res.data?.items || []);
        setFbCount(res.data?.unread || 0);
      } else {
        const res = await api.get(`/notifications`);
        setNotifList(res.data?.items || []);
        setNotifCount(res.data?.unread || 0);
      }
      navigate(link);
    } catch (err) {
      console.error("Mark single read error:", err);
      navigate(link);
    }
  };

  return (
    <div className="admin-container">
      {/* Topbar */}
      <header className="topbar">
        <h1 className="system-title">Admin Management</h1>

        {/* SEARCH */}
        <div className="top-search">
          <input
            type="text"
            placeholder="Search accounts, courses, lessons..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button type="button" aria-label="Search" className="search-btn" onClick={handleSearch}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {showSuggest && results.length > 0 && (
            <div className="search-suggest">
              {results.map((r, i) => (
                <div key={i} className="suggest-item" onClick={() => handleSelect(r.path)}>
                  <span className={`pill pill-${r.type?.toLowerCase?.()}`}>{r.type}</span>
                  <span className="label">{r.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="profile">
          {/* 🔔 Notifications */}
          <div className="notif-wrap" ref={notifRef}>
            <span
              className="notification"
              onClick={() => {
                setOpenNotif(!openNotif);
                setOpenFb(false);
                setOpenProfile(false);
              }}
            >
              🔔 <span className="badge">{notifCount}</span>
            </span>
            {openNotif && (
              <div className="notif-dropdown">
                <div className="notif-head">
                  <strong>Notifications</strong>
                  <button onClick={markAllRead}>Mark all read</button>
                </div>
                <ul>
                  {notifList.map((n) => (
                    <li key={n.id} className={n.read_at ? "read" : "unread"}>
                      <div className="title">{n.title}</div>
                      <div className="msg">{n.message}</div>
                      {n.link && (
                        <button
                          className="open-link"
                          onClick={() => markSingleAndNavigate(n.id, n.link, false)}
                        >
                          View
                        </button>
                      )}
                      <small>{new Date(n.created_at).toLocaleString()}</small>
                    </li>
                  ))}
                  {notifList.length === 0 && <li className="empty">No notifications</li>}
                </ul>
              </div>
            )}
          </div>

          {/* ✉️ Feedback */}
          <div className="notif-wrap" ref={fbRef}>
            <span
              className="notification mail"
              onClick={() => {
                setOpenFb(!openFb);
                setOpenNotif(false);
                setOpenProfile(false);
              }}
            >
              ✉️ <span className="badge">{fbCount}</span>
            </span>
            {openFb && (
              <div className="notif-dropdown">
                <div className="notif-head">
                  <strong>Feedback</strong>
                  <button onClick={markAllFbRead}>Mark all read</button>
                </div>
                <ul>
                  {fbList.map((n) => (
                    <li key={n.id} className={n.read_at ? "read" : "unread"}>
                      <div className="title">{n.title}</div>
                      <div className="msg">{n.message}</div>
                      {n.link && (
                        <button
                          className="open-link"
                          onClick={() => markSingleAndNavigate(n.id, n.link, true)}
                        >
                          View
                        </button>
                      )}
                      <small>{new Date(n.created_at).toLocaleString()}</small>
                    </li>
                  ))}
                  {fbList.length === 0 && <li className="empty">No feedback</li>}
                </ul>
              </div>
            )}
          </div>

          {/* 🌗 Dark mode toggle */}
          <div className={`theme-toggle ${isDark ? "dark" : "light"}`} onClick={() => setIsDark(!isDark)}>
            <div className="toggle-circle"></div>
          </div>

          {/* 👤 Profile dropdown */}
          <div className="profile-menu" ref={profileRef}>
            <div
              className="profile-trigger"
              onClick={() => {
                setOpenProfile(!openProfile);
                setOpenNotif(false);
                setOpenFb(false);
              }}
            >
              <img src={computedAvatarUrl} alt="avatar" className="avatar" />
              <span className="username">{user?.AName || "Admin"}</span>
            </div>

            {openProfile && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <img src={computedAvatarUrl} alt="avatar" className="avatar large" />
                  <div className="info">
                    <strong>{user?.AName || "Admin"}</strong>
                    <small>{user?.Email || "admin@example.com"}</small>
                  </div>
                </div>

                <ul className="profile-list">
                  <li
                    onClick={() => {
                      setOpenProfileModal(true);
                      setOpenSettingsModal(false);
                      setOpenProfile(false);
                    }}
                  >
                    <i className="fas fa-user"></i> Profile
                  </li>
                  <li
                    onClick={() => {
                      setOpenSettingsModal(true);
                      setOpenProfileModal(false);
                      setOpenProfile(false);
                    }}
                  >
                    <i className="fas fa-cog"></i> Settings
                  </li>
                  <li
                    onClick={() => {
                      setOpenActivityModal(true);
                      setOpenProfile(false);
                      setOpenProfileModal(false);
                      setOpenSettingsModal(false);
                      fetchMyLogs(1, logFilter);
                    }}
                  >
                    <i className="fas fa-list"></i> Activity Log
                  </li>

                  <hr className="divider" />

                  <li onClick={handleLogout} className="danger">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <ul>
          <li className={isActive("/admin/users") ? "active" : ""}>
            <Link to="/admin/users">
              <i className="fas fa-user"></i> Account Management
            </Link>
          </li>
          <li className={isActive("/admin/courses") ? "active" : ""}>
            <Link to="/admin/courses">
              <i className="fas fa-book"></i> Course Management
            </Link>
          </li>
          <li className={isActive("/admin/lessons") ? "active" : ""}>
            <Link to="/admin/lessons">
              <i className="fas fa-chalkboard-teacher"></i> Lessons Management
            </Link>
          </li>
          <li className={isActive("/admin/enrollments") ? "active" : ""}>
            <Link to="/admin/enrollments">
              <i className="fas fa-clipboard-list"></i> Enrollments Management
            </Link>
          </li>
          <li className={isActive("/admin/submissions") ? "active" : ""}>
            <Link to="/admin/submissions">
              <i className="fas fa-folder-open"></i> Submissions Management
            </Link>
          </li>
          <li className={isActive("/admin/results") ? "active" : ""}>
            <Link to="/admin/results">
              <i className="fas fa-check-square"></i> Results Management
            </Link>
          </li>
          <li className={isActive("/admin/feedback") ? "active" : ""}>
            <Link to="/admin/feedback">
              <i className="fas fa-comments"></i> Feedback Management
            </Link>
          </li>
          <li className={isActive("/admin/payments") ? "active" : ""}>
            <Link to="/admin/payments">
              <i className="fas fa-credit-card"></i> Payments Management
            </Link>
          </li>
          <li className={isActive("/admin/reports") ? "active" : ""}>
            <Link to="/admin/reports">
              <i className="fas fa-chart-bar"></i> Reports Management
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main */}
      <div className="main">
        <div className="dashboard-content">
          {/* KPIs */}
          <section>
            <h2>Manage Overview</h2>
            <div className="card-grid">
              {[
                { label: "Total Users", value: kpiData ? fmt(kpiData.total_users) : "…" },
                { label: "Active Courses", value: kpiData ? fmt(kpiData.active_courses) : "…" },
                { label: "Assignments", value: kpiData ? fmt(kpiData.assignments) : "…" },
                { label: "Monthly Revenue", value: kpiData ? currency(kpiData.monthly_revenue) : "…" },
              ].map((item, i) => (
                <motion.div
                  className="card"
                  key={i}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.25)" }}
                >
                  <p>{item.label}</p>
                  <h2>{item.value}</h2>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Revenue + System health */}
          <section>
            <div className="panel-grid">
              <div className="panel">
                <div className="panel-head between">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <h3>Revenue</h3>
                    <span className="muted small">
                      {revGranularity === "day" ? "(by day)" : "(by month)"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="muted small">Range:</span>
                    <button
                      type="button"
                      className={`btn chip ${revRange === "7d" ? "primary" : "ghost"}`}
                      onClick={() => setRevRange("7d")}
                      disabled={revLoading}
                    >
                      7d
                    </button>
                    <button
                      type="button"
                      className={`btn chip ${revRange === "30d" ? "primary" : "ghost"}`}
                      onClick={() => setRevRange("30d")}
                      disabled={revLoading}
                    >
                      30d
                    </button>
                    <button
                      type="button"
                      className={`btn chip ${revRange === "12m" ? "primary" : "ghost"}`}
                      onClick={() => setRevRange("12m")}
                      disabled={revLoading}
                    >
                      12m
                    </button>
                    {revLoading && <span className="muted small">Loading…</span>}
                  </div>
                </div>

                <div className="panel-body">
                  <div className="muted">
                    Current MRR: <strong>{kpiData ? currency(kpiData.monthly_revenue) : "…"}</strong>
                  </div>
                  <RevenueBarsXLabels
                    points={revenueTrend}
                    labels={revLabels}
                    height={220}
                    maxLabels="full"
                    labelAngle={-45}
                    fontSize={10}
                  />
                </div>
              </div>
              <div className="panel">
                <div className="panel-head">
                  <h3>System Health</h3>
                </div>
                <div className="panel-body">
                  <div className="health-row">
                    <span>API</span> <StatusPill ok={sysHealth.api} />
                  </div>
                  <div className="health-row">
                    <span>Database</span> <StatusPill ok={sysHealth.db} />
                  </div>
                  <div className="health-row">
                    <span>Background Jobs</span> <StatusPill ok={sysHealth.jobs} />
                  </div>
                  <div className="hint">
                    Tip: set <b>QUEUE_CONNECTION=database</b> in production.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Payments + Top Courses */}
          <section>
            <div className="panel-grid two-two">
              <div className="panel">
                <div className="panel-head between">
                  <h3>Latest Payments</h3>
                  <div className="rev-controls" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {revLoading && (
                      <span className="muted small" style={{ marginLeft: 8 }}>
                        Loading…
                      </span>
                    )}
                  </div>
                  <span className="muted">Showing {latestPayments.length} items</span>
                </div>
                <div className="panel-body table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Payer</th>
                        <th>Course</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestPayments.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="muted">
                            No data
                          </td>
                        </tr>
                      ) : (
                        latestPayments.map((p) => (
                          <tr key={p.id}>
                            <td className="mono">{p.id}</td>
                            <td>{p.payer}</td>
                            <td>{p.course}</td>
                            <td>{currency(p.amount)}</td>
                            <td>
                              <span
                                className={`badge ${
                                  p.status === "Paid"
                                    ? "ok"
                                    : p.status === "Pending" || p.status === "Processing"
                                    ? "warn"
                                    : p.status === "Refunded"
                                    ? "info"
                                    : ""
                                }`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td>{p.date || "—"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="panel-foot right">
                  <Link to="/admin/payments" className="btn ghost">
                    View all payments
                  </Link>
                </div>
              </div>

              <div className="panel">
                <div className="panel-head between">
                  <h3>Top Courses</h3>
                  <Link to="/admin/courses" className="muted small">
                    Manage
                  </Link>
                </div>
                <div className="panel-body">
                  {topCourses.length === 0 ? (
                    <div className="muted">No data</div>
                  ) : (
                    <ul className="list">
                      {topCourses.map((c) => (
                        <li key={c.id} className="list-row">
                          <div>
                            <div className="strong">{c.title}</div>
                            <div className="muted small">ID: {c.id}</div>
                          </div>
                          <div className="mono">{fmt(c.students)} students</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Newest users + Top Instructors */}
          <section>
            <div className="panel-grid two-two">
              <div className="panel">
                <div className="panel-head between">
                  <h3>Newest Users</h3>
                  <Link to="/admin/users" className="muted small">
                    All accounts
                  </Link>
                </div>
                <div className="panel-body table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestUsers.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="muted">
                            No data
                          </td>
                        </tr>
                      ) : (
                        latestUsers.map((u) => (
                          <tr key={u.id}>
                            <td className="mono">{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.role}</td>
                            <td>
                              <span className={`badge ${u.status === "Active" ? "ok" : "danger"}`}>
                                {u.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Instructors */}
              <div className="panel">
                <div className="panel-head between">
                  <h3>Top Instructors</h3>
                </div>

                <div className="panel-body ti-grid">
                  {tiLoading ? (
                    <div className="muted">Loading…</div>
                  ) : topInst.length === 0 ? (
                    <div className="muted">No data</div>
                  ) : (
                    topInst.map((t, idx) => (
                      <div className="ti-card" key={t.id}>
                        <div className="ti-rank">#{idx + 1}</div>
                        <img className="ti-avatar" src={t.avatarUrl} alt={t.name} />
                        <div className="ti-info">
                          <div className="ti-name">{t.name}</div>
                          <div className="ti-sub">
                            <span className="chip">Instructor</span>
                            {t.totalCourses > 0 && (
                              <span className="muted small"> • {t.totalCourses} courses</span>
                            )}
                          </div>
                        </div>
                        <div className="ti-metric">
                          <div className="ti-num">
                            {new Intl.NumberFormat().format(t.totalStudents)}
                          </div>
                          <div className="ti-label">students</div>
                        </div>
                        <div className="ti-actions">
                          <button className="btn ghost" onClick={() => openProfileFor(t)}>
                            View profile →
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Announcements */}
          <section>
            <div className="panel">
              <div className="panel-head between">
                <h3>Announcements</h3>
                {annLoading ? <span className="muted small">Loading…</span> : null}
              </div>
              <div className="panel-body">
                {anns.length === 0 ? (
                  <div className="muted">No announcements</div>
                ) : (
                  <ul className="announce">
                    {anns.map((a) => (
                      <li key={a.id} className="announce-item">
                        <span className="icon">{a.icon || "📢"}</span>
                        <span className="text">
                          {a.url ? (
                            <a href={a.url} target="_blank" rel="noreferrer">
                              {a.text}
                            </a>
                          ) : (
                            a.text
                          )}
                        </span>
                        <span className="spacer" />
                        {a.created_at && (
                          <small className="muted">
                            {new Date(a.created_at).toLocaleString()}
                          </small>
                        )}
                        <button className="chip danger" onClick={() => dismissAnn(a.id)}>
                          Dismiss
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* Admin Tasks */}
          <section>
            <div className="panel">
              <div className="panel-head between">
                <h3>Admin Tasks</h3>
                {taskLoading ? <span className="muted small">Loading…</span> : null}
              </div>

              <div className="panel-body tasks">
                <form
                  className="task-add"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const v = e.target.elements.newtask.value;
                    addTask(v);
                    e.target.reset();
                  }}
                  style={{ display: "flex", gap: 12, marginBottom: 12 }}
                >
                  <input name="newtask" placeholder="Add a new task…" className="filter-input" />
                  <button className="btn">Add</button>
                </form>

                {tasks.length === 0 ? (
                  <div className="muted">No tasks</div>
                ) : (
                  <div className="task-list">
                    {tasks.map((t) => (
                      <label key={t.id} className={`task ${t.done ? "done" : ""}`}>
                        <input
                          type="checkbox"
                          checked={!!t.done}
                          onChange={() => toggleTask(t.id)}
                        />
                        <span>{t.title}</span>
                        <span className="spacer" />
                        <button
                          type="button"
                          className="chip danger"
                          onClick={() => removeTask(t.id)}
                        >
                          Remove
                        </button>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Modal: Profile */}
        {openProfileModal && (
          <div className="modal-overlay" onClick={() => setOpenProfileModal(false)}>
            <div className="modal-profile" onClick={(e) => e.stopPropagation()}>
              <div className="profile-header-modal">
                <img src={computedAvatarUrl} alt="avatar" className="profile-avatar" />
                <h2>{user?.AName}</h2>
                <p>{user?.ARole}</p>
              </div>
              <div className="profile-info">
                <div>
                  <strong>UserID</strong>
                  <span>{user?.AccountID}</span>
                </div>
                <div>
                  <strong>Email</strong>
                  <span>{user?.Email}</span>
                </div>
                <div>
                  <strong>Role</strong>
                  <span>{user?.ARole}</span>
                </div>
                <div>
                  <strong>Status</strong>
                  <span className={user?.AStatus === "Active" ? "active" : "inactive"}>
                    {user?.AStatus}
                  </span>
                </div>
                <div>
                  <strong>Date Created</strong>
                  <span>{displayCreatedAt}</span>
                </div>
              </div>
              <div className="profile-actions">
                <button className="btn-close" onClick={() => setOpenProfileModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Preview Any Profile */}
        {openPreviewModal && profilePreview && (
          <div className="modal-overlay" onClick={() => setOpenPreviewModal(false)}>
            <div className="modal-profile" onClick={(e) => e.stopPropagation()}>
              <div className="profile-header-modal">
                <img
                  src={profilePreview.AvatarUrl || "storage/avatars/avatar.jpg"}
                  alt="avatar"
                  className="profile-avatar"
                />
                <h2>{profilePreview.AName || profilePreview.name || profilePreview.id}</h2>
                <p>{profilePreview.ARole || profilePreview.role || "Instructor"}</p>
              </div>

              <div className="profile-info">
                <div>
                  <strong>UserID</strong>
                  <span>{profilePreview.AccountID || profilePreview.id}</span>
                </div>
                <div>
                  <strong>Email</strong>
                  <span>{profilePreview.Email || profilePreview.email || "—"}</span>
                </div>
                <div>
                  <strong>Role</strong>
                  <span>{profilePreview.ARole || profilePreview.role || "Instructor"}</span>
                </div>
                <div>
                  <strong>Status</strong>
                  <span
                    className={
                      (profilePreview.AStatus || profilePreview.status) === "Active"
                        ? "active"
                        : "inactive"
                    }
                  >
                    {profilePreview.AStatus || profilePreview.status || "—"}
                  </span>
                </div>
                <div>
                  <strong>Date Created</strong>
                  <span>{toDisplayDate(profilePreview.CreatedAt)}</span>
                </div>
              </div>

              <div className="profile-actions">
                <button className="btn-close" onClick={() => setOpenPreviewModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Settings */}
        {openSettingsModal && (
          <div className="modal-overlay" onClick={() => setOpenSettingsModal(false)}>
            <div className="modal-profile wide" onClick={(e) => e.stopPropagation()}>
              <div className="profile-header-modal">
                <h2>Account Settings</h2>
                <p>Manage your personal information and password</p>
              </div>

              <form
                className="settings-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const payload = {
                    AName: formData.get("AName"),
                    Email: formData.get("Email"),
                    new_password: formData.get("new_password"),
                    new_password_confirmation: formData.get("new_password_confirmation"),
                  };

                  if (!payload.new_password) {
                    delete payload.new_password;
                    delete payload.new_password_confirmation;
                  }

                  try {
                    let uploadedAvatarUrl = null;
                    if (avatarFile) {
                      try {
                        const fd = new FormData();
                        fd.append("avatar", avatarFile);
                        const avatarRes = await api.post(
                          `/accounts/${user?.AccountID}/avatar`,
                          fd,
                          { headers: { "Content-Type": "multipart/form-data" } }
                        );
                        uploadedAvatarUrl = avatarRes.data?.url || null;
                      } catch (uploadErr) {
                        console.error("Upload avatar failed:", uploadErr);
                        alert("Upload avatar failed!");
                      }
                    }

                    const body = {};
                    if (payload.AName && payload.AName !== user?.AName) body.AName = payload.AName;
                    if (payload.Email && payload.Email !== user?.Email) body.Email = payload.Email;
                    if (payload.new_password) {
                      body.new_password = payload.new_password;
                      body.new_password_confirmation = payload.new_password_confirmation;
                    }

                    let serverUser = null;
                    if (Object.keys(body).length > 0) {
                      const res = await api.put(`/accounts/${user?.AccountID}`, body);
                      alert(res.data?.message || "Profile updated successfully!");
                      serverUser = res.data?.user ?? res.data?.account ?? null;
                    } else {
                      if (uploadedAvatarUrl) alert("Avatar updated successfully!");
                      else alert("No changes.");
                    }

                    const updatedUser = serverUser ?? {
                      ...user,
                      ...(body.AName ? { AName: body.AName } : {}),
                      ...(body.Email ? { Email: body.Email } : {}),
                      ...(uploadedAvatarUrl ? { avatarUrl: uploadedAvatarUrl } : {}),
                      CreatedAt: user?.CreatedAt ?? user?.created_at ?? user?.createdAt ?? null,
                    };

                    setUser(updatedUser);
                    localStorage.setItem("user", JSON.stringify(updatedUser));

                    if (uploadedAvatarUrl) setAvatarTick((t) => t + 1);
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }
                    setAvatarFile(null);

                    setOpenSettingsModal(false);
                  } catch (err) {
                    console.error(err);
                    alert(err.response?.data?.message || "Update failed!");
                  }
                }}
              >
                {/* Avatar */}
                <div className="settings-avatar">
                  <img src={computedAvatarUrl} alt="avatar" />
                  <label className="upload-btn">
                    Change
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setAvatarFile(f);
                        const url = URL.createObjectURL(f);
                        if (previewUrl) URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(url);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>

                {/* Personal info */}
                <div className="form-section">
                  <h3>Personal Information</h3>
                  <div className="form-group2">
                    <label>Full Name</label>
                    <input type="text" name="AName" defaultValue={user?.AName} required />
                  </div>
                  <div className="form-group2">
                    <label>Email</label>
                    <input type="email" name="Email" defaultValue={user?.Email} required />
                  </div>
                </div>

                {/* Password change */}
                <div className="form-section">
                  <h3>Change Password</h3>
                  <div className="form-group2">
                    <label>New Password</label>
                    <input type="password" name="new_password" placeholder="Enter new password" />
                  </div>
                  <div className="form-group2">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      name="new_password_confirmation"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="profile-actions">
                  <button type="submit" className="btn-save">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                      }
                      setAvatarFile(null);
                      setOpenSettingsModal(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Activity Log */}
        {openActivityModal && (
          <div className="modal-overlay" onClick={() => setOpenActivityModal(false)}>
            <div className="modal-profile" onClick={(e) => e.stopPropagation()}>
              <div className="profile-header-modal">
                <h2>Activity Log</h2>
                <p>Nhật ký thao tác của bạn</p>
              </div>

              <div className="activity-toolbar">
                <select
                  value={logFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLogFilter(val);
                    fetchMyLogs(1, val);
                  }}
                >
                  <option value="">All actions</option>
                  <option value="login">Login</option>
                  <option value="logout">Logout</option>
                  <option value="avatar.update">Avatar Updated</option>
                  <option value="profile.update">Profile Updated</option>
                  <option value="password.reset">Password Reset</option>
                </select>

                <span className="activity-count">{logTotal} records</span>
              </div>

              <div className="log-list">
                {logLoading ? (
                  <div className="log-empty">Loading...</div>
                ) : logs.length === 0 ? (
                  <div className="log-empty">No activity</div>
                ) : (
                  <div className="log-grid">
                    {logs.map((item) => (
                      <div key={item.id} className="log-item">
                        <div className="log-row">
                          <span className={`log-badge ${String(item.action).replace(/\./g, "-")}`}>
                            {item.action}
                          </span>
                          <span className="log-time">
                            {new Date(item.created_at).toLocaleString()}
                          </span>
                        </div>

                        {item.meta && (
                          <pre className="log-meta">
                            {typeof item.meta === "string"
                              ? item.meta
                              : JSON.stringify(item.meta, null, 2)}
                          </pre>
                        )}

                        <div className="log-aux">
                          {item.ip && <span className="log-chip">IP: {item.ip}</span>}
                          {item.agent && (
                            <span className="log-chip log-agent" title={item.agent}>
                              Agent: {item.agent}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="activity-paging">
                <button
                  type="button"
                  className="btn-pager"
                  disabled={logPage <= 1 || logLoading}
                  onClick={() => fetchMyLogs(logPage - 1, logFilter)}
                >
                  ← Prev
                </button>
                <span className="page-indicator">
                  Page {logPage} / {Math.max(1, Math.ceil(logTotal / logPerPage))}
                </span>
                <button
                  type="button"
                  className="btn-pager"
                  disabled={logPage >= Math.max(1, Math.ceil(logTotal / logPerPage)) || logLoading}
                  onClick={() => fetchMyLogs(logPage + 1, logFilter)}
                >
                  Next →
                </button>
              </div>

              <div className="profile-actions">
                <button className="btn-close" onClick={() => setOpenActivityModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

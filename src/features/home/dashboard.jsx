import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useUser } from "../../context/UserContext";
import {
  getDashboardSummary,
  getTodaysBookings,
  getWalletAlerts,
  getRecentCompanies,
} from "../../api/dashboard_api";
import ErrorPopup from "../../components/error_popup";

const STATUS_STYLES = {
  Ongoing: "bg-amber-100 text-amber-800",
  ongoing: "bg-amber-100 text-amber-800",
  Upcoming: "bg-blue-50 text-blue-700",
  upcoming: "bg-blue-50 text-blue-700",
  Completed: "bg-emerald-50 text-emerald-700",
  completed: "bg-emerald-50 text-emerald-700",
  confirmed: "bg-blue-50 text-blue-700",
  Active: "bg-emerald-50 text-emerald-700",
  active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-slate-100 text-slate-500",
  inactive: "bg-slate-100 text-slate-500",
};

const STAT_ICONS = {
  locations: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  meetingRooms: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  ),
  companies: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" />
    </svg>
  ),
  activeUsers: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  bookingsToday: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  avgOccupancy: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
    </svg>
  ),
};

const formatToday = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const pick = (...values) => values.find((value) => value !== undefined && value !== null);

const formatCount = (value) => {
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
};

const formatPercent = (value) => {
  if (value === undefined || value === null || value === "") return "—";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return String(value);
  return `${Math.round(numeric)}%`;
};

const to12HourFormat = (timeStr) => {
  if (!timeStr) return "";

  let str = String(timeStr).trim();
  const dateTimeMatch = str.match(/^\d{4}-\d{2}-\d{2}\s+(.+)$/);
  if (dateTimeMatch) str = dateTimeMatch[1];

  const match = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return str;

  let hour = parseInt(match[1], 10);
  const minute = match[2];
  let ampm = match[4]?.toUpperCase();

  if (!ampm) {
    ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
  }

  return `${String(hour).padStart(2, "0")}:${minute} ${ampm}`;
};

const formatBookingTime = (booking) => {
  if (booking.time) return booking.time;

  const start = pick(booking.startTime, booking.start_time);
  const end = pick(booking.endTime, booking.end_time);
  if (!start || !end) return "—";

  return `${to12HourFormat(start)} - ${to12HourFormat(end)}`;
};

const capitalizeStatus = (status) => {
  if (!status) return "Upcoming";
  const value = String(status);
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const readStat = (stat) => {
  if (stat === undefined || stat === null) {
    return { value: undefined, badge: null };
  }
  if (typeof stat !== "object") {
    return { value: stat, badge: null };
  }
  return {
    value: pick(stat.value, stat.count, stat.percent, stat.total),
    badge: pick(stat.badge, stat.label, null),
  };
};

const STAT_CARD_CONFIG = [
  {
    key: "locations",
    label: "Locations",
    keys: ["locations"],
    badgeClass: "bg-emerald-50 text-emerald-700",
    format: formatCount,
  },
  {
    key: "meetingRooms",
    label: "Meeting Rooms",
    keys: ["meeting_rooms", "meetingRooms"],
    badgeClass: "bg-blue-50 text-blue-700",
    format: formatCount,
  },
  {
    key: "companies",
    label: "Companies",
    keys: ["companies"],
    badgeClass: "bg-violet-50 text-violet-700",
    format: formatCount,
  },
  {
    key: "activeUsers",
    label: "Active Users",
    keys: ["active_users", "activeUsers"],
    badgeClass: "bg-teal-50 text-teal-700",
    format: formatCount,
  },
  {
    key: "bookingsToday",
    label: "Bookings Today",
    keys: ["bookings_today", "bookingsToday"],
    badgeClass: "bg-orange-50 text-orange-700",
    format: formatCount,
  },
  {
    key: "avgOccupancy",
    label: "Avg. Occupancy",
    keys: ["avg_occupancy", "avgOccupancy"],
    badgeClass: "bg-slate-100 text-slate-700",
    format: formatPercent,
  },
];

const normalizeSummary = (payload = {}) => {
  const data = payload?.data ?? payload ?? {};
  const stats = data.stats ?? data.summary ?? {};

  const statCards = STAT_CARD_CONFIG.map((config) => {
    const raw = pick(...config.keys.map((key) => stats[key]));
    const { value, badge } = readStat(raw);

    return {
      key: config.key,
      label: config.label,
      value: config.format(value),
      badge,
      badgeClass: config.badgeClass,
      icon: STAT_ICONS[config.key],
    };
  });

  const occupancyList = pick(
    data.occupancy_by_location,
    data.occupancyByLocation,
    data.locationOccupancy,
    Array.isArray(data.occupancy) ? data.occupancy : null,
    []
  );

  const occupancy = (occupancyList || []).map((loc, index) => ({
    id: loc.id ?? loc.name ?? index,
    name: pick(loc.name, loc.locationName, loc.location?.name, "—"),
    percent: Number(pick(loc.percent, loc.occupancy, loc.occupancyPercent, 0)),
  }));

  return {
    stats: statCards,
    occupancy,
  };
};

const unwrapList = (payload = {}, listKeys = []) => {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;

  for (const key of listKeys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
};

const normalizeTodayBookings = (payload) =>
  unwrapList(payload, ["bookings", "todayBookings", "todaysBookings"]).map(
    (booking, index) => ({
      id: booking.id ?? index,
      room: pick(booking.room, booking.Room?.name, booking.roomName, "—"),
      company: pick(
        booking.company,
        booking.Company?.name,
        booking.User?.Company?.name,
        booking.companyName,
        "—"
      ),
      user: pick(booking.user, booking.User?.name, booking.userName, "—"),
      time: formatBookingTime(booking),
      status: capitalizeStatus(pick(booking.status, "Upcoming")),
    })
  );

const normalizeWalletAlerts = (payload) =>
  unwrapList(payload, [
    "alerts",
    "walletAlerts",
    "lowWalletBalances",
    "lowBalanceAlerts",
  ]).map((item, index) => ({
    id: item.user_id ?? item.id ?? item.name ?? index,
    name: pick(item.name, item.userName, item.User?.name, "—"),
    detail:
      pick(item.detail, item.description, item.message) ||
      [
        pick(item.company, item.Company?.name, item.companyName),
        item.meeting_room_credits !== undefined
          ? `Meeting Room: ${Number(item.meeting_room_credits).toFixed(2)}`
          : null,
        item.printing_credits !== undefined
          ? `Printing: ${Number(item.printing_credits).toFixed(2)}`
          : null,
      ]
        .filter(Boolean)
        .join(" · ") ||
      "Low balance",
  }));

const normalizeRecentCompanies = (payload) =>
  unwrapList(payload, ["companies", "recentCompanies", "latestCompanies"]).map(
    (company, index) => ({
      id: company.id ?? company.name ?? index,
      name: pick(company.name, "—"),
      location: pick(
        company.location,
        company.Location?.name,
        company.locationName,
        "—"
      ),
      status: capitalizeStatus(pick(company.status, "Active")),
    })
  );

const Dashboard = () => {
  const { user } = useUser();
  const firstName = user?.name?.split(" ")[0] || "there";
  const [summary, setSummary] = useState({
    stats: [],
    todayBookings: [],
    occupancy: [],
    lowBalance: [],
    recentCompanies: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const [summaryResult, bookingsResult, alertsResult, companiesResult] =
          await Promise.allSettled([
            getDashboardSummary(),
            getTodaysBookings(),
            getWalletAlerts(),
            getRecentCompanies(),
          ]);

        const nextSummary = {
          stats: [],
          occupancy: [],
          todayBookings: [],
          lowBalance: [],
          recentCompanies: [],
        };

        const errors = [];

        if (summaryResult.status === "fulfilled") {
          const summaryData = normalizeSummary(summaryResult.value);
          nextSummary.stats = summaryData.stats;
          nextSummary.occupancy = summaryData.occupancy;
        } else {
          errors.push(
            summaryResult.reason?.response?.data?.message ||
              summaryResult.reason?.message ||
              "Failed to load dashboard summary."
          );
        }

        if (bookingsResult.status === "fulfilled") {
          nextSummary.todayBookings = normalizeTodayBookings(
            bookingsResult.value
          );
        } else {
          errors.push(
            bookingsResult.reason?.response?.data?.message ||
              bookingsResult.reason?.message ||
              "Failed to load today's bookings."
          );
        }

        if (alertsResult.status === "fulfilled") {
          nextSummary.lowBalance = normalizeWalletAlerts(alertsResult.value);
        } else {
          errors.push(
            alertsResult.reason?.response?.data?.message ||
              alertsResult.reason?.message ||
              "Failed to load wallet alerts."
          );
        }

        if (companiesResult.status === "fulfilled") {
          nextSummary.recentCompanies = normalizeRecentCompanies(
            companiesResult.value
          );
        } else {
          errors.push(
            companiesResult.reason?.response?.data?.message ||
              companiesResult.reason?.message ||
              "Failed to load recent companies."
          );
        }

        setSummary(nextSummary);
        if (errors.length > 0) {
          setError(errors[0]);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="min-h-full space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back, {firstName} — here&apos;s what&apos;s happening across
            your locations today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{formatToday()}</span>
          <Link
            to="/home/bookings"
            className="inline-flex items-center rounded-lg bg-brand-cta px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
          >
            + New Booking
          </Link>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <div className="loader mb-2" />
            <p className="font-medium text-brand-dark">Loading please wait...</p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-6">
            {summary.stats.map((stat) => (
              <div
                key={stat.key}
                className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  {stat.icon}
                </div>
                <p className="text-2xl font-semibold text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">{stat.label}</p>
                {stat.badge && (
                  <span
                    className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${stat.badgeClass}`}
                  >
                    {stat.badge}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">
                  Today&apos;s Bookings
                </h2>
                <Link
                  to="/home/bookings"
                  className="text-sm font-medium text-brand-blue-light hover:text-brand-blue"
                >
                  View all →
                </Link>
              </div>
              <div className="overflow-x-auto">
                {summary.todayBookings.length > 0 ? (
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400">
                        <th className="pb-3 font-medium">Room</th>
                        <th className="pb-3 font-medium">Company</th>
                        <th className="pb-3 font-medium">User</th>
                        <th className="pb-3 font-medium">Time</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.todayBookings.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-slate-50 last:border-0"
                        >
                          <td className="py-3.5 font-medium text-slate-800">
                            {row.room}
                          </td>
                          <td className="py-3.5 text-slate-600">{row.company}</td>
                          <td className="py-3.5 text-slate-600">{row.user}</td>
                          <td className="py-3.5 text-slate-600">{row.time}</td>
                          <td className="py-3.5">
                            <span
                              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                STATUS_STYLES[row.status] ||
                                STATUS_STYLES[row.status?.toLowerCase()] ||
                                "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm italic text-slate-500">
                    No bookings scheduled for today.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-base font-semibold text-slate-900">
                  Occupancy by Location
                </h2>
                {summary.occupancy.length > 0 ? (
                  <ul className="space-y-4">
                    {summary.occupancy.map((loc) => (
                      <li key={loc.id}>
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">
                            {loc.name}
                          </span>
                          <span className="text-slate-500">{loc.percent}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-brand-blue-light"
                            style={{
                              width: `${Math.min(Math.max(loc.percent, 0), 100)}%`,
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm italic text-slate-500">
                    No occupancy data available.
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-base font-semibold text-slate-900">
                  Quick Actions
                </h2>
                <div className="space-y-2">
                  {[
                    { label: "+ Add Company", to: "/home/community" },
                    { label: "+ Add User", to: "/home/users" },
                    { label: "+ Add Meeting Room", to: "/home/meeting-rooms" },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      to={action.to}
                      className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50/50 px-3.5 py-2.5 text-sm font-medium text-brand-blue-light transition hover:bg-blue-50"
                    >
                      {action.label}
                      <span aria-hidden>›</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-slate-900">
                Low Wallet Balance Alerts
              </h2>
              {summary.lowBalance.length > 0 ? (
                <ul className="space-y-4">
                  {summary.lowBalance.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">{item.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-slate-500">
                  No low wallet alerts.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-slate-900">
                Recently Added Companies
              </h2>
              {summary.recentCompanies.length > 0 ? (
                <ul className="space-y-4">
                  {summary.recentCompanies.map((company) => (
                    <li
                      key={company.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {company.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {company.location}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          STATUS_STYLES[company.status] ||
                          STATUS_STYLES[company.status?.toLowerCase()] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {company.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-slate-500">
                  No recently added companies.
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default Dashboard;

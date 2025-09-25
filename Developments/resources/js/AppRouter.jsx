import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword"; // ✅ thêm
import AuthCallback from "./pages/AuthCallback";

// Admin wrapper
import ProtectedRoute from "./pages/ProtectedRoute";

// Admin main pages
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import CourseManagement from "./pages/CourseManagement";
import NewCourse from "./pages/NewCourse";
import LessonManagement from "./pages/LessonManagement";
import ReportManagement from "./pages/ReportManagement";
import FeedbackManagement from "./pages/FeedbackManagement";
import FeedbackDetail from "./pages/FeedbackDetail";
import PaymentManagement from "./pages/PaymentManagement";
import EditPayment from "./pages/EditPayment";
import SubmissionManagement from "./pages/SubmissionManagement";
import EditSubmission from "./pages/EditSubmission";
import ResultManagement from "./pages/ResultManagement";
import EditResult from "./pages/EditResult";

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />{" "}
                {/* ✅ thêm */}
                <Route path="/auth/callback" element={<AuthCallback />} />
                {/* Admin routes (protected) */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute>
                            <UserManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/courses"
                    element={
                        <ProtectedRoute>
                            <CourseManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/courses/new"
                    element={
                        <ProtectedRoute>
                            <NewCourse />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/lessons"
                    element={
                        <ProtectedRoute>
                            <LessonManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/reports"
                    element={
                        <ProtectedRoute>
                            <ReportManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/feedback"
                    element={
                        <ProtectedRoute>
                            <FeedbackManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/feedback/:id"
                    element={
                        <ProtectedRoute>
                            <FeedbackDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/payments"
                    element={
                        <ProtectedRoute>
                            <PaymentManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/payments/edit/:id"
                    element={
                        <ProtectedRoute>
                            <EditPayment />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/submissions"
                    element={
                        <ProtectedRoute>
                            <SubmissionManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/submissions/edit/:id"
                    element={
                        <ProtectedRoute>
                            <EditSubmission />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/results"
                    element={
                        <ProtectedRoute>
                            <ResultManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/results/edit/:id"
                    element={
                        <ProtectedRoute>
                            <EditResult />
                        </ProtectedRoute>
                    }
                />
                {/* Catch all → Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

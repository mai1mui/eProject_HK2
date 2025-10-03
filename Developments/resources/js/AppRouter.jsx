import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import AboutIndex from "./pages/AboutIndex";
import BlogIndex from "./pages/BlogIndex";
import ContactIndex from "./pages/ContactIndex";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AuthCallback from "./pages/AuthCallback";

// NEW: Public courses
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";

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

// Submissions
import SubmissionsManagement from "./pages/SubmissionsManagement";
import EditSubmission from "./pages/EditSubmission";

// Results
import ResultsManagement from "./pages/ResultsManagement";
import EditResult from "./pages/EditResult";

// Enrollments
import EnrollmentManagement from "./pages/EnrollmentManagement";

// NEW (auth provider & guard you added earlier)
import { AuthProvider } from "./contexts/AuthContext";
import RequireAuth from "./components/RequireAuth";

// NEW (learner/checkout pages - nếu chưa tạo có thể comment 3 dòng import dưới)
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Invoice from "./pages/Invoice";
import MyLearning from "./pages/MyLearning";
import LessonPlayer from "./pages/LessonPlayer";

// Instructor main pages
import InstructorDashboard from "./pages/InstructorDashboard";
import ReportInstructor from "./pages/ReportInstructor";
import PaymentInstructor from "./pages/PaymentInstructor";

// Learner main pages
import LearnerDashboard from "./pages/LearnerDashboard";
import ProfileLearner from "./pages/ProfileLearner";
import CourseIndexLearner from "./pages/CourseIndexLearner";
import LessonLearner from "./pages/LessonLearner";
import ReportLearner from "./pages/ReportLearner";
import FeedbackLearner from "./pages/FeedbackLearner";
import PaymentLearner from "./pages/PaymentLearner";
import SubmissionsLearner from "./pages/SubmissionsLearner";
import ResultsLearner from "./pages/ResultsLearner";
import EnrollmentLearner from "./pages/EnrollmentLearner";

export default function AppRouter() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/about" element={<AboutIndex />} />
                    <Route path="/blog" element={<BlogIndex />} />
                    <Route path="/contact" element={<ContactIndex />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:id" element={<CourseDetail />} />

                    {/* Learner routes (must login) */}

                    <Route
                        path="/learner"
                        element={
                            <ProtectedRoute>
                                <LearnerDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/learner/profile"
                        element={
                            <ProtectedRoute>
                                <ProfileLearner />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/learner/courses"
                        element={
                            <ProtectedRoute>
                                <CourseIndexLearner />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/learner/lessons"
                        element={
                            <ProtectedRoute>
                                <LessonLearner />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/learner/reports"
                        element={
                            <ProtectedRoute>
                                <ReportLearner />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/learner/feedback"
                        element={
                            <ProtectedRoute>
                                <FeedbackLearner />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/learner/payments"
                        element={
                            <ProtectedRoute>
                                <PaymentLearner />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/learner/submissions"
                        element={
                            <ProtectedRoute>
                                <SubmissionsLearner />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/learner/results"
                        element={
                            <ProtectedRoute>
                                <ResultsLearner />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/learner/enrollments"
                        element={
                            <ProtectedRoute>
                                <EnrollmentLearner />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/checkout"
                        element={
                            <RequireAuth>
                                <Checkout />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/checkout/success"
                        element={
                            <RequireAuth>
                                <OrderSuccess />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/invoice/:paymentId"
                        element={
                            <RequireAuth>
                                <Invoice />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/my-learning"
                        element={
                            <RequireAuth>
                                <MyLearning />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/courses/:id/lesson/:lessonId"
                        element={
                            <RequireAuth>
                                <LessonPlayer />
                            </RequireAuth>
                        }
                    />

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
                                <SubmissionsManagement />
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
                                <ResultsManagement />
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
                    <Route
                        path="/admin/enrollments"
                        element={
                            <ProtectedRoute>
                                <EnrollmentManagement />
                            </ProtectedRoute>
                        }
                    />

                    {/* Instructor routes (protected) */}
                    <Route
                        path="/instructor"
                        element={
                            <ProtectedRoute>
                                <InstructorDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/instructor/users"
                        element={
                            <ProtectedRoute>
                                <UserManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/instructor/courses"
                        element={
                            <ProtectedRoute>
                                <CourseManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/instructor/courses/new"
                        element={
                            <ProtectedRoute>
                                <NewCourse />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/instructor/lessons"
                        element={
                            <ProtectedRoute>
                                <LessonManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/instructor/reports"
                        element={
                            <ProtectedRoute>
                                <ReportInstructor />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/instructor/payments"
                        element={
                            <ProtectedRoute>
                                <PaymentInstructor />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/instructor/submissions"
                        element={
                            <ProtectedRoute>
                                <SubmissionsManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/instructor/submissions/edit/:id"
                        element={
                            <ProtectedRoute>
                                <EditSubmission />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/instructor/results"
                        element={
                            <ProtectedRoute>
                                <ResultsManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/instructor/results/edit/:id"
                        element={
                            <ProtectedRoute>
                                <EditResult />
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch all → Home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div>
            <nav className="nav" aria-label="Main">
                <a className="brand" href="#">
                    <span className="logo"></span>
                    <span>ELearning Management System</span>
                </a>
                <div className="spacer"></div>
                <Link className="btn-link" to="/courses">
                    View Public Courses
                </Link>
                <button className="toggle">Theme</button>
            </nav>

            <main className="hero">
                <section>
                    <span className="pill">Fast • Secure • Accessible</span>
                    <h1>E-Learning Management System</h1>
                    <p className="sub">
                        Learn, teach, and manage courses in one modern platform.
                    </p>
                    <div className="actions">
                        <Link className="btn btn-primary" to="/login">
                            Login
                        </Link>
                        <Link className="btn btn-primary" to="/register">
                            Register
                        </Link>
                        <Link className="btn btn-primary" to="/courses">
                            View Public Courses
                        </Link>
                    </div>
                </section>
                <aside className="preview">
                    <div className="grid">
                        <div className="tile">
                            <small>Admin</small>
                            <b>User & Course Management</b>
                        </div>
                        <div className="tile">
                            <small>Teacher</small>
                            <b>Create Lessons & Grade</b>
                        </div>
                        <div className="tile">
                            <small>Student</small>
                            <b>Enroll & Track Progress</b>
                        </div>
                        <div className="tile">
                            <small>Security</small>
                            <b>2-step checks & roles</b>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}

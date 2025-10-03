import React from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "../../css/HomeNav.module.css";

export default function HomeNav({ onToggleTheme }) {
  return (
    <header className={styles.nav}>
      <div className={`${styles.container} ${styles.navInner}`}>
        <a href="#" className={styles.brand}>
          <span className={styles.logo} aria-hidden="true" />
          <span>E-Learning Management System</span>
        </a>
        <div className={styles.spacer} />
        <ul className={styles.navLinks}>
          <li><NavLink to="/" end className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>Home</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>About</NavLink></li>
          <li><NavLink to="/courses" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>Courses</NavLink></li>
          <li><NavLink to="/blog" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>Blog</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>Contact</NavLink></li>
        </ul>
        <button
          className={`${styles.btn} ${styles.ghost}`}
          onClick={onToggleTheme}
        >
          Theme
        </button>
      </div>
    </header>
  );
}

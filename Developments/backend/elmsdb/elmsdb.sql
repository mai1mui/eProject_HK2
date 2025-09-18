-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 08, 2025 at 12:16 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `elmsdb`
--
CREATE DATABASE IF NOT EXISTS `elmsdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `elmsdb`;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
CREATE TABLE IF NOT EXISTS `accounts` (
  `AccountID` varchar(10) NOT NULL,
  `AName` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Pass` varchar(255) NOT NULL,
  `ARole` enum('Admin','Instructor','Learner') NOT NULL,
  `AStatus` enum('Active','Inactive') NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`AccountID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Truncate table before insert `accounts`
--

TRUNCATE TABLE `accounts`;
--
-- Dumping data for table `accounts`
--

INSERT DELAYED IGNORE INTO `accounts` (`AccountID`, `AName`, `Email`, `Pass`, `ARole`, `AStatus`, `CreatedAt`) VALUES
('ADM001', 'Le Thi Hanh Mai', 'hanhmai120997@gmail.com', '123456', 'Admin', 'Active', '2025-09-08 18:47:08'),
('ADM002', 'Duong Minh Man', 'Duongminhman65@gmail.com', '123456', 'Admin', 'Active', '2025-09-08 18:47:08'),
('ADM003', 'Ly Thanh Nghi', 'nghily@example.com', '123456', 'Admin', 'Inactive', '2025-09-08 18:55:10'),
('ADM004', 'Cong Hien Khoa', 'hienkhoalk@gmail.com', '123456', 'Admin', 'Active', '2025-09-08 18:51:18'),
('ADM010', 'Nguyen Van Cuong', 'cuongnguyen@gmail.com', '123456', 'Admin', 'Inactive', '2025-09-08 18:47:08'),
('INS002', 'Tran Phi Hung', 'hungphitran@gmail.com', '123456', 'Instructor', 'Inactive', '2025-09-08 18:55:10'),
('INS003', 'Tran Van Hung', 'hungtran@gmail.com', '123456', 'Instructor', 'Active', '2025-09-08 18:47:08'),
('INS006', 'Nguyen Van An', 'an.nguyen@gmail.com', '123456', 'Instructor', 'Active', '2025-09-08 18:47:08'),
('INS008', 'Hoang Van Binh', 'binhhoang@gmail.com', '123456', 'Instructor', 'Active', '2025-09-08 18:47:08'),
('INS011', 'Nguyen Van Tai', 'tai.nguyen@gmail.com', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26'),
('INS012', 'Le Thi Huong', 'huongle@gmail.com', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26'),
('INS013', 'Pham Van Khoa', 'khoapv@gmail.com', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26'),
('INS014', 'Tran Thi Lan', 'lantran@gmail.com', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26'),
('INS015', 'Hoang Van Duc', 'duc.hoang@gmail.com', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26'),
('INS016', 'Nguyen Thi Mai', 'mainguyen@gmail.com', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26'),
('INS017', 'Le Van Binh', 'binhlevan@gmail.com', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26'),
('INS018', 'Pham Thi Thao', 'thaopham@gmail.com', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26'),
('INS019', 'Nguyen Van Hung', 'hungnguyen@gmail.com', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26'),
('INS020', 'Tran Van Nam', 'namtran@gmail.com', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26'),
('LRN002', 'Ngo Ho Ngoc Huyen', 'huyenngo@gmail.com', '123456', 'Learner', 'Inactive', '2025-09-08 18:55:10'),
('LRN004', 'Ngo Bich Huyen', 'huyenbaby@gmail.com', '123456', 'Learner', 'Active', '2025-09-08 18:47:08'),
('LRN005', 'Le Thi Mai', 'lemai@gmail.com', '123456', 'Learner', 'Active', '2025-09-08 18:47:08'),
('LRN007', 'Pham Thi Lan', 'lanpham@gmail.com', '123456', 'Learner', 'Inactive', '2025-09-08 18:47:08'),
('LRN009', 'Tran Thi Hoa', 'hoatran@gmail.com', '123456', 'Learner', 'Active', '2025-09-08 18:47:08'),
('LRN021', 'Le Thi Thanh', 'thanhle@gmail.com', '123456', 'Learner', 'Active', '2025-09-08 18:59:26'),
('LRN022', 'Pham Van An', 'anpham@gmail.com', '123456', 'Learner', 'Active', '2025-09-08 18:59:26'),
('LRN023', 'Nguyen Thi Hoa', 'hoanguyen@gmail.com', '123456', 'Learner', 'Active', '2025-09-08 18:59:26'),
('LRN024', 'Tran Van Long', 'longtran@gmail.com', '123456', 'Learner', 'Active', '2025-09-08 18:59:26'),
('LRN025', 'Hoang Thi Mai', 'maith.hoang@gmail.com', '123456', 'Learner', 'Active', '2025-09-08 18:59:26'),
('LRN026', 'Nguyen Van Tuan', 'tuannguyen@gmail.com', '123456', 'Learner', 'Active', '2025-09-08 18:59:26'),
('LRN027', 'Le Thi Lan', 'lanle@gmail.com', '123456', 'Learner', 'Active', '2025-09-08 18:59:26'),
('LRN028', 'Pham Van Cuong', 'cuongpham@gmail.com', '123456', 'Learner', 'Active', '2025-09-08 18:59:26'),
('LRN029', 'Nguyen Thi Thu', 'thunguyen@gmail.com', '123456', 'Learner', 'Active', '2025-09-08 18:59:26'),
('LRN030', 'Tran Van Hieu', 'hieutran@gmail.com', '123456', 'Learner', 'Active', '2025-09-08 18:59:26');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
CREATE TABLE IF NOT EXISTS `courses` (
  `CourseID` varchar(10) NOT NULL,
  `CName` varchar(200) NOT NULL,
  `CDescription` text,
  `StartDate` date DEFAULT NULL,
  `CreatorID` varchar(10) NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `CStatus` enum('Active','Inactive') DEFAULT NULL,
  PRIMARY KEY (`CourseID`),
  KEY `FK_Course_Creator` (`CreatorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Truncate table before insert `courses`
--

TRUNCATE TABLE `courses`;
--
-- Dumping data for table `courses`
--

INSERT DELAYED IGNORE INTO `courses` (`CourseID`, `CName`, `CDescription`, `StartDate`, `CreatorID`, `CreatedAt`, `CStatus`) VALUES
('CCPL001', 'C Programming Language', 'Learn C Programming Language', '2025-10-12', 'INS003', '2025-09-08 18:47:27', 'Active'),
('HTML404', 'HTML & CSS', 'Frontend basics', '2025-09-05', 'INS006', '2025-09-08 18:47:27', 'Active'),
('JAV101', 'Java Basics', 'Learn Java programming', '2025-10-05', 'INS003', '2025-09-08 18:47:27', 'Active'),
('NODE808', 'NodeJS Backend', 'NodeJS backend programming', '2025-10-01', 'INS003', '2025-09-08 18:47:27', 'Active'),
('PHP606', 'PHP Programming', 'PHP for Web Development', '2025-09-20', 'INS006', '2025-09-08 18:47:27', 'Active'),
('PYT202', 'Python Basics', 'Learn Python from scratch', '2025-09-10', 'INS006', '2025-09-08 18:47:27', 'Active'),
('REACT707', 'ReactJS Framework', 'ReactJS frontend course', '2025-09-25', 'INS008', '2025-09-08 18:47:27', 'Active'),
('SQL505', 'SQL Server Advanced', 'Advanced SQL queries', '2025-09-15', 'INS008', '2025-09-08 18:47:27', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE IF NOT EXISTS `enrollments` (
  `EnrollmentID` varchar(10) NOT NULL,
  `AccountID` varchar(10) NOT NULL,
  `CourseID` varchar(10) NOT NULL,
  `EnrollDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `EStatus` enum('Paid','Processing','Not Confirmed') NOT NULL,
  PRIMARY KEY (`EnrollmentID`),
  KEY `FK_Enroll_Account` (`AccountID`),
  KEY `FK_Enroll_Course` (`CourseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Truncate table before insert `enrollments`
--

TRUNCATE TABLE `enrollments`;
--
-- Dumping data for table `enrollments`
--

INSERT DELAYED IGNORE INTO `enrollments` (`EnrollmentID`, `AccountID`, `CourseID`, `EnrollDate`, `EStatus`) VALUES
('E005', 'LRN021', 'CCPL001', '2025-09-10 09:00:00', 'Paid'),
('E006', 'LRN022', 'PHP606', '2025-09-10 09:10:00', 'Processing'),
('E007', 'LRN023', 'REACT707', '2025-09-10 09:20:00', 'Paid'),
('E008', 'LRN024', 'HTML404', '2025-09-10 09:30:00', 'Paid'),
('E009', 'LRN025', 'PYT202', '2025-09-10 09:40:00', 'Paid'),
('E010', 'LRN026', 'SQL505', '2025-09-10 09:50:00', 'Processing'),
('E011', 'LRN027', 'NODE808', '2025-09-10 10:00:00', 'Paid'),
('E012', 'LRN028', 'JAV101', '2025-09-10 10:10:00', 'Paid'),
('E013', 'LRN029', 'CCPL001', '2025-09-10 10:20:00', 'Paid'),
('E014', 'LRN030', 'PHP606', '2025-09-10 10:30:00', 'Processing');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
CREATE TABLE IF NOT EXISTS `feedback` (
  `FeedbackID` varchar(10) NOT NULL,
  `AccountID` varchar(10) NOT NULL,
  `Content` text,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `FStatus` enum('Processed','Waiting') NOT NULL,
  PRIMARY KEY (`FeedbackID`),
  KEY `FK_Feedback_Account` (`AccountID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Truncate table before insert `feedback`
--

TRUNCATE TABLE `feedback`;
--
-- Dumping data for table `feedback`
--

INSERT DELAYED IGNORE INTO `feedback` (`FeedbackID`, `AccountID`, `Content`, `CreatedAt`, `FStatus`) VALUES
('F001', 'LRN004', 'The course was very clear and helpful.', '2025-09-08 18:48:10', 'Processed'),
('F002', 'LRN005', 'I enjoyed learning the basics.', '2025-09-08 18:48:10', 'Waiting'),
('F003', 'LRN007', 'Great examples in the course!', '2025-09-08 18:48:10', 'Processed'),
('F004', 'LRN009', 'Instructor explains very well.', '2025-09-08 18:48:10', 'Waiting'),
('F005', 'LRN021', 'Great course, learned a lot!', '2025-09-08 19:00:36', 'Processed'),
('F006', 'LRN022', 'The instructor explains clearly.', '2025-09-08 19:00:36', 'Waiting'),
('F007', 'LRN023', 'ReactJS examples are very helpful.', '2025-09-08 19:00:36', 'Processed'),
('F008', 'LRN024', 'HTML & CSS lessons are easy to follow.', '2025-09-08 19:00:36', 'Waiting'),
('F009', 'LRN025', 'Python basics were well presented.', '2025-09-08 19:00:36', 'Processed'),
('F010', 'LRN026', 'Advanced SQL concepts explained clearly.', '2025-09-08 19:00:36', 'Waiting'),
('F011', 'LRN027', 'NodeJS backend course is excellent.', '2025-09-08 19:00:36', 'Processed'),
('F012', 'LRN028', 'Java basics course is useful.', '2025-09-08 19:00:36', 'Waiting'),
('F013', 'LRN029', 'C programming lessons are good.', '2025-09-08 19:00:36', 'Processed'),
('F014', 'LRN030', 'PHP programming is very practical.', '2025-09-08 19:00:36', 'Waiting');

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
CREATE TABLE IF NOT EXISTS `lessons` (
  `LessonID` varchar(10) NOT NULL,
  `CourseID` varchar(10) NOT NULL,
  `LName` varchar(200) NOT NULL,
  `Content` text,
  `LessonType` enum('Video','Quiz','Assignment') NOT NULL,
  `Ordinal` int DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `LStatus` enum('Paid','Processing','Not Confirmed') NOT NULL,
  PRIMARY KEY (`LessonID`),
  KEY `FK_Lesson_Course` (`CourseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Truncate table before insert `lessons`
--

TRUNCATE TABLE `lessons`;
--
-- Dumping data for table `lessons`
--

INSERT DELAYED IGNORE INTO `lessons` (`LessonID`, `CourseID`, `LName`, `Content`, `LessonType`, `Ordinal`, `CreatedAt`, `LStatus`) VALUES
('L001', 'CCPL001', 'Introduction to C', 'link:intro01.pdf', 'Video', 1, '2025-09-08 18:47:44', 'Paid'),
('L002', 'CCPL001', 'Variables & Data Types', 'link:variables.pdf', 'Video', 2, '2025-09-08 18:47:44', 'Paid'),
('L003', 'CCPL001', 'Operators in C', 'link:operators.pdf', 'Video', 3, '2025-09-08 18:47:44', 'Paid'),
('L004', 'CCPL001', 'Control Structures', 'link:control.pdf', 'Video', 4, '2025-09-08 18:47:44', 'Paid'),
('L005', 'CCPL001', 'Functions in C', 'link:functions.pdf', 'Video', 5, '2025-09-08 18:47:44', 'Processing'),
('L006', 'CCPL001', 'C Quiz 1', 'link:quiz01.pdf', 'Quiz', 6, '2025-09-08 18:47:44', 'Processing'),
('L007', 'CCPL001', 'Pointers & Arrays', 'link:pointers.pdf', 'Video', 7, '2025-09-08 18:47:44', 'Paid'),
('L008', 'CCPL001', 'Structures in C', 'link:structures.pdf', 'Video', 8, '2025-09-08 18:47:44', 'Paid'),
('L009', 'CCPL001', 'C Assignment 1', 'link:assignment01.pdf', 'Assignment', 9, '2025-09-08 18:47:44', 'Not Confirmed'),
('L010', 'CCPL001', 'Summary & Conclusion', 'link:summary.pdf', 'Video', 10, '2025-09-08 18:47:44', 'Paid'),
('L011', 'PHP606', 'Introduction to PHP', 'link:php_intro.pdf', 'Video', 1, '2025-09-08 18:56:34', 'Paid'),
('L012', 'PHP606', 'Variables and Data Types in PHP', 'link:php_variables.pdf', 'Video', 2, '2025-09-08 18:56:34', 'Paid'),
('L013', 'PHP606', 'PHP Operators', 'link:php_operators.pdf', 'Video', 3, '2025-09-08 18:56:34', 'Paid'),
('L014', 'PHP606', 'Control Structures in PHP', 'link:php_control.pdf', 'Video', 4, '2025-09-08 18:56:34', 'Paid'),
('L015', 'PHP606', 'Functions in PHP', 'link:php_functions.pdf', 'Video', 5, '2025-09-08 18:56:34', 'Processing'),
('L016', 'PHP606', 'PHP Quiz 1', 'link:php_quiz01.pdf', 'Quiz', 6, '2025-09-08 18:56:34', 'Processing'),
('L017', 'PHP606', 'Arrays and Loops', 'link:php_arrays_loops.pdf', 'Video', 7, '2025-09-08 18:56:34', 'Paid'),
('L018', 'PHP606', 'Form Handling', 'link:php_forms.pdf', 'Video', 8, '2025-09-08 18:56:34', 'Paid'),
('L019', 'PHP606', 'PHP Assignment 1', 'link:php_assignment01.pdf', 'Assignment', 9, '2025-09-08 18:56:34', 'Not Confirmed'),
('L020', 'PHP606', 'Summary and Best Practices', 'link:php_summary.pdf', 'Video', 10, '2025-09-08 18:56:34', 'Paid'),
('L021', 'REACT707', 'Introduction to ReactJS', 'link:react_intro.pdf', 'Video', 1, '2025-09-08 18:57:20', 'Paid'),
('L022', 'REACT707', 'JSX and Rendering Elements', 'link:react_jsx.pdf', 'Video', 2, '2025-09-08 18:57:20', 'Paid'),
('L023', 'REACT707', 'Components and Props', 'link:react_components.pdf', 'Video', 3, '2025-09-08 18:57:20', 'Paid'),
('L024', 'REACT707', 'State and Lifecycle', 'link:react_state_lifecycle.pdf', 'Video', 4, '2025-09-08 18:57:20', 'Paid'),
('L025', 'REACT707', 'Handling Events in React', 'link:react_events.pdf', 'Video', 5, '2025-09-08 18:57:20', 'Processing'),
('L026', 'REACT707', 'React Quiz 1', 'link:react_quiz01.pdf', 'Quiz', 6, '2025-09-08 18:57:20', 'Processing'),
('L027', 'REACT707', 'Conditional Rendering', 'link:react_conditional.pdf', 'Video', 7, '2025-09-08 18:57:20', 'Paid'),
('L028', 'REACT707', 'Lists and Keys', 'link:react_lists_keys.pdf', 'Video', 8, '2025-09-08 18:57:20', 'Paid'),
('L029', 'REACT707', 'React Assignment 1', 'link:react_assignment01.pdf', 'Assignment', 9, '2025-09-08 18:57:20', 'Not Confirmed'),
('L030', 'REACT707', 'Summary and Best Practices', 'link:react_summary.pdf', 'Video', 10, '2025-09-08 18:57:20', 'Paid'),
('L031', 'HTML404', 'Introduction to HTML', 'link:html_intro.pdf', 'Video', 1, '2025-09-08 18:57:51', 'Paid'),
('L032', 'HTML404', 'HTML Elements and Tags', 'link:html_elements.pdf', 'Video', 2, '2025-09-08 18:57:51', 'Paid'),
('L033', 'HTML404', 'Attributes and Links', 'link:html_attributes_links.pdf', 'Video', 3, '2025-09-08 18:57:51', 'Paid'),
('L034', 'HTML404', 'Images and Media', 'link:html_images_media.pdf', 'Video', 4, '2025-09-08 18:57:51', 'Paid'),
('L035', 'HTML404', 'Forms and Input', 'link:html_forms.pdf', 'Video', 5, '2025-09-08 18:57:51', 'Processing'),
('L036', 'HTML404', 'HTML & CSS Quiz 1', 'link:html_quiz01.pdf', 'Quiz', 6, '2025-09-08 18:57:51', 'Processing'),
('L037', 'HTML404', 'CSS Basics', 'link:css_basics.pdf', 'Video', 7, '2025-09-08 18:57:51', 'Paid'),
('L038', 'HTML404', 'Selectors and Properties', 'link:css_selectors_properties.pdf', 'Video', 8, '2025-09-08 18:57:51', 'Paid'),
('L039', 'HTML404', 'HTML & CSS Assignment 1', 'link:html_css_assignment01.pdf', 'Assignment', 9, '2025-09-08 18:57:51', 'Not Confirmed'),
('L040', 'HTML404', 'Summary and Best Practices', 'link:html_css_summary.pdf', 'Video', 10, '2025-09-08 18:57:51', 'Paid'),
('L041', 'SQL505', 'Introduction to SQL Server', 'link:sql_intro.pdf', 'Video', 1, '2025-09-08 19:04:05', 'Paid'),
('L042', 'SQL505', 'Advanced SELECT Queries', 'link:sql_select.pdf', 'Video', 2, '2025-09-08 19:04:05', 'Paid'),
('L043', 'SQL505', 'JOINs and Relationships', 'link:sql_joins.pdf', 'Video', 3, '2025-09-08 19:04:05', 'Paid'),
('L044', 'SQL505', 'Subqueries and Nested Queries', 'link:sql_subqueries.pdf', 'Video', 4, '2025-09-08 19:04:05', 'Paid'),
('L045', 'SQL505', 'Stored Procedures', 'link:sql_stored_procedures.pdf', 'Video', 5, '2025-09-08 19:04:05', 'Processing'),
('L046', 'SQL505', 'SQL Quiz 1', 'link:sql_quiz01.pdf', 'Quiz', 6, '2025-09-08 19:04:05', 'Processing'),
('L047', 'SQL505', 'Triggers and Views', 'link:sql_triggers_views.pdf', 'Video', 7, '2025-09-08 19:04:05', 'Paid'),
('L048', 'SQL505', 'Indexes and Performance', 'link:sql_indexes.pdf', 'Video', 8, '2025-09-08 19:04:05', 'Paid'),
('L049', 'SQL505', 'SQL Assignment 1', 'link:sql_assignment01.pdf', 'Assignment', 9, '2025-09-08 19:04:05', 'Not Confirmed'),
('L050', 'SQL505', 'Summary and Best Practices', 'link:sql_summary.pdf', 'Video', 10, '2025-09-08 19:04:05', 'Paid'),
('L051', 'JAV101', 'Introduction to Java', 'link:java_intro.pdf', 'Video', 1, '2025-09-08 19:04:32', 'Paid'),
('L052', 'JAV101', 'Java Data Types and Variables', 'link:java_variables.pdf', 'Video', 2, '2025-09-08 19:04:32', 'Paid'),
('L053', 'JAV101', 'Operators in Java', 'link:java_operators.pdf', 'Video', 3, '2025-09-08 19:04:32', 'Paid'),
('L054', 'JAV101', 'Control Flow Statements', 'link:java_control.pdf', 'Video', 4, '2025-09-08 19:04:32', 'Paid'),
('L055', 'JAV101', 'Methods and Functions', 'link:java_methods.pdf', 'Video', 5, '2025-09-08 19:04:32', 'Processing'),
('L056', 'JAV101', 'Java Quiz 1', 'link:java_quiz01.pdf', 'Quiz', 6, '2025-09-08 19:04:32', 'Processing'),
('L057', 'JAV101', 'Arrays and Loops', 'link:java_arrays_loops.pdf', 'Video', 7, '2025-09-08 19:04:32', 'Paid'),
('L058', 'JAV101', 'Object-Oriented Programming Basics', 'link:java_oop.pdf', 'Video', 8, '2025-09-08 19:04:32', 'Paid'),
('L059', 'JAV101', 'Java Assignment 1', 'link:java_assignment01.pdf', 'Assignment', 9, '2025-09-08 19:04:32', 'Not Confirmed'),
('L060', 'JAV101', 'Summary and Best Practices', 'link:java_summary.pdf', 'Video', 10, '2025-09-08 19:04:32', 'Paid');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
CREATE TABLE IF NOT EXISTS `payment` (
  `PaymentID` varchar(10) NOT NULL,
  `AccountID` varchar(10) NOT NULL,
  `CourseID` varchar(10) NOT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `PayDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `PStatus` enum('Paid','Processing','Not Confirmed') NOT NULL,
  `TransactionRef` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`PaymentID`),
  KEY `FK_Payment_Account` (`AccountID`),
  KEY `FK_Payment_Course` (`CourseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Truncate table before insert `payment`
--

TRUNCATE TABLE `payment`;
--
-- Dumping data for table `payment`
--

INSERT DELAYED IGNORE INTO `payment` (`PaymentID`, `AccountID`, `CourseID`, `Amount`, `PayDate`, `PStatus`, `TransactionRef`) VALUES
('P001', 'LRN004', 'CCPL001', '1000.00', '2025-09-08 18:48:19', 'Paid', 'TXN12345'),
('P002', 'LRN005', 'PYT202', '500.00', '2025-09-08 18:48:19', 'Processing', 'TXN12346'),
('P003', 'LRN007', 'SQL505', '750.00', '2025-09-08 18:48:19', 'Paid', 'TXN12347'),
('P004', 'LRN009', 'NODE808', '900.00', '2025-09-08 18:48:19', 'Paid', 'TXN12348'),
('P005', 'LRN021', 'CCPL001', '1000.00', '2025-09-08 19:00:25', 'Paid', 'TXN10005'),
('P006', 'LRN022', 'PHP606', '1200.00', '2025-09-08 19:00:25', 'Processing', 'TXN10006'),
('P007', 'LRN023', 'REACT707', '1500.00', '2025-09-08 19:00:25', 'Paid', 'TXN10007'),
('P008', 'LRN024', 'HTML404', '800.00', '2025-09-08 19:00:25', 'Paid', 'TXN10008'),
('P009', 'LRN025', 'PYT202', '700.00', '2025-09-08 19:00:25', 'Paid', 'TXN10009'),
('P010', 'LRN026', 'SQL505', '900.00', '2025-09-08 19:00:25', 'Processing', 'TXN10010'),
('P011', 'LRN027', 'NODE808', '950.00', '2025-09-08 19:00:25', 'Paid', 'TXN10011'),
('P012', 'LRN028', 'JAV101', '1000.00', '2025-09-08 19:00:25', 'Paid', 'TXN10012'),
('P013', 'LRN029', 'CCPL001', '1000.00', '2025-09-08 19:00:25', 'Paid', 'TXN10013'),
('P014', 'LRN030', 'PHP606', '1200.00', '2025-09-08 19:00:25', 'Processing', 'TXN10014');

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

DROP TABLE IF EXISTS `results`;
CREATE TABLE IF NOT EXISTS `results` (
  `ResultID` int NOT NULL AUTO_INCREMENT,
  `AccountID` varchar(10) NOT NULL,
  `CourseID` varchar(10) NOT NULL,
  `Content` text,
  `Mark` decimal(5,2) DEFAULT NULL,
  `RStatus` enum('Passed','Pending','Failed') NOT NULL,
  PRIMARY KEY (`ResultID`),
  KEY `AccountID` (`AccountID`),
  KEY `CourseID` (`CourseID`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Truncate table before insert `results`
--

TRUNCATE TABLE `results`;
--
-- Dumping data for table `results`
--

INSERT DELAYED IGNORE INTO `results` (`ResultID`, `AccountID`, `CourseID`, `Content`, `Mark`, `RStatus`) VALUES
(1, 'LRN004', 'CCPL001', 'Final assessment of C programming', '85.50', 'Passed'),
(2, 'LRN005', 'PYT202', 'Python basics final test', '78.00', 'Passed'),
(3, 'LRN007', 'SQL505', 'SQL queries assessment', '65.00', 'Pending'),
(4, 'LRN009', 'NODE808', 'NodeJS final assignment', '88.00', 'Passed'),
(5, 'LRN021', 'CCPL001', 'Final assessment of C programming', '90.00', 'Passed'),
(6, 'LRN022', 'PHP606', 'PHP project evaluation', '85.50', 'Passed'),
(7, 'LRN023', 'REACT707', 'ReactJS final project', '92.00', 'Passed'),
(8, 'LRN024', 'HTML404', 'HTML & CSS evaluation', '80.00', 'Passed'),
(9, 'LRN025', 'PYT202', 'Python basics test', '75.00', 'Passed'),
(10, 'LRN026', 'SQL505', 'SQL advanced queries', '78.50', 'Passed'),
(11, 'LRN027', 'NODE808', 'NodeJS final assignment', '88.00', 'Passed'),
(12, 'LRN028', 'JAV101', 'Java basics final test', '76.00', 'Passed'),
(13, 'LRN029', 'CCPL001', 'C programming second assessment', '82.00', 'Passed'),
(14, 'LRN030', 'PHP606', 'PHP second assignment', '84.00', 'Passed'),
(15, 'LRN021', 'SQL505', 'Final assessment of SQL Server advanced', '88.00', 'Passed'),
(16, 'LRN022', 'SQL505', 'Final assessment of SQL Server advanced', '92.00', 'Passed'),
(17, 'LRN023', 'SQL505', 'Final assessment of SQL Server advanced', '85.00', 'Passed'),
(18, 'LRN024', 'SQL505', 'Final assessment of SQL Server advanced', '78.50', 'Passed'),
(19, 'LRN025', 'SQL505', 'Final assessment of SQL Server advanced', '90.00', 'Passed'),
(20, 'LRN026', 'JAV101', 'Final assessment of Java basics', '85.00', 'Passed'),
(21, 'LRN027', 'JAV101', 'Final assessment of Java basics', '90.00', 'Passed'),
(22, 'LRN028', 'JAV101', 'Final assessment of Java basics', '88.00', 'Passed'),
(23, 'LRN029', 'JAV101', 'Final assessment of Java basics', '80.00', 'Passed'),
(24, 'LRN030', 'JAV101', 'Final assessment of Java basics', '92.00', 'Passed');

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

DROP TABLE IF EXISTS `submissions`;
CREATE TABLE IF NOT EXISTS `submissions` (
  `SubID` varchar(10) NOT NULL,
  `AccountID` varchar(10) NOT NULL,
  `CourseID` varchar(10) NOT NULL,
  `Answer` varchar(255) DEFAULT NULL,
  `Mark` float DEFAULT NULL,
  `Feedback` varchar(500) DEFAULT NULL,
  `SDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `SStatus` enum('Submitted','Late','Not Submit') NOT NULL,
  PRIMARY KEY (`SubID`),
  KEY `FK_Submission_Course` (`CourseID`),
  KEY `FK_Submission_Account` (`AccountID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Truncate table before insert `submissions`
--

TRUNCATE TABLE `submissions`;
--
-- Dumping data for table `submissions`
--

INSERT DELAYED IGNORE INTO `submissions` (`SubID`, `AccountID`, `CourseID`, `Answer`, `Mark`, `Feedback`, `SDate`, `SStatus`) VALUES
('S001', 'LRN004', 'CCPL001', 'answer01.pdf', 9.5, 'Good work', '2025-09-08 18:48:34', 'Submitted'),
('S002', 'LRN005', 'PYT202', 'answerquiz02.pdf', 8, 'Well done', '2025-09-08 18:48:34', 'Submitted'),
('S003', 'LRN007', 'SQL505', 'sql_assignment03.pdf', 7.5, 'Needs improvement', '2025-09-08 18:48:34', 'Late'),
('S004', 'LRN009', 'NODE808', 'node_assignment04.pdf', 8.5, 'Good', '2025-09-08 18:48:34', 'Submitted'),
('S005', 'LRN021', 'CCPL001', 'answer_ccpl01.pdf', 9, 'Excellent work', '2025-09-08 19:00:56', 'Submitted'),
('S006', 'LRN022', 'PHP606', 'answer_php01.pdf', 8.5, 'Good job', '2025-09-08 19:00:56', 'Submitted'),
('S007', 'LRN023', 'REACT707', 'answer_react01.pdf', 9.5, 'Very good', '2025-09-08 19:00:56', 'Submitted'),
('S008', 'LRN024', 'HTML404', 'answer_html01.pdf', 8, 'Well done', '2025-09-08 19:00:56', 'Submitted'),
('S009', 'LRN025', 'PYT202', 'answer_python01.pdf', 7.5, 'Needs improvement', '2025-09-08 19:00:56', 'Late'),
('S010', 'LRN026', 'SQL505', 'answer_sql01.pdf', 8, 'Good', '2025-09-08 19:00:56', 'Submitted'),
('S011', 'LRN027', 'NODE808', 'answer_node01.pdf', 9, 'Very good', '2025-09-08 19:00:56', 'Submitted'),
('S012', 'LRN028', 'JAV101', 'answer_java01.pdf', 7.5, 'Average', '2025-09-08 19:00:56', 'Late'),
('S013', 'LRN029', 'CCPL001', 'answer_ccpl02.pdf', 8.5, 'Good', '2025-09-08 19:00:56', 'Submitted'),
('S014', 'LRN030', 'PHP606', 'answer_php02.pdf', 8, 'Well done', '2025-09-08 19:00:56', 'Submitted'),
('S015', 'LRN021', 'SQL505', 'answer_sql01.pdf', 88, 'Good understanding', '2025-09-08 19:05:59', 'Submitted'),
('S016', 'LRN022', 'SQL505', 'answer_sql02.pdf', 92, 'Excellent', '2025-09-08 19:05:59', 'Submitted'),
('S017', 'LRN023', 'SQL505', 'answer_sql03.pdf', 85, 'Well done', '2025-09-08 19:05:59', 'Submitted'),
('S018', 'LRN024', 'SQL505', 'answer_sql04.pdf', 78.5, 'Needs improvement', '2025-09-08 19:05:59', 'Late'),
('S019', 'LRN025', 'SQL505', 'answer_sql05.pdf', 90, 'Very good', '2025-09-08 19:05:59', 'Submitted'),
('S020', 'LRN026', 'JAV101', 'answer_java01.pdf', 85, 'Good job', '2025-09-08 19:05:59', 'Submitted'),
('S021', 'LRN027', 'JAV101', 'answer_java02.pdf', 90, 'Excellent', '2025-09-08 19:05:59', 'Submitted'),
('S022', 'LRN028', 'JAV101', 'answer_java03.pdf', 88, 'Well done', '2025-09-08 19:05:59', 'Submitted'),
('S023', 'LRN029', 'JAV101', 'answer_java04.pdf', 80, 'Average', '2025-09-08 19:05:59', 'Late'),
('S024', 'LRN030', 'JAV101', 'answer_java05.pdf', 92, 'Very good', '2025-09-08 19:05:59', 'Submitted');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `FK_Course_Creator` FOREIGN KEY (`CreatorID`) REFERENCES `accounts` (`AccountID`);

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `FK_Enroll_Account` FOREIGN KEY (`AccountID`) REFERENCES `accounts` (`AccountID`),
  ADD CONSTRAINT `FK_Enroll_Course` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`);

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `FK_Feedback_Account` FOREIGN KEY (`AccountID`) REFERENCES `accounts` (`AccountID`);

--
-- Constraints for table `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `FK_Lesson_Course` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `FK_Payment_Account` FOREIGN KEY (`AccountID`) REFERENCES `accounts` (`AccountID`),
  ADD CONSTRAINT `FK_Payment_Course` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`);

--
-- Constraints for table `results`
--
ALTER TABLE `results`
  ADD CONSTRAINT `results_ibfk_1` FOREIGN KEY (`AccountID`) REFERENCES `accounts` (`AccountID`),
  ADD CONSTRAINT `results_ibfk_2` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`);

--
-- Constraints for table `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `FK_Submission_Account` FOREIGN KEY (`AccountID`) REFERENCES `accounts` (`AccountID`),
  ADD CONSTRAINT `FK_Submission_Course` FOREIGN KEY (`CourseID`) REFERENCES `courses` (`CourseID`);
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

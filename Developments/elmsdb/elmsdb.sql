-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 25, 2025 at 07:37 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

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

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `AccountID` varchar(30) NOT NULL,
  `AName` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Avatar` varchar(255) DEFAULT NULL,
  `Pass` varchar(255) NOT NULL,
  `ARole` enum('Admin','Instructor','Learner') NOT NULL,
  `AStatus` enum('Active','Inactive') NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `ApprovalStatus` enum('Pending','Approved') NOT NULL DEFAULT 'Approved'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`AccountID`, `AName`, `Email`, `Avatar`, `Pass`, `ARole`, `AStatus`, `CreatedAt`, `ApprovalStatus`) VALUES
('ADM001', 'Le Thi Hanh Mai', 'hanhmai120997@gmail.com', 'avatars/3IiY4GHB1oGUrubmdXOh6TTo3By0xql0udIpWhnD.png', '123456', 'Admin', 'Active', '2025-09-08 18:47:08', 'Approved'),
('ADM002', 'Dương Minh Mẫn', 'Duongminhman65@gmail.com', 'avatars/Pni4HzEEZ7g43Xe0pUN6da1aFbkUxPX3F0tl13J4.jpg', '123456', 'Admin', 'Active', '2025-09-08 18:47:08', 'Approved'),
('ADM003', 'Lý Thanh Nghi', 'nghily@example.com', 'avatars/eAOEThiCFOiKoIiU8iufFcQnl1wGr6BJky4LUYy0.jpg', '123456', 'Admin', 'Inactive', '2025-09-08 18:55:10', 'Approved'),
('ADM004', 'Cống Hiển Khoa', 'hienkhoalk@gmail.com', 'avatars/YOEwcW0h4FWg9XhhmI2LQYzmDIw0mG4JH1HKrBXh.jpg', '123456', 'Admin', 'Active', '2025-09-08 18:51:18', 'Approved'),
('ADM010', 'Nguyen Van Cuong', 'cuongnguyen@gmail.com', 'avatar.jpg', '123456', 'Admin', 'Inactive', '2025-09-08 18:47:08', 'Approved'),
('INS002', 'Tran Phi Hung', 'hungphitran@gmail.com', 'avatar.jpg', '123456', 'Instructor', 'Inactive', '2025-09-08 18:55:10', 'Approved'),
('INS003', 'Tran Van Hung', 'hungtran@gmail.com', 'avatar.jpg', '123456', 'Instructor', 'Active', '2025-09-08 18:47:08', 'Approved'),
('INS006', 'Nguyen Van An', 'an.nguyen@gmail.com', 'avatar.jpg', '123456', 'Instructor', 'Active', '2025-09-08 18:47:08', 'Approved'),
('INS008', 'Hoang Van Binh', 'binhhoang@gmail.com', 'avatar.jpg', '123456', 'Instructor', 'Active', '2025-09-08 18:47:08', 'Approved'),
('INS011', 'Nguyen Van Tai', 'tai.nguyen@gmail.com', 'avatar.jpg', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26', 'Approved'),
('INS012', 'Le Thi Huong', 'huongle@gmail.com', 'avatar.jpg', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26', 'Approved'),
('INS013', 'Pham Van Khoa', 'khoapv@gmail.com', 'avatar.jpg', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26', 'Approved'),
('INS014', 'Tran Thi Lan', 'lantran@gmail.com', 'avatar.jpg', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26', 'Approved'),
('INS015', 'Hoang Van Duc', 'duc.hoang@gmail.com', 'avatar.jpg', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26', 'Approved'),
('INS016', 'Nguyen Thi Mai', 'mainguyen@gmail.com', 'avatar.jpg', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26', 'Approved'),
('INS017', 'Le Van Binh', 'binhlevan@gmail.com', 'avatar.jpg', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26', 'Approved'),
('INS018', 'Pham Thi Thao', 'thaopham@gmail.com', 'avatar.jpg', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26', 'Approved'),
('INS019', 'Nguyen Van Hung', 'hungnguyen@gmail.com', 'avatar.jpg', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26', 'Approved'),
('INS020', 'Tran Van Nam', 'namtran@gmail.com', 'avatar.jpg', '123456', 'Instructor', 'Active', '2025-09-08 18:59:26', 'Approved'),
('LRN002', 'Ngo Ho Ngoc Huyen', 'huyenngo@gmail.com', 'avatar.jpg', '123456', 'Learner', 'Inactive', '2025-09-08 18:55:10', 'Approved'),
('LRN004', 'Ngo Bich Huyen', 'huyenbaby@gmail.com', 'avatar.jpg', '123456', 'Learner', 'Active', '2025-09-08 18:47:08', 'Approved'),
('LRN005', 'Le Thi Mai', 'lemai@gmail.com', 'avatar.jpg', '123456', 'Learner', 'Active', '2025-09-08 18:47:08', 'Approved'),
('LRN007', 'Pham Thi Lan', 'lanpham@gmail.com', 'avatar.jpg', '123456', 'Learner', 'Inactive', '2025-09-08 18:47:08', 'Approved'),
('LRN009', 'Tran Thi Hoa', 'hoatran@gmail.com', 'avatar.jpg', '123456', 'Learner', 'Active', '2025-09-08 18:47:08', 'Approved'),
('LRN021', 'Le Thi Thanh', 'thanhle@gmail.com', 'avatar.jpg', '123456', 'Learner', 'Active', '2025-09-08 18:59:26', 'Approved'),
('LRN022', 'Pham Van An', 'anpham@gmail.com', 'avatar.jpg', '123456', 'Learner', 'Active', '2025-09-08 18:59:26', 'Approved'),
('LRN023', 'Nguyen Thi Hoa', 'hoanguyen@gmail.com', 'avatar.jpg', '123456', 'Learner', 'Active', '2025-09-08 18:59:26', 'Approved'),
('LRN024', 'Tran Van Long', 'longtran@gmail.com', 'avatar.jpg', '123456', 'Learner', 'Active', '2025-09-08 18:59:26', 'Approved'),
('LRN025', 'Hoang Thi Mai', 'maith.hoang@gmail.com', 'avatar.jpg', '123456', 'Learner', 'Active', '2025-09-08 18:59:26', 'Approved'),
('LRN026', 'Nguyen Van Tuan', 'tuannguyen@gmail.com', 'avatar.jpg', '123456', 'Learner', 'Active', '2025-09-08 18:59:26', 'Approved'),
('LRN027', 'Le Thi Lan', 'lanle@gmail.com', 'avatar.jpg', '123456', 'Learner', 'Active', '2025-09-08 18:59:26', 'Approved'),
('LRN028', 'Pham Van Cuong', 'cuongpham@gmail.com', 'avatar.jpg', '123456', 'Learner', 'Active', '2025-09-08 18:59:26', 'Approved'),
('LRN029', 'Nguyen Thi Thu', 'thunguyen@gmail.com', 'avatar.jpg', '123456', 'Learner', 'Active', '2025-09-08 18:59:26', 'Approved'),
('LRN030', 'Tran Van Hieu', 'hieutran@gmail.com', 'avatar.jpg', '123456', 'Learner', 'Active', '2025-09-08 18:59:26', 'Approved');

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint UNSIGNED NOT NULL,
  `AccountID` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` json DEFAULT NULL,
  `ip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agent` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `AccountID`, `action`, `meta`, `ip`, `agent`, `created_at`) VALUES
(1, 'ADM004', 'login', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 04:55:11'),
(2, 'ADM004', 'logout', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 05:18:45'),
(3, 'ADM004', 'login', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 05:22:21'),
(4, 'ADM004', 'login', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 05:22:22'),
(5, 'ADM004', 'login', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 05:22:22'),
(6, 'ADM004', 'password.change', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 05:22:50'),
(7, 'ADM004', 'profile.update', '{\"changed\": [\"new_password\", \"new_password_confirmation\"]}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 05:22:50'),
(8, 'ADM004', 'avatar.update', '{\"path\": \"avatars/7a8E6L3L0JTaX9v0ZdQk1SlhpaZDH175C5XdwufU.jpg\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 05:23:22'),
(9, 'ADM004', 'logout', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 05:24:40'),
(10, 'ADM004', 'login', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 05:32:14'),
(11, 'ADM004', 'avatar.update', '{\"path\": \"avatars/t9eas8kndsSnHxSSZoK6rQJrz6eqrV4YCcpk5KxM.png\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 05:32:29'),
(12, 'ADM004', 'avatar.update', '{\"path\": \"avatars/YOEwcW0h4FWg9XhhmI2LQYzmDIw0mG4JH1HKrBXh.jpg\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 05:52:24'),
(13, 'ADM004', 'logout', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 05:52:35'),
(14, 'ADM002', 'login', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 05:54:53'),
(15, 'ADM002', 'avatar.update', '{\"path\": \"avatars/Pni4HzEEZ7g43Xe0pUN6da1aFbkUxPX3F0tl13J4.jpg\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 05:55:11'),
(16, 'ADM002', 'logout', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 05:55:32'),
(17, 'ADM001', 'login', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 05:55:49'),
(18, 'ADM004', 'login', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 06:12:13'),
(19, 'ADM004', 'logout', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 06:19:07'),
(20, 'ADM004', 'login', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 06:25:16'),
(21, 'ADM004', 'login', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 06:29:07'),
(22, 'ADM004', 'login', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 06:50:46'),
(23, 'ADM004', 'logout', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 06:52:54'),
(24, 'ADM003', 'login', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 06:55:48'),
(25, 'ADM003', 'logout', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 06:56:18'),
(26, 'ADM004', 'login', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 06:56:29'),
(27, 'ADM003', 'login', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 06:59:30'),
(28, 'ADM003', 'avatar.update', '{\"path\": \"avatars/eAOEThiCFOiKoIiU8iufFcQnl1wGr6BJky4LUYy0.jpg\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 07:02:31'),
(29, 'ADM003', 'profile.update', '{\"changed\": [\"AName\"]}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0', '2025-09-25 07:02:49');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `CourseID` varchar(10) NOT NULL,
  `CName` varchar(200) NOT NULL,
  `CDescription` text,
  `StartDate` date DEFAULT NULL,
  `CreatorID` varchar(30) NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `CStatus` enum('Active','Inactive') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`CourseID`, `CName`, `CDescription`, `StartDate`, `CreatorID`, `CreatedAt`, `CStatus`) VALUES
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

CREATE TABLE `enrollments` (
  `EnrollmentID` varchar(10) NOT NULL,
  `AccountID` varchar(30) NOT NULL,
  `CourseID` varchar(10) NOT NULL,
  `EnrollDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `EStatus` enum('Paid','Processing','Not Confirmed') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`EnrollmentID`, `AccountID`, `CourseID`, `EnrollDate`, `EStatus`) VALUES
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
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `failed_jobs`
--

INSERT INTO `failed_jobs` (`id`, `uuid`, `connection`, `queue`, `payload`, `exception`, `failed_at`) VALUES
(1, '735f9ea4-b567-416a-88e0-8c9d4ca9103a', 'database', 'default', '{\"uuid\":\"735f9ea4-b567-416a-88e0-8c9d4ca9103a\",\"displayName\":\"App\\\\Notifications\\\\NewFeedbackNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\",\"command\":\"O:48:\\\"Illuminate\\\\Notifications\\\\SendQueuedNotifications\\\":3:{s:11:\\\"notifiables\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Account\\\";s:2:\\\"id\\\";a:1:{i:0;s:6:\\\"ADM001\\\";}s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:41:\\\"App\\\\Notifications\\\\NewFeedbackNotification\\\":2:{s:7:\\\"payload\\\";a:3:{s:5:\\\"title\\\";s:9:\\\"Test Ping\\\";s:7:\\\"message\\\";s:24:\\\"This is a realtime ping!\\\";s:4:\\\"link\\\";s:15:\\\"\\/admin\\/feedback\\\";}s:2:\\\"id\\\";s:36:\\\"5d8acba7-ddd9-4f4b-b945-af661b04588b\\\";}s:8:\\\"channels\\\";a:1:{i:0;s:8:\\\"database\\\";}}\"}}', 'PDOException: SQLSTATE[HY000]: General error: 1366 Incorrect integer value: \'ADM001\' for column \'notifiable_id\' at row 1 in C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\MySqlConnection.php:45\nStack trace:\n#0 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\MySqlConnection.php(45): PDOStatement->execute()\n#1 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(816): Illuminate\\Database\\MySqlConnection->Illuminate\\Database\\{closure}(\'insert into `no...\', Array)\n#2 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(783): Illuminate\\Database\\Connection->runQueryCallback(\'insert into `no...\', Array, Object(Closure))\n#3 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\MySqlConnection.php(50): Illuminate\\Database\\Connection->run(\'insert into `no...\', Array, Object(Closure))\n#4 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3500): Illuminate\\Database\\MySqlConnection->insert(\'insert into `no...\', Array)\n#5 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Eloquent\\Builder.php(1982): Illuminate\\Database\\Query\\Builder->insert(Array)\n#6 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Eloquent\\Model.php(1310): Illuminate\\Database\\Eloquent\\Builder->__call(\'insert\', Array)\n#7 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Eloquent\\Model.php(1138): Illuminate\\Database\\Eloquent\\Model->performInsert(Object(Illuminate\\Database\\Eloquent\\Builder))\n#8 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Eloquent\\Relations\\HasOneOrMany.php(342): Illuminate\\Database\\Eloquent\\Model->save()\n#9 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\helpers.php(320): Illuminate\\Database\\Eloquent\\Relations\\HasOneOrMany->Illuminate\\Database\\Eloquent\\Relations\\{closure}(Object(Illuminate\\Notifications\\DatabaseNotification))\n#10 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Eloquent\\Relations\\HasOneOrMany.php(343): tap(Object(Illuminate\\Notifications\\DatabaseNotification), Object(Closure))\n#11 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\Channels\\DatabaseChannel.php(20): Illuminate\\Database\\Eloquent\\Relations\\HasOneOrMany->create(Array)\n#12 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\NotificationSender.php(148): Illuminate\\Notifications\\Channels\\DatabaseChannel->send(Object(App\\Models\\Account), Object(App\\Notifications\\NewFeedbackNotification))\n#13 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\NotificationSender.php(106): Illuminate\\Notifications\\NotificationSender->sendToNotifiable(Object(App\\Models\\Account), \'22844291-d6ce-4...\', Object(App\\Notifications\\NewFeedbackNotification), \'database\')\n#14 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Traits\\Localizable.php(19): Illuminate\\Notifications\\NotificationSender->Illuminate\\Notifications\\{closure}()\n#15 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\NotificationSender.php(109): Illuminate\\Notifications\\NotificationSender->withLocale(NULL, Object(Closure))\n#16 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\ChannelManager.php(54): Illuminate\\Notifications\\NotificationSender->sendNow(Object(Illuminate\\Database\\Eloquent\\Collection), Object(App\\Notifications\\NewFeedbackNotification), Array)\n#17 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\SendQueuedNotifications.php(119): Illuminate\\Notifications\\ChannelManager->sendNow(Object(Illuminate\\Database\\Eloquent\\Collection), Object(App\\Notifications\\NewFeedbackNotification), Array)\n#18 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Notifications\\SendQueuedNotifications->handle(Object(Illuminate\\Notifications\\ChannelManager))\n#19 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(41): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#20 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(93): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#21 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(37): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#22 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(662): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#23 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(128): Illuminate\\Container\\Container->call(Array)\n#24 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(Illuminate\\Notifications\\SendQueuedNotifications))\n#25 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Notifications\\SendQueuedNotifications))\n#26 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(132): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#27 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(124): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(Illuminate\\Notifications\\SendQueuedNotifications), false)\n#28 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(Illuminate\\Notifications\\SendQueuedNotifications))\n#29 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Notifications\\SendQueuedNotifications))\n#30 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(126): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#31 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(70): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Notifications\\SendQueuedNotifications))\n#32 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#33 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(439): Illuminate\\Queue\\Jobs\\Job->fire()\n#34 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(389): Illuminate\\Queue\\Worker->process(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#35 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(176): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), \'database\', Object(Illuminate\\Queue\\WorkerOptions))\n#36 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(138): Illuminate\\Queue\\Worker->daemon(\'database\', \'default\', Object(Illuminate\\Queue\\WorkerOptions))\n#37 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(121): Illuminate\\Queue\\Console\\WorkCommand->runWorker(\'database\', \'default\')\n#38 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#39 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(41): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#40 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(93): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#41 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(37): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#42 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(662): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#43 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#44 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\symfony\\console\\Command\\Command.php(326): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#45 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(181): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#46 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\symfony\\console\\Application.php(1096): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#47 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\symfony\\console\\Application.php(324): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#48 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\symfony\\console\\Application.php(175): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#49 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(201): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#50 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\artisan(37): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#51 {main}\n\nNext Illuminate\\Database\\QueryException: SQLSTATE[HY000]: General error: 1366 Incorrect integer value: \'ADM001\' for column \'notifiable_id\' at row 1 (Connection: mysql, SQL: insert into `notifications` (`id`, `type`, `data`, `read_at`, `notifiable_id`, `notifiable_type`, `updated_at`, `created_at`) values (5d8acba7-ddd9-4f4b-b945-af661b04588b, App\\Notifications\\NewFeedbackNotification, {\"title\":\"Test Ping\",\"message\":\"This is a realtime ping!\",\"link\":\"\\/admin\\/feedback\"}, ?, ADM001, App\\Models\\Account, 2025-09-23 15:09:50, 2025-09-23 15:09:50)) in C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:829\nStack trace:\n#0 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(783): Illuminate\\Database\\Connection->runQueryCallback(\'insert into `no...\', Array, Object(Closure))\n#1 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\MySqlConnection.php(50): Illuminate\\Database\\Connection->run(\'insert into `no...\', Array, Object(Closure))\n#2 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3500): Illuminate\\Database\\MySqlConnection->insert(\'insert into `no...\', Array)\n#3 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Eloquent\\Builder.php(1982): Illuminate\\Database\\Query\\Builder->insert(Array)\n#4 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Eloquent\\Model.php(1310): Illuminate\\Database\\Eloquent\\Builder->__call(\'insert\', Array)\n#5 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Eloquent\\Model.php(1138): Illuminate\\Database\\Eloquent\\Model->performInsert(Object(Illuminate\\Database\\Eloquent\\Builder))\n#6 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Eloquent\\Relations\\HasOneOrMany.php(342): Illuminate\\Database\\Eloquent\\Model->save()\n#7 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\helpers.php(320): Illuminate\\Database\\Eloquent\\Relations\\HasOneOrMany->Illuminate\\Database\\Eloquent\\Relations\\{closure}(Object(Illuminate\\Notifications\\DatabaseNotification))\n#8 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Eloquent\\Relations\\HasOneOrMany.php(343): tap(Object(Illuminate\\Notifications\\DatabaseNotification), Object(Closure))\n#9 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\Channels\\DatabaseChannel.php(20): Illuminate\\Database\\Eloquent\\Relations\\HasOneOrMany->create(Array)\n#10 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\NotificationSender.php(148): Illuminate\\Notifications\\Channels\\DatabaseChannel->send(Object(App\\Models\\Account), Object(App\\Notifications\\NewFeedbackNotification))\n#11 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\NotificationSender.php(106): Illuminate\\Notifications\\NotificationSender->sendToNotifiable(Object(App\\Models\\Account), \'22844291-d6ce-4...\', Object(App\\Notifications\\NewFeedbackNotification), \'database\')\n#12 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Traits\\Localizable.php(19): Illuminate\\Notifications\\NotificationSender->Illuminate\\Notifications\\{closure}()\n#13 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\NotificationSender.php(109): Illuminate\\Notifications\\NotificationSender->withLocale(NULL, Object(Closure))\n#14 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\ChannelManager.php(54): Illuminate\\Notifications\\NotificationSender->sendNow(Object(Illuminate\\Database\\Eloquent\\Collection), Object(App\\Notifications\\NewFeedbackNotification), Array)\n#15 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Notifications\\SendQueuedNotifications.php(119): Illuminate\\Notifications\\ChannelManager->sendNow(Object(Illuminate\\Database\\Eloquent\\Collection), Object(App\\Notifications\\NewFeedbackNotification), Array)\n#16 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Notifications\\SendQueuedNotifications->handle(Object(Illuminate\\Notifications\\ChannelManager))\n#17 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(41): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#18 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(93): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#19 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(37): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#20 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(662): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#21 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(128): Illuminate\\Container\\Container->call(Array)\n#22 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(Illuminate\\Notifications\\SendQueuedNotifications))\n#23 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Notifications\\SendQueuedNotifications))\n#24 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(132): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#25 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(124): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(Illuminate\\Notifications\\SendQueuedNotifications), false)\n#26 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(Illuminate\\Notifications\\SendQueuedNotifications))\n#27 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Notifications\\SendQueuedNotifications))\n#28 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(126): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#29 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(70): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Notifications\\SendQueuedNotifications))\n#30 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#31 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(439): Illuminate\\Queue\\Jobs\\Job->fire()\n#32 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(389): Illuminate\\Queue\\Worker->process(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#33 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(176): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), \'database\', Object(Illuminate\\Queue\\WorkerOptions))\n#34 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(138): Illuminate\\Queue\\Worker->daemon(\'database\', \'default\', Object(Illuminate\\Queue\\WorkerOptions))\n#35 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(121): Illuminate\\Queue\\Console\\WorkCommand->runWorker(\'database\', \'default\')\n#36 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#37 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(41): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#38 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(93): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#39 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(37): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#40 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(662): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#41 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#42 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\symfony\\console\\Command\\Command.php(326): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#43 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(181): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#44 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\symfony\\console\\Application.php(1096): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#45 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\symfony\\console\\Application.php(324): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#46 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\symfony\\console\\Application.php(175): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#47 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(201): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#48 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\artisan(37): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#49 {main}', '2025-09-23 08:09:50'),
(2, '1d201645-8531-48f9-aa70-47dbbd4224d0', 'database', 'default', '{\"uuid\":\"1d201645-8531-48f9-aa70-47dbbd4224d0\",\"displayName\":\"Illuminate\\\\Notifications\\\\Events\\\\BroadcastNotificationCreated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:60:\\\"Illuminate\\\\Notifications\\\\Events\\\\BroadcastNotificationCreated\\\":3:{s:10:\\\"notifiable\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Account\\\";s:2:\\\"id\\\";s:6:\\\"ADM001\\\";s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:12:\\\"notification\\\";O:41:\\\"App\\\\Notifications\\\\NewFeedbackNotification\\\":2:{s:7:\\\"payload\\\";a:3:{s:5:\\\"title\\\";s:9:\\\"Test Ping\\\";s:7:\\\"message\\\";s:24:\\\"This is a realtime ping!\\\";s:4:\\\"link\\\";s:15:\\\"\\/admin\\/feedback\\\";}s:2:\\\"id\\\";s:36:\\\"5d8acba7-ddd9-4f4b-b945-af661b04588b\\\";}s:4:\\\"data\\\";a:3:{s:5:\\\"title\\\";s:9:\\\"Test Ping\\\";s:7:\\\"message\\\";s:24:\\\"This is a realtime ping!\\\";s:4:\\\"link\\\";s:15:\\\"\\/admin\\/feedback\\\";}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}}\"}}', 'Error: Class \"Pusher\\Pusher\" not found in C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Broadcasting\\BroadcastManager.php:306\nStack trace:\n#0 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Broadcasting\\BroadcastManager.php(295): Illuminate\\Broadcasting\\BroadcastManager->pusher(Array)\n#1 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Broadcasting\\BroadcastManager.php(262): Illuminate\\Broadcasting\\BroadcastManager->createPusherDriver(Array)\n#2 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Broadcasting\\BroadcastManager.php(233): Illuminate\\Broadcasting\\BroadcastManager->resolve(\'pusher\')\n#3 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Broadcasting\\BroadcastManager.php(222): Illuminate\\Broadcasting\\BroadcastManager->get(\'pusher\')\n#4 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Broadcasting\\BroadcastManager.php(209): Illuminate\\Broadcasting\\BroadcastManager->driver(\'pusher\')\n#5 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Broadcasting\\BroadcastEvent.php(92): Illuminate\\Broadcasting\\BroadcastManager->connection(NULL)\n#6 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Broadcasting\\BroadcastEvent->handle(Object(Illuminate\\Broadcasting\\BroadcastManager))\n#7 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(41): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#8 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(93): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#9 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(37): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#10 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(662): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#11 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(128): Illuminate\\Container\\Container->call(Array)\n#12 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(Illuminate\\Broadcasting\\BroadcastEvent))\n#13 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Broadcasting\\BroadcastEvent))\n#14 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(132): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#15 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(124): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(Illuminate\\Broadcasting\\BroadcastEvent), false)\n#16 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(Illuminate\\Broadcasting\\BroadcastEvent))\n#17 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Broadcasting\\BroadcastEvent))\n#18 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(126): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#19 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(70): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Broadcasting\\BroadcastEvent))\n#20 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#21 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(439): Illuminate\\Queue\\Jobs\\Job->fire()\n#22 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(389): Illuminate\\Queue\\Worker->process(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#23 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(176): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), \'database\', Object(Illuminate\\Queue\\WorkerOptions))\n#24 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(138): Illuminate\\Queue\\Worker->daemon(\'database\', \'default\', Object(Illuminate\\Queue\\WorkerOptions))\n#25 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(121): Illuminate\\Queue\\Console\\WorkCommand->runWorker(\'database\', \'default\')\n#26 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#27 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(41): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#28 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(93): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#29 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(37): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#30 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(662): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#31 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#32 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\symfony\\console\\Command\\Command.php(326): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#33 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(181): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#34 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\symfony\\console\\Application.php(1096): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#35 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\symfony\\console\\Application.php(324): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#36 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\symfony\\console\\Application.php(175): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#37 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(201): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#38 C:\\Users\\ASUS\\Downloads\\demo\\ProjectSem02-main (1)\\ProjectSem02-main\\artisan(37): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#39 {main}', '2025-09-23 08:09:51');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `FeedbackID` varchar(10) NOT NULL,
  `AccountID` varchar(30) NOT NULL,
  `Content` text,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `FStatus` enum('Processed','Waiting') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`FeedbackID`, `AccountID`, `Content`, `CreatedAt`, `FStatus`) VALUES
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
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `LessonID` varchar(10) NOT NULL,
  `CourseID` varchar(10) NOT NULL,
  `LName` varchar(200) NOT NULL,
  `Content` text,
  `LessonType` enum('Video','Quiz','Assignment') NOT NULL,
  `Ordinal` int DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `LStatus` enum('Paid','Processing','Not Confirmed') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`LessonID`, `CourseID`, `LName`, `Content`, `LessonType`, `Ordinal`, `CreatedAt`, `LStatus`) VALUES
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
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2025_09_21_153428_update_personal_access_tokens_table', 1),
(6, '2025_09_23_113609_modify_tokenable_id_in_personal_access_tokens', 2),
(7, '2025_09_23_143441_create_notifications_table', 3),
(8, '2025_09_23_150343_create_jobs_table', 4),
(9, '2025_09_24_030029_add_avatar_to_accounts_table', 5),
(10, '2025_09_24_143330_add_avatar_to_users_table', 6),
(11, '2025_09_25_103922_create_activity_logs_table', 7);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_id` bigint UNSIGNED NOT NULL,
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `PaymentID` varchar(10) NOT NULL,
  `AccountID` varchar(30) NOT NULL,
  `CourseID` varchar(10) NOT NULL,
  `Amount` decimal(10,2) DEFAULT NULL,
  `PayDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `PStatus` enum('Paid','Processing','Not Confirmed') NOT NULL,
  `TransactionRef` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`PaymentID`, `AccountID`, `CourseID`, `Amount`, `PayDate`, `PStatus`, `TransactionRef`) VALUES
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
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\Account', 'LRN031', 'api-token', '0ecfce81884ea3099bdb70f74dbf70e73dc59c6488f42c5685130639672c3b7f', '[\"*\"]', NULL, NULL, '2025-09-23 04:40:36', '2025-09-23 04:40:36'),
(3, 'App\\Models\\Account', 'INS021', 'api-token', '5fc18b027ecd815e719d8ab52aa3ae9cf03404f862f9b73ee2aac2fc12cdd9e4', '[\"*\"]', NULL, NULL, '2025-09-23 04:41:38', '2025-09-23 04:41:38'),
(13, 'App\\Models\\Account', 'LRN031', 'api-token', 'd15bf97d7ec8ebe0dae1000f248d83663409165bbc55d53c8f1978a87987e97a', '[\"*\"]', NULL, NULL, '2025-09-23 09:20:23', '2025-09-23 09:20:23'),
(22, 'App\\Models\\Account', 'LRN032', 'api-token', 'e397a1f12c0df201e3416247dd30e63128bc40034557fd65ca98abfdfeb91745', '[\"*\"]', NULL, NULL, '2025-09-23 13:57:33', '2025-09-23 13:57:33'),
(23, 'App\\Models\\Account', 'INS021', 'api-token', '1a6c6373ad963a9f4ebbf7a650160ad9ded6a79da4ed24e9d061a282d9e66ede', '[\"*\"]', NULL, NULL, '2025-09-23 13:58:27', '2025-09-23 13:58:27'),
(24, 'App\\Models\\Account', 'INS021', 'api-token', 'dcceeef3a6098311aa54f7f8cd7c9f0a1cab06cb1ada963b6384b63600806f18', '[\"*\"]', NULL, NULL, '2025-09-23 14:00:37', '2025-09-23 14:00:37'),
(41, 'App\\Models\\Account', 'ADM001', 'api-token', '41762e9df4021a5fc1b3b59aad68d16979c79598e8a95863ea8d9f9536a3fe3b', '[\"*\"]', '2025-09-25 02:27:03', NULL, '2025-09-24 07:17:38', '2025-09-25 02:27:03'),
(43, 'App\\Models\\Account', 'ADM001', 'api-token', 'cdd6723058c8ef436570f4c521a854548e968aaf4604e10e8b19ec6def232266', '[\"*\"]', '2025-09-25 02:34:33', NULL, '2025-09-24 08:56:15', '2025-09-25 02:34:33'),
(60, 'App\\Models\\Account', 'ADM001', 'api-token', '8c122902b20d3ba01adc3fbd48dd5a9bdcbad247a29d2248e2f2bbe2f82d5f57', '[\"*\"]', '2025-09-25 06:00:33', NULL, '2025-09-25 05:55:49', '2025-09-25 06:00:33'),
(66, 'App\\Models\\Account', 'ADM004', 'api-token', '24aae9fdea0de1ad4486766f3a933a05b7acc0d0aba352ad52cd0ba7d48f29cf', '[\"*\"]', '2025-09-25 07:00:55', NULL, '2025-09-25 06:56:29', '2025-09-25 07:00:55'),
(67, 'App\\Models\\Account', 'ADM003', 'api-token', '5c010d4d1fdbb8bec891082276f5a54dc28732136124cd3e565dac105900194d', '[\"*\"]', '2025-09-25 07:37:33', NULL, '2025-09-25 06:59:30', '2025-09-25 07:37:33');

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

CREATE TABLE `results` (
  `ResultID` int NOT NULL,
  `AccountID` varchar(30) NOT NULL,
  `CourseID` varchar(10) NOT NULL,
  `Content` text,
  `Mark` decimal(5,2) DEFAULT NULL,
  `RStatus` enum('Passed','Pending','Failed') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `results`
--

INSERT INTO `results` (`ResultID`, `AccountID`, `CourseID`, `Content`, `Mark`, `RStatus`) VALUES
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

CREATE TABLE `submissions` (
  `SubID` varchar(10) NOT NULL,
  `AccountID` varchar(30) NOT NULL,
  `CourseID` varchar(10) NOT NULL,
  `Answer` varchar(255) DEFAULT NULL,
  `Mark` float DEFAULT NULL,
  `Feedback` varchar(500) DEFAULT NULL,
  `SDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `SStatus` enum('Submitted','Late','Not Submit') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `submissions`
--

INSERT INTO `submissions` (`SubID`, `AccountID`, `CourseID`, `Answer`, `Mark`, `Feedback`, `SDate`, `SStatus`) VALUES
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

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`AccountID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_accountid_index` (`AccountID`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`CourseID`),
  ADD KEY `FK_Course_Creator` (`CreatorID`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`EnrollmentID`),
  ADD KEY `FK_Enroll_Account` (`AccountID`),
  ADD KEY `FK_Enroll_Course` (`CourseID`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`FeedbackID`),
  ADD KEY `FK_Feedback_Account` (`AccountID`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`LessonID`),
  ADD KEY `FK_Lesson_Course` (`CourseID`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`PaymentID`),
  ADD KEY `FK_Payment_Account` (`AccountID`),
  ADD KEY `FK_Payment_Course` (`CourseID`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`ResultID`),
  ADD KEY `AccountID` (`AccountID`),
  ADD KEY `CourseID` (`CourseID`);

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`SubID`),
  ADD KEY `FK_Submission_Course` (`CourseID`),
  ADD KEY `FK_Submission_Account` (`AccountID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `results`
--
ALTER TABLE `results`
  MODIFY `ResultID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

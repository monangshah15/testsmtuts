-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jan 26, 2016 at 02:25 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `db_lmjqynjg3in0`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_attendances`
--

CREATE TABLE IF NOT EXISTS `tbl_attendances` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) DEFAULT NULL,
  `i_student_id` int(11) DEFAULT NULL,
  `i_batch_id` int(11) DEFAULT NULL,
  `i_template_id` int(11) DEFAULT NULL,
  `e_status` enum('Absent','Present') DEFAULT NULL,
  `e_send_message` enum('Yes','No') DEFAULT NULL,
  `d_date` date DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_batches`
--

CREATE TABLE IF NOT EXISTS `tbl_batches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) DEFAULT NULL,
  `v_batch_title` varchar(100) DEFAULT NULL,
  `e_status` enum('Active','Inactive') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_exams`
--

CREATE TABLE IF NOT EXISTS `tbl_exams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) DEFAULT NULL,
  `i_batch_id` int(11) DEFAULT NULL,
  `i_subject_id` int(11) DEFAULT NULL,
  `v_title` varchar(100) DEFAULT NULL,
  `i_total_marks` smallint(6) DEFAULT NULL,
  `d_date` datetime DEFAULT NULL,
  `e_status` enum('Active','Inactive') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_fees`
--

CREATE TABLE IF NOT EXISTS `tbl_fees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) DEFAULT NULL,
  `i_batch_id` int(11) DEFAULT NULL,
  `i_student_id` int(11) DEFAULT NULL,
  `f_price` int(11) DEFAULT NULL,
  `d_due_date` date DEFAULT NULL,
  `d_paid_date` date DEFAULT NULL,
  `e_send_message` enum('Yes','No') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_marks`
--

CREATE TABLE IF NOT EXISTS `tbl_marks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) DEFAULT NULL,
  `i_subject_id` int(11) DEFAULT NULL,
  `i_batch_id` int(11) DEFAULT NULL,
  `i_template_id` int(11) DEFAULT NULL,
  `i_student_id` int(11) DEFAULT NULL,
  `i_mark_obtained` smallint(6) DEFAULT NULL,
  `e_send_message` enum('Yes','No') DEFAULT NULL,
  `e_status` enum('Absent','Present') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_news`
--

CREATE TABLE IF NOT EXISTS `tbl_news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) DEFAULT NULL,
  `i_student_id` int(11) DEFAULT NULL,
  `i_batch_id` int(11) DEFAULT NULL,
  `i_template_id` int(11) DEFAULT NULL,
  `v_template` varchar(256) DEFAULT NULL,
  `e_send_message` enum('Yes','No') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_schools`
--

CREATE TABLE IF NOT EXISTS `tbl_schools` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) DEFAULT NULL,
  `v_title` varchar(500) DEFAULT NULL,
  `e_status` enum('Active','Inactive') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_section_permissions`
--

CREATE TABLE IF NOT EXISTS `tbl_section_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) DEFAULT NULL,
  `v_permission` int(11) DEFAULT NULL,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sms_logs`
--

CREATE TABLE IF NOT EXISTS `tbl_sms_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) DEFAULT NULL,
  `i_student_id` int(11) DEFAULT NULL,
  `v_phone_number` varchar(20) DEFAULT NULL,
  `v_message` text,
  `i_message_sent` enum('Yes','No') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sms_permissions`
--

CREATE TABLE IF NOT EXISTS `tbl_sms_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) DEFAULT NULL,
  `v_permission` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_students`
--

CREATE TABLE IF NOT EXISTS `tbl_students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) DEFAULT NULL,
  `v_first_name` varchar(100) DEFAULT NULL,
  `v_last_name` varchar(100) DEFAULT NULL,
  `v_email` varchar(100) DEFAULT NULL,
  `i_school_id` int(11) DEFAULT NULL,
  `i_batch_id` int(11) DEFAULT NULL,
  `v_parent_name` varchar(100) DEFAULT NULL,
  `v_mobile_number` varchar(20) DEFAULT NULL,
  `v_nick_name` varchar(100) DEFAULT NULL,
  `v_address` varchar(500) DEFAULT NULL,
  `e_status` enum('Active','Inactive') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_subjects`
--

CREATE TABLE IF NOT EXISTS `tbl_subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) DEFAULT NULL,
  `v_subject_name` varchar(100) DEFAULT NULL,
  `e_status` enum('Active','Inactive') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE IF NOT EXISTS `tbl_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `v_name` varchar(100) DEFAULT NULL,
  `v_username` varchar(100) DEFAULT NULL,
  `v_email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `d_recent_login` timestamp NULL DEFAULT NULL,
  `v_access_code` varchar(100) DEFAULT NULL,
  `e_type` enum('Super','Simple') DEFAULT NULL,
  `e_status` enum('Active','Inactive') DEFAULT NULL,
  `d_registration_date` date DEFAULT NULL,
  `d_payment_due_date` date DEFAULT NULL,
  `i_default_sms_count` int(11) DEFAULT NULL,
  `v_company_name` varchar(100) DEFAULT NULL,
  `v_company_alias` varchar(256) DEFAULT NULL,
  `v_company_address` varchar(500) DEFAULT NULL,
  `v_company_email` varchar(100) DEFAULT NULL,
  `v_phone` varchar(256) DEFAULT NULL,
  `v_regards_name` varchar(100) DEFAULT NULL,
  `v_company_logo` varchar(100) DEFAULT NULL,
  `v_auth_key` varchar(100) DEFAULT NULL,
  `v_encryption_id` varchar(256) DEFAULT NULL,
  `v_sender_id` varchar(100) DEFAULT NULL,
  `e_messages_type` enum('Transactional','Promotional') DEFAULT NULL,
  `v_db_name` varchar(256) DEFAULT NULL,
  `v_db_host` varchar(256) DEFAULT NULL,
  `v_db_user` varchar(256) DEFAULT NULL,
  `v_db_password` varchar(256) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

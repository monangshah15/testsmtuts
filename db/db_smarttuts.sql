-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jan 26, 2016 at 02:23 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `db_smarttuts`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_administrators`
--

CREATE TABLE IF NOT EXISTS `tbl_administrators` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `v_name` varchar(100) NOT NULL,
  `v_username` varchar(100) NOT NULL,
  `v_email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `remember_token` varchar(100) NOT NULL,
  `d_recent_login` timestamp NOT NULL,
  `v_access_code` varchar(100) NOT NULL,
  `e_type` enum('Super','Simple') NOT NULL DEFAULT 'Simple',
  `e_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `d_registration_date` date NOT NULL,
  `d_payment_due_date` date NOT NULL,
  `i_default_sms_count` int(11) NOT NULL,
  `v_company_name` varchar(100) NOT NULL,
  `v_company_alias` varchar(255) NOT NULL,
  `v_company_address` varchar(500) NOT NULL,
  `v_company_email` varchar(100) NOT NULL,
  `v_user_signature` varchar(255) NOT NULL,
  `v_phone` varchar(256) NOT NULL,
  `v_regards_name` varchar(100) NOT NULL,
  `v_company_logo` varchar(100) NOT NULL,
  `v_auth_key` varchar(100) NOT NULL,
  `v_encryption_id` varchar(256) NOT NULL,
  `v_sender_id` varchar(100) NOT NULL,
  `e_messages_type` enum('Transactional','Promotional') NOT NULL DEFAULT 'Promotional',
  `v_db_name` varchar(256) NOT NULL,
  `v_db_host` varchar(256) NOT NULL,
  `v_db_user` varchar(256) NOT NULL,
  `v_db_password` varchar(256) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `tbl_administrators`
--

INSERT INTO `tbl_administrators` (`id`, `v_name`, `v_username`, `v_email`, `password`, `remember_token`, `d_recent_login`, `v_access_code`, `e_type`, `e_status`, `d_registration_date`, `d_payment_due_date`, `i_default_sms_count`, `v_company_name`, `v_company_alias`, `v_company_address`, `v_company_email`, `v_user_signature`, `v_phone`, `v_regards_name`, `v_company_logo`, `v_auth_key`, `v_encryption_id`, `v_sender_id`, `e_messages_type`, `v_db_name`, `v_db_host`, `v_db_user`, `v_db_password`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Admin', 'Admin', 'testing.demo@gmail.com', '$2y$10$qxKrnliLq560V0ZEwAun4.Xh0ltmB1HKDFbX533dl01sQ66Hkv17e', 'Fadp0jJMrPEAuAz6PyAtM0J5K97nnCKLqcGNTavwM6tVasgTb3L8p56TofWG', '0000-00-00 00:00:00', '', 'Super', 'Active', '0000-00-00', '0000-00-00', 0, '', '', '', '', '', '', '', '', '', '', '', 'Promotional', '', '', '', '', '0000-00-00 00:00:00', '2016-01-26 12:59:59', '0000-00-00 00:00:00'),
(4, 'User First', 'user', 'user@gmail.com', '$2y$10$qxKrnliLq560V0ZEwAun4.Xh0ltmB1HKDFbX533dl01sQ66Hkv17e', 'X4tklxgrEld1bu6l3cNvqmYpzXlI5dpiLqhYZDjDwdSmwELM1BVVOGtyz9mn', '2016-01-26 07:29:53', '', 'Simple', 'Active', '2016-01-26', '0000-00-00', 200, 'Class', 'test', 'Ahmedabad', 'class@gmail.com', '', '65436534', 'Dinesh', '', 'lmjqynjg3in0', 'lmjqynjg3in0', '', 'Transactional', 'db_lmjqynjg3in0', 'localhost', 'root', '', '2016-01-26 12:59:53', '2016-01-26 13:17:14', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_attendances`
--

CREATE TABLE IF NOT EXISTS `tbl_attendances` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) NOT NULL,
  `i_student_id` int(11) NOT NULL,
  `i_batch_id` int(11) NOT NULL,
  `i_template_id` int(11) NOT NULL,
  `e_status` enum('Absent','Present') NOT NULL DEFAULT 'Absent',
  `e_send_message` enum('Yes','No') NOT NULL DEFAULT 'No',
  `d_date` date NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_batches`
--

CREATE TABLE IF NOT EXISTS `tbl_batches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) NOT NULL,
  `v_batch_title` varchar(100) NOT NULL,
  `e_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_exams`
--

CREATE TABLE IF NOT EXISTS `tbl_exams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) NOT NULL,
  `i_batch_id` int(11) NOT NULL,
  `i_subject_id` int(11) NOT NULL,
  `v_title` varchar(100) NOT NULL,
  `i_total_marks` smallint(6) NOT NULL,
  `d_date` datetime NOT NULL,
  `e_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_fees`
--

CREATE TABLE IF NOT EXISTS `tbl_fees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) NOT NULL,
  `i_batch_id` int(11) NOT NULL,
  `i_student_id` int(11) NOT NULL,
  `f_price` int(11) NOT NULL,
  `d_due_date` date NOT NULL,
  `d_paid_date` date NOT NULL,
  `e_send_message` enum('Yes','No') NOT NULL DEFAULT 'No',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_marks`
--

CREATE TABLE IF NOT EXISTS `tbl_marks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) NOT NULL,
  `i_subject_id` int(11) NOT NULL,
  `i_batch_id` int(11) NOT NULL,
  `i_template_id` int(11) NOT NULL,
  `i_student_id` int(11) NOT NULL,
  `i_mark_obtained` smallint(6) NOT NULL,
  `e_send_message` enum('Yes','No') NOT NULL,
  `e_status` enum('Absent','Present') NOT NULL DEFAULT 'Absent',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_news`
--

CREATE TABLE IF NOT EXISTS `tbl_news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) NOT NULL,
  `i_student_id` int(11) NOT NULL,
  `i_batch_id` int(11) NOT NULL,
  `i_template_id` int(11) NOT NULL,
  `v_template` varchar(256) DEFAULT NULL,
  `e_send_message` enum('Yes','No') NOT NULL DEFAULT 'No',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_schools`
--

CREATE TABLE IF NOT EXISTS `tbl_schools` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) NOT NULL,
  `v_title` varchar(500) NOT NULL,
  `e_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_section_permissions`
--

CREATE TABLE IF NOT EXISTS `tbl_section_permissions` (
  `id` int(11) NOT NULL,
  `i_user_id` int(11) NOT NULL,
  `v_permission` int(11) NOT NULL,
  `created_at` int(11) NOT NULL,
  `updated_at` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sms_logs`
--

CREATE TABLE IF NOT EXISTS `tbl_sms_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) NOT NULL,
  `i_student_id` int(11) NOT NULL,
  `v_phone_number` varchar(20) NOT NULL,
  `v_message` text NOT NULL,
  `i_message_sent` enum('Yes','No') NOT NULL DEFAULT 'Yes',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sms_permissions`
--

CREATE TABLE IF NOT EXISTS `tbl_sms_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) NOT NULL,
  `v_permission` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_students`
--

CREATE TABLE IF NOT EXISTS `tbl_students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) NOT NULL,
  `v_first_name` varchar(100) NOT NULL,
  `v_last_name` varchar(100) NOT NULL,
  `v_email` varchar(100) NOT NULL,
  `i_school_id` int(11) NOT NULL,
  `i_batch_id` int(11) NOT NULL,
  `v_parent_name` varchar(100) NOT NULL,
  `v_mobile_number` varchar(20) NOT NULL,
  `v_nick_name` varchar(100) NOT NULL,
  `v_address` varchar(500) NOT NULL,
  `e_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_subjects`
--

CREATE TABLE IF NOT EXISTS `tbl_subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) NOT NULL,
  `v_subject_name` varchar(100) NOT NULL,
  `e_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_templates`
--

CREATE TABLE IF NOT EXISTS `tbl_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `i_user_id` int(11) NOT NULL,
  `v_template_title` varchar(255) NOT NULL,
  `v_template_content` text NOT NULL,
  `e_type` enum('Mark','Attendence','Fee','Other') NOT NULL DEFAULT 'Other',
  `e_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `tbl_templates`
--

INSERT INTO `tbl_templates` (`id`, `i_user_id`, `v_template_title`, `v_template_content`, `e_type`, `e_status`, `created_at`, `updated_at`) VALUES
(1, 0, 'Forgot Password', '<table style="background: #fff; box-shadow: 1px 2px 0 #E6EBF1; border-radius: 10px; width: 500px;" border="0" cellspacing="0" cellpadding="0" align="center">\r\n<tbody>\r\n<tr>\r\n<td style="padding: 30px;"><img title="SalesKick" src="[SITE_URL]public/images/logo-big.png" alt="SalesKick" width="189" height="34" /></td>\r\n</tr>\r\n<tr>\r\n<td style="color: #000000; font-size: 22px; padding: 0 0 20px 30px;">\r\n<h1 style="margin: 0; padding: 0; font-size: 22px; color: #000000;">Hi [USERNAME],</h1>\r\n<p style="font-size: 14px; color: #000000; line-height: 20px; font-weight: 400; margin: 0; padding: 0;">There was recently a request to change the password for your account on SalesKick</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style="padding: 0 30px 20px 30px;">\r\n<p style="font-size: 14px; color: #000000; line-height: 20px; font-weight: 400; margin: 0; padding: 0;">Please click here to generate a new password:</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style="padding-left: 30px;"><a style="cursor: pointer;" href="[LINK]"><img title="Go To TEST" src="[SITE_URL]/images/goto-link.png" alt="Go To Test" width="150" height="36" /></a></td>\r\n</tr>\r\n<tr>\r\n<td style="font-size: 18px; color: #000000; line-height: 20px; font-weight: bold; padding: 30px 30px 5px 30px;">\r\n<h2 style="margin: 0; padding: 0; font-size: 18px;">Have fun!</h2>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style="font-size: 14px; color: #000000; line-height: 20px; font-weight: 400; padding: 0 30px 20px 30px;">\r\n<p style="margin: 0; padding: 0; font-size: 14px; color: #000000;">- The SalesKick Team</p>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>', 'Other', 'Active', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE IF NOT EXISTS `tbl_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `v_name` varchar(100) NOT NULL,
  `v_username` varchar(100) NOT NULL,
  `v_email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `remember_token` varchar(100) NOT NULL,
  `d_recent_login` timestamp NOT NULL,
  `v_access_code` varchar(100) NOT NULL,
  `e_type` enum('Super','Simple') NOT NULL DEFAULT 'Simple',
  `e_status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `d_registration_date` date NOT NULL,
  `d_payment_due_date` date NOT NULL,
  `i_default_sms_count` int(11) NOT NULL,
  `v_company_name` varchar(100) NOT NULL,
  `v_company_alias` varchar(256) NOT NULL,
  `v_company_address` varchar(500) NOT NULL,
  `v_company_email` varchar(100) NOT NULL,
  `v_phone` varchar(256) NOT NULL,
  `v_regards_name` varchar(100) NOT NULL,
  `v_company_logo` varchar(100) NOT NULL,
  `v_auth_key` varchar(100) NOT NULL,
  `v_encryption_id` varchar(256) NOT NULL,
  `v_sender_id` varchar(100) NOT NULL,
  `e_messages_type` enum('Transactional','Promotional') NOT NULL DEFAULT 'Promotional',
  `v_db_name` varchar(256) NOT NULL,
  `v_db_host` varchar(256) NOT NULL,
  `v_db_user` varchar(256) NOT NULL,
  `v_db_password` varchar(256) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

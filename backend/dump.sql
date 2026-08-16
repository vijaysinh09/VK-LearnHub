-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: course_management
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(60) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `duration` varchar(60) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `instructor_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `instructor_id` (`instructor_id`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'React Basics','Introduction to React fundamentals','4 weeks',3000.00,1,'2026-08-03 13:10:38','2026-08-03 13:10:38'),(2,'Node.js Essentials','Learn backend development with Node.js','6 weeks',2500.00,1,'2026-08-03 13:10:38','2026-08-03 13:10:38'),(3,'MySQL Mastery','Database design and SQL queries','5 weeks',1800.00,1,'2026-08-03 13:10:38','2026-08-03 13:10:38'),(4,'Full Stack Development','React + Node.js + MySQL integration','8 weeks',5000.00,1,'2026-08-03 13:10:38','2026-08-03 13:10:38'),(6,'Python Basics','Learn Python from Scratch','6 weeks',3000.00,2,'2026-08-05 11:11:07','2026-08-05 11:11:07'),(7,'Django Web Development','Build web apps using Django framework','6 weeks',3000.00,2,'2026-08-05 11:11:07','2026-08-05 11:11:07'),(8,'Data Structures using Python','Core DSA concepts implemented in Python','5 weeks',2800.00,2,'2026-08-05 11:11:07','2026-08-05 11:11:07'),(9,'REST API Development','Design and build REST APIs with authentication','4 weeks',2600.00,2,'2026-08-05 11:11:07','2026-08-05 11:11:07'),(10,'mysql journey','this is database related course','4 weeks',3000.00,1,'2026-08-05 12:26:05','2026-08-05 12:26:05'),(12,'angular js','this is best for it industry','2 weeks',1500.00,1,'2026-08-13 14:23:47','2026-08-13 14:23:47'),(13,'Advanced React Patterns','Learn advanced React hooks, context, and performance optimization.','10 Hours',2999.00,1,'2026-08-13 16:21:25','2026-08-13 16:21:25'),(14,'Node.js Microservices','Build scalable microservices using Node.js and Docker.','15 Hours',3499.00,1,'2026-08-13 16:21:25','2026-08-13 16:21:25'),(15,'UI/UX Design Masterclass','Master Figma and design principles for modern web apps.','12 Hours',1999.00,1,'2026-08-13 16:21:25','2026-08-13 16:21:25'),(16,'Python Data Science','Data analysis and machine learning with Python, Pandas, and Scikit-Learn.','20 Hours',4999.00,1,'2026-08-13 16:21:25','2026-08-13 16:21:25'),(17,'DevOps for Beginners','Introduction to CI/CD, AWS, and Linux administration.','8 Hours',1499.00,1,'2026-08-13 16:21:25','2026-08-13 16:21:25'),(18,'Cybersecurity Fundamentals','Learn ethical hacking and secure coding practices.','18 Hours',3999.00,1,'2026-08-13 16:21:25','2026-08-13 16:21:25'),(19,'Fullstack Next.js','Build production-ready SSR apps with Next.js 14.','14 Hours',3299.00,1,'2026-08-13 16:21:25','2026-08-13 16:21:25'),(20,'Mastering SQL','Deep dive into complex queries, joins, and database optimization.','9 Hours',1299.00,1,'2026-08-13 16:21:25','2026-08-13 16:21:25'),(21,'Advanced React Patterns','Learn advanced React hooks, context, and performance optimization.','10 Hours',2999.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(22,'Node.js Microservices','Build scalable microservices using Node.js and Docker.','15 Hours',3499.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(23,'UI/UX Design Masterclass','Master Figma and design principles for modern web apps.','12 Hours',1999.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(24,'Python Data Science','Data analysis and machine learning with Python, Pandas, and Scikit-Learn.','20 Hours',4999.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(25,'DevOps for Beginners','Introduction to CI/CD, AWS, and Linux administration.','8 Hours',1499.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(26,'Cybersecurity Fundamentals','Learn ethical hacking and secure coding practices.','18 Hours',3999.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(27,'Fullstack Next.js','Build production-ready SSR apps with Next.js 14.','14 Hours',3299.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(28,'Mastering SQL','Deep dive into complex queries, joins, and database optimization.','9 Hours',1299.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(29,'AWS Cloud Architect','Prepare for AWS Solutions Architect certification.','30 Hours',5999.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(30,'Angular Pro','Build enterprise applications using Angular and RxJS.','16 Hours',2899.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(31,'SvelteKit Fast Track','Learn SvelteKit to build high-performance web applications.','7 Hours',1199.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(32,'Docker & Kubernetes','Containerize apps and manage them with Kubernetes.','12 Hours',2499.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(33,'Ethical Hacking 101','Learn penetration testing basics and network security.','14 Hours',3199.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(34,'Machine Learning with TF','TensorFlow basics, neural networks, and deep learning.','25 Hours',5599.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(35,'Java Spring Boot','Backend development with Java and Spring Boot framework.','18 Hours',3799.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(36,'C++ for Game Dev','Master C++ for Unreal Engine game development.','22 Hours',4299.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(37,'Blockchain Basics','Understand smart contracts, Ethereum, and Solidity.','10 Hours',1899.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(38,'Rust Programming','Learn Rust for systems programming and memory safety.','12 Hours',2199.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(39,'Mobile Dev with Flutter','Cross-platform mobile apps with Flutter and Dart.','15 Hours',2999.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26'),(40,'Vue 3 Mastery','Learn Composition API, Vue Router, and Pinia.','11 Hours',1799.00,1,'2026-08-13 16:26:26','2026-08-13 16:26:26');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_enrollment` (`student_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES (1,4,1,'2026-08-07 09:40:25','active'),(3,4,4,'2026-08-07 09:52:32','active'),(6,11,1,'2026-08-09 14:17:30','active'),(7,10,1,'2026-08-09 14:57:18','active'),(8,5,2,'2026-08-10 13:44:35','active'),(10,6,1,'2026-08-13 03:56:02','completed'),(11,6,2,'2026-08-13 09:08:39','active'),(12,6,3,'2026-08-13 10:39:51','completed'),(13,21,1,'2026-08-13 11:08:42','active'),(14,21,9,'2026-08-13 11:09:33','active'),(15,22,2,'2026-08-13 16:43:54','completed'),(16,22,1,'2026-08-13 16:48:01','completed'),(17,22,9,'2026-08-13 16:53:22','active'),(18,6,9,'2026-08-15 16:25:01','active'),(19,6,4,'2026-08-15 16:53:23','active'),(20,6,10,'2026-08-15 16:59:23','active'),(21,6,6,'2026-08-15 17:07:58','active');
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `role` enum('student','instructor') DEFAULT 'student',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Vijaysinh Kamble','kamblevijaysinh09@gmail.com','$2b$10$2kJ0mVmne5ID4ZngzuuLqeqflGkQPcj7J.khOQgcaPQYtHuNlmbPS','instructor','2026-08-03 12:57:04','2026-08-03 12:57:04'),(2,'omkar kamble','omkamble@gmail.com','$2b$10$EnO2btRnpZ/RPp78bG2rQe4QiqgI0/eH/sANEm.JJKW9yj884Z4z2','student','2026-08-03 13:16:08','2026-08-03 13:16:08'),(3,'amit deshmukh','amit@gmail.com','$2b$10$ppNs0ADKZYA6HZIPfuaoFeBhlDJ0I7yQHjsC6zcdoXOtEdNIOsBVO','student','2026-08-05 12:21:47','2026-08-05 12:21:47'),(4,'Rohan Salukhe','rohan@gmail.com','$2b$10$XmQZ9WzqlUmqqsiOmtT8UuytfqgpUQwlT1YP1m/3zJEv2fZbZzyqm','student','2026-08-07 14:45:14','2026-08-07 14:45:14'),(5,'Rahul Patil','rahul@gmail.com','$2b$10$b2OGez2bNQo.t2acUXZu9exaS4PA.Dmlx1/LnGwk0TUhbILjJfmVe','student','2026-08-08 09:54:53','2026-08-08 09:54:53'),(6,'Omkar','sagarskamble1414@gmail.com','$2b$10$.NwcXG335XuVKNjyBUwvQ.F6CLkXyEtjMOPHdLh24pBmX15eWSINm','student','2026-08-08 18:47:06','2026-08-08 18:47:06'),(9,'omiiii','omii@gmail.com','$2b$10$AAU0hmP/Pa01TYTP3Rw2QOgS0BnCz1vTQWcGRoGVojVSlBSIbCRpy','student','2026-08-09 14:51:20','2026-08-09 14:51:20'),(10,'rohan patil','rohan22@gmail.com','$2b$10$PfBFOzTRouvbTJZSGgNxn.f.rZnI6g6wh.E2NeWviRAVmS348BWzS','student','2026-08-09 15:55:59','2026-08-09 15:55:59'),(11,'amar mohite','amar@gmail.com','$2b$10$9OGHIR323Wf2fB1JRoWWs.9dFF5EiKvpymyaTVIGooezG2taZyUtm','student','2026-08-09 19:46:22','2026-08-09 19:46:22'),(12,'rajvardhan more','raj@gmail.com','$2b$10$iVfeNarHULEC7HG/AtDl2uWkuah6lw/SKE7WAbPR82d0vUwldQZYK','student','2026-08-10 18:09:17','2026-08-10 18:09:17'),(13,'sagar patil','sagar@gmail.com','$2b$10$O7R44G.uQ0CTTFWvAlZCh.AtEeqEGfKMcSJ2h3TrAyDehGDIAHjRe','student','2026-08-10 19:10:23','2026-08-10 19:10:23'),(14,'Rohit Sharma','hitman@gmail.com','$2b$10$9As9yfJUnIfMaVDaGIzXQuaCyFfZnOgo6m09zzZ/Yk0g92L.zyYqe','student','2026-08-10 21:49:41','2026-08-10 21:49:41'),(15,'gautam gambhir','gg@gmail.com','$2b$10$mfpZ9.ogPc5LgUrEvrnBJezUV/zhPwPIPMaUY0FIDR4Ca/tiX5QTK','student','2026-08-12 14:56:28','2026-08-12 14:56:28'),(16,'Rohan Kamble','pskamble3075@gmail.com','$2b$10$ZD1UMK4aYLq3BMRdnsdBv.V9nL5O1Cv/tD6dq5V7I1g97Nx1mwXDW','student','2026-08-12 17:55:21','2026-08-12 17:55:21'),(17,'prathmesh patil','sarpanch@gmail.com','$2b$10$okvCVYVFVMU1PeEJ7hyjDuVZWnVlmw4sQPaY576nwLVym8kLHJbSm','student','2026-08-12 18:36:39','2026-08-12 18:36:39'),(20,'omkar','omkarskamble@gmail.com','$2b$10$rdVqaQVlJ9XNaTyEhagg9.BEKJmT0ZdE9kCJU1G.ZCcZaSejkNJ1W','student','2026-08-13 13:53:04','2026-08-13 13:53:04'),(21,'ratan tata','ratan@gmail.com','$2b$10$23Yjtn..Jsc7oaGOhkoQseFHyeHSDEt0Rrer6jDLVp6UYIMPGik0W','student','2026-08-13 16:37:45','2026-08-13 16:37:45'),(22,'viraj powar','kvijaysinh83.65@gmail.com','$2b$10$9PRzS0SljJPNES9jWVE6Uew6VK.PDVRDsVBfSqQZm5qrWcrlC3JpW','student','2026-08-13 22:12:40','2026-08-13 22:12:40');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-16  0:04:58

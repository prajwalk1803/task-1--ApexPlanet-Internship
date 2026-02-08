<?php
// Database Configuration (XAMPP default)
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "apexportfolio_task1";

$conn = mysqli_connect($host, $user, $pass, $dbname);

if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}
?>
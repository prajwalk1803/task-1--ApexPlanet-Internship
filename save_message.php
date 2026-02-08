<?php
header("Content-Type: application/json");

require("config.php");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "error" => "Only POST method allowed"]);
    exit;
}

$name = mysqli_real_escape_string($conn, $_POST["name"] ?? "");
$email = mysqli_real_escape_string($conn, $_POST["email"] ?? "");
$category = mysqli_real_escape_string($conn, $_POST["category"] ?? "General");
$contact_method = mysqli_real_escape_string($conn, $_POST["contact_method"] ?? "Email");
$message = mysqli_real_escape_string($conn, $_POST["message"] ?? "");

$services = "";
if (isset($_POST["services"])) {
    $services = implode(", ", $_POST["services"]);
    $services = mysqli_real_escape_string($conn, $services);
}

if ($name == "" || $email == "" || $message == "") {
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit;
}

$sql = "INSERT INTO messages (name, email, category, contact_method, services, message)
        VALUES ('$name', '$email', '$category', '$contact_method', '$services', '$message')";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["success" => true, "message" => "Message saved"]);
} else {
    echo json_encode(["success" => false, "error" => mysqli_error($conn)]);
}
?>
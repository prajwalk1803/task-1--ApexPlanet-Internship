<?php
header("Content-Type: application/json");
require("config.php");

$result = mysqli_query($conn, "SELECT * FROM messages ORDER BY id DESC");

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode(["success" => true, "messages" => $data]);
?>
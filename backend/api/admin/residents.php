<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$query = "SELECT id, full_name, email, phone, ward, status, created_at 
          FROM users 
          WHERE role = 'resident' 
          ORDER BY created_at DESC";
$stmt = $db->prepare($query);
$stmt->execute();

$residents_arr = array();
$residents_arr["residents"] = array();

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $resident_item = array(
        "id" => $row['id'],
        "full_name" => $row['full_name'],
        "email" => $row['email'],
        "phone" => $row['phone'],
        "ward" => $row['ward'],
        "status" => $row['status'],
        "created_at" => $row['created_at']
    );
    array_push($residents_arr["residents"], $resident_item);
}

http_response_code(200);
echo json_encode($residents_arr);
?>
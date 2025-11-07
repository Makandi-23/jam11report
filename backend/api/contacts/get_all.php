<?php
function handleCors() {
    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        http_response_code(200);
        exit(0);
    }
    
    // Set CORS headers for actual requests
    header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
}
handleCors();

include_once '../../config/database.php';
include_once '../../models/Contact.php';

$database = new Database();
$db = $database->getConnection();

$contact = new Contact($db);

$stmt = $contact->getAll();
$num = $stmt->rowCount();

if($num > 0) {
    $contacts_arr = array();
    $contacts_arr["contacts"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $contact_item = array(
            "id" => $row['id'],
            "full_name" => $row['full_name'],
            "email" => $row['email'],
            "phone" => $row['phone'],
            "ward" => $row['ward'],
            "subject" => $row['subject'],
            "message" => $row['message'],
            "status" => $row['status'],
            "admin_notes" => $row['admin_notes'],
            "created_at" => $row['created_at'],
            "user_full_name" => $row['user_full_name']
        );
        array_push($contacts_arr["contacts"], $contact_item);
    }

    http_response_code(200);
    echo json_encode($contacts_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No contacts found."));
}
?>
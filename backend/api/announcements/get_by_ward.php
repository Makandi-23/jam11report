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
include_once '../../models/Announcement.php';

$database = new Database();
$db = $database->getConnection();

$announcement = new Announcement($db);

$ward = isset($_GET['ward']) ? $_GET['ward'] : 'all';

$stmt = $announcement->getByWard($ward);
$num = $stmt->rowCount();

if($num > 0) {
    $announcements_arr = array();
    $announcements_arr["announcements"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $announcement_item = array(
            "id" => $row['id'],
            "title_en" => $row['title_en'],
            "title_sw" => $row['title_sw'],
            "message_en" => $row['message_en'],
            "message_sw" => $row['message_sw'],
            "category" => $row['category'],
            "priority" => $row['priority'],
            "target_ward" => $row['target_ward'],
            "expires_at" => $row['expires_at'],
            "admin_name" => $row['admin_name'],
            "created_at" => $row['created_at']
        );
        array_push($announcements_arr["announcements"], $announcement_item);
    }

    http_response_code(200);
    echo json_encode($announcements_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No announcements found."));
}
?>
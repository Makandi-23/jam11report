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
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
}
handleCors();

include_once '../../config/database.php';
include_once '../../models/Announcement.php';

$database = new Database();
$db = $database->getConnection();

$announcement = new Announcement($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->admin_id) && !empty($data->title_en) && !empty($data->message_en)) {
    $announcement->admin_id = $data->admin_id;
    $announcement->title_en = $data->title_en;
    $announcement->title_sw = $data->title_sw ?? '';
    $announcement->message_en = $data->message_en;
    $announcement->message_sw = $data->message_sw ?? '';
    $announcement->category = $data->category ?? 'information';
    $announcement->priority = $data->priority ?? 'normal';
    $announcement->target_ward = $data->target_ward ?? 'all';
    $announcement->expires_at = $data->expires_at ?? null;

    if($announcement->create()) {
        http_response_code(201);
        echo json_encode(array(
            "message" => "Announcement was created successfully.",
            "announcement_id" => $announcement->id
        ));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create announcement."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create announcement. Data is incomplete."));
}
?>
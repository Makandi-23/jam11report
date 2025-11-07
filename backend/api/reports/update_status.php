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
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
}
handleCors();

include_once '../../config/database.php';
include_once '../../models/Report.php';

$database = new Database();
$db = $database->getConnection();

$report = new Report($db);

$data = json_decode(file_get_contents("php://input"));
$allowed_statuses = ['pending', 'in_progress', 'assigned', 'awaiting_verification', 'resolved'];

if(
    !empty($data->id) &&
    !empty($data->status) &&
    in_array($data->status, $allowed_statuses)
) {
    $report->id = $data->id;
    $report->status = $data->status;
    $report->is_urgent = $data->is_urgent ?? false;

    if($report->updateStatus()) {
        http_response_code(200);
        echo json_encode(array("message" => "Report status updated successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update report status."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to update report. Data is incomplete."));
}
?>
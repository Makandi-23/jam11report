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
include_once '../../models/Report.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();

$report = new Report($db);

$user = new User($db);
$user->id = $data->user_id;

if($user->emailExists()) {
    if($user->status !== 'verified') {
        http_response_code(403);
        echo json_encode(array(
            "success" => false, 
            "message" => "Your account is suspended. You cannot submit reports."
        ));
        exit();
    }
}

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->user_id) &&
    !empty($data->title) &&
    !empty($data->description) &&
    !empty($data->category) &&
    !empty($data->ward)
) {
    $report->user_id = $data->user_id;
    $report->title = $data->title;
    $report->description = $data->description;
    $report->category = $data->category;
    $report->ward = $data->ward;
    $report->location_details = $data->location_details ?? '';
    $report->image_path = $data->image_path ?? '';

    if($report->create()) {
        http_response_code(201);
        echo json_encode(array(
            "message" => "Report was created successfully.",
            "report_id" => $report->id
        ));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create report."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create report. Data is incomplete."));
}
?>
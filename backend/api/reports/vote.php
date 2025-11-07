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

$data = json_decode(file_get_contents("php://input"));

$user = new User($db);
$user->id = $data->user_id;

if($user->emailExists()) {
    if($user->status !== 'verified') {
        http_response_code(403);
        echo json_encode(array(
            "success" => false, 
            "message" => "Your account is suspended. You cannot vote on reports."
        ));
        exit();
    }
}

if(!empty($data->user_id) && !empty($data->report_id)) {
    if($report->addVote($data->user_id, $data->report_id)) {
        http_response_code(200);
        echo json_encode(array("message" => "Vote added successfully."));
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to add vote. You may have already voted for this report."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to add vote. Data is incomplete."));
}
?>
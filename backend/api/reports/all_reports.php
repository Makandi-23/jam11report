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
include_once '../../models/Report.php';

$database = new Database();
$db = $database->getConnection();

$report = new Report($db);

$stmt = $report->getAll();
$num = $stmt->rowCount();

if($num > 0) {
    $reports_arr = array();
    $reports_arr["reports"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $report_item = array(
            "id" => $row['id'],
            "title" => $row['title'],
            "description" => $row['description'],
            "category" => $row['category'],
            "ward" => $row['ward'],
            "status" => $row['status'],
            "is_urgent" => $row['is_urgent'],
            "vote_count" => $row['vote_count'],
            "reporter_name" => $row['full_name'],
            "created_at" => $row['created_at']
        );
        array_push($reports_arr["reports"], $report_item);
    }

    http_response_code(200);
    echo json_encode($reports_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No reports found."));
}
?>
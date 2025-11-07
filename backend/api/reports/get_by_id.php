<?php
function handleCors() {
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        http_response_code(200);
        exit(0);
    }
    
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
}
handleCors();

include_once '../../config/database.php';
include_once '../../models/Report.php';

$database = new Database();
$db = $database->getConnection();

$report = new Report($db);

$report_id = isset($_GET['id']) ? $_GET['id'] : die();

$query = "SELECT r.*, u.full_name 
          FROM reports r 
          LEFT JOIN users u ON r.user_id = u.id 
          WHERE r.id = ?";
$stmt = $db->prepare($query);
$stmt->bindParam(1, $report_id);
$stmt->execute();

if($stmt->rowCount() > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $report_item = array(
        "id" => $row['id'],
        "title" => $row['title'],
        "description" => $row['description'],
        "category" => $row['category'],
        "ward" => $row['ward'],
        "location_details" => $row['location_details'],
        "status" => strtolower($row['status']), // Convert to match your frontend
        "is_urgent" => (bool)$row['is_urgent'],
        "vote_count" => $row['vote_count'],
        "reporter_name" => $row['full_name'],
        "created_at" => $row['created_at']
    );

    http_response_code(200);
    echo json_encode($report_item);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Report not found."));
}
?>
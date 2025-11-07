<?php
function handleCors() {
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        http_response_code(200);
        exit(0);
    }
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
}
handleCors();

include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

// Get all residents
$stmt = $user->getAllResidents();
$num = $stmt->rowCount();

if($num > 0) {
    $residents_arr = array();
    $residents_arr["residents"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Get user stats
        $reports_stmt = $db->prepare("SELECT COUNT(*) as reports_count FROM reports WHERE user_id = ?");
        $reports_stmt->execute([$row['id']]);
        $reports_count = $reports_stmt->fetch(PDO::FETCH_ASSOC)['reports_count'];
        
        $votes_stmt = $db->prepare("SELECT COUNT(*) as votes_count FROM report_votes WHERE user_id = ?");
        $votes_stmt->execute([$row['id']]);
        $votes_count = $votes_stmt->fetch(PDO::FETCH_ASSOC)['votes_count'];
        
        $resolved_stmt = $db->prepare("SELECT COUNT(*) as resolved_count FROM reports WHERE user_id = ? AND status = 'resolved'");
        $resolved_stmt->execute([$row['id']]);
        $resolved_count = $resolved_stmt->fetch(PDO::FETCH_ASSOC)['resolved_count'];
        
        // Calculate engagement score (simplified)
        $engagement_score = min(100, ($reports_count * 5) + ($votes_count * 2) + ($resolved_count * 10));

        $resident_item = array(
            "id" => $row['id'],
            "full_name" => $row['full_name'],
            "email" => $row['email'],
            "phone" => $row['phone'],
            "ward" => $row['ward'],
            "status" => $row['status'],
            "created_at" => $row['created_at'],
            "reports_submitted" => $reports_count,
            "votes_cast" => $votes_count,
            "engagement_score" => $engagement_score
        );
        array_push($residents_arr["residents"], $resident_item);
    }

    http_response_code(200);
    echo json_encode($residents_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No residents found."));
}
?>
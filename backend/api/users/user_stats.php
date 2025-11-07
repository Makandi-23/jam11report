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
include_once '../../models/Report.php';

$database = new Database();
$db = $database->getConnection();

$report = new Report($db);

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();

// Get user's reports
$reports_stmt = $report->getByUserId($user_id);
$total_reports = $reports_stmt->rowCount();

// Count resolved reports
$resolved_reports = 0;
while ($row = $reports_stmt->fetch(PDO::FETCH_ASSOC)) {
    if($row['status'] == 'resolved') $resolved_reports++;
}

// Get user's vote count
$votes_stmt = $db->prepare("SELECT COUNT(*) as vote_count FROM report_votes WHERE user_id = ?");
$votes_stmt->execute([$user_id]);
$vote_count = $votes_stmt->fetch(PDO::FETCH_ASSOC)['vote_count'];

$stats = array(
    "success" => true,
    "reports_submitted" => $total_reports,
    "votes_cast" => $vote_count,
    "issues_resolved" => $resolved_reports
);

http_response_code(200);
echo json_encode($stats);
?>
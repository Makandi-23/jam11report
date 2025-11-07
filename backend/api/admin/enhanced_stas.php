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

// Get current date and date 7 days ago
$currentDate = new DateTime();
$sevenDaysAgo = new DateTime();
$sevenDaysAgo->modify('-7 days');

// Get total reports count
$total_reports = $report->getCount();

// Get reports from last 7 days
$reports_last_7_days = $report->getReportsByDateRange($sevenDaysAgo->format('Y-m-d H:i:s'), $currentDate->format('Y-m-d H:i:s'));

// Get reports from previous 7 days (for comparison)
$fourteenDaysAgo = new DateTime();
$fourteenDaysAgo->modify('-14 days');
$reports_previous_7_days = $report->getReportsByDateRange($fourteenDaysAgo->format('Y-m-d H:i:s'), $sevenDaysAgo->format('Y-m-d H:i:s'));

// Calculate new reports count and change percentage
$new_reports_count = $reports_last_7_days->rowCount();
$previous_reports_count = $reports_previous_7_days->rowCount();

$new_reports_change = 0;
if ($previous_reports_count > 0) {
    $new_reports_change = (($new_reports_count - $previous_reports_count) / $previous_reports_count) * 100;
}

// Get status counts
$pending_reports = $report->getCountByStatus('pending');
$in_progress_reports = $report->getCountByStatus('in_progress');
$resolved_reports = $report->getCountByStatus('resolved');

$active_reports = $pending_reports + $in_progress_reports;

// Get urgent reports
$urgent_reports = $report->getCountByUrgent(true);

// Prepare response
$stats = array(
    "total_reports" => $total_reports,
    "active_reports" => $active_reports,
    "resolved_reports" => $resolved_reports,
    "new_reports_7d" => $new_reports_count,
    "urgent_reports" => $urgent_reports,
    "new_reports_change" => round($new_reports_change, 1),
    "pending_reports" => $pending_reports,
    "in_progress_reports" => $in_progress_reports
);

http_response_code(200);
echo json_encode($stats);
?>
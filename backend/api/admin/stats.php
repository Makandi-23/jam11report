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
include_once '../../models/Contact.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();

// Get report stats
$report = new Report($db);
$reports_stmt = $report->getAll();
$total_reports = $reports_stmt->rowCount();

$pending_reports = 0;
$urgent_reports = 0;
while ($row = $reports_stmt->fetch(PDO::FETCH_ASSOC)) {
    if($row['status'] == 'pending') $pending_reports++;
    if($row['is_urgent']) $urgent_reports++;
}

// Get contact stats
$contact = new Contact($db);
$contact_stats = $contact->getStats();

// Get user stats
$user = new User($db);
$users_stmt = $db->query("SELECT COUNT(*) as total_users FROM users WHERE role = 'resident'");
$total_users = $users_stmt->fetch(PDO::FETCH_ASSOC)['total_users'];

$stats = array(
    "total_reports" => $total_reports,
    "pending_reports" => $pending_reports,
    "urgent_reports" => $urgent_reports,
    "total_residents" => $total_users,
    "new_contacts" => $contact_stats['new_count'],
    "total_contacts" => $contact_stats['total']
);

http_response_code(200);
echo json_encode($stats);
?>
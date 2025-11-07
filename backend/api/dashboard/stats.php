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
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();

$report = new Report($db);
$user = new User($db);

// Get total reports count
$total_reports_query = "SELECT COUNT(*) as total FROM reports";
$total_reports_stmt = $db->prepare($total_reports_query);
$total_reports_stmt->execute();
$total_reports = $total_reports_stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Get pending reports count
$pending_reports_query = "SELECT COUNT(*) as pending FROM reports WHERE status = 'Pending'";
$pending_reports_stmt = $db->prepare($pending_reports_query);
$pending_reports_stmt->execute();
$pending_reports = $pending_reports_stmt->fetch(PDO::FETCH_ASSOC)['pending'];

// Get resolved reports count
$resolved_reports_query = "SELECT COUNT(*) as resolved FROM reports WHERE status = 'resolved'";
$resolved_reports_stmt = $db->prepare($resolved_reports_query);
$resolved_reports_stmt->execute();
$resolved_reports = $resolved_reports_stmt->fetch(PDO::FETCH_ASSOC)['resolved'];

// Get total users count
$total_users_query = "SELECT COUNT(*) as total FROM users";
$total_users_stmt = $db->prepare($total_users_query);
$total_users_stmt->execute();
$total_users = $total_users_stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Get recent reports (last 5)
$recent_reports_query = "SELECT r.*, u.full_name 
                         FROM reports r 
                         LEFT JOIN users u ON r.user_id = u.id 
                         ORDER BY r.created_at DESC 
                         LIMIT 5";
$recent_reports_stmt = $db->prepare($recent_reports_query);
$recent_reports_stmt->execute();
$recent_reports = $recent_reports_stmt->fetchAll(PDO::FETCH_ASSOC);

// Prepare response
$dashboard_data = array(
    "totalReports" => (int)$total_reports,
    "pendingReports" => (int)$pending_reports,
    "resolvedReports" => (int)$resolved_reports,
    "totalUsers" => (int)$total_users,
    "recentReports" => $recent_reports
);

http_response_code(200);
echo json_encode($dashboard_data);
?>
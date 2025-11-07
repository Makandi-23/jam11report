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

// Get date range from query params (default: last 30 days)
$days = isset($_GET['days']) ? (int)$_GET['days'] : 30;
$start_date = date('Y-m-d', strtotime("-$days days"));

$query = "SELECT DATE(created_at) as date, COUNT(*) as count 
          FROM reports 
          WHERE created_at >= :start_date 
          GROUP BY DATE(created_at) 
          ORDER BY date ASC";

$stmt = $db->prepare($query);
$stmt->bindParam(':start_date', $start_date);
$stmt->execute();

$reports_over_time = array();
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $reports_over_time[] = array(
        "date" => $row['date'],
        "count" => (int)$row['count']
    );
}

http_response_code(200);
echo json_encode($reports_over_time);
?>
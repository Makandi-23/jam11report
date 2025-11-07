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

$query = "SELECT category, COUNT(*) as count FROM reports GROUP BY category";
$stmt = $db->prepare($query);
$stmt->execute();

$categories = array();
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $categories[] = array(
        "category" => $row['category'],
        "count" => (int)$row['count']
    );
}

http_response_code(200);
echo json_encode($categories);
?>
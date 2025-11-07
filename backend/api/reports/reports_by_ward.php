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

$query = "SELECT ward, COUNT(*) as count FROM reports GROUP BY ward";
$stmt = $db->prepare($query);
$stmt->execute();

$wards = array();
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $wards[] = array(
        "ward" => $row['ward'],
        "count" => (int)$row['count']
    );
}

http_response_code(200);
echo json_encode($wards);
?>
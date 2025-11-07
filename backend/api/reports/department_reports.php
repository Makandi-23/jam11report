<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    http_response_code(200);
    exit(0);
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Get department from query parameter or request body
    $department = $_GET['department'] ?? null;
    
    if (!$department) {
        $data = json_decode(file_get_contents("php://input"));
        $department = $data->department ?? null;
    }
    
    if (!$department) {
        throw new Exception("Department parameter is required");
    }
    
    // Get reports assigned to this department
    $query = "SELECT r.*, 
                     u.full_name as reporter_name,
                     COUNT(rv.id) as vote_count
              FROM reports r
              LEFT JOIN users u ON r.user_id = u.id
              LEFT JOIN report_votes rv ON r.id = rv.report_id
              WHERE r.assigned_department = :department
              GROUP BY r.id
              ORDER BY r.created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':department', $department);
    $stmt->execute();
    
    $reports = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $reports[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'category' => $row['category'],
            'ward' => $row['ward'],
            'status' => $row['status'],
            'is_urgent' => (bool)$row['is_urgent'],
            'assigned_department' => $row['assigned_department'],
            'admin_notes' => $row['admin_notes'],
            'proof_image' => $row['proof_image'],
            'created_at' => $row['created_at'],
            'reporter_name' => $row['reporter_name'],
            'vote_count' => (int)$row['vote_count']
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "reports" => $reports,
        "count" => count($reports)
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
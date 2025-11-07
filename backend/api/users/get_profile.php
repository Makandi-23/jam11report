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

// Get user ID from query parameter or from session
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : (isset($_SESSION['user_id']) ? $_SESSION['user_id'] : die());

$user->id = $user_id;

// Get user profile
$stmt = $user->getProfile();
$num = $stmt->rowCount();

if($num > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $user_profile = array(
        'id' => $row['id'],
        'full_name' => $row['full_name'],
        'email' => $row['email'],
        'phone' => $row['phone'],
        'ward' => $row['ward'],
        'estate_street' => $row['estate_street'],
        'role' => $row['role'],
        'status' => $row['status'],
        'created_at' => $row['created_at']
    );
    
    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "user" => $user_profile
    ));
} else {
    http_response_code(404);
    echo json_encode(array("success" => false, "message" => "User not found"));
}
?>
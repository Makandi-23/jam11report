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
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
}
handleCors();
include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->full_name) &&
    !empty($data->email) &&
    !empty($data->password) &&
    !empty($data->phone) &&
    !empty($data->ward)
) {
    $user->full_name = $data->full_name;
    $user->email = $data->email;
    $user->password = $data->password;
    $user->phone = $data->phone;
    $user->ward = $data->ward;
    $user->estate_street = $data->estate_street ?? '';
    $user->proof_of_residence_path = $data->proof_of_residence_path ?? '';

    if($user->emailExists()) {
        http_response_code(400);
        echo json_encode(array("message" => "User already exists with this email."));
    } else {
        if($user->register()) {
            http_response_code(201);
            echo json_encode(array(
                "message" => "User was created successfully.",
                "user_id" => $user->id,
                "status" => "verified"
            ));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create user."));
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create user. Data is incomplete."));
}
?>
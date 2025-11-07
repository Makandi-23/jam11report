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

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id) && !empty($data->full_name) && !empty($data->email)) {
    $user->id = $data->id;
    $user->full_name = $data->full_name;
    $user->email = $data->email;
    $user->phone = $data->phone;
    $user->ward = $data->ward;
    $user->estate_street = $data->estate_street;

    if($user->updateProfile()) {
        http_response_code(200);
        echo json_encode(array("success" => true, "message" => "Profile updated successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("success" => false, "message" => "Unable to update profile."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Unable to update profile. Data is incomplete."));
}
?>
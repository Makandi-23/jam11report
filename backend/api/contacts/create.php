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
include_once '../../models/Contact.php';

$database = new Database();
$db = $database->getConnection();

$contact = new Contact($db);

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->full_name) &&
    !empty($data->email) &&
    !empty($data->ward) &&
    !empty($data->subject) &&
    !empty($data->message)
) {
    $contact->user_id = $data->user_id ?? null;
    $contact->full_name = $data->full_name;
    $contact->email = $data->email;
    $contact->phone = $data->phone ?? '';
    $contact->ward = $data->ward;
    $contact->subject = $data->subject;
    $contact->message = $data->message;

    if($contact->create()) {
        http_response_code(201);
        echo json_encode(array(
            "message" => "Your message has been sent successfully!",
            "contact_id" => $contact->id
        ));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to send message. Please try again."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to send message. Please fill in all required fields."));
}
?>
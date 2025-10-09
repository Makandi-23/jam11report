<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/Contact.php';

$database = new Database();
$db = $database->getConnection();

$contact = new Contact($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id) && !empty($data->status)) {
    $contact->id = $data->id;
    $contact->status = $data->status;
    $contact->admin_notes = $data->admin_notes ?? '';

    if($contact->updateStatus()) {
        http_response_code(200);
        echo json_encode(array("message" => "Contact status updated successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update contact status."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to update contact. Data is incomplete."));
}
?>
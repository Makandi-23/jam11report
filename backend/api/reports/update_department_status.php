<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    http_response_code(200);
    exit(0);
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id) && !empty($data->status)) {
    $allowed_statuses = ['in_progress', 'awaiting_verification'];
    
    if (!in_array($data->status, $allowed_statuses)) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid status for department admin."]);
        exit;
    }
    
    try {
        // Update report status
        $query = "UPDATE reports 
                  SET status = :status, 
                      updated_at = NOW()";
        
        // Add proof image if provided
        if (!empty($data->proof_image)) {
            $query .= ", proof_image = :proof_image";
        }
        
        // Add admin notes if provided
        if (!empty($data->admin_notes)) {
            $query .= ", admin_notes = :admin_notes";
        }
        
        $query .= " WHERE id = :id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':status', $data->status);
        $stmt->bindParam(':id', $data->id);
        
        if (!empty($data->proof_image)) {
            $stmt->bindParam(':proof_image', $data->proof_image);
        }
        
        if (!empty($data->admin_notes)) {
            $stmt->bindParam(':admin_notes', $data->admin_notes);
        }
        
        if($stmt->execute()) {
            http_response_code(200);
            echo json_encode([
                "message" => "Report status updated successfully.",
                "status" => $data->status
            ]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to update report status."]);
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Unable to update. Data is incomplete."]);
}
?>
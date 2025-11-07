<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    http_response_code(200);
    exit(0);
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    $user->email = $data->email;
    
    if($user->emailExists()) {
        error_log("User found: " . $user->email . ", Status: " . $user->status);
        
        // 🆕 Add department field for admin users if missing
        if ($user->role === 'admin' && empty($user->department)) {
            // Set default department for admin users
            $user->department = 'all'; // Default to super admin
            
            // Try to update the database - FIXED TABLE NAME
            try {
                $updateQuery = "UPDATE admins SET department = :department WHERE email = :email"; // 🆕 admins
                $stmt = $db->prepare($updateQuery);
                $stmt->bindParam(':department', $user->department);
                $stmt->bindParam(':email', $user->email);
                $stmt->execute();
                error_log("Updated department for admin: {$user->email} to {$user->department}");
            } catch (Exception $e) {
                error_log("Note: Could not update department - " . $e->getMessage());
            }
        }
        
        // Check if user is verified
        if($user->status == 'pending') {
            http_response_code(401);
            echo json_encode(array("message" => "Your account is pending verification."));
        } else if($user->status == 'suspended') {
            // ✅ ALLOW SUSPENDED USERS TO LOGIN (but with suspended status)
            if(password_verify($data->password, $user->password)) {
                http_response_code(200);
                echo json_encode(array(
                    "message" => "Login successful. Your account is suspended.",
                    "user" => array(
                        "id" => $user->id,
                        "full_name" => $user->full_name,
                        "email" => $user->email,
                        "role" => $user->role,
                        "department" => $user->department, 
                        "ward" => $user->ward,
                        "phone" => $user->phone,
                        "status" => $user->status,
                    )
                ));
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "Invalid password."));
            }
        } else if($user->status == 'verified') {
            // Verified users login normally
            if(password_verify($data->password, $user->password)) {
                http_response_code(200);
                echo json_encode(array(
                    "message" => "Login successful.",
                    "user" => array(
                        "id" => $user->id,
                        "full_name" => $user->full_name,
                        "email" => $user->email,
                        "role" => $user->role,
                        "department" => $user->department,
                        "ward" => $user->ward,
                        "phone" => $user->phone,
                        "status" => $user->status,
                    )
                ));
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "Invalid password."));
            }
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Your account status is invalid. Please contact admin."));
        }
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "User not found."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to login. Data is incomplete."));
}
?>
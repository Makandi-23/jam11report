<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $full_name;
    public $email;
    public $password;
    public $phone;
    public $ward;
    public $estate_street;
    public $proof_of_residence_path;
    public $role;
    public $status;
    public $created_at;
    public $department;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function register() {
        $query = "INSERT INTO " . $this->table_name . "
                SET full_name=:full_name, email=:email, password=:password, 
                phone=:phone, ward=:ward, estate_street=:estate_street, 
                proof_of_residence_path=:proof_of_residence_path,
                status='verified'"; 
        
        $stmt = $this->conn->prepare($query);

        // Hash password
        $this->password = password_hash($this->password, PASSWORD_DEFAULT);

        // Bind values
        $stmt->bindParam(":full_name", $this->full_name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":ward", $this->ward);
        $stmt->bindParam(":estate_street", $this->estate_street);
        $stmt->bindParam(":proof_of_residence_path", $this->proof_of_residence_path);

        if($stmt->execute()) {
             $this->id = $this->conn->lastInsertId();
        return true;
       
        }
        return false;
    }

    public function emailExists() {
        $query = "SELECT id, full_name, password, role, status, ward, phone, NULL as department
                FROM " . $this->table_name . "
                WHERE email = ?
                LIMIT 0,1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->full_name = $row['full_name'];
            $this->password = $row['password'];
            $this->role = $row['role'];
            $this->status = $row['status'];
             $this->ward = $row['ward'];      // ADD THIS LINE
        $this->phone = $row['phone'];
         $this->department = $row['department']; 
            return true;
        }

         $query = "SELECT id, full_name, password, role, 'verified' as status, 
                         ward, phone, department
                  FROM admins 
                  WHERE email = ?
                  LIMIT 0,1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->full_name = $row['full_name'];
            $this->password = $row['password'];
            $this->role = $row['role'];
            $this->status = $row['status'];
            $this->ward = $row['ward'];
            $this->phone = $row['phone'];
            $this->department = $row['department'];
            return true;
        }
        return false;
    }

    // ✅ ADD THE LOGIN METHOD RIGHT HERE ✅
    public function login($password) {
        if($this->emailExists()) {
            if(password_verify($password, $this->password)) {
                return true;
            }
        }
        return false;
    }

    // Add these methods to your existing User.php class

public function getProfile() {
    $query = "SELECT id, full_name, email, phone, ward, estate_street, role, status, created_at 
              FROM " . $this->table_name . " 
              WHERE id = ?";
    
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->id);
    $stmt->execute();
    
    return $stmt;
}

public function updateProfile() {
    $query = "UPDATE " . $this->table_name . "
              SET full_name = :full_name,
                  email = :email,
                  phone = :phone,
                  ward = :ward,
                  estate_street = :estate_street
              WHERE id = :id";
    
    $stmt = $this->conn->prepare($query);
    
    $stmt->bindParam(':full_name', $this->full_name);
    $stmt->bindParam(':email', $this->email);
    $stmt->bindParam(':phone', $this->phone);
    $stmt->bindParam(':ward', $this->ward);
    $stmt->bindParam(':estate_street', $this->estate_street);
    $stmt->bindParam(':id', $this->id);
    
    if($stmt->execute()) {
        return true;
    }
    return false;
}

// Method to get all residents for admin
public function getAllResidents() {
    $query = "SELECT id, full_name, email, phone, ward, status, created_at 
              FROM " . $this->table_name . " 
              WHERE role = 'resident' 
              ORDER BY created_at DESC";
    
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    
    return $stmt;
}

public function updateStatus() {
    $query = "UPDATE " . $this->table_name . "
              SET status = :status
              WHERE id = :id";
    
    $stmt = $this->conn->prepare($query);
    
    $stmt->bindParam(':status', $this->status);
    $stmt->bindParam(':id', $this->id);
    
    if($stmt->execute()) {
        return true;
    }
    return false;
}
}
?>
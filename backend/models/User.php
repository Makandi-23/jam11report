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

    public function __construct($db) {
        $this->conn = $db;
    }

    public function register() {
        $query = "INSERT INTO " . $this->table_name . "
                SET full_name=:full_name, email=:email, password=:password, 
                phone=:phone, ward=:ward, estate_street=:estate_street, 
                proof_of_residence_path=:proof_of_residence_path";
        
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
        $query = "SELECT id, full_name, password, role, status
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
}
?>
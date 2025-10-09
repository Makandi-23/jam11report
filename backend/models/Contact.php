<?php
class Contact {
    private $conn;
    private $table_name = "contacts";

    public $id;
    public $user_id;
    public $full_name;
    public $email;
    public $phone;
    public $ward;
    public $subject;
    public $message;
    public $status;
    public $admin_notes;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET user_id=:user_id, full_name=:full_name, email=:email, 
                phone=:phone, ward=:ward, subject=:subject, message=:message";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":full_name", $this->full_name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":ward", $this->ward);
        $stmt->bindParam(":subject", $this->subject);
        $stmt->bindParam(":message", $this->message);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function getAll() {
        $query = "SELECT c.*, u.full_name as user_full_name 
                 FROM " . $this->table_name . " c
                 LEFT JOIN users u ON c.user_id = u.id
                 ORDER BY 
                    CASE status 
                        WHEN 'new' THEN 1 
                        WHEN 'read' THEN 2 
                        ELSE 3 
                    END,
                    created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    public function getByUserId($user_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                 WHERE user_id = ? 
                 ORDER BY created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $user_id);
        $stmt->execute();
        
        return $stmt;
    }

    public function updateStatus() {
        $query = "UPDATE " . $this->table_name . "
                 SET status = :status, admin_notes = :admin_notes
                 WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":admin_notes", $this->admin_notes);
        $stmt->bindParam(":id", $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function getStats() {
        $query = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_count,
                    SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read_count,
                    SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied_count
                 FROM " . $this->table_name;
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
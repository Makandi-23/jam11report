<?php
class Report {
    private $conn;
    private $table_name = "reports";

    public $id;
    public $user_id;
    public $title;
    public $description;
    public $category;
    public $ward;
    public $location_details;
    public $image_path;
    public $status;
    public $is_urgent;
    public $vote_count;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET user_id=:user_id, title=:title, description=:description,
                category=:category, ward=:ward, location_details=:location_details,
                image_path=:image_path";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":ward", $this->ward);
        $stmt->bindParam(":location_details", $this->location_details);
        $stmt->bindParam(":image_path", $this->image_path);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function getByUserId($user_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                 WHERE user_id = ? ORDER BY created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $user_id);
        $stmt->execute();
        
        return $stmt;
    }

    public function getAll() {
        $query = "SELECT r.*, u.full_name 
                 FROM " . $this->table_name . " r
                 LEFT JOIN users u ON r.user_id = u.id
                 ORDER BY r.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    public function updateStatus() {
        $query = "UPDATE " . $this->table_name . "
                 SET status = :status, is_urgent = :is_urgent
                 WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":is_urgent", $this->is_urgent);
        $stmt->bindParam(":id", $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
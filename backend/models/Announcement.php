<?php
class Announcement {
    private $conn;
    private $table_name = "announcements";

    public $id;
    public $admin_id;
    public $title_en;
    public $title_sw;
    public $message_en;
    public $message_sw;
    public $category;
    public $priority;
    public $target_ward;
    public $expires_at;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET admin_id=:admin_id, title_en=:title_en, title_sw=:title_sw, 
                message_en=:message_en, message_sw=:message_sw, category=:category,
                priority=:priority, target_ward=:target_ward, expires_at=:expires_at";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":admin_id", $this->admin_id);
        $stmt->bindParam(":title_en", $this->title_en);
        $stmt->bindParam(":title_sw", $this->title_sw);
        $stmt->bindParam(":message_en", $this->message_en);
        $stmt->bindParam(":message_sw", $this->message_sw);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":priority", $this->priority);
        $stmt->bindParam(":target_ward", $this->target_ward);
        $stmt->bindParam(":expires_at", $this->expires_at);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    public function getAll() {
        $query = "SELECT a.*, u.full_name as admin_name 
                 FROM " . $this->table_name . " a
                 LEFT JOIN users u ON a.admin_id = u.id
                 WHERE (a.expires_at IS NULL OR a.expires_at >= CURDATE())
                 ORDER BY 
                    CASE priority 
                        WHEN 'pinned' THEN 1 
                        ELSE 2 
                    END,
                    created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    public function getByWard($ward) {
        $query = "SELECT a.*, u.full_name as admin_name 
                 FROM " . $this->table_name . " a
                 LEFT JOIN users u ON a.admin_id = u.id
                 WHERE (a.target_ward = 'all' OR a.target_ward = ?)
                 AND (a.expires_at IS NULL OR a.expires_at >= CURDATE())
                 ORDER BY 
                    CASE priority 
                        WHEN 'pinned' THEN 1 
                        ELSE 2 
                    END,
                    created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $ward);
        $stmt->execute();
        
        return $stmt;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
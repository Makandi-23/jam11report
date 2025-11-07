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

    // In your Report.php model, add these methods:

public function getCount() {
    $query = "SELECT COUNT(*) as total FROM " . $this->table;
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['total'];
}

public function getCountByStatus($status) {
    $query = "SELECT COUNT(*) as count FROM " . $this->table . " WHERE status = :status";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":status", $status);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['count'];
}

public function getCountByUrgent($is_urgent) {
    $query = "SELECT COUNT(*) as count FROM " . $this->table . " WHERE is_urgent = :is_urgent";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":is_urgent", $is_urgent, PDO::PARAM_BOOL);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['count'];
}

public function getReportsByDateRange($startDate, $endDate) {
    $query = "SELECT * FROM " . $this->table . " WHERE created_at BETWEEN :start_date AND :end_date ORDER BY created_at DESC";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":start_date", $startDate);
    $stmt->bindParam(":end_date", $endDate);
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

    // ✅ ADDED VOTING METHODS ✅
    public function addVote($user_id, $report_id) {
        // Check if user already voted
        $check_query = "SELECT id FROM report_votes WHERE user_id = ? AND report_id = ?";
        $check_stmt = $this->conn->prepare($check_query);
        $check_stmt->bindParam(1, $user_id);
        $check_stmt->bindParam(2, $report_id);
        $check_stmt->execute();
        
        if($check_stmt->rowCount() > 0) {
            return false; // Already voted
        }
        
        // Add vote
        $vote_query = "INSERT INTO report_votes (user_id, report_id) VALUES (?, ?)";
        $vote_stmt = $this->conn->prepare($vote_query);
        $vote_stmt->bindParam(1, $user_id);
        $vote_stmt->bindParam(2, $report_id);
        
        if($vote_stmt->execute()) {
            // Update vote count in reports table
            $update_query = "UPDATE reports SET vote_count = vote_count + 1 WHERE id = ?";
            $update_stmt = $this->conn->prepare($update_query);
            $update_stmt->bindParam(1, $report_id);
            $update_stmt->execute();
            
            return true;
        }
        return false;
    }

    // Get most voted reports (for admin)
    public function getMostVoted() {
        $query = "SELECT r.*, u.full_name 
                 FROM " . $this->table_name . " r
                 LEFT JOIN users u ON r.user_id = u.id
                 ORDER BY r.vote_count DESC, r.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    public function getUserVoteCount($user_id) {
    $query = "SELECT COUNT(*) as vote_count FROM report_votes WHERE user_id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $user_id);
    $stmt->execute();
    
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['vote_count'];
}
}
?>
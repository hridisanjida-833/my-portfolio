package main

import (
    "database/sql"
    "encoding/json"
    "fmt"
    "net/http"

    _ "github.com/lib/pq"
)

var db *sql.DB

func contactHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")

    if r.Method == "OPTIONS" {
        return
    }

    if r.Method != "POST" {
        fmt.Fprintln(w, "Only POST requests are allowed")
        return
    }

    var contact struct {
        Name    string `json:"name"`
        Email   string `json:"email"`
        Message string `json:"message"`
    }

    err := json.NewDecoder(r.Body).Decode(&contact)

    if err != nil {
        fmt.Fprintln(w, "Error reading message:", err)
        return
    }

    _, err = db.Exec(
        "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
        contact.Name,
        contact.Email,
        contact.Message,
    )

    if err != nil {
        fmt.Fprintln(w, "Error saving message:", err)
        return
    }

    fmt.Fprintln(w, "Message saved successfully!")
}

func messagesHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Content-Type", "application/json")

    rows, err := db.Query("SELECT id, name, email, message FROM messages ORDER BY id DESC")

    if err != nil {
        fmt.Fprintln(w, "Error getting messages:", err)
        return
    }

    defer rows.Close()

    var messages []map[string]interface{}

    for rows.Next() {
        var id int
        var name string
        var email string
        var message string

        err := rows.Scan(&id, &name, &email, &message)

        if err != nil {
            fmt.Fprintln(w, "Error reading messages:", err)
            return
        }

        messages = append(messages, map[string]interface{}{
            "id":      id,
            "name":    name,
            "email":   email,
            "message": message,
        })
    }

    json.NewEncoder(w).Encode(messages)
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "*")

    fmt.Fprintln(w, "Name: Ridi")
    fmt.Fprintln(w, "Role: CSE Student")
    fmt.Fprintln(w, "Skills: HTML, CSS, JavaScript, C")
}

func main() {
    var err error

    db, err = sql.Open("postgres", "host=localhost port=5432 user=postgres password=123456789 dbname=portfolio sslmode=disable")

    if err != nil {
        fmt.Println("Database connection error:", err)
        return
    }

    err = db.Ping()

    if err != nil {
        fmt.Println("Database is not connected:", err)
        return
    }

    fmt.Println("PostgreSQL database connected successfully!")

    http.HandleFunc("/", homeHandler)
    http.HandleFunc("/contact", contactHandler)
    http.HandleFunc("/messages", messagesHandler)

    fmt.Println("Backend server is running on http://localhost:8080")

    http.ListenAndServe(":8080", nil)
}
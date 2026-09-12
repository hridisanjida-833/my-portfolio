const messagesContainer = document.getElementById("messagesContainer");
const messageCount = document.getElementById("messageCount");
fetch("http://localhost:8080/messages")
    .then(response => response.json())
    .then(messages => {
messageCount.textContent = "Total Messages: " + messages.length;
        if (messages.length === 0) {
            messagesContainer.innerHTML = "<p>No messages yet.</p>";
            return;
        }

        messagesContainer.innerHTML = "";

        messages.forEach(message => {

            const messageCard = document.createElement("div");

            messageCard.classList.add("message-card");

            messageCard.innerHTML = `
                <h3>${message.name}</h3>
                <p><strong>Email:</strong> ${message.email}</p>
                <p><strong>Message:</strong> ${message.message}</p>
                <button onclick="deleteMessage(${message.id})">Delete</button>
            `;

            messagesContainer.appendChild(messageCard);
        });
    })
    .catch(error => {
        console.log("Error:", error);
        messagesContainer.innerHTML = "<p>Could not load messages.</p>";

    });
    function deleteMessage(id) {
    const confirmDelete = confirm("Are you sure you want to delete this message?");

    if (!confirmDelete) {
        return;
    }

    fetch(`http://localhost:8080/delete-message?id=${id}`, {
        method: "DELETE"
    })
        .then(response => response.text())
        .then(data => {
            alert(data);

            // Reload the messages after deleting
            location.reload();
        })
        .catch(error => {
            console.log("Error:", error);
            alert("Could not delete the message.");
        });
}
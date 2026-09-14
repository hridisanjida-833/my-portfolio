const messagesContainer = document.getElementById("messagesContainer");
const messageCount = document.getElementById("messageCount");
fetch("https://my-portfolio-asoi.onrender.com/messages")
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
                <p><strong>Received:</strong> ${message.created_at}</p>
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

    fetch(`https://my-portfolio-asoi.onrender.com/delete-message?id=${id}`, {
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
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.toLowerCase();

    const messageCards = document.querySelectorAll(".message-card");

    messageCards.forEach(card => {
        const cardText = card.innerText.toLowerCase();

        if (cardText.includes(searchText)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});
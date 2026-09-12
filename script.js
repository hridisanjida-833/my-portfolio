const themeButton = document.getElementById("themeButton");

themeButton.addEventListener("click", function () {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        themeButton.textContent = "☀️";
    } else {
        themeButton.textContent = "🌙";
    }
});
const contactForm = document.querySelector(".contact form");

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    fetch("http://localhost:8080/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            message: message
        })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        alert("Thank you! Your message has been received.");
        contactForm.reset();
    })
    .catch(error => {
        console.log("Error:", error);
        alert("Something went wrong.");
    });
});

    fetch("http://localhost:8080")
    .then(response => response.text())
    .then(data => {
        document.getElementById("backendData").innerText = data;
    })
    .catch(error => {
        console.log("Error:", error);
    });
$(document).ready(function () {
    $("#mm-btn-login").click(function () {
        const usernameLogIn = $("#username-login").val();
        const passwordLogIn = $("#password-login").val();
        console.log("click!")

        fetch("/login", {
            method: "POST",
            headers: {
                // This header is needed to ensure express parses JSON correctly
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: usernameLogIn,
                password: passwordLogIn,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(`Data received from server: ${JSON.stringify(data.token)}`);
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    location.href = "/rule";
                } else {
                    $("#error-message").show().text("Invalid username/password");
                }
            })
            .catch((error) => console.log(error))
    })
});

$(document).ready(function () {
    $("#mm-btn-register").click(function () {
        const usernameReg = $("#username-reg").val();
        const passwordReg = $("#password-reg").val();

        fetch("/register", {
            method: "POST",
            headers: {
                // This header is needed to ensure express parses JSON correctly
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: usernameReg,
                password: passwordReg,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    location.href = "/rule";
                } else {
                    $("#error-message").show().text(data.error);
                }
            })
            .catch((error) => console.log(error))
    })
});

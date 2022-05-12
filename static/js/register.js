$(document).ready(function () {
    $("#mm-btn-register").click(function () {
        const usernameReg = $("#username-reg").val();
        console.log(usernameReg);
        const passwordReg = $("#password-reg").val();
        console.log(passwordReg);

        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: usernameReg,
                password: passwordReg,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                localStorage.setItem("token", data.token);
                location.href = "/rule";
            })
            .catch((error) => console.log(error))
    })
});

$(document).ready(function () {
    $("#mm-btn-login").click(function () {
        const usernameLogIn = $("#username-login").val();
        const passwordLogIn = $("#password-login").val();

        fetch("/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: usernameLogIn,
                password: passwordLogIn,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(`Data received from server: ${JSON.stringify(data)}`);
            })
            .catch((error) => console.log(error))
    })
});

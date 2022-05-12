$(document).ready(function () {
    $("#nav-logout").click(function() {
        localStorage.removeItem("token");
        location.href = "/rule";
    })
    const token = localStorage.getItem("token");
    if (token) (
        fetch("/auth", {
            method: "POST",
            headers: {
                // This header is needed to ensure express parses JSON correctly
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                _token: token,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(`Data received from server: ${JSON.stringify(data)}`);
                if (data.user.username) {
                    // User authenticated, refresh UI to hide Login/Register buttons
                    $("#nav-login").hide();
                    $("#nav-register").hide();
                    $("#nav-logout").show();
                    $("#nav-username").show().text(`Hi, ${data.user.username}`);

                    if (window.location.href.indexOf("/login") > -1) {
                        location.href = "/rule";
                    }
                }
            })
            .catch((error) => console.log(error))
    )
});

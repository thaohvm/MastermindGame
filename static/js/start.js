const { max } = require("pg/lib/defaults");

$("#start-game").submit(function(event) {
    console.log("Click")
    event.preventDefault();
    $.ajax({
        url: "/play",
        type: "GET",
        data: {"numDigits" : numDigits,
                "min" : min,
                "max" : max,
                "numAttemptsLeft" : numAttemptsLeft}
    })
    for (let i = 0; i < numDigits; i++) {
        $("#user-guess").append();
        for (let j = min; j < max; j++) {
            $("select")
        }
    }
})

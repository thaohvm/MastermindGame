$(document).ready(function () {
    let game = null;
    let curAttempt = 0;

    $("#mm-btn-start").click(function () {
        const numDigitsRequest = parseInt($("#num-digits-request").val());
        const numAttemptsRequest = parseInt($("#num-attempts-request").val());

        resetGame();
        fetch("play/start", {
            method: "POST",
            headers: {
                // This header is needed to ensure express parses JSON correctly
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                numDigits: numDigitsRequest,
                numAttempts: numAttemptsRequest,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(`Data received from server: ${JSON.stringify(data)}`);
                displayGame(data);
            })
            .catch((error) => console.log(error))
    })

    function resetGame() {
        $("#mastermind").html(`
            <div id="mm-attempts"></div>
            <div id="mm-result"></div>
            <div id="mm-game"></div>`)
    }

    function displayGame(data) {
        console.log(data);
        // Store game init data and hide config elements
        game = data;
        $("#mm-config").hide();

        $("#mm-attempts").text(`${game.numAttempts} attempts left`);
        generateNewAttempt();
    }

    function generateNewAttempt() {
        curAttempt++;
        let attempt = $("<div>")
            .attr("id", `mm-attempt-${curAttempt}`)
            .addClass("row mt-1 mb-1");
        for (let i = 0; i < game.numDigits; i++) {
            let digit = $("<div>")
                .attr("id", `mm-digit-${curAttempt}-${i}`)
                .addClass("col-2");

            let select = $("<select>")
                .attr("id", `mm-select-${curAttempt}-${i}`)
                .addClass("form-select")
                .change(hasDigitChange);

            select.append($("<option>")
                .prop("selected", true)
                .prop("disabled", true)
                .prop("hidden", true)
                .text("X")
            );
            // For each possible value, generate a new select option
            for (let j = game.min; j < game.max + 1; j++) {
                select.append($("<option>").val(j).text(j));
            }
            digit.append(select);
            attempt.append(digit);
        }
        // Add guess button and guess result to the last column, all hidden by default
        attempt.append(
            $("<div>")
                .addClass("col-4")
                .append(
                    $("<button>")
                        .attr("id", `mm-attempt-btn-${curAttempt}`)
                        .attr("type", "button")
                        .addClass("btn btn-primary")
                        .text("Guess")
                        .hide()
                        .click(handleGuess)
                )
                .append(
                    $("<div>")
                        .attr("id", `mm-attempt-result-${curAttempt}`)
                        .hide()
                )
        );
        $("#mastermind").append(attempt);
    }

    function isAllDigitsSelected() {
        // To check if all digits are selected (i.e., default to X == not selected)
        for (let i = 0; i < game.numDigits; i++) {
            // by checking each select box if its value is not X
            let digitId = `#mm-digit-${curAttempt}-${i}`;
            if ($(digitId).find(":selected").val() === "X") {
                return false;
            }
        }
        return true;
    }

    function hasDigitChange() {
        if (isAllDigitsSelected()) {
            // If all digits have been selected, show the guess button to allow
            // submitting guess
            $(`#mm-attempt-btn-${curAttempt}`).show();
        }
    }

    function handleGuess() {
        // First, collect guessed digits from DOM
        let guess = [];
        for (let i = 0; i < game.numDigits; i++) {
            let digitId = `#mm-digit-${curAttempt}-${i}`;
            guess.push(parseInt($(digitId).find(":selected").val()));
        }

        // Call backend API to handle guess, then disable all selects and button
        fetch("/play/guess", {
            method: "POST",
            headers: {
                // This header is needed to ensure express parses JSON correctly
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // Session ID is needed to load game data from cache
                sessionId: game.sessionId,
                guess: guess,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                // First, disable all the digits and hide guess button
                for (let i = 0; i < game.numDigits; i++) {
                    $(`#mm-select-${curAttempt}-${i}`).prop("disabled", true);
                }
                $(`#mm-attempt-btn-${curAttempt}`).hide();

                // Then show the results from the JSON data, this JSON data is a GameResult instance
                $(`#mm-attempt-result-${curAttempt}`)
                    .show()
                    .text(
                        `Correct locations: ${data.numCorrectLocations} - Correct numbers: ${data.numCorrectNumbers}`
                    );

                // Update number of attempts left
                game.attempts = data.numAttemptsLeft;
                $("#mm-attempts").text(`${game.attempts} attempts left`);

                // If game is finished, need to decide win/lose and show start button again
                if (data.isFinished) {
                    if (data.numCorrectLocations == game.numDigits) {
                        $("#mm-result").text("YOU WIN!");
                    } else {
                        $("#mm-result").text("YOU LOSE!");
                    }
                    $("#combination-result").show().text(`Combination resutl is: ${data.combination}`)
                    $("#btn-start").show();
                } else {
                    // If game hasn't finished, generate a new attempt row
                    generateNewAttempt();
                }
            })
            .catch((error) => console.log(error));
    }
});

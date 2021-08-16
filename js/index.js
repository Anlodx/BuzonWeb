const otherLocalFunctions = {
    login: () => {
        if ($("#username").val() !== "") {
            let username = $("#username").val();

            localStorage.setItem(constants.username, username);

            $(location).attr("href", "mainApp.html");
        }
    },

}

const events = {
}

$(document).ready(() => {
    // localFunctions.initialComprobation();
    $("#submit").click(otherLocalFunctions.login);
});
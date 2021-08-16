const constants = {
    username: "username-in-postbox-app"
}

const localFunctions = {
    initialComprobation: () => {
        let isItExists = null;

        if(localStorage.getItem(constants.username) == null){
            isItExists = false;
        }
        else {
            isItExists = true;
        }

        if(isItExists){
            $(location).attr("href","mainApp.html");        
        }
        else {
            //Do nothing
        }
    }
}

localFunctions.initialComprobation();
//Constantes
const constants = {
    username: "username-in-postbox-app"
}

//Variables del usuario actual
const actualUser = {
    id: "", //Correo
    requests: [//Objetos de peticiones
        /*
        {
            name: "Petición 1",
            list: ["202100010001"],
            zipDownloadLink: ""
        },
        {
            name: "Petición 2",
            list: ["202100010001", "202100010002", "202100010003"],
            zipDownloadLink: ""
        },
        {
            name: "Petición Especial",
            list: ["202100099999"],
            zipDownloadLink: ""
        },
        */
    ],
    selectedRequest: null/*{
        numberOfSelected: 0,
        name: "",
        list: [],
        zipDownloadLink: ""
    }*/
}

//URLS QUE NECESITARÉ
const URLS = {
    initialRequests: "http://10.19.5.88/Buzon/Back-end/obtenerPeticiones.php"
}

/*Funciones con respecto a peticiones http*/
const HTTPFunctions = {
    fillRequests: async () => {
        actualUser.requests = [];

        let info = {
            id: actualUser.id
        }
        let usuario = actualUser.id.replace(".","_");//angel
        let json = JSON.stringify(info);
        let data = new FormData();
        console.log( usuario)
        data.append('usuario_busqueda', usuario);//angel

        //let array = JSON.parse(response);

    
        let promise = await fetch("http://10.19.5.88/Buzon/Back-end/obtenerPeticiones.php", {
            method: 'POST',
            body: data,
            /*
            'mode': 'cors',
	        'headers': {
            	'Access-Control-Allow-Origin': '*',
        	}
            */
        })
            .then((msg) => msg.text())
            .then((response) => {
                console.log(response);
                if (response === "Error") {
                    //Do something
                }
                else {
                    let array = JSON.parse(response);
                    //console.log(array);
                   

                    let actualObject = null;
                    
                    for (let i = 0; i < array.length; i++) {
                        actualObject = {
                            name: array[i].nombre,
                            list: array[i].polizas,
                            //zipDownloadLink: "..."
                        };
                        console.log(actualObject);
                        /*
                        for (let j = 0; j < array[i].polizas.length; j++) {
                            actualUser.requests.push(array[i].polizas[j].id);
                        }
                        */

                        actualUser.requests.push(actualObject);
                        localFunctions.showAvailableRequests();
                    }
                }
            })
            .catch((error) => {

            });
            
    }
}

//Funciones relacionadas a aqui
const localFunctions = {
    showAvailableRequests: () => {
        let mainContent = ``; //Va a haber uno solo
        let actualTableContent; //Habrá muchos
        let objetoPedido = null; //angel
        for (let i = 0; i < actualUser.requests.length; i++) {
            //Este es un elemento de tipo request

            objetoPedido = actualUser.requests[i];
            //console.log(objetoPedido);
            actualTableContent = `<table>`;
            for (let j = 0; j < actualUser.requests[i].list.length; j++) {
                //console.log(objetoPedido.list[j]);
                actualTableContent += `
                    <tr>
                        <td><a href="${objetoPedido.list[j].ruta}" target="_blank">${objetoPedido.list[j].poliza}</a></td>
                    </tr>
                `;
            }
            actualTableContent += `</table>`;

            mainContent += `
            <div class="all-request">
                <div class="drop-down-request">
                    <span class="request-title">${actualUser.requests[i].name}</span>
                    <!--
                    <picture>
                        <img class="drop-down-icon" src="./imgs/drop-down-icon.png" alt="Desplegable"/>
                    </picture>
                    -->
                </div>
                <section class="info-request">
                    <section class="info-request-section info-request__incidence">
                        <span>¿Tienes alguna incidencia que comunicar?</span>
                        <button id="`
            
            mainContent += "incidence-" + (i);

            mainContent += `
                        " onClick="eventsOfElements.buttonOfIncidences(this.id)">Reportar incidencia</button>
                    </section>
                    <section class="info-request-section info-request__list">
                        <!-- Ejemplo -->
                        <span>Pólizas pedidas</span>`;
            mainContent += actualTableContent;

            mainContent += `
                    </section>
                    <section class="info-request-section info-request__download">
                        <span>Descargar:</span>
                        <button onclick="descargarZip('${actualUser.requests[i].name}')">Descargar como archivo .zip</button>
                    </section>
                </section>
            </div>
            `;
        }

        $(".requests-section").html(mainContent);

        /*Añadir eventos a las peticiones disponibles*/

        //Ejemplo de section = .all-request:nth-child(1) .drop-down-request


        for (let i = 0; i < actualUser.requests.length; i++) {
            //No es posible hacer esto:
            $(`.all-request:nth-child(${(i + 1)}) .drop-down-request`).click(() => {
                //`.all-request:nth-child(${(i + 1)}) .drop-down-request ~ .info-request`


                if ($(`.all-request:nth-child(${(i + 1)}) .drop-down-request ~ .info-request`).is(":hidden")) {
                    $(`.all-request:nth-child(${(i + 1)}) .drop-down-request ~ .info-request`).css({ "display": "flex" });
                    $(`.all-request:nth-child(${(i + 1)}) .drop-down-request ~ .info-request`).show();
                }
                else {
                    $(`.all-request:nth-child(${(i + 1)}) .drop-down-request ~ .info-request`).hide();
                }


                // $(`.all-request:nth-child(${(i + 1)}) .drop-down-request`).css({"background-color" : "black"});
            });
        }
    },
    showUsernameInHeader: () => {
        $("header .header-username span").html(actualUser.id);
    },
    logout: () => {
        if (localStorage.getItem(constants.username) != null) {
            localStorage.removeItem(constants.username);
            $(location).attr("href", "index.html");
        }
    }
}

//Eventos de los elementos html
const eventsOfElements = {
    buttonOfIncidences: (idOfButton) => {
        //Set selected request

        //Sacar el numero del string: "incidence-n"
        let id = parseInt(idOfButton.split("-")[1]);
        actualUser.selectedRequest = actualUser.requests[id];

        //Open modal
        $(".modal-incidences .modal-header .title").html((actualUser.requests[id].name !== null || actualUser.requests[id].name !== "") ? "Incidencias para: " + actualUser.requests[id].name : "Incidencias para: NULL");
        $(".modal-incidences").css({"display" : "flex"});
    },
    close: () => {

    },
    onClickWindowModal: (event) => {
        if(event.target.className.includes("modal-screen")){
            $(".modal-screen").css({"display": "none"});
        }
    }
}


//Eventos del html
const events = {
    atBeginning: () => {
        //Traer variables

        if (localStorage.getItem(constants.username) != null) {
            let username = localStorage.getItem(constants.username);

            actualUser.id = username;
        }
        HTTPFunctions.fillRequests();
        
        $(window).click(eventsOfElements.onClickWindowModal);
        $(".modal-container .close-button").click(() => {
            $(".modal-screen").css({"display": "none"});
        });
    },
    atMiddle: () => {
        //Establecer en nuestro html

        localFunctions.showAvailableRequests();
        localFunctions.showUsernameInHeader();

        $("header .header-log-out button").click(localFunctions.logout);
    }
}



function descargarZip(tabla){
    const componenteDescargar = document.createElement("a");
    componenteDescargar.href = "http://10.19.5.88/Buzon/almacen/" + tabla + "/" + tabla + ".zip";
    componenteDescargar.target = "_blank";
    componenteDescargar.download = tabla + ".zip";

    document.body.appendChild(componenteDescargar);
    componenteDescargar.click();
    document.body.removeChild(componenteDescargar);

}

//El documento está listo para correr
$(document).ready(() => {
    events.atBeginning();
    events.atMiddle();
});
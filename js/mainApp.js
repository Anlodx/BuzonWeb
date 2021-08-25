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
        //console.log( usuario)
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
                //console.log(response);
                if (response === "Error") {
                    //Do something
                }
                else {
                    let array = JSON.parse(response);
                    ////console.log(array);
                   

                    let actualObject = null;
                    
                    for (let i = 0; i < array.length; i++) {
                        actualObject = {
                            name: array[i].nombre,
                            list: array[i].polizas,
                            incidencias: array[i].incidencias
                            //zipDownloadLink: "..."
                        };
                        //console.log(actualObject);
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
    showAvailableRequests: async() => {
        let mainContent = ``; //Va a haber uno solo
        let actualTableContent; //Habrá muchos
        let incidenciasContenido;
        let objetoPedido = null; //angel
        let datosFechaDeTabla = "";
        let arrayWithRequestsForShow = [];
        for (let i = 0; i < actualUser.requests.length; i++) {
            //Este es un elemento de tipo request

            objetoPedido = actualUser.requests[i];
            ////console.log(objetoPedido);
            actualTableContent = `<table>`;
            await corroborarPedidoParaOcultar(objetoPedido.name);
            if(banderaOcultar == false){
                arrayWithRequestsForShow.push(i);

                for (let j = 0; j < actualUser.requests[i].list.length; j++) {
                    ////console.log(objetoPedido.list[j]);
                    actualTableContent += `
                        <tr>
                            <td>
                            ${
                                (objetoPedido.list[j].ruta === '') ? objetoPedido.list[j].poliza
                                :
                                `
                                <a href="${objetoPedido.list[j].ruta === '' ? "#" : objetoPedido.list[j].ruta}" ${objetoPedido.list[j].ruta === '' ? "" : 'target="_blank"'} >${objetoPedido.list[j].poliza}</a>
                                `
                            }
                            </td>
                        </tr>
                    `;
                }
                
            }
            actualTableContent += `</table>`;

            
            
            ////console.log(objetoPedido);
            incidenciasContenido = `<ul class="lista-incidencia">`;
            for (let j = 0; j < actualUser.requests[i].incidencias.length; j++) {
                ////console.log(objetoPedido.list[j]);
                incidenciasContenido += `
                    
                        <li class="incidencia-item">* ${objetoPedido.incidencias[j].incidencia}</li>
                    
                `;
            }
            incidenciasContenido += `</ul>`;


            
            let nombreTablaArray = (actualUser.requests[i].name).split("_");
            
            let usuarioHeader = "";
            let fechaHeader = "";
            let horaHeader = "";

                    
            usuarioHeader = nombreTablaArray[0] + "." + nombreTablaArray[1];
            fechaHeader = nombreTablaArray[2] + " / " + nombreTablaArray[3] + " / " + nombreTablaArray[4];
            horaHeader = adornaLaHora(parseInt(nombreTablaArray[5]),parseInt(nombreTablaArray[6]),nombreTablaArray[7]);
            
            mainContent += `
            <div class="all-request">
                <div class="drop-down-request" style="${banderaOcultar == false ? "background-color:#7bed9f;color:#2f3542":""}">
                    <span class="request-title">${"Dia: " + fechaHeader + " a las " + horaHeader}</span>
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
                        ${incidenciasContenido}
                        
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
            arrayWithRequestsForShow.forEach((valor) => {
                if (i == valor) {
                    $(`.all-request:nth-child(${(i + 1)}) .drop-down-request ~ .info-request`).css({ "display": "flex" });
                    $(`.all-request:nth-child(${(i + 1)}) .drop-down-request ~ .info-request`).show();
                }
            });

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
        $(".modal-incidences .modal-header .title").html((actualUser.requests[id].name !== null || actualUser.requests[id].name !== "") ? "Incidencias para: Departamento de digitalización" : "Incidencias para: Departamento de digitalización");
        $(".modal-incidences").css({"display" : "flex"});
    },
    close: () => {

    },
    onClickWindowModal: (event) => {
        if(event.target.className.includes("modal-screen")){
            $(".modal-screen").css({"display": "none"});
        }
    },
    buttonOfSubmitIncidence: async () => {        
        let valorIncidencia = document.getElementById("incidencia").value;
        //console.log(valorIncidencia);
        
        //console.log("objeto para mandar incidencia: ",actualUser.selectedRequest);

        if (/\S/.test(valorIncidencia) && valorIncidencia!=null) {
            // string is not empty and not just whitespace
            //console.log("no es vacio y no solo espacios en blanco");

            
        
        
        let data = new FormData();
        //console.log(valorIncidencia)
        data.append('incidencia', valorIncidencia);//angel
        data.append('tabla', actualUser.selectedRequest.name);//angel
        //let array = JSON.parse(response);

    
        let promise = await fetch("http://10.19.5.88/Buzon/Back-end/crearIncidencia.php", {
            method: 'POST',
            body: data,
            
        })
            .then((msg) => msg.text())
            .then((response) => {
                //console.log(response);
                if(response == "Insidencia apuntada"){
                    alert("incidencia enviada");
                    $(".modal-screen").css({"display": "none"});
                    location.reload();
                }
            })
            .catch((error) => {
                //console.log(error);
            });
            
        }else{
            
            //console.log("es vacio o erroneo en la incidencia");
            
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
        $(".modal-container .modal-main .buttons .submit").click(eventsOfElements.buttonOfSubmitIncidence);
    },
    atMiddle: () => {
        //Establecer en nuestro html

        localFunctions.showAvailableRequests();
        localFunctions.showUsernameInHeader();

        $("header .header-log-out button").click(localFunctions.logout);
    }
}

var bandera = false;
//hasta aqui lo hace con el await
 async function descargarZip(tabla){
     ////console.log("corroborar pedido: ",corroborarPedido(tabla));
     await corroborarPedido(tabla);
    if(bandera === true){
        const componenteDescargar = document.createElement("a");
        componenteDescargar.href = "http://10.19.5.88/Buzon/almacen/"  + tabla + ".zip";
        componenteDescargar.target = "_blank";
        componenteDescargar.download = tabla + ".zip";
        
        document.body.appendChild(componenteDescargar);
        componenteDescargar.click();
        document.body.removeChild(componenteDescargar);
        //console.log("descargando y borrando");
        borrarPedido(tabla);
        
    }else{
        //console.log("solo se puede descargar una vez");
    }
    
}
var banderaOcultar = true;
async function corroborarPedidoParaOcultar(ruta){
    
    const formData = new FormData();
    
    formData.append("directorio", ruta);

    // Los enviamos
    //$estado.textContent = "Enviando archivos...";
    const respuestaRaw = await fetch("http://10.19.5.88/Buzon/Back-end/existePedido.php", {
        method: "POST",
        body: formData,
    }).then((msg)=>msg.text()).then((response)=>{
        
    
    // Puedes manejar la respuesta como tú quieras
    //console.log("respuesta de si existe o no; ",response);
    
    if(response === "descarga"){
        //console.log("entre al if de existePedido: ",response);
        banderaOcultar = false;
    }else if(response === "denegado"){
        //console.log("entre al else if de existePedido: ",response);
        banderaOcultar = true;
    }else{
        //console.log("entre al else de existePedido: ",response);
        banderaOcultar = true;
    }
    }).catch((e)=>{
        //console.log("error: ",e);
        banderaOcultar = false;
    });
    
}

async function corroborarPedido(ruta){
    
    const formData = new FormData();
    
    formData.append("directorio", ruta);

    // Los enviamos
    //$estado.textContent = "Enviando archivos...";
    const respuestaRaw = await fetch("http://10.19.5.88/Buzon/Back-end/existePedido.php", {
        method: "POST",
        body: formData,
    }).then((msg)=>msg.text()).then((response)=>{
        
    
    // Puedes manejar la respuesta como tú quieras
    //console.log("respuesta de si existe o no; ",response);
    
    if(response === "descarga"){
        //console.log("entre al if de existePedido: ",response);
        bandera = true;
    }else if(response === "denegado"){
        //console.log("entre al else if de existePedido: ",response);
        bandera = false;
    }else{
        //console.log("entre al else de existePedido: ",response);
        bandera = false;
    }
    }).catch((e)=>{
        //console.log("error: ",e);
        bandera = false;
    });
    
}

async function borrarPedido(ruta){
    
    const formData = new FormData();
    
    formData.append("pedido_obsoleto", ruta);

    // Los enviamos
    //$estado.textContent = "Enviando archivos...";
    const respuestaRaw = await fetch("http://10.19.5.88/Buzon/Back-end/borrarPedido.php", {
        method: "POST",
        body: formData,
    }).then((msg)=>msg.text()).then((respuesta)=>{
        
    
        // Puedes manejar la respuesta como tú quieras
        //console.log("respuesta de borrado; ",respuesta);
        location.reload();
        }).catch((e)=>{
            //console.log("error: ",e);
        });
    
}


function adornaLaHora(hora,minuto,segundo){
    var fechaAdornada="";
    var aux="";
    if(hora>=0 && hora<12){
        aux="am";
    }else{
        aux="pm";
    }

    if(hora>12){
        switch(hora-12){
            case 1: fechaAdornada+="01"; break;
            case 2: fechaAdornada+="02"; break;
            case 3: fechaAdornada+="03"; break;
            case 4: fechaAdornada+="04"; break;
            case 5: fechaAdornada+="05"; break;
            case 6: fechaAdornada+="06"; break;
            case 7: fechaAdornada+="07"; break;
            case 8: fechaAdornada+="08"; break;
            case 9: fechaAdornada+="09"; break;
            default: fechaAdornada+=hora-12;
        }

    }
    else if(hora===0){
        fechaAdornada+="12";
    }
    else{

        switch(hora){
            case 1: fechaAdornada+="01"; break;
            case 2: fechaAdornada+="02"; break;
            case 3: fechaAdornada+="03"; break;
            case 4: fechaAdornada+="04"; break;
            case 5: fechaAdornada+="05"; break;
            case 6: fechaAdornada+="06"; break;
            case 7: fechaAdornada+="07"; break;
            case 8: fechaAdornada+="08"; break;
            case 9: fechaAdornada+="09"; break;
            default: fechaAdornada+=hora;
        }
    }

    switch(minuto){
        case 0: fechaAdornada+=":00"+" "+aux; break;
        case 1: fechaAdornada+=":01"+" "+aux; break;
        case 2: fechaAdornada+=":02"+" "+aux; break;
        case 3: fechaAdornada+=":03"+" "+aux; break;
        case 4: fechaAdornada+=":04"+" "+aux; break;
        case 5: fechaAdornada+=":05"+" "+aux; break;
        case 6: fechaAdornada+=":06"+" "+aux; break;
        case 7: fechaAdornada+=":07"+" "+aux; break;
        case 8: fechaAdornada+=":08"+" "+aux; break;
        case 9: fechaAdornada+=":09"+" "+aux; break;
        default: fechaAdornada+=":"+minuto+" "+aux;
    }
    console.log("segundo:",segundo)
    if(segundo == undefined){
        //console.log("segundo: indefinido bro")
    }else{
        fechaAdornada += " con " + segundo + " segundos";
    }
    return(fechaAdornada);   
}


async function reportarIncidencia(tabla,incidencia){
    //
}


//El documento está listo para correr
$(document).ready(() => {
    events.atBeginning();
    events.atMiddle();
});
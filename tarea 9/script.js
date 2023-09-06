let ubicacion = document.getElementById("cards")

let url = 'https://mindhub-xj03.onrender.com/api/amazing'
let eventosInternet = []
let fechaInternet  


getData(url)

function getData(url){
  fetch(url)
      .then(respuestaDelServidor => respuestaDelServidor.json())
      .then(datosDeInternet => {
          // console.log(datosDeInternet)
          eventosInternet = datosDeInternet.events
          // console.log(eventosInternet)
          fechaInternet = datosDeInternet.currentDate
          // console.log(fechaInternet)

          if (document.title != "Details") {
            funcionesParaPintar(eventosInternet, fechaInternet)
          
          }else {
          
            pintadoDetails(eventosInternet)
          }
        })
      
        
.catch(error => console.log(error))
      }


/* -----------------------------generar tarjetas---------------------------------------- */

function generarTarjetasAmazing(dataEventos, ubic) {
  let cardsHTML = "";
  for (evento of dataEventos) {


    cardsHTML +=
      `<div class="card" style="width: 16rem;">
      <img src="${evento.image}" class="card-img-top" style="height: 10rem;" alt="${evento.name}">
      <div class="card-body">
        <h5 class="card-title">${evento.name}</h5>
        <p class="card-text" style="height: 5rem;">${evento.description}</p>
        <div class="d-flex justify-content-between align-items-center">
          <h6>$  ${evento.price}</h6>
          <a href="./assets/pages/details.html?id= ${evento._id}" class="btn btn-primary">Details</a>
        </div>
      </div>
    </div>`
  }
  ubic.innerHTML = cardsHTML
}

function generarTarjetas(dataEventos, ubic) {
  let cardsHTML = "";
  for (evento of dataEventos) {


    cardsHTML +=
      `<div class="card" style="width: 16rem;">
      <img src="${evento.image}" class="card-img-top" style="height: 10rem;" alt="${evento.name}">
      <div class="card-body">
        <h5 class="card-title">${evento.name}</h5>
        <p class="card-text" style="height: 5rem;">${evento.description}</p>
        <div class="d-flex justify-content-between align-items-center">
          <h6>$  ${evento.price}</h6>
          <a href="./details.html?id= ${evento._id}" class="btn btn-primary">Details</a>
        </div>
      </div>
    </div>`
  }
  ubic.innerHTML = cardsHTML
}
/* -----------------------------filtrado y envio de las cards a las paginas---------------------------------------- */

// generacion de nuevos  arrys con la condicion que queremos

function impresionDeCards(elementosFiltrados, fechaActual) {
  
  
  console.log(elementosFiltrados)

  let dataEventosNext = elementosFiltrados.filter(e => e.date > fechaActual)
  let dataEventosPast = elementosFiltrados.filter(e => e.date < fechaActual)



  if(dataEventosNext.length == 0){
    dataEventosNext = advertencia()
  }else if(dataEventosPast.length == 0){
    dataEventosPast = advertencia()
  }else if(elementosFiltrados.length == 0){
    elementosFiltrados = advertencia ()
  }
    
  
  switch (document.title) {
    case "Upcoming Events":
      generarTarjetas(dataEventosNext, cardsNext);
      break;
    case "Past Events":
      generarTarjetas(dataEventosPast, cardsPast);
      break;
    case "Amazing Events":
      generarTarjetasAmazing(elementosFiltrados, cards);
      break;



  }

}




  

  /* --------------------------------------------------------------------- */


  /* bueno vamos a empezar con el filtrado */

  const inputTexto = document.querySelector("#textoSearch")
  const formulario = document.forms[0]




  /* --------------------------------- funcion fitro------------------------------------ */

  function filtrarPorTexto(arrayDeObjetos, texto) {
    let idElementoFiltrado
    let arrayProp = arrayDeObjetos.map((e) => (Object.values(e)))

    let arrayStrings = arrayProp.map(array => array.map(string => (string.toString())))
    let elementosFiltrados = arrayStrings.filter(array => array.some(string => string.toLowerCase().includes(texto.toLowerCase())))
    
    if(isNaN(elementosFiltrados[0])){
      idElementoFiltrado = elementosFiltrados.map(elemento => Number(elemento[0]))
    }else{
      idElementoFiltrado = elementosFiltrados.map(elemento => (elemento[0]))
    }
    
    let objetoFiltrado = arrayDeObjetos.filter(objeto => idElementoFiltrado.includes(objeto._id))
    // console.log(elementosFiltrados)
      //ojooooooooooo hay que ver si elementos filtrados es numero o no!!!!!!!!! tengo que arreglarlo!!!!!
      return objetoFiltrado


  }



  /* ---------------------------------checkboxes------------------------------------ */

  /* creo la funcion de para crear checkboxes y uqe lo inserte en los HTML */
  function crearCheckboxes(arrayDeObjetos, ubicacion) {
    let checksHTML = "";
    let keysUnicas = [];
    /* vamos buscar los nombres de los checkbox del amazing event.js */
    arrayDeObjetos.forEach(e => Object.keys(e).forEach(key => {
      if (!keysUnicas.includes(key)) {
        keysUnicas.push(key)
      }
    }))

    let titulosCheckbox1 = keysUnicas.filter(e => !e.includes('_') && !e.includes('date') && !e.includes('image'))

    for (e of titulosCheckbox1) {
      checksHTML +=
        `<div>
      <input class="form-check-input " type="checkbox" value="" id="${e}">
      <label class="form-check-label" for="${e}">
      ${e}
      </label>
  </div>`
    }
    ubicacion.innerHTML = checksHTML
  }


  
function advertencia(){
  let advertencia = [{
    name: "no se ha encontrado resultado",
    image: "https://friconix.com/jpg/fi-cnluxx-magnifying-glass-cross.jpg",
    description: "",
    price: "",

  }]
  return advertencia
}

  function filtroCruzado(arrayDeObjetos, fechaActual) {
    let filtradoPorTexto = filtrarPorTexto(arrayDeObjetos, inputTexto.value)
    let filtrarPorTextoYPorCheckers = filtrarPorCheck(filtradoPorTexto)
  
    impresionDeCards(filtrarPorTextoYPorCheckers, fechaActual)
  
  }


  /* detectamos si hubo un cambio en los checkboxes */

  // checkboxes.addEventListener("change", () => {
  // //  console.log("cambio un checkbox")
  //   //  let arregloFiltradoPorCheck = filtrarPorCheck(dataEventos)
  // //   impresionDeCards(arregloFiltradoPorCheck) 
  //   filtroCruzado()
  // })
  


  function filtrarPorCheck(arrayDeObjetos) {
    let checkboxes = document.querySelectorAll("#checkboxes .form-check-input")
    // console.log(checkboxes)
    let arrayCheckboxes = Array.from(checkboxes)
    // console.log(arrayCheckboxes)
    let checked = arrayCheckboxes.filter(e => e.checked)
    // console.log(checked)
    let stringCheck = checked.map(check => check.id)
    // console.log(stringCheck)

    let elementosFiltradosporcheck = arrayDeObjetos.filter(obj => Object.keys(obj).some(key => stringCheck.includes(key)))
    // console.log(elementosFiltrados)

    if (stringCheck.length == 0) {
      return arrayDeObjetos
    } else {
      return elementosFiltradosporcheck
    }
  }


function funcionesParaPintar (arrayDeObjetos, fechActual){
  
  checkboxes.addEventListener("change", () => filtroCruzado(arrayDeObjetos, fechActual))

  
  /* detectamos si escribieron en la busqueda */
  inputTexto.addEventListener("input", () => {
    /*   // console.log("escribiendo")
      let arregloFiltrado = filtrarPorTexto(dataEventos, inputTexto.value)
      // console.log(arregloFiltrado)
      impresionDeCards(arregloFiltrado) */
    filtroCruzado(arrayDeObjetos, fechActual)
  })


  crearCheckboxes(arrayDeObjetos, checkboxes)

  

  impresionDeCards(arrayDeObjetos, fechActual)
}


  /* ---------------------------------DETAILS--------------------------------------- */

  function pintadoDetails(arrayDeObjetos){

    const queryString = location.search;
    // console.log(queryString)
    const param = new URLSearchParams(queryString);
    // console.log(param);
    const id = param.get("id");
    const idplus = id.trim()
    // console.log(idplus)
  
    let elementoFiltrado = arrayDeObjetos.filter(obj => Object.values(obj).some(value => value == idplus))
    let elementoFiltrado1 = elementoFiltrado[0]
    // console.log(elementoFiltrado1)
    pintarDetails(elementoFiltrado1)
  }




function pintarDetails(elementoAMostrar) {
  // let container = document.getElementById("details");
  // // let div = document.createElement("div");
  // // div.className = "card"
  let cardHTML

  cardHTML = `
<div class="col-md-10 col-lg-6 ">
  <img src="${elementoAMostrar.image}" class="img-fluid rounded-start" alt="...">
</div>
<div class="col-lg-6 ">
  <div class="card-body">
  <h5 class="card-title">${elementoAMostrar.name}</h5>
  <table class="table">
      <thead>
          <tr>
              <th scope="col">Title</th>
              <th scope="col">Data</th>
          </tr>
      </thead>
      <tbody>
          <tr>
              <th scope="row">id</th>
              <th>${elementoAMostrar._id}</th>
          </tr>
          <tr>
              <th scope="row">name</th>
              <th>${elementoAMostrar.name}</th>
          </tr>
          <tr>
              <th scope="row">date</th>
              <th>${elementoAMostrar.date}</th>
          </tr>
          <tr>
              <th scope="row">description</th>
              <th>${elementoAMostrar.description}</th>
          </tr>
          <tr>
              <th scope="row">category</th>
              <th>${elementoAMostrar.category}</th>
          </tr>
          <tr>
              <th scope="row">place</th>
              <th>${elementoAMostrar.place}</th>
          </tr>
          <tr>
              <th scope="row">capacity</th>
              <th>${elementoAMostrar.capacity}</th>
          </tr>
          <tr>
              <th scope="row">assistance or estimate</th>
              <th>${elementoAMostrar.category}</th>
          </tr>
          <tr>
              <th scope="row">price</th>
              <th>${elementoAMostrar.price}</th>
          </tr>
      </tbody>
  </div>`

  details.innerHTML = cardHTML
}



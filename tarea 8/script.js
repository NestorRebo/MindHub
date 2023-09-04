let fechaActual = data.currentDate;
let dataEventos = data.events;
let ubicacion = document.getElementById("cards")
// let ubicacion1 = document.getElementById("cardsPast")
// let ubicacion2 = document.getElementById("cardsNext")

/* -----------------------------generar tarjetas---------------------------------------- */

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
          <a href="./assets/pages/details.html" class="btn btn-primary">Details</a>
        </div>
      </div>
    </div>`
  }
  ubic.innerHTML = cardsHTML
}
/* -----------------------------filtrado y envio de las cards a las paginas---------------------------------------- */

// generacion de nuevos  arrys con la condicion que queremos

let dataEventosNext = dataEventos.filter(dataEventos => dataEventos.date > fechaActual)
let dataEventosPast = dataEventos.filter(dataEventos => dataEventos.date < fechaActual)

if (document.title === "Upcoming Events") {
  generarTarjetas(dataEventosNext, cardsNext)

} else if (document.title === "Past Events") {
  generarTarjetas(dataEventosPast, cardsPast)
} else if (document.title === "Amazing Events") {
  generarTarjetas(dataEventos, cards)
}



function impresionDeCards(elementosFiltrados) {

  let dataEventosNext = elementosFiltrados.filter(elementosFiltrados => elementosFiltrados.date > fechaActual)
  let dataEventosPast = elementosFiltrados.filter(elementosFiltrados => elementosFiltrados.date < fechaActual)

  /*   if (inputTexto === "") {//preguntar como hacer para que las tarjetas aparezcan cuando carga la pagina
  console.log("campo vacio")
    } else {} */
  switch (document.title) {
    case "Upcoming Events":
      generarTarjetas(dataEventosNext, cardsNext);
      break;
    case "Past Events":
      generarTarjetas(dataEventosPast, cardsPast);
      break;
    case "Amazing Events":
      generarTarjetas(elementosFiltrados, cards);
      break;

  }

}
/* --------------------------------------------------------------------- */


/* bueno vamos a empezar con el filtrado */

const inputTexto = document.querySelector("#textoSearch")
const formulario = document.forms[0]

/* vamos a hacer que el submit no me reinicie la pagina ni ingrese un espacio */
formulario.addEventListener("submit", (e) => {
  e.preventDefault()
  if (inputTexto.value == "") {
    return
  }
  /* console.log("apreto el boton")
  console.log(inputTexto.value) */

  inputTexto.value = ""
})


/* detectamos si escribieron en la busqueda */
inputTexto.addEventListener("input", () => {
/*   // console.log("escribiendo")
  let arregloFiltrado = filtrarPorTexto(dataEventos, inputTexto.value)
  // console.log(arregloFiltrado)
  impresionDeCards(arregloFiltrado) */
  filtroCruzado()
})

/* --------------------------------- funcion fitro------------------------------------ */

function filtrarPorTexto(arrayDeObjetos, texto) {

  /* no se termino de usar porque necesito estas propiedades para imprimir las cards  
  Propiedad que deseas eliminar
  let propiedadEliminar1 = 'image'
  let propiedadEliminar2 = '__v'

  // saco las propiedade
  let array1 = arrayDebjetos.map(({ [propiedadEliminar1]: _, ...resto }) => resto);
  let arrayFiltrado = array1.map(({ [propiedadEliminar2]: _, ...resto }) => resto)
  console.log(arrayFiltrado); */


  /* filtro los valores de las propiedades. */
  let arrayProp = arrayDeObjetos.map((e) => (Object.values(e)))

  let arrayStrings = arrayProp.map(array => array.map(string => (string.toString())))
  let elementosFiltrados = arrayStrings.filter(array => array.some(string => string.toLowerCase().includes(texto.toLowerCase())))
  let idElementoFiltrado = elementosFiltrados.map(elemento => elemento[0])

  let objetoFiltrado = dataEventos.filter(objeto => idElementoFiltrado.includes(objeto._id))

  return objetoFiltrado

}



/* ---------------------------------checkboxes------------------------------------ */

/* creo la funcion de para crear checkboxes y uqe lo inserte en los HTML */
function crearCheckboxes(dataEventos, ubicacion) {
  let checksHTML = "";
  let keysUnicas = [];
  /* vamos buscar los nombres de los checkbox del amazing event.js */
  dataEventos.forEach(e => Object.keys(e).forEach(key => {
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


crearCheckboxes(dataEventos, checkboxes)

function filtroCruzado(){
  let filtradoPorTexto = filtrarPorTexto(dataEventos, inputTexto.value)
  let filtrarPorTextoYPorCheckers = filtrarPorCheck(filtradoPorTexto)
  // if(filtrarPorTextoYPorCheckers.length === 0){
  //   let advertencia= [{
  //     name: "no se ha encontrado resultado",
  //     image: "https://i.postimg.cc/PrMJ0ZMc/Metallica-in-concert.jpg",
  //   }]
  //   impresionDeCards(advertencia)
  // }else{
    impresionDeCards(filtrarPorTextoYPorCheckers)
  }


/* detectamos si hubo un cambio en los checkboxes */
// checkboxes.addEventListener("change", () => {
// //  console.log("cambio un checkbox")
//   //  let arregloFiltradoPorCheck = filtrarPorCheck(dataEventos)
// //   impresionDeCards(arregloFiltradoPorCheck) 
//   filtroCruzado()
// })
checkboxes.addEventListener("change", () => filtroCruzado())


function filtrarPorCheck(arrayDeObjetos) {
  let checkboxes = document.querySelectorAll("#checkboxes .form-check-input")
  // console.log(checkboxes)
  let arrayCheckboxes = Array.from(checkboxes)
  // console.log(arrayCheckboxes)
  let checked = arrayCheckboxes.filter(e => e.checked)
  // console.log(checked)
  let stringCheck = checked.map(check => check.id)
  console.log(stringCheck)

let elementosFiltrados = arrayDeObjetos.filter(obj => Object.keys(obj).some(key => stringCheck.includes(key)))
console.log(elementosFiltrados)

if(stringCheck.length === 0){
  return arrayDeObjetos
}else{
  return elementosFiltrados
}



}





/* ------------------------------------------------------------------------ */
let fechaActual = data.currentDate;
let dataEventos = data.events;
let ubicacion = document.getElementById("cards")
// let ubicacion1 = document.getElementById("cardsPast")
// let ubicacion2 = document.getElementById("cardsNext")



function generarTarjetas(dataEventos, ubic) {
  let cardsHTML = "";
  for (evento of dataEventos) {


    cardsHTML +=
    `<div class="card" style="width: 16rem;">
      <img src="${evento.image}" class="card-img-top" alt="${evento.name}">
      <div class="card-body">
        <h5 class="card-title">${evento.name}</h5>
        <p class="card-text">${evento.description}</p>
        <div class="d-flex justify-content-between  align-items-center">
          <h6>${evento.price}</h6>
          <a href="./assets/pages/details.html" class="btn btn-primary">Details</a>
        </div>
      </div>
    </div>`
  }
  ubic.innerHTML = cardsHTML
}

// generacion de nuevos  arrys con la condicion que queremos
let dataEventosNext = dataEventos.filter(dataEventos => dataEventos.date > fechaActual)
let dataEventosPast = dataEventos.filter(dataEventos => dataEventos.date < fechaActual)



if(document.title === "Upcoming Events"){
  generarTarjetas(dataEventosNext, cardsNext)

}else if(document.title === "Past Events"){
  generarTarjetas(dataEventosPast, cardsPast)
}else if(document.title === "Amazing Events"){
  generarTarjetas(dataEventos, cards)
}



/* creo la funcion de para crear checkboxes y uqe lo inserte en los HTML */
function crearCheckboxes(dataEventos, ubicacion){
  let checksHTML = "";

/* vamos buscar los nombres de los checkbox del amazing event.js */
let titulosCheckbox = Object.keys(dataEventos[0])
let titulosCheckbox1= titulosCheckbox.filter(e => !e.includes('_') && !e.includes('date') && !e.includes('image') )


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

/* bueno vamos a empezar con el filtrado */

const inputTexto = document.querySelector("#textoSearch")
const formulario = document.forms[0]

/* vamos a hacer que el submit no me reinicie la pagina ni ingrese un espacio */
formulario.addEventListener("submit", (e)=>{
  e.preventDefault()
  if(inputTexto.value == ""){
    return
  }
  console.log("apreto el boton")
  console.log(inputTexto.value)

  inputTexto.value = ""
})

/* detectamos si hubo un cambio en los checkboxer */
checkboxes.addEventListener("change", () => {
  console.log("cambio un checkbox")
})
/* detectamos si escribieron en la busqueda */
inputTexto.addEventListener("input", ()=>{
  console.log("escribiendo")
})

console.log

function filtrarPorTexto(arrayDeObjetos, texto){
  let propiedadEliminar = '_id'; // Propiedad que deseas eliminar
  let propiedadEliminar1 = 'image'
  let propiedadEliminar2 = '__v'
  
  /* saco las propiedades */
  let array = arrayDeObjetos.map(({ [propiedadEliminar]: _, ...resto }) => resto);
  let array1 = array.map(({ [propiedadEliminar1]: _, ...resto }) => resto);
  let arrayFiltrado = array1.map(({ [propiedadEliminar2]: _, ...resto }) => resto);
  
  /* filtro los valores de las propiedades. */
  let arrayProp = arrayFiltrado.map((e) => String(Object.values(e)))
  console.log(arrayProp);

  let elementosFiltrados = arrayProp.filter((e)=> e.toLowerCase().includes(texto.toLowerCase()))


  console.log(elementosFiltrados)
  
  return elementosFiltrados
}
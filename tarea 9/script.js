let ubicacion = document.getElementById("cards")

let url = 'https://mindhub-xj03.onrender.com/api/amazing'
let eventosInternet = []
let fechaInternet


getData(url)

function getData(url) {
  fetch(url)
    .then(respuestaDelServidor => respuestaDelServidor.json())
    .then(datosDeInternet => {
      //  console.log(datosDeInternet)
      eventosInternet = datosDeInternet.events
      console.log(eventosInternet)
      fechaInternet = datosDeInternet.currentDate
      // console.log(fechaInternet)



      if (document.title == "Details") {
        pintadoDetails(eventosInternet)
      }
      if (document.title == "Amazing Events"|| document.title == "Past Events"||document.title == "Upcoming Events") {
        funcionesParaPintar(eventosInternet, fechaInternet)
      }
      if (document.title == "Stats") {

        let arrayYaCalculado = eventStatistics(eventosInternet)
        pintarTabla(arrayYaCalculado)

        let arrayEstimate = upcomingEventStatistics(eventosInternet)
        let arrayAssitance = pastEventStatistics(eventosInternet)
        console.log(arrayEstimate)
        console.log(arrayAssitance)

        pintarUpcoming(arrayEstimate)
        pintarPast(arrayAssitance)
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
      <img src="${evento.image}" class="card-img-top object-fit-cover" style="height: 10rem;" alt="${evento.name}">
      <div class="card-body">
        <h5 class="card-title">${evento.name}</h5>
        <p class="card-text" style="height: 6.5rem;">${evento.description}</p>
        <div class="d-flex justify-content-between align-items-center">
          <h6>$  ${evento.price}</h6>
          <a href="./assets/pages/details.html?id= ${evento._id}" class="rounded-pill border-dark-subtle btn btn-secondary">Details</a>
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
      <img src="${evento.image}" class="card-img-top object-fit-cover" style="height: 10rem;" alt="${evento.name}">
      <div class="card-body">
        <h5 class="card-title">${evento.name}</h5>
        <p class="card-text" style="height: 6.5rem;">${evento.description}</p>
        <div class="d-flex justify-content-between align-items-center">
          <h6>$  ${evento.price}</h6>
          <a href="./details.html?id= ${evento._id}" class="rounded-pill border btn btn-secondary">Details</a>
        </div>
      </div>
    </div>`
  }
  ubic.innerHTML = cardsHTML
}
/* -----------------------------filtrado y envio de las cards a las paginas---------------------------------------- */

// generacion de nuevos  arrys con la condicion que queremos

function impresionDeCards(elementosFiltrados, fechaActual) {




  let dataEventosNext = elementosFiltrados.filter(e => e.date > fechaActual)
  let dataEventosPast = elementosFiltrados.filter(e => e.date < fechaActual)

  if (dataEventosNext.length == 0) {
    dataEventosNext = advertencia()
  }
  if (dataEventosPast.length == 0) {
    dataEventosPast = advertencia()
  }
  if (elementosFiltrados.length == 0) {
    elementosFiltrados = advertencia()
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

  if (isNaN(elementosFiltrados[0])) {
    idElementoFiltrado = elementosFiltrados.map(elemento => Number(elemento[0]))
  } else {
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



function advertencia() {
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


function funcionesParaPintar(arrayDeObjetos, fechActual) {

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

function pintadoDetails(arrayDeObjetos) {

  const queryString = location.search;
  // console.log(queryString)
  const param = new URLSearchParams(queryString);
  // console.log(param);
  const id = param.get("id").trimEnd();
  console.log(id)


  let elementoFiltrado = arrayDeObjetos.filter(obj =>
    // console.log(obj)
    obj._id == id)
  // Object.values(obj).some(value => value == id)) ojo con esta ecuacion quedaba raro con el concierto de metallica

  let elementoFiltrado1 = elementoFiltrado[0]
  console.log(elementoFiltrado)
  pintarDetails(elementoFiltrado1)
}




function pintarDetails(elementoAMostrar) {
  // let container = document.getElementById("details");
  // // let div = document.createElement("div");
  // // div.className = "card"
  let cardHTML

  cardHTML = `
<div class="col-md-10 col-lg-6 ">
  <img src="${elementoAMostrar.image}" class=" rounded-start col-12 p-3"  alt="...">
</div>
<div class="conteiner-fluid col-lg-6 ">
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


/* ---------------------------------funcion tabla Event Statistics--------------------------------------- */

function eventStatistics(arrayDeObjetos) {

  let porcentajeDeAsistencia = arrayDeObjetos.map(objeto => {
    return {
      _id: objeto._id,
      name: objeto.name,
      porcentaje: (objeto.assistance * 100) / objeto.capacity,
      capacidad: objeto.capacity
    };

  })

  let sacandoNaNDePorcentaje = porcentajeDeAsistencia.filter(e => (!isNaN(e.porcentaje)))



  let variableDeAyuda = 0;
  let variableDeAyuda1 = 1e10;
  let objDePorcentajeDeMayorAsistencia = {};
  let objDePorcentajeDeMenorAsistencia = {};
  let objDeMayorCapacidad = {};

  sacandoNaNDePorcentaje.forEach(objeto => {
    if (objeto.porcentaje > variableDeAyuda) {
      variableDeAyuda = objeto.porcentaje
      objDePorcentajeDeMayorAsistencia = { id: objeto._id, nombre: objeto.name, porcentaje: objeto.porcentaje }
    }

  });


  sacandoNaNDePorcentaje.forEach(objeto => {
    if (objeto.porcentaje <= variableDeAyuda) {
      variableDeAyuda1 = objeto.porcentaje
      objDePorcentajeDeMenorAsistencia = { id: objeto._id, nombre: objeto.name, porcentaje: objeto.porcentaje }
    }

  });


  porcentajeDeAsistencia.forEach(objeto => {
    if (objeto.capacidad >= variableDeAyuda1) {

      variableDeAyuda1 = objeto.capacidad
      objDeMayorCapacidad = { id: objeto._id, nombre: objeto.name, capacidad: objeto.capacidad }
    }

  });
  let arrayYaCalculado = [objDePorcentajeDeMayorAsistencia, objDePorcentajeDeMenorAsistencia, objDeMayorCapacidad]

  return arrayYaCalculado
}

function pintarTabla(arrysDeObjetos) {
  let objDePorcentajeDeMayorAsistencia = arrysDeObjetos[0]
  let obDePorcentajeDeMenorAsistencia = arrysDeObjetos[1]
  let objyDePorcentajeDeMayorCapacidad = arrysDeObjetos[2];

  console.log(objDePorcentajeDeMayorAsistencia)

  let tableHTML

  tableHTML = `
                    <tr class="text-center">
                        <td><a href="./details.html?id=${objDePorcentajeDeMayorAsistencia.id}" class="rounded-pill border btn btn-outline-secondary">${objDePorcentajeDeMayorAsistencia.nombre}</a></td>
                        <td><a href="./details.html?id=${obDePorcentajeDeMenorAsistencia.id}" class="rounded-pill border btn btn-outline-secondary">${obDePorcentajeDeMenorAsistencia.nombre}</a></td>
                        <td><a href="./details.html?id=${objyDePorcentajeDeMayorCapacidad.id}" class="rounded-pill border btn btn-outline-secondary">${objyDePorcentajeDeMayorCapacidad.nombre}</a></td>
                    </tr>`

  tabla.innerHTML = tableHTML
}



function upcomingEventStatistics(arrayDeObjetos) {
  /*   arrayDeEstimate.map(e => {
  
  
      if (categoria.includes(e.category)) {
        sumaGanancia += e.estimate * e.price
        porcentajedeattendance += (e.estimate * 100) / e.capacity
        sumasPorCategoria1 = ({ categoria: e.category, Ganancia: parseInt(sumaGanancia), porcentajedeattendance: parseInt(porcentajedeattendance) })
        
        console.log(sumasPorCategoria1)
  
        if (sumasPorCategoria.includes(e.category)) {
          let indiceDeObjeto = sumasPorCategoria.findIndex(g => g.category === sumasPorCategoria1.categoria)
        
        
          if (indiceDeObjeto !== -1) {
            sumasPorCategoria[indiceDeObjeto] = sumasPorCategoria1
          } else {
            sumasPorCategoria.push(sumasPorCategoria1)
          }
        }
      } 
      let matrizFiltrada = arrayDeEstimate.filter(objeto => categoria.includes(objeto.category));
      console.log(matrizFiltrada)
    }) */



  let arrayDeAssitance = [];
  let arrayDeEstimate = [];
  let arrayDeObjetosEstimate = [{}];
  // console.log(arrayDeObjetos)

  arrayDeObjetos.forEach(objeto => {
    if (isNaN(objeto.assistance)) {
      arrayDeEstimate.push(objeto)
    } else {
      arrayDeAssitance.push(objeto)
    }
  })



  let categorias = [...new Set(arrayDeEstimate.map(elemento => elemento.category))]
  datosTabla2 = categorias.map(categoria => {

    //array etimate
    let eventosDeEstaCategoria = arrayDeEstimate.filter(evento => evento.category == categoria)
    let porcentagesDeEstimate = eventosDeEstaCategoria.map(elemento => (elemento.estimate * 100) / elemento.capacity)
    let promedioFinalDeEstimate = porcentagesDeEstimate.reduce((acc, valor) => acc + valor, 0) / porcentagesDeEstimate.length

    // falta codigo que genere las demas propiedades
    let sumaDeGananciasEstimate = eventosDeEstaCategoria.map(elemento => (elemento.estimate * elemento.price))
    let totalDeIngresosEstimate = sumaDeGananciasEstimate.reduce((acc, valor) => (acc + valor), 0)

    let nuevoElementoFilaEstimate = {
      categoria: categoria,
      porcentagesDeEstimate: promedioFinalDeEstimate,
      totalDeIngresos: totalDeIngresosEstimate,

    }

    arrayDeObjetosEstimate.push(nuevoElementoFilaEstimate)
    // console.log(nuevoElementoFilaEstimate)

    return arrayDeObjetosEstimate
  })

  arrayDeObjetosEstimate.shift()

  return arrayDeObjetosEstimate

}


function pastEventStatistics(arrayDeObjetos) {

  let arrayDeAssitance = [];
  let arrayDeEstimate = [];

  let arrayDeObjetosAssitance = [{}];
  // console.log(arrayDeObjetos)

  arrayDeObjetos.forEach(objeto => {
    if (isNaN(objeto.assistance)) {
      arrayDeEstimate.push(objeto)
    } else {
      arrayDeAssitance.push(objeto)
    }
  })

  let categorias = [...new Set(arrayDeEstimate.map(elemento => elemento.category))]
  datosTabla2 = categorias.map(categoria => {
    //arrray Assitance

    let eventosDeEstaCategoria1 = arrayDeAssitance.filter(evento => evento.category == categoria)

    let porcentagesDeAsistencia = eventosDeEstaCategoria1.map(elemento => (elemento.assistance * 100) / elemento.capacity)
    let promedioFinalDeAsistencia = porcentagesDeAsistencia.reduce((acc, valor) => acc + valor, 0) / porcentagesDeAsistencia.length

    // falta codigo que genere las demas propiedades
    let sumaDeGananciasAssistance = eventosDeEstaCategoria1.map(elemento => (elemento.assistance * elemento.price))
    let totalDeIngresosAssitance = sumaDeGananciasAssistance.reduce((acc, valor) => (acc + valor), 0)

    let nuevoElementoFilaAssistance = {
      categoria: categoria,
      porcentageDeAsistencia: promedioFinalDeAsistencia,
      totalDeIngresos: totalDeIngresosAssitance,

    }

    arrayDeObjetosAssitance.push(nuevoElementoFilaAssistance)

    return arrayDeObjetosAssitance


  })

  arrayDeObjetosAssitance.splice(0, 1)

  return arrayDeObjetosAssitance
}


function pintarUpcoming(arrayDeObjetosEstimate) {

  let html = ''

  arrayDeObjetosEstimate.sort((a, b) => b.porcentagesDeEstimate - a.porcentagesDeEstimate)
  arrayDeObjetosEstimate.map(fila =>
    html += `<tr>
    <td>${fila.categoria}</td>
    <td>$${(fila.totalDeIngresos).toLocaleString()}</td>
    <td>${(fila.porcentagesDeEstimate).toFixed(2)}%</td>
    
    </tr>`
  )
  tablaUpcoming.innerHTML = html
}

function pintarPast(arrayDeObjetosAssitance) {

  let html = ''

  arrayDeObjetosAssitance.sort((a, b) => b.porcentageDeAsistencia - a.porcentageDeAsistencia)
  arrayDeObjetosAssitance.map(fila =>
  
  html += `<tr>
    <td>${fila.categoria}</td>
    <td>$${(fila.totalDeIngresos).toLocaleString()}</td>
    <td>${(fila.porcentageDeAsistencia).toFixed(2)}%</td>
    </tr>` 
  )
  tablaPast.innerHTML = html
}
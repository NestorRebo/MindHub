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






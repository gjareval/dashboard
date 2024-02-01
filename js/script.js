
let plot = (data) => { 
  /*GRAFICO TEMPERATURA*/
  const ctx = document.getElementById('temperatureChart');
  
  const dataset = {
    labels: data.hourly.time, /* ETIQUETA DE DATOS */
    datasets: [{
      label: 'Weekly temperature', /* ETIQUETA DEL GRÁFICO */
      data: data.hourly.temperature_2m, /* ARREGLO DE DATOS */
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const config = {
    type: 'line',
    data: dataset,
  };

  const chart = new Chart(ctx, config)

  /*GRAFICO INDICE UV*/
  const ctx2 = document.getElementById('UVChart');
  
  const dataset2 = {
    labels: data.daily.time, /* ETIQUETA DE DATOS */
    datasets: [{
      label: 'Weekly UV index', /* ETIQUETA DEL GRÁFICO */
      data: data.daily.uv_index_max, /* ARREGLO DE DATOS */
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }]
  };

  const config2 = {
    type: 'bar',
    data: dataset2,
    options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
    },
  };
  
  const chart2 = new Chart(ctx2, config2)

  /*GRAFICO PRECIPITACION*/

  const ctx3 = document.getElementById('precipitationChart');
  
  const dataset3 = {
    labels: data.hourly.time, /* ETIQUETA DE DATOS */
    datasets: [{
      label: 'Weekly precipitation probability', /* ETIQUETA DEL GRÁFICO */
      data: data.hourly.precipitation_probability, /* ARREGLO DE DATOS */
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const config3 = {
    type: 'line',
    data: dataset3,
  };

  const chart3 = new Chart(ctx3, config3)
}

let load = (data) => {

  let timezone=data['timezone_abbreviation']
  let timezoneHTML=document.getElementById('time-zone')
  timezoneHTML.textContent='GTM'+timezone

  let ubication=data['timezone']
  let ubicationHTML=document.getElementById('ubication')
  ubicationHTML.textContent=ubication

  let latitude=data['latitude']
  let latitudeHTML=document.getElementById('latitude')
  latitudeHTML.textContent=latitude

  let longitude=data['longitude']
  let longitudeHTML=document.getElementById('longitude')
  longitudeHTML.textContent=longitude

  const tiempoTranscurrido = Date.now()
  const hoy = new Date(tiempoTranscurrido)
  let date=hoy.toISOString().substring(0,10)
  let dateHTML=document.getElementById('date')
  dateHTML.textContent=date


  //obtener indice de la fecha actual entre el array de fechas
  let fechas=data.daily.time

  function comparar(fecha){
    if(fecha==date) fechaActual=fechas.indexOf(fecha)
  }

  fechas.forEach(element => comparar(element))

  let maxTemp=data.daily.temperature_2m_max[fechaActual]
  let maxTempHTML=document.getElementById('max-temperature')
  maxTempHTML.textContent=maxTemp+' °C'

  let minTemp=data.daily.temperature_2m_min[fechaActual]
  let minTempHTML=document.getElementById('min-temperature')
  minTempHTML.textContent=minTemp+' °C'

  let sunrise=data.daily.sunrise[fechaActual]
  let sunriseHTML=document.getElementById('sunrise')
  sunriseHTML.textContent=sunrise.substring(11)+' AM'

  let sunset=data.daily.sunset[fechaActual]
  let sunsetHTML=document.getElementById('sunset')
  sunsetHTML.textContent=sunset.substring(11)+ 'PM'

  let windspeed=data.daily.windspeed_10m_max[fechaActual]
  let windspeedHTML=document.getElementById('windspeed')
  windspeedHTML.textContent=windspeed+' km/h'

  let winddirection=data.daily.winddirection_10m_dominant[fechaActual]
  let winddirectionHTML=document.getElementById('winddirection')
  winddirectionHTML.textContent=winddirection+'°'

 

  plot(data)

}

let loadInocar = () => { 
  let URL_proxy='https://cors-anywhere.herokuapp.com/'
  let URL = URL_proxy+'https://www.inocar.mil.ec/mareas/consultan.php';

fetch(URL)
  .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "text/html");
      let contenedorMareas = xml.getElementsByTagName('div')[0];
      let contenedorHTML= document.getElementById('table-container');
      contenedorHTML.innerHTML=contenedorMareas.innerHTML
    })
  .catch(console.error);

}

(
  function () {
    loadInocar();

    let URL ='https://api.open-meteo.com/v1/forecast?latitude=-2.20&longitude=-79.89&hourly=temperature_2m,relativehumidity_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,windspeed_10m_max,winddirection_10m_dominant&timezone=auto'
    

    fetch(URL)
    .then(response => response.json())
    .then(data => {
      load(data);
      console.log(data);
      localStorage.setItem("meteo", JSON.stringify(data))

      
    })
    .catch(console.error);   
  }
)();
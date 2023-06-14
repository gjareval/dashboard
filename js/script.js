
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
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };
  
  const chart2 = new Chart(ctx2, config2)
}

(
    function () {
        let URL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.14&longitude=-79.97&hourly=temperature_2m,precipitation_probability,rain,visibility&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto'
        fetch(URL)
        .then(response => response.json())
        .then(data => {
            console.log(data)

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

          plot(data)
          
        })
        .catch(console.error);    
    }
  )();
var data = [];

var tempData = [];
var humData = [];
var co2Data = [];
var no2Data = [];
var covData = [];
var pm1Data = [];
var pm2p5Data = [];
var pm10Data = [];

async function fetch_temp() {

    const response = await fetch("https://purifeye-app.herokuapp.com/api/entries/temperature");
    const dbData = await response.json();
    const tData = dbData.map(row => {
      return {
        value: row.value,
        timestamp: new Date(row.createdAt).getTime()
      };
    });

    tempData = tData;

    return tData;
}
  

async function fetch_hum() {
    
    const response = await fetch("https://purifeye-app.herokuapp.com/api/entries/humidity");
    const dbData = await response.json();
    const tData = dbData.map(row => {
      return {
        value: row.value,
        timestamp: new Date(row.createdAt).getTime()
      };
    });

    humData = tData;

    return tData;
}

async function fetch_co2() {
    
    const response = await fetch("https://purifeye-app.herokuapp.com/api/entries/CO2");
    const dbData = await response.json();
    const tData = dbData.map(row => {
      return {
        value: row.value,
        timestamp: new Date(row.createdAt).getTime()
      };
    });

    co2Data = tData;

    return tData;
}

async function fetch_no2() {
    
    const response = await fetch("https://purifeye-app.herokuapp.com/api/entries/NO2");
    const dbData = await response.json();
    const tData = dbData.map(row => {
      return {
        value: row.value,
        timestamp: new Date(row.createdAt).getTime()
      };
    });

    no2Data = tData;

    return tData;
}

async function fetch_cov() {
    
    const response = await fetch("https://purifeye-app.herokuapp.com/api/entries/COV");
    const dbData = await response.json();
    const tData = dbData.map(row => {
      return {
        value: row.value,
        timestamp: new Date(row.createdAt).getTime()
      };
    });

    covData = tData;

    return tData;
}

async function fetch_pm1() {
    
    const response = await fetch("https://purifeye-app.herokuapp.com/api/entries/PM/1");
    const dbData = await response.json();
    const tData = dbData.map(row => {
      return {
        value: row.value,
        timestamp: new Date(row.createdAt).getTime()
      };
    });

    pm1Data = tData;

    return tData;
}

async function fetch_pm2p5() {
    
  const response = await fetch("https://purifeye-app.herokuapp.com/api/entries/PM/2p5");
  const dbData = await response.json();
  const tData = dbData.map(row => {
    return {
      value: row.value,
      timestamp: new Date(row.createdAt).getTime()
    };
  });

  pm2p5Data = tData;

  return tData;
}

async function fetch_pm10() {
    
  const response = await fetch("https://purifeye-app.herokuapp.com/api/entries/PM/10");
  const dbData = await response.json();
  const tData = dbData.map(row => {
    return {
      value: row.value,
      timestamp: new Date(row.createdAt).getTime()
    };
  });

  pm10Data = tData;

  return tData;
}

const form = document.getElementById("filter-form");
const subtype = form.getAttribute("subtype");

var indexName;
var fetchUrl;
var borderColor;
var backgroundColor;

var TempValues = [];
var abs_hum = [];

function computeAbsoluteHumidity(humidity, temperature) {
    const t = calculateMeanTemperature(temperature, humidity);

    for (let i = 0; i < humidity.length; i++) {
      const rh = humidity[i].value;
      const ah = 216.7 * ((rh/100) * 6.112 * Math.exp((17.62*t)/(243.12 + t))) / (273.15 + t);
      abs_hum.push(ah);
    }
}
  
function calculateMeanTemperature(temperature, humidity) {
    const start = humidity[0].timestamp;
    const end = humidity[humidity.length - 1].timestamp;
    const tempInRange = temperature.filter((temp) => temp.timestamp >= start && temp.timestamp <= end);
    const sum = tempInRange.reduce((acc, curr) => acc + curr.value, 0);
    return sum / tempInRange.length;
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function createChart(chartData, timestampData) {

    const formattedTimestamps = timestampData.map(timestamp => {
        return formatTimestamp(timestamp);
    });

    let fdatasets = [];

    if(subtype == "temperature")
    {
        fdatasets.push({
            label: 'Température (°C)',
            data: tempData.map(entry => entry.value),  
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.4,
        });
    }
    else if(subtype == "humidity")
    {
        fdatasets.push({
            label: 'Humidité relative (%)',
            data: humData.map(entry => entry.value),
            borderColor: 'rgb(99, 99, 255)',
            backgroundColor: 'rgba(99, 99, 255, 0.2)',
            tension: 0.4,
        });

        fdatasets.push({
            label: "Humidité absolue (g/m³)",
            data: abs_hum,
            borderColor: 'rgb(150, 150, 150)',
            backgroundColor: 'rgba(150, 150, 150, 0.2)',
            yAxisID: 'y-axis-2',
            tension: 0.2,
        });
    }
    else if(subtype == "co2")
    {
        fdatasets.push({
            label: 'CO2 (ppm)',
            data: co2Data.map(entry => entry.value),
            borderColor: 'rgb(255, 192, 0)',
            backgroundColor: 'rgba(255, 192, 0, 0.2)',
            tension: 0.4,
        });
    }
    else if(subtype == "no2")
    {
        fdatasets.push({
            label: 'NO2 (ppm)',
            data: no2Data.map(entry => entry.value),
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            tension: 0.4,
        });
    }
    else if(subtype == "cov")
    {
        fdatasets.push({
            label: 'COV (ppb)',
            data: covData.map(entry => entry.value),
            borderColor: 'rgb(153, 102, 255)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            tension: 0.4,
        });
    }
    else if(subtype == "pm")
    {
        fdatasets.push({
            label: 'Particules 1µm (µg/m³)',
            data: pm1Data.map(entry => entry.value),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
        });
    
        fdatasets.push({
            label: 'Particules 2.5µm (µg/m³)',
            data: pm2p5Data.map(entry => entry.value),
            borderColor: 'rgb(75, 142, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
        });
    
      fdatasets.push({
          label: 'Particules 10µm (µg/m³)',
          data: pm10Data.map(entry => entry.value),
          borderColor: 'rgb(75, 92, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
      });
    }

    const chart = new Chart('chart', {
        type: 'line',
        data: {
            labels: formattedTimestamps,
            datasets: fdatasets
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                }
            },
            responsive: false
        }
    });

    return chart;
}

var tempchart;
const selectStart = document.getElementById('select-start');
const selectEnd = document.getElementById('select-end');

function computeStats(data, startTimestamp, endTimestamp) {

    const filteredData = data.filter((elem) => {
        return elem.timestamp >= startTimestamp && elem.timestamp <= endTimestamp;
    });

    const maxTemp = Math.max(...filteredData.map((elem) => elem.value));

    const minTemp = Math.min(...filteredData.map((elem) => elem.value));

    const avgTemp =
        filteredData.reduce((sum, elem) => sum + elem.value, 0) /
        filteredData.length;

    return {
        maxTemp: maxTemp,
        minTemp: minTemp,
        avgTemp: avgTemp,
    };
}

async function loadDBValues() {    
    if(subtype == "humidity")
        computeAbsoluteHumidity(humData, tempData);

    if(subtype == "temperature")
    {
        data = tempData;
    }
    else if(subtype == "humidity")
    {
        data = humData;
    }
    else if(subtype == "co2")
    {
        data = co2Data;
    }
    else if(subtype == "no2")
    {
        data = no2Data;
    }
    else if(subtype == "cov")
    {
        data = covData;
    }
    else if(subtype == "pm")
    {
        data = pm1Data;
    }

    const chartData = data.map(entry => entry.value);
    const timestampData = data.map(entry => entry.timestamp);
    mychart = createChart(chartData, timestampData);

    const timestamps = data.map(obj => obj.timestamp);

    for (let ts = 0; ts < timestamps.length; ts++) {
        const option = document.createElement('option');
        option.text = new Date(timestamps[ts]).toLocaleString('fr-FR', {
            day: 'numeric',
            month: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
        option.value = timestamps[ts];
        selectStart.add(option);


        const endOption = document.createElement('option');
        endOption.text = new Date(timestamps[ts]).toLocaleString('fr-FR', {
            day: 'numeric',
            month: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
        endOption.value = timestamps[ts];
        selectEnd.add(endOption);
    }

    selectStart.value = timestamps[0];

    selectEnd.value = timestamps[timestamps.length - 1];

    let stats = computeStats(data, timestamps[0], timestamps[timestamps.length - 1]);

    var peakTemp = stats.maxTemp;
    var avgTemp = stats.avgTemp;
    var minTemp = stats.minTemp;

    var peakSpan = document.getElementById("peakvalue");
    var avgSpan = document.getElementById("avgvalue");
    var minSpan = document.getElementById("minvalue");

    peakSpan.innerHTML = peakTemp;
    avgSpan.innerHTML = avgTemp.toFixed(2);
    minSpan.innerHTML = minTemp;
}

async function fetchDatas() {
    await Promise.all([
      fetch_temp(),
      fetch_hum(),
      fetch_co2(),
      fetch_no2(),
      fetch_cov(),
      fetch_pm1(),
      fetch_pm2p5(),
      fetch_pm10()
    ]);

    loadDBValues();
}


function updateChartData(chart, data, startDate, endDate) {
    const filteredData = data.filter((item) => {
        const itemDate = new Date(item.timestamp);
        return itemDate >= new Date(parseInt(startDate)) && itemDate <= new Date(parseInt(endDate));
    });

    chart.data.datasets[0].data = filteredData.map((item) => item.value);
    chart.data.labels = filteredData.map((item) => formatTimestamp(item.timestamp));
    chart.update();
}


document.getElementById('filter-form').addEventListener('change', (event) => {
    event.preventDefault();

    const startDate = selectStart.value;
    const endDate = selectEnd.value;

    if (endDate < startDate) {
        alert('La date de fin doit être supérieure à la date de début.');
        return;
    }

    let stats = computeStats(data, startDate, endDate);

    var peakTemp = stats.maxTemp;
    var avgTemp = stats.avgTemp;
    var minTemp = stats.minTemp;

    var peakSpan = document.getElementById("peakvalue");
    var avgSpan = document.getElementById("avgvalue");
    var minSpan = document.getElementById("minvalue");

    peakSpan.innerHTML = peakTemp;
    avgSpan.innerHTML = avgTemp.toFixed(2);
    minSpan.innerHTML = minTemp;

    updateChartData(mychart, data, startDate, endDate);
});

fetchDatas();

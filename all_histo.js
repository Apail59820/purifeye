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

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function createChart() {

    const timestampData = pm10Data.map(entry => entry.timestamp);

    const formattedTimestamps = timestampData.map(timestamp => {
        return formatTimestamp(timestamp);
    });



    let fdatasets = [];

    fdatasets.push({
            label: 'Température (°C)',
            data: tempData.map(entry => entry.value),  
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.4,
    });

    fdatasets.push({
        label: 'Humidité relative (%)',
        data: humData.map(entry => entry.value),
        borderColor: 'rgb(99, 99, 255)',
        backgroundColor: 'rgba(99, 99, 255, 0.2)',
        tension: 0.4,
    });

    fdatasets.push({
        label: 'CO2 (ppm)',
        data: co2Data.map(entry => entry.value),
        borderColor: 'rgb(255, 192, 0)',
        backgroundColor: 'rgba(255, 192, 0, 0.2)',
        tension: 0.4,
    });

    fdatasets.push({
        label: 'NO2 (ppm)',
        data: no2Data.map(entry => entry.value),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        tension: 0.4,
    });

    fdatasets.push({
        label: 'COV (ppb)',
        data: covData.map(entry => entry.value),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.4,
    });

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
    const chart = new Chart('chart_all', {
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


async function fetchData() {
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
    
    createChart();
}


fetchData();
var data = [];


function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function createTemperatureChart(temperatureData, timestampData) {

    const formattedTimestamps = timestampData.map(timestamp => {
        return formatTimestamp(timestamp);
    });

    const chart = new Chart('chart', {
        type: 'line',
        data: {
            labels: formattedTimestamps,
            datasets: [{
                label: 'Température',
                data: temperatureData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
            }]
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

    const maxTemp = Math.max(...filteredData.map((elem) => elem.temperature));

    const minTemp = Math.min(...filteredData.map((elem) => elem.temperature));

    const avgTemp =
        filteredData.reduce((sum, elem) => sum + elem.temperature, 0) /
        filteredData.length;

    return {
        maxTemp: maxTemp,
        minTemp: minTemp,
        avgTemp: avgTemp,
    };
}

function loadDBValues() {
    fetch('http://localhost:8080/api/entries/temperature')
        .then(response => response.json())
        .then(dbData => {
            const newData = dbData.map(row => {
                return {
                    temperature: row.value,
                    timestamp: new Date(row.createdAt).getTime()
                }
            });
            data = newData;

            const temperatureData = data.map(entry => entry.temperature);
            const timestampData = data.map(entry => entry.timestamp);
            tempchart = createTemperatureChart(temperatureData, timestampData);

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

        })
        .catch(error => console.error(error));
}
loadDBValues();



function updateChartData(chart, data, startDate, endDate) {
    const filteredData = data.filter((item) => {
        const itemDate = new Date(item.timestamp);
        return itemDate >= new Date(parseInt(startDate)) && itemDate <= new Date(parseInt(endDate));
    });

    chart.data.datasets[0].data = filteredData.map((item) => item.temperature);
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

    updateChartData(tempchart, data, startDate, endDate);
});
const apiKey = '38e819cbdca89d5b9694c9065e755ae4';
const dialogflowApiUrl = 'AIzaSyDe0PEuGGScwAmXgngQRJ2xIKrihu5PSuU';
const cityInput = document.getElementById("city-input");
cityInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});
let barChart;
let dChart;
let lineChart;
let data,data2;
async function getWeather() {
    const city = document.getElementById('city-input').value;
    const toggle=document.getElementById('selectdiv').value;
    console.log(toggle);
    if(toggle =='cel')
    {
        console.log('toggle----'+toggle);
        
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
     data = await response.json();
    const response2 = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=5&appid=${apiKey}&units=metric`)
     data2= await response2.json();
    }
    else
    {
        console.log('toggle2----'+toggle);
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`);
     data = await response.json();
    const response2 = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=5&appid=${apiKey}&units=imperial`)
     data2= await response2.json();
    }
    if (data.cod === 200) {
        const weatherOutput = `
        <img class="image" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon">
        <div class="divcontent">
            <h3>${data.name}</h3>
            <p>Temperature: ${data.main.temp}</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Feels Like: ${data.main.feels_like}</p>
         </div>
        `;
        const condition=data.weather[0].description;
        const condition2=data.weather[0].icon;
        document.getElementById('weather-forecast').innerHTML = weatherOutput;
        const appContainer = document.getElementById('weather-forecast');
        appContainer.style.backgroundImage = "url('#')";
        if (condition.includes('rain')||condition.includes('drizzle')||condition.includes('thunderstorm')) {
            appContainer.style.backgroundImage = "url('rain.jpg')";
        } else if ((condition2 == '50n')||(condition2 == '50d')) {
            appContainer.style.backgroundImage = "url('haze.jpg')";
        } else if (condition.includes('clouds')) {
            appContainer.style.backgroundImage = "url('image.jpg')";
        } else if (condition.includes('clear')) {
            appContainer.style.backgroundImage = "url('clear.jpg')";
        } else if ((condition2 == '13n')||(condition2 == '13d')) {
            appContainer.style.backgroundImage = "url('snow.jpg')";
        } 
        displayWeatherChart(data2);
        displayWeatherChart2(data2);
        displayLineChart(data2);
        
    } else {
        document.getElementById('weather-forecast').innerHTML = `<p>${data.message}</p>`;
    }
}
function displayWeatherChart(data) {
    const ctx = document.getElementById('weather-chart').getContext('2d');
    const labels = data.list.slice(0, 5).map((day, index) => `Day ${index + 1}`);
    const temperatures = data.list.slice(0, 5).map(day => day.main.temp);

    if (barChart) {
        barChart.destroy();
    }

    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature for Next 5 Days',
                data: temperatures,
                backgroundColor: 'rgba(0, 123, 255, 0.4)',  
                borderColor: 'rgba(0, 123, 255, 0.8)',      
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(0, 123, 255, 0.8)', 
                hoverBorderColor: 'rgba(0, 123, 255, 1)',     
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(200, 200, 200, 0.3)', 
                    },
                    ticks: {
                        color: '#ffffff', 
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff', 
                    }
                }
            },
            plugins: {
                legend: {
                    display: true, 
                    labels: {
                        color: '#ffffff', 
                    }
                }
            },
            animation: {
                onComplete: function() {},  
                delay: function(context) {
                    let delay = context.dataIndex * 200; 
                    return delay;
                }
            }
        }
    });
}



async function sendChat() {
    const message = document.getElementById('chat-input').value;
    const response = await fetch(dialogflowApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: message })
    });

    const data = await response.json();
    document.getElementById('chat-output').innerHTML += `<p>User: ${message}</p>`;
    document.getElementById('chat-output').innerHTML += `<p>Bot: ${data.response}</p>`;
    document.getElementById('chat-input').value = ''; 
}
function displayWeatherChart2(data) {
    const ctx = document.getElementById('weather-chart2').getContext('2d');
    const weatherConditions = data.list.slice(0, 5).map(day => day.weather[0].main);
    const weatherCounts = {};
    weatherConditions.forEach(condition => {
        weatherCounts[condition] = (weatherCounts[condition] || 0) + 1;
    });
    const labels = Object.keys(weatherCounts);
    const counts = Object.values(weatherCounts);

    if (dChart) {
        dChart.destroy();
    }

    dChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: [
                    'rgba(255, 193, 7, 0.6)',   
                    'rgba(0, 123, 255, 0.6)',   
                    'rgba(40, 167, 69, 0.6)',  
                    'rgba(108, 117, 125, 0.6)', 
                    'rgba(220, 53, 69, 0.6)'   
                ],
                borderColor: [
                    'rgba(255, 193, 7, 0.9)',
                    'rgba(0, 123, 255, 0.9)',
                    'rgba(40, 167, 69, 0.9)',
                    'rgba(108, 117, 125, 0.9)',
                    'rgba(220, 53, 69, 0.9)'
                ],
                borderWidth: 1,
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,  
                    labels: {
                        color: '#ffffff',  
                    }
                }
            },
            animation: {
                animateRotate: true, 
                animateScale: true,  
                delay: function(context) {
                    return context.dataIndex * 200; 
                }
            }
        }
    });
}

function displayLineChart(data) {
    const ctx = document.getElementById('weather-chart3').getContext('2d');
    const labels = data.list.slice(0, 5).map((day, index) => `Day ${index + 1}`);
    const temperatures = data.list.slice(0, 5).map(day => day.main.temp);

    if (lineChart) {
        lineChart.destroy();
    }

    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature Change Over Next 5 Days',
                data: temperatures,
                backgroundColor: 'rgba(0, 123, 255, 0.15)',  
                borderColor: 'rgba(0, 123, 255, 0.85)',     
                pointBackgroundColor: '#ffffff',            
                pointBorderColor: 'rgba(0, 123, 255, 1)',   
                borderWidth: 2,
                tension: 0.4,  // Smooth line curve
                fill: true
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(200, 200, 200, 0.3)', 
                    },
                    ticks: {
                        color: '#ffffff', 
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff',  
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,  
                    labels: {
                        color: '#ffffff', 
                    }
                }
            },
            animation: {
                onComplete: function() {}, 
                easing: 'easeInBounce', 
                duration: 1000, 
                delay: function(context) {
                    return context.dataIndex * 300; 
                }
            }
        }
    });
}

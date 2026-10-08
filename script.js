const cityinput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')
const weatherInfoSection = document.querySelector('.weather-info')
/* img */
const notFoundSection = document.querySelector('.not-found')
/* lupa */
const searchCitySection = document.querySelector('.search-city')
/*nome*/
const countryTxt = document.querySelector('.country-txt')
/* temp */
const tmepTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.Wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')

const forecastitemsContainer = document.querySelector('.forecast-items-container')


const api = 'c34d6579e3d36539f84b1193c176b53b';


searchBtn.addEventListener('click', () => {
    if (cityinput.value.trim() != '') {
        updateWeatherInfo(cityinput.value)
        cityinput.value = ''
        cityinput.blur()

    }
})

cityinput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' &&
        cityinput.value.trim() != ''
    ) {
        updateWeatherInfo(cityinput.value)
        cityinput.value = ''
        cityinput.blur()
    }

})
async function getFetchData(endPoint, city) {
    const apiurl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${api}&units=metric`

    const respose = await fetch(apiurl)

    return respose.json()
}

function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}


function getCurrentDate() {
    const currentData = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
    }
    return currentData.toLocaleDateString('pt-br', options)
}

async function updateWeatherInfo(city) {
    const weatherDate = await getFetchData('weather', city)


    if (weatherDate.cod != 200) {
        showDisplaySection(notFoundSection)
        return
    }



    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherDate

    countryTxt.textContent = country
    tmepTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + 'M/s'


    currentDateTxt.textContent = getCurrentDate()


    weatherSummaryImg.src = `assent/weather/${getWeatherIcon(id)}`

    await updateForecastInfo(city)
    showDisplaySection(weatherInfoSection)
}


async function updateForecastInfo(city) {
    const forecastData = await getFetchData('forecast', city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastitemsContainer.innerHTML = ''
    forecastData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastWeather)
        }
    })
}


function updateForecastItems(weatherDate) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherDate


const dataTaken = new Date(date)
const dataOption = {
    day : '2-digit',
    month : 'short',
}

const dateResult = dataTaken.toLocaleDateString('pt-br',dataOption)

    const forecastitem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="assent/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
        </div>
`

forecastitemsContainer.insertAdjacentHTML('beforeend',forecastitem)
}


function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')

    section.style.display = 'flex'
}
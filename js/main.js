const WEATHER_PROTOCOL = "http";
const WEATHER_ENDPOINT = "api.openweathermap.org/data/2.5/weather";
const API_KEY = "";

const btn = document.getElementById("sendButton");
const main = document.getElementById("main");
const inputElement = document.getElementById("search");

const INFO_WEATHER_CACHE_KEY = 'infoWeatherCache';

const DEFAULT_YOUTUBE_VIDEO = "K3yuxVv7dfo";
let currentYouTubeIdVideo = DEFAULT_YOUTUBE_VIDEO;

window.onload = function() {
    let weather = JSON.parse(localStorage.getItem(INFO_WEATHER_CACHE_KEY));

    if(weather != null && Object.keys(weather).length !== 0) {
        madeWeatherHtml(weather);
        madeYouTubeBackgroundVideo(weather.tipoClima);
    } else {
        madeYouTubeBackgroundVideo("Default");
    }
}

btn.addEventListener("click", () => {
    searchWeatherByCitiName(inputElement.value);
})

function searchWeatherByCitiName(cityName) {
    let fetchPromise = fetch(`${WEATHER_PROTOCOL}:\/\/${WEATHER_ENDPOINT}?q=${cityName}&appid=${API_KEY}&units=metric&lang=es`);
    
    fetchPromise.then(Response => {
        return Response.json();

    }).then(result => {
        let weather = crearWeather(result);
        madeWeatherHtml(weather);
        madeYouTubeBackgroundVideo(weather.tipoClima);

    }).catch(err => {
        console.log("Ups something horrible has come: ", err);
        madeHtmlWithError();
        madeYouTubeBackgroundVideo("Error");
    })
}

function madeWeatherHtml(weather) {
    main.innerHTML = `<div class="container-fluid">`
        + `    <div class="row details">`
        + `        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 text-center text-md-left text-xl-left text-lg-left">`
        + `            <img src="${weather.pathIconoClima}"/>`
        + `            <p>${weather.clima}</p>`
        + `            <h2>${weather.ciudad}</h2>`
        + `        <h5>${weather.horaActual}</h5>`
        + `    </div>`
        + `    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 text-center text-md-right text-xl-right text-lg-right mt-5">`
        + `        <p>Humedad: ${weather.humedad}</p>`
        + `        <p>Velocidad del viento: ${weather.velocidadViento}</p>`
        + `        <p>Presión atmosférica: ${weather.presionAtmosferica}</p>`
        + `        <h6 class="hdate">${weather.fechaHoy}</h6>`
        + `    </div>`
        + `</div>`
        + `<div class="row justify-content-center">`
        + `    <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 justify-content-center card">`
        + `        <h3>Temperatura</h3>`
        + `        <h4>${weather.temperaturaActual}</h4>`
        + `        <p>Sensación térmica: ${weather.sensacionTermica}</p>`
        + `    </div>`
        + `    <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 justify-content-center card">`
        + `        <h3>Temperatura Máxima</h3>`
        + `        <h4>${weather.temperaturaMaxima}</h4>`
        + `    </div>`
        + `    <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 justify-content-center card">`
        + `        <h3>Temperatura Mínima</h3>`
        + `        <h4>${weather.temperaturaMinima}</h4>`
        + `    </div>`
        + `</div>`
    + `</div>`;

    localStorage.setItem(INFO_WEATHER_CACHE_KEY, JSON.stringify(weather));
}

function madeHtmlWithError() {
    main.innerHTML = `<h2 class="msjError">Por favor ingresá una ciudad válida</h2>`;
}

function madeYouTubeBackgroundVideo(weatherType) {
    const idVideo = resolverIdVideo(weatherType);
    currentYouTubeIdVideo = idVideo;
    player.loadVideoById(idVideo);
}

function crearWeather(data) {
    return {
        pathIconoClima: "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png",
        clima: transformarCapital(data.weather[0].description),
        ciudad: data.name + ", " + data.sys.country,
        horaActual: horaHoy() + " Hora actual de tu región",
        humedad: data.main.humidity + "%",
        velocidadViento: data.wind.speed + "km/h",
        presionAtmosferica: data.main.pressure + "hPa",
        fechaHoy: "Fecha de hoy " + fechaHoy(),
        temperaturaActual: data.main.temp + "°C",
        sensacionTermica: data.main.feels_like + "°C",
        temperaturaMaxima: data.main.temp_max + "°C",
        temperaturaMinima: data.main.temp_min + "°C",
        tipoClima: data.weather[0].main
    }
}

function transformarCapital(texto) {
    let textoCapital = "";
    for(let i=0; i<texto.length; i++) {
        if(i==0) {
            textoCapital+=texto.charAt(i).toUpperCase();
        } else {
            if(texto.charAt(i-1) == " ") {
                textoCapital+=texto.charAt(i).toUpperCase();
            } else {
                textoCapital+=texto.charAt(i);
            }
        }
    }
    return textoCapital;
}

function fechaHoy() {
    let date = new Date();
    let dia = date.getDate() < 10 ? "0" + date.getDate() : date.getDate().toString();
    let mes = date.getMonth()+1 < 10 ? "0" + (date.getMonth()+1) : (date.getMonth()+1).toString();
    let anio = date.getFullYear().toString();
    return dia + "/" + mes + "/" + anio;
}

function horaHoy() {
    let date = new Date();
    let hora = date.getHours() < 10 ? "0" + date.getHours() : date.getHours().toString();
    let minutos = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return hora + ":" + minutos;
}

function resolverIdVideo(weatherType) {
    switch (weatherType) {
        case "Thunderstorm":
            return "zUNEFefftt8";
        case "Drizzle":
            return "oRhrjhuozb0";
        case "Rain":
            return "oRhrjhuozb0";
        case "Snow":
            return "vz91QpgUjFc";
        case "Mist":
            return "hZdo1X-B8mU";
        case "Smoke":
            return "hZdo1X-B8mU";
        case "Haze":
            return "hZdo1X-B8mU";
        case "Fog":
            return "hZdo1X-B8mU";
        case "Ash":
            return "hZdo1X-B8mU";
        case "Dust":
            return "_ecHrRLRoZE";
        case "Sand":
            return "_ecHrRLRoZE";
        case "Squall":
            return "1r2fchpwNEI";
        case "Tornado":
            return "duOiLf7xQis";
        case "Clouds":
            return "N30xWvKdpQ4";
        case "Clear":
            return "A1pw9wxqC6I";
        case "Error":
            return "T_WSXXPQYeY";
        case "Default":
        default:
            return DEFAULT_YOUTUBE_VIDEO;
    }
}

/** YouTube background Video **/
let tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: `${currentYouTubeIdVideo}`,
        playerVars: { 'autoplay': 1, 'controls': 0 },
        events: {
            'onReady': function (event) {
                event.target.setVolume(0);
                event.target.playVideo();
            },
            'onStateChange': function (event) {
                if (event.data === YT.PlayerState.ENDED) {
                    event.target.loadVideoById({
                        videoId: `${currentYouTubeIdVideo}`,
                        startSeconds: 0,
                        endSeconds: 0
                    });
                }
            }
        }
    });
}


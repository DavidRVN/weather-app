import React, { useState, useEffect } from 'react';
import WavesIcon from '@mui/icons-material/Waves';
import AirIcon from '@mui/icons-material/Air';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import SearchIcon from '@mui/icons-material/Search';
import WeatherApp from './WeatherApp ';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ShutterSpeedIcon from '@mui/icons-material/ShutterSpeed';


function obtenerFechaEnFormato() {
  const fecha = new Date();

  // Obtenemos el año, el mes y el día
  const año = fecha.getFullYear();
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // +1 porque enero es 0
  const dia = fecha.getDate().toString().padStart(2, '0');

  // Formateamos la fecha
  const fechaFormateada = `${año}-${mes}-${dia}`;

  return fechaFormateada;
}

function obtenerFechaEnFormatos() {
  const fecha = new Date();
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const diaSemana = diasSemana[fecha.getDay()];
  const mes = meses[fecha.getMonth()];
  const fechaFormateada = `${diaSemana} ${fecha.getDate()} ${mes}`;
  return fechaFormateada;
}

function formatearFecha(date){
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const diaSemana = diasSemana[date.getDay()];
  const mes = meses[date.getMonth()];
  const fechaFormateada = `${diaSemana} ${date.getDate()} ${mes}`;
  return fechaFormateada;
}



function App() {
  const [data, setData] = useState(null);
  const [dataAstro, setDataAstro] = useState(null);
  const [dataForecast, setDataForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("Medellín"); // Valor por defecto
  const [future, setFuture] = useState(null);
  const fechaActual = obtenerFechaEnFormato();
  const fechaActualFormateada = obtenerFechaEnFormatos();
  const fechaEspecifica = new Date('2023-09-15');
  const fechaFormateada = formatearFecha(fechaEspecifica);

  useEffect(() => {
    if (city) {
      const apiKey = '21935440fce548bfb4f143648232809';
      const weatherApiURL = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no&lang=es`;
      const astroApiURL = `https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${city}&dt=${fechaActual}`;
      const forecastURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=yes&alerts=no`;
      const futureURL = `https://api.weatherapi.com/v1/future.json?key=${apiKey}&q=${city}&dt=${fechaActual}`

      Promise.all([
        fetch(weatherApiURL),
        fetch(astroApiURL),
        fetch(forecastURL),
        fetch(futureURL)
      ])
        .then(([responseWeather, responseAstro, responseForecast, responseFuture]) => {
          if (!responseWeather.ok || !responseAstro.ok || !responseForecast.ok || responseFuture.ok) {
            throw new Error('La solicitud no fue exitosa.');
          }
          return Promise.all([responseWeather.json(), responseAstro.json(), responseForecast.json(), responseFuture.json()]);
        })
        .then(([weatherData, astroData, forecastData, futureData]) => {
          setData(weatherData);
          setDataAstro(astroData);
          setDataForecast(forecastData);
          setFuture(futureData);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [city]);

  return (
    <div className="App">   
    <Container>
      <Row className='margin' >
      <Col md={6}>
        <input type='text' placeholder='Buscar ciudad preferida...'  id='txt_getCity' />
        </Col>
        <Col md={6}>
        <button onClick={() => setCity(document.getElementById('txt_getCity').value)}>
           <GpsFixedIcon/> &nbsp; Obtener Datos
          </button>
        </Col>
      </Row>

      <Row>
        <Col md={4} >
        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : data ? (
          <div className='items city'>
            <p className='pcity'>{data.location.name}</p>
            <h1 className='hour'>{data.location.localtime.split(' ')[1]}</h1>
            <h2 className='date'> {fechaActualFormateada}</h2>
           
          </div>
        ) : null}
        </Col>
      {dataAstro && !loading && !error && (        
         <Col md={8}>                
          <Row  className='items city'>
              <Col md={4}>
                <div className='items'> 
                  <h2 className='citytemp'>
                    {data.current.temp_c}°C
                  </h2>
                  <span> Amanecer <br />{dataAstro.astronomy.astro.sunrise}</span> <br />
                  <span> Anochecer<br />{dataAstro.astronomy.astro.sunset}</span>
                </div>                
              </Col>
              <Col md={4}>
              <img
                src={`https:${data.current.condition.icon}`}
                alt={data.current.condition.text} width={100} height={100}
              /> <p className='elementoP'>
              {data.current.condition.text}
            </p>
              </Col>
              <Col md={4}>
                <Row>
                    <Col md={6} className='icons'>
                    <WavesIcon /> <br />
                      {data.current.humidity}% <br />humedad
                    </Col>
                    <Col md={6} className='icons'>
                      <AirIcon /> <br />
                      {data.current.wind_mph}Km/h Velocidad del viento 
                    </Col>
                      <Col md={6} className='icons'>
                        <ShutterSpeedIcon/> <br/>
                        Presión {data.current.pressure_in} 
                      </Col>
                      <Col md={6} className='icons'>               
                          <Brightness7Icon/> <br/>
                          UV  {data.current.uv}                                                            
                      </Col>
                </Row>
              </Col>              
          </Row>        
        </Col>
       )}
      </Row>

      <Row>

        <Col md={6}>
        {dataForecast && dataForecast.forecast && dataForecast.forecast.forecastday ? (         
          <div className='items city'>
             <h2>Pronóstico de 5 días</h2> 
             {dataForecast.forecast.forecastday.map((day, index) => (
              <div key={index} className="ptext">
                <img
                  src={`https:${day.day.condition.icon}`}
                  alt={day.day.condition.text}
                  width={50}
                  height={50}
                
                /> <span> {day.day.avgtemp_c}°C &nbsp;&nbsp; {formatearFecha(new Date(day.date))}</span>
              </div>
            ))}
          </div>
        ) : null} 
        </Col>
        
        <Col md={6}>
         <WeatherApp city={city}/>
        </Col>
        
      </Row>

    </Container>
    </div>
  );
}
export default App;
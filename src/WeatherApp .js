import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

const WeatherApp = ({ city }) => {
  const [weatherData, setWeatherData] = useState([]);
  const apiKey = '21935440fce548bfb4f143648232809';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=no`
        );
        const data = await response.json();
        const filteredHours = data.forecast.forecastday[0].hour.filter(
          (hour) => hour.time.includes('00:00') || hour.time.includes('12:00') || hour.time.includes('09:00')  || hour.time.includes('15:00') || hour.time.includes('18:00') || hour.time.includes('21:00')
        );
        setWeatherData(filteredHours);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures useEffect runs once after initial render

  return (
    <Container >
        <Row className='items city'>
        <h1>Pronóstico por horas</h1><br/><br/><br/>
        {weatherData.map((hour) => (
          <Col md={2} key={hour.time} >
                {hour.time.split(' ')[1]} <br/>
    {hour.temp_c}°C  
   <img
    src={`https:${hour.condition.icon}`}
    alt={hour.condition.text} width={64} height={60}
  />
  <br/>
  {hour.wind_mph}km/h
          </Col>
        ))}
        </Row>
    </Container>
  );
};

export default WeatherApp;

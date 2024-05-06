import './App.css';
import React, { useEffect, useState, useRef } from 'react';

function App() {
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [weather, setWeather] = useState({ description: '-', temperature: '-°C' });
  const [time, setTime] = useState({ hour: '-', minute: '-', second: '-', ampm: '-' });
  const [date, setDate] = useState({ day: '-', date: '-', month: '-', year: '-' });
  const [battery, setBattery] = useState({ level: '-%', status: '-' });
  const [batteryIndicator, setBatteryIndicator] = useState('fa fa-battery-empty');
  const [mode, setMode] = useState(true);

  useEffect(() => {

    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition(position => { 
        let latitude = position.coords.latitude
        let longitude = position.coords.longitude
        setLocation({latitude,longitude})
      })
    }

    const fetchData = () => {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=5dbc9f8305c168560a9ced7e34292794`)
        .then(response => response.json())
        .then(data => {
          let description = data.weather[0].description;
          let temperature = (data.main.temp - 273.15).toFixed(0) + ' °C';
          setWeather({ description, temperature });
          console.log("Weather data fetched successfully!");
        })
        .catch(error => {
          console.error("Error fetching weather data:", error);
        });
    };

    const updateTime = () => {
      const currentDate = new Date();
      let ampm = 'AM';
      let hour = currentDate.getHours();
      if (hour > 12) {
        hour = String(currentDate.getHours() - 12).padStart(2, '0');
        ampm = 'PM';
      }
      if (hour === 0) {
        hour = 12;
      }
      const minute = String(currentDate.getMinutes()).padStart(2, '0');
      const second = String(currentDate.getSeconds()).padStart(2, '0');
      setTime({ hour, minute, second, ampm });
    };

    const updateDate = () => {
      const currentDate = new Date();
      let day = currentDate.getDay();
      let date = currentDate.getDate();
      let month;
      switch (currentDate.getMonth()) {
        case 0:
          month = 'JAN';
          break;
        case 1:
          month = 'FEB';
          break;
        case 2:
          month = 'MAR';
          break;
        case 3:
          month = 'APR';
          break;
        case 4:
          month = 'MAY';
          break;
        case 5:
          month = 'JUN';
          break;
        case 6:
          month = 'JUL';
          break;
        case 7:
          month = 'AUG';
          break;
        case 8:
          month = 'SEP';
          break;
        case 9:
          month = 'OCT';
          break;
        case 10:
          month = 'NOV';
          break;
        case 11:
          month = 'DEC';
          break;
        default:
          month = '-';
      }
      let year = currentDate.getFullYear();
      setDate({ day, date, month, year });
    };

    const fetchBatteryStatus = () => {
      if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
          const batteryStatus = () => {
            let batteryPercentage = (battery.level * 100).toFixed(0) + '%';
            let batteryChargingStatus = battery.charging ? 'Yes' : 'No';
            setBattery({ batteryPercentage, batteryChargingStatus });
            if (battery.level * 100 >= 75) setBatteryIndicator('fa fa-battery-full');
            else if (battery.level * 100 >= 50 && battery.level * 100 < 75) setBatteryIndicator('fa fa-battery-three-quarters');
            else if (battery.level * 100 >= 25 && battery.level * 100 < 50) setBatteryIndicator('fa fa-battery-half');
            else setBatteryIndicator('fa fa-battery-quarter');
          };
          battery.addEventListener('chargingchange', batteryStatus);
          battery.addEventListener('levelchange', batteryStatus);
          batteryStatus();
        });
      }
    };

    fetchLocation();
    fetchData();
    updateDate();
    fetchBatteryStatus();

    const timeIntervalId = setInterval(updateTime, 1000);
    const dateIntervalId = setInterval(updateDate, 60000);

    return () => {
      clearInterval(timeIntervalId);
      clearInterval(dateIntervalId);
    };
  }, [location.latitude, location.longitude]);

  const backGround = useRef(null)
  const foreGround = useRef(null)

  const toggleMode = () => {
    setMode(prevMode => !prevMode);
    const element1 = backGround.current
    const element2 = foreGround.current
    element1.classList.contains('bg-[#01450c]') ? element1.classList.replace('bg-[#01450c]','bg-[#1a1231]') : element1.classList.replace('bg-[#1a1231]','bg-[#01450c]')
    element2.classList.contains('bg-[#b4e698]') ? element2.classList.replace('bg-[#b4e698]','bg-[#4a2560]') : element2.classList.replace('bg-[#4a2560]','bg-[#b4e698]')
    element2.classList.contains('text-[#260000]') ? element2.classList.replace('text-[#260000]','text-[#e0d1fd]') : element2.classList.replace('text-[#e0d1fd]','text-[#260000]')
  };

  return (
    <>
      <section className='bg-[#01450c] h-screen grid fontStyle select-none' ref={backGround}>
        <div className='bg-[#b4e698] m-auto w-9/12 h-fit flex flex-col text-[#260000] outline outline-8 outline-white shadow-lg' ref={foreGround}>
          <div className='h-fit flex justify-end text-3xl p-4'>
            <div className='ml-4 mr-auto pt-3' onClick={toggleMode}>
              <i className={mode ? 'fa fa-sun-o' : 'fa fa-moon-o'}></i>
            </div>
            <p className='w-fit py-4'>NOW:</p>
            <p className='w-fit p-4'>{weather.temperature}</p>
            <p className='w-fit p-4 capitalize'>{weather.description}</p>
          </div>
          <div className='h-fit flex text-9xl justify-center p-4 pt-0'>
            <p className='px-2 w-60 text-right'>{time.hour}:</p>
            <p className='px-2 w-60 text-right'>{time.minute}:</p>
            <p className='px-2 w-60 text-right'>{time.second}</p>
            <p className='text-6xl h-fit mt-auto mb-2'>{time.ampm}</p>
          </div>
          <div className='flex justify-around text-2xl px-8 py-4'>
            <p className={date.day === 0 ? 'opacity-100' : 'opacity-20'}>SUN</p>
            <p className={date.day === 1 ? 'opacity-100' : 'opacity-20'}>MON</p>
            <p className={date.day === 2 ? 'opacity-100' : 'opacity-20'}>TUE</p>
            <p className={date.day === 3 ? 'opacity-100' : 'opacity-20'}>WED</p>
            <p className={date.day === 4 ? 'opacity-100' : 'opacity-20'}>THU</p>
            <p className={date.day === 5 ? 'opacity-100' : 'opacity-20'}>FRI</p>
            <p className={date.day === 6 ? 'opacity-100' : 'opacity-20'}>SAT</p>
          </div>
          <div className='flex text-3xl p-4'>
            <p className='px-4'>{date.date}</p>
            <p className='px-4'>{date.month}</p>
            <p className='px-4'>{date.year}</p>
            <p className='ml-auto mr-1 my-auto'><i className={batteryIndicator}></i></p>
            <p className='mx-0 pr-4 pl-1'>{battery.batteryPercentage}</p>
            <p className='mx-0 text-xl mt-auto'>Charging :</p>
            <p className='mx-0 pr-4 pl-1'>{battery.batteryChargingStatus}</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;

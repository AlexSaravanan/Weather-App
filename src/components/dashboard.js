import React, { useEffect, useState } from "react";
import Search from "./search";
// import SearchIcon from "@mui/icons-material/Search";
import PlaceIcon from "@mui/icons-material/Place";
import NearMeIcon from "@mui/icons-material/NearMe";
import MyLocationIcon from "@mui/icons-material/MyLocation";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MONTH_DATE = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30
];

const YEAR_MONTH = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const API_key = "04a9302c449177dfe557a1ce5a10a525";

function Dashboard() {
  const [searchPage, setSearchPage] = useState(false);
  const [weather, setWeather] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [change, setChange] = useState(true);
  const [focus, setFocus] = useState(true);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const date = new Date()

  const forecastMonth = YEAR_MONTH.slice(date.getMonth(), YEAR_MONTH.length).concat(
    YEAR_MONTH.slice(0, date.getMonth())
  );
  const forecastDate = MONTH_DATE.slice(date.getDate(), MONTH_DATE.length).concat(
    MONTH_DATE.slice(0, date.getDate())
  );
  const forecastDays = WEEK_DAYS.slice(date.getDay(), WEEK_DAYS.length).concat(
    WEEK_DAYS.slice(0, date.getDay())
  );


  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${API_key}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === "200") {
          setWeather(data.list);
         
        }
      })
      .catch((err) => {
        throw err.message;
      });
  }, [lat,lng]);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_key}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === 200) {
          setCurrentWeather(data);
        }
      })
      .catch((err) => {
        throw err.message;
      });
  }, [lat,lng]);

  const getLocation = () => {
    if(!navigator.geolocation){
        console.log('Geo location not supported')
    }else{
        navigator.geolocation.getCurrentPosition((position) => {
            setLat(position.coords.latitude)
            setLng(position.coords.longitude)
        }, () => {
            console.log('Unable to retrive your Location')
        })
    }
  }

  const handleCel = () => {
    setChange(true);
    setFocus(true);
  };
  const handleFar = () => {
    setChange(false);
    setFocus(false);
  };

  return (
    <div
      className="flex flex-col w-full relative sm:flex-row"
      style={{ fontFamily: "Raleway" }}
    >
      {Boolean(searchPage === true) && (
        <Search setSearchPage={setSearchPage} setLat={setLat} setLng={setLng}/>
      )}
      <div
        className=" w-screen h-screen  sm:basis-1/4 text-white p-5 flex flex-col gap-3 "
        style={{ backgroundColor: "#1E213A" }}
      >
        <div className="flex justify-around">
          <button
            className="w-40  h-10 text-base font-medium"
            onClick={() => setSearchPage(true)}
            style={{ backgroundColor: "#6E707A" }}
          >
            Search for Places
          </button>
          {/* <SearchIcon onClick={() => setSearchPage(true)} /> */}
          <MyLocationIcon className="pr-1.5"  onClick={getLocation}/>
        </div>
        {currentWeather && (
          <div className="flex flex-col items-center justify-evenly h-full">
            <div className="flex justify-center">
              <img
                className="sm:w-56 sm:h-60 w-56 "
                // style={{backgroundImage: "url('./icons/Cloud.png')", backgroundCover: 'cover'}}
                src={`./icons/${currentWeather?.weather[0].icon}.png`}
                alt="mainImage"
              />
            </div>
            <h1
              className="text-8xl sm:font-medium sm:text-8xl"
              style={{ color: "#E7E7EB" }}
            >
              {change === true ? Math.round(currentWeather?.main.temp): Math.round((currentWeather?.main.temp*1.8) + 32 )}
              {change === true ? "°C" : "°F"}
            </h1>
            <h5
              className="text-6xl sm:font-semibold sm:text-4xl"
              style={{ color: "#A09FB1" }}
            >
              {currentWeather?.weather[0].main}
            </h5>
            <div>
              <div
                className="flex justify-center w-full "
                style={{ color: "#88869D" }}
              >
                <p className="font-medium text-lg">
                  Today - {forecastDays[6]},{forecastDate[29]},
                  {forecastMonth[0]}
                </p>
              </div>
              <div
                className="flex justify-center w-full"
                style={{ color: "#88869D" }}
              >
                <PlaceIcon className="w-3.5 h-5" />
                <p className="font-semibold text-lg">
                  {currentWeather?.name},{currentWeather?.sys.country}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-black w-full h-screen basis-3/4 flex flex-col px-4 sm:px-10 sm:py-10 overflow-scroll text-white">
        <div className="basis-1/12">
          <div className="sm:flex  justify-end gap-4 pr-36 hidden sm:visible">
            <button
              className={`rounded-full cursor-pointer font-bold text-lg w-7 text-center ${
                focus ? "bg-white" : "bg-slate-700"
              } ${focus ? "text-black" : "text-white"}`}
              onClick={handleCel}
            >
              °C
            </button>
            <button
              className={`rounded-full cursor-pointer font-bold text-lg w-7  text-center ${
                !focus ? "bg-white" : "bg-slate-700"
              } ${!focus ? "text-black" : "text-white"}`}
              onClick={handleFar}
            >
              °F
            </button>
          </div>
        </div>
        <div className="basis-3/12 flex flex-col gap-4 justify-center items-center py-3 w-full">
          <div className="flex flex-wrap justify-start" style={{ gap: "26px" }}>
            {weather &&
              weather?.slice(0, 5).map((data,i) => {
                  return (
                    <div
                      className="h-44 flex justify-evenly flex-col items-center"
                      style={{ backgroundColor: "#1E213A", width: "120px" }}
                    >
                      <p className="text-sm font-medium">
                        {forecastDays[i]},{forecastDate[i]},{forecastMonth[0]}
                      </p>
                      <img
                        className="w-16 h-16"
                        alt="allImage"
                        src={`./icons/${data.weather[0].icon}.png`}
                      />
                      <div className="flex gap-4">
                        <p className="text-sm font-medium">
                          { change === true ? Math.round(data.main.temp_min) : Math.round(((data.main.temp_min)*1.8)+ 32 )}
                          {change === true ? "°C" : "°F"}
                        </p>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#A09FB1" }}
                        >
                          {change === true ? Math.round(data.main.temp_max) : Math.round(((data.main.temp_max)*1.8)+ 32 )}
                          {change === true ? "°C" : "°F"}
                        </p>
                      </div>
                    </div>
                  );
              })}
          </div>
        </div>
        <div className="basis-8/12 py-12 flex flex-col justify-center items-center">
          {currentWeather && (
            <div>
              <h2 className="text-white text-2xl font-bold py-3 sm:w-80">
                Today's Hightlights
              </h2>
              <div className=" ">
                <div className="flex flex-wrap flex-col gap-12 py-2">
                  <div className="flex flex-wrap gap-12 justify-start ">
                    <div
                      className=" h-52 sm:w-80 w-72 align-middle flex flex-col justify-evenly items-center "
                      style={{ backgroundColor: "#1E213A" }}
                    >
                      <p className="text-sm font-medium">wind status</p>
                      <h1 className="text-6xl font-bold">
                        {Math.round(currentWeather?.wind.speed)}{" "}
                        <span className="text-xl">{change === true? 'mph' : 'kph'}</span>
                      </h1>
                      <h4>
                        <NearMeIcon className="rotate-180" />
                        {}WSW
                      </h4>
                    </div>
                    <div
                      className=" h-52 sm:w-80 w-72 align-middle flex flex-col justify-evenly items-center"
                      style={{ backgroundColor: "#1E213A" }}
                    >
                      <p className="text-sm font-medium">humidity</p>
                      <h1 className="text-6xl font-bold">
                        {currentWeather?.main.humidity}{" "}
                        <span className="text-xl !important">%</span>
                      </h1>
                      <p className="w-56 h-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={Number(currentWeather?.main.humidity)}
                          style={{ width: "229px", height: "8px" }}
                        />
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-12 justify-start">
                    <div
                      className=" h-40 sm:w-80 w-72 flex flex-col justify-evenly items-center"
                      style={{ backgroundColor: "#1E213A" }}
                    >
                      <p className="text-sm font-medium">visibility</p>
                      <h1 className="text-6xl font-bold">
                        {currentWeather?.visibility / 1000}{" "}
                        <span className="text-xl">{change === true? 'miles' : 'km'}</span>
                      </h1>
                    </div>
                    <div
                      className=" h-40 sm:w-80 w-72 flex flex-col justify-evenly items-center"
                      style={{ backgroundColor: "#1E213A" }}
                    >
                      <p className="text-sm font-medium">Air pressure</p>
                      <h1 className="text-6xl font-bold">
                        {currentWeather?.main.pressure}{" "}
                        <span className="text-2xl">mb</span>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

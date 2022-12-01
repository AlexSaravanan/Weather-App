import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";

function Search({ setSearchPage,setLat,setLng }) {
  const [searchValue, setSearchValue] = useState();
  const [searchRecommended, setSearchRecommended] = useState([]);
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState(false)
  const [searchLat, setSearchLat] = useState('')
  const [searchLog, setSearchLog] = useState('')



  const handleChange = (e) => {
    setSearchValue(e.target.value);
    setInputValue(e.target.value)
    if(searchRecommended.length === 0){
      setError(true)
   }else{
    setError(false)
   }
  };

  const handleClickLi = (item) => {
    setInputValue(`${item.name},${item.country}`)
    setSearchLat(`${item.lat}`)
    setSearchLog(`${item.lon}`)
    console.log(item)
  }

  const handleClick = (e) => {
    setLat(searchLat);
    setLng(searchLog)
    setSearchPage(false);
  };

  const API_key = "04a9302c449177dfe557a1ce5a10a525";

  useEffect(() => {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=5&appid=${API_key}`
    )
      .then((res) => res.json())
      .then((data) => {
        setSearchRecommended(data);
        
      })
      .catch((err) => {throw err});
  }, [searchValue]);



  return (
    <div className="flex  absolute">
      <div
        className="sm:basis-1/5 h-screen w-screen left-0 top-0 flex flex-col gap-5 p-4"
        style={{ backgroundColor: "#1E213A" }}
      >
        <div className="flex justify-end w-full ">
          <CloseIcon
            onClick={() => setSearchPage(false)}
            style={{ color: "#E7E7EB" }}
          />
        </div>
        <div className="flex justify-center gap-3">
          <div className="relative">
            <SearchIcon
              className="absolute top-3 left-2"
              style={{ color: "#616475" }}
            />
            <input
              style={{
                border: "1px solid #E7E7EB",
                backgroundColor: "transparent",
                color: "#616475",
              }}
              placeholder="Search location"
              className="h-12 pl-10 xl:w-72 lg:w-36 w-32"
              onChange={handleChange}
              value={inputValue}
            />
          </div>
          <Button
            variant="contained"
            onClick={handleClick}
            style={{ backgroundColor: "#3C47E9" }}
            className="font-semibold text-base"
          >
            Search
          </Button>
        </div>
        <div>

          <ul className="flex flex-col items-center gap-4 text-white pl-2">
            {searchRecommended.length > 0 ? searchRecommended.map((item) => {
              return (
                <li className="sm:w-96 cursor-pointer hover:bg-slate-500 p-2"  onClick={(e) => handleClickLi(item)}>
                  {item.name}{' '}, {' '}{item.country}
                </li>
              );
            }): ''}
          </ul>
        </div>
        <div>
          <p className="text-red-700">{error ? 'No data' : ''}</p>
        </div>
      </div>
    </div>
  );
}

export default Search;

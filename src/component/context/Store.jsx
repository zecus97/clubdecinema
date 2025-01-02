import React from "react";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export let MoviesContext = createContext(0);

export default function MoviesContextProvider(props) {
  const [movies, setMovies] = useState([]);
  const [people, setPeople] = useState([]);
  const [tv, setTv] = useState([]);
  const [status, setStatus] = useState("none");
  let [pages, setPages] = useState(1);
  let [type, setType] = useState("movie");
  
  useEffect(() => {
    getData("movie", setMovies, pages);
    getData("person", setPeople, pages);
    getData("tv", setTv, pages);
  }, [pages, type]);

  function getData(mediaType, callback, page) {
    setStatus("loading");
    axios
      .get(
        `https://api.themoviedb.org/3/trending/${mediaType}/day?api_key=c9fac173689f5f01ba1b0420f66d7093&include_adult=false&language=en-US&page=${page}`
      )
      .then(({ data: { results } }) => {
        callback(results);
        setStatus("none");
      })
      .catch((err) => {
        console.err(err);
        setStatus("error");
      });
  }


  return (
    <MoviesContext.Provider
      value={{
        movies,
        people,
        tv,
        setTv,
        status,
        setPages,
        setType,
        type,
      }}
    >
      {props.children}
    </MoviesContext.Provider>
  );
}
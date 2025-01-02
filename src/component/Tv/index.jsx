import React, { useState, useEffect, useCallback } from "react";
import CardTv from './../Home/component/CardTv';
import axios from "axios";

export default function Tv() {
  const [tv, setTv] = useState([]); 
  const [type, setType] = useState("trending"); // Active tab
  const [status, setStatus] = useState("loading"); // Loading status
  const [currentPage, setCurrentPage] = useState(1); 
  const [genres, setGenres] = useState([]); 
  const [selectedGenre, setSelectedGenre] = useState(null); 

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/genre/tv/list?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US"
        );
        setGenres(response.data.genres);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };

    fetchGenres();
  }, []);

  const fetchTvData = useCallback(async () => {
    setStatus("loading");
    let url = "";

    if (selectedGenre) {
      url = `https://api.themoviedb.org/3/discover/tv?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US&page=${currentPage}&with_genres=${selectedGenre}`;
    } else if (type === "top_rated") {
      url = `https://api.themoviedb.org/3/tv/top_rated?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US&page=${currentPage}`;
    } else if (type === "on_the_air") {
      url = `https://api.themoviedb.org/3/tv/on_the_air?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US&page=${currentPage}`;
    } else {
      url = `https://api.themoviedb.org/3/trending/tv/day?api_key=c9fac173689f5f01ba1b0420f66d7093&page=${currentPage}`;
    }

    try {
      const response = await axios.get(url);
      setTv(response.data.results);
      setStatus("none");
    } catch (err) {
      console.error("Error fetching TV data:", err);
      setStatus("error");
    }
  }, [type, currentPage, selectedGenre]);

  useEffect(() => {
    fetchTvData();
  }, [fetchTvData]);

  const handleGenreClick = (genreId) => {
    setSelectedGenre(selectedGenre === genreId ? null : genreId);
    setCurrentPage(1); 
  };

  const tabs = [
    { id: "trending", label: "Trending" },
    { id: "top_rated", label: "Top Rated" },
    { id: "on_the_air", label: "On the Air" },
  ];

  const num = Array.from({ length: 10 }, (_, index) => index + 1);

  return (
    <div className="container my-4">
      <div className="mb-4">
      <div className="mb-3">
      <i class="fa-solid fa-filter me-2"></i><span className="h5">Filter by Genre</span>
      </div>
        <div className="d-flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={`btn bg-secondary text-white rounded-5 ${selectedGenre === genre.id ? "active fw-bold bg-dark" : ""}`}
              onClick={() => handleGenreClick(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {!selectedGenre && (
        <ul className="nav nav-tabs mb-4">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.id}>
              <button
                className={`nav-link ${type === tab.id ? "active" : ""}`}
                onClick={() => {
                  setType(tab.id);
                  setCurrentPage(1);
                }}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {status === "loading" ? (
        <div className="text-center">Loading...</div>
      ) : status === "error" ? (
        <div className="text-center text-danger">Error loading data</div>
      ) : (
        <div className="row g-4 d-flex justify-content-center">
          {tv.map((show) => (
            <CardTv key={show.id} tv={show} showRating={true}  />
          ))}
        </div>
      )}

      <nav aria-label="Page navigation" className="mt-4">
        <ul className="pagination d-flex justify-content-center">
          {num.map((number) => (
            <li
              className={`page-item ${currentPage === number ? "active" : ""}`}
              key={number}
              onClick={() => setCurrentPage(number)}
            >
              <a className="page-link" href="#!">
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

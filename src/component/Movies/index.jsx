import React, { useState, useEffect, useCallback } from "react";
import CardMovies from "../Home/component/CardMovies";
import axios from "axios";

export default function Movies() {
  const [activeTab, setActiveTab] = useState("trending");
  const [moviesData, setMoviesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/genre/movie/list?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US"
        );
        setGenres(response.data.genres);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };

    fetchGenres();
  }, []);

  const fetchMoviesData = useCallback(async () => {
    let url = "";

    if (selectedGenre) {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US&page=${currentPage}&with_genres=${selectedGenre}`;
    } else if (activeTab === "trending") {
      url = `https://api.themoviedb.org/3/trending/movie/day?api_key=c9fac173689f5f01ba1b0420f66d7093&page=${currentPage}`;
    } else if (activeTab === "top_rated") {
      url = `https://api.themoviedb.org/3/movie/top_rated?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US&page=${currentPage}`;
    } else if (activeTab === "upcoming") {
      url = `https://api.themoviedb.org/3/movie/upcoming?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US&page=${currentPage}`;
    }

    try {
      const response = await axios.get(url);
      setMoviesData(response.data.results);
    } catch (err) {
      console.error("Error fetching movies data:", err);
    }
  }, [activeTab, currentPage, selectedGenre]);

  useEffect(() => {
    fetchMoviesData();
  }, [fetchMoviesData]);

  const handleGenreClick = (genreId) => {
    setSelectedGenre(selectedGenre === genreId ? null : genreId);
    setCurrentPage(1); 
  };

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
          {[
            { id: "trending", label: "Trending" },
            { id: "top_rated", label: "Top Rated" },
            { id: "upcoming", label: "Upcoming" },
          ].map((tab) => (
            <li className="nav-item" key={tab.id}>
              <button
                className={`nav-link ${activeTab === tab.id ? "active fw-bold text-dark" : ""}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="row g-4 my-4 d-flex justify-content-center">
        {moviesData.map((movie) => (
          <CardMovies key={movie.id} movie={movie} showRating={true} />
        ))}
      </div>

      <nav aria-label="Page navigation example">
        <ul className="pagination d-flex justify-content-center">
          {Array.from({ length: 10 }, (_, index) => index + 1).map((number) => (
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

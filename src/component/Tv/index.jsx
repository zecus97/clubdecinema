import React, { useState, useEffect, useCallback } from "react";
import CardTv from "../Home/component/CardTv";
import axios from "axios";

export default function Tv() {
  const [activeTab, setActiveTab] = useState("trending");
  const [tvData, setTvData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("filter type");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

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
    let url = "";

    if (selectedGenre && selectedFilter === "genre") {
      url = `https://api.themoviedb.org/3/discover/tv?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US&page=${currentPage}&with_genres=${selectedGenre}`;
    } else if (selectedFilter === "rating" && activeTab === "trending") {
      url = `https://api.themoviedb.org/3/trending/tv/day?api_key=c9fac173689f5f01ba1b0420f66d7093&page=${currentPage}`;
    } else if (selectedFilter === "rating" && activeTab === "on_the_air") {
      url = `https://api.themoviedb.org/3/tv/on_the_air?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US&page=${currentPage}`;
    } else if (selectedFilter === "rating") {
      url = `https://api.themoviedb.org/3/discover/tv?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US&page=${currentPage}&sort_by=vote_average.desc`;
    } else if (selectedFilter === "popularity") {
      url = `https://api.themoviedb.org/3/discover/tv?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US&page=${currentPage}&sort_by=popularity.desc`;
    } else if (activeTab === "trending") {
      url = `https://api.themoviedb.org/3/trending/tv/day?api_key=c9fac173689f5f01ba1b0420f66d7093&page=${currentPage}`;
    } else if (activeTab === "top_rated") {
      url = `https://api.themoviedb.org/3/tv/top_rated?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US&page=${currentPage}`;
    } else if (activeTab === "on_the_air") {
      url = `https://api.themoviedb.org/3/tv/on_the_air?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US&page=${currentPage}`;
    }

    try {
      const response = await axios.get(url);
      let tvShows = response.data.results;

      // If the filter is "rating" and tab is "trending, on_the_air" sort locally by rating
      if (selectedFilter === "rating" && (activeTab === "trending" || activeTab === "on_the_air")) {
        tvShows = tvShows.sort((a, b) => b.vote_average - a.vote_average);
      }
      setTvData(tvShows);
    } catch (err) {
      console.error("Error fetching TV data:", err);
    }
  }, [activeTab, currentPage, selectedGenre, selectedFilter]);

  useEffect(() => {
    fetchTvData();
  }, [fetchTvData]);

  const handleGenreClick = (genreId) => {
    setSelectedGenre(selectedGenre === genreId ? null : genreId);
    setCurrentPage(1);
  };

  return (
    <div className="container my-4">
      <div className="mb-4">
        <div className="d-flex align-items-center mt-3">
          <i className="fa-solid fa-filter fs-5 me-2"></i>
          <span className="h4">Discover TV Shows by</span>
          <button
            className="ms-3 btn btn-secondary me-3"
            onClick={() => setDropdownVisible(!dropdownVisible)}
          >
            {selectedFilter === "filter type"
              ? "Filter Type"
              : selectedFilter === "genre"
              ? "Genre"
              : selectedFilter === "rating"
              ? "Rating"
              : selectedFilter === "popularity"
              ? "Popularity"
              : ""}
            <i
              className={`ms-2 fa ${dropdownVisible ? "fa-chevron-up" : "fa-chevron-down"}`}
            />
          </button>
          {selectedFilter !== "filter type" && (
            <div className="d-flex align-items-center">
              <button
                className="btn btn-dark fw-bold"
                onClick={() => {
                  setSelectedFilter("filter type");
                  setSelectedGenre(null);
                  setCurrentPage(1);
                }}
              >
                X
              </button>
            </div>
          )}
        </div>

        {dropdownVisible && (
          <div className="dropdown-menu show">
            <button
              className="dropdown-item"
              onClick={() => {
                setSelectedFilter("genre");
                setDropdownVisible(false);
              }}
            >
              Genre
            </button>
            <button
              className="dropdown-item"
              onClick={() => {
                setSelectedFilter("rating");
                setDropdownVisible(false);
              }}
            >
              Rating
            </button>
            <button
              className="dropdown-item"
              onClick={() => {
                setSelectedFilter("popularity");
                setDropdownVisible(false);
              }}
            >
              Popularity
            </button>
          </div>
        )}

        {selectedFilter === "genre" && (
          <div className="d-flex flex-wrap gap-2 my-3">
            {genres.map((genre) => (
              <button
                key={genre.id}
                className={`btn bg-secondary text-white rounded-5 ${
                  selectedGenre === genre.id ? "active fw-bold bg-dark" : ""
                }`}
                onClick={() => handleGenreClick(genre.id)}
              >
                {genre.name}
              </button>
            ))}
          </div>
        )}

        {selectedFilter !== "genre" && selectedFilter !== "popularity" && (
          <ul className="nav nav-tabs mt-4">
            {[
              { id: "trending", label: "Trending" },
              { id: "top_rated", label: "Top Rated" },
              { id: "on_the_air", label: "On the Air" },
            ].map((tab) => (
              <li className="nav-item" key={tab.id}>
                <button
                  className={`nav-link ${
                    activeTab === tab.id ? "active fw-bold text-dark" : ""
                  }`}
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
      </div>

      <div className="row g-4 d-flex justify-content-center">
        {tvData.map((show) => (
          <CardTv key={show.id} tv={show} showRating={true} />
        ))}
      </div>

      <nav aria-label="Page navigation example">
        <ul className="pagination d-flex justify-content-center mt-3">
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
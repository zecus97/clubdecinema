import React, { useState, useEffect, useCallback } from "react";
import CardTv from "../Home/component/CardTv";
import axios from "axios";

export default function Tv() {
  const [activeTab, setActiveTab] = useState("trending");
  const [tvData, setTvData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("filter type");
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);

  const languages = [
    { code: "ar", name: "Arabic" },
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi (Indian)" },
    { code: "tr", name: "Turkish" },
  ];

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
    } else if (selectedLanguage && selectedFilter === "language") {
      url = `https://api.themoviedb.org/3/discover/tv?api_key=c9fac173689f5f01ba1b0420f66d7093&page=${currentPage}&with_original_language=${selectedLanguage}`;
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

      if (selectedSort === "rating") {
        tvShows = tvShows.sort((a, b) => b.vote_average - a.vote_average);
      } else if (selectedSort === "popularity") {
        tvShows = tvShows.sort((a, b) => b.popularity - a.popularity);
      } else if (selectedSort === "vote") {
        tvShows = tvShows.sort((a, b) => b.vote_count - a.vote_count);
      } else if (selectedSort === "meta") {
        tvShows = tvShows.sort((a, b) => (b.vote_average * b.popularity) - (a.vote_average * a.popularity));
      }

      setTvData(tvShows);
    } catch (err) {
      console.error("Error fetching TV data:", err);
    }
  }, [activeTab, currentPage, selectedGenre, selectedLanguage, selectedFilter, selectedSort]);

  useEffect(() => {
    setSelectedSort(null);
  }, [activeTab, selectedFilter, selectedGenre, selectedLanguage]);

  useEffect(() => {
    fetchTvData();
  }, [fetchTvData]);

  const handleLanguageClick = (languageCode) => {
    setSelectedLanguage(selectedLanguage === languageCode ? null : languageCode);
    setCurrentPage(1);
  };

  const handleGenreClick = (genreId) => {
    setSelectedGenre(selectedGenre === genreId ? null : genreId);
    setCurrentPage(1);
  };

  return (
    <div className="container my-4">
      <div className="mb-4">
        <div className="d-flex align-items-center mt-3">
          <i className="fa-solid fa-filter fs-5 me-2"></i>
          <span className="h4">Discover TV Shows</span>
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle mx-2 py-1"
              type="button"
              id="filterDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {selectedFilter === "filter type"
                ? "Filter Type"
                : selectedFilter === "genre"
                ? "Genre"
                : selectedFilter === "language"
                ? "Language"
                : ""}
            </button>
            <ul className="dropdown-menu" aria-labelledby="filterDropdown">
              <li>
                <button className="dropdown-item" onClick={() => setSelectedFilter("genre")}>
                  Genre
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => setSelectedFilter("language")}>
                  Language
                </button>
              </li>
            </ul>
          </div>

          {selectedFilter !== "filter type" && (
            <div className="d-flex align-items-center">
              <button
                className="btn btn-dark fw-bold py-1"
                onClick={() => {
                  setSelectedFilter("filter type");
                  setSelectedGenre(null);
                  setSelectedLanguage(null);
                  setCurrentPage(1);
                }}
              >
                X
              </button>
            </div>
          )}
        </div>

        {selectedFilter === "genre" && (
          <div className="d-flex flex-wrap gap-2 my-3">
            {genres.map((genre) => (
              <button
                key={genre.id}
                className={`btn bg-secondary filter-items text-white rounded-5 ${
                  selectedGenre === genre.id ? "active fw-bold bg-dark" : ""
                }`}
                onClick={() => handleGenreClick(genre.id)}
              >
                {genre.name}
              </button>
            ))}
          </div>
        )}

        {selectedFilter === "language" && (
          <div className="d-flex flex-wrap gap-2 my-3">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`btn bg-secondary filter-items text-white rounded-5 ${
                  selectedLanguage === language.code ? "active fw-bold bg-dark" : ""
                }`}
                onClick={() => handleLanguageClick(language.code)}
              >
                {language.name}
              </button>
            ))}
          </div>
        )}

        <div className="tabs-container border-bottom">
          <div className="d-flex justify-content-between align-items-center mt-3 pb-1">
            {selectedFilter !== "genre" && selectedFilter !== "language" && (
              <div className="d-flex align-items-center">
                <ul className="nav nav-tabs align-items-center">
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
              </div>
            )}

            <div className="dropdown">
              <button
                className="btn btn-primary dropdown-toggle py-2"
                type="button"
                id="sortDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {selectedSort === null
                  ? "Sort by"
                  : selectedSort === "rating"
                  ? "Rating"
                  : selectedSort === "popularity"
                  ? "Popularity"
                  : selectedSort === "vote"
                  ? "People Vote"
                  : selectedSort === "meta"
                  ? "Meta Score"
                  : "Sort by"}
              </button>
              <ul className="dropdown-menu" aria-labelledby="sortDropdown">
                <li>
                  <button className="dropdown-item" onClick={() => setSelectedSort("rating")}>
                    Rating
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => setSelectedSort("popularity")}>
                    Popularity
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => setSelectedSort("vote")}>
                    People Vote
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => setSelectedSort("meta")}>
                    Meta Score
                  </button>
                </li>
              </ul>
              {selectedSort !== null && (
              <button
              className="btn btn-dark fw-bold ms-1 px-1 py-1 rounded-5" 
              onClick={() => setSelectedSort(null)}>
               X
              </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 d-flex justify-content-center">
        {tvData.map((item, index) => (
          <CardTv key={index} tv={item} showRating={true} />
        ))}
      </div>

      <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
        <button
          className="btn btn-secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
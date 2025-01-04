import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import nofilm from "../../assets/poster.png";

export default function SearchResults() {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("query");
    setQuery(searchQuery);

    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/multi?api_key=c9fac173689f5f01ba1b0420f66d7093&query=${searchQuery}`
        );
        setResults(response.data.results);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    }
  }, [location.search]);

  const getRedirectPath = (item) => {
    if (item.media_type === "person") {
      return `/person/${item.id}`;
    }
    return `/details/${item.media_type}/${item.id}`;
  };

  const renderCard = (item) => {
    const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
    const isPerson = item.media_type === "person";

    return (
      <div className="col-6 col-md-3 mb-4 theCard" key={item.id}>
        <Link to={getRedirectPath(item)} className="text-decoration-none">
          <div className="position-relative">
            <img
              className="w-100 rounded mb-2 rounded-4"
              src={
                item.poster_path || item.profile_path
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}`
                  : nofilm
              }
              alt={item.title || item.name}
            />
            {rating && !isPerson && (
              <div
                className="rating-badge position-absolute top-0 start-0 p-2 text-white"
                style={{
                  zIndex: 1,
                }}
              >
                <i className="fa-solid fa-star text-warning me-1"></i>
                {rating}
              </div>
            )}
            <span className="fw-bold">
              {item.title || item.name}
              {item.release_date && (
                <span className="text-secondary"> ({item.release_date.split("-")[0]})</span>
              )}
              {item.first_air_date && (
                <span className="text-secondary"> ({item.first_air_date.split("-")[0]})</span>
              )}
            </span>
            {isPerson ? null : (
              <p className="text-secondary">
                {item.media_type === "movie" ? "Movie" : "TV Show"}
              </p>
            )}
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Search Results for "{query}"</h1>
      <div className="row">
        {results.map((item) => renderCard(item))}
      </div>
    </div>
  );
}
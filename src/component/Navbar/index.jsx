import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import nofilm from "../../assets/poster.png";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleLinkClick = () => {
    const offcanvas = document.getElementById("offcanvasDarkNavbar");
    const offcanvasCloseButton = offcanvas.querySelector(".btn-close");
    offcanvasCloseButton.click();
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/multi?api_key=c9fac173689f5f01ba1b0420f66d7093&query=${searchTerm}`
      );
      setSuggestions(response.data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        handleSearch(query);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsDropdownVisible(true);
  };

  const handleSuggestionClick = () => {
    setIsDropdownVisible(false);
    setQuery("");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar p-2">
      <div className="container">
        <Link className="navbar-brand h1 fs-2" to="home">
        <i class="fa-solid fa-clapperboard me-2"></i>
        <i class="fi fi-bs-clapper-open"></i>
        Club de Cinema
        </Link>
        <div className="search-container mx-auto">
          <div className="input-group">
            <input
              className="form-control custom-search-input"
              type="search"
              placeholder="Search movies, TV shows..."
              value={query}
              onChange={handleInputChange}
              onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
              onFocus={() => setIsDropdownVisible(true)}
            />
            <button className="btn custom-search-button" type="button">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          {isDropdownVisible && suggestions.length > 0 && (
  <div className="custom-dropdown">
    {suggestions.map((item) => {
      const route = item.media_type === "person"
        ? `/person/${item.id}`
        : `/details/${item.media_type}/${item.id}`;
      return (
        <Link
          key={item.id}
          className="custom-dropdown-item"
          to={route}
          onClick={handleSuggestionClick}
        >
          <img
            src={item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : nofilm}
            alt={item.title || item.name}
            className="custom-dropdown-image rounded-2"
          />
          <div className="custom-dropdown-content">
            <div className="custom-dropdown-title">{item.title || item.name}</div>
            <small className="custom-dropdown-date">
            {(item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0]) || "Unknown"}
            </small>
          </div>
        </Link>
        );
      })}
  </div>
)}
        </div>
        <button
          className="navbar-toggler custom-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasDarkNavbar"
          aria-controls="offcanvasDarkNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-end text-bg-dark"
          tabIndex="-1"
          id="offcanvasDarkNavbar"
          aria-labelledby="offcanvasDarkNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title fs-1" id="offcanvasDarkNavbarLabel">
              MENU
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1">
              <li className="nav-item">
                <Link className="nav-link fs-2 active" to="home" onClick={handleLinkClick}>
                  HOME
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fs-2" to="movies" onClick={handleLinkClick}>
                  MOVIES
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fs-2" to="tv" onClick={handleLinkClick}>
                  SERIES
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { pathImg } from "../constant/pathImg";
import person from "../assets/images.jpeg";
import nofilm from "../assets/poster.png";

export default function PersonDetails() {
  const { personId } = useParams();
  const [personDetails, setPersonDetails] = useState({});
  const [movieCredits, setMovieCredits] = useState([]);
  const [tvCredits, setTvCredits] = useState([]);
  const [activeTab, setActiveTab] = useState("movies");
  const [showFullBiography, setShowFullBiography] = useState(false);

  useEffect(() => {
    getPersonDetails(personId);
    getPersonMovieCredits(personId);
    getPersonTVCredits(personId);
  }, [personId]);

  function getPersonDetails(id) {
    axios
      .get(
        `https://api.themoviedb.org/3/person/${id}?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US`
      )
      .then(({ data }) => setPersonDetails(data))
      .catch((err) => console.error(err));
  }

  function getPersonMovieCredits(id) {
    axios
      .get(
        `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US`
      )
      .then(({ data }) => setMovieCredits(data.cast))
      .catch((err) => console.error(err));
  }
  function getPersonTVCredits(id) {
    axios
      .get(
        `https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US`
      )
      .then(({ data }) => setTvCredits(data.cast))
      .catch((err) => console.error(err));
  }
  const renderCredits = (credits, type) => {
    return (
      <div className="row">
        {credits.map((item) => {
          const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
          return (
            <div className="col-6 col-md-2 mb-4 theCard" key={item.id}>
              <Link to={`/details/${type}/${item.id}`} className="text-decoration-none">
                <div className="position-relative">
                  <img
                    className="w-100 rounded mb-2 rounded-4"
                    src={item.poster_path ? pathImg(item.poster_path) : nofilm}
                    alt={item.title || item.name}
                  />
                  
                  {rating && (
                    <div
                      className="rating-badge position-absolute top-0 start-0 p-2 text-white"
                      style={{
                        zIndex: 1
                      }}
                    >
                      <i className="fa-solid fa-star text-warning me-1"></i>
                      {rating}
                    </div>
                  )}
  
                  <span className="fw-bold">
                    {item.title || item.name}
                    {item.release_date && <span className="text-secondary"> ({item.release_date?.split("-")[0]})</span>}
                    {item.first_air_date && <span className="text-secondary"> ({item.first_air_date?.split("-")[0]})</span>}
                  </span>
                  <p className="text-secondary">
                    as {item.character || "Unknown Character"}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    );
  };
  

  const toggleBiography = () => {
    setShowFullBiography((prev) => !prev);
  };

  const truncateText = (text, maxLines = 2) => {
    const lines = text.split('\n');
    if (lines.length <= maxLines) return text;
    return lines.slice(0, maxLines).join('\n') + '...';
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-3 mb-3">
          <img
            className="w-100 rounded-3"
            src={personDetails.profile_path ? pathImg(personDetails.profile_path) : person}
            alt={personDetails.name}
          />
        </div>
        <div className="col-md-9">
          <h2>{personDetails.name}</h2>
          {personDetails.biography && (
            <div>
              <p>
                {showFullBiography
                  ? personDetails.biography
                  : truncateText(personDetails.biography)}
              </p>
              {personDetails.biography.split('\n').length > 4 && (
                <button
                  className="btn btn-link text-info p-0"
                  onClick={toggleBiography}
                >
                  {showFullBiography ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
          )}

            {personDetails.birthday && (
              <li>
               <span className="text-info fw-bold fs-5">Birthday:</span> {personDetails.birthday}
              </li>
            )}
            {personDetails.place_of_birth && (
              <li>
               <span className="text-info fw-bold fs-5">Place of Birth:</span> {personDetails.place_of_birth}
              </li>
            )}
            {personDetails.popularity && (
              <li>
                <span className="text-info fw-bold fs-5">Popularity:</span> {personDetails.popularity}
              </li>
            )}
        </div>
      </div>
      <div className="mt-5">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "movies" ? "active fw-bold text-dark" : ""}`}
              onClick={() => setActiveTab("movies")}
            >
              Movies
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "tv" ? "active fw-bold text-dark" : ""}`}
              onClick={() => setActiveTab("tv")}
            >
              TV Shows
            </button>
          </li>
        </ul>
        <div className="tab-content mt-4">
          {activeTab === "movies" && renderCredits(movieCredits, "movie")}
          {activeTab === "tv" && renderCredits(tvCredits, "tv")}
        </div>
      </div>
    </div>
  );
}

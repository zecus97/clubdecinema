import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import nofilm from "../../assets/poster.png";
import "./seasonDetails.css";
import { pathImg } from "../../constant/pathImg";

export default function SeasonDetails() {
  const { id, seasonNumber } = useParams();
  const [seasonDetails, setSeasonDetails] = useState({});
  const [episodes, setEpisodes] = useState([]);
  const [tvShowDetails, setTvShowDetails] = useState({});
  const [seasons, setSeasons] = useState([]);
  const navigate = useNavigate();
  const episodesRef = useRef(null);

   useEffect(() => {
      window.scrollTo(0, 0);
    }, []); 

    useEffect(() => {
        window.scrollTo(0, 0);
        getSeasonDetails(id, seasonNumber);
        getTvShowDetails(id);
        getSeasons(id);
        if (episodesRef.current) {
            episodesRef.current.scrollTop = 0;
          }
      }, [id, seasonNumber]);

  useEffect(() => {
    getSeasonDetails(id, seasonNumber);
    getTvShowDetails(id);
    getSeasons(id);
  }, [id, seasonNumber]);

  function getSeasonDetails(tvId, seasonNum) {
    axios
      .get(
        `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNum}?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US`
      )
      .then(({ data }) => {
        setSeasonDetails(data);
        setEpisodes(data.episodes);
      })
      .catch((err) => console.error(err));
  }

  function  getSeasons(tvId) {
    axios
      .get(
        `https://api.themoviedb.org/3/tv/${tvId}?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US`
      )
      .then(({ data }) => setSeasons(data.seasons))
      .catch((err) => console.error(err));
  }

  function getTvShowDetails(tvId) {
    axios
      .get(
        `https://api.themoviedb.org/3/tv/${tvId}?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US`
      )
      .then(({ data }) => setTvShowDetails(data))
      .catch((err) => console.error(err));
  }
  

  return (
    <div
      className="seasons-background container-fluid pb-5"
      style={{
        backgroundImage: `url(https://www.themoviedb.org/t/p/original${tvShowDetails.backdrop_path})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="seasons-container container">
        <div className="row mt-5 align-items-start">
          <div className="col-md-3 mb-3">
            <Link to={`/details/tv/${tvShowDetails.id}`}>
            <img
              className="w-100 rounded-4"
              src={
                tvShowDetails.poster_path
                  ? pathImg(tvShowDetails.poster_path)
                  : nofilm
              }
              alt={tvShowDetails.name}
            />
            <h2 className="mt-3 text-light fw-bold">{tvShowDetails.name}</h2>
            {tvShowDetails.first_air_date && (
              <p className="item-date fw-bold">
                First Air Date: {tvShowDetails.first_air_date}
              </p>
            )}
            </Link>
          </div>
       <div className="col-md-8 ms-3 episodes-box">
        <div className="d-flex justify-content-between align-items-center">
        <h2 className="text-info fw-bold mb-3">Episodes{" "}<span className="text-light">({seasonDetails.name})</span>
        </h2>
        <div className="dropdown">
        <button
        className="btn btn-secondary mb-3 dropdown-toggle"
        type="button"
        id="seasonsDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        >
        {seasonDetails.name || "Seasons"}
         </button>
        <ul className="dropdown-menu" aria-labelledby="seasonsDropdown">
        {seasons.map((season) => (
          <li key={season.id}>
            <button 
            className="dropdown-item" 
            onClick={() => navigate(`/tv/${id}/season/${season.season_number}`)}>
              {season.name}
            </button>
          </li>
        ))}
        </ul>
        </div>
        </div>
        {Array.isArray(seasonDetails.episodes) && seasonDetails.episodes.length > 0 ? (
       <div
       ref={episodesRef}
       className="list-seasons overflow-y-auto"
       style={{ height: "100vh" }}>
        {episodes.map((episode) => (
         <div
         key={episode.id}
         className="list-seasons-item d-flex align-items-start transparent-bg py-4"
         >
        <img
          className="me-4 ms-3 rounded-3"
          src={
            episode.still_path
              ? pathImg(episode.still_path)
              : nofilm
          }
          alt={episode.name}
        />
          <div>
          <h5 className="fw-bold text-light">{episode.episode_number} - {episode.name}
          <span><i className="fa-solid fa-star text-warning ms-2 me-1"></i>
          {episode.vote_average
          ? episode.vote_average.toFixed(1)
          : "No rating"}</span></h5>
          <span className="text-secondary">({episode.air_date})</span>
          {episode.overview && (
            <p className="item-date mb-2 mt-1">{episode.overview}</p>
          )}
          </div>
          </div>
          ))}
         </div>
          ) : (
           <h3 className="mt-5">We're Sorry, Episodes Are Not Available Yet</h3>
            )}
         </div>
         </div>
         </div>
         </div>
       );
       }
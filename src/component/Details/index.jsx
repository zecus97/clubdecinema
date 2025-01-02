import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import nofilm from "../../assets/poster.png";
import person from "../../assets/images.jpeg";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ReactPlayer from "react-player";
import "./details.css";
import { pathImg } from "../../constant/pathImg";

export default function Details() {
  let { mediatype, id } = useParams();

  const [details, setDetails] = useState({});
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [similar, setSimilar] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getMovie(id, mediatype, setDetails);
    getCredits(id, mediatype, (data) => setCredits(data))
    getSimilar(id, mediatype, setSimilar);
    getVideos(id, mediatype, setVideos);
  }, [id, mediatype]);
  function getMovie(id, mediatype, callback) {
    axios
      .get(
        `https://api.themoviedb.org/3/${mediatype}/${id}?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US`
      )
      .then(({ data }) => callback(data))
      .catch((err) => console.error(err));
  }

  function getCredits(id, mediatype, callback) {
    axios
      .get(
        `https://api.themoviedb.org/3/${mediatype}/${id}/credits?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US`
      )
      .then(({ data }) => {
        callback(data);
      })
      .catch((err) => console.error(err));
  }

  function getSimilar(id, mediatype, callback) {
    axios
      .get(
        `https://api.themoviedb.org/3/${mediatype}/${id}/recommendations?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US`
      )
      .then(({ data }) => callback(data.results))
      .catch((err) => console.error(err));
  }

  function getVideos(id, mediatype, callback) {
    axios
      .get(
        `https://api.themoviedb.org/3/${mediatype}/${id}/videos?api_key=c9fac173689f5f01ba1b0420f66d7093&language=en-US`
      )
      .then(({ data }) => callback(data.results))
      .catch((err) => console.error(err));
  }

  return (
    <>
      <div
        className="details-background container-fluid"
        style={{
          backgroundImage: `url(https://www.themoviedb.org/t/p/original${details.backdrop_path})`,
        }}
      >
        <div className="details-container container">
          <div className="row mt-5">
            <div className="col-md-3 mb-3">
              <img
                className="w-100 rounded-4"
                src={
                  (mediatype === "movie" || mediatype === "tv") &&
                  pathImg(details.poster_path)
                }
                alt={details.title || details.name}
              />
            </div>
            <div className="col-md-8 d-flex ms-3">
              <div>
                <h2>
                  {mediatype === "movie" ? details.title : details.name}
                  {details.release_date && (
                    <span className="item-date">
                      {" "}
                      ({details.release_date?.split("-")[0]})
                    </span>
                  )}
                  {details.first_air_date && (
                    <span className="item-date">
                      {" "}
                      ({details.first_air_date?.split("-")[0]})
                    </span>
                  )}
                </h2>
                {details.genres && (
                  <div className="mb-3">
                    {details.genres.map((genre) => (
                      <span key={genre.id} className="badge bg-secondary me-2">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
                <li className="fs-2 fw-bold my-2">
                  <i className="fa-solid fa-star text-warning me-2"></i>
                  {details.vote_average}
                </li>
                {(mediatype === "movie" || mediatype === "tv") && details.tagline && (
                  <p className="fs-5 item-date">
                    {details.tagline}
                  </p>
                )}
                {(mediatype === "movie" || mediatype === "tv") && (
                  <p className="py-2 lead">
                    <span className="text-info fw-bold fs-5">Overview: </span>
                    <br /> <span className="lh-sm">{details.overview}</span>
                  </p>
                )}
                <ul className="p-0">
                  <li className="fs-5">
                    <i className="fa-solid fa-calendar-day me-2"></i>
                    <span className="text-info fw-bold">Release Date: </span>
                    {(mediatype === "movie" || mediatype === "tv") &&
                      (details.release_date || details.first_air_date)}
                  </li>
                  <li className="fs-5">
                    <i className="fa-solid fa-fire-flame-curved me-2"></i>
                    <span className="text-info fw-bold">Popularity: </span>
                    {details.popularity}
                  </li>
                  {(mediatype === "movie" || mediatype === "tv") && (
                    <>
                  <li className="fs-5">
                        <i className="fa-solid fa-users-line me-2"></i>
                        <span className="text-info fw-bold">Vote count: </span>
                        {details.vote_count}
                  </li>
                    </>
                  )}
                {(mediatype === "movie") && credits?.crew?.length > 0 && (
                <div className="fs-5 fw-bold">
                  <i class="fa-solid fa-bullhorn me-2"></i>
                  <span className="text-info">Director: </span>
                  {credits.crew
                  .filter((member) => member.job === "Director")
                  .map((director) => (
                <Link
                  key={director.id} 
                  to={`/person/${director.id}`} 
                  className="text-secondary text-decoration-none"
             >
                  {director.name}
                </Link>
                 ))}
               </div>
               )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
      {(mediatype === "movie" || mediatype === "tv") && credits?.cast?.length > 0 && (
  <div className="mt-5">
    <h3 className="text-info fw-bold mb-4">Cast</h3>
    <Swiper
      modules={[Navigation]}
      navigation={true}
      spaceBetween={10}
      slidesPerView={2}
      breakpoints={{
        320: { slidesPerView: 2 }, 
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 }, 
        1024: { slidesPerView: 6 },
      }}
    >
      {credits.cast.slice(0, 15).map((cast) => (
        <SwiperSlide key={cast.id}>
          <Link className="theCard" to={`/person/${cast.id}`}>
            <img
              className="w-100 rounded-pill"
              src={
                cast.profile_path
                  ? pathImg(cast.profile_path)
                  : person
              }
              alt={cast.name}
            />
            <p className="mt-3 mb-0 fs-5 fw-bold text-center">{cast.name}</p>
            <p className="text-secondary fw-bold text-center">{cast.character}</p>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
)}
      {(mediatype === "movie" || mediatype === "tv") && videos.length > 0 && (
        <div className="mt-5">
          <h3 className="text-info fw-bold mb-4">Trailers</h3>
          <div className="row">
            {videos
              .filter((video) => video.type === "Trailer" && video.site === "YouTube")
              .map((video) => (
                <div className="col-md-4 mb-4" key={video.id}>
                  <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${video.key}`}
                    controls
                    width="100%"
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {(mediatype === "movie" || mediatype === "tv") && (
        <div className="mt-5">
          <h3 className="text-info fw-bold mb-4">
            Recommended {mediatype === "movie" ? "Movies" : "TV Shows"}
          </h3>
          <Swiper
            modules={[Navigation]}
            navigation={true}
            spaceBetween={10}
            slidesPerView={2}
            breakpoints={{
              320: { slidesPerView: 2 }, 
              576: { slidesPerView: 2 },
              768: { slidesPerView: 3 }, 
              1024: { slidesPerView: 6 },
            }}
          >
            {similar.slice(0, 12).map((item) => (
              <SwiperSlide key={item.id}>
                <Link className="theCard" to={`/details/${mediatype}/${item.id}`}>
                  <img
                    className="w-100 rounded-3"
                    src={
                      item.poster_path
                        ? pathImg(item.poster_path)
                        : nofilm
                    }
                    alt={item.title || item.name}
                  />
                  <p className="mt-2 fw-bold">
                    {item.title || item.name}
                    {item.release_date && (
                      <span className="text-secondary">
                        {" "}
                        ({item.release_date?.split("-")[0]})
                      </span>
                    )}
                    {item.first_air_date && (
                      <span className="text-secondary">
                        {" "}
                        ({item.first_air_date?.split("-")[0]})
                      </span>
                    )}
                  </p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      </div>
    </>
  );
}
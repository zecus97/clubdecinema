import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { pathImg } from "../../../constant/pathImg";
import nofilm from "../../../assets/poster.png";
import { MoviesContext } from "../../context/Store";

export default function CardMovies({ movie, showRating = false }) {
  const { setType } = useContext(MoviesContext);

  return (
    <div
      className="col-6 col-md-2 theCard"
      onClick={() => {
        setType("movie");
      }}
    >
      <div className="position-relative">
        {showRating && (
          <div
            className="rating-badge position-absolute top-0 start-0 p-2 text-white"
            style={{
              zIndex: 1,
            }}
          >
            <i className="fa-solid fa-star text-warning me-1"></i>
            {movie.vote_average.toFixed(1)}
          </div>
        )}

        {/* Movie Poster */}
        <Link to={`/details/movie/${movie.id}`}>
          <img
            src={movie.poster_path
              ? pathImg(movie.poster_path)
              : nofilm}
            alt={movie.title}
            className="w-100 rounded-4 mb-2"
          />
          <span className="h6">{movie.title}</span>
          {movie.release_date && (
            <span className="text-secondary">
              {" "}
              ({movie.release_date?.split("-")[0]})
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
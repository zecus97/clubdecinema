import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { pathImg } from "../../../constant/pathImg";
import { MoviesContext } from "../../context/Store";
import nofilm from "../../../assets/poster.png";

export default function CardTv({ tv, showRating = false }) {
  const { setType } = useContext(MoviesContext);

  return (
    <div
      className="col-6 col-md-2 theCard"
      onClick={() => {
        setType("tv");
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
            {tv.vote_average.toFixed(1)}
          </div>
        )}

        <Link to={`/details/tv/${tv.id}`}>
          <img
            src={tv.poster_path ? pathImg(tv.poster_path) : nofilm}
            alt={tv.name}
            className="w-100 rounded-4 mb-2"
          />
          <span className="h6">{tv.name}</span>
          {tv.first_air_date && (
            <span className="text-secondary">
              {" "}
              ({tv.first_air_date?.split("-")[0]})
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
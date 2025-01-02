import React, { useContext, useRef } from "react";
import "./style.css";
import CardMovies from "./component/CardMovies";
import { MoviesContext } from "../context/Store";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { pathImg } from "../../constant/pathImg";
import person from "../../assets/images.jpeg";
import CardTv from "./component/CardTv";
import { Link } from "react-router-dom";

export default function Home() {
  let { people, movies, tv, status } = useContext(MoviesContext);

  const swiperRef = useRef(null);

  return (
    <div className="container">
      {status === "none" ? (
        <>
          {/* Movies Section */}
          <div className="row g-4 mt-4 mb-5">
            <div className="col-6 col-md-4">
              <div className="brdr w-25"></div>
              <h1 className="h3 my-4">
                <i className="fa-solid fa-film me-2"></i>Trending
                <br /> Movies <br /> To Watch Right Now
              </h1>
              <p className="opacity-75">Top Trending Movies by Day</p>
              <div className="brdr"></div>
            </div>
            {movies.slice(0, 10).map((movie) => (
            <CardMovies key={movie.id} movie={movie} />
             ))}
            </div>

          {/* People Section */}
          <div className="row g-4 my-5">
            <div className="col-md-4">
              <div className="brdr w-25"></div>
              <h1 className="h3 my-4">
                <i className="fa-solid fa-hat-cowboy-side me-2"></i> Trending
                <br /> People <br /> To Watch Right Now
              </h1>
              <p className="opacity-75">Top Trending People by Day</p>
              <div className="brdr"></div>
            </div>
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              spaceBetween={10}
              slidesPerView={2}
              breakpoints={{
                320: { slidesPerView: 2 }, 
                576: { slidesPerView: 2 },
                768: { slidesPerView: 3 }, 
                1024: { slidesPerView: 6 },
              }}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
              {people.slice(0, 20).map((people) => (
                <SwiperSlide key={people.id}>
                  <Link
                    className="theCard"
                    to={`/person/${people.id}`}
                    onMouseEnter={() => swiperRef.current.autoplay.stop()}
                    onMouseLeave={() => swiperRef.current.autoplay.start()}      
                  >
                    <img
                      className="w-100 rounded-pill"
                      src={people.profile_path ? pathImg(people.profile_path) : person}
                      alt={people.name}
                    />
                    <p className="mt-2 fw-bold text-center">{people.name}</p>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {/* Tv Section */}
          <div className="row g-4 my-5">
            <div className="col-6 col-md-4">
              <div className="brdr w-25"></div>
              <h1 className="h3 my-4">
                <i className="fa-solid fa-film me-2"></i>Trending
                <br /> TV Shows <br /> To Watch Right Now
              </h1>
              <p className="opacity-75">Top Trending Movies by Day</p>
              <div className="brdr"></div>
            </div>
            {tv.slice(0, 10).map((tv) => (
              <CardTv key={tv.id} tv={tv} />
            ))}
          </div>
        </>
      ) : status === "error" ? (
        <h1>Error</h1>
      ) : (
        <h1>Loading</h1>
      )}
    </div>
  );
}
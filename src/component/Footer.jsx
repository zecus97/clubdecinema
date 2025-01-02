import React from "react";

export default function Footer() {
  return (
    <footer className="mt-5 mb-3 px-4 text-center text-secondary">
      <h6 className="mb-2 d-block">
        &copy; 2024 Club de Cinema. All rights reserved.
      </h6>
      <small className="fw-bold">
        <span className="blockquote-footer">About this website:</span> built with
        React & React-Router-Dom (App Router), Bootstrap, Swiper & Vercel hosting.
      </small>
    </footer>
  );
}
"use client";

import img from "@/public/title-deeds.jpg";

import { useState, useEffect } from "react";

const Carousel = () => {
  const [active, setActive] = useState(0);
  const images = [
    {
      url: "/r-architecture-2gDwlIim3Uw-unsplash.jpg",
      title: "Beautiful Home",
      description: "This is a description of the first image.",
    },
    {
      url: "/title-long.jpg",
      title: "Luxurious Villa",
      description: "This is a description of the second image.",
    },
    {
      url: "/title-deeds.jpg",
      title: "Cozy Apartment",
      description: "This is a description of the third image.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, 3000); // Change image every 3000 ms
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto space-y-4 overflow-hidden w-full">
      <div className="relative w-full h-80">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              active === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: `${active === index ? "500ms" : "0ms"}` }}
          >
            <img
              src={image.url}
              className="w-full h-full object-cover rounded-lg shadow-lg"
              alt="Property Image"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
              <div className="text-white">
                <h2 className="text-2xl font-bold">{image.title}</h2>
                <p>{image.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${
              active === index ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setActive(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;

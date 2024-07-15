"use client";
import Image from "next/image";
import React, { useState } from "react";

interface Props {
  images?: string[];
}

const ImageDisplay: React.FC<Props> = ({ images = [] }) => {
  const [currentImage, setCurrentIage] = useState<string>(images[0]);
  return (
    <div className="w-full h-full flex flex-col items-center">
      {/* Carousel */}
      {/* <Image
        src={{
          src: currentImage ? `/${currentImage}` : "/",
          width: 800,
          height: 500,
        }}
        alt={""}
        className="bg-indigo-800  object-cover h-[80%] w-full"
      /> */}
      <img
        src={
          currentImage
            ? `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${currentImage}`
            : "/"
        }
        alt={""}
        className="bg-indigo-800  object-cover h-[80%] w-full"
      />
      {/* Thumbnailes */}
      <div className="flex grow overflow-x-auto justify-center space-x-2 my-2">
        {images.length > 0 ? (
          images.map((image, index) => (
            // <Image
            //   key={index}
            //   src={{
            //     src: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${image}`,
            //     width: 800,
            //     height: 500,
            //   }}
            //   alt={""}
            //   className="bg-indigo-800 object-cover w-100 h-100 hover:opacity-50 hover:cursor-pointer"
            //   onClick={() => setCurrentIage(image)}
            // />
            <img
              key={index}
              src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${image}`}
              alt={""}
              className="bg-indigo-800 object-cover w-100 h-100 hover:opacity-50 hover:cursor-pointer"
              onClick={() => setCurrentIage(image)}
            />
          ))
        ) : (
          <img
            src={`https://via.placeholder.com/1200x400?text=Thumnail`}
            alt={""}
            className="bg-indigo-800 object-cover w-100 h-100 hover:opacity-50 hover:cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;

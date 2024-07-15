"use client";
import HomeFilterForm from "@/components/forms/properties/home-filter-form";
import { Button } from "@/components/ui/button";
import { Advert } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

const HeroBanner: FC<{ adverts: Advert[] }> = ({ adverts }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((current) => (current + 1) % adverts.length);
    }, 5000); // Change image every 3000 ms
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-8 gap-3">
      <div className="lg:col-span-6 bg-black rounded-md relative overflow-clip h-96 lg:h-[60vh]">
        {adverts.map(({ id, image, title, description }, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              active === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: `${active === index ? "500ms" : "0ms"}` }}
          >
            {/* <Image
              src={{
                src: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${image}`,
                height: 800,
                width: 500,
              }}
              className="w-full h-full object-cover rounded-lg shadow-lg"
              alt="Property Image"
            /> */}
            <img
              src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${image}`}
              className="w-full h-full object-cover rounded-lg shadow-lg"
              alt="Property Image"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-start p-4">
              <div className="flex flex-col p-10 text-white font-bold justify-center space-y-10">
                <p>This Week Only for World Premier</p>
                <p className="text-4xl">
                  Explore top-tier
                  <br />
                  properties
                </p>
                <Button className=" w-fit space-x-2 bg-green-700">
                  <Link
                    href={"/properties"}
                    className="flex items-center space-x-2"
                  >
                    Find Now <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
        {/* <Image
          src={bg}
          alt="bg"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute bg-black opacity-50 w-full h-full" />
        <div className="absolute w-full h-full flex flex-col p-10 text-white font-bold justify-center space-y-10">
          <p>This Week Only for World Premier</p>
          <p className="text-4xl">
            New Top Product
            <br />
            High Quality
          </p>
          <Button className=" w-fit space-x-2 bg-green-700">
            <Link href={"/properties"} className="flex items-center space-x-2">
              Find Now <ArrowRight />
            </Link>
          </Button>
        </div> */}
        <div className="absolute w-full flex justify-center bottom-2">
          <div className=" flex justify-center space-x-2 bottom-2">
            {adverts.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full ${
                  active === index ? "bg-green-500" : "bg-gray-300"
                }`}
                onClick={() => setActive(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:col-span-2 bg-accent dark:bg-gray-900 rounded-md p-2 flex flex-col space-y-2 pt-10">
        <div className="flex space-x-2">
          <div className="flex flex-col justify-center space-y-2">
            <p>Over 1000 properties</p>
            <p className="font-bold text-lg">Find property</p>
          </div>
        </div>
        <HomeFilterForm />
      </div>
    </div>
  );
};

export default HeroBanner;

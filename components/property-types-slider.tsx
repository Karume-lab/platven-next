"use client";

import { FC, useState, useRef } from "react";
import { PropertyType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

type ProperTypeWithCount = PropertyType & {
  _count: {
    properties: number;
  };
};

const PropertyTypesSlider: FC<{
  propertyTypes: ProperTypeWithCount[];
}> = ({ propertyTypes }) => {
  const [autoplay, setAutoplay] = useState(true);
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  return (
    <div
      className="w-full relative px-12 sm:px-16"
      onMouseEnter={() => {
        setAutoplay(false);
        plugin.current.stop();
      }}
      onMouseLeave={() => {
        setAutoplay(true);
        plugin.current.play();
      }}
    >
      <Carousel
        plugins={autoplay ? [plugin.current] : []}
        opts={{
          loop: true,
          align: 'start',
          slidesToScroll: 1,
        }}
        className="w-full"
      >
        <CarouselContent className="ml-2 p-3 md:-ml-4">
          {[...propertyTypes, ...propertyTypes, ...propertyTypes].map(
            ({ icon, id, title, _count: { properties } }, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <Link
                  href={`/properties?typeId=${id}`}
                  passHref
                  className="block"
                >
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 group">
                    <CardContent className="p-4 flex flex-col items-center sm:flex-row sm:items-start relative">
                      <img
                        src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${icon}`}
                        alt={title}
                        width={60}
                        height={60}
                        className="mb-4 sm:mb-0 sm:mr-4 transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="flex flex-col justify-center text-center sm:text-left">
                        <h2 className="font-bold text-lg mb-1 group-hover:text-green-500 transition-colors duration-300">{title}</h2>
                        <p className="text-sm text-gray-600">{`${properties} properties`}</p>
                      </div>
                      <div className="absolute bottom-2 right-2 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View &rarr;
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            )
          )}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-8 sm:-left-12 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute -right-8 sm:-right-12 top-1/2 -translate-y-1/2" />
      </Carousel>
      {/* <div
          className="flex space-x-4 lg:space-x-16 animate-loop-scroll group-hover:paused"
          aria-hidden="true"
        >
          {[...propertyTypes, ...propertyTypes].map(
            ({ createdAt, icon, id, title, properties }, index) => (
              <div key={index} className="flex space-x-2">
                <Image
                  src={{ src: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${icon}`, width: 100, height: 100 }}
                  alt={title}
                />
                <div className="flex flex-col justify-center">
                  <h1 className="font-bold">{title}</h1>
                  <p>{`${properties.length} properties`}</p>
                </div>
              </div>
            ),
          )}
        </div> */}
    </div>
  );
};

export default PropertyTypesSlider;
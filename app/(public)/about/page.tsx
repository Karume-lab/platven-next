import HeroSection from "@/components/hero-seaction";
import { coreValues, services } from "@/constants/data";
import { getSessionUser } from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import aboutRound from "@/public/about-circle.png";
import service from "@/public/service.png";
import Image from "next/image";
import Link from "next/link";

type Props = {};

const AboutPage = async (props: Props) => {
  const agents = await prisma.team.findMany({
    include: { user: true },
    where: { isActive: true , user: {isActive: true}},
  });
  const user = await getSessionUser();

  return (
    <div className="flex flex-col  space-y-10">
      {/* hero */}
      <HeroSection
        title="About Platven LTD"
        subTitle="About us"
        description={
          <div className="text-white space-y-4">
            <p className="text-xl mt-4">Kwa Ushirikiano Twatimiza Ndoto</p>
            <p className="text-lg">(In partnership, We Fulfill Dreams)</p>
          </div>
        }
      />
      {/* hero */}
      {/* Main Body */}
      <div className="flex justify-center ">
        <div className="flex flex-col space-y-10 lg:max-w-[80%]">
          {/* Brief */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Image alt="" src={aboutRound} />
            <div className="flex flex-col justify-center space-y-10 p-10">
              <p className="text-2xl">
                Platven Ltd is a dynamic and client-focused real estate agency
                based in Juja. Founded with a vision to transform property
                dreams into reality, we have established ourselves as a trusted
                partner in the real estate industry. Our commitment to
                excellence, collaboration, and innovation sets us apart in
                helping our clients achieve their property goals.
              </p>
              <div className="grid grid-cols-3 gap-4 ">
                <div>
                  <p className="text-green-700 text-4xl">20K+</p>
                  <p>Properties</p>
                </div>
                <div>
                  <p className="text-green-700 text-4xl">12 k+</p>
                  <p>Customers</p>
                </div>
                <div>
                  <p className="text-green-700 text-4xl">60+</p>
                  <p>Awards</p>
                </div>
              </div>
            </div>
          </div>
          {/* Brief */}
          {/* Steps */}
          <section className="mx-auto px-6 md:max-w-screen-xl" id="ourservices">
            <div className="mx-auto mt-20 mb-16 block px-6 text-center">
              <h2 className="mx-auto text-4xl font-bold md:text-5xl">
                History
              </h2>
              <div className="mx-auto mt-6 mb-auto block w-full text-xl font-normal leading-9 md:w-3/4 xl:w-3/4">
                <p className="text-lg">
                  Platven Ltd was founded in 2023 by our visionary Managing
                  Director, Jacob Kariuki. Since our inception, we have steadily
                  grown, earning a reputation for reliability, trustworthiness,
                  and a commitment to exceeding client expectations. We have
                  successfully facilitated countless real estate transactions
                  and continue to expand our reach.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-20 mb-16 block px-6 text-center">
              <h2 className="mx-auto text-4xl font-bold md:text-5xl">
                Mission
              </h2>
              <div className="mx-auto mt-6 mb-auto block w-full text-xl font-normal leading-9 md:w-3/4 xl:w-3/4">
                <p className="text-lg">
                  To provide exceptional real estate services through
                  collaboration, innovation, and unwavering dedication, helping
                  our clients achieve their property dreams.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-20 mb-16 block px-6 text-center">
              <h2 className="mx-auto text-4xl font-bold md:text-5xl">Vision</h2>
              <div className="mx-auto mt-6 mb-auto block w-full text-xl font-normal leading-9 md:w-3/4 xl:w-3/4">
                <p className="text-lg">
                  Platven Real Estate strives to make property ownership more
                  accessible and boost business competitiveness and
                  sustainability. We achieve this by offering affordable,
                  analytics-driven business premises, transforming property
                  ownership to foster thriving businesses.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-20 mb-16 block px-6 text-center">
              <h2 className="mx-auto text-4xl font-bold md:text-5xl">
                Core values
              </h2>
              <div className="mx-auto mt-6 mb-auto block w-full text-xl font-normal leading-9 md:w-10/12 xl:w-10/12">
                <ul className="mt-4 gap-10 text-left mx-auto grid grid-cols-1 lg:grid-cols-3">
                  {coreValues.map(({ id, description, title }, index) => (
                    <li className="" key={id}>
                      <strong>{title}:</strong>{" "}
                      <span className="text-muted-foreground">
                        {description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          <section className="mx-auto px-6 md:max-w-screen-xl" id="ourservices">
            <div className="mx-auto mt-20 mb-16 block px-6 text-center">
              <h2 className="mx-auto text-4xl font-bold md:text-5xl">
                Our Services
              </h2>
              <div className="mx-auto mt-6 mb-auto block w-full text-xl font-normal leading-9 md:w-3/4 xl:w-3/4">
                <p className="text-lg">
                  To provide exceptional real estate services through
                  collaboration, innovation, and unwavering dedication, helping
                  our clients achieve their property dreams.
                </p>
              </div>
            </div>
            <div className="grid gap-10 pb-20 sm:grid-cols-2 lg:grid-cols-3">
              {services.map(({ description, id, title }, index) => (
                <div
                  className="rounded-md p-8 shadow shadow-slate-300 dark:shadow-slate-700"
                  key={index}
                >
                  <div className="my-4 flex items-center">
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg border bg-blue-50 text-2xl text-blue-500">
                      {/* et:beaker */}
                      <Image alt="" src={service} />
                    </div>
                    <h3 className="text-2xl font-bold md:text-xl">{title}</h3>
                  </div>
                  <p className="text-sm">{description}</p>
                </div>
              ))}
            </div>
          </section>
          {/* Steps */}
          {/* Agents */}
          <div className="flex justify-center " id="agents">
            <h2 className="mx-auto text-4xl font-bold md:text-5xl">
              Meet Our Agents
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {agents.map(
              (
                { id, image, user: { name, email, phoneNumber }, position },
                index,
              ) => (
                <div key={index} className="text-center group mb-[30px]">
                  <div className="relative rounded-[6px_6px_0px_0px]">
                    <Link href="@">
                      {/* <Image
                        src={{
                          src: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${image}`,
                          width: 215,
                          height: 310,
                        }}
                        className="w-auto h-auto block mx-auto"
                        alt={name}
                      /> */}
                      <img
                        src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${image}`}
                        className="w-auto h-auto block mx-auto"
                        alt={name}
                      />
                    </Link>
                    <ul className="flex flex-col absolute w-full top-[30px] left-0 overflow-hidden">
                      <li className="translate-x-[0px] group-hover:translate-x-[30px] opacity-0 group-hover:opacity-100 transition-all duration-300 mb-[15px]">
                        <a
                          href={`mailto:${email}`}
                          aria-label="svg"
                          className="w-[26px] h-[26px] transition-all rounded-full bg-[#FFF6F0] flex items-center justify-center hover:drop-shadow-[0px_4px_10px_rgba(0,0,0,0.25)] text-[#494949] hover:text-[#3B5998]"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                            />
                          </svg>
                        </a>
                      </li>
                      <li className="translate-x-[0px] group-hover:translate-x-[30px] opacity-0 group-hover:opacity-100 transition-all duration-500 mb-[15px]">
                        <a
                          href={`tel:${phoneNumber}`}
                          aria-label="svg"
                          className="w-[26px] h-[26px] transition-all rounded-full bg-[#FFF6F0] flex items-center justify-center hover:drop-shadow-[0px_4px_10px_rgba(0,0,0,0.25)] text-[#494949] hover:text-[#3B5998]"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z"
                            />
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-[#FFFDFC] z-[1] drop-shadow-[0px_2px_15px_rgba(0,0,0,0.1)] rounded-[0px_0px_6px_6px] px-3 md:px-[15px] py-[20px] border-b-[6px] border-primary transition-all duration-500 before:transition-all before:duration-300 group-hover:border-secondary relative">
                    <h3>
                      <Link
                        href={"#"}
                        className="font-lora font-normal text-base text-primary group-hover:text-green-700"
                      >
                        {name}
                      </Link>
                    </h3>
                    <p className="font-normal text-[14px] leading-none capitalize mt-[5px] group-hover:text-body">
                      {position}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
          {/* Agents */}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

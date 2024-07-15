import ContactForm from "@/components/forms/contact/contact-form";
import HeroSection from "@/components/hero-seaction";
import { getSessionUser } from "@/lib/auth-utils";
import config from "@/lib/config";
import { Mail, MapPin, PhoneCall } from "lucide-react";

const ContactUs = async () => {
  const user = await getSessionUser();
  return (
    <div>
      <HeroSection
        subTitle="Contact"
        title="Contact Us"
        description="Huge number of propreties availabe here for buy and sell also you can find here co-living property as you like"
      />
      <div className="flex justify-center w-full">
        <div className="flex flex-col space-y-10 w-full lg:max-w-[80%] p-4">
          <section className="flex-flex-col space-y-8">
            <h1 className="text-4xl">Send message</h1>
            <p className="max-w-[600px]">
              {`Get in touch with our friendly team for any inquiries, assistance,
              or guidance. We're here to help you navigate your property journey
              smoothly.`}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="w-full h-full shadow shadow-slate-400 dark:shadow-slate-700 lg:col-span-2 rounded-md p-8">
                <ContactForm user={user as any} />
              </div>
              <div className="w-full h-full bg-accent rounded-md overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.073767299159!2d37.016018599999995!3d-1.1069185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f4730452daaf3%3A0x454fa9f6411e194c!2sPLATVEN%20LTD!5e0!3m2!1sen!2ske!4v1715760084530!5m2!1sen!2ske"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </section>
          <section className="">
            <div className="grid col-span-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[30px] mb-[-30px]">
              <div className="flex hover:drop-shadow-[0px_16px_10px_rgba(0,0,0,0.1)] hover:bg-green-700 transition-all p-[20px] xl:p-[35px] rounded-[8px] mb-[30px] group">
                <MapPin
                  className="self-center mr-[20px] sm:mr-[40px] lg:mr-[20px] xl:mr-[40px] sm:mb-[15px] lg:mb-0"
                  width={40}
                  height={55}
                />

                <div className="flex-1">
                  <h4 className="font-lora group-hover:text-secondary group-hover:transition-all leading-none text-[28px] text-primary mb-[10px]">
                    Address <span className="text-secondary">.</span>
                  </h4>
                  <p className="font-light text-[18px] lg:max-w-[230px]">
                    2104 Juja, Kiambu Kenya
                  </p>
                </div>
              </div>
              <div className="flex hover:drop-shadow-[0px_16px_10px_rgba(0,0,0,0.1)] hover:bg-green-700 transition-all p-[20px] xl:p-[35px] rounded-[8px] mb-[30px] group">
                <PhoneCall
                  className="self-center mr-[20px] sm:mr-[40px] lg:mr-[20px] xl:mr-[40px] sm:mb-[15px] lg:mb-0"
                  width={46}
                  height={46}
                />
                <div className="flex-1">
                  <h4 className="font-lora group-hover:text-secondary group-hover:transition-all leading-none text-[28px] text-primary mb-[10px]">
                    Call us <span className="text-secondary">.</span>
                  </h4>
                  <p className="font-light text-[18px] lg:max-w-[230px]">
                    <a
                      href={`tel:${config.contact.phoneNumber}`}
                      className="hover:text-secondary"
                    >
                      {config.contact.phoneNumber}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex hover:drop-shadow-[0px_16px_10px_rgba(0,0,0,0.1)] hover:bg-green-700 transition-all p-[20px] xl:p-[35px] rounded-[8px] mb-[30px] xl:pl-[65px] group">
                <Mail
                  className="self-center mr-[20px] sm:mr-[40px] lg:mr-[20px] xl:mr-[40px] sm:mb-[15px] lg:mb-0"
                  width={46}
                  height={52}
                />
                <div className="flex-1">
                  <h4 className="font-lora group-hover:text-secondary group-hover:transition-all leading-none text-[28px] text-primary mb-[10px]">
                    Email us <span className="text-secondary">.</span>
                  </h4>
                  <p className="font-light text-[18px] lg:max-w-[230px]">
                    <a
                      href={`mailto:${config.contact.email}`}
                      className="hover:text-secondary"
                    >
                      {config.contact.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

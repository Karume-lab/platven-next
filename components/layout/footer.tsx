import config from "@/lib/config";
import logo from "@/public/platven_logo.png";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative mt-20 bg-gray-900 px-4 pt-20">
      <div className="absolute -top-10 left-1/2 h-16 w-16 -translate-x-1/2 rounded-xl border-4 border-green-500 bg-white p-2">
        <Image className="h-full object-contain" src={logo} alt="" />
      </div>
      <div className="flex justify-center w-full  text-white mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:max-w-[80%] gap-10">
          <div>
            <Image src={logo} alt="logo" />
            <p>
              We Provide Right Choice Of Properties That You Need And Have Great
              Opportunity To Choose From Thousands Of Collection .
            </p>
          </div>
          <div>
            <ul className="space-y-3">
              <li className="font-bold text-xl">Company</li>
              <li className="opacity-50">
                <Link href={"/"}>Home</Link>
              </li>
              <li className="opacity-50">
                <Link href={"/about"}>About Us</Link>
              </li>
              <li className="opacity-50">
                <Link href={"/properties"}>Properties</Link>
              </li>
              <li className="opacity-50">
                <Link href="/terms" className="font-medium text-white">
                  {`Terms & Conditions`}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-3">
              <li className="font-bold text-xl">Shortcuts</li>
              <li className="opacity-50">
                <Link href={"/about#agents"}>Agents</Link>
              </li>
              <li className="opacity-50">
                <Link href={"/about#howitworks"}>How it works</Link>
              </li>
              <li className="opacity-50">
                <Link href={"/about#ourservices"}>Our services</Link>
              </li>
              <li className="opacity-50">
                <Link href={"/about#whyus"}>Why Us</Link>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-3">
              <li className="font-bold text-xl">Contact Us</li>
              <li className="opacity-50">
                <Link
                  className="flex items-center space-x-2"
                  href={`mailto:${config.contact.email}`}
                >
                  <Mail /> <span>{config.contact.email}</span>
                </Link>
              </li>
              <li className="opacity-50">
                <Link
                  className="flex items-center space-x-2"
                  href={`tel:${config.contact.phoneNumber}`}
                >
                  <Phone /> <span>{config.contact.phoneNumber}</span>
                </Link>
              </li>
              <li className="opacity-50">
                <Link href={"/contact"}>
                  Thika Road,Juja Town Gitawa Building 4th floor, Room 9
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col lg:flex-row justify-between items-center mx-auto mb-10 w-full lg:max-w-[80%] text-center">
          <p className="py-10 text-center text-gray-300">
            © {new Date(Date.now()).getFullYear()} Platven LTD | All Rights
            Reserved
          </p>
          <p className="py-10 text-center text-gray-300">
            Powered by <a href="https://vstech.co.ke">VSTech LTD</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

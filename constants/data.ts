import budget from "@/public/money-bag.png";
import searchproperty from "@/public/search-house.png";
import trust from "@/public/trust.png";
import { NavItem } from "@/types";
export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: "Candice Schiner",
    company: "Dell",
    role: "Frontend Developer",
    verified: false,
    status: "Active",
  },
  {
    id: 2,
    name: "John Doe",
    company: "TechCorp",
    role: "Backend Developer",
    verified: true,
    status: "Active",
  },
  {
    id: 3,
    name: "Alice Johnson",
    company: "WebTech",
    role: "UI Designer",
    verified: true,
    status: "Active",
  },
  {
    id: 4,
    name: "David Smith",
    company: "Innovate Inc.",
    role: "Fullstack Developer",
    verified: false,
    status: "Inactive",
  },
  {
    id: 5,
    name: "Emma Wilson",
    company: "TechGuru",
    role: "Product Manager",
    verified: true,
    status: "Active",
  },
  {
    id: 6,
    name: "James Brown",
    company: "CodeGenius",
    role: "QA Engineer",
    verified: false,
    status: "Active",
  },
  {
    id: 7,
    name: "Laura White",
    company: "SoftWorks",
    role: "UX Designer",
    verified: true,
    status: "Active",
  },
  {
    id: 8,
    name: "Michael Lee",
    company: "DevCraft",
    role: "DevOps Engineer",
    verified: false,
    status: "Active",
  },
  {
    id: 9,
    name: "Olivia Green",
    company: "WebSolutions",
    role: "Frontend Developer",
    verified: true,
    status: "Active",
  },
  {
    id: 10,
    name: "Robert Taylor",
    company: "DataTech",
    role: "Data Analyst",
    verified: false,
    status: "Active",
  },
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
    roles: ["staff", "client", "admin"],
  },
  {
    title: "User",
    href: "/dashboard/user",
    icon: "staff",
    label: "user",
    roles: ["staff", "admin"],
  },
  {
    title: "Staff",
    href: "/dashboard/staff",
    icon: "staff",
    label: "staff",
    roles: ["admin"],
  },
  {
    title: "Properties",
    href: "/dashboard/properties",
    icon: "property",
    label: "user",
    roles: ["staff", "client", "admin"],
  },
  {
    title: "Property types",
    href: "/dashboard/properties/types",
    icon: "propertyTypes",
    label: "property-requests",
    roles: ["admin"],
  },
  {
    title: "Property Request",
    href: "/dashboard/property-requests",
    icon: "propertyRequests",
    label: "property-type",
    roles: ["staff", "admin"],
  },
  {
    title: "Adverts",
    href: "/dashboard/adverts",
    icon: "advert",
    label: "adverts",
    roles: ["staff", "admin"],
  },
  {
    title: "Messages",
    href: "/dashboard/contact",
    icon: "messages",
    label: "property-type",
    roles: ["staff", "admin"],
  },

  {
    title: "Employee",
    href: "/dashboard/employee",
    icon: "employee",
    label: "employee",
    roles: [],
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: "profile",
    label: "profile",
    roles: ["client", "staff", "admin"],
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: "wallet",
    label: "payment",
    roles: ["client", "staff", "admin"],
  },
  {
    title: "Kanban",
    href: "/dashboard/kanban",
    icon: "kanban",
    label: "kanban",
    roles: [],
  },
  {
    title: "Change Password",
    href: "/dashboard/change-password",
    icon: "lock",
    label: "change-password",
    roles: ["staff", "admin", "client"],
  },
];

export const publicNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
    roles: [],
  },
  {
    title: "Home",
    href: "/",
    icon: "home",
    label: "Dashboard",
    roles: [],
  },
  {
    title: "Properties",
    href: "/properties",
    icon: "property",
    label: "user",
    roles: [],
  },
  {
    title: "About",
    href: "/about",
    icon: "about",
    label: "profile",
    roles: [],
  },
  {
    title: "Contact",
    href: "/contact",
    icon: "contact",
    label: "kanban",
    roles: [],
  },
];

export const services = [
  {
    id: "1",
    title: "Property Listings and Search",
    description:
      "An extensive, regularly updated database of available properties, including residential, commercial, and land listings.",
  },
  {
    id: "2",
    title: "Property Valuation Services",
    description:
      " Accurate property valuation reports to help sellers set realistic prices and buyers make informed offers.",
  },
  {
    id: "3",
    title: "Legal and Paperwork Assistance",
    description:
      "Facilitation of legal procedures and documentation, ensuring a smooth property transaction process.",
  },
  {
    id: "4",
    title: "Agent Support and Consultancy",
    description:
      " Personalized support from experienced agents for buyers and sellers, helping with negotiations, viewings, and deal closures.",
  },
  {
    id: "5",
    title: "Property Management Services",
    description:
      "Full-service management for landlords and property owners, including tenant screening, rent collection, and maintenance coordination.",
  },
  {
    id: "6",
    title: "Investment Advisory",
    description:
      "Strategic advice for real estate investors seeking to diversify their portfolios or maximize returns.",
  },
];
export const steps = [
  {
    id: "1",
    title: "Browse Properties",
    icon: "search",
    description:
      " Use filters like location, price, and type to find your perfect match from our diverse selection.",
  },
  {
    id: "2",
    icon: "house",
    title: "Select a Property",
    description:
      "View detailed pages and request more info or schedule a viewing",
  },
  {
    id: "3",
    icon: "handShake",
    title: "Let Our Agents Facilitate",
    description:
      "Our agents will handle the process, from visits to negotiations and paperwork.",
  },
];

export const whyUs = [
  {
    id: "1",
    icon: searchproperty,
    title: "Find Property with ease",
    description:
      "Our user-friendly platform, comprehensive listings, and intuitive search tools make finding your perfect property effortless, whether you’re looking to rent or buy.",
  },
  {
    id: "2",
    icon: budget,
    title: "Budget Friendly",
    description:
      "With our transparent pricing and cost-effective solutions, we help you find properties that suit your financial goals without compromising on quality.      ",
  },
  {
    id: "2",
    icon: trust,
    title: "Trusted By Thousand",
    description:
      "Our commitment to service excellence and integrity has earned us the trust of thousands of clients who rely on us for their real estate needs.",
  },
];

export const coreValues = [
  {
    id: 1,
    title: "Integrity",
    description: `We uphold the highest ethical standards in all our
  interactions, building trust with our clients, partners, and
  team members.`,
  },
  {
    id: 2,
    title: "Collaboration",
    description: `We believe that
    together, we can achieve more. We foster a culture of
    teamwork and cooperation to deliver exceptional results.
 `,
  },
  {
    id: 3,
    title: "Excellence",
    description: `We strive for
    excellence in everything we do, continuously improving our
    services and exceeding client expectations.
 `,
  },
  {
    id: 4,
    title: "Innovation",
    description: `We embrace
    innovation and adapt to the evolving real estate landscape,
    leveraging technology and creative solutions to stay ahead.
 `,
  },
  {
    id: 5,
    title: "Client-Centric",
    description: ` Our clients'
    dreams and needs are at the heart of our business. We go the
    extra mile to understand and fulfill their aspirations.
 `,
  },
  {
    id: 6,
    title: "Community Engagement",
    description: `We
    actively engage with and give back to the communities we
    serve, contributing to their well-being and growth.
 `,
  },
];

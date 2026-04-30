import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import p5 from "@/assets/project-5.jpg";
import p6 from "@/assets/project-6.jpg";

export const NAV = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export const PROJECTS = [
  {
    id: "01",
    title: "The Ashford Residence",
    location: "Private Home — Karen",
    type: "Full Interior Styling",
    description:
      "A layered family home built around heirloom mirrors, soft linen, and warm oak. Every room composed to feel quiet, lived-in, and unmistakably personal.",
    image: p1,
    span: "lg:col-span-7 lg:row-span-2",
  },
  {
    id: "02",
    title: "Willow Court Living Room",
    location: "Apartment — Westlands",
    type: "Living Room Refresh",
    description:
      "A soft restraint of cream, walnut, and sculptural light. We pared the room back to a few considered pieces and let the proportions do the talking.",
    image: p2,
    span: "lg:col-span-5",
  },
  {
    id: "03",
    title: "The Ivory Mirror Edit",
    location: "Curated Collection",
    type: "Decorative Mirrors",
    description:
      "An edit of arched, gilded, and modern mirrors styled as a single composition — designed to bring light and architecture into a quiet hallway.",
    image: p3,
    span: "lg:col-span-5",
  },
  {
    id: "04",
    title: "Oak & Linen Lounge",
    location: "Townhouse — Lavington",
    type: "Lounge Styling",
    description:
      "Slipcovered linen, oak grain, and a slow palette of sand and bone. A living space styled around long afternoons and unhurried conversation.",
    image: p4,
    span: "lg:col-span-7",
  },
  {
    id: "05",
    title: "The Portrait Wall Collection",
    location: "Private Study — Runda",
    type: "Portrait Curation",
    description:
      "A measured composition of vintage and contemporary portraits, framed and hung to feel collected over time rather than placed in a single afternoon.",
    image: p5,
    span: "lg:col-span-7",
  },
  {
    id: "06",
    title: "The Sandstone Suite",
    location: "Master Bedroom — Kileleshwa",
    type: "Bedroom Styling",
    description:
      "Warm sandstone, washed linen, and soft ambient lamps. A bedroom suite designed as a quiet retreat from the rhythm of the rest of the house.",
    image: p6,
    span: "lg:col-span-5",
  },
];

export const SERVICES = [
  {
    n: "01",
    title: "Interior Styling",
    body: "Considered styling for finished spaces — from the proportion of furniture to the placement of a single ceramic. We work room by room until the home reads as one piece.",
  },
  {
    n: "02",
    title: "Decorative Mirrors",
    body: "Sourced and bespoke mirrors chosen for character and scale. Used to draw light, frame architecture, and give a wall its quiet sense of weight.",
  },
  {
    n: "03",
    title: "Portrait Curation",
    body: "Editing, framing, and hanging portraits and personal artwork into compositions that feel collected over years rather than installed in a day.",
  },
  {
    n: "04",
    title: "Curated Decor Selection",
    body: "A carefully edited selection of objects, textiles, and accents — sourced to suit the temperament of your home rather than a passing trend.",
  },
  {
    n: "05",
    title: "Space Refresh Consultation",
    body: "A focused one-room reset. We re-style what you own, identify the few pieces worth adding, and leave the room feeling considered again.",
  },
  {
    n: "06",
    title: "Residential Interior Styling",
    body: "End-to-end styling for new builds and refurbishments — designed in close conversation with you, your architect, and the rhythm of the home.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "JECMWA styled our living room with such restraint and warmth. Nothing feels staged — it simply feels like the room was always meant to look this way.",
    name: "Anita W.",
    label: "The Ashford Residence",
  },
  {
    quote:
      "The mirror edit completely changed how the hallway feels. There is a quiet confidence in their choices that I have not found elsewhere.",
    name: "David & Mercy K.",
    label: "Willow Court",
  },
  {
    quote:
      "Working with the studio felt unhurried and considered. They understood our home, our portraits, and the kind of life we wanted to live in it.",
    name: "Joan M.",
    label: "Private Study, Runda",
  },
];

export const CONTACT = {
  whatsapp: "https://wa.me/254700000000",
  phone: "tel:+254700000000",
  email: "mailto:hello@jecmwa.co.ke",
  phoneDisplay: "+254 700 000 000",
  emailDisplay: "hello@jecmwa.co.ke",
  hours: "Studio hours — Mon to Fri, 9:00 to 17:00 EAT",
  location: "Studio appointments by request — Nairobi, Kenya",
};

import {
  Home,
  Armchair,
  PartyPopper,
  Castle,
  Briefcase,
  Music,
  Wifi,
  Car,
  Snowflake,
  Tv,
  Monitor,
  Coffee,
} from "lucide-react";

const STEPS = [
  { id: 1, label: "The Basics" },
  { id: 2, label: "Location" },
  { id: 3, label: "Pricing" },
  { id: 4, label: "Schedule" },
  { id: 5, label: "Amenities" },
  { id: 6, label: "Photos" },
];

const CATEGORIES = [
  {
    id: "apartment",
    label: "Apartment",
    icon: <Home className="w-8 h-8 mb-2" />,
  },
  {
    id: "studio",
    label: "Studio",
    icon: <Armchair className="w-8 h-8 mb-2" />,
  },
  {
    id: "hall",
    label: "Event Hall",
    icon: <PartyPopper className="w-8 h-8 mb-2" />,
  },
  { id: "villa", label: "Villa", icon: <Castle className="w-8 h-8 mb-2" /> },
  {
    id: "office",
    label: "Office/Pod",
    icon: <Briefcase className="w-8 h-8 mb-2" />,
  },
  {
    id: "jamroom",
    label: "Jam Room",
    icon: <Music className="w-8 h-8 mb-2" />,
  },
];

const AMENITIES = [
  { id: "wifi", label: "Fast Wifi", icon: <Wifi /> },
  { id: "parking", label: "Parking", icon: <Car /> },
  { id: "ac", label: "Air Conditioning", icon: <Snowflake /> },
  { id: "tv", label: "Smart TV", icon: <Tv /> },
  { id: "desk", label: "Work Desk", icon: <Monitor /> },
  { id: "coffee", label: "Coffee Machine", icon: <Coffee /> },
];

const DURATIONS = [
  { id: "1h", label: "1 Hour" },
  { id: "3h", label: "3 Hours" },
  { id: "6h", label: "6 Hours" },
  { id: "12h", label: "12 Hours" },
  { id: "24h", label: "24 Hours" },
];

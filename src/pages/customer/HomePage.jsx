import React from "react";
import LoginPage from "../auth/LoginPage";
import RoleSelectionPage from "../auth/RoleSelectionPage";
import RegisterPage from "../auth/RegisterPage";
import Navbar from "@/components/common/Navbar";
import VendorDetailsPage from "../vendor/VendorDetailsPage";
import VendorPendingPage from "../vendor/VendorPendingPage";
import HotelListingPage from "./HotelListingPage";
import HotelCard from "@/components/hotel/HotelCard";
import HotelDetailPage from "./HotelDetailPage";
import EventListingPage from "./EventListingPage";
import EventDetailsSkeleton from "@/components/event/EventDetailSkeleton";
import EventsDetailPage from "./EventsDetailPage";

const HomePage = () => {
  return <EventListingPage />;
};

export default HomePage;

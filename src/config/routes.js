const routes = {
  auth: {
    login: "/login",
    register: "/register",
    callback: "/auth/callback",
    roleSelection: "/auth/role-selection",
  },
  customer: {
    home: "/",
    hotel: "/hotel",
    hotelDetail: "/hotel/:id",
    events: "/events",
    eventDetails: "/event/:id",
    wishlist: "/wishlist",
    mybooking: "/my-booking",
    booking: "booking/:id",
  },

  vendor: {
    details: "/vendor/details",
    pendingApproval: "/vendor/pending-approval",
    dashboard: "/vendor",
    listing: "/vendor/listing",
    addHotel: "/vendor/add-hotel",
  },

  admin: {
    dashboard: "/admin",
    vendor: "/admin/vendor",
  },
};

export default routes;

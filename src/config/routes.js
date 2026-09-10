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
    mybooking: "/my-bookings",
    booking: "/booking/:id",
  },

  vendor: {
    details: "/vendor/details",
    pendingApproval: "/vendor/pending-approval",
    dashboard: "/vendor",
    listing: "/vendor/listing",
    addHotel: "/vendor/add-hotel",
    myHotel: "/vendor/my-hotel",
    addEvent: "/vendor/add-event",
    myEvents: "/vendor/my-events",
    editHotel: "/vendor/edit-hotel/:id",
    editEvent: "/vendor/edit-event/:id",
    bookings: "/vendor/bookings",
  },

  admin: {
    dashboard: "/admin",
    vendor: "/admin/vendor",
  },

  account: {
    profile: "/profile",
    settings: "/settings",
  },
};

export default routes;

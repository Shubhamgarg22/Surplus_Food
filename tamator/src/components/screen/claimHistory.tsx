// import React, { useState } from "react";
// import { Button } from "../ui/button.tsx";
// import {
//   Calendar,
//   MapPin,
//   Utensils,
//   Check,
//   Clock,
//   X,
//   Search,
// } from "lucide-react";

// interface Claim {
//   id: string;
//   donorName: string;
//   address: string;
//   timestamp: string;
//   foodType: string;
//   quantity: string;
//   status: "claimed" | "picked-up" | "missed";
//   receipt?: string;
// }

// const claimHistory: Claim[] = [
//   // Your mock data here...
// ];

// export default function ClaimHistory() {
//   const [dateRange, setDateRange] = useState<"today" | "week" | "all">("week");
//   const [foodTypeFilter, setFoodTypeFilter] = useState<
//     "all" | "meals" | "bakery" | "produce"
//   >("all");
//   const [searchQuery, setSearchQuery] = useState<string>("");

//   const filteredClaims = claimHistory.filter((claim) => {
//     const matchesDate =
//       dateRange === "all" ||
//       (dateRange === "today" && claim.timestamp.includes("Today")) ||
//       (dateRange === "week" &&
//         (claim.timestamp.includes("Today") ||
//           claim.timestamp.includes("Yesterday")));

//     const matchesFoodType =
//       foodTypeFilter === "all" ||
//       claim.foodType.toLowerCase() === foodTypeFilter;

//     const lowerSearch = searchQuery.toLowerCase();
//     const matchesSearch =
//       claim.donorName.toLowerCase().includes(lowerSearch) ||
//       claim.foodType.toLowerCase().includes(lowerSearch);

//     return matchesDate && matchesFoodType && matchesSearch;
//   });

//   // Calculate stats
//   const mealsClaimed = claimHistory.reduce((sum, claim) => {
//     const quantityNum = parseInt(claim.quantity) || 0;
//     return (
//       sum + (claim.quantity.toLowerCase().includes("meals") ? quantityNum : 0)
//     );
//   }, 0);
//   const pickupsCompleted = claimHistory.filter(
//     (c) => c.status === "picked-up"
//   ).length;
//   const pickupsMissed = claimHistory.filter(
//     (c) => c.status === "missed"
//   ).length;
//   const co2Saved = Math.round(mealsClaimed * 0.5);

//   return (
//     <div
//       style={{ minHeight: "100vh", backgroundColor: "#fff", padding: "2rem" }}
//     >
//       <div className="container">
//         {/* Header + Stats */}
//         <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
//           <h1 className="h3 mb-3 mb-md-0">Claimed Food History</h1>

//           <div className="row g-3 w-100 w-md-auto">
//             {[
//               {
//                 label: "Meals Claimed",
//                 value: `${mealsClaimed} meals`,
//                 textClass: "text-success",
//               },
//               {
//                 label: "Total Pickups",
//                 value: pickupsCompleted,
//                 textClass: "text-success",
//               },
//               {
//                 label: "Missed Pickups",
//                 value: pickupsMissed,
//                 textClass: "text-danger",
//               },
//               {
//                 label: "CO₂ Saved",
//                 value: `${co2Saved} kg`,
//                 textClass: "text-success",
//               },
//             ].map(({ label, value, textClass }) => (
//               <div className="col-md-3 col-6" key={label}>
//                 <div className="bg-light p-3 rounded">
//                   <p className="text-muted small mb-1">{label}</p>
//                   <h5 className={textClass} style={{ fontWeight: "600" }}>
//                     {value}
//                   </h5>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="row g-3 mb-4">
//           <div className="col-md-4">
//             <label className="form-label d-flex align-items-center">
//               <Calendar size={16} className="me-2" />
//               Date Range
//             </label>
//             <select
//               className="form-select"
//               value={dateRange}
//               onChange={(e) =>
//                 setDateRange(e.target.value as "today" | "week" | "all")
//               }
//               aria-label="Select date range filter"
//             >
//               <option value="today">Today</option>
//               <option value="week">This Week</option>
//               <option value="all">All Time</option>
//             </select>
//           </div>

//           <div className="col-md-4">
//             <label className="form-label d-flex align-items-center">
//               <Utensils size={16} className="me-2" />
//               Food Type
//             </label>
//             <select
//               className="form-select"
//               value={foodTypeFilter}
//               onChange={(e) =>
//                 setFoodTypeFilter(
//                   e.target.value as "all" | "meals" | "bakery" | "produce"
//                 )
//               }
//               aria-label="Select food type filter"
//             >
//               <option value="all">All Types</option>
//               <option value="meals">Meals</option>
//               <option value="bakery">Bakery</option>
//               <option value="produce">Produce</option>
//             </select>
//           </div>

//           <div className="col-md-4">
//             <label className="form-label d-flex align-items-center">
//               <Search size={16} className="me-2" />
//               Search
//             </label>
//             <input
//               type="search"
//               className="form-control"
//               placeholder="Search by donor or food type"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               aria-label="Search claims"
//             />
//           </div>
//         </div>

//         {/* Claim History List */}
//         {filteredClaims.length > 0 ? (
//           filteredClaims.map((claim) => (
//             <div
//               className="card mb-3"
//               key={claim.id}
//               style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}
//             >
//               <div className="card-body">
//                 <div className="row">
//                   {/* Donor Info */}
//                   <div className="col-md-4">
//                     <h5>{claim.donorName}</h5>
//                     <p className="text-muted mb-1 d-flex align-items-center">
//                       <MapPin size={14} className="me-1" />
//                       {claim.address}
//                     </p>
//                     <p className="text-muted d-flex align-items-center">
//                       <Clock size={14} className="me-1" />
//                       {claim.timestamp}
//                     </p>
//                   </div>

//                   {/* Food Details */}
//                   <div className="col-md-5">
//                     <p className="mb-1 d-flex align-items-center">
//                       <Utensils size={16} className="me-2 text-muted" />
//                       <strong>{claim.foodType}</strong>
//                     </p>
//                     <p className="text-muted mb-2">{claim.quantity}</p>
//                     {claim.receipt && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         style={{ padding: "0.25rem 0.75rem" }}
//                       >
//                         View Receipt
//                       </Button>
//                     )}
//                   </div>

//                   {/* Status */}
//                   <div className="col-md-3 d-flex align-items-start justify-content-md-end mt-2 mt-md-0">
//                     <span
//                       className={`badge ${
//                         claim.status === "picked-up"
//                           ? "bg-success"
//                           : claim.status === "claimed"
//                           ? "bg-warning text-dark"
//                           : "bg-danger"
//                       }`}
//                       style={{
//                         fontSize: "0.9rem",
//                         display: "flex",
//                         alignItems: "center",
//                       }}
//                     >
//                       {claim.status === "picked-up" ? (
//                         <Check size={14} className="me-1" />
//                       ) : claim.status === "missed" ? (
//                         <X size={14} className="me-1" />
//                       ) : null}
//                       {claim.status === "picked-up"
//                         ? "Picked Up"
//                         : claim.status === "claimed"
//                         ? "Claimed"
//                         : "Missed"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="card text-center p-5">
//             <div className="card-body">
//               <p className="text-muted mb-3">
//                 No claims found matching your filters
//               </p>
//               <button
//                 className="btn btn-outline-success"
//                 onClick={() => {
//                   setDateRange("all");
//                   setFoodTypeFilter("all");
//                   setSearchQuery("");
//                 }}
//                 aria-label="Clear filters"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React from "react";
import { useState, ChangeEvent } from "react";
import {
  Calendar,
  MapPin,
  Utensils,
  Check,
  Clock,
  X,
  Search,
} from "lucide-react";

interface Claim {
  id: number;
  donorName: string;
  address: string;
  timestamp: string;
  foodType: string;
  quantity: string;
  status: "picked-up" | "claimed" | "missed";
  receipt: boolean;
}

const claimHistory: Claim[] = [
  {
    id: 1,
    donorName: "Green Bistro",
    address: "123 Main St (1.2km away)",
    timestamp: "Today, 2:30 PM",
    foodType: "Vegetable Curry",
    quantity: "12 meals",
    status: "picked-up",
    receipt: true,
  },
  {
    id: 2,
    donorName: "Urban Bakery",
    address: "456 Oak Ave (0.8km away)",
    timestamp: "Yesterday, 4:15 PM",
    foodType: "Assorted Pastries",
    quantity: "8kg",
    status: "picked-up",
    receipt: true,
  },
  {
    id: 3,
    donorName: "Fresh Market",
    address: "789 Pine Rd (2.5km away)",
    timestamp: "Yesterday, 11:30 AM",
    foodType: "Mixed Fruits",
    quantity: "15kg",
    status: "claimed",
    receipt: false,
  },
  {
    id: 4,
    donorName: "Cafe Harmony",
    address: "101 Elm Blvd (3.1km away)",
    timestamp: "Jun 12, 2023, 3:45 PM",
    foodType: "Sandwiches",
    quantity: "20 meals",
    status: "missed",
    receipt: false,
  },
];

export default function ClaimHistory() {
  const [dateRange, setDateRange] = useState<"today" | "week" | "all">("week");
  const [foodTypeFilter, setFoodTypeFilter] = useState<
    "all" | "meals" | "bakery" | "produce"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter claims based on selected filters
  const filteredClaims = claimHistory.filter((claim) => {
    const matchesDate =
      dateRange === "all" ||
      (dateRange === "today" && claim.timestamp.includes("Today")) ||
      (dateRange === "week" &&
        (claim.timestamp.includes("Today") ||
          claim.timestamp.includes("Yesterday")));

    const matchesFoodType =
      foodTypeFilter === "all" ||
      (foodTypeFilter === "meals" &&
        claim.quantity.toLowerCase().includes("meals")) ||
      (foodTypeFilter === "bakery" &&
        claim.foodType.toLowerCase().includes("pastries")) ||
      (foodTypeFilter === "produce" &&
        (claim.foodType.toLowerCase().includes("fruits") ||
          claim.foodType.toLowerCase().includes("vegetable")));

    const matchesSearch =
      claim.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.foodType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDate && matchesFoodType && matchesSearch;
  });

  // Calculate analytics
  const mealsClaimed = claimHistory.reduce((sum, claim) => {
    const quantity = parseInt(claim.quantity) || 0;
    return sum + (claim.quantity.includes("meals") ? quantity : 0);
  }, 0);

  const pickupsCompleted = claimHistory.filter(
    (c) => c.status === "picked-up"
  ).length;
  const pickupsMissed = claimHistory.filter(
    (c) => c.status === "missed"
  ).length;
  const co2Saved = Math.round(mealsClaimed * 0.5); // Approx 0.5kg CO2 per meal saved

  return (
    <div className="min-vh-100 bg-white p-3 p-md-5">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h1 className="h3 fw-bold mb-3 mb-md-0 text-dark">
            Claimed Food History
          </h1>

          {/* Analytics Summary */}
          <div className="row g-3 w-100 w-md-auto text-center">
            <div className="col-6 col-md-auto bg-success bg-opacity-10 rounded p-3">
              <p className="text-muted small mb-1">Meals Claimed</p>
              <p className="h5 fw-bold text-success mb-0">
                {mealsClaimed} meals
              </p>
            </div>
            <div className="col-6 col-md-auto bg-success bg-opacity-10 rounded p-3">
              <p className="text-muted small mb-1">Total Pickups</p>
              <p className="h5 fw-bold text-success mb-0">{pickupsCompleted}</p>
            </div>
            <div className="col-6 col-md-auto bg-danger bg-opacity-10 rounded p-3">
              <p className="text-muted small mb-1">Missed Pickups</p>
              <p className="h5 fw-bold text-danger mb-0">{pickupsMissed}</p>
            </div>
            <div className="col-6 col-md-auto bg-success bg-opacity-10 rounded p-3">
              <p className="text-muted small mb-1">CO₂ Saved</p>
              <p className="h5 fw-bold text-success mb-0">{co2Saved} kg</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="row g-3 mb-4">
          {/* Date Range */}
          <div className="col-12 col-md-4">
            <label
              htmlFor="date-range"
              className="form-label d-flex align-items-center"
            >
              <Calendar className="me-2" size={16} />
              Date Range
            </label>
            <select
              id="date-range"
              className="form-select"
              value={dateRange}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setDateRange(e.target.value as "today" | "week" | "all")
              }
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Food Type */}
          <div className="col-12 col-md-4">
            <label
              htmlFor="food-type"
              className="form-label d-flex align-items-center"
            >
              <Utensils className="me-2" size={16} />
              Food Type
            </label>
            <select
              id="food-type"
              className="form-select"
              value={foodTypeFilter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFoodTypeFilter(
                  e.target.value as "all" | "meals" | "bakery" | "produce"
                )
              }
            >
              <option value="all">All Types</option>
              <option value="meals">Meals</option>
              <option value="bakery">Bakery</option>
              <option value="produce">Produce</option>
            </select>
          </div>

          {/* Search */}
          <div className="col-12 col-md-4">
            <label
              htmlFor="search"
              className="form-label d-flex align-items-center"
            >
              <Search className="me-2" size={16} />
              Search
            </label>
            <input
              id="search"
              type="text"
              className="form-control"
              placeholder="Search by donor or food type"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>

        {/* Claim History Cards */}
        <div className="row gy-3">
          {filteredClaims.length > 0 ? (
            filteredClaims.map((claim) => (
              <div key={claim.id} className="col-12">
                <div className="card shadow-sm hover-shadow">
                  <div className="card-body">
                    <div className="row g-3">
                      {/* Donor Info */}
                      <div className="col-12 col-md-5">
                        <h5 className="card-title fw-bold mb-1">
                          {claim.donorName}
                        </h5>
                        <p className="text-muted mb-1 d-flex align-items-center">
                          <MapPin size={16} className="me-1" />
                          {claim.address}
                        </p>
                        <p className="text-muted d-flex align-items-center mb-0">
                          <Clock size={16} className="me-1" />
                          {claim.timestamp}
                        </p>
                      </div>

                      {/* Food Details */}
                      <div className="col-12 col-md-5">
                        <div className="d-flex align-items-center mb-2 text-secondary">
                          <Utensils size={16} className="me-2" />
                          <span className="fw-medium">{claim.foodType}</span>
                        </div>
                        <p className="mb-1">{claim.quantity}</p>
                        {claim.receipt && (
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                          >
                            View Receipt
                          </button>
                        )}
                      </div>

                      {/* Status */}
                      <div className="col-12 col-md-2 d-flex justify-content-md-end align-items-start">
                        <span
                          className={`badge rounded-pill px-3 py-1 fw-semibold d-flex align-items-center ${
                            claim.status === "picked-up"
                              ? "bg-success bg-opacity-25 text-success"
                              : claim.status === "claimed"
                              ? "bg-warning bg-opacity-25 text-warning"
                              : "bg-danger bg-opacity-25 text-danger"
                          }`}
                        >
                          {claim.status === "picked-up" && (
                            <Check size={16} className="me-1" />
                          )}
                          {claim.status === "missed" && (
                            <X size={16} className="me-1" />
                          )}
                          {claim.status === "picked-up"
                            ? "Picked Up"
                            : claim.status === "claimed"
                            ? "Claimed"
                            : "Missed"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="card shadow-sm text-center p-4">
                <p className="text-muted mb-3">
                  No claims found matching your filters
                </p>
                <button
                  className="btn btn-link text-success"
                  onClick={() => {
                    setDateRange("all");
                    setFoodTypeFilter("all");
                    setSearchQuery("");
                  }}
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

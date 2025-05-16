import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { Button } from "../ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card.tsx";
import { Label } from "../ui/label.tsx";
import { Truck, Clock, MapPin, Heart, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
// Mock data for food surplus listings
const foodSurplusListings = [
  {
    id: 1,
    donorName: "Green Bistro",
    address: "123 Main St, 2km away",
    foodType: "Vegetable Curry",
    quantity: "12 meals",
    expiry: "3 hours left",
    pickupWindow: "Today, 2-4 PM",
    coordinates: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: 2,
    donorName: "Urban Bakery",
    address: "456 Oak Ave, 1.5km away",
    foodType: "Assorted Pastries",
    quantity: "8kg",
    expiry: "5 hours left",
    pickupWindow: "Today, 3-5 PM",
    coordinates: { lat: 40.7158, lng: -74.008 },
  },
  {
    id: 3,
    donorName: "Fresh Market",
    address: "789 Pine Rd, 3km away",
    foodType: "Mixed Fruits",
    quantity: "15kg",
    expiry: "8 hours left",
    pickupWindow: "Today, 4-6 PM",
    coordinates: { lat: 40.7108, lng: -74.003 },
  },
];

export default function Home() {
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [filters, setFilters] = useState({
    distance: "5km",
    foodType: "all",
    expiry: "urgent",
  });

  const handleClaim = (id: number) => {
    alert(`Successfully claimed food listing #${id}`);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      {/* Top Bar */}
      <div
        style={{
          backgroundColor: "#27ae60",
          color: "white",
          padding: "1rem",
        }}
      >
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", margin: 0 }}>
              NGO Dashboard
            </h1>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.875rem" }}>Claimed Today</div>
                <div style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                  24 meals
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.875rem" }}>NGOs Served</div>
                <div style={{ fontSize: "1.25rem", fontWeight: "bold" }}>8</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.875rem" }}>Surplus Saved</div>
                <div style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                  42kg
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "1rem" }} className="container-fluid">
        <div className="row">
          {/* Sidebar Navigation */}
          <div
            className="col-md-3"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              padding: "1rem",
            }}
          >
            <Link to="/">
              <Button variant="ghost" className="w-100 text-start">
                <MapPin
                  className="me-2"
                  style={{ width: "1rem", height: "1rem" }}
                />
                Dashboard
              </Button>
            </Link>
            <Link to="/claimHistory">
              <Button variant="ghost" className="w-100 text-start">
                <Clock
                  className="me-2"
                  style={{ width: "1rem", height: "1rem" }}
                />
                Claim History
              </Button>
            </Link>
            <Link to="/feedbackScreen">
              <Button variant="ghost" className="w-100 text-start">
                <Star
                  className="me-2"
                  style={{ width: "1rem", height: "1rem" }}
                />
                Feedback
              </Button>
            </Link>
            <Link to="/aIInsights">
              <Button variant="ghost" className="w-100 text-start">
                <Heart
                  className="me-2"
                  style={{ width: "1rem", height: "1rem" }}
                />
                AI Insights
              </Button>
            </Link>
          </div>

          {/* Map Placeholder */}
          <div
            className="col-md-5"
            style={{
              backgroundColor: "#e9ecef",
              borderRadius: "0.5rem",
              padding: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
            }}
          >
            <div style={{ textAlign: "center", color: "#6c757d" }}>
              <Truck
                style={{ width: "3rem", height: "3rem", marginBottom: "1rem" }}
              />
              <p>Interactive Map View</p>
              <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                (Would show food surplus locations in real-time)
              </p>
            </div>
          </div>

          {/* Food Listings */}
          <div
            className="col-md-4"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* Filters */}
            <Card>
              <CardContent>
                <div className="mb-3">
                  <Label htmlFor="distance-filter">Distance</Label>
                  <select
                    id="distance-filter"
                    className="form-select"
                    value={filters.distance}
                    onChange={(e) =>
                      setFilters({ ...filters, distance: e.target.value })
                    }
                  >
                    <option value="1km">Within 1km</option>
                    <option value="3km">Within 3km</option>
                    <option value="5km">Within 5km</option>
                    <option value="10km">Within 10km</option>
                  </select>
                </div>
                <div className="mb-3">
                  <Label htmlFor="food-type-filter">Food Type</Label>
                  <select
                    id="food-type-filter"
                    className="form-select"
                    value={filters.foodType}
                    onChange={(e) =>
                      setFilters({ ...filters, foodType: e.target.value })
                    }
                  >
                    <option value="all">All Types</option>
                    <option value="meals">Prepared Meals</option>
                    <option value="produce">Fresh Produce</option>
                    <option value="bakery">Bakery Items</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="urgency-filter">Urgency</Label>
                  <select
                    id="urgency-filter"
                    className="form-select"
                    value={filters.expiry}
                    onChange={(e) =>
                      setFilters({ ...filters, expiry: e.target.value })
                    }
                  >
                    <option value="urgent">Most Urgent</option>
                    <option value="today">Today</option>
                    <option value="all">All Available</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Food Cards */}
            {foodSurplusListings.map((listing) => (
              <Card
                key={listing.id}
                style={{
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                  marginBottom: "1rem",
                  borderColor:
                    selectedListing?.id === listing.id ? "#27ae60" : undefined,
                  borderWidth:
                    selectedListing?.id === listing.id ? "2px" : undefined,
                }}
                onClick={() => setSelectedListing(listing)}
              >
                <CardHeader>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <CardTitle>{listing.donorName}</CardTitle>
                      <CardDescription className="d-flex align-items-center">
                        <MapPin
                          className="me-1"
                          style={{ width: "1rem", height: "1rem" }}
                        />
                        {listing.address}
                      </CardDescription>
                    </div>
                    <span
                      style={{
                        backgroundColor: "#fff3cd",
                        color: "#856404",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                      }}
                    >
                      {listing.expiry}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="row">
                    <div className="col-6">
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "#6c757d",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Food Type
                      </p>
                      <p style={{ fontWeight: 500, marginBottom: 0 }}>
                        {listing.foodType}
                      </p>
                    </div>
                    <div className="col-6">
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "#6c757d",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Quantity
                      </p>
                      <p style={{ fontWeight: 500, marginBottom: 0 }}>
                        {listing.quantity}
                      </p>
                    </div>
                    <div className="col-12 mt-2">
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "#6c757d",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Pickup Window
                      </p>
                      <p style={{ fontWeight: 500, marginBottom: 0 }}>
                        {listing.pickupWindow}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="d-flex justify-content-end">
                  <Button
                    variant="outline"
                    className="me-2"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <ArrowRight
                      className="me-2"
                      style={{ width: "1rem", height: "1rem" }}
                    />
                    Route
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClaim(listing.id);
                    }}
                    style={{
                      backgroundColor: "#27ae60",
                      color: "white",
                      border: "none",
                    }}
                  >
                    Claim Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Listing Popup */}
      {selectedListing && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
        >
          <Card
            style={{
              width: "100%",
              maxWidth: "500px",
              backgroundColor: "white",
            }}
          >
            <CardHeader>
              <CardTitle>{selectedListing.donorName}</CardTitle>
              <CardDescription className="d-flex align-items-center">
                <MapPin
                  className="me-1"
                  style={{ width: "1rem", height: "1rem" }}
                />
                {selectedListing.address}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="row mb-3">
                <div className="col-6">
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6c757d",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Food Type
                  </p>
                  <p style={{ fontWeight: 500, marginBottom: 0 }}>
                    {selectedListing.foodType}
                  </p>
                </div>
                <div className="col-6">
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6c757d",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Quantity
                  </p>
                  <p style={{ fontWeight: 500, marginBottom: 0 }}>
                    {selectedListing.quantity}
                  </p>
                </div>
                <div className="col-6">
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6c757d",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Expires In
                  </p>
                  <p style={{ fontWeight: 500, marginBottom: 0 }}>
                    {selectedListing.expiry}
                  </p>
                </div>
                <div className="col-6">
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#6c757d",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Pickup Window
                  </p>
                  <p style={{ fontWeight: 500, marginBottom: 0 }}>
                    {selectedListing.pickupWindow}
                  </p>
                </div>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#6c757d",
                    marginBottom: "0.25rem",
                  }}
                >
                  Additional Notes
                </p>
                <p style={{ fontWeight: 500, marginBottom: 0 }}>
                  Contains nuts. Please bring containers.
                </p>
              </div>
            </CardContent>
            <CardFooter className="d-flex justify-content-between">
              <Button
                variant="outline"
                onClick={() => setSelectedListing(null)}
              >
                Close
              </Button>
              <div>
                <Button variant="outline" className="me-2">
                  Contact Donor
                </Button>
                <Button
                  style={{
                    backgroundColor: "#27ae60",
                    color: "white",
                    border: "none",
                  }}
                  onClick={() => handleClaim(selectedListing.id)}
                >
                  Claim Food
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

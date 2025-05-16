import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import {
  Plus,
  MapPin,
  Clock,
  Calendar,
  Edit,
  Trash2,
  Bell,
  BarChart2,
  Search,
  Filter,
  X,
} from "lucide-react";
import { Button } from "./components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./components/ui/card.tsx";
import { Input } from "./components/ui/input.tsx";
import { Label } from "./components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select.tsx";
import { Badge } from "./components/ui/badge.tsx";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "./components/ui/tabs.tsx";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "./components/ui/textarea.tsx";

type DonationStatus = "available" | "claimed" | "picked-up" | "expired";

interface Donation {
  id: string;
  foodType: string;
  quantity: string;
  pickupDate: string;
  expiryDate: string;
  location: string;
  status: DonationStatus;
  claimedBy?: string;
  photo?: string;
  createdAt: string;
}

export default function App() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [showMap, setShowMap] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    foodType: "all",
    dateRange: "all",
  });

  // Form state
  const [formData, setFormData] = useState({
    foodType: "",
    quantity: "",
    pickupDate: "",
    expiryDate: "",
    location: "",
    notes: "",
    photo: null as File | null,
  });

  // Mock data - replace with API calls in production
  useEffect(() => {
    const mockDonations: Donation[] = [
      {
        id: "1",
        foodType: "Fresh Produce",
        quantity: "15 meals",
        pickupDate: "2023-07-20T15:00",
        expiryDate: "2023-07-21",
        location: "123 Main St, Cityville",
        status: "available",
        createdAt: "2023-07-18T10:30",
      },
      {
        id: "2",
        foodType: "Bakery Items",
        quantity: "8 meals",
        pickupDate: "2023-07-19T14:00",
        expiryDate: "2023-07-20",
        location: "123 Main St, Cityville",
        status: "claimed",
        claimedBy: "Food Rescue NGO",
        createdAt: "2023-07-17T09:15",
      },
      {
        id: "3",
        foodType: "Prepared Meals",
        quantity: "12 meals",
        pickupDate: "2023-07-18T16:30",
        expiryDate: "2023-07-18",
        location: "123 Main St, Cityville",
        status: "picked-up",
        claimedBy: "Community Kitchen",
        createdAt: "2023-07-16T11:45",
      },
      {
        id: "4",
        foodType: "Dairy Products",
        quantity: "5 meals",
        pickupDate: "2023-07-15T12:00",
        expiryDate: "2023-07-16",
        location: "123 Main St, Cityville",
        status: "expired",
        createdAt: "2023-07-14T08:20",
      },
    ];
    setDonations(mockDonations);
  }, []);

  const filteredDonations = donations.filter((donation) => {
    // Filter by tab
    if (activeTab === "active" && donation.status !== "available") return false;
    if (activeTab === "history" && donation.status === "available")
      return false;

    // Filter by search
    if (
      searchTerm &&
      !donation.foodType.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filter by status
    if (filters.status !== "all" && donation.status !== filters.status) {
      return false;
    }

    // Filter by food type
    if (filters.foodType !== "all" && donation.foodType !== filters.foodType) {
      return false;
    }

    return true;
  });

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("foodType", formData.foodType);
    formPayload.append("quantity", formData.quantity);
    formPayload.append("pickupDate", formData.pickupDate);
    formPayload.append("expiryDate", formData.expiryDate);
    formPayload.append("location", formData.location);
    formPayload.append("notes", formData.notes || "");
    if (formData.photo) {
      formPayload.append("photo", formData.photo);
    }

    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        body: formPayload,
      });

      if (!res.ok) throw new Error("Failed to post donation");

      const savedDonation = await res.json();

      const newDonation: Donation = {
        id: savedDonation.id || Math.random().toString(36).substring(2, 9),
        foodType: formData.foodType,
        quantity: formData.quantity,
        pickupDate: formData.pickupDate,
        expiryDate: formData.expiryDate,
        location: formData.location,
        status: "available",
        createdAt: new Date().toISOString(),
      };

      setDonations((prev) => [newDonation, ...prev]);
      setFormData({
        foodType: "",
        quantity: "",
        pickupDate: "",
        expiryDate: "",
        location: "",
        notes: "",
        photo: null,
      });
      setShowDonationForm(false);
    } catch (err) {
      console.error("Error posting donation:", err);
      // Optional: show toast
    }
  };

  const handleCancelDonation = (id: string) => {
    setDonations((prev) => prev.filter((d) => d.id !== id));
  };

  const handleEditDonation = (donation: Donation) => {
    setSelectedDonation(donation);
    setFormData({
      foodType: donation.foodType,
      quantity: donation.quantity,
      pickupDate: donation.pickupDate,
      expiryDate: donation.expiryDate,
      location: donation.location,
      notes: "",
      photo: null,
    });
    setShowDonationForm(true);
  };

  const handleUpdateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonation) return;

    setDonations((prev) =>
      prev.map((d) =>
        d.id === selectedDonation.id
          ? {
              ...d,
              foodType: formData.foodType,
              quantity: formData.quantity,
              pickupDate: formData.pickupDate,
              expiryDate: formData.expiryDate,
              location: formData.location,
            }
          : d
      )
    );

    setShowDonationForm(false);
    setSelectedDonation(null);
  };

  // Analytics calculations
  const totalMealsDonated = donations
    .filter((d) => d.status === "picked-up")
    .reduce((sum, d) => sum + parseInt(d.quantity), 0);

  const co2Saved = totalMealsDonated * 2.5; // Approx 2.5kg CO2 per meal saved
  const activeDonations = donations.filter(
    (d) => d.status === "available"
  ).length;

  const foodTypes = Array.from(new Set(donations.map((d) => d.foodType)));
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        padding: "1rem",
      }}
    >
      <header style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
          }}
        >
          Your Food Donations
        </h1>
        <p style={{ color: isDarkMode ? "#9CA3AF" : "#4B5563" }}>
          Help reduce food waste by sharing surplus meals
        </p>
      </header>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Meals Donated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMealsDonated}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              CO₂ Emissions Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{co2Saved} kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Active Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDonations}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        defaultValue="active"
        onValueChange={(value) => setActiveTab(value as "active" | "history")}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              width: "100%",
            }}
          >
            <div style={{ position: "relative", flex: 1 }}>
              <Search
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  height: "1rem",
                  width: "1rem",
                  color: "#9CA3AF", // Tailwind gray-400
                }}
              />
              <Input
                type="text"
                placeholder="Search donations..."
                style={{ paddingLeft: "2.5rem", width: "100%" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button
              onClick={() => {
                setSelectedDonation(null);
                setShowDonationForm(true);
              }}
              style={{
                backgroundColor: "#16A34A", // Tailwind green-600
                color: "white",
                padding: "0.5rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                borderRadius: "0.375rem",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={
                (e) => (e.currentTarget.style.backgroundColor = "#15803D") // Tailwind green-700
              }
              onMouseOut={
                (e) => (e.currentTarget.style.backgroundColor = "#16A34A") // Reset
              }
            >
              <Plus
                style={{ height: "1rem", width: "1rem", marginRight: "0.5rem" }}
              />
              New Donation
            </Button>
          </div>
        </div>

        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger
              style={{
                width: "180px",
                display: "flex",
                alignItems: "center",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "0.375rem",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Filter style={{ height: "1rem", width: "1rem" }} />
                <span>
                  Status: {filters.status === "all" ? "All" : filters.status}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="claimed">Claimed</SelectItem>
              <SelectItem value="picked-up">Picked Up</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.foodType}
            onValueChange={(value) =>
              setFilters({ ...filters, foodType: value })
            }
          >
            <SelectTrigger
              style={{
                width: "180px",
                display: "flex",
                alignItems: "center",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "0.375rem",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Filter style={{ height: "1rem", width: "1rem" }} />
                <span>
                  Type: {filters.foodType === "all" ? "All" : filters.foodType}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {foodTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Donation Form Modal */}
        <AnimatePresence>
          {showDonationForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                zIndex: 50,
              }}
              onClick={() => setShowDonationForm(false)}
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  width: "100%",
                  maxWidth: "28rem",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Card>
                  <CardHeader>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <CardTitle>
                        {selectedDonation
                          ? "Edit Donation"
                          : "New Food Donation"}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDonationForm(false)}
                      >
                        <X style={{ height: "1rem", width: "1rem" }} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={
                        selectedDonation
                          ? handleUpdateDonation
                          : handleSubmitDonation
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                        }}
                      >
                        <div>
                          <Label htmlFor="foodType">Food Type</Label>
                          <Input
                            id="foodType"
                            name="foodType"
                            value={formData.foodType}
                            onChange={handleFormChange}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="quantity">Quantity (meals)</Label>
                          <Input
                            id="quantity"
                            name="quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={handleFormChange}
                            required
                          />
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem",
                          }}
                        >
                          <div>
                            <Label htmlFor="pickupDate">Pickup Date/Time</Label>
                            <Input
                              id="pickupDate"
                              name="pickupDate"
                              type="datetime-local"
                              value={formData.pickupDate}
                              onChange={handleFormChange}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              name="expiryDate"
                              type="date"
                              value={formData.expiryDate}
                              onChange={handleFormChange}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="location">Location</Label>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <Input
                              id="location"
                              name="location"
                              value={formData.location}
                              onChange={handleFormChange}
                              required
                            />
                            <Button variant="outline" type="button">
                              <MapPin
                                style={{
                                  height: "1rem",
                                  width: "1rem",
                                  marginRight: "0.5rem",
                                }}
                              />{" "}
                              Detect
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="notes">Notes (Optional)</Label>
                          <Textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleFormChange}
                          />
                        </div>

                        <div>
                          <Label htmlFor="photo">Photo (Optional)</Label>
                          <Input
                            id="photo"
                            name="photo"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{
                              display: "block",
                              width: "100%",
                              fontSize: "0.875rem",
                              color: "#6b7280",
                            }}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                          />
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "0.5rem",
                            paddingTop: "0.5rem",
                          }}
                        >
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => setShowDonationForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            style={{
                              backgroundColor: isHovered
                                ? "#15803d"
                                : "#16a34a",
                              color: "white",
                              padding: "0.5rem 1rem",
                              border: "none",
                              borderRadius: "0.375rem",
                              cursor: "pointer",
                            }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            // onClick={() => handleSubmitDonation}
                          >
                            {selectedDonation
                              ? "Update Donation"
                              : "Submit Donation"}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Donations List */}
        <TabsContent value="active">
          {filteredDonations.length === 0 ? (
            <Card>
              <CardContent
                style={{
                  paddingTop: "3rem",
                  paddingBottom: "3rem",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  textAlign: "center",
                }}
              >
                <div style={{ maxWidth: "28rem", margin: "0 auto" }}>
                  <Calendar
                    style={{
                      height: "3rem",
                      width: "3rem",
                      margin: "0 auto",
                      color: "#9ca3af", // Tailwind's gray-400
                      marginBottom: "1rem",
                    }}
                  />
                  <h3
                    style={{
                      fontSize: "1.125rem", // Tailwind's text-lg
                      fontWeight: 500,
                      marginBottom: "0.25rem",
                    }}
                  >
                    No active donations
                  </h3>
                  <p
                    style={{
                      color: "#6b7280", // Tailwind's gray-500
                      marginBottom: "1rem",
                    }}
                  >
                    Start by adding a new food donation
                  </p>
                  <button
                    onClick={() => setShowDonationForm(true)}
                    style={{
                      backgroundColor: "#16a34a", // green-600
                      color: "white",
                      padding: "0.5rem 1rem",
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "0.375rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#15803d")
                    } // green-700
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#16a34a")
                    }
                  >
                    <Plus
                      style={{
                        height: "1rem",
                        width: "1rem",
                        marginRight: "0.5rem",
                      }}
                    />
                    New Donation
                  </button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredDonations.map((donation) => (
                <Card key={donation.id}>
                  <CardHeader>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <CardTitle>{donation.foodType}</CardTitle>
                        <CardDescription>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              marginTop: "0.25rem",
                            }}
                          >
                            <MapPin style={{ height: "1rem", width: "1rem" }} />
                            {donation.location}
                          </div>
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          donation.status === "available"
                            ? "default"
                            : donation.status === "claimed"
                            ? "secondary"
                            : donation.status === "picked-up"
                            ? "outline"
                            : "destructive"
                        }
                        style={{ textTransform: "capitalize" }}
                      >
                        {donation.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "1rem",
                        // Optional responsive handling can be done in JS if needed
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "#6B7280" /* gray-500 */,
                          }}
                        >
                          Quantity
                        </p>
                        <p style={{ fontWeight: 500 }}>{donation.quantity}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                          Pickup By
                        </p>
                        <p style={{ fontWeight: 500 }}>
                          {new Date(donation.pickupDate).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                          Expires
                        </p>
                        <p style={{ fontWeight: 500 }}>
                          {new Date(donation.expiryDate).toLocaleDateString(
                            [],
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                          Claimed By
                        </p>
                        <p style={{ fontWeight: 500 }}>
                          {donation.claimedBy || "Not claimed"}
                        </p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      borderTop: "1px solid #E5E7EB", // Tailwind's border-gray-200
                      paddingTop: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDonation(donation)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Edit style={{ height: "1rem", width: "1rem" }} /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMap(true)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <MapPin style={{ height: "1rem", width: "1rem" }} />{" "}
                        View Map
                      </Button>
                    </div>
                    {donation.status === "available" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelDonation(donation.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Trash2 style={{ height: "1rem", width: "1rem" }} />{" "}
                        Cancel
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {filteredDonations.length === 0 ? (
            <Card>
              <CardContent
                style={{
                  paddingTop: "3rem",
                  paddingBottom: "3rem",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    maxWidth: "28rem", // 448px (Tailwind's max-w-md)
                  }}
                >
                  <Clock
                    style={{
                      height: "3rem",
                      width: "3rem",
                      marginLeft: "auto",
                      marginRight: "auto",
                      color: "#9CA3AF", // Tailwind's text-gray-400
                      marginBottom: "1rem",
                    }}
                  />
                  <h3
                    style={{
                      fontSize: "1.125rem", // text-lg
                      fontWeight: "500", // font-medium
                      marginBottom: "0.25rem",
                    }}
                  >
                    No donation history
                  </h3>
                  <p
                    style={{
                      color: "#6B7280", // Tailwind's text-gray-500
                    }}
                  >
                    Your past donations will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {filteredDonations.map((donation) => (
                <Card key={donation.id}>
                  <CardHeader>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <CardTitle>{donation.foodType}</CardTitle>
                        <CardDescription
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginTop: "0.25rem",
                          }}
                        >
                          <MapPin style={{ height: "1rem", width: "1rem" }} />
                          {donation.location}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          donation.status === "picked-up"
                            ? "outline"
                            : "destructive"
                        }
                        style={{ textTransform: "capitalize" }}
                      >
                        {donation.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "1rem",
                        // Responsive: change to 4 cols on wider screens
                        // This requires media queries in CSS; inline styles can't handle media queries directly.
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "#6B7280", // gray-500
                          }}
                        >
                          Quantity
                        </p>
                        <p style={{ fontWeight: "500" }}>{donation.quantity}</p>
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "#6B7280",
                          }}
                        >
                          Pickup Date
                        </p>
                        <p style={{ fontWeight: "500" }}>
                          {new Date(donation.pickupDate).toLocaleDateString(
                            [],
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "#6B7280",
                          }}
                        >
                          Claimed By
                        </p>
                        <p style={{ fontWeight: "500" }}>
                          {donation.claimedBy || "Not claimed"}
                        </p>
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "#6B7280",
                          }}
                        >
                          Donated On
                        </p>
                        <p style={{ fontWeight: "500" }}>
                          {new Date(donation.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Map Modal */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMap(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              zIndex: 50,
            }}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "white",
                borderRadius: "0.5rem",
                boxShadow:
                  "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                width: "100%",
                maxWidth: "64rem", // max-w-4xl = 64rem (1024px)
                height: "80vh",
                color: "#1f2937", // dark mode bg-gray-800 won't apply inline, so choose light bg color
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid #e5e7eb", // gray-200 border
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ fontSize: "1.125rem", fontWeight: 500 }}>
                  Pickup Location
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMap(false)}
                >
                  <X style={{ height: "1rem", width: "1rem" }} />
                </Button>
              </div>

              <div
                style={{
                  height: "calc(100% - 56px)",
                  position: "relative",
                  flexGrow: 1,
                }}
              >
                {/* Map placeholder */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#e5e7eb", // bg-gray-200
                    flexDirection: "column",
                    textAlign: "center",
                    padding: "1rem",
                  }}
                >
                  <MapPin
                    style={{
                      height: "3rem",
                      width: "3rem",
                      margin: "0 auto 1rem auto",
                      color: "#6b7280", // text-gray-500
                    }}
                  />
                  <p style={{ fontWeight: 500, marginBottom: "0.25rem" }}>
                    Map View
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Showing route to pickup location
                  </p>

                  {/* Map markers simulation */}
                  <div
                    style={{
                      position: "relative",
                      marginTop: "2rem",
                      height: "8rem",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: "2rem",
                        top: "50%",
                        width: "2rem",
                        height: "2rem",
                        backgroundColor: "#3b82f6", // blue-500
                        borderRadius: "9999px",
                        transform: "translateY(-50%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "0.75rem",
                      }}
                    >
                      You
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        right: "2rem",
                        top: "50%",
                        width: "2rem",
                        height: "2rem",
                        backgroundColor: "#22c55e", // green-500
                        borderRadius: "9999px",
                        transform: "translateY(-50%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "0.75rem",
                      }}
                    >
                      Pickup
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        left: "2rem",
                        right: "2rem",
                        top: "50%",
                        height: "0.25rem",
                        backgroundColor: "#9ca3af", // gray-400
                        transform: "translateY(-50%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: "2rem",
                        top: "50%",
                        height: "0.25rem",
                        backgroundColor: "#22c55e", // green-500
                        transform: "translateY(-50%)",
                        width: "60%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

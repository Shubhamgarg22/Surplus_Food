import React from "react";
import { useState, useEffect } from "react";
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

  const handleSubmitDonation = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to your API
    const newDonation: Donation = {
      id: Math.random().toString(36).substring(2, 9),
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Your Food Donations
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search donations..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button
              onClick={() => {
                setSelectedDonation(null);
                setShowDonationForm(true);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" /> New Donation
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
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
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
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
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowDonationForm(false)}
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
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
                        <X className="h-4 w-4" />
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
                      <div className="space-y-4">
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

                        <div className="grid grid-cols-2 gap-4">
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
                          <div className="flex gap-2">
                            <Input
                              id="location"
                              name="location"
                              value={formData.location}
                              onChange={handleFormChange}
                              required
                            />
                            <Button variant="outline" type="button">
                              <MapPin className="h-4 w-4 mr-2" /> Detect
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
                            className="block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-green-50 file:text-green-700
                              hover:file:bg-green-100"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => setShowDonationForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700"
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
              <CardContent className="py-12 px-4 text-center">
                <div className="mx-auto max-w-md">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-1">
                    No active donations
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Start by adding a new food donation
                  </p>
                  <Button
                    onClick={() => setShowDonationForm(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" /> New Donation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredDonations.map((donation) => (
                <Card key={donation.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{donation.foodType}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4" />
                          {donation.location}
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
                        className="capitalize"
                      >
                        {donation.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Quantity
                        </p>
                        <p className="font-medium">{donation.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Pickup By
                        </p>
                        <p className="font-medium">
                          {new Date(donation.pickupDate).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Expires
                        </p>
                        <p className="font-medium">
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Claimed By
                        </p>
                        <p className="font-medium">
                          {donation.claimedBy || "Not claimed"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2 border-t pt-4">
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDonation(donation)}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMap(true)}
                      >
                        <MapPin className="h-4 w-4 mr-2" /> View Map
                      </Button>
                    </div>
                    {donation.status === "available" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelDonation(donation.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Cancel
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
              <CardContent className="py-12 px-4 text-center">
                <div className="mx-auto max-w-md">
                  <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-1">
                    No donation history
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Your past donations will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredDonations.map((donation) => (
                <Card key={donation.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{donation.foodType}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4" />
                          {donation.location}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          donation.status === "picked-up"
                            ? "outline"
                            : "destructive"
                        }
                        className="capitalize"
                      >
                        {donation.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Quantity
                        </p>
                        <p className="font-medium">{donation.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Pickup Date
                        </p>
                        <p className="font-medium">
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Claimed By
                        </p>
                        <p className="font-medium">
                          {donation.claimedBy || "Not claimed"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Donated On
                        </p>
                        <p className="font-medium">
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowMap(false)}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium">Pickup Location</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMap(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="h-[calc(100%-56px)] relative">
                {/* Map placeholder - replace with actual Mapbox/Google Maps implementation */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <p className="font-medium">Map View</p>
                    <p className="text-sm text-gray-500">
                      Showing route to pickup location
                    </p>

                    {/* Map markers simulation */}
                    <div className="relative mt-8 h-32 w-full">
                      <div className="absolute left-8 top-1/2 w-8 h-8 bg-blue-500 rounded-full transform -translate-y-1/2 flex items-center justify-center text-white">
                        <span>You</span>
                      </div>
                      <div className="absolute right-8 top-1/2 w-8 h-8 bg-green-500 rounded-full transform -translate-y-1/2 flex items-center justify-center text-white">
                        <span>Pickup</span>
                      </div>
                      <div className="absolute left-8 right-8 top-1/2 h-1 bg-gray-400 transform -translate-y-1/2"></div>
                      <div
                        className="absolute left-8 h-1 bg-green-500 transform -translate-y-1/2"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
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

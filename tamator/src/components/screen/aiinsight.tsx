import React, { useState } from "react";
import {
  Leaf,
  Users,
  Clock,
  MapPin,
  Calendar,
  TrendingUp,
  PieChart,
  AlertCircle,
  Check,
} from "lucide-react";
import {
  LineChart,
  BarChart,
  PieChart as RePieChart,
  Pie,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Mock data
const pickupFrequencyData = [
  { name: "Mon", pickups: 12 },
  { name: "Tue", pickups: 19 },
  { name: "Wed", pickups: 15 },
  { name: "Thu", pickups: 11 },
  { name: "Fri", pickups: 18 },
  { name: "Sat", pickups: 9 },
  { name: "Sun", pickups: 5 },
];

const foodTypeData = [
  { name: "Meals", value: 45 },
  { name: "Bakery", value: 25 },
  { name: "Produce", value: 20 },
  { name: "Dairy", value: 10 },
];

const predictionData = [
  { name: "Mon", current: 12, predicted: 15 },
  { name: "Tue", current: 19, predicted: 22 },
  { name: "Wed", current: 15, predicted: 14 },
  { name: "Thu", current: 11, predicted: 13 },
  { name: "Fri", current: 18, predicted: 25 },
  { name: "Sat", current: 9, predicted: 8 },
  { name: "Sun", current: 5, predicted: 6 },
];

const COLORS = ["#27AE60", "#F2C94C", "#2D9CDB", "#EB5757"];

const AIInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"insights" | "predictions">(
    "insights"
  );

  return (
    <div className="bg-light p-4">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark">AI Insights Dashboard</h1>
            <p className="text-muted">
              Intelligent metrics and predictions about your food rescue
              operations
            </p>
          </div>
          <div className="mt-3 mt-md-0">
            <button
              className={`btn me-2 ${
                activeTab === "insights" ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => setActiveTab("insights")}
            >
              <TrendingUp size={16} className="me-2" />
              Insights
            </button>
            <button
              className={`btn ${
                activeTab === "predictions"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setActiveTab("predictions")}
            >
              <Calendar size={16} className="me-2" />
              Predictions
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row mb-4">
          {[
            {
              title: "Meals Saved",
              value: "728",
              subtext: "+12% from last month",
              icon: <Leaf size={20} className="text-success" />,
            },
            {
              title: "People Served",
              value: "1,824",
              subtext: "~3.5 meals per person",
              icon: <Users size={20} className="text-success" />,
            },
            {
              title: "CO₂ Saved",
              value: "182 kg",
              subtext: "Equivalent to 450 miles driven",
              icon: <Leaf size={20} className="text-success" />,
            },
            {
              title: "Avg. Pickup Time",
              value: "2h 15m",
              subtext: "From listing to pickup",
              icon: <Clock size={20} className="text-success" />,
            },
          ].map((card, i) => (
            <div className="col-md-6 col-lg-3 mb-3" key={i}>
              <div className="card h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <div className="small text-muted">{card.title}</div>
                    <h4 className="mb-1">{card.value}</h4>
                    <small className="text-muted">{card.subtext}</small>
                  </div>
                  <div className="bg-light p-2 rounded">{card.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="row mb-4">
          {/* Pickup Frequency */}
          <div className="col-lg-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Pickup Frequency</h5>
                <p className="card-subtitle text-muted mb-3">
                  Weekly pattern of your food rescues
                </p>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pickupFrequencyData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="pickups"
                        fill="#27AE60"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Food Types */}
          <div className="col-lg-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Food Types Claimed</h5>
                <p className="card-subtitle text-muted mb-3">
                  Distribution of rescued food categories
                </p>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={foodTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {foodTypeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Predictions */}
        {activeTab === "predictions" && (
          <div className="row mb-4">
            <div className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Demand Prediction</h5>
                  <p className="card-subtitle text-muted mb-3">
                    Expected surplus availability next week
                  </p>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={predictionData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="current"
                          stroke="#27AE60"
                          strokeWidth={2}
                          name="Current Week"
                        />
                        <Line
                          type="monotone"
                          dataKey="predicted"
                          stroke="#2D9CDB"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Next Week"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="card h-100 d-flex justify-content-center align-items-center text-center p-4">
                <MapPin size={48} className="text-secondary mb-3" />
                <p className="text-muted mb-0">
                  Interactive heatmap showing high-surplus areas
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="row mb-4">
          <div className="col-lg-8 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Behavioral Patterns</h5>
                <p className="card-subtitle text-muted mb-3">
                  AI-generated insights about your operations
                </p>
                {[
                  {
                    icon: <Clock size={20} className="text-success" />,
                    title: "Most active pickup time",
                    text: "2–4 PM (42% of your pickups occur in this window)",
                  },
                  {
                    icon: <Calendar size={20} className="text-success" />,
                    title: "Highest surplus days",
                    text: "Tuesdays and Fridays (30% more surplus than other weekdays)",
                  },
                  {
                    icon: <AlertCircle size={20} className="text-warning" />,
                    title: "Predicted mismatch",
                    text: "Next week: +12% demand-supply gap",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="d-flex mb-3">
                    <div className="me-3">{item.icon}</div>
                    <div>
                      <h6 className="mb-1">{item.title}</h6>
                      <p className="mb-0 text-muted">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">AI Suggestions</h5>
                <p className="card-subtitle text-muted mb-3">
                  Optimization recommendations
                </p>
                {[
                  {
                    icon: <Check size={20} className="text-primary" />,
                    title: "Claim earlier",
                    text: "Morning pickups reduce food expiry loss by 23%",
                  },
                  {
                    icon: <MapPin size={20} className="text-primary" />,
                    title: "Target areas",
                    text: "Connaught Place, Noida Sector 62",
                  },
                  {
                    icon: <PieChart size={20} className="text-primary" />,
                    title: "Focus category",
                    text: "Bakery (+35% predicted availability)",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="d-flex mb-3">
                    <div className="me-3">{item.icon}</div>
                    <div>
                      <h6 className="mb-1">{item.title}</h6>
                      <p className="mb-0 text-muted">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;

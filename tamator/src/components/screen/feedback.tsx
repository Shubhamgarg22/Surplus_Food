import React, { useState } from "react";
import {
  Star,
  Check,
  Clock,
  Utensils,
  MapPin,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

type Pickup = {
  id: number;
  donorName: string;
  donorAvatar: string;
  address: string;
  date: string;
  foodDetails: string;
  rating: number;
  feedback: string;
  submitted: boolean;
  editable: boolean;
};

const pastPickups: Pickup[] = [
  {
    id: 1,
    donorName: "Green Bistro",
    donorAvatar: "GB",
    address: "123 Main St",
    date: "Today, 2:30 PM",
    foodDetails: "Vegetable Curry – 12 Meals",
    rating: 0,
    feedback: "",
    submitted: false,
    editable: true,
  },
  {
    id: 2,
    donorName: "Urban Bakery",
    donorAvatar: "UB",
    address: "456 Oak Ave",
    date: "Yesterday, 4:15 PM",
    foodDetails: "Assorted Pastries – 8kg",
    rating: 5,
    feedback: "Food was fresh and well-packaged. Very professional!",
    submitted: true,
    editable: true,
  },
  {
    id: 3,
    donorName: "Fresh Market",
    donorAvatar: "FM",
    address: "789 Pine Rd",
    date: "Jun 12, 3:45 PM",
    foodDetails: "Mixed Fruits – 15kg",
    rating: 4,
    feedback: "Good quality produce, though some items were overripe",
    submitted: true,
    editable: false,
  },
];

export default function FeedbackScreen() {
  const [pickups, setPickups] = useState<Pickup[]>(pastPickups);
  const [activeTab, setActiveTab] = useState<"pending" | "submitted">(
    "pending"
  );
  const [showReportModal, setShowReportModal] = useState(false);
  const [currentReport, setCurrentReport] = useState<number | null>(null);

  const submittedFeedbacks = pickups.filter((p) => p.submitted && p.rating > 0);
  const averageRating =
    submittedFeedbacks.length > 0
      ? (
          submittedFeedbacks.reduce((sum, p) => sum + p.rating, 0) /
          submittedFeedbacks.length
        ).toFixed(1)
      : "0";

  const commonTags = [
    { text: "Fresh food", count: 12 },
    { text: "Well packaged", count: 8 },
    { text: "Friendly staff", count: 6 },
    { text: "On time", count: 5 },
    { text: "Good quantity", count: 4 },
  ];

  const handleRatingChange = (id: number, rating: number) => {
    setPickups(pickups.map((p) => (p.id === id ? { ...p, rating } : p)));
  };

  const handleFeedbackChange = (id: number, text: string) => {
    setPickups(
      pickups.map((p) => (p.id === id ? { ...p, feedback: text } : p))
    );
  };

  const submitFeedback = (id: number) => {
    setPickups(
      pickups.map((p) => (p.id === id ? { ...p, submitted: true } : p))
    );
  };

  const openReportModal = (id: number) => {
    setCurrentReport(id);
    setShowReportModal(true);
  };

  const filteredPickups = pickups.filter((p) =>
    activeTab === "pending" ? !p.submitted : p.submitted
  );

  return (
    <div
      className="min-vh-100 bg-light p-4"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      <div className="container max-w-900px">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h1 className="h2 mb-3 mb-md-0">Pickup Feedback</h1>

          {/* Tabs */}
          <div className="btn-group" role="group" aria-label="Tabs">
            <button
              type="button"
              className={`btn btn-${
                activeTab === "pending" ? "primary" : "outline-primary"
              } d-flex align-items-center`}
              onClick={() => setActiveTab("pending")}
            >
              <Clock size={16} className="me-1" />
              Pending ({pickups.filter((p) => !p.submitted).length})
            </button>
            <button
              type="button"
              className={`btn btn-${
                activeTab === "submitted" ? "primary" : "outline-primary"
              } d-flex align-items-center`}
              onClick={() => setActiveTab("submitted")}
            >
              <Check size={16} className="me-1" />
              Submitted ({pickups.filter((p) => p.submitted).length})
            </button>
          </div>
        </div>

        {/* Summary Section */}
        <div className="card mb-5 shadow-sm">
          <div className="card-header">
            <h5 className="mb-0">Feedback Summary</h5>
          </div>
          <div className="card-body">
            <div className="row text-center text-md-start">
              {/* Average Rating */}
              <div className="col-md-4 d-flex align-items-center justify-content-center justify-content-md-start mb-4 mb-md-0">
                <div
                  className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: 72, height: 72 }}
                >
                  <div
                    className="text-success fw-bold fs-2 d-flex align-items-center"
                    style={{ gap: 4 }}
                  >
                    {averageRating}
                    <Star size={24} className="text-warning" />
                  </div>
                </div>
                <div>
                  <p className="text-muted mb-0">Average Rating</p>
                  <p className="fw-semibold mb-0">
                    from {submittedFeedbacks.length}{" "}
                    {submittedFeedbacks.length === 1 ? "pickup" : "pickups"}
                  </p>
                </div>
              </div>

              {/* Common Feedback */}
              <div className="col-md-8 text-start">
                <p className="text-muted mb-2">Most Common Feedback</p>
                <div className="d-flex flex-wrap gap-2">
                  {commonTags.map((tag, i) => (
                    <span
                      key={i}
                      className="badge bg-success bg-opacity-25 text-success py-1 px-3 rounded-pill"
                    >
                      {tag.text}{" "}
                      <span className="opacity-75">({tag.count})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Cards */}
        {filteredPickups.length > 0 ? (
          filteredPickups.map((pickup) => (
            <div
              key={pickup.id}
              className="card mb-4 shadow-sm"
              style={{ transition: "box-shadow 0.3s ease" }}
            >
              <div className="card-body">
                <div className="d-flex mb-3">
                  <div
                    className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3"
                    style={{ width: 48, height: 48, fontWeight: "bold" }}
                    title={pickup.donorName}
                  >
                    {pickup.donorAvatar}
                  </div>
                  <div>
                    <h5 className="mb-1">{pickup.donorName}</h5>
                    <p className="text-muted mb-1 d-flex align-items-center">
                      <MapPin size={16} className="me-1" />
                      {pickup.address}
                    </p>
                    <p className="text-muted d-flex align-items-center">
                      <Clock size={16} className="me-1" />
                      {pickup.date}
                    </p>
                  </div>
                </div>

                <div className="mb-3 p-3 bg-light rounded">
                  <p className="d-flex align-items-center mb-0 text-secondary">
                    <Utensils size={18} className="me-2" />
                    {pickup.foodDetails}
                  </p>
                </div>

                {pickup.submitted ? (
                  <>
                    <div className="d-flex align-items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={
                            i < pickup.rating
                              ? "text-warning"
                              : "text-secondary opacity-50"
                          }
                        />
                      ))}
                      <small className="ms-2 text-muted">
                        {pickup.rating}.0 rating
                      </small>
                    </div>

                    <div className="bg-success bg-opacity-10 p-3 rounded mb-3">
                      <p className="mb-0">{pickup.feedback}</p>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          disabled={!pickup.editable}
                        >
                          Edit Feedback
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => openReportModal(pickup.id)}
                        >
                          Report Issue
                        </button>
                      </div>
                      <div className="text-success d-flex align-items-center small fw-semibold">
                        <Check size={16} className="me-1" />
                        Submitted
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="form-label fw-semibold mb-2">
                        Rate this pickup
                      </label>
                      <div className="d-flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(pickup.id, star)}
                            className="btn p-0 border-0 bg-transparent"
                            style={{ lineHeight: 0 }}
                            aria-label={`Rate ${star} stars`}
                          >
                            <Star
                              size={32}
                              className={
                                star <= pickup.rating
                                  ? "text-warning"
                                  : "text-secondary opacity-50"
                              }
                            />
                          </button>
                        ))}
                      </div>
                      <div className="d-flex justify-content-between small text-muted mt-1">
                        <span>Poor</span> <span>Excellent</span>{" "}
                      </div>{" "}
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor={`feedback-${pickup.id}`}
                        className="form-label"
                      >
                        Your feedback
                      </label>
                      <textarea
                        id={`feedback-${pickup.id}`}
                        className="form-control"
                        rows={3}
                        value={pickup.feedback}
                        onChange={(e) =>
                          handleFeedbackChange(pickup.id, e.target.value)
                        }
                        placeholder="Share your experience..."
                      />
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={
                        pickup.rating === 0 || pickup.feedback.trim() === ""
                      }
                      onClick={() => submitFeedback(pickup.id)}
                    >
                      Submit Feedback
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-info text-center">
            No {activeTab === "pending" ? "pending" : "submitted"} pickups.
          </div>
        )}

        {/* Report Modal */}
        {showReportModal && currentReport !== null && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
            onClick={() => setShowReportModal(false)}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Report Issue</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowReportModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    You are reporting an issue for pickup ID:{" "}
                    <b>{currentReport}</b>. Please describe the problem below.
                  </p>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Describe your issue..."
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowReportModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setShowReportModal(false)}
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

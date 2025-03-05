import React, { useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

const UpdateEducationDetails = ({ educationData, onSave, onCancel }) => {
  const [education, setEducation] = useState(educationData || {});
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setEducation((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    let newErrors = {};
    if (!education.establishment) newErrors.establishment = "Required";
    if (!education.educationLevel) newErrors.educationLevel = "Required";
    if (!education.startDate) newErrors.startDate = "Start date is required";
    if (!education.endDate) newErrors.endDate = "End date is required";
    if (
      education.startDate &&
      education.endDate &&
      education.startDate > education.endDate
    ) {
      newErrors.endDate = "End date must be after Start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(education);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-96">
      <h2 className="text-xl font-bold mb-4 text-center">Education Details</h2>

      <label className="block font-semibold">Establishment</label>
      <input
        type="text"
        value={education.establishment || ""}
        onChange={(e) => handleChange("establishment", e.target.value)}
        className="w-full border p-2 rounded mt-1"
      />
      {errors.establishment && (
        <p className="text-red-500 text-sm">{errors.establishment}</p>
      )}

      <label className="block font-semibold mt-3">Education Level</label>
      <input
        type="text"
        value={education.educationLevel || ""}
        onChange={(e) => handleChange("educationLevel", e.target.value)}
        className="w-full border p-2 rounded mt-1"
      />
      {errors.educationLevel && (
        <p className="text-red-500 text-sm">{errors.educationLevel}</p>
      )}

      <label className="block font-semibold mt-3">Start Date</label>
      <DatePicker
        selected={education.startDate ? new Date(education.startDate) : null}
        onChange={(date) => handleChange("startDate", date)}
        dateFormat="dd-MM-yyyy"
        className="w-full border p-2 rounded mt-1"
      />
      {errors.startDate && (
        <p className="text-red-500 text-sm">{errors.startDate}</p>
      )}

      <label className="block font-semibold mt-3">End Date</label>
      <DatePicker
        selected={education.endDate ? new Date(education.endDate) : null}
        onChange={(date) => handleChange("endDate", date)}
        dateFormat="dd-MM-yyyy"
        className="w-full border p-2 rounded mt-1"
        minDate={education.startDate} // Ensures End Date is after Start Date
      />
      {errors.endDate && (
        <p className="text-red-500 text-sm">{errors.endDate}</p>
      )}

      <label className="block font-semibold mt-3">Location</label>
      <input
        type="text"
        value={education.location || ""}
        onChange={(e) => handleChange("location", e.target.value)}
        className="w-full border p-2 rounded mt-1"
      />

      <div className="flex justify-between mt-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateEducationDetails;

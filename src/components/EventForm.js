import { useState } from "react";
import { uploadEvent } from "../supabaseData";
import "./EventForm.css";
import carpedium from "../assets/carpediem.svg";

function EventForm() {
  const [event_name, setEventName] = useState("");
  const [start_time, setStartTime] = useState("");
  const [venue, setVenue] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("");
  const [form_link, setFormLink] = useState("");
  const [selected, setSelected] = useState("");

  const options = [
    "Design",
    "Dance",
    "Music",
    "Tamil",
    "Telugu",
    "English",
    "Hindi",
    "Arts",
    "Fun",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !event_name ||
      !venue ||
      !start_time ||
      !selected ||
      !image
    ) {
      setStatus("Please fill in all required fields.");
      return;
    }

    try {
      await uploadEvent({
        event_name,
        venue,
        start_time,
        image,
        form_link,
        category: selected,
      });

      setStatus("Event uploaded successfully!");
      alert("Event added successfully!");

      // Reset form
      setEventName("");
      setVenue("");
      setStartTime("");
      setFormLink("");
      setSelected("");
      setImage(null);
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <img
        src={carpedium}
        alt="CarpeDiem"
        className="carpedium"
      />

      <div className="events-heading">ADMIN</div>

      <div className="admin-lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      <div className="event-form-container">
        <form className="event-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Event Name"
            value={event_name}
            onChange={(e) => setEventName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />

          <div className="time-container">
            <label htmlFor="start_time">Time</label>

            <input
              id="start_time"
              type="time"
              value={start_time}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="" disabled>
              -- Select Category --
            </option>

            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Google Form Link"
            value={form_link}
            onChange={(e) => setFormLink(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button type="submit">
            Submit Event
          </button>

          {status && <p>{status}</p>}
        </form>
      </div>
    </div>
  );
}

export default EventForm;
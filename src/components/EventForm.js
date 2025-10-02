import { useState } from "react";
import { uploadEvent } from "../supabaseData";
import "./EventForm.css";
import vector270 from "../assets/vector270.svg";
import vector271 from "../assets/vector271.svg";
import maskGroup from "../assets/mask-group.svg";

function EventForm() {
  const [event_name, setEventName] = useState("");
  const [event_conductedby, setConductedby] = useState("");
  const [description, setDescription] = useState("");
  const [event_date, setDate] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [venue, setVenue] = useState("");
  const [image, setImage] = useState(null);
  const [selected, setSelected] = useState("");
  const [status, setStatus] = useState("");
  const[form_link, setFormLink]= useState("");
  const options = ["Design", "Photography", "Dance","Music","Flagship","Tamil lits","Telugu lits","English lits","Hind lits","Drama","Arts","Fun",];

  const isValidTimeRange = (start, end) => {
    if (!start || !end) return true;
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    return eh * 60 + em > sh * 60 + sm;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!event_name || !event_conductedby || !description || !event_date || !start_time || !end_time || !venue || !selected || !image) {
      setStatus("Please fill in all fields before submitting.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (event_date < today) {
      setStatus("Event date cannot be in the past.");
      return;
    }

    if (!isValidTimeRange(start_time, end_time)) {
      setStatus("End time must be later than start time.");
      return;
    }

    try {
      const publicUrl = await uploadEvent({
        event_name,
        event_conductedby,
        description,
        event_date,
        start_time,
        end_time,
        venue,
        image,
        event_type: selected,
        form_link,
      });
      setStatus("Event uploaded successfully! URL: " + publicUrl);
      alert("Event added!");
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div className="events-heading">ADMIN</div>
      <img src={vector270} alt="Vector 270" className="vector270" />
      <img src={vector271} alt="Vector 271" className="vector271" />
      <img src={maskGroup} alt="Mask Group" className="mask-group" />

      <div className="event-form-container">
        <form className="event-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Event Name" value={event_name} onChange={(e) => setEventName(e.target.value)} />
          <input type="text" placeholder="Conducted By" value={event_conductedby} onChange={(e) => setConductedby(e.target.value)} />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
          <input type="date" value={event_date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setDate(e.target.value)} />
          
          <div style={{ display: "flex", gap: "12px", flexDirection:"column" }}>
            <label htmlFor="start_time">From</label>
            <input id="start_time" type="time" value={start_time} onChange={(e) => setStartTime(e.target.value)} />
            <label htmlFor="end_time">To</label>
            <input id="end_time" type="time" value={end_time} onChange={(e) => setEndTime(e.target.value)} />
          </div>

          <input type="text" placeholder="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
          <select value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="" disabled>-- Select event --</option>
            {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <p>Selected: <strong>{selected || "none"}</strong></p>
          <input type="text" placeholder="GFormLink" value={form_link} onChange={(e) => setFormLink(e.target.value)} />
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

          <button type="submit">Submit Event</button>
          <p>{status}</p>
          <p>
            Contact: <br />
            Mohan Raj - 80727 89766 <br />
            Mohamed Rizvi - 96296 15136
          </p>
        </form>
      </div>
    </div>
  );
}

export default EventForm;

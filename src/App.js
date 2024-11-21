import React, { useEffect, useState } from "react";
import "./App.css";

const TrafficLight = ({ id, status, eta, density }) => {
  const [light, setLight] = useState(status === "P" ? "green" : "red");
  const [timer, setTimer] = useState(eta);

  useEffect(() => {
    if (status === "P") {
      // Persistent light: only the timer changes
      if (timer > 0) {
        const interval = setInterval(() => {
          setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval); // Cleanup the interval when timer changes or component unmounts
      } else {
        setLight("green"); // When the timer reaches zero, set the light to green
      }
    } else if (status === "N") {
      // Non-persistent light: cycling between red, yellow, green
      let index = 0;
      const colors = ["red", "yellow", "green"];
      
      const interval = setInterval(() => {
        setLight(colors[index]);
        index = (index + 1) % colors.length; // Loop through the colors
      }, 1000); // Change every 1 second

      return () => clearInterval(interval); // Cleanup the interval when status or component unmounts
    }
  }, [status, timer]); // Re-run this effect when status or timer changes

  return (
    <div className="traffic-light">
      <h3>Traffic Light at {id.join(", ")}</h3>
      <div className={`light ${light}`} />
      {status === "P" && (
        <div>
          <p>ETA: {timer > 0 ? `${timer} seconds` : "Reached"}</p>
          <p>Density: {density}</p>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [trafficData, setTrafficData] = useState([]);

  useEffect(() => {
    fetch("/coordinates_data.json")
      .then((response) => response.json())
      .then((data) => setTrafficData(data))
      .catch((error) => console.error("Error loading traffic data:", error));
  }, []);

  return (
    <div className="App">
      <h1>Traffic Light System</h1>
      <div className="traffic-container">
        {trafficData.map((light, index) => (
          <TrafficLight key={index} {...light} />
        ))}
      </div>
    </div>
  );
};

export default App;

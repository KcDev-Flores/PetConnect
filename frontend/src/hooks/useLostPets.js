import { useState, useEffect } from "react";
import { getLostPets, addSighting, reportLostPet } from "../services/api";
import { estimateLocation } from "../data/mockData";

export function useLostPets() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLostPets()
      .then((data) => { setReports(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  const submitSighting = async (reportId, sightingData) => {
    await addSighting({ reportId, ...sightingData });
    const newSighting = {
      id: Date.now(),
      lat: 40 + Math.random() * 20,
      lng: 40 + Math.random() * 20,
      comment: sightingData.comment,
      author: "Tú",
      time: "Ahora",
      confidence: 0.8,
    };
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, sightings: [...r.sightings, newSighting] }
          : r
      )
    );
  };

  const submitReport = async (data) => {
    await reportLostPet(data);
  };

  return { reports, loading, error, submitSighting, submitReport, estimateLocation };
}

import { useState, useEffect } from "react";
import { getLostPets, reportLostPet, resolveLostPet } from "../services/api";
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


  const submitReport = async (data) => {
    await reportLostPet(data);
  };

  const resolveReport = async (petId) => {
    await resolveLostPet(petId);
  };

  return { reports, loading, error, submitReport, resolveReport, estimateLocation };
}

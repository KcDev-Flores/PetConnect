import { useState, useEffect } from "react";
import { getLostPets, addSighting, reportLostPet } from "../services/api";

function estimateLocation(sightings = []) {
  if (!sightings.length) return null;

  const totals = sightings.reduce(
    (acc, sighting) => ({
      lat: acc.lat + (Number(sighting.lat) || 0),
      lng: acc.lng + (Number(sighting.lng) || 0),
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: totals.lat / sightings.length,
    lng: totals.lng / sightings.length,
  };
}

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
  };

  const submitReport = async (data) => {
    const savedReport = await reportLostPet(data);
    const report = savedReport?.report ?? savedReport?.data ?? savedReport ?? data;

    setReports((currentReports) => [
      {
        ...data,
        ...report,
        id: report.id ?? report.reportId ?? Date.now(),
      },
      ...currentReports,
    ]);
  };

  const removeReportFromView = (reportId) => {
    setReports((currentReports) =>
      currentReports.filter((report) => String(report.id) !== String(reportId))
    );
  };

  return { reports, loading, error, submitSighting, submitReport, removeReportFromView, estimateLocation };
}

import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import Feed from "../pages/Feed";
import Passport from "../pages/Passport";
import Emergency from "../pages/Emergency";
import Search from "../pages/Search";
import Profile from "../pages/Profile";
import Login from "../pages/Login";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Rutas Públicas */}
        <Route path="/" element={<Feed />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/search" element={<Search />} />

        {/* Rutas Privadas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/passport" element={<Passport />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

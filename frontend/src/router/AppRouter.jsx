import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
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
        <Route path="/" element={<Feed />} />
        <Route path="/passport" element={<Passport />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

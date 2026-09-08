import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Layout from "./Layout";
import Home from "./home/Home";
import NoPage from "./components/NoPage";
import Menu from "./menu/Menu";
import FoodCustomization from "./food/FoodCustomization";
import GroupOrder from "./group/GroupOrder";
import Reservation from "./reservation/Reservation";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="menu" element={<Menu />} />
          <Route path="group-order" element={<GroupOrder />} />
          <Route path="reservation" element={<Reservation />} />

           <Route
            path="menu/:slug"
            element={<FoodCustomization />}
          />
          {/* <Route path="about" element={<About />} /> */}
          {/* <Route
            path="consultancy-services"
            element={<ConsultancyServices />}
          />
          <Route path="global-contribution" element={<GlobalContribution />} /> */}
          {/* <Route path="contact" element={<Contact />} /> */}
          {/* <Route path="fellowship" element={<Fellowship />} /> */}
          {/* <Route path="ai-literacy-program" element={<Facilitators />} /> */}
        </Route>
        {/* <Route path="privacy-policy" element={<PrivacyPolicy />} /> */}
        {/* <Route path="terms-of-service" element={<Terms />} /> */}
        {/* <Route path="login" element={<Login />} /> */}
        <Route path="*" element={<NoPage />} />


        <Route
          path="/admin"
          element={
            // <ProtectedRoute>
              <AdminLayout />
            // </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>



      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

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
import About from "./about/About";
import Gallery from "./gallery/Gallery";
import Faq from "./faq/Faq";
import Contact from "./contact/Contact";

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
          <Route path="about" element={<About />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="faq" element={<Faq />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        {/* <Route path="privacy-policy" element={<PrivacyPolicy />} /> */}
        {/* <Route path="terms-of-service" element={<Terms />} /> */}
        {/* <Route path="login" element={<Login />} /> */}
        <Route path="*" element={<NoPage />} />

        {/* <Route path="/mega" element={<MegaLayout />}>
          <Route index element={<MHome />} />
          <Route path="about" element={<MAbout />} />
          <Route path="research" element={<Research />} />
          <Route path="governance-index" element={<Governance />} />
          <Route path="model-evaluation" element={<Model />} />
          <Route path="policy-tracker" element={<PolicyTrack />} />
        </Route> */}

        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

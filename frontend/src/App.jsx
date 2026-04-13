 import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DiseasesPage from "./pages/DiseasesPage";
import VegetablePage from "./pages/VegetablePage";
import PlantingGuides from "./pages/PlantingGuides";
import PestsPage from "./pages/PestsPage";
import PestVegetablePage from "./pages/PestVegetablePage";
import PlantingPlanner from "./pages/PlantingPlanner";
import MarketPrices from "./pages/MarketPrices";
import TestForecast from "./pages/TestForecast";
import Predictions from "./pages/Predictions";
import ChatBot from "./pages/ChatBot";
import TomatoDetection from "./pages/TomatoDetection";
import TomatoDetectionPage from "./pages/TomatoDetectionPage";
import Layout from "./components/Layout";



 



function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/diseases" element={<Layout><DiseasesPage /></Layout>} />
      <Route path="/diseases/:vegName" element={<Layout><VegetablePage /></Layout>} />
      <Route path="/planting-guides" element={<Layout><PlantingGuides /></Layout>} />
      <Route path="/pests" element={<Layout><PestsPage /></Layout>} />
      <Route path="/pests/:vegName" element={<Layout><PestVegetablePage /></Layout>} />
      <Route path="/planting-planner" element={<Layout><PlantingPlanner /></Layout>} />
      <Route path="/market-prices" element={<Layout><MarketPrices /></Layout>} />
      <Route path="/test-forecast" element={<Layout><TestForecast /></Layout>} />
      <Route path="/predictions" element={<Layout><Predictions /></Layout>} />
      <Route path="/chat" element={<Layout><ChatBot /></Layout>} />
      <Route path="/tomato-detection" element={<Layout><TomatoDetectionPage /></Layout>} />
</Routes>
  );
}

export default App;
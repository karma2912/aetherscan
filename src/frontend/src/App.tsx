import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import ImageDetectionComponent from "./components/ImageDetectionComponent";
import LiveDetectionComponent from "./components/LiveDetectionComponent";
import Documentation from "./components/Documentation";
import ScoreComponent from "./components/ScoreComponent";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path={`/aetherscan/live`} element={<LiveDetectionComponent />} />
        <Route path="/aetherscan/predict/upload" element={<ImageDetectionComponent />}></Route>
        <Route path="/aetherscan/docs" element={<Documentation />}></Route>
        <Route path="/aetherscan/scores" element={<ScoreComponent />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

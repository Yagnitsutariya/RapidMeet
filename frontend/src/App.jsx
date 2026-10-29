import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Authentication from "./pages/Authentication";
import VideoMeet from "./contexts/VideoMeet";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Authentication />} />
      <Route path="/:url" element={<VideoMeet/>}/>
    </Routes>
  );
}

export default App;

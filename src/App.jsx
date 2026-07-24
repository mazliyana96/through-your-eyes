import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Gallery from "./components/Gallery";
import UploadModal from "./components/UploadModal";
import "./styles/App.css";

function App() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    loadPhotos();
  }, []);

  async function loadPhotos() {
    const { data } = await supabase
      .from("guestbook")
      .select("*")
      .order("created_at", { ascending: false });

    setPhotos(data || []);
  }

  return (
    <main className="page">
      
      <img
        src="/images/leaf-shadow.png"
        alt=""
        className="leaf-shadow"
      />

      <div className="page-header">
        <h1>Roll Camera, Action!</h1>
        <p>
          Ugly crying, blurry dancing and questionable angles are highly encouraged.
        </p>
      </div>

      <Gallery photos={photos} />

      <UploadModal loadPhotos={loadPhotos} />

      <a
  href="https://yanamirul.framer.website/home"
  className="back-home"
>
  &lt; Home
</a>

    </main>
  );
}

export default App;
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const [photos, setPhotos] = useState([]);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState("");
  const [wish, setWish] = useState("");

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

  function handleImageChange(event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
    }
  }

  async function uploadPhoto() {
    if (!file) {
      alert("Choose a photo.");
      return;
    }

    setUploading(true);

    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("Photos")
      .upload(fileName, file);

    if (uploadError) {
      alert(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("Photos")
      .getPublicUrl(fileName);

    const photoUrl = data.publicUrl;

    const { error } = await supabase
      .from("guestbook")
      .insert([
        {
          name,
          wish,
          photo_url: photoUrl,
        },
      ]);

    if (error) {
      alert(error.message);
      setUploading(false);
      return;
    }

    setName("");
    setWish("");
    setImage(null);
    setFile(null);

    loadPhotos();

    setUploading(false);

    alert("🎉 Uploaded!");
  }

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>📸 Through Your Eyes</h1>

      <input
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "12px",
        }}
      />

      <textarea
        placeholder="Write your wishes..."
        value={wish}
        onChange={(e) => setWish(e.target.value)}
        style={{
          width: "100%",
          height: "100px",
          padding: "12px",
          marginBottom: "12px",
        }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {image && (
        <img
          src={image}
          alt=""
          style={{
            width: "100%",
            marginTop: "20px",
            borderRadius: "12px",
          }}
        />
      )}

      <br />

      <button
        onClick={uploadPhoto}
        disabled={uploading}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
        }}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      <hr style={{ margin: "50px 0" }} />

      <h2>Guest Gallery</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
          gap: "20px",
        }}
      >
        {photos.map((photo) => (
          <div
            key={photo.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <img
              src={photo.photo_url}
              alt=""
              style={{
                width: "100%",
                display: "block",
              }}
            />

            <div style={{ padding: "15px" }}>
              <h3>{photo.name || "Anonymous"}</h3>

              <p>{photo.wish}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
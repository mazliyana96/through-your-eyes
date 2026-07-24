import { useState } from "react";
import { supabase } from "../lib/supabase";
import SuccessModal from "./SuccessModal";

function UploadModal({ loadPhotos }) {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [wish, setWish] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  function resetForm() {
    setName("");
    setWish("");
    setFile(null);
    setPreview(null);
  }

  function closeModal() {
    setOpen(false);
    resetForm();
  }

  function handleImage(event) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Oops! Who's this? We need a name! 👀");
      return;
    }

    if (!file) {
      alert("Oh no! You forgot the photo. 📸");
      return;
    }

    try {
      setUploading(true);

      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("Photos")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

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

      if (error) throw error;

      await loadPhotos();

setShowSuccess(true);


    } catch (err) {

      alert(err.message);

    } finally {

      setUploading(false);

    }
  }

  return (
    <>
      <section className="upload-section">

        <h2>Drop Your Candids</h2>

        <p>
          The photographer got the highlights. We're collecting the plot twists. 
          Drop your favourite photo and tell us what was happening.
        </p>

        <button
          className="upload-btn"
          onClick={() => setOpen(true)}
        >
          Send Your Snap
        </button>

      </section>

      {open && (

        <div
          className="modal-backdrop"
          onClick={closeModal}
        >

          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close-btn"
              onClick={closeModal}
            >
              ×
            </button>

            <h2>The Unofficial Album</h2>

            <p>
              We promise not to judge your camera skills. (Questionable angles are highly encouraged.)
            </p>

            <form
              className="memory-form"
              onSubmit={handleSubmit}
            >

              <label>Who's This?</label>

              <input
                type="text"
                maxLength={15}
                placeholder="e.g. Salmah, Jepol, Pak Mail..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label>We Need Context</label>

              <textarea
                rows="4"
                maxLength={180}
                placeholder="Tell us a little about your shot..."
                value={wish}
                onChange={(e) => setWish(e.target.value)}
              />

              <label>Photo</label>

              <div className="photo-upload">

  <div className="upload-polaroid">

    {preview ? (

      <img
        src={preview}
        alt="Preview"
        className="preview-photo"
      />

    ) : (

      <div className="upload-placeholder">

        <div className="upload-plus">
          +
        </div>

        <span>
          Frame Your Moment
        </span>

      </div>

    )}

    <img
      src="/images/polaroid.png"
      alt=""
      className="upload-frame"
    />

    <input
      type="file"
      accept="image/*"
      onChange={handleImage}
    />

  </div>

</div>


              <button
  type="submit"
  className="submit-btn"
  disabled={uploading}
>
  {uploading ? (
    <>
      <span className="spinner"></span>
      Uploading...
    </>
  ) : (
    "Drop It"
  )}
</button>

            </form>

          </div>

        </div>

            )}

      {showSuccess && (

        <SuccessModal
  onClose={() => {

    setShowSuccess(false);

    closeModal();

    setTimeout(() => {

      document
        .querySelector(".polaroid")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

    }, 300);

  }}
/>

      )}

    </>

  );
}

export default UploadModal;
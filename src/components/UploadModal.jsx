import { useState } from "react";
import { supabase } from "../lib/supabase";

function UploadModal({ loadPhotos }) {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [wish, setWish] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

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
      alert("Please enter your name.");
      return;
    }

    if (!file) {
      alert("Please choose a photo.");
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

      closeModal();


    } catch (err) {

      alert(err.message);

    } finally {

      setUploading(false);

    }
  }

  return (
    <>
      <section className="upload-section">

        <h2>leave your memory</h2>

        <p>
          Upload your favourite moment from our wedding and leave us
          a little note. We'd love to see the day through your eyes.
        </p>

        <button
          className="upload-btn"
          onClick={() => setOpen(true)}
        >
          Share Your Memory
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

            <h2>Share Your Memory</h2>

            <p>
              We'd love to see our wedding through your eyes.
            </p>

            <form
              className="memory-form"
              onSubmit={handleSubmit}
            >

              <label>Your Name</label>

              <input
                type="text"
                placeholder="John & Jane"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label>Your Wish</label>

              <textarea
                rows="4"
                placeholder="Leave us a little memory..."
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
          add your photo
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
    "Share Memory"
  )}
</button>

            </form>

          </div>

        </div>

      )}

    </>

  );

}

export default UploadModal;
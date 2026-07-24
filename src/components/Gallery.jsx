import { useState } from "react";
import Polaroid from "./Polaroid";
import PhotoViewer from "./PhotoViewer";

function Gallery({ photos }) {

  const [selectedIndex, setSelectedIndex] = useState(null);

  const displayPhotos = [...photos];

  while (displayPhotos.length < 9) {
    displayPhotos.push({
      id: `placeholder-${displayPhotos.length}`,
      name: "Next Frame",
      wish: "Could be yours...",
      photo_url: "https://picsum.photos/500?random=" + displayPhotos.length,
      placeholder: true,
    });
  }

  function openPhoto(index) {

    if (displayPhotos[index].placeholder) return;

    setSelectedIndex(index);

  }

  function closePhoto() {

    setSelectedIndex(null);

  }

  return (
    <>

      <section className="gallery">

        {displayPhotos.slice(0, 9).map((photo, index) => (

          <Polaroid
            key={photo.id}
            photo={photo}
            clipped={index === 1}
            onClick={() => openPhoto(index)}
          />

        ))}

      </section>

      {selectedIndex !== null && (

        <PhotoViewer
          photos={displayPhotos.filter(photo => !photo.placeholder)}
          currentIndex={selectedIndex}
          onClose={closePhoto}
        />

      )}

    </>

  );

}

export default Gallery;
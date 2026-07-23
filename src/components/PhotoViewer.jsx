import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
function PhotoViewer({ photos, currentIndex, onClose }) {

  const [index, setIndex] = useState(currentIndex);

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {

    function handleKeyDown(e) {

      if (e.key === "Escape") {

        onClose();

      }

      if (e.key === "ArrowRight") {

        setIndex((prev) => (prev + 1) % photos.length);

      }

      if (e.key === "ArrowLeft") {

        setIndex((prev) =>
          prev === 0 ? photos.length - 1 : prev - 1
        );

      }

    }

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);

  }, [photos.length, onClose]);

const nextPhoto = () => {

  setIndex((prev) => (prev + 1) % photos.length);

};

const previousPhoto = () => {

  setIndex((prev) =>
    prev === 0
      ? photos.length - 1
      : prev - 1
  );

};

const handlers = useSwipeable({

  onSwipedLeft: nextPhoto,

  onSwipedRight: previousPhoto,

  preventScrollOnSwipe: true,

});

  const photo = photos[index];

  return (

    <div
      className="viewer-backdrop"
      onClick={onClose}
    >

      <div
  className="viewer"
  onClick={(e) => e.stopPropagation()}
  {...handlers}
>

        <button
          className="viewer-close"
          onClick={onClose}
        >
          ×
        </button>

        <button
          className="viewer-arrow left"
          onClick={previousPhoto}
        >
          ‹
        </button>

        <img
          src={photo.photo_url}
          alt={photo.name}
          className="viewer-image"
        />

        <button
          className="viewer-arrow right"
          onClick={nextPhoto}
        >
          ›
        </button>

        <div className="viewer-info">

  <div className="viewer-divider"></div>

  <h2 className="viewer-name">
    {photo.name}
  </h2>

 <p className="viewer-wish">
  ❝ {photo.wish} ❞
</p>

  <div className="viewer-heart">
    ♡
  </div>

  <span className="viewer-counter">
    {index + 1} / {photos.length}
  </span>

</div>

      </div>

    </div>

  );

}

export default PhotoViewer;
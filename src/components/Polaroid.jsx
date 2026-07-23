function Polaroid({ photo, clipped = false, onClick }) {

  const name = photo.name || "Anonymous";
  const wish = photo.wish || "";

  const shortWish =
    wish.length > 18
      ? wish.substring(0, 18) + "..."
      : wish;

  return (

    <div
      className="polaroid"
      onClick={onClick}
    >

      {clipped && (

        <img
          src="/images/paperclip.png"
          alt=""
          className="paperclip"
        />

      )}

      <img
        src={photo.photo_url}
        alt={name}
        className="polaroid-photo"
      />

      <img
        src="/images/polaroid.png"
        alt=""
        className="polaroid-frame"
      />

      <div className="polaroid-caption">

        <h3>{name}</h3>

        <span>{shortWish}</span>

      </div>

    </div>

  );

}

export default Polaroid;
function SuccessModal({ onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal success-modal">

        <div className="success-icon">🎉</div>

        <h2>One More for the Album</h2>

        <p>
          Thanks for trusting us with
          <br />
          a little piece of your camera roll.
        </p>

        <button
          className="submit-btn"
          onClick={onClose}
        >
          Find My Shot
        </button>

      </div>
    </div>
  );
}

export default SuccessModal;
import React from 'react';

function ResultScreen({ finalPlace, onRestart }) {
  if (!finalPlace) {
    return <div className="loading-view"><p>Calculating...</p></div>;
  }

  // Determine background color based on which side 'won' - tricky without tracking,
  // so let's use a neutral background for the result view for now.
  return (
    <div className="result-view">
      <div className="result-content">
        <h1>Your Trip Is Booked!</h1>
        <p>You're heading to {finalPlace.city} for an unforgettable experience at:</p>
        <div className="final-place-card">
          {/* Re-use card structure or create specific result style */}
          {finalPlace.image_url && (
            <img
                src={finalPlace.image_url}
                alt={finalPlace.name}
                className="final-card-image"
                onError={(e) => { e.target.style.display = 'none'; }} // Hide broken image
            />
          )}
          <h2>{finalPlace.name}</h2>
          <p><strong>Type:</strong> {finalPlace.type}</p>
          <p><em>"{finalPlace.description}"</em></p>
          <p><strong>Rating Hint:</strong> {finalPlace.rating_hint}</p>
        </div>
        <p className="final-message">
          Bon voyage... and good luck. We're definitely not liable.<br/>
          <small>(Seriously, sign this waiver.)</small>
        </p>
        <button onClick={onRestart} className="restart-button result-button">Choose Another City?</button>
      </div>
    </div>
  );
}

export default ResultScreen;
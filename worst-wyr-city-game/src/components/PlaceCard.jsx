import React from 'react';

function PlaceCard({ place }) {
  if (!place) {
    // Placeholder or different loading style for split screen
    return <div className="place-card is-loading"></div>;
  }

  return (
    // Optional: Add class for transition effects
    <div className="place-card">
      {place.image_url && (
        <img
          src={place.image_url}
          alt={`Image of ${place.name}`}
          className="card-image"
          onError={(e) => {
              console.error(`Failed to load image: ${place.image_url}`);
              e.target.style.display = 'none';
            } // Hide broken image and log error
          }
        />
      )}
      <div className="card-content">
        <h2 className="card-title">{place.name}</h2>
        <p className="card-type"><strong>Type:</strong> {place.type}</p>
        <p className="card-description"><em>"{place.description}"</em></p>
        <p className="card-rating-hint"><strong>Rating Hint:</strong> {place.rating_hint}</p>
        {/* Button is now part of the panel, not the card */}
      </div>
    </div>
  );
}

export default PlaceCard;
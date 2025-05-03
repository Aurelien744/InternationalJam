import React, { useState, useEffect } from 'react';
import CitySelection from './components/CitySelection';
import PlaceCard from './components/PlaceCard';
import ResultScreen from './components/ResultScreen';
// Import the data structure directly, not the grouping function here
import { placesByCity, shuffleArray } from './data/places';
import './App.css';

// Get city names from the keys of the main data structure
const cityNames = Object.keys(placesByCity);

function App() {
  const [view, setView] = useState('citySelection'); // 'citySelection', 'game', 'result'
  const [selectedCity, setSelectedCity] = useState(null);
  const [gamePlaces, setGamePlaces] = useState([]); // Holds the array of PLACE objects for the selected city
  const [currentChampionIndex, setCurrentChampionIndex] = useState(0); // Index within gamePlaces
  const [nextChallengerIndex, setNextChallengerIndex] = useState(1); // Index within gamePlaces
  const [isLoading, setIsLoading] = useState(false);

  // Effect to prepare game when city is selected
  useEffect(() => {
    if (view === 'game' && selectedCity) {
      setIsLoading(true);
      // Access the places array using the selectedCity key
      const cityData = placesByCity[selectedCity];
      const cityPlacesArray = cityData ? cityData.places : []; // Get the places array

      if (cityPlacesArray && cityPlacesArray.length >= 2) {
        // Add city name to each place object for potential use later
        const placesWithCity = cityPlacesArray.map(place => ({ ...place, city: selectedCity }));
        const shuffledPlaces = shuffleArray([...placesWithCity]); // Shuffle a copy
        setGamePlaces(shuffledPlaces); // Set the shuffled array of place objects
        setCurrentChampionIndex(0);
        setNextChallengerIndex(1);
      } else {
        console.error(`Not enough places found for ${selectedCity}. Needs at least 2.`);
        setView('citySelection'); // Go back if error or no places
      }
      setIsLoading(false);
    }
  }, [view, selectedCity]); // Re-run when view or selectedCity changes

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    setView('game'); // Change view to start the game
  };

  const handleChoice = (chosenPlaceIndex) => {
    // Add a slight delay for visual feedback before changing cards (optional)
    setTimeout(() => {
        // The chosen place (identified by its index in the gamePlaces array) becomes the new champion
        setCurrentChampionIndex(chosenPlaceIndex);

        // Determine the index of the *next* challenger in the original shuffled list
        const nextChallengerAbsoluteIndex = nextChallengerIndex + 1;

        // Check if we've run out of challengers in the original list
        if (nextChallengerAbsoluteIndex >= gamePlaces.length) {
            setView('result'); // Game over, change view
        } else {
            // Move to the next challenger
            setNextChallengerIndex(nextChallengerAbsoluteIndex);
            // The champion remains the one just chosen (setCurrentChampionIndex already updated)
        }
        // Force re-render/transition if needed - maybe change a key on PlaceCard if transitions seem stuck
    }, 200); // 200ms delay for effect
  };

  const handleRestart = () => {
    setSelectedCity(null);
    setGamePlaces([]);
    setCurrentChampionIndex(0);
    setNextChallengerIndex(1);
    setView('citySelection'); // Go back to city selection
  };

  // --- Render Logic Based on View State ---

  const renderView = () => {
    switch (view) {
      case 'citySelection':
        // Pass the derived cityNames array to the component
        return <CitySelection cities={cityNames} onCitySelect={handleCitySelect} />;

      case 'game':
        // Ensure loading is false AND we have enough places AND the challenger index is valid
        if (isLoading || gamePlaces.length < 2 || nextChallengerIndex >= gamePlaces.length || currentChampionIndex >= gamePlaces.length) {
          return <div className="loading-view"><p>Loading {selectedCity} options...</p></div>;
        }
        // Get the actual place objects using the current indices
        const champion = gamePlaces[currentChampionIndex];
        const challenger = gamePlaces[nextChallengerIndex];

        // Add extra safety check in case indices somehow mismatch length after state updates
         if (!champion || !challenger) {
            console.error("Champion or Challenger is missing!", { champion, challenger, currentChampionIndex, nextChallengerIndex, gamePlacesLength: gamePlaces.length });
            return <div className="loading-view"><p>Error loading game data...</p> <button onClick={handleRestart}>Restart</button> </div>;
        }

        return (
          <div className="game-view-container">
            {/* Left Panel (Blue) - Champion */}
            <div className="choice-panel panel-blue" onClick={() => handleChoice(currentChampionIndex)}>
                <div className="panel-content">
                    {/* Use unique key to help React with transitions if needed */}
                    <PlaceCard place={champion} key={`card-${champion.id}-${currentChampionIndex}`} />
                    <button className="panel-choose-button">I'd Rather...</button>
                </div>
            </div>
            {/* Right Panel (Orange) - Challenger */}
            <div className="choice-panel panel-orange" onClick={() => handleChoice(nextChallengerIndex)}>
                 <div className="panel-content">
                    <PlaceCard place={challenger} key={`card-${challenger.id}-${nextChallengerIndex}`} />
                     <button className="panel-choose-button">This One!</button>
                 </div>
            </div>
             {/* Optional: Button to go back */}
             <button onClick={handleRestart} className="quit-game-button">Change City</button>
          </div>
        );

      case 'result':
        // Ensure gamePlaces and the champion index are valid before accessing
        if (gamePlaces.length === 0 || currentChampionIndex >= gamePlaces.length) {
            return <div className="loading-view"><p>Error loading result...</p> <button onClick={handleRestart}>Restart</button> </div>;
        }
        const finalPlace = gamePlaces[currentChampionIndex];
        return <ResultScreen finalPlace={finalPlace} onRestart={handleRestart} />;

      default:
        return <CitySelection cities={cityNames} onCitySelect={handleCitySelect} />;
    }
  };

  // The main App return just decides which view component to render
  return (
    <div className="App">
      {renderView()}
    </div>
  );
}

export default App;
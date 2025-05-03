import React, { useMemo } from 'react';
import { getCitiesByContinent } from '../data/places';

// Define the order of continents for marquees
const continentOrder = ["Europe", "North America", "Asia", "South America", "Africa", "Oceania", "Unknown"];

function CitySelection({ onCitySelect }) {
  // Memoize the grouped cities to avoid recalculating on every render
  const citiesGroupedByContinent = useMemo(() => getCitiesByContinent(), []);

  // Create arrays for marquees based on continent order
  const marqueeRows = continentOrder
    .map(continent => citiesGroupedByContinent[continent]) // Get cities for this continent
    .filter(cities => cities && cities.length > 0); // Filter out empty continents

  // Ensure we have at least 3 rows, duplicate/combine if needed (simple approach)
   while (marqueeRows.length > 0 && marqueeRows.length < 3 && marqueeRows[0].length > 1) {
       // If less than 3 rows, try splitting the longest row or duplicating
       // This logic can be refined based on actual data distribution
       const longestRowIndex = marqueeRows.reduce((maxIdx, row, idx, arr) => row.length > arr[maxIdx].length ? idx : maxIdx, 0);
       const rowToSplit = marqueeRows[longestRowIndex];
       if (rowToSplit.length >= 4) { // Only split if it makes sense
            const midPoint = Math.ceil(rowToSplit.length / 2);
            marqueeRows.splice(longestRowIndex, 1, rowToSplit.slice(0, midPoint)); // Replace with first half
            marqueeRows.push(rowToSplit.slice(midPoint)); // Add second half as new row
       } else if (marqueeRows.length === 1 && marqueeRows[0].length > 0) {
            marqueeRows.push([...marqueeRows[0]]); // Duplicate first row
            if (marqueeRows.length === 2 && marqueeRows[0].length > 0) {
                 marqueeRows.push([...marqueeRows[0]]); // Duplicate again
            }
            break; // Avoid infinite loop if logic fails
       } else {
            break; // Cannot split further sensibly
       }
   }
   // Limit to max 4 rows for example
   const finalMarqueeRows = marqueeRows.slice(0, 4);


  return (
    <div className="city-selection-view">
      <div className="header-content">
        <h1 className="city-selection-title">Choose Your Destination</h1>
        <p className="city-selection-subtitle">Where will your questionable journey begin?</p>
      </div>

      <div className="marquees-container">
        {finalMarqueeRows.map((cities, rowIndex) => (
          // Assign alternating directions and slightly different speeds
          <div
            key={`marquee-${rowIndex}`}
            className={`marquee-row ${rowIndex % 2 === 0 ? 'scroll-left' : 'scroll-right'}`}
            style={{ '--scroll-duration': `${cities.length * 4 + 10}s` }} // Adjust duration based on item count
          >
            <div className="marquee-content">
              {/* Duplicate content for infinite loop effect */}
              {[...cities, ...cities].map((city, index) => (
                <div
                  key={`${city.name}-${index}`} // Unique key including index for duplicates
                  className="city-tile"
                  onClick={() => onCitySelect(city.name)}
                  style={{ backgroundImage: `url(${city.image_url})` }}
                >
                  <div className="city-tile-overlay"></div>
                  <span className="city-tile-name">{city.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CitySelection;
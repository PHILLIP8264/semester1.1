import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './Timeline.css';

const TimeData = () => {
  const [setsData, setSetsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [setsByYear, setSetsByYear] = useState({});
  const [setsRare, setSetsRare] = useState({});
  const [randomCardsData, setRandomCardsData] = useState([]);
  const [setType, setSetsType] = useState({});
  const [setSubType, setSetsSubType] = useState({});
  const [selectedDataset, setSelectedDataset] = useState([]);
  const [chartInstance, setChartInstance] = useState(null); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch only the first 100 sets
      const response = await axios.get('https://api.magicthegathering.io/v1/sets?pageSize=100');
      setSetsData(response.data.sets);

      // Count sets released in each year
      const setsCountByYear = {};
      for (const set of response.data.sets) {
        const releaseYear = new Date(set.releaseDate).getFullYear();
        setsCountByYear[releaseYear] = (setsCountByYear[releaseYear] || 0) + 1;
      }

      // Fetch 300 cards
      const cardsResponse = await axios.get('https://api.magicthegathering.io/v1/cards?pageSize=300');
      const cards = cardsResponse.data.cards;

      // Initialize counts for each rarity
      let raritiesCount = {
        common: 0,
        uncommon: 0,
        rare: 0,
        mythic: 0,
        special: 0 
      };

      // Initialize counts for each card type
      let typesCount = {};

      // Initialize counts for each card subtype
      let subtypesCount = {};

      // Count rarities, types, and colors
      cards.forEach(card => {
        raritiesCount[card.rarity.toLowerCase()]++;

        if (typesCount[card.type]) {
          typesCount[card.type]++;
        } else {
          typesCount[card.type] = 1;
        }

        if (card.subtypes) {
          card.subtypes.forEach(subtype => {
            if (subtypesCount[subtype]) {
              subtypesCount[subtype]++;
            } else {
              subtypesCount[subtype] = 1;
            }
          });
        }
      });

      // Fetch 20 random cards
      const responses = await Promise.all(Array.from({ length: 20 }, () => axios.get('https://api.scryfall.com/cards/random')));
      const randomCards = responses.map(response => response.data);
      setRandomCardsData(randomCards);

      let logString = "Prices of 20 Random Cards:\n";
      randomCards.forEach(card => {
        const { name, prices } = card;
        if (prices && prices.usd !== null) {
          logString += `${name} - $${prices.usd}\n`;
        } else {
          logString += `${name} - Price data not available\n`;
        }
      });
      console.log('string cost',logString);
      console.log('Total Subtypes Count:', subtypesCount);
      console.log('Total Rarities Count:', raritiesCount);
      console.log('Total Types Count:', typesCount);
      console.log('Sets Count by Year:', setsCountByYear);

      setSetsSubType(subtypesCount);
      setSetsType(typesCount);

      // Set sets count by year
      setSetsByYear(setsCountByYear);

      // Set rarities count
      setSetsRare(raritiesCount);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDataset && selectedDataset.length > 0) {
      updateChart(selectedDataset);
    } else {
      if (chartInstance) {
        chartInstance.destroy(); // Destroy the existing chart instance if selectedDataset is empty
      }
    }
  }, [selectedDataset]);

  const updateChart = (dataset) => {
    if (chartInstance) {
      chartInstance.destroy(); // Destroy the existing chart instance
    }
    const ctx = document.getElementById('myChart');
    const labels = dataset.map(data => data.label);
    const data = dataset.map(data => data.value);

    const newChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Data',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'white'
            }
          },
          x: {
            grid: {
              color: 'white'
            }
          }
      },
      plugins: {
        legend: {
          display: false
          
        }
      }
    }
    });
    setChartInstance(newChartInstance);
  };

  const handleDatasetChange = (event) => {
    const value = event.target.value;
    switch (value) {
      case 'subtypes':
        setSelectedDataset(formatData(setSubType));
        break;
      case 'types':
        setSelectedDataset(formatData(setType));
        break;
      case 'rarities':
        setSelectedDataset(formatData(setsRare));
        break;
      case 'years':
        setSelectedDataset(formatData(setsByYear));
        break;
      case 'randomCards':
        setSelectedDataset(formatRandomCardsData(randomCardsData));
        break;
      default:
        setSelectedDataset([]);
        break;
    }
  };

  const formatData = (data) => {
    return Object.entries(data).map(([key, value]) => ({ label: key, value: value }));
  };

  const formatRandomCardsData = (data) => {
    return data.map(card => ({ label: card.name, value: card.prices && card.prices.usd ? card.prices.usd : 'Price data not available' }));
  };

  return (
    <div>
      
      <div className='optoins'>
        <select  className='drop' onChange={handleDatasetChange}>
          <option className='drop' value="">Select Dataset</option>
          <option className='drop' value="subtypes">Subtypes</option>
          <option className='drop' value="types">Types</option>
          <option className='drop' value="rarities">Rarities</option>
          <option className='drop' value="years">Years</option>
          <option className='drop' value="randomCards">Card Prices</option>
        </select>
      </div>
      <div className='linechart'>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <canvas id="myChart" width="400" height="400"></canvas>
        </div>
        
      )}
      </div>
    </div>
  );
};

export default TimeData;

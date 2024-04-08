import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SearchField from './SearchFieldComparison1'; 
import Chart from 'chart.js/auto';
import "./Comparison.css";

const CardInfo1 = () => {
  const [cardData, setCardData] = useState(null);
  const [authorName, setAuthorName] = useState('');
  const [manaCost, setManaCost] = useState('');
  const [power, setPower] = useState('');
  const [toughness, setToughness] = useState('');
  const [chartInstance, setChartInstance] = useState(null);
  const [pieChartInstance, setPieChartInstance] = useState(null);
  const [donutChartInstance, setDonutChartInstance] = useState(null);
  const [type, setType] = useState(null);
  const [rarities, setRarities] = useState(null);

  
  const chartRef = useRef(null);
  const pieRef = useRef(null); 
  const donutRef = useRef(null);

  const searchCard = async (searchQuery) => {
    try {
      const response = await axios.get(`https://api.magicthegathering.io/v1/cards?name=${searchQuery}`);
      const cardData = response.data.cards[0]; 
      setCardData(cardData);
  
      
      const authorName = cardData.artist || ''; 
      const manaCost = cardData.manaCost || '';
      const power = cardData.power ? `${cardData.power}` : '';
      const toughness = cardData.toughness ? `${cardData.toughness}` : '';
      const { set } = cardData;
      
      setAuthorName(authorName);
      setManaCost(manaCost);
      setPower(power);
      setToughness(toughness);
  
      
      const setResponse = await axios.get(`https://api.magicthegathering.io/v1/cards?set=${set}`);
      const setCards = setResponse.data.cards;
      console.log('Cards in Set:');
     
      const rarityCounts = {};
      setCards.forEach((card) => {
        const { rarity } = card;
        if (rarityCounts[rarity]) {
          rarityCounts[rarity]++;
        } else {
          rarityCounts[rarity] = 1;
        }
      });
      console.log('Total Rarities:', rarityCounts);
      setRarities(rarityCounts); 

      const typeCounts = {};
      setCards.forEach((card) => {
        const { types } = card;
         
        if (typeCounts[types]) {
          typeCounts[types]++;
        } else {
          typeCounts[types] = 1;
        }
      });
              console.log('types',typeCounts);
        setType(typeCounts);
    } catch (error) {
      console.error('Error searching card:', error);
    }
  };

 
  const updateChart = () => {
    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    const newChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mana Cost', 'Power', 'Toughness'],
        datasets: [{
          label:null,
          data: [parseManaCost(manaCost), parseInt(power), parseInt(toughness)], 
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
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min:0,
            max:16,
            ticks: {
              stepSize: 2
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



const createPieChart = () => {
  const ctx = pieRef.current.getContext('2d');
  
  if (pieChartInstance) {
    pieChartInstance.destroy();
  }
  
  const newPieChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(rarities),
      datasets: [{
        label: 'Total',
        data: Object.values(rarities),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(20, 200, 80, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(20, 200, 80, 1)',
        ],
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'x', 
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    }
  });
  setPieChartInstance(newPieChartInstance); 
};

const createDonutChart = () => {
  const ctx = donutRef.current.getContext('2d');
  if (donutChartInstance) {
    donutChartInstance.destroy();
  }
  const newDonutChartInstance = new Chart(ctx, {
    type: 'doughnut', 
    data: {
      labels: Object.keys(type),
      datasets: [{
        label: 'Types',
        data: Object.values(type), 
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      cutout: '50%', 
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    }
  });
  setDonutChartInstance(newDonutChartInstance);
};



  useEffect(() => {
    if (cardData) {
      updateChart();
      if (rarities) {
        createPieChart();
        if (type) {
          createDonutChart();
        }
      }
    }
  }, [cardData, rarities, type]);

  // Function to parse mana cost string and calculate total cost
  const parseManaCost = (manaCostString) => {
    // Remove anything that is not a letter or number from the mana cost string
    const cleanedManaCost = manaCostString.replace(/[^a-zA-Z0-9]/g, '');
    // Parse the mana cost string to integers
    let totalCost = 0;
    if (cleanedManaCost) {
      const symbols = cleanedManaCost.match(/\d+|[^\d\s]/g);
      symbols.forEach(symbol => {
        if (!isNaN(symbol)) {
          totalCost += parseInt(symbol);
        } else {
          totalCost++;
        }
      });
    }
    return totalCost;
  };

  return (
    <div>
      <div className='cards1one'>
        
        <div className='searchcom1'>
          <h1>Card 2</h1>
          <SearchField onSearch={searchCard} />
        </div>
        {cardData && (
          <div>
            <img src={cardData.imageUrl} alt={cardData.name} className="card-image" />
            <div className='carddata1'>
              <h1>{cardData.name}</h1>
              <div className='space1'>Artist: {authorName}</div> 
              <div className='space1'>Mana Cost: {manaCost}</div>
              <div className='space1'>Power: {power}</div>
              <div className='space1'>Toughness: {toughness}</div>
            </div> 
          </div>
        )}
      </div>
    
      <div className='combargraphy1'>
      <h1 className='comcharthead1'>Mana, Power and Toughness values</h1>
        <canvas ref={chartRef} id="barChart" width="300px" height="300px"></canvas>
      </div>
      
      <div className='compie1'>
        <h1 className='comcharthead1'>Rarity in card's set</h1>
        <canvas ref={pieRef} id="pieChart" ></canvas>
      </div>

      <div className='comdonut2'>
          <h1 className='comcharthead1'>Types in card's set</h1>
          <canvas ref={donutRef} id="donutChart" ></canvas>
      </div>

    </div>
  );
};

export default CardInfo1;
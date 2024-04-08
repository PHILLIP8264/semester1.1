import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import './Character.css';

const Character = () => {
  const [randomCardData, setRandomCardData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const chartRef = useRef(null); 

  useEffect(() => {
    const fetchRandomCard = async () => {
      try {
        let apiUrl = 'https://api.scryfall.com/cards/random';
        
        if (searchQuery) {
          apiUrl = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(searchQuery)}`;
        }

        const response = await axios.get(apiUrl);
        const cardData = response.data;

        setRandomCardData(cardData);

        
      } catch (error) {
        console.error('Error fetching card data:', error);
      }
    };

    fetchRandomCard();
  }, [searchQuery]);

  const handleSearch = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const query = formData.get('searchQuery');
    setSearchQuery(query);
  };

  return (
    <div className='Character'>
      <div className='containercard1'>
        <div className='card1'>
          {randomCardData && (
            <div>
              <h2>{randomCardData.name}</h2>
              <p>Mana Cost: {randomCardData.mana_cost}</p>
              <p>Power/Toughness: {randomCardData.power}/{randomCardData.toughness}</p>
              <p>Type: {randomCardData.type_line}</p>
              <p>Subtype: {randomCardData.subtype}</p>
              <p>Text: {randomCardData.oracle_text}</p>
              <p>Artist: {randomCardData.artist}</p>
              
            </div>
          )}
        </div>
        
        <div className='card3'></div>
      </div>
      <div className='containercard2'>
        <div className='card4'>
          
          <form onSubmit={handleSearch}>
            <input className='searchcard' type='text' name='searchQuery' placeholder='Search for a card' />
            <button className='buttoncard' type='submit'>Search</button>
          </form>
          {randomCardData && randomCardData.image_uris && randomCardData.image_uris.normal && (
            <img className='cardimg' src={randomCardData.image_uris.normal} alt='Card' />
          )}
        </div>
      </div>
    </div>
  );
};

export default Character;

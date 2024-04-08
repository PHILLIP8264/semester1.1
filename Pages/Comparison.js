import React from 'react';
import CardInfo1 from './APIComparison1.js';
import CardInfo2 from './APIComparison2.js';
import "./Comparison.css";


const Comparison = () => {
  return (
    <div>
      <div className='title'>
        <h1>Magic: The Gathering Card Search</h1>
      </div>
      <div className='hold1'>
        <CardInfo1 />
      </div>
      <div className='hold2'>
          <CardInfo2 />
      </div>
    </div>
  );
};

export default Comparison;

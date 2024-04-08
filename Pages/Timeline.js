import React from 'react';
import TimeData from './APITimeline.js';
import './Timeline.css';

const Timeline = () => {


    return (
        <div className='timeline'>
            <h1 className='title'>Magic: The Gathering Sets information</h1>
            <div className='timebox'>
               <TimeData />
                
            </div>
        </div>
    );
};

export default Timeline;

import React from 'react';
import './Nav.css';


const SideNavBar = () => {
    return (

            <div className='sidenav'>
                <h1>Magic The gatharing</h1>
                <div className='line'></div>
                <ul>
                    <li><a href='/'>Deck</a></li>
                    <li><a href='/Comparison'>Comparison</a></li>
                    <li><a href='/Timeline'>Timeline</a></li>
                    <li><a href='/Character'>Cards</a></li>
                </ul>
            </div>


        );
    }
export default SideNavBar;


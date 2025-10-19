import React, { useState } from 'react';
import './App.css';
import Dither from './components/Dither';

function App() {
  return (
    <>
      <div className="bg">
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>

      <div className="app">
          <div className="mid"> 

            <div className="title">
              Miniaturity.coM
            </div>

            <div className="about">
              <div className="contact">
                <button className="contact-button">
                  github
                </button>
                <button className="contact-button">
                  youtube
                </button>
                <button className="contact-button">
                  insta
                </button>
                <button className="contact-button">
                  itch io
                </button>
              </div>

            </div>

          </div>

          
      </div>
      </>
  )
}







export default App;

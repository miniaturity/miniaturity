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
                <a href="https://github.com/miniaturity" target="_blank"><button className="contact-button"
                
                >
                  github
                </button></a>
                <a href="https://www.youtube.com/@miniaturity" target="_blank"><button className="contact-button">
                  youtube
                </button></a>
                <a href="https://www.instagram.com/m.iniaturity/" target="_blank"><button className="contact-button">
                  insta
                </button></a>
                <a href="https://miniaturity.itch.io/" target="_blank"><button className="contact-button">
                  itch io
                </button> </a>
              </div>

            </div>

          </div>

          
      </div>
      </>
  )
}







export default App;

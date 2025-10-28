import React, { useEffect, useState } from 'react';
import './App.css';
import Squares from './components/Squares';
import { Search, House, MessageSquare, Mail, AtSign, FolderCode, Gamepad2, Signal, CirclePlus } from 'lucide-react';
import { TwitterLogoIcon, YoutubeLogoIcon } from '@phosphor-icons/react'
import MetaBalls from './components/MetaBalls';
import { LastFMComponent } from './components/LastFM';
import { RecentTracks, TrackInner } from './components/LastFM';


function App() {
  return (
    <>
      <div className="main">
        <Squares 
          speed={0.5} 
          squareSize={40}
          direction='diagonal' 
          borderColor='#2e2323'
          hoverFillColor='#2b2222ff'
        />
        
        <Middle />
      </div>
    </>
  )
}

const Middle: React.FC = () => {
  const [cachedSongs, setCachedSongs] = useState<RecentTracks | null>(null);
  const [bunny, setBunny] = useState<string>("bunny_0");
  const [location, setLocation] = useState<string>("src/home");
  const [locationIndex, setLocationIndex] = useState<number>(0);
  const locationComponents = [
  <Home cachedSongs={cachedSongs} setCachedSongs={setCachedSongs}/>
];
  const locations = ["src/home", "src/blog", "src/chat", "src/guestbook"];
  
  useEffect(() => {
    setLocationIndex(locations.indexOf(location));
  }, [location]);

  const handleBunnyClick = (): void => {
    setBunny("bunny_1");
  }

  const handleBunnyLetGo = (): void => {
    setBunny("bunny_0");
  }

  const parseLocation = (path: string) => {
    const normalized = path.replace(/\/+$/, "");

    const lastSlash = normalized.lastIndexOf("/");

    const prefix = lastSlash !== -1 ? normalized.slice(0, lastSlash) : "";
    const name = lastSlash !== -1 ? normalized.slice(lastSlash + 1) : normalized;

    return (
      <>
        <span className="suffix">/{prefix}/</span>
        {name}
      </>
    );
  }

  return (
    <div className="middle">
      <div className="m-marq container">
        <div className="m-marq-content">
          site is still under construction ⚠️⚠️ theres like nothing here .... 
        </div>
      </div>

      <div className="m-middle">
        <div className="m-sidel container">

          <div className="ml-header ">
            <img src="images/sparkle_r.png" alt="star"/>
            <img src="images/sparkle_r.png" alt="star"/>
            <img src="images/sparkle_r.png" alt="star"/>
            <img src="images/sparkle_r.png" alt="star"/>
          </div>

          <div className="ml-header2 container">
            '--...--__nav__--...--'
          </div>
          <div className="ml-nav container-2">
            <div className="nav-header container">
              ..--website--..
            </div>
            <div className="nav-contents container-2 ">
              <button className="nav-item" onClick={() => setLocation("src/home")}>
                <House size={12}/>
                {` home`}
              </button>
              <button className="nav-item" onClick={() => setLocation("src/chat")}>
                <MessageSquare size={12}/>
                {` chat`}
              </button>
              <button className="nav-item" onClick={() => setLocation("src/guestbook")}>
                <Mail size={12}/>
                {` guestbook`}
              </button>
              <button className="nav-item" onClick={() => setLocation("src/blog")}>
                <AtSign size={12}/>
                {` blog`}
              </button>
              
            </div>

            <div className="nav-header container">
              ..--external--..
            </div>
            <div className="nav-contents container-2 ">
              <button className="nav-item">
                <a href="https://github.com/miniaturity" target="_blank" rel="noreferrer"><FolderCode size={12}/>
                {` github`}</a>
              </button>
              <button className="nav-item">
                <a href="https://miniaturity.itch.io" target="_blank" rel="noreferrer">
                <Gamepad2 size={12}/>
                {` itch.io`} </a>
              </button>
              <button className="nav-item">
                <a href="https://x.com/miniaturity_" target="_blank" rel="noreferrer">
                <TwitterLogoIcon size={12} />
                {` twitter`}  </a>
              </button>
              <button className="nav-item">
                <a href="https://youtube.com/@miniaturity" target="_blank" rel="noreferrer">
                <YoutubeLogoIcon size={12} />
                {` youtube`}</a>
              </button>
            </div>

          </div>

          <div style={{ flexGrow: "1" }}>

          </div>
          
          <div className="ml-palette">
            <div className="mlp-color" 
            style={{ backgroundColor: "var(--l-main)"}}>
            </div>
            <div className="mlp-color" 
            style={{ backgroundColor: "var(--main)"}}>
            </div>
            <div className="mlp-color" 
            style={{ backgroundColor: "var(--d-main)"}}>
            </div>
            <div className="mlp-color" 
            style={{ backgroundColor: "var(--border)"}}>
            </div>
            <div className="mlp-color" 
            style={{ backgroundColor: "var(--s-br)"}}>
            </div>
            <div className="mlp-color" 
            style={{ backgroundColor: "var(--l-bg)"}}>
            </div>
            <div className="mlp-color" 
            style={{ backgroundColor: "var(--bg)"}}>
            </div>
          </div>

        </div>

        <div className="m-mid container">

          <div className="mm-location container ">
            <div className="mml-controls">
              <button className="mml-control">{`<`}</button>
              <button className="mml-control">{`>`}</button>
            </div>
            <div className="mml-bar">{parseLocation(location)}</div>
          </div>

          <div className="mm-lower container-2">
            <div className="mm-header">
              <div className="mmh-search">
                <Search size={16}/>
              </div>

              <div className="mmh-bar">
                miniaturity.com
              </div>
            </div>
          </div>

          {locationComponents[locationIndex] || <Placeholder />}
              
          <div className="bottom-space">
            <div className="line-container">
              <div style={{ color: "var(--s-br)", marginLeft: "4px", userSelect: "none"}}>:3...</div>
              <div className="line"></div>
              <div className="line"></div>
            </div>
          </div>

          <div className="mm-footer">
            <img src={`images/b/${bunny}.png`} style={{ marginRight: "-30px"}} alt="me"
              onMouseEnter={handleBunnyClick} onMouseLeave={handleBunnyLetGo}
            />
            <img src="images/r-speech-start.png" className="speech-start" alt="speech bubble"/>
            <div className="speech-bubble">
              <div className="m-marq-content">
                whatttttttttts goin on?!?!
              </div>
            </div>
          </div>
        </div>

        <div className="m-sider container">
          <div className="mr-header container">
            the gooup
          </div>
          <div className="mr-balls container-2 ">
            
            <MetaBalls
              color="#f18d87"
              cursorBallColor="#f18d87"
              cursorBallSize={2}
              ballCount={15}
              animationSize={15}
              enableMouseInteraction={true}
              enableTransparency={true}
              hoverSmoothness={0.05}  
              clumpFactor={1}
              speed={0.3}
            />

          </div>
  
        </div>
      </div>

      <div className="m-footer container-2">
        {`<c> 2025 miniaturity`} // {`inspired by `} &nbsp;<a href="https://aelita.neocities.org/" target="_blank" rel="noreferrer">https://aelita.neocities.org/ </a>
      </div>

    </div>
  )
}

type Status = {
  content: string,
  date: string,
}

async function fetchData(path: string) {
  try {
    const response = await fetch(path);

    if (!response.ok) 
      throw new Error("HTTP Error: Status " + response.status);
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching status");
  }
} 

const Placeholder: React.FC = () => {
  return (
    <div style={{ margin: "6px" }}>
      <div className="mmm-header container">
        <div>404 not found</div>
        <div className="line-container">
          <div className='line'></div>
          <div className='line'></div>
        </div>
        <div className="icon-row">
          <Signal size={16} />
          <CirclePlus size={16} />
        </div>
      </div>

      <div className="mmm-body container-2">
        <div className="row">
          <div style={{ textAlign: "justify", textJustify: "inter-word", display: "block", textAlignLast: "justify", margin: "8px" }}>
            hello. nothing's here for now, check in later!
          </div>
        </div>

      </div>
    </div>
  )
}

type HomeProps = {
  cachedSongs:  RecentTracks | null,
  setCachedSongs: React.Dispatch<React.SetStateAction<RecentTracks | null>>,
}


const Home: React.FC<HomeProps> = ({ cachedSongs, setCachedSongs }) => {
  const [status, setStatus] = useState<Status>({ content: "Loading..", date: "0/0/0" });
  const [currentGif, setCurrentGif] = useState<string>("giphy_6.gif");
  const rotatingGifs = ["discdisc.gif", "giphy_6.gif"];
  
  useEffect(() => {
    const chosen = rotatingGifs[Math.floor(Math.random() * rotatingGifs.length)];
    setCurrentGif(chosen);

    fetchData("./data/status.json").then(j => {
      if (j)
        setStatus(j);
    });
  }, []);

  return (
    <>
    <div className="mm-main">

      <div className="mmm-header container">
        <div>about</div>
        <div className="line-container">
          <div className='line'></div>
          <div className='line'></div>
        </div>
        <div className="icon-row">
          <Signal size={16} />
          <CirclePlus size={16} />
        </div>
      </div>
          
      <div className="mmm-body container-2">

        <div className="row">
          <div style={{ textAlign: "justify", textJustify: "inter-word", display: "block", textAlignLast: "justify" }}>
            hi. welcome to Miniaturity.coM. this website is forever wip, but go ahead and press all the buttons and stuff
            anyways. i am a student and game/web dev .. i will post my projects here and some misc stuff. 
            dont forget to sign my guestbook!
          </div>
          <div className="mmm-img">
            <img src={`images/r/${currentGif}`} alt="a random rotating gif"/>
          </div>
        </div>

      </div>

    </div>

    <div className="mm-status-win">
      <div className="mmm-header container">
        <div>status</div>
        <div className="line-container">
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <div className="icon-row">
            <Signal size={16} />
            <CirclePlus size={16} />
        </div>
      </div>
      <div className="mm-status container-2">
        <img src="images/tuyemylove.jpg" alt="profile pic"/>

        <div className="mm-inner-status">
          <div className="is-date container">
            <span>miniaturity</span> 
            <div className="line-container">
              <div className="line"></div>
              <div className="line"></div>
            </div>
            <span className="suffix">{status.date}</span>
          </div>

          <div className="is-content container-2">
            {status.content}
          </div>
        </div>
      </div>

      
    </div>

    <div className="mm-lastfm">
      <LastFMComponent cachedSongs={cachedSongs} setCachedSongs={setCachedSongs}/>
    </div>
    </>
  )
}

export default App;

import { animated, easings, useSpring } from "@react-spring/web"
import { useEffect, useState } from "react";
import { Signal, CirclePlus } from "lucide-react";

export interface RecentTracks {
  "recenttracks": {
    "@attr": {
      "page": number | string,
      "perPage": number | string,
      "total": number | string,
      "totalPages": number | string,
      "user": string,
    }
    "track": TrackInner[]
  }
}

export interface TrackInner {
  "artist": {
          "mbid": string,
          "#text": string
        },
        "streamable": number | string,
        "image": [
          {
            "size": string
            "#text": string
          },
          {
            "size": string,
            "#text": string
          },
          {
            "size": string,
            "#text": string
          },
          {
            "size": string,
            "#text": string
          }
        ],
        "mbid": string,
        "album": {
          "mbid": string,
          "#text": string
        },
        "name": string,
        "@attr": {
          "nowplaying": string
        } | null | undefined,
        "date": {
          "uts": string,
          "#text": string
        } | null | undefined,
        "url": string
}

interface LastFMComponentProps {
  cachedSongs:  RecentTracks | null,
  setCachedSongs: React.Dispatch<React.SetStateAction<RecentTracks | null>>,
}


export const LastFMComponent: React.FC<LastFMComponentProps> = ({ cachedSongs, setCachedSongs }) => {
  const [recentSongs, setRecentSongs] = useState<RecentTracks | null>(null);
  const [song, setSong] = useState<TrackInner | null>(null);
  const [scrobbles, setScrobbles] = useState<number>(0);
  const [date, setDate] = useState<string>("loading");
  const [rateLimit, setRateLimit] = useState<boolean>(false);

  useEffect(() => {
    if (!cachedSongs)
      handleFetch();
    else
      setRecentSongs(cachedSongs);
  }, [])

  useEffect(() => {
    const recenttrack = recentSongs?.recenttracks.track[0];
    setSong(recenttrack || null);
    setScrobbles(Number(recentSongs?.recenttracks['@attr'].total) || 0);
    setDate(recenttrack?.['@attr']?.nowplaying ? "playing now" : recentSongs?.recenttracks.track[0].date?.['#text'] || "err")
    setCachedSongs(recentSongs);
  }, [recentSongs])

  useEffect(() => {
    setDate(song?.['@attr']?.nowplaying ? "playing now" : song?.date?.["#text"] || "err")
  }, [song])

  const handleFetch = () => {
    if (rateLimit) { 
      console.error("You are being rate limited.");
      return; 
    }
    setRateLimit(true);
    fetch('https://lastfm.nkko.workers.dev/?method=user.getRecentTracks&user=miniaturity')
      .then(res => res.json())
      .then(data => { console.log(data); setRecentSongs(data) })
      .catch(err => console.error("Failed to fetch song: ", err));
    const timeRateLimit = setTimeout(() => {
      setRateLimit(false);
    }, 10000);

    return () => clearTimeout(timeRateLimit);
  }

  return (
    <div className="c-song">
      <SongView scrobbles={scrobbles} song={song} date={date} />
    </div>
  )
}

interface SongViewProps {
  scrobbles: number,
  song: TrackInner | null,
  date: string,
}

const SongView: React.FC<SongViewProps> = ({ scrobbles, song, date }) => {

  const { number } = useSpring({
    from: { number: 0 },
    number: scrobbles,
    delay: 0,
    config: { 
      duration: 3000,
      easing: easings.easeOutExpo  
    }, 
  });
  
  return (
    <>
    <div className="mmm-header container">
      <div>last.fm</div>
      <div className="line-container">
        <div className='line'></div>
        <div className='line'></div>
      </div>
      <div className="icon-row">
        <Signal size={16} />
        <CirclePlus size={16} />
      </div>
    </div>

    <div className="c-song-sv container-2">
      <div className="cs-albumart">
        <img src={song?.image[3]["#text"]}/>
      </div>
      <div className="cs-desc">
        <div className="cs-name m-marq">
          <a className="m-song-marq" style={{ color: "var(--main)" }} href={song?.url} target="_blank" rel="noreferrer">{song?.name || 'loading'}</a> 
        </div>

        <div className="cs-about">
          on <span className="t-artist">{song?.album["#text"] || 'loading'}</span>
          <br />
          by <span className="t-artist">{song?.artist["#text"] || 'loading'}</span>
          <br />
          {date === "playing now" ? "playing now!" : <>@ <span className="t-artist">{date}</span> utc</>}
        </div>

        <div className="cs-dash">
          <div className="cs-scrobbles">
            <animated.span>
              {number.to((n: number) => `${Math.floor(n)} total scrobbles`)}
            </animated.span>
          </div>
        </div>
      </div>
      
    </div>
    </>
  )
}
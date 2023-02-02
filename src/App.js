import "./App.css";
import Globe from "react-globe.gl";
import { useState } from "react";
import { useEffect } from "react";
import InfoIcon from '@mui/icons-material/Info';

function App() {
  const [cid, setCid] = useState(
    "QmVrrF7DTnbqKvWR7P7ihJKp4N5fKmBX29m5CHbW9WLep9"
  );
  const [points, setPoints] = useState([]);
  const [pointHover, setPointHover] = useState(false);
  const [arcs, setArcs] = useState([]);
  const [rings, setRings] = useState([]);
  const [myLocation, setMyLocation] = useState({});
  const [allLocations, setAllLocations] = useState({});
  const [clickedLocation, setClickedLocation] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  
  useEffect(() => {
    fetch(`https://ipapi.co/json/`).then((res) =>
      res.json().then((data) => {
        setMyLocation(data);
      })
    );
  }, []);

  function getLocations(ipAddress) {
    return new Promise((resolve, reject) => {
      fetch(`https://ipapi.co/${ipAddress}/json/`).then((res) =>
        res.json().then((data) => {
          resolve(data);
        })
      );
    });
  }

  function getIpAddresses(minerId) {
    return new Promise((resolve, reject) => {
      fetch(`https://api.estuary.tech/public/miners/stats/${minerId}`)
        .then((res) => res.json())
        .then((data) => {
          let ipAddresses = [];
          let addresses = data.chainInfo.addresses;
          addresses.forEach((address) => {
            ipAddresses.push(address.split("/")[2]);
          });
          resolve(ipAddresses);
        });
    });
  }

  const findLocation = (coords) => {
    setPointHover(true);

    allLocations.forEach((elem) => {
      if (elem.latitude === coords.lat && elem.longitude === coords.lng) {
        setClickedLocation(elem);
      }
    });
  };

  const handleCidChange = (event) => {
    setCid(event.target.value);
  };

  const populateRandomCid = () => {
    const remainingCids = hardCids.filter(function (currCid) {
      return currCid !== cid;
    });
    setCid(remainingCids[Math.floor(Math.random() * remainingCids.length)]);
  };

  const getContentByCid = () => {
    setShowInstructions(false);
    setIsLoading(true);
    fetch(`https://api.estuary.tech/public/by-cid/${cid}`)
      .then(async (res) => {
        let data = await res.json();
        return data;
      })
      .then((data) => {
        let minerIds = [];
        data.forEach((e) => {
          e.deals.forEach((miners) => {
            minerIds.push(miners.miner);
          });
        });
        return minerIds;
      })
      .then((minerIds) => {
        let ipAddresses = [];

        minerIds.forEach((minerId) => {
          ipAddresses.push(getIpAddresses(minerId));
        });
        Promise.all(ipAddresses)
          .then((allIpAddresses) => {
            setIsLoading(false);
            return allIpAddresses.flat();
          })
          .then((ipAddresses) => {
            let locationData = [];
            ipAddresses.forEach((ipAddress) => {
              locationData.push(getLocations(ipAddress));
            });
            Promise.all(locationData).then((allLocationData) => {
              let pointsBuilder = [];
              let arcBuilder = [];
              let ringBuilder = [];

              allLocationData.forEach((location) => {
                pointsBuilder.push({
                  lat: location.latitude,
                  lng: location.longitude,
                });

                arcBuilder.push({
                  startLat: location.latitude,
                  startLng: location.longitude,
                  endLat: myLocation.latitude,
                  endLng: myLocation.longitude,
                  color: "#39FF14",
                });

                ringBuilder.push({
                  lat: location.latitude,
                  lng: location.longitude,
                  color: "#39FF14",
                });
              });

              allLocationData.push(myLocation);

              setAllLocations(allLocationData);
              setPoints(pointsBuilder);
              setArcs(arcBuilder);
              setRings(ringBuilder);
            });
          });
      });
  };

  const retrieveInfo = () => {
    getContentByCid();
  };

  let hardCids = [
    "QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR",
    "QmVrrF7DTnbqKvWR7P7ihJKp4N5fKmBX29m5CHbW9WLep9",
  ];

  return (
    <div className="parent">
      <div className="child panel">
        <h1 style={{ fontSize: "64px" }}>DEOXYS</h1>
        <p className="instructions">
          VISUALIZE IPFS DATA STORAGE
        </p>
        <p className="instructions">
          POWERED BY // <span style={{color: "#39ff14"}}>ESTUARY</span>
        </p>

        {isLoading === false && (
          <div>
            <input
              value={cid}
              onChange={handleCidChange}
              placeholder="Enter CID"
            />
            <br />
            <br />
            <button
              className="btn"
              onClick={retrieveInfo}
              style={{ marginRight: "25px" }}
            >
              VIEW INFO
            </button>
            <button className="btn" onClick={populateRandomCid} style={{ marginRight: "25px" }}>
              RANDOM CID
            </button>
            <button className="btn" onClick={() => setShowInstructions(!showInstructions)}>
              HELP
            </button>
          </div>
        )}

        {isLoading === true && (
          <p className="loadingBanner">RETRIEVING . . .</p>
        )}
        {showInstructions === true && (
          <>
            <br />
            <p className="instructions">1. INPUT CID OR CLICK "<span style={{color: "#39ff14"}}>RANDOM CID</span>" BUTTON</p>
            <p className="instructions">2. CLICK "<span style={{color: "#39ff14"}}>VIEW INFO</span>" BUTTON</p>
            <p className="instructions">3. GRAB AND DRAG THE <span style={{color: "#39ff14"}}>GLOBE</span></p>
            <p className="instructions">
              4. CLICK ON A <span style={{color: "#39ff14"}}>MARKER</span> TO VIEW PROVIDER INFO.
            </p>
          </>
        )}
        {pointHover === true && (
          <div className="storageProviderInfo">
            <h6>GEOLOCATION</h6>
            <div class="row">
              <div class="column">
                <p>City: {clickedLocation.city}</p>
              </div>
              <div class="column">
                <p>Region: {clickedLocation.region}</p>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <p>Country: {clickedLocation.country_name}</p>
              </div>
              <div class="column">
                <p>Timezone: {clickedLocation.timezone}</p>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <p>Latitude: {clickedLocation.latitude}</p>
              </div>
              <div class="column">
                <p>Longitude: {clickedLocation.longitude}</p>
              </div>
            </div>
            <h6>NETWORK DETAILS</h6>
            <div class="row">
              <div class="column">
                <p>Organization: {clickedLocation.org}</p>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <p>IP: {clickedLocation.ip}</p>
              </div>
              <div class="column">
                <p>Network: {clickedLocation.network}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="child">
        <Globe
          width={window.innerWidth / 2}
          labelsData={[
            {
              name: "YOU",
              lat: myLocation.latitude,
              lng: myLocation.longitude,
              size: 0.28,
              color: "white",
            },
          ]}
          labelLat={(d) => d.lat}
          labelLng={(d) => d.lng}
          labelText={(d) => d.name}
          labelSize={(d) => 0.5 + d.size}
          labelDotRadius={(d) => 0.5 + d.size}
          labelColor={() => "#ffffff"}
          labelResolution={2}
          arcsData={arcs}
          arcColor={() => "#39FF14"}
          arcDashLength={0.05}
          arcDashGap={0.05}
          arcDashAnimateTime={5000}
          ringsData={rings}
          ringColor={() => "#39FF14"}
          ringMaxRadius={3}
          pointAltitude={0.025}
          pointsData={points}
          pointRadius={1}
          pointColor={() => "#39FF14"}
          onPointClick={(coords) => {
            findLocation(coords);
          }}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        />
      </div>
    </div>
  );
}

export default App;

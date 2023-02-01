import "./App.css";
import Globe from "react-globe.gl";
import { useState } from "react";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

function App() {
  const [points, setPoints] = useState([]);
  const [arcs, setArcs] = useState([]);
  const [rings, setRings] = useState([]);
  const [myLocation, setMyLocation] = useState({});

  useEffect(() => {
    fetch(`https://ipapi.co/json/`).then((res) =>
      res.json().then((data) => {
        console.log(data);
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

  const getContentByCid = () => {
    fetch(
      "https://api.estuary.tech/public/by-cid/QmVrrF7DTnbqKvWR7P7ihJKp4N5fKmBX29m5CHbW9WLep9"
    )
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
            return allIpAddresses.flat();
          })
          .then((ipAddresses) => {
            let locationData = [];
            ipAddresses.forEach((ipAddress) => {
              locationData.push(getLocations(ipAddress));
            });
            Promise.all(locationData).then((allLocationData) => {
              console.log(allLocationData);
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
                });

                ringBuilder.push({
                  lat: location.latitude,
                  lng: location.longitude,
                });
              });

              pointsBuilder.push({
                lat: myLocation.latitude,
                lng: myLocation.longitude,
              });

              ringBuilder.push({
                lat: myLocation.latitude,
                lng: myLocation.longitude,
                maxR: 5,
                propagationSpeed: 1,
                repeatPeriod: 100,
              });

              setPoints(pointsBuilder);
              setArcs(arcBuilder);
              setRings(ringBuilder);
            });
          });
      });
  };

  return (
    <div className="parent">
      <div className="child panel">
        <h1 style={{ fontSize: "64px" }}>DEOXYS</h1>
        <p>See where your IPFS data is stored using Estuary's public API</p>
        <InputGroup style={{ borderColor: "#39ff14" }}>
          <Form.Control placeholder="Enter CID" />
          <Button
            onClick={getContentByCid}
            variant="outline-secondary"
            style={{ color: "#39ff14", borderColor: "#39ff14" }}
          >
            GO
          </Button>
        </InputGroup>
      </div>
      <div className="child">
        <Globe
          width={window.innerWidth / 2}
          arcsData={arcs}
          arcColor={() => "#39FF14"}
          arcDashLength={0.05}
          arcDashGap={0.05}
          arcDashAnimateTime={5000}
          ringsData={rings}
          ringColor={() => "#39FF14"}
          pointAltitude={0.025}
          pointsData={points}
          pointColor={() => "#39FF14"}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        />
      </div>
    </div>
  );
}

export default App;

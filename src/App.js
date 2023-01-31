import "./App.css";
import Globe from "react-globe.gl";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [arcs, setArcs] = useState([]);
  const [myLocation, setMyLocation] = useState({});

  useEffect(() => {
    fetch(`https://ipapi.co/json/`).then((res) =>
        res.json().then((data) => {
          console.log(data)
          setMyLocation(data)
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
              let arcBuilder = [];

              allLocationData.forEach((location) => {
                arcBuilder.push({
                  startLat: myLocation.latitude,
                  startLng: myLocation.longitude,
                  endLat: location.latitude,
                  endLng: location.longitude,
                  color: [
                    ["red", "white", "blue", "green"][
                      Math.round(Math.random() * 3)
                    ],
                    ["red", "white", "blue", "green"][
                      Math.round(Math.random() * 3)
                    ],
                  ],
                });
              });

              setArcs(arcBuilder)
            });
          });
      });
  };

  const N = 20;
  const arcsData = [...Array(N).keys()].map(() => ({
    startLat: (Math.random() - 0.5) * 10,
    startLng: (Math.random() - 0.5) * 36,
    endLat: (Math.random() - 0.5) * 18,
    endLng: (Math.random() - 0.5) * 36,
  }));

  return (
    <div>
      <button onClick={getContentByCid}>Get Content By CID</button>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        arcsData={arcs}
        arcColor={() => "#39FF14"}
        arcDashLength={0.5}
        arcDashGap={() => Math.random()}
        arcDashAnimateTime={() => 0.5 * 4000 + 500}
      ></Globe>
    </div>
  );
}

export default App;

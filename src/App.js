import "./App.css";
import Globe from "react-globe.gl";

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
          });
        });
    });
};

function App() {
  const N = 20;
  const arcsData = [...Array(N).keys()].map(() => ({
    startLat: (Math.random() - 0.5) * 180,
    startLng: (Math.random() - 0.5) * 360,
    endLat: (Math.random() - 0.5) * 180,
    endLng: (Math.random() - 0.5) * 360,
    color: [
      ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
      ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
    ],
  }));

  return (
    <div>
      <button onClick={getContentByCid}>Get Content By CID</button>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        arcsData={arcsData}
        arcColor={"color"}
        arcDashLength={() => Math.random()}
        arcDashGap={() => Math.random()}
        arcDashAnimateTime={() => Math.random() * 4000 + 500}
      ></Globe>
    </div>
  );
}

export default App;

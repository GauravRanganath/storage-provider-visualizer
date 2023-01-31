import { resolve } from "path-browserify";
import "./App.css";

function getLocations(ipAddress) {
  return new Promise((resolve, reject) => {
    fetch(`http://ip-api.com/json/${ipAddress}`).then((res) =>
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
  return (
    <div>
      <button onClick={getContentByCid}>Get Content By CID</button>
    </div>
  );
}

export default App;

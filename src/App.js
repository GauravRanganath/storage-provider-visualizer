import "./App.css";

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
        fetch(`https://api.estuary.tech/public/miners/stats/${minerId}`).then(
          async (res) => {
            let data = await res.json();
            data.chainInfo.addresses.forEach((ipAddress) => {
              ipAddresses.push(ipAddress.split("/")[2]);
            });
          }
        );
      });
      return ipAddresses;
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

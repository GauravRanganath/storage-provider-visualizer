import logo from "./logo.svg";
import "./App.css";

const getContentByCid = () => {
  fetch(
    "https://api.estuary.tech/public/by-cid/QmVrrF7DTnbqKvWR7P7ihJKp4N5fKmBX29m5CHbW9WLep9"
  )
    .then(async (res) => {
      let data = await res.json();
      return data
    })
    .then((data) => {
      data.forEach((e) => {
        e.deals.forEach((miners) => {
          console.log(miners.miner);
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

import logo from "./logo.svg";
import "./App.css";

const getContentByCid = () => {
  fetch(
    "https://api.estuary.tech/public/by-cid/QmVrrF7DTnbqKvWR7P7ihJKp4N5fKmBX29m5CHbW9WLep9"
  ).then((res) => console.log(res.data));
};

function App() {
  return (
    <div>
      <button onClick={getContentByCid}>Get Content By CID</button>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import Section from "./components/Section";
import Product from "./components/Products";
import abi from "./constants/TrustMart.json";
import addresses from "./constants/networkMapping.json";
import { ethers } from "ethers";
function App() {
  const [account, setAccount] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [provider, setProvider] = useState(null);
  const [trustMart, setTrustMart] = useState(null);
  const [shoes, setShoes] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [toys, setToys] = useState(null);
  const [electronics, setElectronics] = useState(null);
  const [item, setItem] = useState(null);
  const togglePop = async (item) => {
    setItem(item);
    toggle ? setToggle(false) : setToggle(true);
  };
  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    let network = await provider.getNetwork();
    network = network.chainId;
    const address = addresses[network.toString()]["TrustMart"][0];
    const contract = new ethers.Contract(address, abi, provider);
    setTrustMart(contract);
    const numItems = await contract.numberOfItems();
    const items = [];
    for (let i = 0; i < numItems; i++) {
      const item = await contract.items(i + 1);
      items.push(item);
    }
    const electronics = items.filter((item) => item.category == "electronics");
    const clothing = items.filter((item) => item.category == "clothing");
    const toys = items.filter((item) => item.category == "toys");
    const shoes = items.filter((item) => item.category == "footware");
    setClothing(clothing);
    setElectronics(electronics);
    setToys(toys);
    setShoes(shoes);
    console.log(shoes)
  };
  useEffect(() => {
    loadBlockchainData();
  }, []);
  return (
    <div className="App">
      <Navigation account={account} setAccount={setAccount} />
      <h2>Best Seller Products</h2>
      {electronics && clothing && toys && shoes && (
        <>
          <Section title={"Shoes"} items={shoes} togglePop={togglePop} />
          <Section
            title={"Electronics & Gadgets"}
            items={electronics}
            togglePop={togglePop}
          />
          <Section
            title={"Clothing & Jewelry"}
            items={clothing}
            togglePop={togglePop}
          />
          <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
        </>
      )}
      {toggle && (
        <Product
          item={item}
          provider={provider}
          account={account}
          trustMart={trustMart}
          togglePop={togglePop}
        />
      )}
    </div>
  );
}

export default App;

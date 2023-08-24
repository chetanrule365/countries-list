import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [countriesList, setCountriesList] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isAllFetchings, setIsAllFetching] = useState(false);

  const getCountriesData = async () => {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name"
    );
    const data = await response.json();
    setCountriesList(data);
  };

  const getCountryDetails = async (name, i) => {
    const response = await fetch(`https://restcountries.com/v2/name/${name}`);
    const details = await response.json();
    const newState = structuredClone(countries);
    newState[i] = { ...newState[i], value: JSON.stringify(details) };
    setCountries(newState);
  };
  const fetchBatchCountries = async (batchCountries, requestIndex) => {
    for (let i = 0; i < batchCountries.length; i += 1) {
      const response = await fetch(
        `https://restcountries.com/v2/name/${batchCountries[i].name}`
      );
      const details = await response.json();
      setCountries((state) => {
        const newState = structuredClone(state);
        newState[requestIndex + i] = {
          ...newState[requestIndex + i],
          value: JSON.stringify(details),
        };
        if (requestIndex + i + 1 < countries.length)
          newState[requestIndex + i + 1] = {
            ...newState[requestIndex + i + 1],
            value: "loading...",
          };
        if (requestIndex + i + 2 < countries.length)
          newState[requestIndex + i + 2] = {
            ...newState[requestIndex + i + 2],
            value: "loading...",
          };
        if (requestIndex + i + 3 < countries.length)
          newState[requestIndex + i + 3] = {
            ...newState[requestIndex + i + 3],
            value: "loading...",
          };
        return newState;
      });
    }
  };

  const fetchAllCountries = async () => {
    setIsAllFetching(true);
    for (let i = 0; i < Math.ceil(countries.length / 3); i++) {
      const batchCountries = countries.slice(i * 3, i * 3 + 3);
      await fetchBatchCountries(batchCountries, i * 3);
    }
  };

  useEffect(() => {
    getCountriesData();
  }, []);

  useEffect(() => {
    const countriesNames = countriesList.map(({ name: { common } }) => ({
      name: common,
      value: "",
    }));
    setCountries(countriesNames);
  }, [countriesList]);

  return (
    <div className="App">
      <button onClick={fetchAllCountries}>Fetch all countries</button>
      <table>
        <tbody>
          {countries?.map(({ name, value }, i) => (
            <tr>
              <td className="name" onClick={() => getCountryDetails(name, i)}>
                {name}
              </td>
              <td>{value || (isAllFetchings && "In queue")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

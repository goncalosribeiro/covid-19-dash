import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./App.css";
import InfoBox from "./Components/InfoBox";
import LineGraph from "./Components/LineGraph";
import Map from "./Components/Map";
import Table from "./Components/Table";
import { sortData } from "./Components/util";
import 'leaflet/dist/leaflet.css'

export default function App() {
  const [countriesList, setCountriesList] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 25, lng: 18 });
  const [mapZoom, setMapZomm] = useState(2)

  useEffect(() => {
    const getCoutriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));

          setCountriesList(countries);
          const sortedData = sortData(data);
          setTableData(sortedData);
        });
    };
    getCoutriesData(countriesList);
  }, []);

  useEffect(() => {
    const fetchCoutryInfo = async () => {
      fetch("https://disease.sh/v3/covid-19/all")
        .then((response) => response.json())
        .then((data) => {
          setCountryInfo(data);
        });
    }
    fetchCoutryInfo();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter({ lat: data.countryInfo.lat, lng: data.countryInfo.long })
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app_header">
          <h1>Covid 19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countriesList.map((country, i) => (
                <MenuItem value={country.value} key={i}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            title="CoronaVirus cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        <Map center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h2>Live Cases by Country</h2>
          <Table countries={tableData} />
          <LineGraph dataType='cases' />
        </CardContent>
        Imasd
      </Card>
    </div>
  );
}

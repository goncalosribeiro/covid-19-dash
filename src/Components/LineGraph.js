import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

export default function LineGraph({ countries }) {
  const [data, setData] = useState([]);

  const buildChartData = (data) => {
    const chartData = [];
    let lastControl = 0;
    for (const k in data.cases) {
      const newValue = {
        x: k,
        y: data.cases[k] - lastControl
      };
      lastControl = data.cases[k];
      chartData.push(newValue);
    }
    return chartData;
  };

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=15")
      .then((res) => res.json())
      .then((data) => {
        setData(buildChartData(data));
      });
  }, []);

  return (
    <div className="graph">
      {/* <Line data={data} options /> */}
      {console.log(data)}
    </div>
  );
}

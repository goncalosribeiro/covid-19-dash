import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import numeral from 'numeral'

export default function LineGraph({ dataType }) {
  const [data, setData] = useState([]);

  const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  }

  const buildChartData = (data, dataType) => {
    const chartData = [];
    let lastControl;
    for (const k in data.cases) {
      if (lastControl) {
        const newValue = {
          x: k,
          y: data[dataType][k] - lastControl
        };
        chartData.push(newValue);
      }
      lastControl = data[dataType][k];
    }
    return chartData;
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((res) => res.json())
        .then((data) => {
          let chartData = buildChartData(data, dataType);
          setData(chartData);
        });
    }
    fetchData();
  }, []);

  return (
    <div className="graph">
      {data?.length > 0 && (
        <Line data={{
          datasets: [
            {
              backgroundColor: "rgba(204, 16, 52, 0.5)",
              borderColor: "#CC1034",
              data: data,
            },
          ],
        }} options={options} />
      )}
    </div>
  );
}

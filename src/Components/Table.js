import React from "react";
import "./Table.css";

export default function Table({ countries }) {
  return (
    <div className="table">
      {countries.map(({ country, cases, countryInfo }) => (
        <tr key={country}>
          <td>
            <img src={countryInfo.flag} alt="Country flag" />
          </td>
          <td>{country}</td>
          <td>
            <strong>{cases}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

import './App.css';
import { PieChart } from 'react-dc-js';
import crossfilter from 'crossfilter2';
import { useState, useEffect } from 'react';

function App() {
  const [cx, setCx] = useState(null);

  (async () => {
    console.log("[in async]");

    let baseUrl = "https://ausl4ri6y1.execute-api.us-east-1.amazonaws.com/test-tl/backlogs/32/epics";
    let response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    });
    let data = await response.json();
    console.log("got data:");
    console.log(data);

  //   const data = await d3.csv(csv)
  //   const dateFormatSpecifier = '%m/%d/%Y'
  //   const dateFormatParser = d3.timeParse(dateFormatSpecifier)
  //   data.forEach(d => {
  //     d.dd = dateFormatParser(d.date)
  //     d.month = d3.timeMonth(d.dd) // pre-calculate month for better performance
  //     d.close = +d.close // coerce to number
  //     d.open = +d.open
  //   })
  //   const cx = crossfilter(data)
  //   setCx(cx)
  })()

  return (
    <div className="App">
      Here is some data.
    </div>
  );
}

export default App;

import './App.css';
import { PieChart } from 'react-dc-js';
import crossfilter from 'crossfilter2';
import { useState, useEffect } from 'react';

function App() {
  const [backlogEpicData, setBacklogEpicData] = useState(null);

  useEffect( () => {
    if (!backlogEpicData) {
      getBacklogEpicData();
    }
  }, [])

  const getBacklogEpicData = async () => {
    console.log("[getBacklogEpicData]");
    let baseUrl = "https://ausl4ri6y1.execute-api.us-east-1.amazonaws.com/test-tl/backlogs/32/epics";
    let response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      },
    });
    setBacklogEpicData(await response.json());
  }

  // console.log("[after async]");
  // console.log(backlogEpicData);
  var cx = crossfilter(backlogEpicData.epics);
  // console.log("ndx:");
  // console.log(ndx)
  var epicTotalPointsDimension = cx.dimension( d => d.totalPoints)
  console.log("epicTotalPointsDimension = ", epicTotalPointsDimension);

  return (
    <div className="App">
      <PieChart dimension={epicTotalPointsDimension} group={epicTotalPointsDimension.group()} />
    </div>
  );
}

export default App;

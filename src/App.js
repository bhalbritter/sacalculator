import OverviewFlow from "./OverviewFlow";
import React from "react";


const App = () => {

    const callback = (nodeid) => {
        console.log(nodeid);
        console.log("wow");
    }

    return (
        <div>
            <p>Das ist ein Test</p>
            <div>
                <OverviewFlow parentCallback={callback} />
            </div>
        </div>
    );

}

export default App

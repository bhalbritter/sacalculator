import React, { memo, useState} from 'react'

import {Handle} from "react-flow-renderer";
import './SmelterNode.css';
import Smelter from '../images/Smelter.png'

export default memo(({ data }) => {

    return (
        <div id="outsideDiv" >
            <Handle
                type="target"
                position="top"
                style={{ background: '#555'}}
                onConnect={(params) => console.log('handle onConnect', params)}
            />

            <div className="subContainer">
                <label>Current Production</label>
                <strong>{data.output.amount}</strong>
            </div>
            <div className="subContainer">
                Smelter
            </div>
            <img  src={Smelter} alt="Smelter Image"/>

            <div className="subContainer">
                <label>Current Input</label>
                <strong>{data.input.currAmount}</strong>
            </div>
            <Handle
                type="source"
                position="bottom"
                style={{ background: '#555'}}
                onConnect={(params) => console.log('handle onConnect', params)}
            />

        </div>
    );
});

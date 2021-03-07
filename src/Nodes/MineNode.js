import React, { memo, useState} from 'react'

import {Handle} from "react-flow-renderer";
import './MineNode.css';
import MinerMK1 from '../images/Miner_Mk.1.png'
import MinerMK2 from '../images/Miner_Mk.2.png'
import MinerMK3 from '../images/Miner_Mk.3.png'

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
                Miner
            </div>
            { data.minerMark ==  "Mk1" ? <img  src={MinerMK1} alt="Miner Image"/> :
                data.minerMark ==  "Mk2" ? <img  src={MinerMK2} alt="Miner Image"/> :
                                                <img  src={MinerMK3} alt="Miner Image"/>
           }

            <label className="subContainer">{data.minerMark}</label>
            <div className="subContainer">
                <label>Current Production</label>
                <strong>{data.output.amount}</strong>
            </div>

        </div>
    );
});

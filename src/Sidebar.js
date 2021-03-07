import React, {useState} from 'react';
import './Sidebar.css'
import {updateEdge} from "react-flow-renderer";
import oreTypes from './Data/MineData'
import recipes from "./Data/SmelterData";
import constructorRecipes from "./Data/ConstructorData"


export default (props) => {

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    function handleChange(event){
        console.log(event.target);
        props.onChange(event.target);
        //props.onChange(event.target.value);
    }

    let conditionalView;

    switch (props.props.nodeType){
        case 'constructorNode':
            conditionalView =  <div>
                <div>
                    <label>current Production: {props.props.output}</label>
                    <input
                        name="outputValue"
                        type="text"
                        value={props.props.outputValue}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        name="inputValue"
                        type="text"
                        value={props.props.inputValue}
                        onChange={handleChange}
                    />
                </div>
                <div className="subContainer">
                    <label>input Type: {props.props.input} </label>
                    <select id="outputs" name="outputValue" className="nodrag" value={props.props.output} onChange={handleChange}>
                        {constructorRecipes.map((e, key) => {
                            return <option key = {key} value={e.output.value}>{e.output.name}</option>
                        })
                        }
                    </select>
                </div>
                <div className="subContainer">
                    <label>Required input: {props.props.inputValue} </label>
                </div>
                <div>
                </div>
            </div>
            break;
        case 'mineNode':
        conditionalView =             <div>
            <label>Aktueller Knoten Wert</label>

            <input
                name="currentValue"
                type="text"
                value={props.props.name}
                onChange={handleChange}
            />
            <div className="subContainer">
                <label>Miner Mark: </label>
                <select id="Miners" name="MinerMark" className="nodrag" value={props.props.minerMark} onChange={handleChange}>
                    <option value="Mk1">Mk. 1</option>
                    <option value="Mk2">Mk. 2</option>
                    <option value="Mk3">Mk. 3</option>
                </select>
            </div>
            <div className="subContainer">
                <label>Ore Type: </label>
                <select id="ores" name="OreTypes" className="nodrag" value={props.props.oreType} onChange={handleChange}>
                    {oreTypes.map((e, key) => {
                        return <option key = {key} value={e.value}>{e.name}</option>
                    })}
                </select>
            </div>
            <div className="subContainer">
                <label>Quality: </label>
                <select id="quality" name="Quality" className="nodrag" value={props.props.quality} onChange={handleChange}>
                    <option value="impure">Impure</option>
                    <option value="normal">Normal</option>
                    <option value="pure">Pure</option>
                </select>

            </div>
        </div>
            break;
        case 'smelterNode':
            conditionalView = <div>
                <div>
                    <label>current Production: {props.props.output}</label>
                    <input
                        name="outputValue"
                        type="text"
                        value={props.props.outputValue}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        name="inputValue"
                        type="text"
                        value={props.props.inputValue}
                        onChange={handleChange}
                    />
                </div>
                <div className="subContainer">
                    <label>input Type: {props.props.input} </label>
                    <select id="outputs" name="outputValue" className="nodrag" value={props.props.output} onChange={handleChange}>
                        {recipes.map((e, key) => {
                            return <option key = {key} value={e.output.value}>{e.output.name}</option>
                        })
                        }
                    </select>
                </div>
                <div className="subContainer">
                    <label>Required input: {props.props.inputValue} </label>
                </div>
                <div>
            </div>
            </div>
            break;
        default:
            conditionalView = <div>Choose a Node</div>
    }


    return (
        <aside>
            <div>
                <div className="description">Sidebar</div>
                <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'constructorNode')} draggable>
                    Constructor
                </div>
                <div className="dndnode" onDragStart={(event) => onDragStart(event, 'smelterNode')} draggable>
                    Smelter
                </div>
                <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'mineNode')} draggable>
                    Mine
                </div>
            </div>

            <div>{conditionalView}</div>
        </aside>
    );
};

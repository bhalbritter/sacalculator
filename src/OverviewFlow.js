import React, { useEffect,useState, useRef, useCallback } from 'react';
import './OverviewFlow.css'
import recipes from "./Data/SmelterData";
import constructorRecipes from "./Data/ConstructorData"
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    removeElements,
    Controls,
    isNode,
    getIncomers,
    getOutgoers,
} from 'react-flow-renderer';
import dagre from 'dagre'
import Sidebar from './Sidebar';
import MineNode from "./Nodes/MineNode";
import SmelterNode from "./Nodes/SmelterNode";
import ConstructorNode from "./Nodes/ConstructorNode";
const initialElements = [
    {
        id: '3',
        type: 'mineNode',
        data: { output: {amount: 30, name: 'iron'}, minerMark: 'MK. 1', quality: 'normal' },
        position: { x: 1000, y: 5 },
    },

];

const nodeTypes = {
    mineNode: MineNode,
    smelterNode: SmelterNode,
    constructorNode: ConstructorNode
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

let id = 0;
const getId = () => `dndnode_${id++}`;
const DnDFlow = ({parentCallback}) => {
    let myparentnodes = []; //TODO Unsauber eventuell mit state lösen, aber macht evt probleme, da setState leider asyncron
    const reactFlowWrapper = useRef(null);
    const [output, setOutput] = useState("");
    const [input, setInput] = useState("");
    const [currInput, setCurrentInput] = useState("");
    const [inputType, setInputType] = useState("");
    const [outputType, setOutputType] = useState("");
    const [minerMark, setMinerMark] = useState("MK. 1 State");
    const [oreType, setOreType] = useState("iron");
    const [quality, setQuality] = useState("normal");
    const [currentNodeId, setCurrentNode] = useState("1");
    const [currentNodeType, setCurrentNodeType] = useState("noType");
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [elements, setElements] = useState(initialElements);
    const [nodeProduction, setNodeProduction] = useState('100');
    const onConnect = (params) => {
        setElements((els) => addEdge(params, els))};
    const onElementsRemove = (elementsToRemove) =>
        setElements((els) => removeElements(elementsToRemove, els));
    const onLoad = (_reactFlowInstance) =>
        setReactFlowInstance(_reactFlowInstance);
    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };
    const onSelection = (event, node) =>{
        //parentCallback(node.id);

        //unterscheiden zwischen den verschienden node Typen.

        console.log(node.data);
        setCurrentNode(node.id);
        setCurrentNodeType(node.type);
        if(node.type=='mineNode'){
            setOutput(node.data.output.amount);
            setMinerMark(node.data.minerMark);
            setOreType(node.data.output.name);
            setQuality(node.data.quality);
        } else if(node.type == 'smelterNode' || node.type == 'constructorNode'){
            setInput(node.data.input.amount);
            setCurrentInput(node.data.input.currAmount);
            setInputType(node.data.input.name);
            setOutput(node.data.output.amount);
            setOutputType(node.data.output.name);
        }



    }

    function handleChange(newName){

        let currentNode = findNodeById(currentNodeId);
        let newValue = currentNode.data.output.amount;
        if(currentNode.type == "mineNode"){
            if(newName.name == "MinerMark"){
                console.log("MinerMark update")
                setMinerMark(newName.value);
                console.log(newName.value)
                switch (newName.value){
                    case "Mk1":
                        newValue = 30;
                        break;
                    case "Mk2":
                        newValue = 60;
                        break;
                    case "Mk3":
                        newValue = 120;
                }
                switch (currentNode.data.quality){
                    case "pure":
                        newValue *= 2;
                        break;
                    case "impure":
                        newValue *= 0.5;
                        break;
                }
                console.log(newValue);
            }else if(newName.name == "outputValue") {
                setOutput(newName.value);
            }else if(newName.name == "OreTypes"){
                setOreType(newName.value);
            }else if(newName.name == "Quality") {
                switch (currentNode.data.minerMark) {
                    case "Mk1":
                        newValue = 30;
                        break;
                    case "Mk2":
                        newValue = 60;
                        break;
                    case "Mk3":
                        newValue = 120;
                }
                switch (newName.value) {
                    case "pure":
                        newValue *= 2;
                        break;
                    case "impure":
                        newValue *= 0.5;
                        break;
                }
                setQuality(newName.value);
            }

                setNodeProduction(newValue);
        }else if(currentNode.type == "smelterNode" || currentNode.type == "constructorNode"){
                 if(newName.name == "outputValue"){
                     let result;
                     if(currentNode.type == "smelterNode") {
                         result = recipes.filter(word => word.output.value == newName.value); // find the input value vor the selected output value
                     }else if(currentNode.type == "constructorNode"){
                         result = constructorRecipes.filter(word => word.output.value == newName.value); // find the input value vor the selected output value
                     }
                     if(result.length > 0){
                         setOutput(result[0].output.amount);
                         setInput(result[0].input.amount);
                         setCurrentInput(result[0].input.currAmount);
                         setInputType(result[0].input.value);
                         setOutputType(result[0].output.value);
                     }
                }
        }
        //berrechne value Miene
    }

    function findSourceNodes(currentId, elements){
        myparentnodes = [];
        findSourceNode(currentId, elements)
    }

    function findSourceNode(currentId, elements){

        let currnode = findNodeById(currentId);
        let parentNodes = getIncomers(currnode, elements);

        if (parentNodes.length === 0){ // Wenn keine Parentknoten existieren, dann gib den aktuellen oberknoten zurück
            myparentnodes.push(currentId);
        }else{      // Sonst für Jeden Oberknoten wieder die oberknoten suchen
            parentNodes.forEach(obj => {
                findSourceNode(obj.id, elements);
            })
        }
    }
    //rekursiveMethode zum berrechnen der neuen Werte;

    let pelements = [];

    function updateNodeValues(elements){
        pelements = [...elements]; // elemente kopieren
        findSourceNodes(currentNodeId, elements);
        updateFromSourceNodes();
        return pelements;
    }

    function updateFromSourceNodes(){
        myparentnodes.forEach( (el) => {
            updateAllChildNodes(el);
        });
    }

    function updateAllChildNodes(CurrParentNodeId){
        let currNode = findNodeById(CurrParentNodeId);
        let childElements = getOutgoers(currNode, pelements);
        console.log("aktueller Knoten: " + CurrParentNodeId + " hat " + childElements.length + " kinder");
        let value
        if(currNode.type == 'mineNode') {
            value = currNode.data.output.amount;
        }else{
            value = currNode.data.input.amount;
        }
        let currValue = value;

        //Jedes kindelement muss eventuell seinen Output An alle Kindelemente verteilen
        childElements.forEach(obj => {
            let parentElements = getIncomers(obj, pelements);
            currValue = currValue  - (obj.data.output.amount/parentElements.length);
        });

        setElements((els) =>
            els.map((el) => {
                if (el.id === CurrParentNodeId) {
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    if(currNode.type == 'mineNode') {
                        el.data = {
                            ...el.data,
                            output: {amount: currValue, name: el.data.output.name}
                        };
                    }else{
                        el.data = {
                            ...el.data,
                            input: {amount: value, name: el.data.input.name, currAmount: currValue}
                        };
                    }
                }
                return el;
            })
        );

        childElements.forEach(obj => {
            updateAllChildNodes(obj.id, pelements);
        });
    }


    function findNodeById(id){
       let node = "";
        elements.forEach((el) => {
            if (isNode(el)) {
                if(el.id === id){
                    node = el;
                }
            }
        });
       return node;
    }

    const onDrop = (event) => {
        event.preventDefault();
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');
        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        console.log(type);
        let newNode;
        if(type == 'smelterNode') {
            newNode = {
                id: getId(),
                type,
                position,
                data: {input: {name: 'Iron Ore', amount: 30, currAmount: 30}, output: {name: 'Iron Ingot', amount: 30}}
            };
        }else if(type == 'mineNode'){
            newNode = {
                id: getId(),
                type,
                position,
                data: {output: {name: 'iron', amount: 30 }, minerMark: "MK. 1", quality: 'normal'},
            };
        }else if(type == 'constructorNode'){
            newNode = {
                id: getId(),
                type,
                position,
                data: {input: {name: 'Iron Ingot', amount: 30, currAmount: 30}, output: {name: 'Iron Plate', amount: 20}}
            };
        }
        setElements((es) => es.concat(newNode));
        //Add child nodes

    };

    const getLayoutedElements = (elements, direction = 'TB') => {
        const isHorizontal = direction === 'LR';
        dagreGraph.setGraph({ rankdir: direction });
        elements.forEach((el) => {
            if (isNode(el)) {
                dagreGraph.setNode(el.id, { width: 150, height: 50 });
            } else {
                dagreGraph.setEdge(el.source, el.target);
            }
        });
        dagre.layout(dagreGraph);
        return elements.map((el) => {
            if (isNode(el)) {
                const nodeWithPosition = dagreGraph.node(el.id);
                el.targetPosition = isHorizontal ? 'left' : 'top';
                el.sourcePosition = isHorizontal ? 'right' : 'bottom';
                // unfortunately we need this little hack to pass a slighltiy different position
                // in order to notify react flow about the change
                el.position = {
                    x: nodeWithPosition.x + Math.random() / 1000,
                    y: nodeWithPosition.y,
                };
            }
            return el;
        });
    };
    const layoutedElements = getLayoutedElements(initialElements);

    const onLayout = useCallback(
        (direction) => {
            const layoutedElements = getLayoutedElements(elements, direction);
            setElements(layoutedElements);
        },
        [elements]
    );

    const onCalculate = useCallback(
        () =>
        {
            const updatedElements = updateNodeValues(elements);
            setElements(updatedElements);
        })

    const fetchElements = async () => {
        const fetchedElements = await updateNodeValues(elements);
        setElements(fetchedElements);
    }


    useEffect(() => {
        setElements((els) =>
            els.map((el) => {
                if (el.id === currentNodeId) {
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    if (el.type == 'mineNode') {
                        el.data = {
                            ...el.data,
                            minerMark: minerMark,
                            output: {amount: nodeProduction, name: oreType},
                            quality: quality,
                        };
                    } else {
                        el.data = {
                            ...el.data,
                            input:{name: inputType, amount: input, currAmount: currInput},
                            output:{name: outputType, amount: output},
                        }
                    }

                }
                return el;
            })
        );
        //Hier wir der Graph neu durchgerechnet wenn es soweit ist.
        console.log("UpdateNodes");


    }, [nodeProduction,setNodeProduction, outputType,setOutputType]);


    return (
        <div className="dndflow" >
            <ReactFlowProvider>
                <div  className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow style={{width: "800px",  height: "800px"}}
                        elements={elements}
                        onConnect={onConnect}
                        onElementsRemove={onElementsRemove}
                        onElementClick={onSelection}
                        onLoad={onLoad}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        nodeTypes={nodeTypes}
                    >
                        <Controls />
                    </ReactFlow>
                </div>
                <Sidebar props={{
                    inputValue: input,
                    input: inputType,
                    currInput: currInput,
                    outputValue: output,
                    output: outputType,
                    minerMark: minerMark,
                    oreType: oreType,
                    quality: quality,
                    nodeType: currentNodeType
                }}  onChange={handleChange}/>
                <button onClick={() => onLayout('TB')}>vertical layout</button>
                <button onClick={() => onCalculate()}>Calc</button>
            </ReactFlowProvider>
        </div>
    );
};
export default DnDFlow;

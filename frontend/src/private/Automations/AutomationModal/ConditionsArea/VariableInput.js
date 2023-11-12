import React, {useState, useEffect, useRef} from "react";
import "../../Automations.css";

/**
 * props:
 * - selectedIndex
 * - indexes
 * - onAddClick
 */
function VariableInput(props) {
    const variableRef = useRef("");
    const [indexes, setIndexes] = useState({});
    const [index, setIndex] = useState({});
    const [operator, setOperator] = useState("==");
    const [variable, setVariable] = useState("");
  
    useEffect(() => {
      setIndex(props.selectedIndex);
      setVariable(props.selectedIndex.example);
      variableRef.current.value = "";
    }, [props.selectedIndex]);
  
    useEffect(() => {
      setIndexes(props.indexes);
      variableRef.current.value = "";
    }, [props.indexes]);
  
    function getOptionText(symbol, variable) {
      return variable === "WALLET" ? `${symbol}:${variable}` : variable;
    }
  
    function getExpressionText() {
      const value =
        typeof index.example === "string" ? `'${variable}'` : variable;
      return `${index.symbol}:${index.variable} ${operator.replace(
        "==",
        "="
      )} ${value}`;
    }
  
    function onAddClick(event) {
      const value =
        typeof index.example === "string" ? `'${variable}'` : variable;
      const condition = {
        eval: `${index.eval}${operator}${value}`,
        text: getExpressionText(),
      };
      props.onAddClick({ target: { id: "condition", value: condition } });
    }
  
    function onOperatorChange(event) {
      setOperator(event.target.value);
    }
  
    function onVariableChange(event) {
      const value = event.target.value;
      const index = props.indexes.find((k) => value.endsWith(k.variable));
      //if (index && !value.endsWith("WALLET")) setVariable(index.eval);
      if (index && !value.endsWith("WALLET")) {
        const split = value.split(".");
        const prop = split.lenght > 0 ? value.replace(split[0], "") : "";
        setVariable(`MEMORY['${index.sympbol}:${split[0]}']${prop}`);
      } else setVariable(value);
    }
  
    return (
      <div className="input-group input-group-merge mb-2">
        <span className="input-group-text bg-secondary">É</span>
        <select id="operator" className="form-select" onChange={onOperatorChange}>
          {typeof index.example === "number" ? (
            <React.Fragment>
              <option value=">">maior que</option>
              <option value=">=">maior ou igual que</option>
              <option value="<">menor que</option>
              <option value="<=">menor ou igual que</option>
            </React.Fragment>
          ) : (
            <React.Fragment></React.Fragment>
          )}
          <option value="==">igual</option>
          <option value="!=">diferente</option>
        </select>
        <input
          ref={variableRef}
          id="variable"
          list="variables"
          type="text"
          className="form-select"
          onChange={onVariableChange}
          placeholder={`${index.example}`}
        />
        <datalist id="variables">
          {indexes && Array.isArray(indexes) ? (
            indexes
              .filter((i) => i.eval !== index.eval)
              .map((item) => (
                <option key={`${item.symbol}:${item.variable}`}>
                  {getOptionText(item.symbol, item.variable)}
                </option>
              ))
          ) : (
            <option value="">SEM INDEXES</option>
          )}
        </datalist>
        <button type="button" className="btn btn-secondary" onClick={onAddClick}>
          <svg
            className="icon icon-xs"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    );
  }
  
  export default VariableInput;
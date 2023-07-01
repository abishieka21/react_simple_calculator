import React, { useReducer } from "react";
import Button from "./Components/Button";
import "./App.css";

function reduce(state, { value }) {
  switch (value) {
    case "AC":
      return {};
    case "DEL":
      if (state.overWrite) {
        return {
          ...state,
          overWrite: false,
          currOperand: null,
        };
      }
      if (!state.currOperand) return state;
      if (state.currOperand.length == 1) {
        return {
          ...state,
          currOperand: null,
        };
      }
      return {
        ...state,
        currOperand: state.currOperand.slice(0, -1),
      };
    case "=":
      if (
        state.operator == null ||
        state.prevOperand == null ||
        state.currOperand == null
      )
        return state;
      return {
        ...state,
        operator: null,
        prevOperand: null,
        currOperand: evaluate(state),
        overWrite: true,
      };
    default:
      if ("+-*/".includes(value)) {
        if (!state.prevOperand && !state.currOperand) return state;
        if (!state.currOperand) {
          return {
            ...state,
            operator: value,
          };
        }
        if (!state.prevOperand) {
          return {
            ...state,
            prevOperand: state.currOperand,
            operator: value,
            currOperand: null,
          };
        } else {
          return {
            ...state,
            prevOperand: evaluate(state),
            currOperand: null,
            operator: value,
          };
        }
      } else {
        if (state.overWrite) {
          return {
            ...state,
            currOperand: value,
            overWrite: false,
          };
        }
        if (value == "0" && state.currOperand == "0") return state;
        if (value == "." && state.currOperand?.includes(".")) return state;
        return {
          ...state,
          currOperand: `${state.currOperand || ""}${String(value)}`,
        };
      }
  }
}

function evaluate(state) {
  const { currOperand, prevOperand, operator } = state;
  let curr = parseFloat(currOperand);
  let prev = parseFloat(prevOperand);
  switch (operator) {
    case "+":
      return String(prev + curr);
    case "-":
      return String(prev - curr);
    case "*":
      return String(prev * curr);
    case "/":
      return String(prev / curr);
    default:
      return state;
  }
}

const Int_formatter = new Intl.NumberFormat("en-IN", {
  maximumFranctionDigits: 0,
});

function formatNumber(num) {
  if (num == null) return;
  const [number, decimal] = num.toString().split(".");
  if (decimal == null) return Int_formatter.format(number);
  return `${Int_formatter.format(number)}.${decimal}`;
}

function App() {
  const [{ currOperand, prevOperand, operator }, dispatch] = useReducer(
    reduce,
    {}
  );

  let values = [
    "AC",
    "DEL",
    "/",
    1,
    2,
    3,
    "*",
    4,
    5,
    6,
    "-",
    7,
    8,
    9,
    "+",
    ".",
    0,
    "=",
  ];
  const Buttons = values.map((value) => (
    <Button key={value} value={value} dispatch={dispatch} />
  ));

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="prev-operand">
          {formatNumber(prevOperand)} {operator}
        </div>
        <div className="curr-operand">{formatNumber(currOperand)}</div>
      </div>
      {Buttons}
    </div>
  );
}

export default App;

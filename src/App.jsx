import "./App.css";
import { useReducer } from "react";
import DigitButton from "./Components/DigitButton";
import OperationButton from "./Components/OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose_operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  RESULT: "result",
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

const initialState = {
  currentOperand: "",
  previousOperand: null,
  operation: null,
  overwrite: false,
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (!state.currentOperand)
        return { ...state, currentOperand: payload.digit };

      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CLEAR:
      return initialState;

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null)
        return state;

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: result(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.RESULT:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      )
        return state;

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: result(state),
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return { ...state, overwrite: false, currentOperand: null };
      }

      if (state.currentOperand == null) return state;

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
  }
}

function result({ currentOperand, previousOperand, operation }) {
  const previousNumber = parseFloat(previousOperand);
  const currentNumber = parseFloat(currentOperand);
  if (isNaN(previousNumber) || isNaN(currentNumber)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = previousNumber + currentNumber;
      break;
    case "-":
      computation = previousNumber - currentNumber;
      break;
    case "*":
      computation = previousNumber * currentNumber;
      break;
    case "÷":
      computation = previousNumber / currentNumber;
      break;
  }

  return computation.toString();
}

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispacth] = useReducer(
    reducer,
    initialState
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispacth({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispacth({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton dispatch={dispacth} operation={"÷"} />
      <DigitButton dispatch={dispacth} digit={"1"} />
      <DigitButton dispatch={dispacth} digit={"2"} />
      <DigitButton dispatch={dispacth} digit={"3"} />
      <OperationButton dispatch={dispacth} operation={"*"} />
      <DigitButton dispatch={dispacth} digit={"4"} />
      <DigitButton dispatch={dispacth} digit={"5"} />
      <DigitButton dispatch={dispacth} digit={"6"} />
      <OperationButton dispatch={dispacth} operation={"+"} />
      <DigitButton dispatch={dispacth} digit={"7"} />
      <DigitButton dispatch={dispacth} digit={"8"} />
      <DigitButton dispatch={dispacth} digit={"9"} />
      <OperationButton dispatch={dispacth} operation={"-"} />
      <DigitButton dispatch={dispacth} digit={"."} />
      <DigitButton dispatch={dispacth} digit={"0"} />
      <button
        className="span-two"
        onClick={() => dispacth({ type: ACTIONS.RESULT })}
      >
        =
      </button>
    </div>
  );
}

export default App;

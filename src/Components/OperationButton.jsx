import { ACTIONS } from "../App";
import PropTypes from "prop-types";

export default function OperationButton({ dispatch, operation }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
}

OperationButton.propTypes = {
  operation: PropTypes.string,
  dispatch: PropTypes.func,
};

import { useState } from 'react';
import { OPERATIONS, UNIT_DISPLAY_NAMES } from '../../utils/constants';

const OperationForm = ({ operation, measurementType, onSubmit, loading }) => {
  const [value1, setValue1] = useState('');
  const [unit1, setUnit1] = useState(measurementType.units[0]);
  const [value2, setValue2] = useState('');
  const [unit2, setUnit2] = useState(measurementType.units[0]);
  const [targetUnit, setTargetUnit] = useState(measurementType.units[0]);

  const requiresTwoInputs = OPERATIONS[operation].requiresTwoInputs;
  const isConvert = operation === 'CONVERT';
  const canSelectTargetUnit = operation === 'ADD' || operation === 'SUBTRACT';

  const handleSubmit = (e) => {
    e.preventDefault();

    const quantity1 = {
      value: parseFloat(value1),
      unit: unit1,
      measurementType: `${measurementType.id.charAt(0)}${measurementType.id.slice(1).toLowerCase()}Unit`
    };

    let quantity2 = null;
    if (requiresTwoInputs) {
      quantity2 = {
        value: parseFloat(value2),
        unit: unit2,
        measurementType: `${measurementType.id.charAt(0)}${measurementType.id.slice(1).toLowerCase()}Unit`
      };
    }

    const data = {
      quantity1,
      quantity2,
      targetUnit: isConvert ? targetUnit : (canSelectTargetUnit ? targetUnit : null)
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="operation-form">
      <div className="form-row">
        <div className="form-field">
          <label>Value {isConvert ? '' : '1'}</label>
          <input
            type="number"
            step="any"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            placeholder="Enter value"
            required
          />
        </div>
        <div className="form-field">
          <label>Unit {isConvert ? '' : '1'}</label>
          <select value={unit1} onChange={(e) => setUnit1(e.target.value)} required>
            {measurementType.units.map(unit => (
              <option key={unit} value={unit}>
                {UNIT_DISPLAY_NAMES[unit]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {requiresTwoInputs && (
        <div className="form-row">
          <div className="form-field">
            <label>Value 2</label>
            <input
              type="number"
              step="any"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              placeholder="Enter value"
              required
            />
          </div>
          <div className="form-field">
            <label>Unit 2</label>
            <select value={unit2} onChange={(e) => setUnit2(e.target.value)} required>
              {measurementType.units.map(unit => (
                <option key={unit} value={unit}>
                  {UNIT_DISPLAY_NAMES[unit]}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {(isConvert || canSelectTargetUnit) && (
        <div className="form-row">
          <div className="form-field full-width">
            <label>{isConvert ? 'Convert To' : 'Result Unit (optional)'}</label>
            <select 
              value={targetUnit} 
              onChange={(e) => setTargetUnit(e.target.value)}
              required={isConvert}
            >
              {measurementType.units.map(unit => (
                <option key={unit} value={unit}>
                  {UNIT_DISPLAY_NAMES[unit]}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Calculating...' : `Calculate ${operation}`}
      </button>
    </form>
  );
};

export default OperationForm;

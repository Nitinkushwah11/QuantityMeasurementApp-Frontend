import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MEASUREMENT_TYPES, OPERATIONS } from '../../utils/constants';
import { measurementService } from '../../services/auth';
import Navbar from '../Layout/Navbar';
import OperationForm from './OperationForm';
import './Operations.css';

const OperationsPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const measurementType = MEASUREMENT_TYPES.find(t => t.id.toLowerCase() === type);

  if (!measurementType) {
    return <div>Measurement type not found</div>;
  }

  const availableOperations = measurementType.supportsArithmetic
    ? Object.keys(OPERATIONS)
    : ['COMPARE', 'CONVERT'];

  const handleOperationSelect = (operation) => {
    setSelectedOperation(operation);
    setResult(null);
    setError('');
  };

  const handleCalculate = async (data) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { quantity1, quantity2, targetUnit } = data;

      let response;
      switch (selectedOperation) {
        case 'COMPARE':
          response = await measurementService.compare(quantity1, quantity2);
          break;
        case 'CONVERT':
          response = await measurementService.convert(quantity1, targetUnit);
          break;
        case 'ADD':
          response = await measurementService.add(quantity1, quantity2, targetUnit);
          break;
        case 'SUBTRACT':
          response = await measurementService.subtract(quantity1, quantity2, targetUnit);
          break;
        case 'DIVIDE':
          response = await measurementService.divide(quantity1, quantity2);
          break;
        default:
          throw new Error('Unknown operation');
      }

      setResult(response);
      if (response.error) {
        setError(response.errorMessage);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="operations-container">
        <div className="operations-header">
          <button onClick={() => navigate('/dashboard')} className="back-button">
            ← Back to Dashboard
          </button>
          <h1>{measurementType.icon} {measurementType.name} Measurements</h1>
          <p>{measurementType.description}</p>
        </div>

        <div className="operations-content">
          <div className="operations-sidebar">
            <h3>Select Operation</h3>
            {availableOperations.map(op => (
              <button
                key={op}
                className={`operation-btn ${selectedOperation === op ? 'active' : ''}`}
                onClick={() => handleOperationSelect(op)}
              >
                <span className="op-icon">{OPERATIONS[op].icon}</span>
                <span>{OPERATIONS[op].name}</span>
              </button>
            ))}
          </div>

          <div className="operations-main">
            {selectedOperation ? (
              <>
                <div className="operation-title">
                  <h2>{OPERATIONS[selectedOperation].icon} {OPERATIONS[selectedOperation].name}</h2>
                </div>

                <OperationForm
                  operation={selectedOperation}
                  measurementType={measurementType}
                  onSubmit={handleCalculate}
                  loading={loading}
                />

                {error && (
                  <div className="error-box">
                    <strong>Error:</strong> {error}
                  </div>
                )}

                {result && !result.error && (
                  <div className="result-box">
                    <h3>Result</h3>
                    {result.resultString ? (
                      <div className="result-value">
                        <span className="result-label">Comparison:</span>
                        <span className="result-data">{result.resultString}</span>
                      </div>
                    ) : (
                      <div className="result-value">
                        <span className="result-label">Result:</span>
                        <span className="result-data">
                          {result.resultValue} {result.resultUnit}
                        </span>
                      </div>
                    )}
                    <div className="result-details">
                      <small>
                        {result.thisValue} {result.thisUnit} 
                        {result.thatValue && ` ${selectedOperation.toLowerCase()} ${result.thatValue} ${result.thatUnit}`}
                      </small>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="no-operation">
                <div className="placeholder-icon">📊</div>
                <h3>Select an operation from the left</h3>
                <p>Choose an operation to start measuring</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsPage;

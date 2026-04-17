import { useState, useEffect } from 'react';
import { measurementService } from '../../services/auth';
import { OPERATIONS, MEASUREMENT_TYPES } from '../../utils/constants';
import Navbar from '../Layout/Navbar';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, [filter]);

  const loadHistory = async () => {
    setLoading(true);
    setError('');

    try {
      let data;
      if (filter === 'ALL') {
        // Load all types and combine
        const promises = Object.keys(OPERATIONS).map(op => 
          measurementService.getHistory(op).catch(() => [])
        );
        const results = await Promise.all(promises);
        data = results.flat();
      } else if (filter === 'ERRORS') {
        data = await measurementService.getErrorHistory();
      } else if (OPERATIONS[filter]) {
        data = await measurementService.getHistory(filter);
      } else {
        // It's a measurement type
        data = await measurementService.getHistoryByType(filter);
      }

      setHistory(data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="history-container">
        <div className="history-header">
          <h1>Measurement History</h1>
          <p>View and analyze your previous calculations</p>
        </div>

        <div className="history-filters">
          <button
            className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All Records
          </button>
          {Object.keys(OPERATIONS).map(op => (
            <button
              key={op}
              className={`filter-btn ${filter === op ? 'active' : ''}`}
              onClick={() => setFilter(op)}
            >
              {OPERATIONS[op].icon} {OPERATIONS[op].name}
            </button>
          ))}
          <button
            className={`filter-btn ${filter === 'ERRORS' ? 'active' : ''}`}
            onClick={() => setFilter('ERRORS')}
          >
            ❌ Errors Only
          </button>
        </div>

        {loading && <div className="spinner"></div>}

        {error && (
          <div className="error-message">{error}</div>
        )}

        {!loading && !error && (
          <div className="history-list">
            {history.length === 0 ? (
              <div className="no-history">
                <div className="empty-icon">📊</div>
                <h3>No records found</h3>
                <p>Start measuring to see your history here</p>
              </div>
            ) : (
              history.map((record, index) => (
                <div key={index} className={`history-card ${record.error ? 'error' : ''}`}>
                  <div className="history-badge">
                    {OPERATIONS[record.operation]?.icon || '📊'} {record.operation}
                  </div>
                  <div className="history-details">
                    <div className="history-input">
                      <strong>Input:</strong> {record.thisValue} {record.thisUnit}
                      {record.thatValue && ` ${record.operation.toLowerCase()} ${record.thatValue} ${record.thatUnit}`}
                    </div>
                    {!record.error ? (
                      <div className="history-result">
                        <strong>Result:</strong> 
                        {record.resultString ? (
                          <span className="result-text"> {record.resultString}</span>
                        ) : (
                          <span className="result-value"> {record.resultValue} {record.resultUnit}</span>
                        )}
                      </div>
                    ) : (
                      <div className="history-error">
                        <strong>Error:</strong> {record.errorMessage}
                      </div>
                    )}
                  </div>
                  <div className="history-type">
                    <span className="type-badge">{record.thisMeasurementType.replace('Unit', '')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;

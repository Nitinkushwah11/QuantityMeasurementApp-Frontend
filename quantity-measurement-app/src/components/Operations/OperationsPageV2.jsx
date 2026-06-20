import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MEASUREMENT_TYPES, OPERATIONS } from '../../utils/constants';
import { measurementService } from '../../services/auth';
import Navbar from '../Layout/Navbar';
import './OperationsV2.css';

const OperationsPageV2 = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [selectedOperation, setSelectedOperation] = useState('COMPARE');
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const measurementType = MEASUREMENT_TYPES.find(t => t.name === type?.toUpperCase());
  
  useEffect(() => {
    if (!measurementType) {
      navigate('/dashboard');
      return;
    }
    setFormData({});
    setResult(null);
    setError('');
  }, [type, measurementType, navigate]);

  const getOperationConfig = (operationType) => {
    const configs = {
      COMPARE: {
        title: 'Compare Values',
        icon: '⚖️',
        description: 'Compare two measurements to see if they are equal',
        gradient: 'from-blue-500 to-cyan-500',
        fields: [
          { name: 'value1', label: 'First Value', type: 'number', required: true },
          { name: 'unit1', label: 'First Unit', type: 'select', required: true },
          { name: 'value2', label: 'Second Value', type: 'number', required: true },
          { name: 'unit2', label: 'Second Unit', type: 'select', required: true }
        ]
      },
      CONVERT: {
        title: 'Convert Units',
        icon: '🔄',
        description: 'Convert between different units of measurement',
        gradient: 'from-emerald-500 to-teal-500',
        fields: [
          { name: 'value', label: 'Value to Convert', type: 'number', required: true },
          { name: 'fromUnit', label: 'From Unit', type: 'select', required: true },
          { name: 'toUnit', label: 'To Unit', type: 'select', required: true }
        ]
      },
      ADD: {
        title: 'Add Values',
        icon: '➕',
        description: 'Add two measurements together',
        gradient: 'from-orange-500 to-red-500',
        fields: [
          { name: 'value1', label: 'First Value', type: 'number', required: true },
          { name: 'unit1', label: 'First Unit', type: 'select', required: true },
          { name: 'value2', label: 'Second Value', type: 'number', required: true },
          { name: 'unit2', label: 'Second Unit', type: 'select', required: true },
          { name: 'targetUnit', label: 'Result Unit (Optional)', type: 'select', required: false }
        ]
      },
      SUBTRACT: {
        title: 'Subtract Values',
        icon: '➖',
        description: 'Subtract one measurement from another',
        gradient: 'from-purple-500 to-pink-500',
        fields: [
          { name: 'value1', label: 'First Value', type: 'number', required: true },
          { name: 'unit1', label: 'First Unit', type: 'select', required: true },
          { name: 'value2', label: 'Second Value', type: 'number', required: true },
          { name: 'unit2', label: 'Second Unit', type: 'select', required: true },
          { name: 'targetUnit', label: 'Result Unit (Optional)', type: 'select', required: false }
        ]
      },
      DIVIDE: {
        title: 'Divide Values',
        icon: '➗',
        description: 'Divide one measurement by another to get a ratio',
        gradient: 'from-yellow-500 to-orange-500',
        fields: [
          { name: 'value1', label: 'Dividend', type: 'number', required: true },
          { name: 'unit1', label: 'Dividend Unit', type: 'select', required: true },
          { name: 'value2', label: 'Divisor', type: 'number', required: true },
          { name: 'unit2', label: 'Divisor Unit', type: 'select', required: true }
        ]
      }
    };
    return configs[operationType] || configs.COMPARE;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      let response;
      const measurementTypeName = `${measurementType.name.toLowerCase()}Unit`;

      switch (selectedOperation) {
        case 'COMPARE':
          response = await measurementService.compare(
            measurementTypeName,
            parseFloat(formData.value1),
            formData.unit1,
            parseFloat(formData.value2),
            formData.unit2
          );
          break;
        case 'CONVERT':
          response = await measurementService.convert(
            measurementTypeName,
            parseFloat(formData.value),
            formData.fromUnit,
            formData.toUnit
          );
          break;
        case 'ADD':
          response = await measurementService.add(
            measurementTypeName,
            parseFloat(formData.value1),
            formData.unit1,
            parseFloat(formData.value2),
            formData.unit2,
            formData.targetUnit
          );
          break;
        case 'SUBTRACT':
          response = await measurementService.subtract(
            measurementTypeName,
            parseFloat(formData.value1),
            formData.unit1,
            parseFloat(formData.value2),
            formData.unit2,
            formData.targetUnit
          );
          break;
        case 'DIVIDE':
          response = await measurementService.divide(
            measurementTypeName,
            parseFloat(formData.value1),
            formData.unit1,
            parseFloat(formData.value2),
            formData.unit2
          );
          break;
        default:
          throw new Error('Invalid operation');
      }

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Calculation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setResult(null);
    setError('');
  };

  const currentConfig = getOperationConfig(selectedOperation);
  const availableOperations = measurementType?.name === 'TEMPERATURE' 
    ? ['COMPARE', 'CONVERT']
    : ['COMPARE', 'CONVERT', 'ADD', 'SUBTRACT', 'DIVIDE'];

  if (!measurementType) {
    return null;
  }

  return (
    <div className="operations-v2-container">
      <Navbar />
      
      {/* Background Elements */}
      <div className="operations-v2-bg-elements">
        <div className="operations-v2-bg-shape-1"></div>
        <div className="operations-v2-bg-shape-2"></div>
        <div className="operations-v2-bg-shape-3"></div>
        <div className="operations-v2-bg-dots"></div>
      </div>

      <div className="operations-v2-content">
        {/* Header */}
        <div className="operations-v2-header">
          <div className="operations-v2-breadcrumb">
            <span onClick={() => navigate('/dashboard')}>Dashboard</span>
            <span>/</span>
            <span>{measurementType.displayName} Operations</span>
          </div>
          
          <div className="operations-v2-title">
            <h1>{measurementType.icon} {measurementType.displayName} Calculator</h1>
            <p>Perform precise {measurementType.displayName.toLowerCase()} calculations and conversions</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="operations-v2-main">
          {/* Operations Sidebar */}
          <div className="operations-v2-sidebar">
            <div className="operations-v2-sidebar-header">
              <h3>🔧 Operations</h3>
              <p>Choose your calculation type</p>
            </div>
            
            <div className="operations-v2-nav">
              {availableOperations.map(operation => {
                const config = getOperationConfig(operation);
                return (
                  <button
                    key={operation}
                    className={`operations-v2-nav-item ${selectedOperation === operation ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedOperation(operation);
                      setFormData({});
                      setResult(null);
                      setError('');
                    }}
                  >
                    <div className="operations-v2-nav-icon">{config.icon}</div>
                    <div className="operations-v2-nav-content">
                      <span className="operations-v2-nav-title">{config.title}</span>
                      <span className="operations-v2-nav-desc">{config.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calculator Area */}
          <div className="operations-v2-calculator">
            <div className="operations-v2-workspace">
              {/* Form Section */}
              <div className="operations-v2-form-section">
                <div className="operations-v2-form-header">
                  <div className={`operations-v2-operation-badge bg-gradient-to-r ${currentConfig.gradient}`}>
                    <span className="operations-v2-operation-icon">{currentConfig.icon}</span>
                    <div>
                      <h3>{currentConfig.title}</h3>
                      <p>{currentConfig.description}</p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="operations-v2-error">
                    <div className="operations-v2-error-icon">⚠️</div>
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleCalculate} className="operations-v2-form">
                  <div className="operations-v2-form-grid">
                    {currentConfig.fields.map(field => (
                      <div key={field.name} className="operations-v2-form-group">
                        <label>
                          {field.label}
                          {field.required && <span className="operations-v2-required">*</span>}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            required={field.required}
                          >
                            <option value="">Select {field.label.toLowerCase()}</option>
                            {measurementType.units.map(unit => (
                              <option key={unit.name} value={unit.name}>
                                {unit.displayName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            required={field.required}
                            step="any"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="operations-v2-form-actions">
                    <button type="submit" className="operations-v2-calculate-btn" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="operations-v2-spinner"></span>
                          Calculating...
                        </>
                      ) : (
                        <>
                          <span>⚡</span>
                          Calculate
                        </>
                      )}
                    </button>
                    <button type="button" onClick={resetForm} className="operations-v2-reset-btn">
                      <span>🔄</span>
                      Reset
                    </button>
                  </div>
                </form>
              </div>

              {/* Result Section */}
              <div className="operations-v2-result-section">
                <div className="operations-v2-result-header">
                  <h3>📊 Result</h3>
                  <p>Your calculation output</p>
                </div>

                <div className="operations-v2-result-container">
                  {!result ? (
                    <div className="operations-v2-result-placeholder">
                      <div className="operations-v2-placeholder-icon">🎯</div>
                      <h4>Ready to Calculate</h4>
                      <p>Fill out the form and click calculate to see your result here</p>
                    </div>
                  ) : (
                    <div className="operations-v2-result-success">
                      <div className="operations-v2-result-badge">
                        <span className="operations-v2-result-icon">✅</span>
                        <div>
                          <h4>Calculation Complete</h4>
                          <p>Operation: {currentConfig.title}</p>
                        </div>
                      </div>
                      
                      <div className="operations-v2-result-value">
                        <span className="operations-v2-result-label">Result:</span>
                        <span className="operations-v2-result-output">{result.result || result.message}</span>
                      </div>

                      {result.details && (
                        <div className="operations-v2-result-details">
                          <h5>📋 Details</h5>
                          <div className="operations-v2-detail-grid">
                            {Object.entries(result.details).map(([key, value]) => (
                              <div key={key} className="operations-v2-detail-item">
                                <span className="operations-v2-detail-key">{key}:</span>
                                <span className="operations-v2-detail-value">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsPageV2;
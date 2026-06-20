import { useNavigate } from 'react-router-dom';
import { MEASUREMENT_TYPES } from '../../utils/constants';
import Navbar from '../Layout/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleTypeClick = (type) => {
    navigate(`/operations/${type.id.toLowerCase()}`);
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Quantity Measurement Dashboard</h1>
          <p>Select a measurement type to begin</p>
        </div>

        <div className="measurement-grid">
          {MEASUREMENT_TYPES.map((type) => (
            <div
              key={type.id}
              className="measurement-card"
              onClick={() => handleTypeClick(type)}
            >
              <div className="card-icon">{type.icon}</div>
              <h3>{type.name}</h3>
              <p>{type.description}</p>
              <div className="card-units">
                {type.units.map((unit, index) => (
                  <span key={unit} className="unit-badge">
                    {unit}
                  </span>
                ))}
              </div>
              {!type.supportsArithmetic && (
                <div className="conversion-only">Conversion Only</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

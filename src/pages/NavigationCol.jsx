import React from 'react';
import { Link } from 'react-router-dom';
import thumb from "../assets/images/thumb.png";

const Id = (cell) => {
  return cell.value ? cell.value : "";
};

const Name = (cell) => {
  return cell.value ? cell.value : "";
};

const Status = (cell) => {
  const hasValue = cell.value ? true : false;
  return (
    <button
      style={{
        color: hasValue ? 'green' : 'red',
        padding: '5px 10px',
        border: 'none',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      {hasValue ? 'Active' : 'Inactive'}
    </button>
  );
};

const Url = (cell) => {
  return cell.value ? cell.value : "";
};

const Designation = (cell) => {
  return cell.value ? cell.value : "";
};

const ID = (cell) => {
  return cell.value ? cell.value : "";
};

const Type = (cell) => {
  return cell.value ? cell.value : "";
};

const Symbol = (cell) => {
  return cell.value ? cell.value : "";
};

const OrderType = (cell) => {
  return cell.value ? cell.value : "";
};

const TrigPrice = (cell) => {
  return cell.value ? cell.value : "";
};

const Qty = (cell) => {
  return cell.value ? cell.value : "";
};

const Instrument = (cell) => {
  return cell.value ? cell.value : "";
};

const Strategy = (cell) => {
  return cell.value !== undefined && cell.value !== null ? cell.value : "";
};

const Source = (cell) => {
  return cell.value ? cell.value : "";
};

const Mode = (cell) => {
  return cell.value ? cell.value : "";
};

const Message = (cell) => {
  return cell.value ? cell.value : "";
};

const ReceivedAt = (cell) => {
  return cell.value ? cell.value : "";
};

const Title = (cell) => {
  return cell.value ? cell.value : "";
};

const Image = (cell) => {
  return (
    <img
      id="imagePrimary"
      className="rounded me-50 imgBoxSm"
      src={cell.value}
      alt="image"
    />
  );
};

const Zone = (cell) => {
  return cell.value ? cell.value : "";
};

const Description = (cell) => {
  return cell.value ? cell.value : "";
};

const IconTitle = (cell) => {
  return cell.value ? cell.value : "";
};

const IconImage = (cell) => {
  return cell.value ? (
    <img
      id="IconImage"
      className="rounded me-50 imgBoxSm"
      src={cell.value}
      alt="Secondary Logo"
      height="100px"
    />
  ) : (
    ""
  );
};

const Role = (cell) => {
  return cell.value ? cell.value : "";
};

const Order = (cell) => {
  return cell.value ? cell.value : "";
};

const Tag = (cell) => {
  return cell.value ? cell.value : "";
};

const Question = (cell) => {
  return cell.value ? cell.value : "";
};
const Answer = (cell) => {
  return cell.value ? cell.value : "";
};

const Icon = (cell) => {
  return (
    <img
      id="icon"
      className="rounded me-50 imgBoxSm"
      src={cell.value ? cell.value : thumb}
      alt="Icon"
    />
  );
};

const ButtonUrl = (cell) => {
  return cell.value ? cell.value : "-";
};

const Badge = (cell) => {
  return cell.value ? cell.value : "";
};

const Plan = (cell) => {
  return cell.value ? cell.value : "";
};

const Price = (cell) => {
  return cell.value ? cell.value : "";
};
const ButtonTitle = (cell) => {
  return cell.value ? cell.value : "";
};

const Date = (cell) => {
  return cell.value ? cell.value : "";
};

const Location = (cell) => {
  return cell.value ? cell.value : "";
};
const PromotionImage = (cell) => {
  return (
    <img
      id="promotionImage"
      className="rounded me-50 imgBoxSm"
      src={cell.value ? cell.value : thumb}
      alt="promotionImage"
    />
  );
};

const AddressTitle = (cell) => {
  return cell.value ? cell.value : "";
};

const Email = (cell) => {
  return cell.value ? cell.value : "";
};
const Timing = (cell) => {
  return cell.value ? cell.value : "";
};

const Count = (cell) => {
  return cell.value ? cell.value : "";
};
const Pincode = (cell) => {
  return cell.value ? cell.value : "";
};
const UpdateType = (cell) => {
  return cell.value ? cell.value : "";
};
const Number = (cell) => {
  return cell.value ? cell.value : "";
};
const CheckboxCellRenderer = ({ value }) => {
  return (
    <input
      type="checkbox"
      checked={Boolean(value)}
      readOnly
    />
  );
};

// Move styles outside of the component to prevent recreation on each render
const styles = `
  .badge-container {
    display: inline-flex;
    align-items: center;
    border-radius: 3px;
    min-width: fit-content;
    height: 22px;
    overflow: visible;
    box-sizing: border-box;
    background: white;
  }

  .fixed-container {
    border: 1px solid #10B981;
  }

  .explorer-container {
    border: 1px solid #EC4899;
  }

  .qty-badge {
    height: 100%;
    display: inline-flex;
    align-items: center;
    padding: 0 6px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2px;
    color: #ffffff;
    text-transform: uppercase;
    min-width: max-content;
    border-radius: 2px 0 0 2px;
  }

  .fixed-badge {
    background: #10B981;
  }

  .explorer-badge {
    background: #EC4899;
  }

  .qty-value {
    height: 100%;
    display: inline-flex;
    align-items: center;
    padding: 0 8px;
    font-size: 11px;
    color: #4B5563;
    background: white;
    white-space: nowrap;
    overflow: visible;
    min-width: max-content;
    flex: 1;
  }

  .qty-value span {
    margin: 0 2px;
  }

  .badge-container > *:not(:first-child) {
    margin-left: -1px;
  }

  .qty-badge {
    position: relative;
    z-index: 2;
  }
  
  .qty-value {
    position: relative;
    z-index: 1;
  }

  .badge-container:hover {
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
`;

// Create style element only once when the module loads
let styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Move helper functions outside component to prevent recreation
const getTypeStyles = (type) => {
  switch (type?.toLowerCase()) {
    case 'fixed':
      return 'qty-badge fixed-badge';
    case 'explorer':
      return 'qty-badge explorer-badge';
    default:
      return '';
  }
};

const getDisplayText = (type) => {
  switch (type?.toLowerCase()) {
    case 'fixed':
      return 'FIXED';
    case 'explorer':
      return 'EXP';
    default:
      return type;
  }
};

const calculateValue = (qtyType, quantity, exposure, roundLotSize, price) => {
  if (qtyType?.toLowerCase() === 'fixed') {
    return quantity || 0;
  } else if (qtyType?.toLowerCase() === 'explorer' && price && price !== 0) {
    return `${exposure}(${price} * ${roundLotSize}) = ${Math.floor((exposure * roundLotSize) / price) || 0}`;
  }
  return 0;
};

const QtyType = (cell) => {
  if (!cell.row.original) return null;
  
  const {
    qtyType,
    quantity,
    exposure,
    roundLotSize,
  } = cell.row.original;

  const price = 555;

  return (
    <div className={`badge-container ${qtyType?.toLowerCase() === 'fixed' ? 'fixed-container' : 'explorer-container'}`}>
      <span className={getTypeStyles(qtyType)}>
        {getDisplayText(qtyType)}
      </span>
      <span className="qty-value">
        {calculateValue(qtyType, quantity, exposure, roundLotSize, price).toLocaleString()}
      </span>
    </div>
  );
};


export {
    Id,
    Name,
    Status,
    Url,
    Description,
    Title,
    Image,
    Zone,
    Designation,
    IconTitle,
    IconImage,
    Role,
    Order,
    Tag,
    Question,
    Answer,
    Icon,
    ButtonUrl,
    Badge,
    Plan,
    Price,
    ButtonTitle,
    PromotionImage,
    Location,
    Date,
    AddressTitle,
    Email,
    Timing,
    Count,
    Pincode,
    UpdateType,
    Number,
    ID,
    Type,
    Symbol,
    OrderType,
    TrigPrice,
    Qty,
    Instrument,
    Strategy,
    Source,
    Mode,
    Message,
    ReceivedAt,
    CheckboxCellRenderer,
    QtyType
};
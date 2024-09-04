import React from 'react';
import { Link } from 'react-router-dom';
import thumb from "../assets/images/thumb.png";

const Id = (cell) => {
  return cell.value ? cell.value : "";
};

const Name = (cell) => {
  return cell.value ? cell.value : "";
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
  return cell.value ? cell.value : "";
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
export {
    Id,
    Name,
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
    ReceivedAt
};
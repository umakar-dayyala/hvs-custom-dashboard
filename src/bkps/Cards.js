import React from "react";
import { HvGrid, HvCard, HvTypography } from "@hitachivantara/uikit-react-core";

const Cards = ({ data }) => {
  alert('data: ' + JSON.stringify(data));

  // Function to determine top border color based on the value
  const getBorderTopColor = (value, label) => {
    if (label === 'Sensor Health') {
      const [active, total] = value.split('/').map(Number);
      return active == '0' ? 'green.500' : 'red.500';
    }   
    if (label === 'Active Sensor') {
      const [active, total] = value.split('/').map(Number);
      return active === total ? 'green.500' : 'yellow.500';
    }
    if (label === 'Received Alerts' || label === 'Outside Alerts' || label === 'Incident Tracked') {
      return Number(value) === 0 ? 'green.500' : 'red.500';
    }
    if (Number(value) === 0) {
      return 'gray.500';
    }
    return 'green.500'; // Default border color
  };

  // Function to get the icon based on the label
  const getIcon = (label) => {
    switch (label) {
      case 'Chemical Alerts':
        return '/chemical.png';
      case 'Biological Alerts':
        return '/biological.png';
      case 'Radio Alerts':
        return '/radiological.png';
      default:
        return null;
    }
  };

  return (
    <HvGrid container spacing="sm" className="cards-container">
      {data.map((card, index) => (
        <HvGrid item key={index} xs={12} sm={6} md={4} lg={3}>
          <HvCard statusColor={getBorderTopColor(card.value, card.label)} className="card">
            <HvTypography variant="label" className="card-title">
              {card.label}
            </HvTypography>
            <HvTypography variant="title3" className="card-value">
              {card.value}
            </HvTypography>
          </HvCard>
        </HvGrid>
      ))}
    </HvGrid>
  );
};

export default Cards;
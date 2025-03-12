import React from 'react';
import { HvGrid, HvCard, HvTypography, HvContainer } from '@hitachivantara/uikit-react-core';
 
const Cards = ({ data }) => {
  // Function to determine top border color based on the value
  const getBorderTopColor = (value, label) => {
    if (label === 'Sensor Health') {
      const [active, total] = value.split('/').map(Number);
      return active === 0 ? 'positive' : 'negative';
    }
    if (label === 'Active Sensor') {
      const [active, total] = value.split('/').map(Number);
      return active === total ? 'positive' : 'warning';
    }
    if (['Received Alerts', 'Outside Alerts', 'Incident Tracked'].includes(label)) {
      return Number(value) === 0 ? 'positive' : 'negative';
    }
    return Number(value) === 0 ? 'neutral' : 'positive';
  };
 
  return (
    <HvContainer>
      <HvGrid container spacing="md" justifyContent="space-evenly" wrap="nowrap">
        {data.map((card, index) => (
          <HvGrid item key={index} xs={true}>
            <HvCard statusColor={getBorderTopColor(card.value, card.label)}>
              <HvTypography variant="label" align="center">
                {card.label}
              </HvTypography>
              <HvTypography variant="title3" align="center">
                {card.value}
              </HvTypography>
            </HvCard>
          </HvGrid>
        ))}
      </HvGrid>
    </HvContainer>
  );
};
 
export default Cards;
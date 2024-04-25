import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import YearState from './YearState';
import adjustDistrictNameAndOfficeName from '../../utils/adjustDistrictNameAndOfficeName';
import { renderLog } from '../../utils/logging';
import toTitleCase from '../../utils/toTitleCase';

function isAllUpperCase (str) {
  if (str) {
    return str === str.toUpperCase();
  } else {
    return false;
  }
}

// React functional component example
export default function OfficeHeldNameText (props) {
  renderLog('OfficeHeldNameText');  // Set LOG_RENDER_EVENTS to log all renders
  let districtNameFiltered;
  let nameHtml;
  let officeNameFiltered;
  const {
    centeredText, districtName: incomingDistrictName, inCard, officeName: incomingOfficeName,
    politicalParty, stateName,
  } = props; // Mar 2023: Turning off officeLink until we can do design review
  if (isAllUpperCase(incomingDistrictName)) {
    districtNameFiltered = toTitleCase(incomingDistrictName);
  } else {
    districtNameFiltered = incomingDistrictName;
  }
  if (isAllUpperCase(incomingOfficeName)) {
    officeNameFiltered = toTitleCase(incomingOfficeName);
  } else {
    officeNameFiltered = incomingOfficeName;
  }
  const { districtName, officeName } = adjustDistrictNameAndOfficeName(districtNameFiltered, officeNameFiltered);
  // console.log('districtName: ', districtName, 'officeName: ', officeName);
  const officeLink = null;

  if (districtName) {
    if (officeName === undefined) {
      nameHtml = (
        <DistrictAndPartySpan>
          <span>Representative for </span>
          {officeLink ? (
            <Link to={officeLink}>
              <DistrictNameSpan>{districtName}</DistrictNameSpan>
            </Link>
          ) : <DistrictNameSpan>{districtName}</DistrictNameSpan>}
          <YearStateWrapper inCard={inCard}>
            <YearState centeredText={centeredText} politicalParty={politicalParty} stateName={stateName} />
          </YearStateWrapper>
        </DistrictAndPartySpan>
      );
    } else {
      nameHtml = (
        <PartyAndOfficeHeldWrapper>
          <span className="u-gray-darker">
            {officeName}
            {' '}
          </span>
          <span>for </span>
          {officeLink ? (
            <Link id="officeHeldNameTextContestOfficeName" to={officeLink}>
              <DistrictNameSpan>{districtName}</DistrictNameSpan>
            </Link>
          ) : <DistrictNameSpan>{districtName}</DistrictNameSpan>}
          <YearStateWrapper inCard={inCard}>
            <YearState centeredText={centeredText} politicalParty={politicalParty} stateName={stateName} />
          </YearStateWrapper>
        </PartyAndOfficeHeldWrapper>
      );
    }
  } else {
    nameHtml = (
      <PartyAndYearWrapper>
        <span className="u-gray-darker">
          {officeName}
        </span>
        <YearStateWrapper inCard={inCard}>
          <YearState centeredText={centeredText} politicalParty={politicalParty} stateName={stateName} />
        </YearStateWrapper>
      </PartyAndYearWrapper>
    );
  }

  return nameHtml;
}
OfficeHeldNameText.propTypes = {
  centeredText: PropTypes.bool,
  districtName: PropTypes.string,
  inCard: PropTypes.bool,
  officeName: PropTypes.string,
  // officeLink: PropTypes.string,
  politicalParty: PropTypes.string,
};

const DistrictNameSpan = styled('span')`
  color: #333;
`;

const DistrictAndPartySpan = styled('span')`
`;

const PartyAndYearWrapper = styled('div')`
`;

const PartyAndOfficeHeldWrapper = styled('div')`
  line-height: 17px;
`;

const YearStateWrapper = styled('div', {
  shouldForwardProp: (prop) => !['inCard'].includes(prop),
})(({ inCard }) => (`
  ${inCard ? '' : 'margin-top: 6px;'}
`));

import styled from 'styled-components';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';

const Candidate = styled('div')`
  display: flex;
  flex-grow: 8;
`;

const CandidateBottomRow = styled('div')`
  margin-top: 4px;
`;

const CandidateContainer = styled('div')`
  display: flex;
  justify-content: flex-start;
  padding: 10px 5px;
`;

const CandidateInfo = styled('div')(({ theme }) => (`
  border: 1px solid #fff;
  display: block;
  height: 100%;
  margin: 0 !important;
  padding: 8px !important;
  transition: all 200ms ease-in;
  ${theme.breakpoints.down('md')} {
    padding: 8px 8px 4px 8px !important;
  }
`));

const constrainedTextMobileStyles = isMobileScreenSize() || isCordova() ? `
  height: auto;
  white-space: initial;
` : '';

// Defaults to style in mobile
const CandidateNameH1 = styled('h1')(({ theme }) => (`
  font-size: 14px;
  margin-bottom: 2px;
  margin-top: 8px;
  font-weight: bold;
  ${theme.breakpoints.up('md')} {
    margin-top: 0;
    font-size: 16px;
  }
`));

const CandidateNameH4 = styled('h4')`
  color: #4371cc;
  font-weight: 400;
  font-size: 20px;
  margin-bottom: 0 !important;
  min-width: 124px;
  &:hover {
    text-decoration: underline;
  }
  ${constrainedTextMobileStyles}
`;

const CandidateParty = styled('div')`
  color: #555;
`;

const CandidateTopRow = styled('div')`
  cursor: pointer;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

const CandidateWrapper = styled('div')(({ theme }) => (`
  width: 320px;
  ${theme.breakpoints.down('sm')} {
    width: 100%;
  }
  ${theme.breakpoints.up('sm')} {
    // margin-left: 48px;
    min-width: 320px;
  }
`));

const OfficeNameH2 = styled('div')(({ theme }) => (`
  // For some reason if styled('h2') it breaks down
  font-size: 32px;
  margin-bottom: 6px;
  width: fit-content;
  ${theme.breakpoints.down('sm')} {
    font-size: 28px;
  }
`));

const OfficeItemCompressedWrapper = styled('div')`
  display: flex;
  border: 1px solid #fff;
  flex-direction: column;
  margin-bottom: 60px;
  position: relative;
`;

export {
  Candidate, CandidateBottomRow,
  CandidateContainer, CandidateInfo, CandidateNameH1, CandidateNameH4, CandidateParty,
  CandidateWrapper, CandidateTopRow,
  OfficeNameH2, OfficeItemCompressedWrapper, constrainedTextMobileStyles,
};

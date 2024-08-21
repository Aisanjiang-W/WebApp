import styled from 'styled-components';
import DesignTokenColors from './DesignTokenColors';

export const BallotHorizontallyScrollingContainer = styled('div', {
  shouldForwardProp: (prop) => !['isChosen', 'showLeftGradient', 'showRightGradient'].includes(prop),
})(({ isChosen, showLeftGradient, showRightGradient }) => (`
  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0));
  mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0));

  overflow-x: auto;
  white-space: nowrap;

  border: 1px solid #fff; /* Default border color so that the hover doesn't create jump */
  &:hover { border: 1px solid ${DesignTokenColors.neutralUI100}; }
  ${isChosen ? `background-color: ${DesignTokenColors.confirmation50};` : ''}

    /* Fade out, right side */
  ${showRightGradient ? '-webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0));' : ''}
  ${showRightGradient ? 'mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0));' : ''} );

  /* Fade out, left side */
  ${showLeftGradient ? '-webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0));' : ''}
  ${showLeftGradient ? 'mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0));' : ''}

  /* Fade out, both sides */
  ${showLeftGradient && showRightGradient ? '-webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 6%, rgba(0, 0, 0, 1) 94%, rgba(0, 0, 0, 0));' : ''}
  ${showLeftGradient && showRightGradient ? 'mask-image: linear-gradient(to right, rgba(255, 0, 0, 0), rgba(0, 0, 0, 1) 6%, rgba(0, 0, 0, 1) 94%, rgba(0, 0, 0, 0));' : ''}


  /* Make the scrollbar not be visible */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  ::-webkit-scrollbar {  /* Chrome, Safari and Opera */
    display: none;
  }
`));

export const BallotScrollingInnerWrapper = styled('div')`
  overflow-x: hidden;
  overflow-y: hidden;
  display: flex;
`;

export const BallotScrollingOuterWrapper = styled('div')`
  height: 100%;
  min-width: 0;
  width: 100%;
`;

export const CampaignsHorizontallyScrollingContainer = styled('div', {
  shouldForwardProp: (prop) => !['showLeftGradient', 'showRightGradient'].includes(prop),
})(({ showLeftGradient, showRightGradient }) => (`

  /* Fade out, right side */
  ${showRightGradient ? '-webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0));' : ''}
  ${showRightGradient ? 'mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0));' : ''} );

  /* Fade out, left side */
  ${showLeftGradient ? '-webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0));' : ''}
  ${showLeftGradient ? 'mask-image: linear-gradient(to left, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0));' : ''}

  /* Fade out, both sides */
  ${showLeftGradient && showRightGradient ? '-webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 6%, rgba(0, 0, 0, 1) 94%, rgba(0, 0, 0, 0));' : ''}
  ${showLeftGradient && showRightGradient ? 'mask-image: linear-gradient(to right, rgba(255, 0, 0, 0), rgba(0, 0, 0, 1) 6%, rgba(0, 0, 0, 1) 94%, rgba(0, 0, 0, 0));' : ''}

  overflow-y: hidden;
  overflow-x: auto;
  white-space: nowrap;

  /* Make the scrollbar not be visible */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  ::-webkit-scrollbar {  /* Chrome, Safari and Opera */
    display: none;
  }
`));

export const CampaignsScrollingInnerWrapper = styled('div')`
  overflow-x: hidden;
  overflow-y: hidden;
  width: 100%;
`;

export const CampaignsScrollingOuterWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  height: 400px;
  min-height: 400px;
  min-width: 0;
  width: 100%;
`;

export const RightArrowInnerWrapper = styled('div', {
  shouldForwardProp: (prop) => !['disableMobileRightArrow'].includes(prop),
})(({ disableMobileRightArrow }) => (`
  ${disableMobileRightArrow ? 'opacity: 0.2;' : 'opacity: 1;'}

  transition: opacity 200ms ease-in 0s;
`));

export const RightArrowOuterWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  min-height: 330px;
  min-width: 24px;
  z-index: 9000;
`;

export const LeftArrowInnerWrapper = styled('div', {
  shouldForwardProp: (prop) => !['disableMobileLeftArrow'].includes(prop),
})(({ disableMobileLeftArrow }) => (`
  ${disableMobileLeftArrow ? 'opacity: 0.2;' : 'opacity: 1;'}

  transition: opacity 200ms ease-in 0s;
`));

export const LeftArrowOuterWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  min-height: 330px;
  min-width: 24px;
  z-index: 9000;
`;

export const TitleAndMobileArrowsOuterWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
`;

export const MobileArrowsInnerWrapper = styled('div')`
  display: flex;
  min-width: 24px;
`;

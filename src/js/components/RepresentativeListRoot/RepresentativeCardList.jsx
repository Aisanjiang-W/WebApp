import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { CampaignsNotAvailableToShow, ListWrapper, LoadMoreItemsManuallyWrapper } from '../../common/components/Style/CampaignCardStyles';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import RepresentativeCardForList from './RepresentativeCardForList';
import LoadMoreItemsManually from '../../common/components/Widgets/LoadMoreItemsManually';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));

const STARTING_NUMBER_TO_DISPLAY = 7;
const STARTING_NUMBER_TO_DISPLAY_MOBILE = 5;
const NUMBER_TO_ADD_WHEN_MORE_CLICKED = 10;

class RepresentativeCardList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      representativeList: [],
      numberToDisplay: STARTING_NUMBER_TO_DISPLAY,
    };
  }

  componentDidMount () {
    // console.log('RepresentativeCardList componentDidMount');
    const { startingNumberToDisplay } = this.props;
    if (startingNumberToDisplay && startingNumberToDisplay > 0) {
      this.setState({
        numberToDisplay: startingNumberToDisplay,
      });
    } else if (isMobileScreenSize()) {
      // We deviate from pure responsive in order to request fewer images on initial load
      this.setState({
        numberToDisplay: STARTING_NUMBER_TO_DISPLAY_MOBILE,
      });
    }
    this.onRepresentativeListChange();
  }

  componentDidUpdate (prevProps) { // prevProps, prevState, snapshot
    const { timeStampOfChange, shouldLoadMore } = this.props;
    if (timeStampOfChange && timeStampOfChange !== prevProps.timeStampOfChange) {
      this.onRepresentativeListChange();
    }
    if (shouldLoadMore && shouldLoadMore !== prevProps.shouldLoadMore) {
      // console.log(shouldLoadMore);
      this.loadMoreHasBeenClicked();
    }
  }

  onRepresentativeListChange () {
    const { incomingRepresentativeList } = this.props;
    if (incomingRepresentativeList) {
      this.setState({
        representativeList: incomingRepresentativeList,
      });
    } else {
      this.setState({
        representativeList: [],
      });
    }
  }

  increaseNumberToDisplay = () => {
    let { numberToDisplay } = this.state;
    numberToDisplay += NUMBER_TO_ADD_WHEN_MORE_CLICKED;
    this.setState({
      numberToDisplay,
    });
  }

  loadMoreHasBeenClicked = () => {
    this.increaseNumberToDisplay();
    if (this.props.loadMoreScroll) {
      this.props.loadMoreScroll();
    }
  }

  render () {
    renderLog('RepresentativeCardList');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('RepresentativeCardList render');
    const { useVerticalCard } = this.props;
    const { representativeList, numberToDisplay } = this.state;

    if (!representativeList) {
      return null;
    }
    let numberDisplayed = 0;
    return (
      <RepresentativeCardListWrapper>
        <ListWrapper useVerticalCard={useVerticalCard}>
          {representativeList.map((oneRepresentative) => {
            if (numberDisplayed >= numberToDisplay) {
              return null;
            }
            numberDisplayed += 1;
            return (
              <div key={`oneRepresentativeItem-${oneRepresentative.we_vote_id}`}>
                <RepresentativeCardForList
                  representativeWeVoteId={oneRepresentative.we_vote_id}
                  limitCardWidth={useVerticalCard}
                  useVerticalCard
                />
              </div>
            );
          })}
          <LoadMoreItemsManuallyWrapper>
            {!!(representativeList &&
                representativeList.length > 1 &&
                numberToDisplay < representativeList.length) &&
            (
              <LoadMoreItemsManually
                loadMoreFunction={this.loadMoreHasBeenClicked}
                uniqueExternalId="RepresentativeCardList"
              />
            )}
          </LoadMoreItemsManuallyWrapper>
        </ListWrapper>
        {!numberDisplayed && (
          <Suspense fallback={<></>}>
            <DelayedLoad loadingTextLeftAlign showLoadingText waitBeforeShow={2000}>
              <CampaignsNotAvailableToShow>
                No representatives match.
              </CampaignsNotAvailableToShow>
            </DelayedLoad>
          </Suspense>
        )}
      </RepresentativeCardListWrapper>
    );
  }
}
RepresentativeCardList.propTypes = {
  incomingRepresentativeList: PropTypes.array,
  startingNumberToDisplay: PropTypes.number,
  timeStampOfChange: PropTypes.number,
  useVerticalCard: PropTypes.bool,
  loadMoreScroll: PropTypes.func,
  shouldLoadMore: PropTypes.bool,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const RepresentativeCardListWrapper = styled('div')`
  min-height: 30px;
`;

export default withStyles(styles)(RepresentativeCardList);

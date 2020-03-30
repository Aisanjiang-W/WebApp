import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import People from '@material-ui/icons/People';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, withTheme } from '@material-ui/core/styles';
// import Mail from '@material-ui/icons/Mail';
// import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import { Button, Tooltip, Drawer } from '@material-ui/core';
// import AppActions from '../../actions/AppActions';
import { hasIPhoneNotch } from '../../utils/cordovaUtils';
import FriendActions from '../../actions/FriendActions';
import FriendsShareList from '../Friends/FriendsShareList';
import FriendStore from '../../stores/FriendStore';
import MessageCard from '../Widgets/MessageCard';
import { renderLog } from '../../utils/logging';
import CandidateForDrawer from './CandidateForDrawer';
import CandidateItem from '../Ballot/CandidateItem';
import AnalyticsActions from '../../actions/AnalyticsActions';
import VoterStore from '../../stores/VoterStore';
import IssueActions from '../../actions/IssueActions';
import IssueStore from '../../stores/IssueStore';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import CandidateActions from '../../actions/CandidateActions';
import CandidateStore from '../../stores/CandidateStore';

class OrganizationModal extends Component {
  static propTypes = {
    classes: PropTypes.object,
    isSignedIn: PropTypes.bool,
    pathname: PropTypes.string,
    show: PropTypes.bool,
    id: PropTypes.string,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      pathname: '',
      open: false,
      candidateWeVoteId: '',
      organizationWeVoteId: '',
      // currentFriendsList: [],
      // friendsToShareWith: [],
    };

    this.closeOrganizationModal = this.closeOrganizationModal.bind(this);
  }

  // Ids: options, friends

  componentDidMount () {
    // this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    // FriendActions.currentFriends();
    // console.log('Candidate componentDidMount');
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    const { candidate_we_vote_id: candidateWeVoteId, organization_we_vote_id: organizationWeVoteId } = this.props;
    // console.log('candidateWeVoteId:', candidateWeVoteId);
    if (candidateWeVoteId) {
      this.setState({
        candidateWeVoteId,
      });
      CandidateActions.candidateRetrieve(candidateWeVoteId);
    }

    OrganizationActions.organizationsFollowedRetrieve();

    // We want to make sure we have all of the position information so that comments show up
    const voterGuidesForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(candidateWeVoteId);

    if (voterGuidesForThisBallotItem) {
      voterGuidesForThisBallotItem.forEach((oneVoterGuide) => {
        // console.log('oneVoterGuide: ', oneVoterGuide);
        if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(oneVoterGuide.google_civic_election_id, oneVoterGuide.organization_we_vote_id)) {
          OrganizationActions.positionListForOpinionMaker(oneVoterGuide.organization_we_vote_id, false, true, oneVoterGuide.google_civic_election_id);
        }
      });
    }
    if (!IssueStore.issueDescriptionsRetrieveCalled()) {
      IssueActions.issueDescriptionsRetrieve();
    }
    IssueActions.issuesFollowedRetrieve();
    if (VoterStore.electionId() && !IssueStore.issuesUnderBallotItemsRetrieveCalled(VoterStore.electionId())) {
      IssueActions.issuesUnderBallotItemsRetrieve(VoterStore.electionId());
    }

    AnalyticsActions.saveActionCandidate(VoterStore.electionId(), candidateWeVoteId);
    this.setState({
      candidateWeVoteId,
      organizationWeVoteId,
    });

    this.setState({
      pathname: this.props.pathname,
      currentFriendsList: FriendStore.currentFriends(),
      open: this.props.open,
      candidate_we_vote_id: this.props.candidate_we_vote_id,
    });
  }

  componentWillUnmount () {
    // console.log('Candidate componentWillUnmount');
    this.candidateStoreListener.remove();
  }

  onCandidateStoreChange () {
    // We just want to trigger a re-render
    this.setState();
  }

  closeOrganizationModal () {
    this.setState({ open: false });
    setTimeout(() => {
      this.props.toggleFunction(this.state.pathname);
    }, 2000);
  }

  render () {
    renderLog('OrganizationModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;

    const { organizationWeVoteId, candidateWeVoteId } = this.state;

    // console.log('currentSelectedPlanCostForPayment:', currentSelectedPlanCostForPayment);
    // console.log(this.state);

    // console.log('Friends to share with: ', this.state.friendsToShareWith);

    // const handleChange = (index, item) => (event) => {
    //   let newFriendsToShareWith = [];
    //
    //   if (event.target.checked) {
    //     newFriendsToShareWith = this.state.friendsToShareWith.filter(newItem => newItem.voter_we_vote_id !== item.voter_we_vote_id);
    //   } else {
    //     newFriendsToShareWith = [...this.state.friendsToShareWith, item];
    //   }
    //
    //   this.setState({ friendsToShareWith: newFriendsToShareWith, [index]: event.target.checked });
    // };

    return (
      <>
        <Drawer id="share-menu" anchor="right" open={this.state.open} direction="left" onClose={this.closeOrganizationModal}>
          <CandidateItem
            inModal
            candidateWeVoteId={candidateWeVoteId}
            organizationWeVoteId={organizationWeVoteId}
            hideShowMoreFooter
            expandIssuesByDefault
            showLargeImage
            showTopCommentByBallotItem
            showOfficeName
            showPositionStatementActionBar
          />
        </Drawer>
      </>
    );
  }
}
const styles = () => ({
  dialogPaper: {
    display: 'block',
    marginTop: hasIPhoneNotch() ? 68 : 48,
    '@media (min-width: 576px)': {
      maxWidth: '600px',
      width: '90%',
      height: 'fit-content',
      margin: '0 auto',
      minWidth: 0,
      minHeight: 0,
      transitionDuration: '.25s',
    },
    minWidth: '100%',
    maxWidth: '100%',
    width: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    height: '100%',
    margin: '0 auto',
  },
  dialogContent: {
    padding: '24px 24px 36px 24px',
    background: 'white',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '@media(max-width: 576px)': {
      justifyContent: 'flex-start !important',
    },
  },
  backButton: {
    // marginBottom: 6,
    // marginLeft: -8,
    paddingTop: 0,
    paddingBottom: 0,
  },
  backButtonIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    marginLeft: 'auto',
  },
  closeButtonAbsolute: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
});

/* eslint no-nested-ternary: ["off"] */
const ModalTitleArea = styled.div`
  justify-content: flex-start;
  width: 100%;
  padding: ${props => (props.firstSlide ? '24px 24px 12px 24px' : props.onSignInSlide ? '20px 14px 10px' : '10px 14px')};
  z-index: 999;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
  display: ${props => (props.onSignInSlide ? 'block' : 'flex')};
  text-align: ${props => (props.onSignInSlide ? 'center' : 'left')};
`;

const FriendsShareTextWrapper = styled.div`
  position: relative;
  top: -16px;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  font-size: ${props => (props.bold ? '30px' : '24px')};
  color: black;
  margin: ${props => (props.onSignInSlide ? '0 auto' : '0')};
  margin-top: 0;
  margin-bottom: ${props => (props.bold ? '0' : '12px')};
  font-weight: ${props => (props.bold ? 'bold' : 'initial')};
  text-align: ${props => (props.left && 'left')};
`;

const SubTitle = styled.div`
  margin-top: 0;
  font-size: ${props => (props.larger ? '18px' : '14px')};
  width: 100%;
  text-align: ${props => (props.left && 'left')};
  @media(min-width: 420px) {
    width: 80%;
  }
`;

const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 16px;
`;

export default withTheme(withStyles(styles)(OrganizationModal));

import { Avatar } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TruncateMarkup from 'react-truncate-markup';
import styled from 'styled-components';
import { avatarGeneric } from '../../../utils/applicationUtils';
import LazyImage from '../LazyImage';
import {
  Comment, CommentName, CommentNameWrapper, CommentTextInnerWrapper,
  CommentTextWrapper,
  CommentVoterPhotoWrapper, CommentWrapper, OneCampaignInnerWrapper,
  OneCampaignOuterWrapper, ReadMoreSpan,
} from '../Style/CampaignDetailsStyles';
import { timeFromDate } from '../../utils/dateFormat';
import { isCordova } from '../../utils/isCordovaOrWebApp';
import { renderLog } from '../../utils/logging';
import stringContains from '../../utils/stringContains';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import VoterStore from '../../../stores/VoterStore';
import speakerDisplayNameToInitials from '../../utils/speakerDisplayNameToInitials';

class CampaignCommentForList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignXSupporter: {},
      showFullSupporterEndorsement: false,
    };
  }

  componentDidMount () {
    // console.log('CampaignCommentForList componentDidMount');
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    const { campaignXSupporterId } = this.props;
    const campaignXSupporter = CampaignSupporterStore.getCampaignXSupporterById(campaignXSupporterId);
    const voterWeVoteId = VoterStore.getVoterWeVoteId();
    this.setState({
      campaignXSupporter,
      voterWeVoteId,
    });
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
    this.campaignSupporterStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
    const {
      seo_friendly_path: campaignSEOFriendlyPath,
    } = campaignX;
    let pathToUseToEditSupporterEndorsement;
    if (campaignSEOFriendlyPath) {
      pathToUseToEditSupporterEndorsement = `/c/${campaignSEOFriendlyPath}/why-do-you-support`;
    } else if (campaignXWeVoteId) {
      pathToUseToEditSupporterEndorsement = `/id/${campaignXWeVoteId}/why-do-you-support`;
    }
    this.setState({
      pathToUseToEditSupporterEndorsement,
    });
  }

  onCampaignSupporterStoreChange () {
    const { campaignXSupporterId } = this.props;
    const campaignXSupporter = CampaignSupporterStore.getCampaignXSupporterById(campaignXSupporterId);
    // console.log('onCampaignSupporterStoreChange campaignXSupporter:', campaignXSupporter);
    const voterWeVoteId = VoterStore.getVoterWeVoteId();
    this.setState({
      campaignXSupporter,
      voterWeVoteId,
    });
  }

  onHideFullSupporterEndorsement = () => {
    this.setState({
      showFullSupporterEndorsement: false,
    });
  }

  onShowFullSupporterEndorsement = () => {
    this.setState({
      showFullSupporterEndorsement: true,
    });
  }

  render () {
    renderLog('CampaignCommentForList');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignCommentForList window.location.href: ${window.location.href}`);
    }
    const { campaignXSupporter, pathToUseToEditSupporterEndorsement, showFullSupporterEndorsement, voterWeVoteId } = this.state;
    if (!campaignXSupporter || !('id' in campaignXSupporter)) {
      return null;
    }
    const {
      date_supported: dateSupported,
      id,
      supporter_endorsement: supporterEndorsement,
      supporter_name: supporterName,
      voter_we_vote_id: supporterVoterWeVoteId,
      we_vote_hosted_profile_image_url_tiny: voterPhotoUrlTiny,
    } = campaignXSupporter;
    const { sx, children } = speakerDisplayNameToInitials(supporterName);
    // console.log('supporterVoterWeVoteId:', supporterVoterWeVoteId);
    return (
      <Wrapper>
        <OneCampaignOuterWrapper>
          <OneCampaignInnerWrapper>
            <CommentWrapper className="comment" key={id}>
              <CommentVoterPhotoWrapper>
                {voterPhotoUrlTiny ? (
                  <LazyImage
                    src={voterPhotoUrlTiny}
                    placeholder={avatarGeneric()}
                    className="profile-photo"
                    height={48}
                    width={48}
                    alt="Your Settings"
                  />
                ) : (
                  <Avatar sx={sx}>{children}</Avatar>
                )}
              </CommentVoterPhotoWrapper>
              <CommentTextWrapper>
                <Comment>
                  {showFullSupporterEndorsement ? (
                    <div>
                      <CommentTextInnerWrapper>{supporterEndorsement}</CommentTextInnerWrapper>
                      <ReadMoreSpan
                        className="u-cursor--pointer u-link-underline"
                        onClick={this.onHideFullSupporterEndorsement}
                      >
                        Read less
                      </ReadMoreSpan>
                    </div>
                  ) : (
                    <TruncateMarkup
                      ellipsis={(
                        <div>
                          <ReadMoreSpan
                            className="u-cursor--pointer u-link-underline"
                            onClick={this.onShowFullSupporterEndorsement}
                          >
                            Read more
                          </ReadMoreSpan>
                        </div>
                      )}
                      lines={4}
                      tokenize="words"
                    >
                      <div>
                        {supporterEndorsement}
                      </div>
                    </TruncateMarkup>
                  )}
                </Comment>
                <CommentNameWrapper>
                  {!stringContains('Voter-', supporterName) && (
                    <CommentName>
                      {supporterName}
                      {' '}
                    </CommentName>
                  )}
                  supported
                  {' '}
                  {timeFromDate(dateSupported)}
                  {supporterVoterWeVoteId === voterWeVoteId && (
                    <>
                      &nbsp;&nbsp;&nbsp;
                      <Link to={pathToUseToEditSupporterEndorsement}>
                        Edit
                      </Link>
                    </>
                  )}
                </CommentNameWrapper>
              </CommentTextWrapper>
            </CommentWrapper>
          </OneCampaignInnerWrapper>
        </OneCampaignOuterWrapper>
      </Wrapper>
    );
  }
}
CampaignCommentForList.propTypes = {
  campaignXSupporterId: PropTypes.number,
  campaignXWeVoteId: PropTypes.string,
};

const styles = (theme) => ({
  accountCircleRoot: {
    color: '#999',
    height: 48,
    marginRight: 8,
    width: 48,
  },
  buttonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const Wrapper = styled('div')`
`;

export default withStyles(styles)(CampaignCommentForList);

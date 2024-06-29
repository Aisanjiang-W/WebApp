import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import DelayedLoad from './DelayedLoad';
import { isCordova } from '../../utils/isCordovaOrWebApp';
import VoterStore from '../../../stores/VoterStore';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ './OpenExternalWebSite'));

class LinkToAdminTools extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voter: null,
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange = () => {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  };

  render () {
    const { adminToolsUrl, linkId, linkTextNode } = this.props;
    const { voter } = this.state;
    return (
      <DelayedLoad waitBeforeShow={1000}>
        <LinkToAdminToolsWrapper>
          {/* Show links to this candidate in the admin tools */}
          {(voter && (voter.is_admin || voter.is_political_data_manager || voter.is_verified_volunteer)) && (
            <span className="u-wrap-links d-print-none">
              Admin only:
              {' '}
              <Suspense fallback={<></>}>
                <OpenExternalWebSite
                  linkIdAttribute={linkId || 'linkToAdminTools'}
                  url={adminToolsUrl}
                  target="_blank"
                  className="open-web-site open-web-site__no-right-padding"
                  body={linkTextNode || <span>edit</span>}
                />
              </Suspense>
            </span>
          )}
        </LinkToAdminToolsWrapper>
      </DelayedLoad>
    );
  }
}
LinkToAdminTools.propTypes = {
  linkId: PropTypes.string,
  linkTextNode: PropTypes.node,
  adminToolsUrl: PropTypes.string.isRequired,
};

const LinkToAdminToolsWrapper = styled('div')`
  margin-top: ${() => (isCordova() ? '100px' : '20px')};
  padding-bottom: ${() => (isCordova() ? '100px' : '20px')};
`;

export default LinkToAdminTools;

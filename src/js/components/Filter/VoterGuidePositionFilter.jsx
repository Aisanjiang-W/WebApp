import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import uniqBy from 'lodash-es/uniqBy';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FriendStore from '../../stores/FriendStore';
import getGroupedFilterSecondClass from './utils/grouped-filter-second-class';
import IssueStore from '../../stores/IssueStore';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../utils/logging';
import ShareStore from '../../stores/ShareStore';

const groupTypeIdentifiers = ['C', 'C3', 'C4', 'G', 'NP', 'O', 'P'];
const privateCitizenIdentifiers = ['I', 'V'];

class VoterGuidePositionFilter extends Component {
  static propTypes = {
    allItems: PropTypes.array,
    onFilteredItemsChange: PropTypes.func,
    onSelectSortByFilter: PropTypes.func,
    onToggleFilter: PropTypes.func,
    selectedFilters: PropTypes.array,
    showAllFilters: PropTypes.bool,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      issues: IssueStore.getAllIssues(),
      allItemsLength: 0,
      sortedBy: '',
    };
  }

  componentDidMount () {
    const { allItems } = this.props;
    let allItemsLength = 0;
    if (allItems) {
      allItemsLength = allItems.length || 0;
    }
    const currentFriendsOrganizationWeVoteIds = FriendStore.currentFriendsOrganizationWeVoteIDList();
    const currentSharedItemOrganizationWeVoteIds = ShareStore.currentSharedItemOrganizationWeVoteIDList();
    this.setState({
      allItemsLength,
      currentFriendsOrganizationWeVoteIds,
      currentFriendsOrganizationWeVoteIdsLength: currentFriendsOrganizationWeVoteIds.length,
      currentSharedItemOrganizationWeVoteIds,
      currentSharedItemOrganizationWeVoteIdsLength: currentSharedItemOrganizationWeVoteIds.length,
    });
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
  }

  componentDidUpdate (prevProps, prevState) {
    // console.log('VoterGuidePositionFilter componentDidUpdate:', prevProps.selectedFilters, this.props.selectedFilters);
    if ((JSON.stringify(prevProps.selectedFilters) !== JSON.stringify(this.props.selectedFilters)) ||
      (prevState.allItemsLength !== this.state.allItemsLength) ||
      (prevState.sortedBy !== this.state.sortedBy)
    ) {
      this.props.onFilteredItemsChange(this.getNewFilteredItems());
    }
    // console.log(this.state.issues);
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.organizationStoreListener.remove();
    this.shareStoreListener.remove();
  }

  onFriendStoreChange () {
    const currentFriendsOrganizationWeVoteIds = FriendStore.currentFriendsOrganizationWeVoteIDList();
    this.setState({
      currentFriendsOrganizationWeVoteIds,
      currentFriendsOrganizationWeVoteIdsLength: currentFriendsOrganizationWeVoteIds.length,
    });
  }

  onOrganizationStoreChange () {
    const { allItems } = this.props;
    const { allItemsLength } = this.state;
    let newAllItemsLength = 0;
    if (allItems) {
      newAllItemsLength = allItems.length || 0;
    }
    if (newAllItemsLength !== allItemsLength) {
      this.setState({
        allItemsLength: newAllItemsLength,
      });
    }
  }

  onShareStoreChange () {
    const currentSharedItemOrganizationWeVoteIds = ShareStore.currentSharedItemOrganizationWeVoteIDList();
    this.setState({
      currentSharedItemOrganizationWeVoteIds,
      currentSharedItemOrganizationWeVoteIdsLength: currentSharedItemOrganizationWeVoteIds.length,
    });
  }

  getFilteredItemsByLinkedIssue = (issueFilter) => {
    const { allItems } = this.props;
    return allItems.filter(item => item.issue_we_vote_ids_linked === issueFilter.issue_we_vote_id);
  };

  orderByCurrentFriendsFirst = (firstGuide, secondGuide) => {
    const secondGuideIsFromFriend = secondGuide && secondGuide.currentFriend === true ? 1 : 0;
    const firstGuideIsFromFriend = firstGuide && firstGuide.currentFriend === true ? 1 : 0;
    return secondGuideIsFromFriend - firstGuideIsFromFriend;
  };

  orderByFollowedOrgsFirst = (firstGuide, secondGuide) => secondGuide.followed - firstGuide.followed;

  orderByTwitterFollowers = (firstGuide, secondGuide) => secondGuide.twitter_followers_count - firstGuide.twitter_followers_count;

  orderByWrittenComment = (firstGuide, secondGuide) => {
    const secondGuideHasStatement = secondGuide && secondGuide.statement_text && secondGuide.statement_text.length ? 1 : 0;
    const firstGuideHasStatement = firstGuide && firstGuide.statement_text && firstGuide.statement_text.length ? 1 : 0;
    return secondGuideHasStatement - firstGuideHasStatement;
  };

  getNewFilteredItems = () => {
    const { allItems, selectedFilters } = this.props;
    // console.log('allItems:', allItems);
    const { currentFriendsOrganizationWeVoteIds, currentSharedItemOrganizationWeVoteIds } = this.state;
    // console.log('currentFriendsOrganizationWeVoteIds:', currentFriendsOrganizationWeVoteIds);
    let filteredItems = [];
    if (!selectedFilters || !selectedFilters.length) return allItems;
    // First, bring in only the kinds of organizations with checkmark
    selectedFilters.forEach((filter) => {
      switch (filter) {
        // case 'endorsingGroup':
        //   filteredItems = [...filteredItems, ...allItems.filter(item => groupTypeIdentifiers.includes(item.speaker_type))];
        //   break;
        // case 'individualVoter':
        //   filteredItems = [...filteredItems, ...allItems.filter(item => privateCitizenIdentifiers.includes(item.speaker_type) && !currentSharedItemOrganizationWeVoteIds.includes(item.speaker_we_vote_id))];
        //   break;
        // case 'newsOrganization':
        //   filteredItems = [...filteredItems, ...allItems.filter(item => item.speaker_type === 'NW')];
        //   break;
        // case 'publicFigure':
        //   filteredItems = [...filteredItems, ...allItems.filter(item => item.speaker_type === 'PF')];
        //   break;
        // case 'yourFriends':
        //   filteredItems = [...filteredItems, ...allItems.filter(item => currentFriendsOrganizationWeVoteIds.includes(item.speaker_we_vote_id) || currentSharedItemOrganizationWeVoteIds.includes(item.speaker_we_vote_id))];
        //   break;
        default:
          filteredItems = allItems; // Temp
          break;
      }
    });
    // Which showSupportFilter/showOpposeFilter/showCommentFilter to show?
    // Make sure one of them is chosen. If not, do not limit by support/oppose/comment
    let containsAtLeastOneSupportOpposeComment = false;
    selectedFilters.forEach((filter) => {
      switch (filter) {
        case 'showSupportFilter':
          containsAtLeastOneSupportOpposeComment = true;
          break;
        case 'showOpposeFilter':
          containsAtLeastOneSupportOpposeComment = true;
          break;
        case 'showInformationOnlyFilter':
          containsAtLeastOneSupportOpposeComment = true;
          break;
        default:
          break;
      }
    });
    if (containsAtLeastOneSupportOpposeComment) {
      const filterItemsSnapshot = filteredItems;
      filteredItems = [];
      selectedFilters.forEach((filter) => {
        switch (filter) {
          case 'showSupportFilter':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter(item => item.is_support_or_positive_rating)];
            break;
          case 'showOpposeFilter':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter(item => item.is_oppose_or_negative_rating)];
            break;
          case 'showInformationOnlyFilter':
            filteredItems = [...filteredItems, ...filterItemsSnapshot.filter(item => item.is_information_only)];
            break;
          default:
            break;
        }
      });
    }
    // Comment or no comment?
    let containsCommentFilter = false;
    selectedFilters.forEach((filter) => {
      switch (filter) {
        case 'showCommentFilter':
          containsCommentFilter = true;
          break;
        default:
          break;
      }
    });
    if (containsCommentFilter) {
      const filterItemsCommentSnapshot = filteredItems;
      filteredItems = [];
      selectedFilters.forEach((filter) => {
        switch (filter) {
          case 'showCommentFilter':
            filteredItems = [...filteredItems, ...filterItemsCommentSnapshot.filter(item => item.statement_text && item.statement_text.length)];
            break;
          default:
            break;
        }
      });
    }
    // Sort Order
    selectedFilters.forEach((filter) => {
      switch (filter) {
        case 'sortByAlphabetical':
          // console.log('sortByAlphabetical');
          this.setState({
            sortedBy: 'sortByAlphabetical',
          });
          break;
        default:
          // Skip over all other filters
          // console.log('sort by default, filter:', filter);
          // if (typeof filter === 'object') {
          //   // console.log('sort by object');
          //   filteredItems = [...filteredItems, ...this.getFilteredItemsByLinkedIssue(filter)];
          // }
          break;
      }
    });
    return uniqBy(filteredItems, x => x.position_we_vote_id);
  }

  toggleFilter = (name) => {
    this.props.onToggleFilter(name);
  }

  selectSortByFilter = (name) => {
    this.props.onSelectSortByFilter(name);
  }

  generateIssuesFilters = () => this.state.issues.slice(0, 1).map((item, itemIndex) => (
    <div
        key={item.filterName}
        className={`groupedFilter ${getGroupedFilterSecondClass(itemIndex, this.state.issues.length)} ${this.props.selectedFilters.indexOf(item.issue_we_vote_id) > -1 ? 'listFilterSelected' : ''}`}
        onClick={() => this.toggleFilter(item.filterName)}
    >
      {
          item.iconName ? (
            <div>
              <ion-icon className="ion" name={item.iconName} />
            </div>
          ) : null
      }
      {
        item.filterDisplayName ? (
          <span className="listFilter__text">
            &nbsp;
            {item.filterDisplayName}
          </span>
        ) : null
      }
    </div>
  ));

  render () {
    renderLog('VoterGuidePositionFilter');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, showAllFilters, selectedFilters } = this.props;
    // console.log('VoterGuidePositionFilter render');

    return (
      <Wrapper showAllFilters={showAllFilters}>
        <FilterRow>
          <FilterColumn>
            <b>Sort By</b>
            <SortByContainer>
              <SortBy selected={selectedFilters.indexOf('sortByAlphabetical') > -1} onClick={() => this.selectSortByFilter('sortByAlphabetical')}>Alphabetical</SortBy>
            </SortByContainer>
          </FilterColumn>
          <FilterColumn>
            <b>Endorsements From...</b>
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('yourFriends') > -1}
                  onChange={() => this.toggleFilter('yourFriends')}
                  value="yourFriends"
                  color="primary"
                />
              )}
              label="Your Friends"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('newsOrganization') > -1}
                  onChange={() => this.toggleFilter('newsOrganization')}
                  value="newsOrganization"
                  color="primary"
                />
              )}
              label="News"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('endorsingGroup') > -1}
                  onChange={() => this.toggleFilter('endorsingGroup')}
                  value="endorsingGroup"
                  color="primary"
                />
              )}
              label="Groups"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('publicFigure') > -1}
                  onChange={() => this.toggleFilter('publicFigure')}
                  value="publicFigure"
                  color="primary"
                />
              )}
              label="Public Figures"
            />
            <FormControlLabel
              classes={{ label: classes.formControlLabel }}
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf('individualVoter') > -1}
                  onChange={() => this.toggleFilter('individualVoter')}
                  value="individualVoter"
                  color="primary"
                />
              )}
              label="Private Citizens"
            />
          </FilterColumn>
        </FilterRow>
      </Wrapper>
    );
  }
}

const styles = theme => ({
  formControlLabel: {
    [theme.breakpoints.down('lg')]: {
      fontSize: 14,
    },
  },
});

const Wrapper = styled.div`
  display: ${({ showAllFilters }) => (showAllFilters ? 'flex' : 'none')};
  flex-flow: column;
  padding-top: 1rem;
`;

const FilterRow = styled.div`
  display: flex;
  flex-flow: row;
`;

const FilterColumn = styled.div`
  display: flex;
  flex-flow: column;
  margin-right: 2rem;
`;

const SortByContainer = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
`;

const SortBy = styled.p`
  font-size: ${({ selected }) => (selected ? '.95rem' : '.875rem')};
  margin: 8px 0 0 0;
  cursor: pointer;
  color: ${({ selected, theme }) => (selected ? theme.colors.brandBlue : '#555')};
  font-weight: ${({ selected }) => (selected ? '800' : '400')};
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 14px;
  }
  &:hover {
    filter: opacity(0.7);
  }
`;

export default withStyles(styles)(VoterGuidePositionFilter);
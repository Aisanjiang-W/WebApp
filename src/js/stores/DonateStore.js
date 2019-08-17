import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';

class DonateStore extends ReduceStore {
  getInitialState () {  // This is a mandatory override, so it can't be static.
    return {
    };
  }

  resetState () {
    return this.getInitialState();
  }

  donationSuccess () {
    return this.getState().success;
  }

  donationError () {
    return this.getState().errorMessageForVoter || '';
  }

  donationResponseReceived () {
    return this.getState().donationResponseReceived;
  }

  // Voter's donation history
  getVoterDonationHistory () {
    return this.getState().donationHistory || {};
  }

  getCouponMessage () {
    return this.getState().couponAppliedMessage || '';
  }

  getOrgSubscriptionAlreadyExists () {
    return this.getState().orgSubsAlreadyExists || false;
  }


  reduce (state, action) {
    if (!action.res) return state;
    const { error_message_for_voter: errorMessageForVoter, saved_stripe_donation: savedStripeDonation, status, success, donation_amount: donationAmount,
      donation_list: donationHistory, charge_id: charge, subscription_id: subscriptionId, monthly_donation: monthlyDonation,
      coupon_applied_message: couponAppliedMessage, coupon_match_found: couponMatchFound, coupon_still_valid: couponStillValid,
      discounted_price_monthly_credit: discountedPriceMonthlyCredit, list_price_monthly_credit: listPriceMonthlyCredit,
      org_subs_already_exists: orgSubsAlreadyExists,
    } = action.res;
    const donationAmountSafe = donationAmount || '';

    switch (action.type) {
      case 'donationWithStripe':
        if (success === false) {
          console.log(`donation with stripe failed:  ${errorMessageForVoter}  ---  ${status}`);
        }
        return {
          ...state,
          donationAmount: donationAmountSafe,
          errorMessageForVoter,
          monthlyDonation,
          savedStripeDonation,
          success,
          orgSubsAlreadyExists,
          donationResponseReceived: true,
        };

      case 'error-donateRetrieve':
        console.log(`error-donateRetrieve${action}`);
        return state;

      case 'donationCancelSubscription':
        console.log(`donationCancelSubscription: ${action}`);
        return {
          subscriptionId,
          donationHistory,
          donationCancelCompleted: false,
        };

      case 'donationHistory':
        // console.log('Donate Store, donationHistory: ', action);
        return {
          donationHistory,
        };

      case 'donationRefund':
        console.log(`donationRefund: ${action}`);
        return {
          charge,
          donationHistory,
          donationRefundCompleted: false,
        };

      case 'voterSignOut':
        // console.log("resetting DonateStore");
        return this.resetState();

      case 'validateCoupon':
        return {
          success: true,
          couponAppliedMessage,
          couponMatchFound,
          couponStillValid,
          discountedPriceMonthlyCredit,
          listPriceMonthlyCredit,
          status,
        };

      default:
        return state;
    }
  }
}

export default new DonateStore(Dispatcher);

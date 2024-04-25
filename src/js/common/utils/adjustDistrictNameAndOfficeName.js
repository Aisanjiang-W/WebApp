// adjustDistrictNameAndOfficeName.js

export default function adjustDistrictNameAndOfficeName (districtNameIncoming, officeNameIncoming) {
  let districtName = districtNameIncoming;
  let officeName = officeNameIncoming;
  if ((!officeNameIncoming || officeNameIncoming === '') && districtNameIncoming === 'United States') {
    // If we don't empty out districtName when 'United States', we end up with 'Candidate for United States'
    districtName = '';
    officeName = '';
  } else if (officeName && officeName.includes(districtName)) {
    // This removes districtName in cases like 'Governor of California for California'
    districtName = '';
  } else if (districtName && districtName.includes(officeName)) {
    // This removes officeName: 'Alcorn County Supervisor' with districtName: 'Alcorn County Supervisor District 2'
    officeName = '';
  } else if (districtName && districtName.endsWith(' city')) {
    const districtNameWithoutCity = districtName.slice(0, districtName.length - 5);
    if (officeName && officeName.includes(districtNameWithoutCity)) {
      // This removes districtName in cases like officeName: 'Mayor of Los Angeles' with districtName: 'Los Angeles city'
      districtName = '';
    }
  } else if (officeName && officeName === 'President of the United States') {
    // This removes districtName (i.e. State name) for candidates running for President
    districtName = '';
  }
  return { districtName, officeName };
}

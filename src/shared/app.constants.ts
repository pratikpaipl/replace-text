
export function createUrl(actionName: string): string {
  return `${actionName}`;
}
export const appApi = {

  EnablerListExcel: createUrl('enabler/valid_explorer_list_download'),
  EnablerDetailExcel: createUrl('enabler/enabler_detail_download'),
  EnablerListAdminExcel: createUrl('enabler/valid_explorer_list_admin_download'),
  EnablerDetailAdminExcel: createUrl('enabler/enabler_detail_admin_download'),
  EnablerFundraiseListAdminExcel: createUrl('enabler/valid_fundraise_submitted_at_enablers_list_admin_download'),
  EnablerFundingProfileListAdminExcel: createUrl('enabler/valid_funding_profile_submitted_at_enablers_list_admin_download'),
  EnablerMatchListExcel: createUrl('enabler/valid_match_list_download'),
  EnablerFundraiseListExcel: createUrl('enabler/valid_fundraise_submitted_at_enablers_list_download'),
  EnablerFundingProfileListExcel: createUrl('enabler/valid_funding_profile_submitted_at_enablers_list_download'),

  FNListAdminExcel: createUrl('fundraise/fn_list_admin_download'),
  FNDetailAdminExcel: createUrl('fundraise/fn_detail_admin_download'),
  FNsubmittedAtEnablersListAdminExcel: createUrl('fundraise/valid_submitted_at_enablers_list_admin_download'),

  FNsubmittedAtEnablersDetailAdminExcel: createUrl('fundraise/valid_submitted_at_enablers_details_admin_download'),
  fundingProfileReportListAdminExcel: createUrl('fundraise/valid_funding_profile_report_admin_download'),
  myFNListExcel: createUrl('fundraise/my_fn_list_download'),
  myFNDetailExcel: createUrl('fundraise/my_fn_detail_download'),
  myFNEnablerListExcel: createUrl('fundraise/my_fn_enabler_list_download'),
  FNsubmittedAtEnablersListExcel: createUrl('fundraise/valid_submitted_at_enablers_list_download'),
  FNsubmittedAtEnablersDetailExcel: createUrl('fundraise/valid_submitted_at_enablers_details_download'),
  myFNSubmittedAtEnablersListExcel: createUrl('fundraise/my_fn_submitted_at_enablers_list_download'),
  myFNSubmittedAtEnablersDetailExcel: createUrl('fundraise/my_fn_submitted_at_enablers_details_download'),
  exploreFNsubmittedAtEnablersDetailExcel: createUrl('fundraise/valid_submitted_at_enablers_details_explore_download'),

  FPListAdminExcel: createUrl('funding_profile/fp_list_admin_download'),
  FPDetailAdminExcel: createUrl('funding_profile/fp_detail_admin_download'),
  FPsubmittedAtEnablersListAdminExcel: createUrl('funding_profile/valid_submitted_at_enablers_list_admin_download'),
  FPsubmittedAtEnablersDetailAdminExcel: createUrl('funding_profile/valid_submitted_at_enablers_details_admin_download'),
  fundraiseReportListAdminExcel: createUrl('funding_profile/valid_fundraise_report_admin_download'),
  myFPListExcel: createUrl('funding_profile/my_fp_list_download'),
  myFPDetailExcel: createUrl('funding_profile/my_fp_detail_download'),
  myFPEnablerListExcel: createUrl('funding_profile/my_fp_enabler_list_download'),
  FPsubmittedAtEnablersListExcel: createUrl('funding_profile/valid_submitted_at_enablers_list_download'),
  FPsubmittedAtEnablersDetailExcel: createUrl('funding_profile/valid_submitted_at_enablers_details_download'),
  myFPSubmittedAtEnablersListExcel: createUrl('funding_profile/my_fp_submitted_at_enablers_list_download'),
  myFPSubmittedAtEnablersDetailExcel: createUrl('funding_profile/my_fp_submitted_at_enablers_details_download'),
  exploreFPsubmittedAtEnablersDetailExcel: createUrl('funding_profile/valid_submitted_at_enablers_details_explore_download'),
  
  fundraiseMatchReportAdminExcel: createUrl('report/fundraise_match_report_download'),
  fundingProfileMatchReportAdminExcel: createUrl('report/funding_profile_match_report_download'),
  fullReportAdminExcel: createUrl('report/full_report_download'),
  matchmakingReportAdminExcel: createUrl('report/matchmaking_report_download'),
  myFullMatchReportExcel: createUrl('report/my_full_match_report_download'),
  myFPMatchReportExcel: createUrl('report/my_fp_match_report_download'),
  myFNMatchReportExcel: createUrl('report/my_fn_match_report_download'),
  summaryReportExcel: createUrl('report/summary_report_download'),
  
  
  
  permissionListExcel: createUrl('admin_role/page_user_list_download'),

  /* Delete */
  enablerDelete: 'enabler/delete',
  userDelete: 'user/delete',
  roleDelete: 'admin_role/delete_page_access_role',
};
export const permission = {

  add_download: 'add,download_all',
  add_import_download: 'add,import_shop_location,download_all',
  add_download_transfer_ownership: 'add,download_all,transfer_ownership'

}
export const actType = {

  OnType: "OnType",
  fromDetails: "fromDetails",
  enabler: 'enabler',
  enabler_permission: 'enabler_permission',

  funding_profile: 'funding_profile',
  funding_profile_enabler: 'funding_profile_enabler',

  fundraise: 'fundraise',
  fundraise_enabler: 'fundraise_enabler',

  funding_profile_fundraise: 'funding_profile_fundraise',
  fundraise_funding_profile: 'fundraise_funding_profile',

  compnay: 'company',

  all: 'all',
  admin_role: 'admin_role',
  user: 'user',
};
export const PermissionKey = {

  download: 'download',
  download_all: 'download_all',
  add: 'add',
  add_label_brand: 'add_label_brand',
  add_page_user: 'add_page_user',
  download_page_user: 'download_page_user',
  transfer_ownership: 'transfer_ownership',

}
export const appURL = {
  baseUrl: `api/`,
};

export class AppConstants { }

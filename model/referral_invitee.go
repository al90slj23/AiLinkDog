package model

type ReferralInvitee struct {
	ID              int    `json:"id"`
	Username        string `json:"username"`
	DisplayName     string `json:"display_name"`
	Email           string `json:"email"`
	Status          int    `json:"status"`
	AffQuota        int    `json:"aff_quota"`
	AffHistoryQuota int    `json:"aff_history_quota"`
}

func ListReferralInviteesByInviterID(inviterID int) ([]ReferralInvitee, error) {
	var invitees []ReferralInvitee
	err := DB.Model(&User{}).
		Select("id, username, display_name, email, status, aff_quota, aff_history as aff_history_quota").
		Where("inviter_id = ?", inviterID).
		Order("id desc").
		Find(&invitees).Error
	return invitees, err
}

package controller

type CreateReferralLinkRequest struct {
	ChannelNote  string `json:"channel_note"`
	ValidityDays int    `json:"validity_days"`
}

type SelectReferralPlanRequest struct {
	PlanID int `json:"plan_id"`
}

type CreateReferralWithdrawalRequest struct {
	Amount         int    `json:"amount"`
	PaymentMethod  string `json:"payment_method"`
	PaymentAccount string `json:"payment_account"`
	PaymentName    string `json:"payment_name"`
	Remark         string `json:"remark"`
}

type ProcessReferralWithdrawalRequest struct {
	WithdrawalID int    `json:"withdrawal_id"`
	Action       string `json:"action"`
	AdminRemark  string `json:"admin_remark"`
}

type ReferralSuccessResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    any    `json:"data"`
}

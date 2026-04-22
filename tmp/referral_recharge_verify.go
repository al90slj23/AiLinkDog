package main

import (
	"fmt"
	"os"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"gorm.io/gorm"
)

func must(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {
	model.InitDB()
	defer model.CloseDB()

	resetSQL := []string{
		"delete from referral_commissions",
		"delete from referral_links",
		"delete from referral_accounts",
		"delete from referral_withdrawals",
		"delete from referral_plans",
		"delete from top_ups where trade_no = 'REFTEST001'",
		"delete from users where id in (2,3)",
		"update users set quota = 100000000, aff_count = 0, aff_quota = 0, aff_history = 0 where id = 1",
	}
	for _, sql := range resetSQL {
		must(model.DB.Exec(sql).Error)
	}

	pass, err := common.Password2Hash("RefTest@123")
	must(err)

	userB := &model.User{Id: 2, Username: "ref_b", Password: pass, DisplayName: "ref_b", Role: common.RoleCommonUser, Status: common.UserStatusEnabled, Group: "default", AffCode: "bCd1", InviterId: 1}
	userC := &model.User{Id: 3, Username: "ref_c", Password: pass, DisplayName: "ref_c", Role: common.RoleCommonUser, Status: common.UserStatusEnabled, Group: "default", AffCode: "cEf2", InviterId: 2}
	must(model.DB.Create(userB).Error)
	must(model.DB.Create(userC).Error)

	plan := &model.ReferralPlan{
		ID:                 1,
		Name:               "测试方案",
		Description:        "验证链路",
		PlanType:           1,
		IsActive:           true,
		ProfitSharePercent: 80,
		MinChannelProfit:   20,
		Level1Percent:      60,
		Level2Percent:      40,
	}
	must(model.DB.Create(plan).Error)
	must(model.DB.Create(&model.ReferralAccount{UserID: 2, PlanID: 1}).Error)
	must(model.DB.Create(&model.ReferralAccount{UserID: 1, PlanID: 1}).Error)
	must(model.DB.Create(&model.ReferralLink{ID: 1, UserID: 2, PlanID: 1, Code: "link-b", FullURL: "http://localhost:3000/register?aff=bCd1", ChannelNote: "b-link", ValidityDays: 30, IsActive: true}).Error)
	must(model.DB.Create(&model.ReferralLink{ID: 2, UserID: 1, PlanID: 1, Code: "link-a", FullURL: "http://localhost:3000/register?aff=jzTy", ChannelNote: "a-link", ValidityDays: 30, IsActive: true}).Error)

	topup := &model.TopUp{UserId: 3, Amount: 100, Money: 100, TradeNo: "REFTEST001", PaymentMethod: model.PaymentMethodWaffo, CreateTime: common.GetTimestamp(), Status: common.TopUpStatusPending}
	must(model.DB.Create(topup).Error)
	must(model.DB.Transaction(func(tx *gorm.DB) error {
		topupRow := &model.TopUp{}
		if err := tx.Where("trade_no = ?", "REFTEST001").First(topupRow).Error; err != nil {
			return err
		}
		topupRow.Status = common.TopUpStatusSuccess
		topupRow.CompleteTime = common.GetTimestamp()
		if err := tx.Save(topupRow).Error; err != nil {
			return err
		}
		quotaToAdd := int64(topupRow.Amount) * int64(common.QuotaPerUnit)
		if err := tx.Model(&model.User{}).Where("id = ?", topupRow.UserId).Update("quota", gorm.Expr("quota + ?", quotaToAdd)).Error; err != nil {
			return err
		}
		return nil
	}))
	must(model.ProcessReferralCommissionsForTopUp(3, 100))

	var topupRow model.TopUp
	must(model.DB.Where("trade_no = ?", "REFTEST001").First(&topupRow).Error)

	var users []model.User
	must(model.DB.Where("id in (1,2,3)").Order("id asc").Find(&users).Error)

	var commissions []model.ReferralCommission
	must(model.DB.Order("id asc").Find(&commissions).Error)

	fmt.Println("TOPUP_STATUS", topupRow.Status)
	for _, user := range users {
		fmt.Printf("USER %d %s quota=%d aff_count=%d aff_quota=%d aff_history=%d inviter_id=%d\n", user.Id, user.Username, user.Quota, user.AffCount, user.AffQuota, user.AffHistoryQuota, user.InviterId)
	}
	for _, c := range commissions {
		fmt.Printf("COMMISSION id=%d user_id=%d invitee_user_id=%d level=%d top_up_amount=%d commission_quota=%d status=%s\n", c.ID, c.UserID, c.InviteeUserID, c.Level, c.TopUpAmount, c.CommissionQuota, c.Status)
	}

	if len(commissions) != 2 {
		fmt.Println("EXPECTED 2 COMMISSIONS, GOT", len(commissions))
		os.Exit(2)
	}
}

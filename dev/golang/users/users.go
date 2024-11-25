package users

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// User モデルの定義
type User struct {
	UserID       string `json:"user_id" gorm:"primaryKey;column:user_id"`
	MailAddress  string `json:"mail_address" gorm:"column:mail_address;unique;not null"`
	Password     string `json:"password" gorm:"column:password;not null"`
	GeminiApiKey string `json:"gemini_api_key" gorm:"column:gemini_api_key"`
	IsDelete     bool   `json:"is_delete" gorm:"column:is_delete;default:false"`
}

// NewPassword モデルの定義
type NewPassword struct {
	UserID      string `json:"user_id"`
	Password    string `json:"password"`
	NewPassword string `json:"new_password"`
}

// フロントエンドからのデータの受け渡し
func bindUser(c *gin.Context) (*User, error) {
	var user User

	// データの受け取り
	err := c.ShouldBindJSON(&user)
	if err != nil {
		// エラーハンドリング
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "JSON形式ではありません",
			"error":         err.Error(),
		})
		return nil, err
	}

	// エラーがない場合は、user を返す
	return &user, nil
}

// データを受け取る関数
func GetUser(c *gin.Context, db *gorm.DB) {
	var user User
	result := db.Find(&user) // GORMのFind()メソッドを使用
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": result.Error.Error(),
		})
		return
	}

	fmt.Printf("%+v\n", user) // デバッグ出力の改善

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

// ハッシュ化を行う関数
func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// パスワードを比較する関数
func comparePasswords(hashedPassword, plainPassword string) error {
	// bcryptでハッシュ化されたパスワードと平文のパスワードを比較
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword))
}

// ユーザをデータベースに保存する関数
func CreateUser(c *gin.Context, db *gorm.DB) {
	// データの受け取り
	user, err := bindUser(c)
	if err != nil {
		return
	}

	// メールアドレスの重複チェック
	var existingUser User
	overlapResult := db.Where("mail_address = ? AND is_delete = ?", user.MailAddress, false).First(&existingUser)

	if overlapResult.Error == nil { // レコードが見つかった場合（つまりメールアドレスが既に存在する）
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "このメールアドレスは既に登録されています",
		})
		return
	} else if !errors.Is(overlapResult.Error, gorm.ErrRecordNotFound) { // 予期せぬエラーの場合
		c.JSON(http.StatusInternalServerError, gin.H{
			"StatusMessage": "Failed",
			"message":       "データベースエラーが発生しました",
			"error":         overlapResult.Error.Error(),
		})
		return
	}

	// パスワードのハッシュ化
	hashedPassword, err := hashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"StatusMessage": "Failed",
			"message":       "パスワードのハッシュ化に失敗しました",
			"error":         err.Error(),
		})
		return
	}
	user.Password = hashedPassword

	// データベースに保存
	result := db.Create(&user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"StatusMessage": "Failed",
			"message":       "データベースに保存できませんでした",
			"error":         result.Error.Error(),
		})
		return
	}

	// 保存成功
	c.JSON(http.StatusOK, gin.H{
		"StatusMessage": "Success",
	})
}

// 過去のユーザー情報を消し、新たにユーザーを作成する関数
func ReCreateUser(c *gin.Context, db *gorm.DB) {
	// データの受け取り
	user, err := bindUser(c)
	if err != nil {
		return
	}

	fmt.Printf("%+v\n", user)

	// メールアドレスを基にレコードを完全に削除
	deleteResult := db.Where("mail_address = ?", user.MailAddress).Delete(&User{})
	if deleteResult.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"StatusMessage": "Failed",
			"message":       "ユーザー情報を削除できませんでした",
			"error":         deleteResult.Error.Error(),
		})
		return
	}

	// 削除が成功したか確認
	if deleteResult.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"StatusMessage": "Failed",
			"message":       "指定されたメールアドレスのユーザーが存在しません",
		})
		return
	}

	// パスワードのハッシュ化
	hashedPassword, err := hashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"StatusMessage": "Failed",
			"message":       "パスワードのハッシュ化に失敗しました",
			"error":         err.Error(),
		})
		return
	}
	user.Password = hashedPassword

	// データベースに保存
	result := db.Create(&user)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"StatusMessage": "Failed",
			"message":       "データベースに保存できませんでした",
			"error":         result.Error.Error(),
		})
		return
	}

	// 保存成功
	c.JSON(http.StatusOK, gin.H{
		"StatusMessage": "Success",
	})
}

// ユーザー情報を復元するAPI
func RestorationUser(c *gin.Context, db *gorm.DB) {
	// データの受け取り
	user, err := bindUser(c)
	if err != nil {
		return
	}

	// メールアドレスが存在しているか確認
	var dbUser User
	overlapResult := db.Where("mail_address = ?", user.MailAddress).First(&dbUser)

	if overlapResult.Error != nil { // メールアドレスが存在しなかった場合
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "このメールアドレスは存在しません",
			"error":         overlapResult.Error.Error(),
		})
		return
	}

	// パスワードの比較
	if err := comparePasswords(dbUser.Password, user.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"StatusMessage": "Failed",
			"message":       "パスワードが間違っています",
		})
		return
	}

	// 論理削除を解除
	dbUser.IsDelete = false

	updateResult := db.Save(dbUser)
	if updateResult.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "ユーザー情報を復元できませんでした",
			"error":         updateResult.Error.Error(),
		})
		return
	}

	// 更新成功
	c.JSON(http.StatusOK, gin.H{
		"StatusMessage": "Success",
	})
}

// ユーザーを認証する関数
func LoginUser(c *gin.Context, db *gorm.DB) {
	// データの受け取り
	user, err := bindUser(c)
	if err != nil {
		return
	}

	// メールアドレスが存在しているか確認
	var dbUser User
	overlapResult := db.Where("mail_address = ?", user.MailAddress).First(&dbUser)

	if overlapResult.Error != nil { // メールアドレスが存在しなかった場合
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "このメールアドレスは存在しません",
			"error":         overlapResult.Error.Error(),
		})
		return
	}

	// パスワードの比較
	if err := comparePasswords(dbUser.Password, user.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"StatusMessage": "Failed",
			"message":       "パスワードが間違っています",
		})
		return
	}

	fmt.Printf("%+v\n", dbUser)

	// userIdを返す
	c.JSON(http.StatusOK, gin.H{
		"StatusMessage": "Success",
		"UserId":        dbUser.UserID,
	})
}

// ユーザーを削除する関数
func DeleteUser(c *gin.Context, db *gorm.DB) {
	// データの受け取り
	user, err := bindUser(c)
	if err != nil {
		return
	}

	// user_idに一致するデータがあるか確認する
	var dbUser User
	overlapResult := db.Where("user_id = ?", user.UserID).First(&dbUser)

	if overlapResult.Error != nil { // user_idが存在しなかった場合
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "UserIdが存在しません",
			"error":         overlapResult.Error.Error(),
		})
		return
	}

	// 削除状態を更新する
	dbUser.IsDelete = true
	updateResult := db.Save(dbUser)
	if updateResult.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "ユーザーを削除できませんでした",
			"error":         updateResult.Error.Error(),
		})
		return
	}

	// 更新成功
	c.JSON(http.StatusOK, gin.H{
		"StatusMessage": "Success",
	})
}

// passwordを更新する関数
func ChangePassword(c *gin.Context, db *gorm.DB) {
	// データの受け取り
	var newPassword NewPassword

	// データの受け取り
	err := c.ShouldBindJSON(&newPassword)
	if err != nil {
		// エラーハンドリング
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "JSON形式ではありません",
			"error":         err.Error(),
		})
		return
	}

	// user_idに一致するデータがあるか確認する
	var dbUser User
	overlapResult := db.Where("user_id = ?", newPassword.UserID).First(&dbUser)

	if overlapResult.Error != nil { // user_idが存在しなかった場合
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "UserIdが存在しません",
			"error":         overlapResult.Error.Error(),
		})
		return
	}

	// パスワードの比較
	if err := comparePasswords(dbUser.Password, newPassword.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"StatusMessage": "Failed",
			"message":       "パスワードが間違っています",
		})
		return
	}

	// パスワードのハッシュ化
	hashedPassword, err := hashPassword(newPassword.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"StatusMessage": "Failed",
			"message":       "パスワードのハッシュ化に失敗しました",
			"error":         err.Error(),
		})
		return
	}
	newPassword.NewPassword = hashedPassword

	// パスワードを更新する
	dbUser.Password = newPassword.NewPassword
	updateResult := db.Save(dbUser)
	if updateResult.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "パスワードを更新できませんでした",
			"error":         updateResult.Error.Error(),
		})
		return
	}

	// 更新成功
	c.JSON(http.StatusOK, gin.H{
		"StatusMessage": "Success",
	})

	fmt.Printf("%+v\n", newPassword) // デバッグ出力の改善
	fmt.Printf("%+v\n", dbUser)      // デバッグ出力の改善
}

// Passwordを認証する関数
func AuthenticationPassword(c *gin.Context, db *gorm.DB) {
	// データの受け取り
	user, err := bindUser(c)
	if err != nil {
		return
	}

	fmt.Printf("%+v\n", user)

	// user_idに一致するデータがあるか確認する
	var dbUser User
	overlapResult := db.Where("user_id = ?", user.UserID).First(&dbUser)

	if overlapResult.Error != nil { // user_idが存在しなかった場合
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "UserIdが存在しません",
			"error":         overlapResult.Error.Error(),
		})
		return
	}

	// パスワードの比較
	if err := comparePasswords(dbUser.Password, user.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"StatusMessage": "Failed",
			"message":       "パスワードが間違っています",
		})
		return
	}

	// 更新成功
	c.JSON(http.StatusOK, gin.H{
		"StatusMessage": "Success",
	})
}

// GeminiApiKeyを保存する関数
func SaveGeminiApiKey(c *gin.Context, db *gorm.DB) {
	// データの受け取り
	user, err := bindUser(c)
	if err != nil {
		return
	}

	// user_idに一致するデータがあるか確認する
	var dbUser User
	overlapResult := db.Where("user_id = ?", user.UserID).First(&dbUser)

	if overlapResult.Error != nil { // user_idが存在しなかった場合
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "UserIdが存在しません",
			"error":         overlapResult.Error.Error(),
		})
		return
	}

	// gemini_api_keyを保存する
	dbUser.GeminiApiKey = user.GeminiApiKey
	updateResult := db.Save(dbUser)
	if updateResult.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "GeminiApiKeyを保存できませんでした",
			"error":         updateResult.Error.Error(),
		})
		return
	}

	// 更新成功
	c.JSON(http.StatusOK, gin.H{
		"StatusMessage": "Success",
	})
}

// GeminiApiKeyを取得する関数
func GetGeminiApiKey(c *gin.Context, db *gorm.DB) {
	// データの受け取り
	user, err := bindUser(c)
	if err != nil {
		return
	}

	// user_idに一致するデータがあるか確認する
	var dbUser User
	overlapResult := db.Where("user_id = ?", user.UserID).First(&dbUser)

	if overlapResult.Error != nil { // user_idが存在しなかった場合
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "UserIdが存在しません",
			"error":         overlapResult.Error.Error(),
		})
		return
	}

	// 更新成功
	c.JSON(http.StatusOK, gin.H{
		"StatusMessage": "Success",
		"GeminiApiKey":  dbUser.GeminiApiKey,
	})
}

// データベース内のユーザー情報を確認する関数
func CheckUser(c *gin.Context, db *gorm.DB) {
	// データの受け取り
	user, err := bindUser(c)
	if err != nil {
		return
	}

	// mail_addressに一致するデータがあるか確認する
	var dbUser User
	overlapResult := db.Where("mail_address = ?", user.MailAddress).First(&dbUser)

	if overlapResult.Error != nil { // mail_addressが存在しなかった場合
		c.JSON(http.StatusOK, gin.H{
			"StatusMessage": "Success",
			"case":          "possible",
		})
		return
	}

	fmt.Printf("%+v\n", dbUser.IsDelete)

	if !dbUser.IsDelete { // データベース内のユーザー情報のis_deleteがfalseの場合
		c.JSON(http.StatusOK, gin.H{
			"StatusMessage": "Success",
			"case":          "impossible",
		})
	} else { // データベース内のユーザー情報のis_deleteがtrueの場合
		c.JSON(http.StatusOK, gin.H{
			"StatusMessage": "Success",
			"case":          "restoration",
		})
	}
}

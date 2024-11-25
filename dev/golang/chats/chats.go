package chats

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Rooms struct {
	RoomID            string `json:"room_id" gorm:"primaryKey;column:room_id"`
	CsvID             string `json:"csv_id" gorm:"not null;column:csv_id"`
	VisualizationType string `json:"visualization_type" gorm:"not null;column:visualization_type"`
	Vertical          string `json:"vertical" gorm:"not null;column:vertical"`
	Horizontal        string `json:"horizontal" gorm:"not null;column:horizontal"`
	Target            string `json:"target" gorm:"not null;column:target"`
	Regression        string `json:"regression" gorm:"not null;column:regression"`
}

type Chats struct {
	ChatID   string `json:"chat_id" gorm:"primaryKey;column:chat_id"`
	RoomID   string `json:"room_id" gorm:"not null;column:room_id"`
	Message  string `json:"message" gorm:"not null;column:message"`
	PostID   int    `json:"post_id" gorm:"not null;column:post_id"`
	UserChat bool   `json:"user_chat" gorm:"not null;column:user_chat"`
}

type RoomId struct {
	RoomID string `json:"room_id"`
}

// roomテーブルにroom_idを保存する関数
func SaveRoomId(c *gin.Context, db *gorm.DB) {
	var room Rooms

	// データ受け取り
	err := c.ShouldBindJSON(&room)
	if err != nil {
		// エラーハンドリング
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "JSON形式ではありません",
			"error":         err.Error(),
		})
		return
	}

	// データベースに保存
	result := db.Create(&room)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"StatusMessage": "Failed",
			"message":       "データベースに保存されませんでした",
			"error":         result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"StatusMessage": "Success",
	})
}

// chatを保存する関数
func SaveChat(c *gin.Context, db *gorm.DB) {
	var chat Chats

	// データ受け取り
	err := c.ShouldBindJSON(&chat)
	if err != nil {
		// エラーハンドリング
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "JSON形式ではありません",
			"error":         err.Error(),
		})
		return
	}

	// データベースに保存
	result := db.Create(&chat)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"StatusMessage": "Failed",
			"message":       "データベースに保存されませんでした",
			"error":         result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"StatusMessage": "Success",
	})
}

// chatを取得する関数
func GetChats(c *gin.Context, db *gorm.DB) {
	var room Rooms

	// データ受け取り
	err := c.ShouldBindJSON(&room)
	if err != nil {
		// エラーハンドリング
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "JSON形式ではありません",
			"error":         err.Error(),
		})
		return
	}

	// room_idの取得
	var dbRoom Rooms
	roomResult := db.Where("csv_id = ? AND visualization_type = ? AND vertical = ? AND target = ? AND regression = ?", room.CsvID, room.VisualizationType, room.Vertical, room.Target, room.Regression).First(&dbRoom)

	if roomResult.Error != nil { // レコードが見つからなかった場合
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Success",
			"chats":         []string{},
		})
		return
	}

	// room_idを基にchatsテーブルからチャットを取得する
	var dbChats []Chats
	searchChatsResult := db.Where("room_id = ?", dbRoom.RoomID).Order("post_id ASC").Find(&dbChats)

	if searchChatsResult.Error != nil { // 通信エラーの場合
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "データベースに通信出来ませんでした",
			"error":         searchChatsResult.Error.Error(),
		})
		return
	}

	// データベースから取得したchatを渡す
	c.JSON(http.StatusOK, gin.H{
		"StatusMessage": "Success",
		"chats":         dbChats,
	})
}

// chatをリセットする関数
func ResetChats(c *gin.Context, db *gorm.DB) {
	var roomId RoomId

	// データ受け取り
	err := c.ShouldBindJSON(&roomId)
	if err != nil {
		// エラーハンドリング
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "JSON形式ではありません",
			"error":         err.Error(),
		})
		return
	}

	// Chatsテーブルのレコードを全て削除
	deleteChatsResult := db.Where("room_id = ?", roomId.RoomID).Delete(&Chats{})
	if deleteChatsResult.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"StatusMessage": "Failed",
			"message":       "Chatsテーブルのレコードを削除できませんでした",
			"error":         deleteChatsResult.Error.Error(),
		})
		return
	}

	// Roomsテーブルのレコードを削除
	deleteRoomsResult := db.Where("room_id = ?", roomId.RoomID).Delete(&Rooms{})
	if deleteRoomsResult.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"StatusMessage": "Failed",
			"message":       "Roomsテーブルのレコードを削除できませんでした",
			"error":         deleteRoomsResult.Error.Error(),
		})
		return
	}

	// データベースから特定のroom_idのレコードを消せたとき
	c.JSON(http.StatusOK, gin.H{
		"StatusMessage": "Success",
	})
}

package main

import (
	// "db/main/csvs"
	"fmt"
	"log"
	"os"
	"time"

	"local.package/csvs"
	"local.package/users"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// test csv モデルの定義
type TestCsv struct {
	CsvFile  []byte `json:"csv_file" gorm:"type:bytea"`
	JsonFile []byte `json:"json_file" gorm:"type:bytea"`
}

func main() {
	// .envファイルから環境変数を読み込む
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// 環境変数から接続情報を取得
	dbUser := os.Getenv("POSTGRES_USER")
	dbPassword := os.Getenv("POSTGRES_PASSWORD")
	dbName := os.Getenv("POSTGRES_DB")
	dbHost := "localhost" // または環境変数から取得
	dbPort := "5432"      // または環境変数から取得

	// DSNを構築
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Tokyo", dbHost, dbUser, dbPassword, dbName, dbPort)

	// GORMでデータベースに接続
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Ginエンジンのインスタンスを作成
	r := gin.Default()

	// CORSミドルウェアの設定
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5000"}, // ReactとFlaskのオリジン
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// users
	// ルートURL ("/") に対するGETリクエストをハンドル
	r.GET("/", func(c *gin.Context) {
		users.GetUser(c, db)
	})

	// ユーザーを保存するAPI
	r.POST("/users/create", func(c *gin.Context) {
		users.CreateUser(c, db)
	})

	// ユーザーを認証するAPI
	r.POST("/users/login", func(c *gin.Context) {
		users.LoginUser(c, db)
	})

	// Passwordを変更するAPI
	r.POST("/users/change/password", func(c *gin.Context) {
		users.ChangePassword(c, db)
	})

	// GeminiApiKeyを保存するAPI
	r.POST("/users/save/api", func(c *gin.Context) {
		users.SaveGeminiAipKey(c, db)
	})

	// csvs
	// CSVファイルをアップロードするAPI
	r.POST("/upload_csv", func(c *gin.Context) {
		csvs.UploadCsv(c, db)
	})

	// CSV ファイルを取得するエンドポイント
	r.GET("/get_csv/:csv_id", func(c *gin.Context) {
		csvs.GetCsv(c, db)
	})

	// CSVファイルの簡易情報を取得するAPI
	r.POST("/csvs/get/small", func(c *gin.Context) {
		csvs.GetCsvData(c, db)
	})

	// 8080ポートでサーバーを起動
	r.Run(":8080")
}

package main

import (
	// "db/main/csvs"
	"fmt"
	"log"
	"os"
	"time"

	"local.package/csvs"
	"local.package/users"

	"github.com/cenkalti/backoff/v4"
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

	// バックオフ設定
	b := backoff.NewExponentialBackOff()
	b.MaxElapsedTime = 30 * time.Second

	// GORMでデータベースに接続
	// 接続試行の設定
	maxRetries := 5
	retryInterval := time.Second * 3

	var db *gorm.DB
	for i := 0; i < maxRetries; i++ {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err == nil {
			log.Printf("Successfully connected to database on attempt %d\n", i+1)
			break
		}
		if i < maxRetries-1 {
			log.Printf("Failed to connect to database (attempt %d/%d): %v\n", i+1, maxRetries, err)
			time.Sleep(retryInterval)
		}
	}

	if err != nil {
		log.Fatal("Failed to connect to database after all attempts:", err)
	}
	// db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	// if err != nil {
	// 	log.Fatal("Failed to connect to database:", err)
	// }

	// Ginエンジンのインスタンスを作成
	r := gin.Default()

	// CORSミドルウェアの設定
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:5000"}, // ReactとFlaskのオリジン
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

	// 過去のユーザー情報を消し、新たにユーザーを登録するAPI
	r.POST("/users/recreate", func(c *gin.Context) {
		users.ReCreateUser(c, db)
	})

	// 過去のユーザー情報を復元するAPI
	r.POST("users/restoration", func(c *gin.Context) {
		users.RestorationUser(c, db)
	})

	// ユーザーを認証するAPI
	r.POST("/users/login", func(c *gin.Context) {
		users.LoginUser(c, db)
	})

	// ユーザーを削除するAPI
	r.POST("/users/delete", func(c *gin.Context) {
		users.DeleteUser(c, db)
	})

	// Passwordを変更するAPI
	r.POST("/users/change/password", func(c *gin.Context) {
		users.ChangePassword(c, db)
	})

	// Passwordを認証するAPI
	r.POST("/users/check/password", func(c *gin.Context) {
		users.AuthenticationPassword(c, db)
	})

	// GeminiApiKeyを保存するAPI
	r.POST("/users/save/api", func(c *gin.Context) {
		users.SaveGeminiApiKey(c, db)
	})

	// GeminiApiKeyを取得するAPI
	r.POST("/users/get/api", func(c *gin.Context) {
		users.GetGeminiApiKey(c, db)
	})

	// データベース内のユーザー情報を確認するAPI
	r.POST("/uesrs/check/user", func(c *gin.Context) {
		users.CheckUser(c, db)
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

	// CSVファイルの情報を取得するAPI
	r.POST("/csvs/get", func(c *gin.Context) {
		csvs.GetCsvData(c, db)
	})

	// CSVファイルを更新するAPI
	r.POST("/csvs/update", func(c *gin.Context) {
		csvs.UpdateCSV(c, db)
	})

	// CSVファイルを削除するAPI
	r.POST("/csvs/delete", func(c *gin.Context) {
		csvs.DeleteCSV(c, db)
	})

	// CSVファイルを復元するAPI
	r.POST("/csvs/restoration", func(c *gin.Context) {
		csvs.RestorationCSV(c, db)
	})

	// 8080ポートでサーバーを起動
	r.Run(":8080")
}

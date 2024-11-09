package csvs

import (
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// csv モデルの定義
type Csv struct {
	CsvID            string    `json:"csv_id" gorm:"primaryKey;column:csv_id"`
	CsvFile          []byte    `json:"csv_file" gorm:"not null;column:csv_file"`
	JsonFile         []byte    `json:"json_file" gorm:"not null;column:json_file"`
	UserID           string    `json:"user_id" gorm:"not null;column:user_id"`
	FileName         string    `json:"file_name" gorm:"not null;column:file_name"`
	DataSize         int       `json:"data_size" gorm:"not null;column:data_size"`
	DataColumns      int       `json:"data_columns" gorm:"not null;column:data_columns"`
	DataRows         int       `json:"data_rows" gorm:"not null;column:data_rows"`
	UploadDate       time.Time `json:"upload_date" gorm:"default:CURRENT_TIMESTAMP;column:upload_date"`
	LastAccessedDate time.Time `json:"last_accessed_date" gorm:"default:CURRENT_TIMESTAMP;column:last_accessed_date"`
	IsDelete         bool      `json:"is_delete" gorm:"column:is_delete;default:false"`
}

// front モデルの定義
type Front struct {
	CsvID  string `json:"csv_id" gorm:"primaryKey;column:csv_id"`
	UserID string `json:"user_id" gorm:"not null;column:user_id"`
}

// フロントエンドからのデータの受け渡し
func bindFront(c *gin.Context) (*Front, error) {
	var front Front

	// データの受け取り
	err := c.ShouldBindJSON(&front)
	if err != nil {
		// エラーハンドリング
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "JSON形式ではありません",
			"error":         err.Error(),
		})
		return nil, err
	}

	// エラーがない場合は、front を返す
	return &front, nil
}

// csvファイルを取得する関数
func GetCsv(c *gin.Context, db *gorm.DB) {
	// パラメータから csv_id を取得
	csvID := c.Param("csv_id")

	// データベースから特定の csv_id に基づいて CSV ファイルを検索
	var csvFile Csv
	result := db.First(&csvFile, "csv_id = ?", csvID) // csv_id に基づいて 1 件のレコードを検索
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			// レコードが見つからない場合
			c.JSON(http.StatusNotFound, gin.H{"error": "CSV file not found"})
		} else {
			// その他のエラー
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch CSV file"})
		}
		return
	}

	// レスポンスとして取得したファイルを返す
	fileData := map[string]interface{}{
		"csv_id":    csvFile.CsvID,
		"csv_file":  csvFile.CsvFile,
		"json_file": csvFile.JsonFile,
		// 必要に応じて他のメタデータも追加可能
	}

	c.JSON(http.StatusOK, gin.H{"file": fileData})
}

// csvファイルをアップロードする関数
func UploadCsv(c *gin.Context, db *gorm.DB) {
	// csvファイルの取得
	csvFile, err := c.FormFile("csv_file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CSV file required"})
		return
	}

	// jsonファイルの取得
	jsonFile, err := c.FormFile("json_file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "JSON file required"})
		return
	}

	// csvファイルを開く
	openedCsvFile, err := csvFile.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to open CSV file"})
		return
	}
	defer openedCsvFile.Close() // 関数の最後でファイルを閉じる

	// jsonファイルを開く
	openedJsonFile, err := jsonFile.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to open JSON file"})
		return
	}
	defer openedJsonFile.Close() // 関数の最後でファイルを閉じる

	// csvファイルの内容を読み込む
	fileCsvContent, err := io.ReadAll(openedCsvFile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to read CSV file"})
		return
	}

	// jsonファイルの内容を読み込む
	fileJsonContent, err := io.ReadAll(openedJsonFile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to read JSON file"})
		return
	}

	// フォームデータの取得
	// userId := c.PostForm("user_id")
	userId := "rootId"
	csvId := c.PostForm("csv_id")
	fileName := c.PostForm("file_name")
	dataSize, _ := strconv.Atoi(c.PostForm("data_size"))
	dataColumns, _ := strconv.Atoi(c.PostForm("data_columns"))
	dataRows, _ := strconv.Atoi(c.PostForm("data_rows"))

	// データベースに保存するデータ
	csvData := Csv{
		CsvID:            csvId,
		CsvFile:          fileCsvContent,
		JsonFile:         fileJsonContent,
		UserID:           userId,
		FileName:         fileName,
		DataSize:         dataSize,
		DataColumns:      dataColumns,
		DataRows:         dataRows,
		UploadDate:       time.Now(),
		LastAccessedDate: time.Now(),
	}

	// データベースに保存
	result := db.Create(&csvData)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Upload successful",
		"csv_id":  csvId,
	})
}

// データベースに保存しているcsvファイルの情報を取得する関数
func GetCsvData(c *gin.Context, db *gorm.DB) {
	// データの受け取り
	front, err := bindFront(c)
	if err != nil {
		return
	}

	// 返すデータの構造を定義
	type CsvData struct {
		CsvID    string `json:"csv_id"`
		FileName string `json:"file_name"`
	}

	data := []CsvData{}

	// user_idを基にデータベースからcsvデータを取得する
	var csvs []Csv
	result := db.Where("user_id = ?", front.UserID).Find(&csvs)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"StatusMessage": "Failed",
			"message":       "データが取得されませんでした",
			"error":         result.Error.Error(),
		})
		return
	}

	fmt.Printf("%+v\n", data)

	c.JSON(http.StatusOK, gin.H{
		"StatusMessage": "S",
	})
}

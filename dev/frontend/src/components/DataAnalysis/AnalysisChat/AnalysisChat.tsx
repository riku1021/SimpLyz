import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  IconButton,
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Send as SendIcon,
  HighlightOff as HighlightOffIcon
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BACKEND_URL } from "../../../urlConfig";
import { useSelector } from "react-redux";
import {
  selectDimension,
  selectHorizontal,
  selectRegression,
  selectTarget,
  selectVertical,
} from "../../../features/parameter/parameterSelectors";
import {
  createRoomId,
  fetchGetChats,
  resetChat,
} from "../../../databaseUtils/Chats";
import useAuth from "../../../hooks/useAuth";
import { selectType } from "../../../features/chart/chartSelectors";
import { showConfirmationAlert } from "../../../utils/alertUtils";
import { useDispatch } from "react-redux";
import { changeRoomId } from "../../../features/roomId/roomIdSice";
import { selectRoomId } from "../../../features/roomId/roomIdSelectors";
import { generateUUID } from "../../../utils/generateUuid";
import { verifyGeminiApiKey } from "../../../databaseUtils/Users";

type Message = {
  user_chat: boolean;
  text: string;
};

type AnalysisChatProps = {
  image: string;
};

const AnalysisChat: React.FC<AnalysisChatProps> = ({ image }) => {
  const { userId, csvId } = useAuth();
  const navigate = useNavigate();

  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChartAnalysisMode, setIsChartAnalysisMode] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzeMessage, setAnalyzeMessage] = useState<Message | null>(null);
  const [apiKeyRegistered, setApiKeyRegistered] = useState<boolean | undefined>(undefined);

  // redux
  const chartType = useSelector(selectType);
  const vertical = useSelector(selectVertical);
  const horizontal = useSelector(selectHorizontal);
  const target = useSelector(selectTarget);
  const regression = useSelector(selectRegression);
  const dimension = useSelector(selectDimension);
  const roomId = useSelector(selectRoomId);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChat = async () => {
      if (image !== "") {
        try {
          if (typeof csvId === "string") {
            const response = await fetchGetChats(
              csvId,
              chartType,
              vertical,
              horizontal,
              target,
              regression,
              dimension
            );
            const chats = response.chats;
            if (chats.length > 0) {
              // roomIdの取得
              dispatch(changeRoomId(chats[0].room_id));
              // messageの取得
              const newMessage = chats.map((chat) => ({
                user_chat: chat.user_chat,
                text: chat.message,
              }));
              setMessages(newMessage);
              setIsChartAnalysisMode(false);
            } else {
              dispatch(changeRoomId(""));
            }
          }
        } catch (error) {
          console.error("チャットの取得に失敗しました", error);
        }
      }
    };

    fetchChat();
  }, [
    image,
    csvId,
    chartType,
    vertical,
    horizontal,
    target,
    regression,
    dimension,
    dispatch,
  ]);

  useEffect(() => {
    const checkGeminiApiKeyStatus = async () => {
      try {
        const { geminiApiKeyExists, message } = await verifyGeminiApiKey(userId);
        setApiKeyRegistered(geminiApiKeyExists);
        if (!geminiApiKeyExists) {
          console.warn("Gemini APIキーが存在しません:", message);
        }
      } catch (error) {
        console.error("パスワードの確認に失敗しました", error);
        setApiKeyRegistered(undefined);
      }
    };

    checkGeminiApiKeyStatus();
  }, [userId]);

  useEffect(() => {
    setIsChartAnalysisMode(true);
    setMessages([]);
    setAnalyzeMessage(null);
  }, [image]);

  const getCombinedMessages = (messages: Message[]) => {
    return messages.map((msg) => `${msg.user_chat}: ${msg.text}`).join("\n");
  };

  const getLastTenMessages = (messages: Message[]) => {
    return messages.slice(-10);
  };

  const sendMessage = async () => {
    if (input.trim() === "" || loading) return;

    const newMessage: Message = { user_chat: true, text: input };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const lastTenMessages = getLastTenMessages([...messages, newMessage]);
      const combinedMessages = analyzeMessage
        ? getCombinedMessages([analyzeMessage, ...lastTenMessages])
        : getCombinedMessages(lastTenMessages);

      const response = await axios.post(`${BACKEND_URL}/api/chat`, {
        user_id: userId,
        message: combinedMessages,
        user_message: newMessage.text,
        room_id: roomId,
        post_id: messages.length,
      });

      const botMessage: Message = {
        user_chat: false,
        text: response.data.reply,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setLoading(false);
  };

  const handleAnalyzeImage = async () => {
    if (apiKeyRegistered === false) {
      showConfirmationAlert(
        "Gemini APIキーが未登録です",
        "APIキーを登録してください。登録ページに移動しますか？",
        "はい",
        "いいえ"
      ).then((result) => {
        if (result.isConfirmed) {
          navigate("/user-info");
        }
      });
      return;
    }

    setIsAnalyzing(true);
    const newRoomId = generateUUID();
    // golang
    try {
      if (typeof csvId === "string") {
        await createRoomId(
          newRoomId,
          csvId,
          chartType,
          vertical,
          horizontal,
          target,
          regression,
          dimension
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
    // python
    try {
      const response = await axios.post(`${BACKEND_URL}/gemini/image`, {
        user_id: userId,
        image_data: image,
        room_id: newRoomId,
      });
      const botMessage: Message = {
        user_chat: false,
        text: response.data.text,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setAnalyzeMessage(botMessage);
      setIsChartAnalysisMode(false);
      // redux
      dispatch(changeRoomId(newRoomId));
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
    setIsAnalyzing(false);
  };

  // chatクリアイベント
  const handleClear = (roomId: string) => {
    showConfirmationAlert(
      "クリア確認",
      "このチャットをクリアしますか？",
      "はい",
      "いいえ"
    ).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await resetChat(roomId);
          setIsChartAnalysisMode(true);
          setMessages([]);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    });
  };

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
      {isAnalyzing && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          maxHeight: "calc(100vh - 147px)",
          mb: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              maxWidth: "80%",
              alignSelf: msg.user_chat === true ? "flex-end" : "flex-start",
              bgcolor: msg.user_chat === true ? "#1976d2" : "#ffffff",
              color: msg.user_chat === true ? "#ffffff" : "#404040",
              borderRadius: "24px",
              m: 1,
              p: "8px 12px",
              boxShadow: 1,
              wordBreak: "break-word",
              width: "fit-content",
              display: "flex",
              justifyContent:
                msg.user_chat === true ? "flex-end" : "flex-start",
            }}
          >
            <Typography
              component="div"
              variant="body2"
              sx={{
                margin: 0,
                "& p": { margin: "5px 0px" },
                "& ul": { margin: 0, paddingLeft: "20px" },
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.text}
              </ReactMarkdown>
            </Typography>
          </Box>
        ))}
      </Box>
      {isChartAnalysisMode ? (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            margin: 2,
            borderRadius: "50px",
          }}
        >
          <Button
            fullWidth
            onClick={handleAnalyzeImage}
            sx={{
              color: isAnalyzing ? "#9e9e9e" : "#fff",
              bgcolor: isAnalyzing ? "#e0e0e0" : "#1976d2",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "50px",
              padding: "5px 7px 5px 20px",
              margin: 1,
              borderTop: "1px solid #ddd",
              boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.1)",
              cursor: isAnalyzing ? "default" : "pointer",
              "&:hover": {
                bgcolor: isAnalyzing ? "#e0e0e0" : "#1565c0",
              },
            }}
            disabled={isAnalyzing}
          >
            グラフを解析
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            margin: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "#fff",
              padding: "5px 7px 5px 20px",
              flex: 1,
              borderTop: "1px solid #ddd",
              boxShadow: "0px -2px 5px rgba(0, 0, 0, 0.1)",
              borderRadius: "50px",
            }}
          >
            <TextField
              multiline
              fullWidth
              variant="standard"
              placeholder="メッセージを入力してください"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                mr: 1,
                "& .MuiInputBase-input": {
                  maxHeight: "6em",
                  overflowY: "auto",
                },
              }}
              inputProps={{
                maxRows: 3,
              }}
            />
            <IconButton
              onClick={sendMessage}
              sx={{
                bgcolor: loading ? "#e0e0e0" : "#1976d2",
                color: loading ? "#9e9e9e" : "#fff",
                cursor: loading ? "default" : "pointer",
                "&:hover": {
                  bgcolor: loading ? "#e0e0e0" : "#1565c0",
                },
              }}
              disabled={loading}
            >
              <SendIcon />
            </IconButton>
          </Box>
          <IconButton
            onClick={() => handleClear(roomId)}
            sx={{
              ml: 0.5,
              backgroundColor: "#d32f2f",
              color: "white",
              "&:hover": {
                backgroundColor: "#b71c1c",
                color: "#f5f5f5",
              },
            }}
          >
            <HighlightOffIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default AnalysisChat;

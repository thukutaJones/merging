"use client";

import React, { useState, useRef, useEffect } from "react";
import ChatToggleutton from "./FloatingWeziBotComp/ChatToggleutton";
import Header from "./FloatingWeziBotComp/Header";
import Messages from "./FloatingWeziBotComp/Messages";
import LoadingAnimation from "./LoadingAnimation";
import axios from "axios";
import { baseUrl } from "@/constants/baseUrl";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { connectSocket, disconnectSocket } from "@/utils/socket";
import InputArea from "../patients/Wez-chat/InputArea";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface WeziChatbotProps {
  className?: string;
}

const FloatingWeziBot = ({ className = "" }: WeziChatbotProps) => {
  const user = useAuth(["patient", "admin", "ambulance_driver", "nurse", "doctor", "hod"]);
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<any>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [typingText, setTypingText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [chatStatus, setChatStatus] = useState<
    "chat" | "appointment booking" | "initialized"
  >("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const { t } = useTranslation();

  //user dummy data
  const userName = user?.name;

  const welcomeText = `${t("greeting.hello")}, ${userName}\n${t(
    "greeting.weziBotGreeting"
  )}?`;

  // const welcomeText = `Hello, ${userName} How can Wezi Bot help you today??`;

  // Typing animation effect for welcome message
  useEffect(() => {
    if (!showWelcome) return;

    let index = 0;
    const timer = setInterval(() => {
      if (index <= welcomeText.length) {
        setTypingText(welcomeText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [welcomeText, showWelcome]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user) return;
    const newSocket = connectSocket({ userId: user?.id });
    setSocket(newSocket);

    return () => {
      disconnectSocket();
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Hide welcome message when first message is sent
    if (showWelcome) {
      setShowWelcome(false);
    }

    const newMessage = {
      message: inputText,
      sender: "user",
      createAt: new Date().toUTCString(),
    };

    setMessages((prev: any) => [...prev, newMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const activeAudio = new Audio("/active.mp3");
      activeAudio.play();
      let payload: any = { message: inputText };
      if (user?.id) {
        payload = { ...payload, userType: "registred", id: user?.id };
      } else {
        const deviceId = localStorage.getItem("device_id") || uuidv4();
        localStorage.setItem("device_id", deviceId);
        payload = { ...payload, userType: "guest", id: deviceId };
      }
      const res = await axios.post(`${baseUrl}/api/chat`, payload, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const chatReply = res?.data;
      console.log(chatReply);

      setMessages((prev: any) => [...prev, chatReply]);
      setChatStatus(res?.data?.metadata?.state);

      if (
        res?.data?.metadata?.state === "initialized" &&
        "speechSynthesis" in window
      ) {
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(
          "Entering appointment booking session"
        );
        utterance.pitch = 1.2; // slightly higher, more expressive
        utterance.rate = 0.95; // slower for clarity
        utterance.volume = 1;
        utterance.lang = "en-US";

        // Try to select a female voice
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (voice) =>
            voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("samantha") || // iOS/macOS
            voice.name.toLowerCase().includes("google us english") // Chrome/Android
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
          setIsProcessing(false);
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          const notActiveAudio = new Audio("/notactive.mp3");
          notActiveAudio.play();
        };

        // Handle cases where voices load async
        if (!voices.length) {
          speechSynthesis.onvoiceschanged = () => {
            const newVoices = speechSynthesis.getVoices();
            const fallbackVoice = newVoices.find((voice) =>
              voice.name.toLowerCase().includes("female")
            );
            if (fallbackVoice) utterance.voice = fallbackVoice;
            speechSynthesis.speak(utterance);
          };
        } else {
          speechSynthesis.speak(utterance);
        }
      } else {
        console.log("Text-to-Speech is not supported in this browser.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsTyping(false);
    }
  };

  const uploadAudio = async (blob: Blob) => {
    setIsProcessing(true);
    const mimeType = "audio/webm";
    const file = new File([blob], "audio.webm", { type: mimeType });

    if (fileRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileRef.current.files = dataTransfer.files;

      // if (submitButtonRef.current) {
      //   submitButtonRef.current?.click();
      // }
    }
    const formData = new FormData();
    formData.append("audio", file);

    try {
      const res = await axios.post(`${baseUrl}/api/chat/audio`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const chatReply = res?.data?.response;
      const userPrompt = res?.data?.userPrompt;
      console.log(chatReply);

      setMessages((prev: any) => [...prev, userPrompt, chatReply]);

      if ("speechSynthesis" in window) {
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(chatReply?.message);
        utterance.pitch = 1.2;
        utterance.rate = 1;
        utterance.volume = 1;
        utterance.lang = "en-US";

        utterance.onstart = () => {
          setIsProcessing(false);
          setIsSpeaking(true);
        };
        utterance.onend = () => {
          setIsSpeaking(false);
          const notActiveAudio = new Audio("/notactive.mp3");
          notActiveAudio.play();
        };

        speechSynthesis.speak(utterance);
      } else {
        console.log("Text-to-Speech is not supported in this browser.");
      }
    } catch (error) {
    } finally {
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCancelBookingSession = async () => {
    try {
      setIsCancelling(true);
      const res = await axios.post(
        `${baseUrl}/api/chat/cancel-booking-session/${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const chatReply = res?.data;
      console.log(chatReply);

      setMessages((prev: any) => [...prev, chatReply]);
      setChatStatus(res?.data?.metadata?.state);

      if ("speechSynthesis" in window) {
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(
          "Appointment booking session cancelled successfully"
        );
        utterance.pitch = 1.2; // slightly higher, more expressive
        utterance.rate = 0.95; // slower for clarity
        utterance.volume = 1;
        utterance.lang = "en-US";

        // Try to select a female voice
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (voice) =>
            voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("samantha") || // iOS/macOS
            voice.name.toLowerCase().includes("google us english") // Chrome/Android
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
          setIsProcessing(false);
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          const notActiveAudio = new Audio("/notactive.mp3");
          notActiveAudio.play();
        };

        // Handle cases where voices load async
        if (!voices.length) {
          speechSynthesis.onvoiceschanged = () => {
            const newVoices = speechSynthesis.getVoices();
            const fallbackVoice = newVoices.find((voice) =>
              voice.name.toLowerCase().includes("female")
            );
            if (fallbackVoice) utterance.voice = fallbackVoice;
            speechSynthesis.speak(utterance);
          };
        } else {
          speechSynthesis.speak(utterance);
        }
      } else {
        console.log("Text-to-Speech is not supported in this browser.");
      }
    } catch (error) {
    } finally {
      setIsCancelling(false);
    }
  };

  const fetchConversation = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${baseUrl}/api/user-conversation/${user?.id}`
      );
      setMessages(res.data?.conversation);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [user]);

  if (isLoading || !user) return <LoadingAnimation />;

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {isOpen && (
        <div className="mb-4 w-96 h-[32rem] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-700">
          <Header setIsOpen={setIsOpen} />
          <Messages
            isTyping={isTyping}
            messages={messages}
            messagesEndRef={messagesEndRef}
          />
          <InputArea
            setInputText={setInputText}
            inputRef={inputRef}
            handleKeyPress={handleKeyPress}
            inputText={inputText}
            handleSendMessage={handleSendMessage}
            type="bot"
            uploadAudio={uploadAudio}
            isProcessing={isProcessing}
          />
        </div>
      )}

      <ChatToggleutton
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        messages={messages}
      />
    </div>
  );
};

export default FloatingWeziBot;

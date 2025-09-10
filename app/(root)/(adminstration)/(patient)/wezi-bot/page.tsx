"use client";

import LoadingAnimation from "@/components/LoadingAnimation";
import InputArea from "@/components/patients/Wez-chat/InputArea";
import MessagesContainer from "@/components/patients/Wez-chat/MessagesContainer";
import WelcomeMessage from "@/components/patients/Wez-chat/WelcomeMessage";
import { baseUrl } from "@/constants/baseUrl";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Message {
  message: string;
  sender: "user" | "bot";
  createdAt: Date;
}

const Page = () => {
  const { user } = useAuth(["patient"]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [typingText, setTypingText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation();

  const userName = user?.full_name ?? "Guest";
  const welcomeText = `Hello, ${userName}! How can Wezi Bot help you today?`;

  // Typing animation for welcome text
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

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const playSound = async (src: string) => {
    try {
      const audio = new Audio(src);
      await audio.play();
    } catch (err) {
      console.warn("⚠️ Audio play blocked:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Hide welcome on first send
    if (showWelcome) setShowWelcome(false);

    const newMessage: Message = {
      message: inputText,
      sender: "user",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      await playSound("/active.mp3");

      const res = await axios.post(
        `${baseUrl}/api/chat`,
        { message: inputText },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      const botReply: Message = {
        message: res?.data?.message?.message ?? "Sorry, I didn’t understand that.",
        sender: "bot",
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, botReply]);

      // Speak response
      if ("speechSynthesis" in window) {
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(botReply.message);
        utterance.pitch = 1.2;
        utterance.rate = 1;
        utterance.volume = 1;
        utterance.lang = "en-US";

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = async () => {
          setIsSpeaking(false);
          await playSound("/notactive.mp3");
        };

        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error("❌ Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  if (!user) return <LoadingAnimation />;

  return (
    <div className="chatbot min-h-[calc(100vh-70px)] bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-6 py-6 overflow-hidden flex flex-col">
        {showWelcome && messages.length === 0 && (
          <WelcomeMessage
            typingText={typingText}
            welcomeText={welcomeText}
            type="bot"
          />
        )}

        {messages.length > 0 && (
          <MessagesContainer
            messages={messages}
            isTyping={isTyping}
            messagesEndRef={messagesEndRef}
            type="patient"
          />
        )}
      </div>
      <InputArea
        setInputText={setInputText}
        inputRef={inputRef}
        handleKeyPress={handleKeyPress}
        inputText={inputText}
        handleSendMessage={handleSendMessage}
        isRecording={isRecording}
        toggleRecording={toggleRecording}
        type="bot"
      />
    </div>
  );
};

export default Page;

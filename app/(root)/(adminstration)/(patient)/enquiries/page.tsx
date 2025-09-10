"use client";

import InputArea from "@/components/patients/Wez-chat/InputArea";
import WelcomeMessage from "@/components/patients/Wez-chat/WelcomeMessage";
import { useAuth } from "@/hooks/useAuth";
import React, { useState, useRef, useEffect } from "react";
import { connectSocket, disconnectSocket } from "@/utils/socket";
import axios from "axios";
import { baseUrl } from "@/constants/baseUrl";
import EnquiriesEmptyState from "@/components/hods/EnquiresEmptyState";
import MessagesContainer from "@/components/patients/enquires/MessagesContainer";
import LoadingAnimation from "@/components/LoadingAnimation";
import EnquirySidebar from "@/components/hods/EnquirySidear";
import NoActivePatient from "@/components/hods/NoActivePatient";

interface Message {
  text: string;
  sender: string;
  timestamp: Date;
  senderId: string;
  _id?: string;
  receiverId?: string;
}

const Page = () => {
  const {user} = useAuth(["patient", "hod"]);
  const [enquiries, setEnquiries] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [typingText, setTypingText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activePatient, setActivePatient] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const welcomeText = `Hello, ${user?.full_name || ""}\nHow can the Wezi Team help you today?`;

  // Typing animation for welcome
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

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [enquiries]);

  // Focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Setup socket
  useEffect(() => {
    if (!user) return;

    const newSocket = connectSocket({ userId: user.id });
    setSocket(newSocket);

    const handleNewEnquiry = async (newEnquiry: Message) => {
      if (user.role === "hod") {
        await fetchConversations();
      }
      setEnquiries((prev) => [...prev, newEnquiry]);
    };

    newSocket.on("receiveEnquiry", handleNewEnquiry);

    return () => {
      newSocket.off("receiveEnquiry", handleNewEnquiry);
      disconnectSocket();
    };
  }, [user]);

  // Send message
  const handleSendEnquiry = async () => {
    if (!user || !inputText.trim()) return;

    try {
      setIsSending(true);
      if (showWelcome) setShowWelcome(false);

      const newEnquiry: Message = {
        text: inputText,
        sender: user.role,
        timestamp: new Date(),
        senderId: user.id,
        receiverId: user.role === "patient" ? null : activePatient?._id,
      };

      socket.emit("sendEnquiry", newEnquiry);
      setEnquiries((prev) => [...prev, newEnquiry]);
      setInputText("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendEnquiry();
    }
  };

  // Fetch enquiries
  const fetchEnquiries = async () => {
    if (!user) return;
    if (user.role === "hod" && !activePatient) return;

    try {
      setIsLoading(true);
      const res = await axios.get(
        `${baseUrl}/api/enquires/${user.role === "hod" ? activePatient._id : user.id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setEnquiries(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all conversations (for hod)
  const fetchConversations = async () => {
    if (!user || user.role !== "hod") return;
    try {
      setIsLoading(true);
      const res = await axios.get(`${baseUrl}/api/enquires/hod/conversations`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setConversations(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [user, activePatient]);

  useEffect(() => {
    fetchConversations();
  }, [user]);

  if (!user || isLoading) return <LoadingAnimation />;

  return (
    <div className="h-[calc(100vh-70px)] relative bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-row overflow-hidden">
      {user.role === "hod" && (
        <EnquirySidebar
          enquiries={conversations}
          onEnquiryClick={(patient: any) => setActivePatient(patient)}
          activeEnquiryId={activePatient?._id}
        />
      )}

      <div className="flex flex-1 flex-col h-[calc(100vh-70px)]">
        <div className="flex-1 overflow-hidden flex flex-col">
          {/** PATIENT WELCOME SCREEN */}
          {enquiries.length === 0 && showWelcome && user.role === "patient" && (
            <WelcomeMessage typingText={typingText} welcomeText={welcomeText} type="patient" />
          )}

          {/** HOD NO PATIENT SELECTED */}
          {user.role === "hod" && conversations.length > 0 && !activePatient && <NoActivePatient />}

          {/** EMPTY STATE */}
          {user.role === "hod" && enquiries.length === 0 && activePatient && <EnquiriesEmptyState />}

          {/** MESSAGES */}
          {enquiries.length > 0 && (
            <MessagesContainer
              messages={enquiries}
              isTyping={isTyping}
              messagesEndRef={messagesEndRef}
              type={user.role}
              userId={user.id || ""}
            />
          )}
        </div>

        {/** INPUT AREA */}
        {(user.role === "patient" ||
          (user.role === "hod" && activePatient && enquiries.length > 0)) && (
          <InputArea
            setInputText={setInputText}
            inputRef={inputRef}
            handleKeyPress={handleKeyPress}
            inputText={inputText}
            handleSendMessage={handleSendEnquiry}
            type={user.role}
          />
        )}
      </div>
    </div>
  );
};

export default Page;

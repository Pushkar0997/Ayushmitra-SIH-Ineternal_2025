"use client"

import type React from "react"
import { useRef, useState } from "react"
import { MessageCircle, X, Send, ImagePlus, Trash2 } from "lucide-react"

interface Message {
  id: number
  text: string
  isBot: boolean
  imageUrl?: string
}

export function ChatWidget() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm your Ayushmitra Assistant. How can I help you today?", isBot: true },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // --- CONFIGURATION FOR DIRECT GROQ API CALL ---
  // ⚠️ Paste your secret Groq API key here for testing
  const GROQ_API_KEY = "my secret groq api key";
  const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
  // ---

  const handlePickImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null)
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file."); e.target.value = ""; return
    }
    const maxBytes = 5 * 1024 * 1024 // 5 MB
    if (file.size > maxBytes) {
      setUploadError("Image is too large. Max size is 5 MB."); e.target.value = ""; return
    }
    setSelectedImage(file)
    const url = URL.createObjectURL(file)
    setImagePreviewUrl(url)
  }

  const clearSelectedImage = () => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
    setSelectedImage(null)
    setImagePreviewUrl(null)
    setUploadError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // --- UPDATED SEND MESSAGE LOGIC ---
  const handleSendMessage = async () => {
    if (isLoading) return

    const textToSend = inputValue.trim()
    if (!textToSend && !selectedImage) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: textToSend,
      isBot: false,
      imageUrl: imagePreviewUrl || undefined,
    }
    const newMessages = [...messages, userMessage];
    setMessages(newMessages)
    setInputValue("")
    setIsLoading(true)

    try {
      // Prepare the conversation history for the Groq API
      const apiMessages = newMessages.map(msg => ({
        role: msg.isBot ? "assistant" : "user",
        // Prepend a note if an image was part of the user's message
        content: msg.imageUrl ? `[User has uploaded an image]. ${msg.text}` : msg.text
      }));

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // Use a valid, active model
          messages: apiMessages
        })
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${await response.text()}`);
      }

      const data = await response.json();
      const botText = data.choices[0]?.message?.content || "Sorry, I couldn't get a valid response.";

      const botResponse: Message = {
        id: newMessages.length + 1,
        text: botText,
        isBot: true,
      };
      setMessages(prev => [...prev, botResponse]);

    } catch (error) {
      console.error("API Call failed:", error);
      const errorMessage: Message = {
        id: newMessages.length + 1,
        text: 'Sorry, I am having trouble connecting to the API.',
        isBot: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      clearSelectedImage();
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  // --- NO CHANGES to the JSX below ---
  if (!isExpanded) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Open chat"
        >
          <MessageCircle className="h-7 w-7 text-white" />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
        <h3 className="font-semibold text-lg">Ayushmitra Assistant</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="hover:bg-blue-700 rounded-full p-2 transition-colors duration-200"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="h-80 p-4 overflow-y-auto space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg text-sm ${message.isBot ? "bg-gray-200 text-gray-800" : "bg-blue-500 text-white"}`}>
              {message.imageUrl && <img src={message.imageUrl} alt="uploaded" className={`mb-2 max-w-[14rem] rounded ${message.isBot ? "" : "border border-white/30"}`} />}
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-gray-500 text-sm">Ayushmitra is thinking...</div>}
      </div>

      {imagePreviewUrl && (
        <div className="px-4 pb-2">
          <div className="inline-flex items-center gap-2 p-2 border rounded-md bg-gray-50">
            <img src={imagePreviewUrl} alt="preview" className="h-12 w-12 object-cover rounded" />
            <button onClick={clearSelectedImage} className="text-red-600 hover:text-red-700 inline-flex items-center gap-1 text-sm" aria-label="Remove selected image">
              <Trash2 className="h-4 w-4" /> Remove
            </button>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2 items-center">
          <button type="button" onClick={handlePickImageClick} className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50" title="Attach image" aria-label="Attach image" disabled={isLoading}>
            <ImagePlus className="h-5 w-5 text-gray-700" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center disabled:bg-blue-400" aria-label="Send message" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </button>
        </div>
        {uploadError && <div className="mt-2 text-xs text-red-600">{uploadError}</div>}
      </div>
    </div>
  )
}
"use client"
import { useState, useEffect, useRef } from "react"
// import type React from "react" // Đã xóa dòng này vì JS không cần import type
import "./ChatBox.css"
import { askAI } from "../../api/AI"
import ReactMarkdown from "react-markdown"

// Đã xóa Interface Message

export default function ChatBox() {
    const [isExpanded, setIsExpanded] = useState(false)
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "ai",
            content: "Xin chào! 🎋 Bạn cần tư vấn gì về đồ mây tre hôm nay ạ?",
        },
    ])
    const [input, setInput] = useState("")
    const [selectedImage, setSelectedImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const fileInputRef = useRef(null)
    const messagesEndRef = useRef(null)
    const chatBodyRef = useRef(null)

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 0)
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => setSelectedImage(event.target.result)
            reader.readAsDataURL(file)
        }
        e.target.value = ""
    }

    const formatResponseText = (text) => {
        return text.replace(/\\n/g, "\n").trim()
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!input.trim() && !selectedImage) return

        const userMsg = {
            id: Date.now(),
            role: "user",
            content: input,
            image: selectedImage,
        }

        const historyForBackend = messages.map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            content: msg.content,
        }))

        setMessages((prev) => [...prev, userMsg])
        setInput("")
        setSelectedImage(null)
        setIsLoading(true)

        try {
            const response = await askAI({
                question: userMsg.content,
                image: userMsg.image,
                chatHistory: historyForBackend,
            })

            let aiResponse = ""

            if (typeof response === "string") {
                aiResponse = response
            } else if (response && typeof response === "object" && "answer" in response) {
                aiResponse = response.answer || "Không có phản hồi"
            } else {
                aiResponse = JSON.stringify(response)
            }

            aiResponse = formatResponseText(aiResponse)

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "ai",
                    content: aiResponse || "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này ạ",
                },
            ])
        } catch (err) {
            console.error("Chat error:", err)
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "ai",
                    content: "⚠️ Có lỗi kết nối, vui lòng thử lại sau nhé! 😊",
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button
                className="chatbot-toggler"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? "Đóng chat" : "Mở chat"}
            >
                <span className="material-symbols-rounded">mode_comment</span>
                <span className="material-symbols-rounded">close</span>
            </button>

            <div className={`chatbot-popup ${isExpanded ? "show" : ""}`}>
                {/* Chat Header */}
                <div className="chat-header">
                    <div className="header-info">
                        <div className="chatbot-logo">
                            <img src="/static/media/LOGO-EXE.0c423b67095392a8bd7a.png"
                                                           style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}}/>
                        </div>
                        <h2 className="logo-text">MAYÉ</h2>
                    </div>
                    <button id="close-chatbot" onClick={() => setIsExpanded(false)} title="Đóng" aria-label="Đóng chat">
                        <span className="material-symbols-rounded">keyboard_arrow_down</span>
                    </button>
                </div>

                {/* Chat Body */}
                <div className="chat-body" ref={chatBodyRef}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.role}-message`}>
                            {msg.role === "ai" && <div className="bot-avatar">
                                <img src="/static/media/LOGO-EXE.0c423b67095392a8bd7a.png"
                                     style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}}/>
                            </div>}
                            <div className="message-bubble">
                                <div className="message-text">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                                {msg.image && <img src={msg.image || "/placeholder.svg"} alt="uploaded" className="message-image" />}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message ai-message">
                            <div className="bot-avatar">
                                <img src="/static/media/LOGO-EXE.0c423b67095392a8bd7a.png"
                                     style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}}/>
                            </div>
                            <div className="message-bubble">
                                <div className="thinking-indicator">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Chat Footer */}
                <div className="chat-footer">
                    <form className="chat-form" onSubmit={handleSendMessage}>
                        {selectedImage && (
                            <div className="image-preview-container">
                                <img src={selectedImage || "/placeholder.svg"} alt="Preview" className="image-preview" />
                                <button type="button" className="remove-image-btn" onClick={() => setSelectedImage(null)}>
                                    ×
                                </button>
                            </div>
                        )}

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập câu hỏi..."
                            className="message-input"
                            disabled={isLoading}
                            rows={1}
                        />

                        <div className="chat-controls">
                            <button
                                type="button"
                                className="control-btn upload-btn"
                                onClick={() => fileInputRef.current?.click()}
                                title="Gửi ảnh"
                            >
                                📷
                            </button>
                            <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFileSelect} />

                            <button
                                type="submit"
                                className="control-btn send-btn"
                                disabled={isLoading || (!input.trim() && !selectedImage)}
                                title="Gửi"
                            >
                                <span className="material-symbols-rounded">arrow_upward</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
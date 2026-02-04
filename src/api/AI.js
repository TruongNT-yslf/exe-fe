// Configuration for backend API
const BACKEND_URL = process.env.REACT_APP_API_URL

/**
 * Send question to AI backend and get response
 * @param {string} question - User's question
 * @param {string} image - Base64 encoded image (optional)
 * @param {Array} chatHistory - Previous chat messages (optional)
 * @returns {Promise<string>} - AI response text
 */
// api/AI.js

// Đảm bảo bạn đã khai báo BACKEND_URL ở đâu đó hoặc import vào
// const BACKEND_URL = "http://localhost:8080"; // Ví dụ

export async function askAI({ question, image, chatHistory = [] }) {
    try {
        console.log("Calling AI API with question:", question.substring(0, 50))

        const payload = {
            question,
            image: image || null,
            chatHistory: chatHistory || []
        }

        const response = await fetch(`${BACKEND_URL}/ai/ask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })

        console.log("API response status:", response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error("API error response:", errorText)
            throw new Error(`Server error: ${response.status}`)
        }

        // --- PHẦN SỬA ĐỔI QUAN TRỌNG ---
        // Kiểm tra xem server có trả về JSON không
        const contentType = response.headers.get("content-type");

        let answer;
        if (contentType && contentType.includes("application/json")) {
            // Nếu là JSON, parse ra Object
            answer = await response.json();
            // console.log("Received JSON answer:", answer);
        } else {
            // Nếu là text thường, lấy text
            answer = await response.text();
            console.log("Received text answer:", answer.substring(0, 100));
        }

        return answer;
        // Kết quả trả về sẽ là Object: { answer: "...", status: "success", ... }
        // --------------------------------

    } catch (error) {
        console.error("API call failed:", error.message)
        throw new Error(`Không thể kết nối đến backend: ${error.message}`)
    }
}


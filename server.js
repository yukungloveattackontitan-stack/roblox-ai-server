const Groq = require('groq-sdk');
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// เชื่อมต่อระบบ Groq โดยดึงคีย์จากไฟล์ .env
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

console.log('🤖 เปิดระบบ AI NPC (โหมด Web Server ตรงสำหรับ Executor - เวอร์ชัน Groq ฟรี)...');

app.post('/ask-npc', async (req, res) => {
    const { message } = req.body;
    
    // แสดงข้อความใน Terminal เพื่อเช็กสถานะ
    console.log(`\n💬 ได้รับคำถามจากในเกม: ${message}`);

    try {
        const response = await groq.chat.completions.create({
            model: 'qwen/qwen3.8-27b', // รุ่นฟรีเสถียรสุด ณ ปัจจุบัน
            messages: [
                { role: "system", content: "คุณคือ NPC พ่อมดเฒ่าใจดีชื่อ เมอร์ลิน ตอบคำถามผู้เล่นสั้นๆ เป็นกันเอง ห้ามใช้เครื่องหมายดอกจัน (*) ในข้อความ" },
                { role: "user", content: message }
            ]
        });
        
        const reply = response.choices[0].message.content;
        console.log(`🧙‍♂️ เมอร์ลิน ตอบว่า: ${reply}`);
        
        // ส่งคำตอบยิงกลับไปให้ Executor ทันทีโดยไม่ต้องเขียนลงไฟล์ Log
        res.json({ reply: reply });

    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาด:', error.message);
        res.status(500).json({ reply: "ข้าเวียนหัวนิดหน่อย... ลองถามใหม่อีกครั้งนะ" });
    }
});

// เปิดประตูรอรับข้อมูลที่พอร์ต 3000
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 เซิร์ฟเวอร์พร้อมทำงานที่ http://localhost:${PORT}`));

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // serve ไฟล์ HTML/JS/CSS จาก root

// สร้างไฟล์ JSON ถ้าไม่มี
if (!fs.existsSync('students.json')) {
    fs.writeFileSync('students.json', JSON.stringify([]));
}
if (!fs.existsSync('paid.json')) {
    fs.writeFileSync('paid.json', JSON.stringify([]));
}

// route หน้าแรก
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// route health check
app.get('/healthz', (req, res) => {
    res.send('Server is healthy ✅');
});

// API: ดึงรหัสนักศึกษา
app.get('/students', (req, res) => {
    const students = JSON.parse(fs.readFileSync('students.json'));
    res.json(students);
});

// API: เพิ่มรหัสนักศึกษา
app.post('/students', (req, res) => {
    const { id } = req.body;
    if (!id || id.length !== 8) {
        return res.status(400).json({ message: 'รหัสไม่ถูกต้อง ต้องมี 8 หลัก' });
    }
    let students = JSON.parse(fs.readFileSync('students.json'));
    if (students.includes(id)) {
        return res.status(400).json({ message: 'รหัสนี้มีอยู่แล้ว' });
    }
    students.push(id);
    fs.writeFileSync('students.json', JSON.stringify(students));
    res.json({ message: `เพิ่มรหัส ${id} สำเร็จ` });
});

// API: ลบรหัสนักศึกษา
app.delete('/students/:id', (req, res) => {
    const id = req.params.id;
    let students = JSON.parse(fs.readFileSync('students.json'));
    const index = students.indexOf(id);
    if (index === -1) {
        return res.status(404).json({ message: 'ไม่พบรหัสนี้' });
    }
    students.splice(index, 1);
    fs.writeFileSync('students.json', JSON.stringify(students));
    res.json({ message: `ลบรหัส ${id} สำเร็จ` });
});

// API: ดึงรายชื่อนักศึกษาที่จ่ายแล้ว
app.get('/paid', (req, res) => {
    const paidStudents = JSON.parse(fs.readFileSync('paid.json'));
    res.json(paidStudents);
});

// API: เพิ่มนักศึกษาที่จ่ายแล้ว
app.post('/paid', (req, res) => {
    const { id, name, date } = req.body;
    if (!id || !name || !date) {
        return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
    }
    let paidStudents = JSON.parse(fs.readFileSync('paid.json'));
    paidStudents.push({ id, name, date });
    fs.writeFileSync('paid.json', JSON.stringify(paidStudents));
    res.json({ message: 'บันทึกข้อมูลการชำระเงินสำเร็จ' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

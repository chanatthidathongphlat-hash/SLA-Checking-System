const studentInput = document.getElementById('studentId');
const addBtn = document.getElementById('addBtn');
const removeBtn = document.getElementById('removeBtn');
const studentListDiv = document.getElementById('studentList');

// เปิดปุ่มเมื่อกรอกครบ 8 ตัว
studentInput.addEventListener('input', () => {
    const value = studentInput.value.trim();
    const isValid = value.length === 8;
    addBtn.disabled = !isValid;
    removeBtn.disabled = !isValid;
});

// โหลดรหัสนักศึกษาจาก server
function showAll() {
    fetch('/students')
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                studentListDiv.innerHTML = "<p>ยังไม่มีรหัสนักศึกษาในระบบ</p>";
            } else {
                const sorted = data.sort();
                studentListDiv.innerHTML = "<h3>รหัสนักศึกษาทั้งหมด:</h3><ol>" +
                    sorted.map(id => `<li>${id}</li>`).join('') +
                    "</ol>";
            }
            studentListDiv.style.display = "block";
        });
}

// เพิ่มรหัส
addBtn.addEventListener('click', () => {
    fetch('/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: studentInput.value.trim() })
    })
    .then(res => res.json())
    .then(msg => {
        alert(msg.message);
        resetInput();
        showAll();
    });
});

// ลบรหัส
removeBtn.addEventListener('click', () => {
    fetch(`/students/${studentInput.value.trim()}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(msg => {
        alert(msg.message);
        resetInput();
        showAll();
    });
});

function resetInput() {
    studentInput.value = '';
    addBtn.disabled = true;
    removeBtn.disabled = true;
}

// js/storage.js
function addPaidStudent(name, id, img) {
  let paidStudents = JSON.parse(localStorage.getItem('paidStudents')) || [];
  paidStudents.push({ name: name, id: id, img: img });
  localStorage.setItem('paidStudents', JSON.stringify(paidStudents));
}

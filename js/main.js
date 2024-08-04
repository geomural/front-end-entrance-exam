"use strict";

document.querySelectorAll('[contenteditable="true"]').forEach((element) => {
  element.addEventListener("input", (event) => {
    // Cохраняем изменения в local storage
    let className = event.target.classList[0];
    localStorage.setItem(className, event.target.innerText);
  });

  // Загружаем изменения из local storage
  let elementClassName = element.classList[0];
  const savedText = localStorage.getItem(elementClassName);
  if (savedText) {
    element.innerText = savedText;
  }
});

// Подключаем модуль jsPDF из библиотеки
const { jsPDF } = window.jspdf;

// Функция для экспорта контента в PDF
async function exportToPDF() {
  const content = document.getElementById("resume");

  // Используем html2canvas для захвата изображения с содержимым
  const canvas = await html2canvas(content, {
    useCORS: true, // Использовать CORS для захвата изображений
    scale: 2 // Увеличить масштаб для лучшего качества
  });

  // Преобразуем канвас в изображение в формате Data URL
  const imgData = canvas.toDataURL('image/png');

  // Создаем новый документ PDF
  const pdf = new jsPDF('p', 'mm', 'a4');

  // Вычисляем размеры для изображения в PDF
  const imgWidth = 210; // Ширина PDF документа в мм
  const pageHeight = 295; // Высота PDF документа в мм
  const imgHeight = (canvas.height * imgWidth) / canvas.width; // Высота изображения
  let heightLeft = imgHeight; // Оставшаяся высота

  let position = 0;

  // Добавляем изображение на первую страницу
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Если содержимое не помещается на одной странице, создаем новые страницы
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // Сохраняем PDF документ
  pdf.save('document.pdf');
}

// Привязываем функцию к кнопке
document.getElementById("downloadPDF").addEventListener("click", exportToPDF);
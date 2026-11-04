const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

const showButton = document.querySelector("#show-program");
const program = document.querySelector("#program");
const dataError = document.querySelector("#data-error");
const form = document.querySelector("#service-form");

let data;
try {
  data = JSON.parse(sourceJson);
} catch (error) {
  dataError.hidden = false;
  form.hidden = true;
}

function showProgram() {
  program.hidden = false;
  program.innerHTML = data.event.meeting;
}

if (data !== undefined) {
  showButton.addEventListener("click", showProgram);
}

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selected = services.filter((service) => {
    if (service.id === "guide" && guideChecked) return true;
    if (service.id === "audio" && audioChecked) return true;
    if (service.id === "catalog" && catalogChecked) return true;
    return false;
  });

  const items = selected.map((service) => {
    const { title, price } = service;
    return {
      title: title.trim(),
      price: price,
    };
  });

  const total = items.reduce((sum, item) => {
    return sum + item.price;
  }, 0);

  return {
    count: items.length,
    total: total,
    items: items,
  };
}

const choiceError = document.querySelector("#choice-error");
const result = document.querySelector("#result");
const reportJson = document.querySelector("#report-json");

function handleSubmit(event) {
  event.preventDefault();

  const guideChecked = document.querySelector("#guide").checked;
  const audioChecked = document.querySelector("#audio").checked;
  const catalogChecked = document.querySelector("#catalog").checked;

  const report = buildReport(
    data.services,
    guideChecked,
    audioChecked,
    catalogChecked
  );

  if (report.count === 0) {
    choiceError.hidden = false;
    result.hidden = true;
    reportJson.hidden = true;
  } else {
    choiceError.hidden = true;
    result.hidden = false;
    reportJson.hidden = false;

    let html = `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.<br>`;
    report.items.forEach((item) => {
      html += `${item.title}<br>`;
    });

    result.innerHTML = html;

    const jsonString = JSON.stringify(report);
    reportJson.textContent = jsonString;

    JSON.parse(jsonString);
  }
}

if (data !== undefined) {
  form.addEventListener("submit", handleSubmit);
}
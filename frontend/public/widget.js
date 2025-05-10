(function () {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("document", document);
    const container = document.getElementById("survey-widget");

    if (!container) {
      console.error("Элемент с id='survey-widget' не найден.");
      return;
    }

    const surveyId = container.getAttribute("data-survey-id");
    const width = container.getAttribute("data-width") || "100%";
    const height = container.getAttribute("data-height") || "600";

    if (!surveyId) {
      console.error("Атрибут data-survey-id обязателен.");
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.src = `http://localhost:3000/embed/${surveyId}`;
    iframe.width = width;
    iframe.height = height;
    iframe.style.border = "none";
    iframe.loading = "lazy";

    container.appendChild(iframe);
  });
})();

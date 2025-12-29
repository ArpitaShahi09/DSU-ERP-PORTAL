// /frontend/results/results.js
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userid = urlParams.get("userid");

  fetch(`/api/results/${userid}`)
    .then(response => response.json())
    .then(data => {
      const tbody = document.querySelector("#results-table tbody");
      data.forEach((row, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${row.subject_code}</td>
          <td>${row.subject_name}</td>
          <td>${row.mse1}</td>
          <td>${row.mse2}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Failed to load results:", err);
    });
});

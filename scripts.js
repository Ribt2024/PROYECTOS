// Función para agregar un eventListener para el ENTER en las celdas de "Recursos Propios" y "Recursos SGP"
function addEnterKeyListener() {
    const recursosPropiosInputs = document.querySelectorAll('td:nth-child(4) input');
    const recursosSGPInputs = document.querySelectorAll('td:nth-child(5) input');
    
    // Para "Recursos Propios"
    recursosPropiosInputs.forEach(input => {
      input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          handleEnterKey(input);
        }
      });
    });
  
    // Para "Recursos SGP"
    recursosSGPInputs.forEach(input => {
      input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          handleEnterKey(input);
        }
      });
    });
  }
  
  // Función que maneja el presionar ENTER
  function handleEnterKey(input) {
    const row = input.closest('tr');
    const table = document.getElementById("inputTable").querySelector("tbody");
    const rowIndex = Array.from(table.rows).indexOf(row);
    const lastRow = table.rows.length - 1;
  
    // Si estamos en la última fila, agrega una nueva fila
    if (rowIndex === lastRow) {
      addRow(); // Esto agrega una fila nueva
    } else {
      // Mueve el foco a la siguiente fila, en la misma columna
      const nextRow = table.rows[rowIndex + 1];
      const columnIndex = Array.from(row.cells).indexOf(input.closest('td')); // Obtiene el índice de la columna actual
      const nextInput = nextRow.querySelectorAll('td input')[columnIndex - 3]; // Ajusta el índice de columna (restando 3 por las primeras 3 columnas)
      
      if (nextInput) {
        nextInput.focus(); // Enfocar el siguiente campo en la misma columna
      }
    }
  }
  
  
  // Función para agregar una nueva fila
  function addRow() {
    const table = document.getElementById("inputTable").querySelector("tbody");
    const newRow = document.createElement("tr");
  
    // Calcular el número de fila basado en el número actual de filas
    const rowNumber = table.rows.length + 1;
  
    newRow.innerHTML = `
      <td>${rowNumber}</td>
      <td>
        <select>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
        </select>
      </td>
      <td>
        <select>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </td>
      <td><input type="text" placeholder="" onblur="formatCurrency(this)" required></td>
      <td><input type="text" placeholder="" onblur="formatCurrency(this)" required></td>
      <td><button class="button" onclick="removeRow(this)">Eliminar</button></td>
    `;
    
    table.appendChild(newRow);
    updateRowNumbers(); // Actualizar los números de fila
    addEnterKeyListener(); // Agregar el eventListener a la nueva fila
  }
  
  // Función para eliminar una fila específica
  function removeRow(button) {
    button.parentElement.parentElement.remove();
    updateRowNumbers(); // Actualizar los números de fila
  }
  
  // Función para reiniciar la tabla al estado inicial
  function resetTable() {
    const tableBody = document.getElementById("inputTable").querySelector("tbody");
    tableBody.innerHTML = `
      <tr>
        <td>1</td>
        <td>
          <select>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </td>
        <td>
          <select>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </td>
        <td><input type="text" placeholder="" onblur="formatCurrency(this)" required></td>
        <td><input type="text" placeholder="" onblur="formatCurrency(this)" required></td>
        <td><button class="button" onclick="removeRow(this)">Eliminar</button></td>
      </tr>
    `;
    updateRowNumbers(); // Asegurarse de que la numeración sea correcta al resetear
    addEnterKeyListener(); // Inicializar el listener para las filas
  }
  
  // Función para generar las tablas de informe
  function generateReport() {
    const rows = document.querySelectorAll("#inputTable tbody tr");
    const data = {};
  
    // Procesar los datos de las filas
    rows.forEach(row => {
      const inputs = row.querySelectorAll("select, input");
      const year = parseInt(inputs[0].value) || 0;
      const productId = inputs[1].value || "Producto Desconocido";
      const propios = parseFloat(inputs[2].value.replace(/[^0-9.]/g, "")) || 0;
      const sgp = parseFloat(inputs[3].value.replace(/[^0-9.]/g, "")) || 0;
  
      if (!data[productId]) {
        data[productId] = { propios: {}, sgp: {} };
      }
      data[productId].propios[year] = (data[productId].propios[year] || 0) + propios;
      data[productId].sgp[year] = (data[productId].sgp[year] || 0) + sgp;
    });
  
    // Generar las tablas
    const reportContainer = document.getElementById("report");
    reportContainer.innerHTML = ""; // Limpiar informes anteriores
  
    for (const [product, resources] of Object.entries(data)) {
      generateTable(reportContainer, product, "propios", resources.propios);
    }
    for (const [product, resources] of Object.entries(data)) {
      generateTable(reportContainer, product, "sgp", resources.sgp);
    }
  }
  
  // Función para generar una tabla de informe
  function generateTable(container, product, type, data) {
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "table-wrapper";
    const table = document.createElement("table");
    const years = Object.keys(data).map(Number).sort((a, b) => a - b);
  
    let header = `<tr><th>Año</th><th>${type === "propios" ? "Recursos Propios" : "Recursos SGP"}</th></tr>`;
    let rows = "";
    let total = 0;
  
    for (let year of years) {
      const value = data[year] || 0;
      total += value;
      rows += `<tr><td>${year}</td><td>${value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</td></tr>`;
    }
  
    rows += `<tr><th>Total</th><th>${total.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</th></tr>`;
  
    table.innerHTML = `<thead>${header}</thead><tbody>${rows}</tbody>`;
    tableWrapper.innerHTML = `
      <h3>${type === "propios" ? "Recursos Propios" : "Recursos SGP"} - Producto ${product}</h3>
    `;
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);
  }
  
  // Función para dar formato a los valores de recursos como moneda
  function formatCurrency(input) {
    const value = parseFloat(input.value.replace(/[^0-9.]/g, "")) || 0;
    input.value = value.toLocaleString("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  
  // Función para calcular el total de recursos ingresados
  function calculateTotal() {
    const rows = document.querySelectorAll("#inputTable tbody tr");
    let totalPropios = 0;
    let totalSGP = 0;
  
    rows.forEach(row => {
      const inputs = row.querySelectorAll("input");
      const propios = parseFloat(inputs[0].value.replace(/[^0-9.]/g, "")) || 0;
      const sgp = parseFloat(inputs[1].value.replace(/[^0-9.]/g, "")) || 0;
      totalPropios += propios;
      totalSGP += sgp;
    });
  
    alert(
      `Total Recursos Propios: $${totalPropios.toLocaleString("en-US", { minimumFractionDigits: 2 })}\n` +
      `Total Recursos SGP: $${totalSGP.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
    );
  }
 
  // Función para actualizar la numeración de las filas
  function updateRowNumbers() {
    const rows = document.querySelectorAll("#inputTable tbody tr");
    rows.forEach((row, index) => {
      row.querySelector("td:first-child").textContent = index + 1;
    });
  }
  
  // Inicializar el eventListener en las filas existentes
  document.addEventListener('DOMContentLoaded', function() {
    addEnterKeyListener(); // Inicializar la función para las filas ya existentes
  });
  
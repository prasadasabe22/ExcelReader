/*let fileInput = document.getElementById('file-input')
let table = document.getElementById('table')
let selectedColumns = ['Assignee+', 'Resolution']*/

document.getElementById('create-table-btn').addEventListener('click', () => {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    const reader = new FileReader();


    document.getElementById('loading-spinner').style.display = 'block';
    reader.onload = (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);

        // Group data by Assignee+ and calculate sum of Resolution
        const groupedData = {};
        for (const row of rows) {
            const assignee = row['Assignee+'];
            let resolution = parseInt(row['Resolution'], 10) || 0; 
            resolution = Math.abs(resolution / 60,2);

            if (!groupedData[assignee]) {
                groupedData[assignee] = resolution;
            } else {
                groupedData[assignee] += resolution;
            }
        }

        // Create table to display grouped data
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Create table header
        const headerRow = document.createElement('tr');
        const thAssignee = document.createElement('th');
        const thTotalResolution = document.createElement('th');
        thAssignee.textContent = 'Assignee+';
        thTotalResolution.textContent = 'Total Resolution Hours';
        headerRow.appendChild(thAssignee);
        headerRow.appendChild(thTotalResolution);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        for (const assignee in groupedData) {
            const tr = document.createElement('tr');
            const tdAssignee = document.createElement('td');
            const tdTotalResolution = document.createElement('td');
            tdAssignee.textContent = assignee;
            tdTotalResolution.textContent = groupedData[assignee];
            tr.appendChild(tdAssignee);
            tr.appendChild(tdTotalResolution);
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);

        // Clear previous table content and append the new one
        const tableContainer = document.getElementById('table-container');
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);

        document.getElementById('loading-spinner').style.display = 'none';
    };

    reader.readAsArrayBuffer(file);
});
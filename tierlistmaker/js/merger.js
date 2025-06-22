let globalImageList = [];
let uploadedFiles = [];

let animeSeasons = [];

document.addEventListener("DOMContentLoaded", () => {
    const iframe = document.getElementById("indexFrame");
    iframe.addEventListener("load", () => {
        try {
            const indexWindow = iframe.contentWindow;
            animeSeasons = indexWindow.animeSeasons;
        } catch (error) {
        }
    });
});

function processFiles() {
    const files = document.getElementById('fileInput').files;
    if (files.length === 0 || files.length === 1) {
        alert('Please select at least 2 files.');
        return;
    }

    uploadedFiles = Array.from(files);  // Store the files globally
    let allData = [];
    let filesProcessed = 0;

    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const jsonData = JSON.parse(event.target.result);
                allData.push(jsonData);
                filesProcessed++;

                if (filesProcessed === files.length) {
                    calculateAverageRankings(allData, uploadedFiles); // Pass the uploaded files
                }
            } catch (e) {
                alert('Error parsing file: ' + file.name);
                throw e;
            }
        };
        reader.readAsText(file);
    }
}

function showTable() {
    document.getElementById("results").style.display = "block"; 
}

function calculateAverageRankings(allData, files) {
    let globalRank = {};  // To store the image IDs with their global positions
    let position = 1;
    globalImageList = [];
    const filesArray = files; // Use the globally stored files

    filesArray.forEach((file, fileIndex) => {
        let fileRank = 1;
        const data = allData[fileIndex];
        data.rows.forEach(row => {
            row.imgs.forEach(imgId => {
                if (!globalRank[imgId]) {
                    globalRank[imgId] = { positions: [], files: [] };
                }
                globalRank[imgId].positions.push(fileRank);
                globalRank[imgId].files.push(file.name); // Store the filename
                fileRank++;
            });
        });
    });

    for (const [imgId, info] of Object.entries(globalRank)) {
        const totalPosition = info.positions.reduce((sum, pos) => sum + pos, 0);
        const averagePosition = totalPosition / info.positions.length;
        globalImageList.push({
            imgId,
            averagePosition,
            positions: info.positions,
            files: info.files
        });
    }

    globalImageList.sort((a, b) => a.averagePosition - b.averagePosition); // Sort by average position
    resetTable();
    displayResults(globalImageList, filesArray);
}

function displayResults(results, files) {
    showTable();
    const tableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    const tableHeader = document.getElementById('resultsTable').getElementsByTagName('thead')[0];

    const exportButton = document.querySelector("#exportBtn");  // Get the export button
    const tierlistButton = document.querySelector("#tierlistBtn");  // Get the tierlist button

    // Clear previous table body and header
    tableBody.innerHTML = '';
    const headerRow = tableHeader.querySelector('tr');

    // Add a column header for each file
    files.forEach((file) => {
        const th = document.createElement('th');
        th.textContent = file.name; // File name as column header
        headerRow.appendChild(th);
    });

    const diffTh = document.createElement('th');
    diffTh.textContent = "Difference";
    headerRow.appendChild(diffTh);

    results.forEach((result, index) => {
        const row = document.createElement('tr');
        
        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;

        const imgCell = document.createElement('td');
        if (animeSeasons) {
            imgCell.textContent = detectAnime(result.imgId);
        } else {
            imgCell.textContent = result.imgId;
        }

        rankCell.textContent += ` (${result.averagePosition.toFixed(2)})`

        row.appendChild(rankCell);
        row.appendChild(imgCell);

        let minValue = Infinity;
        let maxValue = -Infinity;
        let cells = [];
    
        files.forEach((file) => {    
            const positionIndex = result.files.indexOf(file.name);
            let value = positionIndex >= 0 ? result.positions[positionIndex] : null;

            const fileCell = document.createElement('td');
    
            if (value !== null) {
                fileCell.textContent = value;
                cells.push({ cell: fileCell, value });
                minValue = Math.min(minValue, value);
                maxValue = Math.max(maxValue, value);
            } else {
                fileCell.textContent = '-';
            }
    
            row.appendChild(fileCell);    
        });

        cells.forEach(({ cell, value }) => {
            if (value === minValue) {
                cell.classList.add("lowest-value"); 
            }
            else if (value === maxValue) {
                cell.classList.add("highest-value");
            }
        });

        const diffCell = document.createElement('td');
        let diffValue = '-';
        if (minValue !== Infinity && maxValue !== -Infinity) {
            diffValue = maxValue - minValue;
            diffCell.textContent = diffValue;
        } else {
            diffCell.textContent = '-';
        }
        row.appendChild(diffCell);

        if (!window._diffCells) window._diffCells = [];
        window._diffCells.push({ cell: diffCell, value: diffValue });

        tableBody.appendChild(row);
    });

    displayColumnStats();

    toggleExportButton();
    toggleTierlistButton();

    enableColumnReordering();
    highlightDifferenceExtremes();
}

function highlightDifferenceExtremes() {
    const diffCells = (window._diffCells || []).filter(c => typeof c.value === "number");
    if (diffCells.length === 0) return;

    const minDiff = Math.min(...diffCells.map(c => c.value));
    const maxDiff = Math.max(...diffCells.map(c => c.value));

    diffCells.forEach(({ cell, value }) => {
        if (value === minDiff) {
            cell.classList.add("lowest-value");
        } else if (value === maxDiff) {
            cell.classList.add("highest-value");
        }
    });

    window._diffCells = [];
}

function sortResultsByRank(ascending) {
    const tableBody = document.querySelector("#resultsTable tbody");
    const rows = Array.from(tableBody.rows);
    
    rows.sort((a, b) => {
        const rankA = parseFloat(a.cells[0].textContent.split('(')[1].split(')')[0]);
        const rankB = parseFloat(b.cells[0].textContent.split('(')[1].split(')')[0]);
        
        return ascending ? rankA - rankB : rankB - rankA;
    });

    rows.forEach(row => tableBody.appendChild(row));
}

function updateSortArrow(arrow, ascending) {
    const allArrows = document.querySelectorAll('.sort-arrow');
    allArrows.forEach(a => a.classList.remove('asc', 'desc'));

    if (ascending) {
        arrow.classList.add('asc');
    } else {
        arrow.classList.add('desc');
    }
}

function displayColumnStats() {
    const allCells = document.querySelectorAll('#resultsTable td');

    let minCount = {};
    let maxCount = {};
    let neutralCount = {};

    allCells.forEach(cell => {
        const headerCells = cell.closest("table").querySelectorAll("th");
        const fileHeader = headerCells[cell.cellIndex].textContent.trim();
        if (cell.classList.contains("lowest-value")) {
            minCount[fileHeader] = (minCount[fileHeader] || 0) + 1;
        }
        if (cell.classList.contains("highest-value")) {
            maxCount[fileHeader] = (maxCount[fileHeader] || 0) + 1;
        }
        if (!cell.classList.contains("lowest-value") && !cell.classList.contains("highest-value")) {
            neutralCount[fileHeader] = (neutralCount[fileHeader] || 0) + 1;
        }
    });

    let statsContainer = document.getElementById("columnStats");
    if (!statsContainer) {
        statsContainer = document.createElement("div");
        statsContainer.id = "columnStats";
        document.body.appendChild(statsContainer);
    }

    statsContainer.innerHTML = "<h3>Stats</h3>";

    const table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr>
                <th>Fichier</th>
                <th>Lowest 🟢</th>
                <th>Highest 🔴</th>
                <th>Neutral ⚪</th>
            </tr>
        </thead>
        <tbody>
            ${Object.keys(minCount).map(file => {
                const minFileCount = minCount[file] || 0;
                const maxFileCount = maxCount[file] || 0;
                const neutralFileCount = neutralCount[file] || 0;
                return `
                    <tr>
                        <td>${file}</td>
                        <td>${minFileCount}</td>
                        <td>${maxFileCount}</td>
                        <td>${neutralFileCount}</td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    `;

    statsContainer.appendChild(table);
}

function exportResults(redirect = false) {
    const resultJson = {
        title: "Merged - " + uploadedFiles.map(file => file.name.replace('.json', '')).join(", "),
        rows: [],  // This will hold the rows (S, A, B, etc.)
        untiered: []  // This will hold the untiered images
    };

    const rankGroups = ['S', 'A', 'B', 'C', 'D'];  // Define ranks

    // Group images into different tiers based on average positions
    resultJson.rows = rankGroups.map(rank => ({
        name: rank,
        imgs: []
    }));

    globalImageList.sort((a, b) => a.averagePosition - b.averagePosition);

    globalImageList.forEach((result, index) => {
        const imgId = result.imgId;
    
        if (index < 10) {
            resultJson.rows[0].imgs.push(imgId); 
        } else if (index < 20) {
            resultJson.rows[1].imgs.push(imgId);
        } else if (index < 30) {
            resultJson.rows[2].imgs.push(imgId);
        } else if (index < 40) {
            resultJson.rows[3].imgs.push(imgId);
        } else {
            resultJson.rows[4].imgs.push(imgId);
        }
    });

    // Add any untiered images
    globalImageList.forEach(result => {
        const imgId = result.imgId;
        const isTiered = resultJson.rows.some(row => row.imgs.includes(imgId));
        if (!isTiered) {
            resultJson.untiered.push(imgId);
        }
    });

    if (redirect) {
        const jsonData = JSON.stringify(resultJson);
        localStorage.setItem("mergedData", jsonData);
        window.location.href = "index.html?merged=true";
    } else {
        // Convert the JSON object to a Blob for download
        const blob = new Blob([JSON.stringify(resultJson, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', resultJson.title + '.json');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Reset table when calculating averages again
function resetTable() {
    document.getElementById("results").style.display = "none"; 

    const tableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    const tableHeader = document.getElementById('resultsTable').getElementsByTagName('thead')[0];

    // Clear table body and header
    tableBody.innerHTML = '';
    tableHeader.querySelector('tr').innerHTML = '<th>Rank</th><th>Title</th>';
    toggleExportButton();
    toggleTierlistButton();
}

// Function to toggle the export button based on the table content
function toggleExportButton() {
    const tableBody = document.querySelector("#resultsTable tbody");
    const exportButton = document.querySelector("#exportBtn");

    // Check if the table body has any rows
    if (tableBody.rows.length > 0) {
        exportButton.disabled = false;  // Enable button if there's data
    } else {
        exportButton.disabled = true;   // Disable button if no data
    }
}

// Function to toggle the tierlist button based on the table content
function toggleTierlistButton() {
    const tableBody = document.querySelector("#resultsTable tbody");
    const tierlistButton = document.querySelector("#tierlistBtn");

    // Check if the table body has any rows
    if (tableBody.rows.length > 0) {
        tierlistButton.disabled = false;  // Enable button if there's data
    } else {
        tierlistButton.disabled = true;   // Disable button if no data
    }
}

function detectAnime(img) {
    for (const [season, items] of Object.entries(animeSeasons)) {
        const anime = items.find(item => item.img && item.img.includes(img));
        if (anime) {
            return anime.title; // Retourne le titre de l'anime
        }
    }
    return img; // Si non trouvé, retourne l'ID original
}

function enableColumnReordering() {
    const tableHeader = document.querySelector("#resultsTable thead");
    const headers = tableHeader.querySelectorAll("th");

    let rankSortAscending = true;
    
    headers.forEach((header, index) => {
        header.setAttribute("draggable", "true");

        header.addEventListener("dragstart", function(e) {
            e.dataTransfer.setData("text/plain", index);
        });

        header.addEventListener("dragover", function(e) {
            e.preventDefault();
            e.target.classList.add("drag-over");
        });

        header.addEventListener("dragleave", function(e) {
            e.target.classList.remove("drag-over");
        });

        header.addEventListener("drop", function(e) {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
            const toIndex = index;

            if (fromIndex === toIndex) return;

            reorderColumns(fromIndex, toIndex);
            e.target.classList.remove("drag-over");
        });

        if (header.textContent === "Rank") {
            const arrow = document.createElement('span');
            arrow.classList.add('sort-arrow');
            arrow.classList.add('asc');
            header.appendChild(arrow);

            header.addEventListener("click", function() {
                rankSortAscending = !rankSortAscending;
                sortResultsByRank(rankSortAscending);
                updateSortArrow(arrow, rankSortAscending);
            });
        }
    });
}

function reorderColumns(fromIndex, toIndex) {
    const table = document.getElementById('resultsTable');
    const rows = Array.from(table.rows);
    const headerRow = rows[0];
    const bodyRows = rows.slice(1);

    const fromHeader = headerRow.cells[fromIndex];
    const toHeader = headerRow.cells[toIndex];
    headerRow.insertBefore(toHeader, fromHeader);

    bodyRows.forEach(row => {
        const fromCell = row.cells[fromIndex];
        const toCell = row.cells[toIndex];
        row.insertBefore(toCell, fromCell);
    });
}
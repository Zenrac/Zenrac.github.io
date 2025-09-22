let globalImageList = [];
let uploadedFiles = [];
let animeSeasons = [];

const tieColors = [
    'rgba(255,179,71,0.18)',
    'rgba(71,179,255,0.18)',
    'rgba(179,255,71,0.18)',
    'rgba(255,71,179,0.18)',
    'rgba(255,255,71,0.18)',
    'rgba(179,71,255,0.18)',
    'rgba(71,255,179,0.18)',
];

const removeExtension = (url) => url.replace(/\.(jpg|jpeg|png|webp)/i, '');

document.addEventListener("DOMContentLoaded", () => {
    const iframe = document.getElementById("indexFrame");
    iframe.addEventListener("load", () => {
        try {
            const indexWindow = iframe.contentWindow;
            animeSeasons = indexWindow.animeSeasons;
        } catch {}
    });

    const exportButton = document.querySelector("#exportBtn");
    if (exportButton) {
        exportButton.addEventListener("click", (e) => {
            if (e.shiftKey) exportWithDetails();
            else exportResults();
        });
    }
});

function processFiles() {
    const files = document.getElementById('fileInput').files;
    if (files.length === 0) {
        alert('Please select at least 1 file.');
        return;
    }

    // Single file case
    if (files.length === 1) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                let jsonData = JSON.parse(event.target.result);

                if (Array.isArray(jsonData)) {
                    const userSet = new Set();
                    jsonData.forEach(item => {
                        if (item.positions && typeof item.positions === "object") {
                            Object.keys(item.positions).forEach(user => userSet.add(user));
                        }
                    });
                    const userList = Array.from(userSet);

                    const colorMap = {};
                    jsonData.forEach(item => {
                        colorMap[item.imgId] = item.colors || [];
                    });

                    jsonData = {
                        title: file.name.replace('.json', ''),
                        rows: [{
                            name: "All",
                            imgs: jsonData.map(item => item.imgId)
                        }],
                        untiered: [],
                        details: event.target.result ? JSON.parse(event.target.result) : [],
                        colorsMap: colorMap
                    };

                    uploadedFiles = userList.map(name => ({ name }));
                } else {
                    uploadedFiles = [file];
                }

                if (
                    !jsonData ||
                    typeof jsonData !== "object" ||
                    !Array.isArray(jsonData.rows) ||
                    !Array.isArray(jsonData.untiered)
                ) {
                    alert('You need to import at least 2 files or 1 merged file.');
                    return;
                }

                let allData = [jsonData];
                calculateAverageRankings(allData, uploadedFiles);
            } catch (e) {
                alert('Error parsing file: ' + file.name);
                throw e;
            }
        };
        reader.readAsText(file);
        return;
    }

    // Multiple files
    if (files.length < 2) {
        alert('Please select at least 2 files.');
        return;
    }

    uploadedFiles = Array.from(files);
    let allData = [];
    let filesProcessed = 0;

    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                let jsonData = JSON.parse(event.target.result);

                if (Array.isArray(jsonData)) {
                    const colorMap = {};
                    jsonData.forEach(item => {
                        colorMap[item.imgId] = item.colors || [];
                    });

                    jsonData = {
                        title: file.name.replace('.json', ''),
                        rows: [{
                            name: "All",
                            imgs: jsonData.map(item => item.imgId)
                        }],
                        untiered: [],
                        colorsMap: colorMap
                    };
                }

                allData.push(jsonData);
                filesProcessed++;

                if (filesProcessed === files.length) {
                    calculateAverageRankings(allData, uploadedFiles);
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
    let globalRank = {};
    globalImageList = [];
    const filesArray = files;

    if (allData.length === 1 && Array.isArray(allData[0].details) && filesArray.every(f => f.name)) {
        const details = allData[0].details;
        details.forEach(item => {
            globalRank[item.imgId] = { positions: [], files: [], colors: [] };
            filesArray.forEach(user => {
                const pos = item.positions[user.name];
                const col = item.colors ? item.colors[user.name] || [] : [];
                if (typeof pos === "number") {
                    globalRank[item.imgId].positions.push(pos);
                    globalRank[item.imgId].files.push(user.name);
                    globalRank[item.imgId].colors.push(col);
                }
            });
        });
    } else {
        filesArray.forEach((file, fileIndex) => {
            let fileRank = 1;
            const data = allData[fileIndex];
            data.rows.forEach(row => {
                row.imgs.forEach(imgId => {
                    if (!globalRank[imgId]) globalRank[imgId] = { positions: [], files: [], colors: {} };

                    const colorMap = data.colorsMap || {};
                    const existingColors = colorMap[imgId] || [];
                    console.log(existingColors)

                    globalRank[imgId].positions.push(fileRank);
                    globalRank[imgId].files.push(file.name);
                    globalRank[imgId].colors[file.name] = existingColors;

                    fileRank++;
                });
            });
        });
    }

    for (const [imgId, info] of Object.entries(globalRank)) {
        const totalPosition = info.positions.reduce((sum, pos) => sum + pos, 0);
        const averagePosition = totalPosition / info.positions.length;
        globalImageList.push({
            imgId,
            averagePosition,
            positions: info.positions,
            files: info.files,
            colors: info.colors
        });
    }

    globalImageList.sort((a, b) => {
        if (a.averagePosition !== b.averagePosition) return a.averagePosition - b.averagePosition;
        const bestA = Math.min(...a.positions);
        const bestB = Math.min(...b.positions);
        if (bestA !== bestB) return bestA - bestB;
        const countBestA = a.positions.filter(pos => pos === bestA).length;
        const countBestB = b.positions.filter(pos => pos === bestB).length;
        if (countBestA !== countBestB) return countBestB - countBestA;
        return a.imgId.localeCompare(b.imgId);
    });

    resetTable();
    displayResults(globalImageList, filesArray);
}

function displayResults(results, files) {
    showTable();
    const tableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    const tableHeader = document.getElementById('resultsTable').getElementsByTagName('thead')[0];

    const exportButton = document.querySelector("#exportBtn");
    const tierlistButton = document.querySelector("#tierlistBtn");

    tableBody.innerHTML = '';
    const headerRow = tableHeader.querySelector('tr');

    files.forEach((file) => {
        const th = document.createElement('th');
        th.textContent = file.name;
        headerRow.appendChild(th);
    });

    const diffTh = document.createElement('th');
    diffTh.textContent = "Difference";
    headerRow.appendChild(diffTh);

    const averageCount = {};
    results.forEach(r => { averageCount[r.averagePosition] = (averageCount[r.averagePosition] || 0) + 1; });

    const tieColorMap = {};
    let tieColorIdx = 0;
    Object.keys(averageCount).forEach(avg => { if (averageCount[avg] > 1) tieColorMap[avg] = tieColors[tieColorIdx++ % tieColors.length]; });

    results.forEach((result, index) => {
        const row = document.createElement('tr');
        const rankCell = document.createElement('td');
        if (averageCount[result.averagePosition] > 1) rankCell.style.backgroundColor = tieColorMap[result.averagePosition];
        rankCell.textContent = `${index + 1} (${result.averagePosition.toFixed(2)})`;
        const imgCell = document.createElement('td');
        imgCell.textContent = animeSeasons ? detectAnimeTitle(result.imgId) : result.imgId;
        row.appendChild(rankCell);
        row.appendChild(imgCell);

        let minValue = Infinity;
        let maxValue = -Infinity;
        let cells = [];

        files.forEach((file, i) => {
            const positionIndex = result.files.indexOf(file.name);
            let value = positionIndex >= 0 ? result.positions[positionIndex] : null;
            const fileCell = document.createElement('td');
            if (value !== null) {
                fileCell.textContent = value;
                cells.push({ cell: fileCell, value });
                minValue = Math.min(minValue, value);
                maxValue = Math.max(maxValue, value);
            } else fileCell.textContent = '-';
            row.appendChild(fileCell);
        });

        cells.forEach(({ cell, value }) => { if (value === minValue) cell.classList.add("lowest-value"); else if (value === maxValue) cell.classList.add("highest-value"); });

        const diffCell = document.createElement('td');
        const diffValue = (minValue !== Infinity && maxValue !== -Infinity) ? maxValue - minValue : '-';
        diffCell.textContent = diffValue;
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

function exportWithDetails() {
    const resultJson = { title: "Merged - " + uploadedFiles.map(f => f.name.replace('.json','')).join(", "), rows: [], untiered: [] };
    const details = globalImageList.map((result, index) => {
        const positionsByFile = {};
        const colorsByFile = {};
        result.files.forEach((file, i) => {
            positionsByFile[file] = result.positions[i];
            colorsByFile[file] = result.colors[file] || [];
        });
        const animeObj = detectAnime(result.imgId);
        let url = animeObj?.url || '';
        let id = '';
        let op = animeObj?.op ?? 1;
        let ed = animeObj?.ed ?? 1;
        if (url) {
            const match = url.match(/anime\/(\d+)/);
            if (match) id = match[1];
        }
        const detail = { imgId: result.imgId, id, url, rank: index+1, average: result.averagePosition, positions: positionsByFile, colors: colorsByFile, title: animeObj?.title || '' };
        if (op !== 1) detail.op = op;
        if (ed !== 1) detail.ed = ed;
        return detail;
    });

    const blob = new Blob([JSON.stringify(details, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', resultJson.title + '_details.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportResults(redirect = false) {
    const resultJson = { title: "Merged - " + uploadedFiles.map(f => f.name.replace('.json','')).join(", "), rows: [], untiered: [] };
    const imagesPerRank = 10;
    const totalImages = globalImageList.length;
    const numRanks = Math.ceil(totalImages / imagesPerRank);
    const alphabet = 'SABCDEFGHIJKLMNOPQRTUVWXYZ';
    const rankGroups = [];
    for (let i = 0; i < numRanks; i++) rankGroups.push(alphabet[i] || `Rank${i+1}`);
    resultJson.rows = rankGroups.map(rank => ({ name: rank, imgs: [] }));
    globalImageList.sort((a, b) => a.averagePosition - b.averagePosition);
    globalImageList.forEach((result, index) => { const rankIndex = Math.floor(index / imagesPerRank); resultJson.rows[rankIndex].imgs.push(result.imgId); });
    globalImageList.forEach(result => { if (!resultJson.rows.some(row => row.imgs.includes(result.imgId))) resultJson.untiered.push(result.imgId); });

    if (redirect) {
        localStorage.setItem("mergedData", JSON.stringify(resultJson));
        window.location.href = "index.html?merged=true";
    } else {
        const blob = new Blob([JSON.stringify(resultJson, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', resultJson.title + '.json');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function resetTable() {
    document.getElementById("results").style.display = "none";
    const tableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    const tableHeader = document.getElementById('resultsTable').getElementsByTagName('thead')[0];
    tableBody.innerHTML = '';
    tableHeader.querySelector('tr').innerHTML = '<th>Rank</th><th>Title</th>';
    toggleExportButton();
    toggleTierlistButton();
}

function toggleExportButton() { document.querySelector("#exportBtn").disabled = document.querySelector("#resultsTable tbody").rows.length === 0 ? true : false; }
function toggleTierlistButton() { document.querySelector("#tierlistBtn").disabled = document.querySelector("#resultsTable tbody").rows.length === 0 ? true : false; }

function detectAnimeTitle(img) { for (const [season, items] of Object.entries(animeSeasons)) { const anime = items.find(item => item.img && removeExtension(item.img).includes(removeExtension(img))); if (anime) return anime.title; } return img; }
function detectAnime(img) { for (const [season, items] of Object.entries(animeSeasons)) { const anime = items.find(item => item.img && item.img.includes(img)); if (anime) return anime; } return null; }

function enableColumnReordering() {
    const headers = document.querySelectorAll("#resultsTable thead th");
    let rankSortAscending = true;
    headers.forEach((header, index) => {
        header.setAttribute("draggable", "true");
        header.addEventListener("dragstart", e => e.dataTransfer.setData("text/plain", index));
        header.addEventListener("dragover", e => { e.preventDefault(); e.target.classList.add("drag-over"); });
        header.addEventListener("dragleave", e => e.target.classList.remove("drag-over"));
        header.addEventListener("drop", e => { e.preventDefault(); reorderColumns(parseInt(e.dataTransfer.getData("text/plain")), index); e.target.classList.remove("drag-over"); });
        if (header.textContent === "Rank") {
            const arrow = document.createElement('span');
            arrow.classList.add('sort-arrow', 'asc');
            header.appendChild(arrow);
            header.addEventListener("click", () => { rankSortAscending = !rankSortAscending; sortResultsByRank(rankSortAscending); updateSortArrow(arrow, rankSortAscending); });
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
    bodyRows.forEach(row => { const fromCell = row.cells[fromIndex]; const toCell = row.cells[toIndex]; row.insertBefore(toCell, fromCell); });
}

function sortResultsByRank(ascending) {
    const tableBody = document.querySelector("#resultsTable tbody");
    const rows = Array.from(tableBody.rows);
    rows.sort((a, b) => parseFloat(a.cells[0].textContent.split('(')[1].split(')')[0]) - parseFloat(b.cells[0].textContent.split('(')[1].split(')')[0]));
    if (!ascending) rows.reverse();
    rows.forEach(row => tableBody.appendChild(row));
}

function updateSortArrow(arrow, ascending) { document.querySelectorAll('.sort-arrow').forEach(a => a.classList.remove('asc','desc')); arrow.classList.add(ascending ? 'asc':'desc'); }

function highlightDifferenceExtremes() {
    const diffCells = (window._diffCells || []).filter(c => typeof c.value === "number");
    if (!diffCells.length) return;
    const minDiff = Math.min(...diffCells.map(c => c.value));
    const maxDiff = Math.max(...diffCells.map(c => c.value));
    diffCells.forEach(({cell, value}) => { if (value === minDiff) cell.classList.add("lowest-value"); else if (value === maxDiff) cell.classList.add("highest-value"); });
    window._diffCells = [];
}

function displayColumnStats() {
    const allCells = document.querySelectorAll('#resultsTable td');
    let minCount = {}, maxCount = {}, neutralCount = {};
    allCells.forEach(cell => {
        const headerCells = cell.closest("table").querySelectorAll("th");
        const fileHeader = headerCells[cell.cellIndex].textContent.trim();
        if (cell.classList.contains("lowest-value")) minCount[fileHeader] = (minCount[fileHeader]||0)+1;
        if (cell.classList.contains("highest-value")) maxCount[fileHeader] = (maxCount[fileHeader]||0)+1;
        if (!cell.classList.contains("lowest-value") && !cell.classList.contains("highest-value")) neutralCount[fileHeader] = (neutralCount[fileHeader]||0)+1;
    });
    let statsContainer = document.getElementById("columnStats") || (() => { const d = document.createElement("div"); d.id="columnStats"; document.body.appendChild(d); return d; })();
    statsContainer.innerHTML = "";
    const table = document.createElement("table");
    table.innerHTML = `<thead><tr><th></th><th class="lowest-value">Best Ranked</th><th class="highest-value">Worst Ranked</th><th>Neutral</th></tr></thead><tbody>${Object.keys(minCount).map(file => { let displayFile=file.replace(/\.json$/i,''); displayFile=displayFile.charAt(0).toUpperCase()+displayFile.slice(1); return `<tr><td>${displayFile}</td><td>${minCount[file]||0}</td><td>${maxCount[file]||0}</td><td>${neutralCount[file]||0}</td></tr>`; }).join('')}</tbody>`;
    statsContainer.appendChild(table);
}

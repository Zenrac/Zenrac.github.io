let globalImageList = [];
let uploadedFiles = [];  // Declare uploadedFiles globally

function processFiles() {
    const files = document.getElementById('fileInput').files;
    if (files.length === 0) {
        alert('Please select files.');
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
                console.log(e);
                alert('Error parsing file: ' + file.name);
            }
        };
        reader.readAsText(file);
    }
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

    var i = 0;
    for (const [imgId, info] of Object.entries(globalRank)) {
        i++;
        const totalPosition = info.positions.reduce((sum, pos) => sum + pos, 0);
        const averagePosition = totalPosition / info.positions.length;
        globalImageList.push({
            imgId,
            averagePosition,
            newposition: i,
            positions: info.positions,
            files: info.files
        });
    }

    globalImageList.sort((a, b) => a.averagePosition - b.averagePosition); // Sort by average position
    resetTable();
    displayResults(globalImageList, filesArray);
}

function displayResults(results, files) {
    const tableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    const tableHeader = document.getElementById('resultsTable').getElementsByTagName('thead')[0];

    // Clear previous table body and header
    tableBody.innerHTML = '';
    const headerRow = tableHeader.querySelector('tr');

    // Add a column header for each file
    files.forEach((file) => {
        const th = document.createElement('th');
        th.textContent = file.name; // File name as column header
        headerRow.appendChild(th);
    });

    results.forEach((result, index) => {
        const row = document.createElement('tr');
        
        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;

        const imgCell = document.createElement('td');
        imgCell.textContent = result.imgId;

        const avgRankCell = document.createElement('td');
        avgRankCell.textContent = result.averagePosition.toFixed(2);

        row.appendChild(rankCell);
        row.appendChild(imgCell);
        row.appendChild(avgRankCell);

        // Add a cell for each file to show the position values used for calculation
        files.forEach((file) => {
            const fileCell = document.createElement('td');
            const positionIndex = result.files.indexOf(file.name);
            if (positionIndex >= 0) {
                fileCell.textContent = result.positions[positionIndex];
            } else {
                fileCell.textContent = '-';
            }
            row.appendChild(fileCell);
        });

        tableBody.appendChild(row);
    });
}

function exportResults() {
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

    globalImageList.forEach(result => {
        let assigned = false;
        console.log(result);
        const imgId = result.imgId;
        const avgRank = result.newposition;

        // Determine the rank based on the average position
        if (avgRank <= 5) {
            resultJson.rows[0].imgs.push(imgId);  // Rank S
        } else if (avgRank <= 15) {
            resultJson.rows[1].imgs.push(imgId);  // Rank A
        } else if (avgRank <= 30) {
            resultJson.rows[2].imgs.push(imgId);  // Rank B
        } else if (avgRank <= 50) {
            resultJson.rows[3].imgs.push(imgId);  // Rank C
        } else {
            resultJson.rows[4].imgs.push(imgId);  // Rank D
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

// Reset table when calculating averages again
function resetTable() {
    const tableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    const tableHeader = document.getElementById('resultsTable').getElementsByTagName('thead')[0];

    // Clear table body and header
    tableBody.innerHTML = '';
    tableHeader.querySelector('tr').innerHTML = '<th>Rank</th><th>Image ID</th><th>Average Rank</th>';
}
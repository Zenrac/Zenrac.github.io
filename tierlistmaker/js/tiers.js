'use strict';

var seasonType = {
    "Opening": 1,
	"Ending": 2,
	"Anime" : 0,
};

const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];

const removeExtension = (url) => {
    return url.replace(/\.(jpg|jpeg|png|webp)/i, '');
};

const COLOR_LIST = [
	'Blue',      // #0066CC
	'Magenta', // #FF00FF
    'Turquoise', // #40E0D0
	'Orange',    // #FF9933
];

const COLOR_NAME_MAP = {
	'Blue': 'Zenrac',
	'Magenta': 'Roka',
	'Turquoise': 'Froslame',
	'Orange': 'Atlas'
};

const MAX_NAME_LEN = 200;
const DEFAULT_TIERS = ['S','A','B','C','D'];
const TIER_COLORS = [
	// from S to F
	'#ff6666',
	'#f0a731',
	'#f4d95b',
	'#66ff66',
	'#58c8f4',
	'#5b76f4',
	'#f45bed'
];

const saveTierListsCookieName = "saveTierlistsData";

let cookieData = {}

let unique_id = 0;

// Contains [[header, input, label]]
let all_headers = [];
let headers_orig_min_width;

// DOM elems
let untiered_images;
let tierlist_div;
let dragged_image;

const years = Object.keys(window.animeSeasons).map(key => {
  const parts = key.split(' ');
  return parseInt(parts[1], 10);
}).filter(year => !isNaN(year));

const minYear = Math.min(...years);
const maxYear = Math.max(...years);

const minDate = new Date(minYear, 0, 1);
const maxDate = new Date(maxYear, 11, 31); 

function detectAnimeSeason(img) {
	return Object.entries(window.animeSeasons )
	  .filter(([season, items]) => 
		items.some(item => item.img && item.img.includes(img))
	  )
	  .map(([season]) => season);
}

function importTierlist(file) {
	let reader = new FileReader();
	reader.addEventListener('load', (load_evt) => {
		let raw = load_evt.target.result;
		let parsed = JSON.parse(raw);
		if (!parsed) {
			alert("Failed to parse data");
			return;
		}
		load_tierlist(parsed);
	});
	reader.readAsText(file);
}

function importImage(file) {
	let images = document.querySelector('.images');
	let reader = new FileReader();
	reader.addEventListener('load', (load_evt) => {
		let img = create_img_with_src(load_evt.target.result);
		images.appendChild(img);
	});
	reader.readAsDataURL(file);

	refreshTierListStyle();
}

function countColorUsage(color) {
    const badges = document.querySelectorAll('.color-badge');
    let count = 0;
    badges.forEach(badge => {
        const colors = JSON.parse(badge.dataset.colors || '[]');
        if (colors.includes(color)) count++;
    });
    return count;
}

function openInfoModal(img) {
    if (!img) return;
    const title = img.title || img.alt || "";
    const src = img.src;
    const dropdownType = document.getElementById("dropdowntype");
    const tierListType = (dropdownType?.value == "Anime" ? "Trailer" : dropdownType?.value) ?? "Opening";
	let search_type = img.dataset.suffix_number ? img.dataset.suffix_number : " " + tierListType;
	if (search_type != "" && title.endsWith(search_type)) {
		search_type = "";
	}
    
    let animeUrl = "";
    if (window.animeSeasons) {
        const dropdown = document.getElementById("dropdown");
        const anime = window.animeSeasons[dropdown.value]?.find(a => removeExtension(a.img) === removeExtension(src));
        if (anime) animeUrl = anime.url || "";
    }

	const tierlistDiv = document.querySelector('.tierlist');
	const imgs = Array.from(tierlistDiv.querySelectorAll('.row .items .item img'));
	const index = imgs.indexOf(img);
	const rank = index >= 0 ? index + 1 : "N/A";

    const html = `
      <div style="text-align:center;">
        <img src="${src}" alt="${escapeHtml(title)}" style="width:250px;height:360px;border-radius:8px;margin-bottom:10px;">

		<div style="margin-bottom:8px;font-weight:bold;">
		Current Rank: ${rank}
		</div>

        <div style="display:flex;justify-content:center;gap:10px;">
          <div class="icon mal">
            <a class="si-a" href="${animeUrl}" target="_blank">
              <i class="si-mal"></i>
            </a>
          </div>
          <div class="icon animetheme">
            <a class="si-a" href="https://animethemes.moe/search?q=${encodeURIComponent(title)}" target="_blank">
              <svg fill="white" viewBox="0 0 160 86.6" width="50" height="50">
                <polygon points="56.25 32.48 56.25 75.78 75 86.6 75 0 0 43.3 18.75 54.13 56.25 32.48"></polygon>
                <polygon points="103.75 32.48 141.25 54.13 160 43.3 85 0 85 86.6 103.75 75.78 103.75 32.48"></polygon>
              </svg>
            </a>
          </div>
          <div class="icon youtube">
            <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(title + search_type)}" target="_blank">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
			<div class="icon color-selector">
				<a href="javascript:void(0);" title="Choose colors">
					<i class="fas fa-palette"></i>
				</a>
			</div>
        </div>
      </div>
    `;

    Swal.fire({
        title: escapeHtml(title),
        html: html,
        showConfirmButton: false,
        showCloseButton: true,
        width: '600px',
		didOpen: () => {
			const popup = Swal.getPopup();
			const colorBtn = popup.querySelector('.color-selector a');
			colorBtn?.addEventListener('click', () => openColorSelector(img.parentNode));
		}
    });
}

function openColorSelector(container) {
    const img = container.querySelector('img');
    let badge = container.querySelector('.color-badge');
    let selectedColors = badge ? JSON.parse(badge.dataset.colors) : [];

    const buttonsHtml = COLOR_LIST.map(c => `
        <button 
            class="color-btn ${selectedColors.includes(c) ? 'selected' : ''}" 
            data-color="${c}"
			title="${c} - ${COLOR_NAME_MAP[c] || ''}")}"
            style="background:${c};">
        </button>
    `).join('');

    Swal.fire({
        title: 'Choose your colors',
        html: `<div style="display:flex;flex-wrap:wrap;justify-content:center;">${buttonsHtml}</div>`,
        showCancelButton: true,
        confirmButtonText: 'OK',
        didOpen: () => {
            const btns = Swal.getPopup().querySelectorAll('.color-btn');
            btns.forEach(btn => {
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);

                newBtn.addEventListener('click', () => {
                    const color = newBtn.dataset.color;
					let max = 3 + (selectedColors.includes(color) ? 1 : 0);
                    if (countColorUsage(color) >= max) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Limit reached',
                            text: `You can only use ${color} 3 times in total`
                        });
                        return;
                    }

                    newBtn.classList.toggle('selected');
                });
            });
        },
        preConfirm: () => {
            return Array.from(
                Swal.getPopup().querySelectorAll('.color-btn.selected')
            ).map(btn => btn.dataset.color);
        }
    }).then(result => {
        if (result.isConfirmed) {
            if (result.value.length === 0) {
                if (badge) badge.remove();
                return;
            }

            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'color-badge';
                badge.style.position = 'absolute';
                badge.style.top = '5px';
                badge.style.right = '5px';
                badge.style.width = '20px';
                badge.style.height = '20px';
                badge.style.borderRadius = '50%';
                badge.style.border = '2px solid white';
                container.appendChild(badge);
            }

            badge.dataset.colors = JSON.stringify(result.value);

            if (result.value.length === 1) {
                badge.style.background = result.value[0];
            } else {
                let step = 100 / result.value.length;
                let gradient = result.value.map((c, i) =>
                    `${c} ${i * step}% ${(i + 1) * step}%`
                ).join(', ');
                badge.style.background = `conic-gradient(${gradient})`;
            }
        }

		refreshTierListStyle();
    });
}

function addColorBadge(container, color) {
    let badge = container.querySelector('.color-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'color-badge';
        badge.style.position = 'absolute';
        badge.style.top = '5px';
        badge.style.right = '5px';
        badge.style.width = '20px';
        badge.style.height = '20px';
        badge.style.borderRadius = '50%';
        badge.style.border = '2px solid white';
        badge.dataset.colors = JSON.stringify([]);
        container.appendChild(badge);
    }

    let colors = JSON.parse(badge.dataset.colors);

    if (!colors.includes(color)) {
        if (countColorUsage(color) >= 3) {
            alert(`You can only use ${color} 3 times in total`);
            return;
        }
        colors.push(color);
    }

    badge.dataset.colors = JSON.stringify(colors);

    if (colors.length === 1) {
        badge.style.background = colors[0];
    } else {
        let step = 100 / colors.length;
        let gradient = colors.map((c, i) => `${c} ${i * step}% ${(i + 1) * step}%`).join(', ');
        badge.style.background = `conic-gradient(${gradient})`;
    }
}

function exportImages(format) {
	save_tierlist();
	if (format == "PNG") {
		save_tierlist_png();
	}
	if (format == "JSON") {
		save_tierlist_json();
	}
	document.getElementById("export-menu").style.display = "none";
}

function changeImageColorBasedOnSearch() {

	let search_input = document.getElementById('search-input');
	let selectedText = search_input.value.toLowerCase() || "";
	let images = document.querySelectorAll('.image-container img');

	images.forEach(img => {
		let title = img.title.toLowerCase();
		if (selectedText.trim() == "") {
			img.classList.remove("highlight", "grayed");
		} else if (title.includes(selectedText)) {
			img.classList.remove("grayed");
			img.classList.add("highlight");
		} else {
			img.classList.remove("highlight");
			img.classList.add("grayed");
		}
	});
}

function reset_row(row) {
	row.querySelectorAll('span.item').forEach((item) => {
		for (let i = 0; i < item.children.length; ++i) {
			let img = item.children[i];
			item.removeChild(img);
			let firstChild = untiered_images.firstChild;
			// Check if firstChild exists
			if (firstChild) {
				// If firstChild exists, prepend the new element before it
				untiered_images.insertBefore(img, firstChild);
			} else {
				// If firstChild does not exist (empty list), simply append the new element to the container
				untiered_images.appendChild(img);
			}
		}
		item.parentNode.removeChild(item);
	});
}

// Removes all rows from the tierlist, alongside their content.
// Also empties the untiered images.
function hard_reset_list() {
	tierlist_div.innerHTML = '';
	untiered_images.innerHTML = '';
}

// Places back all the tierlist content into the untiered pool.
function soft_reset_list(resetRows = false) {
	let search_input = document.getElementById('search-input');
	search_input.value = "";
	tierlist_div.querySelectorAll('.row').forEach(reset_row);
	if (resetRows) {
		tierlist_div.innerHTML = '';
		for (let i = 0; i < DEFAULT_TIERS.length; ++i) {
			add_row(i, DEFAULT_TIERS[i]);
		}
		recompute_header_colors();
	}
}

function saveToLocalStorage(key, value) {
    const json = JSON.stringify(value);
    const encoded = btoa(encodeURIComponent(json));
    localStorage.setItem(key, encoded);
}

function loadFromLocalStorage(key) {
    try {
        const encoded = localStorage.getItem(key);
        if (!encoded) return {};
        const json = decodeURIComponent(atob(encoded));
        return JSON.parse(json) ?? {};
    } catch {}
    return {};
}

function randomize_tierlist() {
	soft_reset_list(true);
	var dropdown = document.getElementById("dropdown");
	var dropdownType = document.getElementById("dropdowntype");
	load_from_anime(
		window.animeSeasons[dropdown.value],
		`${dropdown.value} ${dropdownType.value}`,
		false,
		true
	);
}

// Called when page is loaded
window.addEventListener('load', () => {
	cookieData = loadFromLocalStorage(saveTierListsCookieName);

	untiered_images =  document.querySelector('.images');
	tierlist_div =  document.querySelector('.tierlist');

	for (let i = 0; i < DEFAULT_TIERS.length; ++i) {
		add_row(i, DEFAULT_TIERS[i]);
	}
	recompute_header_colors();

	headers_orig_min_width = all_headers[0][0].clientWidth;

	make_accept_drop(document.querySelector('.images'), false);

	bind_title_events();

	let search_input = document.getElementById('search-input');

	document.addEventListener('keydown', function(event) {
		const active = document.activeElement;
		if (
			active.tagName === "INPUT" ||
			active.tagName === "TEXTAREA" ||
			active.isContentEditable
		) {
			return;
		}

		if (event.shiftKey && event.key === 'R') {
			event.preventDefault();
			if (confirm('Randomize Tierlist? (this will shuffle all images in the tierlist)')) {
				randomize_tierlist();
			}
		}
	});

	document.addEventListener('keydown', function(event) {
		const active = document.activeElement;
		if (
			active.tagName === "INPUT" ||
			active.tagName === "TEXTAREA" ||
			active.isContentEditable
		) {
			return;
		}
		
		if (event.shiftKey && event.key === 'M') {
			event.preventDefault();
			window.location.href = "./merger.html";
		}
	});

	/*
	// Allow to search image with CTRL + F (Firefox only)
	if (navigator.userAgent.indexOf("Firefox") > 0) {
		document.addEventListener("selectionchange", () => {
			changeImageColorBasedOnSearch(window.getSelection().toString().toLowerCase());
		});
		search_input.style.display = 'none';
	}

	// Other navigators than firefox, manual search bar
	else {
	*/
	window.addEventListener("keydown",function (e) {
		if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) { 
			e.preventDefault();
			search_input.focus();
		}
	})
	search_input.addEventListener("input", (event) => {
		changeImageColorBasedOnSearch();
	});

	document.onpaste = (evt) => {
		let clip_data = evt.clipboardData || evt.originalEvent.clipboardData;
		let items = clip_data.items;
		let images = document.querySelector('.images');
		for (let item of items) {
			if (item.kind === 'file') {
				let blob = item.getAsFile();
				let reader = new FileReader();
				reader.onload = (load_evt) => {
					let img = create_img_with_src(load_evt.target.result);
					images.appendChild(img);
				};
				reader.readAsDataURL(blob);
			}
		}

		refreshTierListStyle();
	};

	document.getElementById('reset-list-input').addEventListener('click', () => {
		if (confirm('Reset Tierlist? (this will place all images back in the pool)')) {
			soft_reset_list(true);
			var dropdown = document.getElementById("dropdown");
			var dropdownType = document.getElementById("dropdowntype");
			load_from_anime(window.animeSeasons[dropdown.value], `${dropdown.value} ${dropdownType.value}`, false);
			refreshTierListStyle();
		}
	});

	document.getElementById("export-json-btn").addEventListener("click", function(event) {
		if (event.shiftKey) {
			exportTierlistDetails();
		} else {
			exportImages('JSON');
		}
	});

	document.getElementById("export-png-btn").addEventListener("click", function(event) {
		exportImages('PNG');
	});

	document.getElementById("export-btn").addEventListener("click", function(event) {
		event.stopPropagation();
		const menu = document.getElementById("export-menu");
		menu.style.display = (menu.style.display === "block") ? "none" : "block";
	});
	
	document.addEventListener("click", function(event) {
		const menu = document.getElementById("export-menu");
		if (menu.style.display === "block" && !event.target.closest(".button.export")) {
			menu.style.display = "none";
		}
	});

	document.getElementById('load-file-input').addEventListener('change', function(event) {
		const files = event.target.files;
		
		for (let file of files) {
			if (file.type.startsWith('image/')) {
				importImage(file);
			} else if (file.type === 'application/json') {
				importTierlist(file);
			} else {
				alert("Format non supporté !");
			}
		}
	});

	bind_trash_events();

	initialize_dropdown_tierlists();

	initialize_dropdown_type();

	var dropdown = document.getElementById("dropdown");
	var dropdownType = document.getElementById("dropdowntype");

	const urlParams = new URLSearchParams(window.location.search);
    const merged = urlParams.get('merged');

	if (merged === 'true') {
		const dataStr = localStorage.getItem("mergedData");
		let mergedData = null;

		if (dataStr) {
			try {
				mergedData = JSON.parse(dataStr);
			} catch (e) {
				mergedData = null;
			}
		}

		if (mergedData && Object.keys(mergedData).length > 0) {
			load_tierlist(mergedData);
		} else {
			alert("No valid merged data to load");
		}

	} else {
		dropdownType.dispatchEvent(new Event('change', { bubbles: true }));
	}
});

function refreshTierListStyle() {
	recompute_header_colors();
	resize_headers();
	changeImageColorBasedOnSearch();

	const urlParams = new URLSearchParams(window.location.search);
	const merged = urlParams.get('merged');
	if (merged !== 'true') {
		save_tierlist();
	}
}

function isDefaultTierlist(data) {
	var dropdown = document.getElementById("dropdown");
	var dropdownType = document.getElementById("dropdowntype");

	var expectedTitle = `Tierlist ${dropdown.value} ${dropdownType.value}`;
	if (data.title !== expectedTitle) {
		return false;
	}

	if (data.rows.length !== DEFAULT_TIERS.length) {
		return false;
	}

	for (let i = 0; i < DEFAULT_TIERS.length; i++) {
		const row = data.rows[i];
		if (row.name !== DEFAULT_TIERS[i]) {
			return false;
		}
		if (!Array.isArray(row.imgs) || row.imgs.length !== 0) {
			return false;
		}
	}

	return true;
}

function initialize_dropdown_type() {
	var dropdownType = document.getElementById("dropdowntype");
	var dropdown = document.getElementById("dropdown");

	dropdown.selectedIndex = 0;
	dropdownType.selectedIndex = 0;
	picker._setInputValue(new Date());

	for (var season in seasonType) {
		var option = document.createElement("option");
		option.text = season;
		option.value = season;
		dropdownType.add(option);
	}

	dropdownType.addEventListener("change", function() {
		soft_reset_list();
		load_from_anime(window.animeSeasons[dropdown.value], `${dropdown.value} ${dropdownType.value}`);
	});
}

function initialize_dropdown_tierlists() {
	var dropdownType = document.getElementById("dropdowntype");
	var dropdown = document.getElementById("dropdown");
	var dropdownPicker = document.getElementById("seasonPicker");

	for (var season in window.animeSeasons) {
		var option = document.createElement("option");
		option.text = season;
		option.value = season;
		dropdown.add(option);
	}

	dropdown.addEventListener("change", function() {
		dropdownPicker.value = dropdown.value;
		soft_reset_list();
		load_from_anime(window.animeSeasons[dropdown.value], `${dropdown.value} ${dropdownType.value}`);
	});

	dropdownPicker.addEventListener("change", function() {
		const desiredValue = dropdownPicker.value;
		if (Array.from(dropdown.options).some(opt => opt.value === desiredValue)) {
			dropdown.value = desiredValue;
		} else {
			dropdownPicker.value = dropdown.value;
		}
		dropdown.dispatchEvent(new Event('change', { bubbles: true }));
	});
}

function openVideoModal(searchUrl) {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.8)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "9999";

    const iframe = document.createElement("iframe");
    iframe.src = searchUrl.replace("results?search_query=", "embed/"); // tentative pour un embed direct si possible
    iframe.style.width = "80%";
    iframe.style.height = "80%";
    iframe.allow = "autoplay; encrypted-media";
    iframe.allowFullscreen = true;

    modal.appendChild(iframe);
    document.body.appendChild(modal);

    modal.addEventListener("click", () => modal.remove());
}

function create_img_with_src(src, title = "", url = "", op = "", ed = "") {
    var dropdownType = document.getElementById("dropdowntype");
    var dropdown = document.getElementById("dropdown");

    let parts = src.match(/(.*?)(\?.*)?(\.(webp|jpe?g))$/i);
    if (parts) {
        let base = parts[1];
        let query = parts[2] || "";
        let ext = parts[3];
        src = `${base}${ext}${query}`;
    }

    if ((title.trim() == "" || url.trim() == "") && window.animeSeasons[dropdown.value]) {
        let anime = window.animeSeasons[dropdown.value].filter(m => removeExtension(m.img).includes(removeExtension(src)));
        if (anime && anime.length > 0) {
            title = anime[0].title;
            url = anime[0].url;
            op = anime[0].op;
            ed = anime[0].ed;
        }
    }

	let suffix_number = "";
    let badgeText = "";
	if (op) {
		if (isNaN(op)) 
			badgeText = op;
		else if (ed != 1)
			suffix_number = ` Opening ${op}`;
	}
	else if (ed) {
		if (isNaN(ed)) 
			badgeText = ed;
		else if (ed != 1)
			suffix_number = ` Ending ${ed}`;
	}

    let img = document.createElement('img');
    img.src = src;
    img.style.userSelect = 'none';
    img.classList.add('draggable');
    img.title = title + suffix_number;
    img.alt = title + suffix_number;
	img.dataset.suffix_number = suffix_number;
    img.draggable = true;
    img.ondragstart = "event.dataTransfer.setData('text/plain', null)";
    img.addEventListener('mousedown', (evt) => {
        dragged_image = evt.target;
        dragged_image.classList.add("dragged");
    });

    if (url.trim() != "") {
        img.addEventListener("click", function(event) {
			event.preventDefault();
            const tierListType = (dropdownType?.value == "Anime" ? "Trailer" : dropdownType?.value) ?? "Opening";
            if (event.ctrlKey && title) {
                if (event.altKey || event.metaKey) {
                    let animeUrl = "https://animethemes.moe/search?q=" + encodeURIComponent(title);
                    window.open(animeUrl, "_blank");
                } else {
					let search_type = suffix_number ? suffix_number : " " + tierListType;
                    let youtubeUrl = "https://www.youtube.com/results?search_query=" + encodeURIComponent(title + search_type);
                    window.open(youtubeUrl, "_blank");
                }
            } else if (event.altKey || event.metaKey) {
                window.open(url, "_blank");
            } else if (event.shiftKey){
                openColorSelector(this.parentNode);
            } else {
				openInfoModal(this);
			}
        });
    }

    let titleSpan = document.createElement('label');
    titleSpan.classList.add('title-img');
    titleSpan.textContent = title;

    let container = document.createElement('div');
    container.classList.add('image-container');
    container.appendChild(img);
    container.appendChild(titleSpan);

    if (badgeText) {
        let badge = document.createElement('span');
        badge.classList.add('badge');
        badge.textContent = badgeText;
        container.appendChild(badge);
    }

    let item = document.createElement('span');
    item.classList.add('item');
    item.appendChild(container);

    return item;
}

function save_tierlist_png() {
	
    const tierlist = document.getElementById('tierlist');
	let title = document.getElementById('title-label');
	let elementsArray = tierlist.getElementsByClassName('row-buttons');
	const elementsToExclude = Array.from(elementsArray);
    elementsToExclude.forEach(element => {
        element.style.display = 'none';
    });
    html2canvas(tierlist, { useCORS: true, onrendered: function(canvas) {
        const img = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = title?.innerText ?? 'tierlist';
        link.href = img;
        link.click();

		elementsToExclude.forEach(element => {
			element.style.display = 'flex';
		});
    }});

}

function save_tierlist_json() {
	let title = document.getElementById('title-label');
    var dropdown = document.getElementById("dropdown");
    var dropdownType = document.getElementById("dropdowntype"); 
	var animes = loadFromLocalStorage(saveTierListsCookieName)[dropdown.value][dropdownType.value];
    var json = JSON.stringify(animes);
	var blob = new Blob([json], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = title?.innerText ?? (dropdown.value + "_" + dropdownType.value + ".json");
    a.click();
}

function findAnimeObj(imgId) {
	for (const season in window.animeSeasons) {
		const found = window.animeSeasons[season].find(a => a.img && removeExtension(a.img).includes(removeExtension(imgId)));
		if (found) return found;
	}        return null;
}

function exportTierlistDetails() {
    var dropdown = document.getElementById("dropdown");
    var dropdownType = document.getElementById("dropdowntype");
    var animes = loadFromLocalStorage(saveTierListsCookieName)[dropdown.value][dropdownType.value];
	console.log(animes);
    let details = [];
    let rank = 1;

    for (const row of animes.rows) {
        for (const anime of row.imgs) {
			let imgId = anime.src;
            const animeObj = findAnimeObj(imgId);
            let url = animeObj && animeObj.url ? animeObj.url : "";
            let id = "";
            let title = animeObj && animeObj.title ? animeObj.title : "";
            let op = animeObj && animeObj.op !== undefined ? animeObj.op : 1;
            let ed = animeObj && animeObj.ed !== undefined ? animeObj.ed : 1;
            if (url) {
                const match = url.match(/anime\/(\d+)/);
                if (match) id = match[1];
            }

			let img = document.querySelector(`img[src*="${imgId}"]`);
			let badge = img ? img.parentNode.querySelector('.color-badge') : null;
			let colors = badge ? JSON.parse(badge.dataset.colors) : [];

			let detail = {
				imgId: imgId,
				id: id,
				url: url,
				rank: rank++,
				title: title,
				colors: colors
			};
			if (isNaN(op)) detail.op = op;
			if (isNaN(ed)) detail.ed = ed;
			details.push(detail);
        }
    }

    var blob = new Blob([JSON.stringify(details, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
	let title = document.getElementById('title-label');
	a.download = (title?.innerText ?? (dropdown.value + "_" + dropdownType.value)) + "_details.json";
    a.click();
}

function save_tierlist() {
    let regex = /\/(\d+\/\d+)\.(webp|jpe?g)(\?.*)?$/;
    let serialized_tierlist = {
        title: document.querySelector('.title-label').innerText,
        rows: [],
    };
    tierlist_div.querySelectorAll('.row').forEach((row, i) => {
        let rowName = row.querySelector('.header label').innerText.substr(0, MAX_NAME_LEN);
        serialized_tierlist.rows.push({
            name: rowName,
            imgs: []
        });
		row.querySelectorAll('img').forEach((img) => {
			let match = img.src.match(regex);
			if (!match) return;
			let imgId = match[1] + (match[3] || "");

			let badge = img.parentNode.querySelector('.color-badge');
			let colors = badge ? JSON.parse(badge.dataset.colors) : [];

			serialized_tierlist.rows[i].imgs.push({
				src: imgId,
				colors: colors
			});
		});
    });
    let untiered_imgs = document.querySelectorAll('.images img');
    if (untiered_imgs.length > 0) {
        serialized_tierlist.untiered = [];
        untiered_imgs.forEach((img) => {
            let match = img.src.match(regex);
            if (match) {
                serialized_tierlist.untiered.push(match[1] + (match[3] || ""));
            }
        });
    }
    var dropdown = document.getElementById("dropdown");
    var dropdownType = document.getElementById("dropdowntype");
    var filename = dropdown.value;
    if (!cookieData[filename])
        cookieData[filename] = {};
    cookieData[filename][dropdownType.value] = serialized_tierlist;
    if (isDefaultTierlist(serialized_tierlist)) {
        delete cookieData[filename][dropdownType.value];
        if (Object.keys(cookieData[filename]).length === 0) {
            delete cookieData[filename];
        }
    }
    saveToLocalStorage(saveTierListsCookieName, cookieData);
}

function load_tierlist(serialized_tierlist) {

	if (serialized_tierlist.rows === undefined) {
		alert("Invalid tierlist data");
		return;
	}
    hard_reset_list();

	var detected = detectAnimeSeason(serialized_tierlist.rows[0].imgs[0])[0];
	
    if (detected) {
		var dropdownPicker = document.getElementById("seasonPicker");
		dropdownPicker.value = detected;
		var dropdown = document.getElementById("dropdown");
		dropdown.value = detected;
    }

    document.querySelector('.title-label').innerText = serialized_tierlist.title;

    for (let idx in serialized_tierlist.rows) {
        let ser_row = serialized_tierlist.rows[idx];
        let elem = add_row(idx, ser_row.name);

        for (let img_obj of ser_row.imgs ?? []) {
            let img_src, colors = [];
            if (typeof img_obj === 'string') {
                img_src = img_obj;
            } else {
                img_src = img_obj.src;
                colors = img_obj.colors ?? [];
            }

            if (!img_src.includes('http')) {
                img_src = `https://cdn.myanimelist.net/images/anime/${img_src}.webp`
            }

            let img_item = create_img_with_src(img_src);
            let items_container = elem.querySelector('.items');
            items_container.appendChild(img_item);

            if (colors.length > 0) {
                let container = img_item.querySelector('.image-container');
                addColorBadge(container, colors[0]);
                for (let i = 1; i < colors.length; i++) {
                    addColorBadge(container, colors[i]);
                }
            }
        }

        elem.querySelector('label').innerText = ser_row.name;
    }

    if (serialized_tierlist.untiered) {
        let images = document.querySelector('.images');
        for (let img_obj of serialized_tierlist.untiered) {
            let img_src, colors = [];
            if (typeof img_obj === 'string') {
                img_src = img_obj;
            } else {
                img_src = img_obj.src;
                colors = img_obj.colors ?? [];
            }

            if (!img_src.includes('http')) {
                img_src = `https://cdn.myanimelist.net/images/anime/${img_src}.webp`
            }

            let img_item = create_img_with_src(img_src);
            images.appendChild(img_item);

            if (colors.length > 0) {
                let container = img_item.querySelector('.image-container');
                addColorBadge(container, colors[0]);
                for (let i = 1; i < colors.length; i++) {
                    addColorBadge(container, colors[i]);
                }
            }
        }
    }
	
	refreshTierListStyle();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function load_from_anime(animeList, title, cookie = true, randomize = false) {

    const mode = document.getElementById("dropdowntype").value;

    let animes = animeList.filter(item => {
        if (mode === "Anime") return !item.ed && !item.op;
        if (mode === "Opening") {
            return !item.ed || item.op;
        }
        if (mode === "Ending") {
            return !item.op || item.ed;
        }
        return true;
    });

	untiered_images.innerHTML = '';
	document.getElementById('title-label').innerText = "Tierlist " + title;
	if (randomize) {
		shuffleArray(animes);
		for (let anime of animes) {
			let rows = Array.from(tierlist_div.querySelectorAll('.row')); 
			let randomIndex = Math.floor(Math.random() * rows.length);
			let items = rows[randomIndex].querySelectorAll(".items")[0]
			let img = create_img_with_src(anime.img, anime.title, anime.url, anime.op, anime.ed);
			items.appendChild(img);
		}
	}
	else {
		let images = document.querySelector('.images');
		for (let anime of animes) {
			let img = create_img_with_src(anime.img, anime.title, anime.url, anime.op, anime.ed);
			images.appendChild(img);
		}
	}	

	var dropdown = document.getElementById("dropdown");
	var dropdownType = document.getElementById("dropdowntype");

	if (cookie && cookieData && dropdown.value in cookieData && dropdownType.value in cookieData[dropdown.value]) {
		load_tierlist(cookieData[dropdown.value][dropdownType.value]);
	}

	refreshTierListStyle();
}

function end_drag(evt) {
	dragged_image?.classList.remove("dragged");
	dragged_image = null;
}

window.addEventListener('mouseup', end_drag);
window.addEventListener('dragend', end_drag);

function make_accept_drop(elem) {
    elem.addEventListener('dragover', (evt) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';
        evt.target.classList.add('drag-entered');
    });

    elem.addEventListener('dragleave', (evt) => {
        evt.target.classList.remove('drag-entered');
    });

    elem.addEventListener('drop', (evt) => {
        evt.preventDefault();
        evt.target.classList.remove('drag-entered');

        if (!dragged_image) return;

        const targetItem = evt.target.closest('span.item');
        const draggedItem = dragged_image.closest('span.item');

        if (targetItem === draggedItem) return;

        if (draggedItem.parentNode) {
            draggedItem.parentNode.removeChild(draggedItem);
        }

        const container = elem.querySelector('.items') || elem;

        if (targetItem) {
            const rect = targetItem.getBoundingClientRect();
            const mouseX = evt.clientX - rect.left;
            if (mouseX < rect.width / 2) {
                container.insertBefore(draggedItem, targetItem);
            } else {
                container.insertBefore(draggedItem, targetItem.nextSibling);
            }
        } else {
            container.appendChild(draggedItem);
        }

        refreshTierListStyle();
    });
}

function enable_edit_on_click(container, input, label, row = false) {
	function change_label(evt) {
		input.style.display = 'none';
		var dropdown = document.getElementById("dropdown");
		var dropdownType = document.getElementById("dropdowntype");
		if (!row) {
			label.innerText = input.value.trim() || `Tierlist ${dropdown.value} ${dropdownType.value}`;
		}
		else {
			label.innerText = input.value.trim() || label.innerText;
		}
		label.style.display = 'inline';
		refreshTierListStyle();
	}

	input.addEventListener('change', change_label);
	input.addEventListener('focusout', change_label);

	input.addEventListener('click', (evt) => {
		label.style.display = 'none';
		input.value = label.innerText.substr(0, MAX_NAME_LEN);
		input.style.display = 'inline';
		input.select();
	});
}

function bind_title_events() {
	let title_label = document.querySelector('.title-label');
	let title_input = document.getElementById('title-input');
	let title = document.querySelector('.title');

	enable_edit_on_click(title, title_input, title_label);
}

function create_label_input(row, row_idx, row_name) {
	let input = document.createElement('input');
	input.id = `input-tier-${unique_id++}`;
	input.type = 'text';
	input.addEventListener('change', resize_headers);
	let label = document.createElement('label');
	label.htmlFor = input.id;
	label.innerText = row_name;

	label.addEventListener('mouseenter', () => {
        const itemCount = row.querySelectorAll('.item').length;
        label.title = `${itemCount} item${itemCount !== 1 ? 's' : ''} in this row`;
    });

	let header = row.querySelector('.header');
	all_headers.splice(row_idx, 0, [header, input, label]);
	header.appendChild(label);
	header.appendChild(input);

	enable_edit_on_click(header, input, label, true);
}

function resize_headers() {
	let max_width = headers_orig_min_width;
	for (let [other_header, _i, label] of all_headers) {
		max_width = Math.max(max_width, label.clientWidth);
	}

	for (let [other_header, _i2, _l2] of all_headers) {
		other_header.style.minWidth = `${max_width}px`;
	}
}

function add_row(index, name) {
	let div = document.createElement('div');
	let header = document.createElement('span');
	let items = document.createElement('span');
	div.classList.add('row');
	header.classList.add('header');
	items.classList.add('items');
	div.appendChild(header);
	div.appendChild(items);
	let row_buttons = document.createElement('div');
	row_buttons.classList.add('row-buttons');
	let btn_plus_up = document.createElement('input');
	btn_plus_up.type = "button";
	btn_plus_up.value = '+';
	btn_plus_up.title = "Add row above";
	btn_plus_up.addEventListener('click', (evt) => {
		let parent_div = evt.target.parentNode.parentNode;
		let rows = Array.from(tierlist_div.children);
		let idx = rows.indexOf(parent_div);
		console.assert(idx >= 0);
		add_row(idx, name);
		recompute_header_colors();
	});
	let btn_rm = document.createElement('input');
	btn_rm.type = "button";
	btn_rm.value = '-';
	btn_rm.title = "Remove row";
	btn_rm.addEventListener('click', (evt) => {
		let rows = Array.from(tierlist_div.querySelectorAll('.row'));
		if (rows.length < 2) return;
		let parent_div = evt.target.parentNode.parentNode;
		let idx = rows.indexOf(parent_div);
		console.assert(idx >= 0);
		if (rows[idx].querySelectorAll('img').length === 0 ||
			confirm(`Remove tier ${rows[idx].querySelector('.header label').innerText}? (This will move back all its content to the untiered pool)`))
		{
			rm_row(idx);
		}
		recompute_header_colors();
	});
	let btn_plus_down = document.createElement('input');
	btn_plus_down.type = "button";
	btn_plus_down.value = '+';
	btn_plus_down.title = "Add row below";
	btn_plus_down.addEventListener('click', (evt) => {
		let parent_div = evt.target.parentNode.parentNode;
		let rows = Array.from(tierlist_div.children);
		let idx = rows.indexOf(parent_div);
		console.assert(idx >= 0);
		add_row(idx + 1, name);
		recompute_header_colors();
	});
	row_buttons.appendChild(btn_plus_up);
	row_buttons.appendChild(btn_rm);
	row_buttons.appendChild(btn_plus_down);
	div.appendChild(row_buttons);

	let rows = tierlist_div.children;
	if (index === rows.length) {
		tierlist_div.appendChild(div);
	} else {
		let nxt_child = rows[index];
		tierlist_div.insertBefore(div, nxt_child);
	}

	make_accept_drop(div);
	create_label_input(div, index, name);

	return div;
}

function rm_row(idx) {
	let row = tierlist_div.children[idx];
	reset_row(row);
	tierlist_div.removeChild(row);
}

function recompute_header_colors() {
	tierlist_div.querySelectorAll('.row').forEach((row, row_idx) => {
		let color = TIER_COLORS[row_idx % TIER_COLORS.length];
		row.querySelector('.header').style.backgroundColor = color;
	});
}

function bind_trash_events() {
	let trash = document.getElementById('trash');
	trash.addEventListener('dragenter', (evt) => {
		evt.preventDefault();
		evt.target.src = 'img/trash_bin_open.png';
	});
	trash.addEventListener('click', (evt) => {
		evt.preventDefault();
		if (confirm('Restore bin? (this will place all deleted images back in the pool)')) {
			let animeList = window.animeSeasons[dropdown.value];
			let mode = document.getElementById("dropdowntype").value;

			let animes = animeList.filter(item => {
				if (mode === "Anime") return !item.ed && !item.op;
				if (mode === "Opening") return !item.ed || item.op;
				if (mode === "Ending") return !item.op || item.ed;
				return true;
			});

			let alreadyAdded = Array.from(document.getElementsByClassName('item'));
			for (let anime of animes) {
				let isAlreadyAdded = alreadyAdded.some(span => {
					let img = span.querySelector('img');
					return img && removeExtension(img.src) === removeExtension(anime.img);
				});

				if (!isAlreadyAdded) {
					let images = document.querySelector('.images');
					if (!anime.img.includes('http')) {
						anime.img = `https://cdn.myanimelist.net/images/anime/${img_src}.webp`
					}
					let img = create_img_with_src(anime.img);
					images.appendChild(img);
				}
			}
			refreshTierListStyle();
		}
	});
	const toggleButton = document.getElementById("toggle-shortcuts");
	const shortcutsBox = document.getElementById("shortcuts-box");
	let isVisible = false;

	toggleButton.addEventListener("click", (e) => {
	e.stopPropagation();
	isVisible = !isVisible;
	shortcutsBox.style.display = isVisible ? "block" : "none";
	});

	document.addEventListener("click", (e) => {
	const clickedOutside = !shortcutsBox.contains(e.target) && !toggleButton.contains(e.target);
	if (isVisible && clickedOutside) {
		shortcutsBox.style.display = "none";
		isVisible = false;
	}
	});

	const closeButton = document.getElementById("shortcuts-close");

	closeButton.addEventListener("click", () => {
	shortcutsBox.style.display = "none";
	isVisible = false;
	});
	trash.addEventListener('dragleave', (evt) => {
		evt.preventDefault();
		evt.target.src = 'img/trash_bin.png';
	});
	trash.addEventListener('dragexit', (evt) => {
		evt.preventDefault();
		evt.target.src = 'img/trash_bin.png';
	});
	trash.addEventListener('dragover', (evt) => {
		evt.preventDefault();
	});
	trash.addEventListener('drop', (evt) => {
		evt.preventDefault();
		evt.target.src = 'img/trash_bin.png';
		if (dragged_image) {
			let dragged_image_parent = dragged_image.parentNode.parentNode;
			if (dragged_image_parent.tagName.toUpperCase() === 'SPAN' &&
					dragged_image_parent.classList.contains('item'))
			{
				let containing_tr = dragged_image_parent.parentNode;
				containing_tr.removeChild(dragged_image_parent);
			}
			dragged_image.remove();
		}
	});
}


const picker = new AirDatepicker('#seasonPicker', {
	view: 'months',
	minView: 'months',
	dateFormat(date) {
	const seasonIndex = Math.floor(date.getMonth() / 3);
	return seasons[seasonIndex] + ' ' + date.getFullYear();
	},
	minDate,
  	maxDate,
	onShow() {
	setTimeout(updateSeasons, 10);
	},
	onHide() {
	setTimeout(restorePreviousValue, 10);
	},
	onChangeView() {
	setTimeout(updateSeasons, 10);
	}
});

const input = document.getElementById('seasonPicker');
let previousValue = input.value;

function restorePreviousValue() {
	if (input.value === "Selecting...") {
		input.value = previousValue;
	}
}

function updateSeasons() {
    const datepickerVisible = document.querySelector('.air-datepicker--content') !== null;
    if (datepickerVisible) {
        if (input.value !== "Selecting...") {
            previousValue = input.value;
        }
        input.value = "Selecting...";
    } 

    const content = picker.$datepicker.querySelector('.air-datepicker--content');
    if (!content) return;

    const existing = picker.$datepicker.querySelector('.custom-season-container');
    if (existing) existing.remove();

    const navTitle = picker.$datepicker.querySelector('.air-datepicker-nav--title');
    if (!navTitle) return;
    const displayedYear = parseInt(navTitle.textContent.trim(), 10);
    if (isNaN(displayedYear)) return;

    const container = document.createElement('div');
    container.className = 'custom-season-container';

    // Corrected: Use Object.keys since animeSeasons is an object
    const seasonsAvailableInYear = new Set();
    const yearStr = displayedYear.toString();

    Object.keys(window.animeSeasons).forEach(seasonYearStr => {
        const [seasonName, year] = seasonYearStr.split(' ');
        if (year === yearStr) {
            seasonsAvailableInYear.add(seasonName);
        }
    });

    const yearAvailable = seasonsAvailableInYear.size > 0;

    seasons.forEach((season, i) => {
        const div = document.createElement('div');
        div.className = 'custom-season-cell ' + season.toLowerCase();
        div.textContent = season;

        if (!yearAvailable || !seasonsAvailableInYear.has(season)) {
            div.classList.add('disabled');
            div.style.pointerEvents = 'none';
            div.style.opacity = '0.5';
        } else {
            div.addEventListener('click', () => {
                picker.selectDate(new Date(displayedYear, i * 3, 1));
                picker.$el.value = season + ' ' + displayedYear;
                picker.hide();
            });
        }

        if (picker.date && picker.date.length) {
            const selectedYear = picker.date[0].getFullYear();
            const selectedSeason = Math.floor(picker.date[0].getMonth() / 3);
            if (selectedYear === displayedYear && selectedSeason === i) {
                div.classList.add('selected');
            }
        }

        container.appendChild(div);
    });

    var yearElement = picker.$datepicker.querySelector('.air-datepicker-nav--title.-disabled-');
    if (!yearElement) {
        content.appendChild(container);
    }
}

function attachNavListeners() {
	const prev = picker.$datepicker.querySelector('.air-datepicker-nav--action[data-action="prev"]');
	const next = picker.$datepicker.querySelector('.air-datepicker-nav--action[data-action="next"]');
	if (prev) prev.onclick = () => setTimeout(() => { updateSeasons(); attachNavListeners(); }, 10);
	if (next) next.onclick = () => setTimeout(() => { updateSeasons(); attachNavListeners(); }, 10);
}

picker.$el.addEventListener('click', () => {
    let val = picker.$el.value;
    if (val === "Selecting..." || !val || !val.includes(' ')) {
        val = previousValue;
    }
    const [seasonName, yearStr] = val.split(' ');
    const year = parseInt(yearStr, 10);
    const seasonToMonth = { Winter: 0, Spring: 3, Summer: 6, Fall: 9 };
    const month = seasonToMonth[seasonName] ?? 0;
	picker.setViewDate(new Date(year, month, 1));
	setTimeout(() => {
	updateSeasons();
	attachNavListeners();
	}, 10);
});

function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

function getPosition(img){
    const tierlistDiv=document.querySelector('.tierlist');
    const item=img.closest('span.item');
    const rowElem=item?item.closest('.row'):null;
    if(!rowElem) return null;
    const rows=Array.from(tierlistDiv.querySelectorAll('.row'));
    const rowIndex=rows.indexOf(rowElem);
    const items=Array.from(rowElem.querySelectorAll('.items .item'));
    const colIndex=items.indexOf(item);
    return {rowIndex,colIndex,rowElem,items};
}

function isBetter(imgA,imgB){
    const a=getPosition(imgA);
    const b=getPosition(imgB);
    if(!a||!b) return null;
    if(a.rowIndex<b.rowIndex) return true;
    if(a.rowIndex>b.rowIndex) return false;
    return a.colIndex<b.colIndex;
}

function swapElements(el1,el2){
    const p1=el1.parentNode;
    const p2=el2.parentNode;
    const n1=el1.nextSibling===el2?el1:el1.nextSibling;
    p2.insertBefore(el1,el2);
    p1.insertBefore(el2,n1);
	refreshTierListStyle();
}

function showResult(chosen, other, correct) {
    const chosenTitle = chosen.title || chosen.alt || 'Item';
    const otherTitle = other.title || other.alt || 'Item';
    const msg = correct
        ? `${chosenTitle} is correctly above ${otherTitle}.`
        : `You chose <b>${escapeHtml(chosenTitle)}</b>, but it is below <b>${escapeHtml(otherTitle)}</b> in your tierlist.`;

    Swal.fire({
        icon: correct ? 'success' : 'error',
        title: correct ? 'Good choice' : 'Wrong choice',
        html: msg,
        showConfirmButton: true,
        confirmButtonText: 'Next',
        showDenyButton: !correct,
        denyButtonText: 'Swap & Next',
        customClass: { denyButton: 'swal2-confirm' }
    }).then(res => {
        if (res.isConfirmed) openDuelModal();
        else if (res.isDenied) {
            swapElements(chosen.closest('.item'), other.closest('.item'));
            openDuelModal();
        }
    });
}

function openDuelModal() {
    const tierlistDiv = document.querySelector('.tierlist');
    if (!tierlistDiv) return;
    const imgs = Array.from(tierlistDiv.querySelectorAll('.row .items .item img'));
	imgs.forEach((img, index) => img.dataset.rank = index);
    if (imgs.length < 2) {
        Swal.fire({
            icon: 'info',
            title: 'Not enough items',
            text: 'Need at least 2 items in the tierlist. Do you want to randomize it?',
            showCancelButton: true,
            confirmButtonText: 'Yes, randomize',
            cancelButtonText: 'No'
        }).then(result => {
            if (result.isConfirmed) randomize_tierlist();
        });
        return;
    }

    let imgA, imgB;
    if (Math.random() < 0.5) {
        imgA = imgs[Math.floor(Math.random() * imgs.length)];
        const rankA = parseInt(imgA.dataset.rank ?? '0', 10);
        const similarPool = imgs.filter(img => img !== imgA && Math.abs(parseInt(img.dataset.rank ?? '0', 10) - rankA) <= 1);
        imgB = similarPool.length > 0
            ? similarPool[Math.floor(Math.random() * similarPool.length)]
            : (() => { let tmp; do { tmp = imgs[Math.floor(Math.random() * imgs.length)]; } while (tmp === imgA); return tmp; })();
    } else {
        let i = Math.floor(Math.random() * imgs.length);
        let j; do { j = Math.floor(Math.random() * imgs.length); } while (j === i);
        imgA = imgs[i]; imgB = imgs[j];
    }

    const titleA = imgA.title || imgA.alt || '';
    const titleB = imgB.title || imgB.alt || '';
    const suffixA = imgA.dataset.suffix_number;
    const suffixB = imgB.dataset.suffix_number;
    const rankDiff = Math.abs((parseInt(imgA.dataset.rank ?? 0, 10)) - (parseInt(imgB.dataset.rank ?? 0, 10)));

    const html = `
      <div style="display:flex;gap:20px;align-items:center;justify-content:center;flex-wrap:nowrap;">
        <div class="duel-choice" style="text-align:center;max-width:260px;">
          <img src="${imgA.src}" alt="${escapeHtml(titleA)}" style="width:250px;height:360px;cursor:pointer;border-radius:8px;border:4px solid transparent;display:block;">
          <div style="margin-top:8px;max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(titleA)}</div>
        </div>
        <div style="font-weight:bold;align-self:center;">VS</div>
        <div class="duel-choice" style="text-align:center;max-width:260px;">
          <img src="${imgB.src}" alt="${escapeHtml(titleB)}" style="width:250px;height:360px;cursor:pointer;border-radius:8px;border:4px solid transparent;display:block;">
          <div style="margin-top:8px;max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(titleB)}</div>
        </div>
      </div>
      <div style="text-align:center;font-size:0.9em;margin-top:8px;color:#999;">
        Click the image you prefer<br />
		Rank difference: ${rankDiff}
      </div>
    `;

    Swal.fire({
        title: 'Duel - Which do you prefer?',
        width: '600px',
        html: html,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        didOpen: () => {
            const popup = Swal.getPopup();
            const imgsInPopup = popup.querySelectorAll('.duel-choice img');
            const dropdownType = document.getElementById("dropdowntype");

            imgsInPopup.forEach(imgEl => {
                imgEl.addEventListener('click', event => {
                    const tierListType = (dropdownType?.value == "Anime" ? "Trailer" : dropdownType?.value) ?? "Opening";
                    const title = (imgEl === imgsInPopup[0]) ? titleA : titleB;
					const suffix = (imgEl === imgsInPopup[0]) ? suffixA : suffixB;
					let search_type = suffix ? suffix : " " + tierListType;
					if (search_type != "" && title.endsWith(search_type)) {
						search_type = "";
					}

                    if (event.ctrlKey && title) {
                        if (event.altKey || event.metaKey) {
                            window.open("https://animethemes.moe/search?q=" + encodeURIComponent(title), "_blank");
                        } else {
                            window.open("https://www.youtube.com/results?search_query=" + encodeURIComponent(title + search_type), "_blank");
                        }
                    } else if (event.altKey || event.metaKey) {
                        const url = findAnimeObj(imgEl.src).url;
                        window.open(url, "_blank");
                    } else {
                        const chosen = (imgEl.src === imgA.src) ? imgA : imgB;
                        const other = (chosen === imgA) ? imgB : imgA;
                        Swal.close();
                        const better = isBetter(chosen, other);
                        showResult(chosen, other, better);
                    }
                });
            });
        },
    });
}

document.addEventListener('keydown', e => {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
    if (e.shiftKey && (e.key === 'D' || e.key === 'd')) { e.preventDefault(); openDuelModal(); }
});

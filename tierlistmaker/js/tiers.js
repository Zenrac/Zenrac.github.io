'use strict';

var seasonType = {
    "Opening": 1,
	"Ending": 2,
	"Anime" : 0,
};

const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];

const removeExtension = (url) => url.replace(/\.(jpg|jpeg|png|webp)/i, '');

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

let unsaved_changes = false;

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
		unsaved_changes = true;
	});
	reader.readAsDataURL(file);

	refreshTierListStyle();
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
	unsaved_changes = true;
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

	// Allow copy-pasting image from clipboard
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
					unsaved_changes = true;
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


	window.addEventListener('beforeunload', (evt) => {
		return null;
		// if (!unsaved_changes) return null;
		// var msg = "You have unsaved changes. Leave anyway?";
		// (evt || window.event).returnValue = msg;
		// return msg;
	});
});

function refreshTierListStyle() {
	recompute_header_colors();
	resize_headers();
	changeImageColorBasedOnSearch();

	save_tierlist();

	unsaved_changes = true;
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
	picker.selectDate(new Date());

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
			// season not yet added
			dropdownPicker.value = dropdown.value;
		}
		dropdown.dispatchEvent(new Event('change', { bubbles: true }));
	});
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

    let img = document.createElement('img');
	img.src = src;
    img.style.userSelect = 'none';
    img.classList.add('draggable');
    img.title = title;
    img.alt = title;
    img.draggable = true;
    img.ondragstart = "event.dataTransfer.setData('text/plain', null)";
    img.addEventListener('mousedown', (evt) => {
        dragged_image = evt.target;
        dragged_image.classList.add("dragged");
    });

    if (url.trim() != "") {
        img.addEventListener("click", function(event) {
            let tierListType = (dropdownType?.value == "Anime" ? "Trailer" : dropdownType?.value) ?? "Opening";
            if (event.altKey && title) {
                if (event.ctrlKey || event.metaKey) {
                    let animeUrl = "https://animethemes.moe/search?q=" + encodeURIComponent(title);
                    window.open(animeUrl, "_blank");
                } else {
                    let youtubeUrl = "https://www.youtube.com/results?search_query=" + encodeURIComponent(title + " " + tierListType);
                    window.open(youtubeUrl, "_blank");
                }
            } else if (event.ctrlKey || event.metaKey) {
                window.open(url, "_blank");
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

    let mode = dropdownType.value;
    let badgeText = "";
    if (op) {
        badgeText = op
    } else if (ed) {
        badgeText = ed
    }
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
    a.download = title?.innerText ?? 'tierlist';
    a.click();
}

function exportTierlistDetails() {
    var dropdown = document.getElementById("dropdown");
    var dropdownType = document.getElementById("dropdowntype");
    var animes = loadFromLocalStorage(saveTierListsCookieName)[dropdown.value][dropdownType.value];

    let details = [];
    let rank = 1;

    function findAnimeObj(imgId) {
        for (const season in window.animeSeasons) {
            const found = window.animeSeasons[season].find(a => a.img && removeExtension(a.img).includes(removeExtension(imgId)));
            if (found) return found;
        }        return null;
    }

    for (const row of animes.rows) {
        for (const imgId of row.imgs) {
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
			let detail = {
				imgId: imgId,
				id: id,
				url: url,
				rank: rank++,
				title: title
			};
			if (op !== 1) detail.op = op;
			if (ed !== 1) detail.ed = ed;
			details.push(detail);
        }
    }

    var blob = new Blob([JSON.stringify(details, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (dropdown.value + "_" + dropdownType.value + "_details.json");
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
            if (match) {
                serialized_tierlist.rows[i].imgs.push(match[1] + (match[3] || ""));
            }
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
	hard_reset_list()
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

		for (let img_src of ser_row.imgs ?? []) {
			if (!img_src.includes('http')) {
				img_src = `https://cdn.myanimelist.net/images/anime/${img_src}.webp`
			}
			let img = create_img_with_src(img_src);
			let items_container = elem.querySelector('.items');
			items_container.appendChild(img);
		}

		elem.querySelector('label').innerText = ser_row.name;
	}

	if (serialized_tierlist.untiered) {
		let images = document.querySelector('.images');
		for (let img_src of serialized_tierlist.untiered) {
			if (!img_src.includes('http')) {
				img_src = `https://cdn.myanimelist.net/images/anime/${img_src}.webp`
			}
			let img = create_img_with_src(img_src);
			images.appendChild(img);
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

function create_img_with_label(src, labelText) {
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";

    const img = document.createElement("img");
    img.src = src;
    img.style.display = "block";
    wrapper.appendChild(img);

    if (labelText) {
        const label = document.createElement("span");
        label.innerText = labelText;
        label.style.position = "absolute";
        label.style.top = "5px";
        label.style.left = "5px";
        label.style.padding = "2px 5px";
        label.style.backgroundColor = "rgba(0,0,0,0.6)";
        label.style.color = "white";
        label.style.fontSize = "0.75rem";
        label.style.borderRadius = "3px";
        wrapper.appendChild(label);
    }

    return wrapper;
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

function make_accept_drop(elem, hover = true) {
	elem.classList.add('droppable');

	elem.addEventListener('dragenter', (evt) => {
		if (hover) {
			evt.target.classList.add('drag-entered');
		}
	});
	elem.addEventListener('dragleave', (evt) => {
		evt.target.classList.remove('drag-entered');
	});
	elem.addEventListener('dragover', (evt) => {
		evt.preventDefault();
	});
	elem.addEventListener('drop', (evt) => {
		evt.preventDefault();
		evt.target.classList.remove('drag-entered');

		if (!dragged_image) {
			return;
		}

		const targetImage = evt.target.closest('span.item');
		let dragged_image_parent_first = dragged_image.parentNode;
		let dragged_image_parent = dragged_image.parentNode.parentNode;

		if (targetImage === dragged_image_parent) {
			return;
		}

		if (dragged_image_parent.tagName.toUpperCase() === 'SPAN' &&
				dragged_image_parent.classList.contains('item')) {
			// We were already in a tier
			let containing_tr = dragged_image_parent.parentNode;
			containing_tr.removeChild(dragged_image_parent);
		} else {
			dragged_image_parent.removeChild(dragged_image_parent_first)
		}
		let img = create_img_with_src(dragged_image.src)
		let bank = document.querySelector('.bank');
		let items_container = elem.querySelector('.items');
		if (!items_container) {
			// Quite lazy hack for <section class='images'>
			items_container = elem;
		}
		if (targetImage) {
			const rect = targetImage.getBoundingClientRect();
			const mouseX = evt.clientX - rect.left; // Mouse position relative to the target image
			if (mouseX < rect.width / 2) {
				// If mouse is on the left half of the target image, insert before
				items_container.insertBefore(img, targetImage);
			} else {
				// If mouse is on the right half of the target image, insert after
				items_container.insertBefore(img, targetImage.nextSibling);
			}
		}
		else {
			if (evt.target == bank || evt.target.parentNode == bank) {
				let firstChild = items_container.firstChild;
				// Check if firstChild exists
				if (firstChild) {
					// If firstChild exists, prepend the new element before it
					items_container.insertBefore(img, firstChild);
				} else {
					// If firstChild does not exist (empty list), simply append the new element to the container
					items_container.appendChild(img);
				}
			}
			else {
				items_container.appendChild(img);
			}
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
	trash.classList.add('droppable');
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


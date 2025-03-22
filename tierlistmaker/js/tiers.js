'use strict';

var seasonType = {
    "Opening": 1,
	"Ending": 2,
	"Anime" : 0,
};

const seasons = ['winter', 'spring', 'summer', 'fall'];

const removeExtension = (url) => url.replace(/\.(jpg|jpeg|png|webp)$/i, '');

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
		hard_reset_list();
		var detected = detectAnimeSeason(parsed.rows[0].imgs[0])[0];
		var dropdown = document.getElementById("dropdown");
		dropdown.value = detected;
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

function getElementsFromMal() {
    var videos = document.getElementsByClassName("js-anime-type-1");
    var videoList = [];

    for (video of videos) {
        var member = video.querySelectorAll("div.scormem-item.member");
        var memberCount = member[0].innerText.trim();
        var count = 0;

        if (memberCount.includes('K')) {
            count = parseFloat(memberCount.replace("K", "")) * 1000;
        } else if (memberCount.includes('M')) {
            count = parseFloat(memberCount.replace("M", "")) * 1000000;
        } else {
            count = parseInt(memberCount);
        }

        if (count > 5000) {
            let date = video.getElementsByClassName('prodsrc')[0].getElementsByClassName('info')[0].getElementsByClassName('item')[0].innerHTML;
            let animeDate = new Date(date);
            let lastYearDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));

            if (animeDate > lastYearDate) {
                let imgDiv = video.querySelectorAll("img")[0];
                let img = imgDiv.src;
                let url = imgDiv.parentNode.href;
                let title = video.querySelectorAll(".link-title")[0].innerText;

                if (img != undefined && img.trim().length != 0) {
                    var videoInfo = {
                        img: img,
                        title: title,
                        url: url,
                        count: count
                    };
                    videoList.push(videoInfo);
                }
            }
        }
    }

    videoList.sort((a, b) => b.count - a.count);

	var finalList = videoList.map(video => {
        return {
            img: video.img,
            title: video.title,
            url: video.url
        };
    });

    var jsonOutput = JSON.stringify(finalList, null, 2);
    console.log(jsonOutput);
}

function changeImageColorBasedOnSearch(selectedText) {
	let images = document.querySelectorAll('.image-container img');

	images.forEach(img => {
		let title = img.title.toLowerCase();
		if (selectedText == "") {
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
	// dropdown.dispatchEvent(new Event('change', { bubbles: true }));
	// save_tierlist();
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

// Function to save in a cookie
function saveToCookie(key, value) {
	document.cookie = key + "=" + JSON.stringify(value) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
}

// Function to save in localstorage
function saveToLocalStorage(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

// Function to load JavaScript objects from a cookie
function loadFromCookie(key) {
	var cookies = document.cookie.split(';');
	try {
	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i].trim();
		if (cookie.startsWith(key + "=")) {
			return JSON.parse(cookie.substring(key.length + 1)) ?? {};
		}
	}
	} catch {}
	return {}
}

// Function to load JavaScript objects from localstorage
function loadFromLocalStorage(key) {
	try {
		return JSON.parse(localStorage.getItem(key)) ?? {};
	} catch {}
	return {}
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
		if (event.shiftKey && event.key === 'R') {
			event.preventDefault();
			if (confirm('Randomize Tierlist? (this will shuffle all images in the tierlist)')) {
				soft_reset_list(true);
				var dropdown = document.getElementById("dropdown");
				var dropdownType = document.getElementById("dropdowntype");
				load_from_anime(window.animeSeasons[dropdown.value], `${dropdown.value} ${dropdownType.value}`, false, true);
			}
		}
	});

	document.addEventListener('keydown', function(event) {
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
		changeImageColorBasedOnSearch(event.target.value.toLowerCase());
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
	};

	document.getElementById('reset-list-input').addEventListener('click', () => {
		if (confirm('Reset Tierlist? (this will place all images back in the pool)')) {
			soft_reset_list(true);
			var dropdown = document.getElementById("dropdown");
			var dropdownType = document.getElementById("dropdowntype");
			load_from_anime(window.animeSeasons[dropdown.value], `${dropdown.value} ${dropdownType.value}`, false);
			save_tierlist();
		}
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

	dropdown.selectedIndex = 0;
	dropdownType.selectedIndex = 0;

	const urlParams = new URLSearchParams(window.location.search);
    const merged = urlParams.get('merged');

	if (merged === 'true') {
		var mergedData = loadFromLocalStorage('mergedData');
		if (mergedData) {
			load_tierlist(mergedData)
		}
		else {
			alert("No data to load");
		}
	}
	else {
		// Load from localstorage
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

function initialize_dropdown_type() {
	var dropdownType = document.getElementById("dropdowntype");
	var dropdown = document.getElementById("dropdown");

	dropdown.selectedIndex = 0;
	dropdownType.selectedIndex = 0;

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

	dropdown.selectedIndex = 0;
	dropdownType.selectedIndex = 0;

	for (var season in window.animeSeasons) {
		var option = document.createElement("option");
		option.text = season;
		option.value = season;
		dropdown.add(option);
	}

	dropdown.addEventListener("change", function() {
		soft_reset_list();
		load_from_anime(window.animeSeasons[dropdown.value], `${dropdown.value} ${dropdownType.value}`);
	});
}

function create_img_with_src(src, title = "", url = "") {
	var dropdownType = document.getElementById("dropdowntype");
	var dropdown = document.getElementById("dropdown");

	if (title == "" || url == "" && window.animeSeasons[dropdown.value]) {
		let anime = window.animeSeasons[dropdown.value].filter(m => removeExtension(m.img).includes(removeExtension(src)))
		if (anime && anime.length > 0) {
			title = anime[0].title;
			url = anime[0].url;
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
	if (url != "") {
		img.addEventListener("click", function(event) {
			// Check if the CTRL key is pressed
			if (event.ctrlKey || event.metaKey) {
				// Open the link in a new tab/window
				window.open(url, "_blank");
			}
			if (event.altKey && title) {
				var dropdownType = document.getElementById("dropdowntype");
				let tierListType = (dropdownType?.value == "Anime" ? "Trailer" : dropdownType?.value) ?? "Opening";
				let youtubeUrl = "https://www.youtube.com/results?search_query=" + title + " " + tierListType;
				window.open(youtubeUrl, "_blank");
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

	let selection = window.getSelection().toString().toLowerCase();

	if (selection != "" && !title.toLowerCase().includes(selection)) {
		img.classList.add("grayed");
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

function save_tierlist() {
	let regex = /\/(\d+\/\d+)\.(webp|jpe?g)$/;
	let serialized_tierlist = {
		title: document.querySelector('.title-label').innerText,
		rows: [],
	};
	tierlist_div.querySelectorAll('.row').forEach((row, i) => {
		serialized_tierlist.rows.push({
			name: row.querySelector('.header label').innerText.substr(0, MAX_NAME_LEN)
		});
		serialized_tierlist.rows[i].imgs = [];
		row.querySelectorAll('img').forEach((img) => {
			let match = img.src.match(regex);
			if (match) {
				serialized_tierlist.rows[i].imgs.push(match[1]);
			}
		});
	});

	let untiered_imgs = document.querySelectorAll('.images img');
	if (untiered_imgs.length > 0) {
		serialized_tierlist.untiered = [];
		untiered_imgs.forEach((img) => {
			let match = img.src.match(regex);
			if (match) {
				serialized_tierlist.untiered.push(match[1]);
			}
		});
	}
	var dropdown = document.getElementById("dropdown");
	var dropdownType = document.getElementById("dropdowntype");
	var filename = dropdown.value
	if (!cookieData[filename])
		cookieData[filename] = {};
	cookieData[filename][dropdownType.value] = serialized_tierlist;
	saveToLocalStorage(saveTierListsCookieName, cookieData);
}

function convert_tierlist_from_json(json) {
	result = {
		title: json.title,
		rows: [],
		untiered: []
	};
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
	recompute_header_colors();

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

	resize_headers();

	unsaved_changes = false;
}

function load_tierlist(serialized_tierlist) {
	hard_reset_list()
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
	recompute_header_colors();

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

	resize_headers();

	unsaved_changes = false;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function load_from_anime(animes, title, cookie = true, randomize = false) {
	untiered_images.innerHTML = '';
	document.getElementById('title-label').innerText = "Tierlist " + title;
	if (randomize) {
		shuffleArray(animes);
		for (let anime of animes) {
			let rows = Array.from(tierlist_div.querySelectorAll('.row')); 
			let randomIndex = Math.floor(Math.random() * rows.length);
			let items = rows[randomIndex].querySelectorAll(".items")[0]
			let img = create_img_with_src(anime.img, anime.title, anime.url);
			items.appendChild(img);
		}
	}
	else {
		let images = document.querySelector('.images');
		for (let anime of animes) {
			let img = create_img_with_src(anime.img, anime.title, anime.url);
			images.appendChild(img);
		}
	}	

	var dropdown = document.getElementById("dropdown");
	var dropdownType = document.getElementById("dropdowntype");

	if (cookie && cookieData && dropdown.value in cookieData && dropdownType.value in cookieData[dropdown.value]) {
		load_tierlist(cookieData[dropdown.value][dropdownType.value]);
	}
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

		save_tierlist();
		unsaved_changes = true;
	});
}

function enable_edit_on_click(container, input, label) {
	function change_label(evt) {
		input.style.display = 'none';
		var dropdown = document.getElementById("dropdown");
		var dropdownType = document.getElementById("dropdowntype");
		label.innerText = input.value || `Tierlist ${dropdown.value} ${dropdownType.value}`;
		label.style.display = 'inline';
		save_tierlist();
		unsaved_changes = true;
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

	enable_edit_on_click(header, input, label);
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
			let animes = window.animeSeasons[dropdown.value];

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
			save_tierlist();
		}
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

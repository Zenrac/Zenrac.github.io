// ==UserScript==
// @name         BetterADK
// @namespace    http://tampermonkey.net/
// @version      1.50
// @description  Removes VF from ADKami, also add MAL buttons, Mavanimes links, new fancy icons and cool stuff!
// @author       Zenrac
// @match        https://www.adkami.com/*
// @match        https://www.adkami.com/*
// @match        https://m.adkami.com/*
// @match        http://www.adkami.com/*
// @match        http://m.adkami.com/*
// @match        https://adkami.com/*
// @match        http://adkami.com/*
// @match        http://*.adkami.com/*
// @match        https://*.adkami.com/*
// @match        https://www.mavanimes.co/*
// @match        http://www.mavanimes.co/*
// @match        https://franime.fr/*
// @match        http://franime.fr/*
// @match        https://nyaa.si/*
// @match        http://nyaa.si/*
// @downloadURL  https://raw.githubusercontent.com/Zenrac/Zenrac.github.io/main/scripts/BetterADK.user.js
// @updateURL    https://raw.githubusercontent.com/Zenrac/Zenrac.github.io/main/scripts/BetterADK.user.js
// @homepageURL  https://github.com/zenrac/Zenrac.github.io
// @supportURL   https://github.com/zenrac/Zenrac.github.io/issues
// @icon         https://www.google.com/s2/favicons?domain=adkami.com
// @require      https://raw.githubusercontent.com/Zenrac/Zenrac.github.io/main/scripts/gm_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// ==/UserScript==
(function() {
    'use strict';

    const CORRELATION_ADK_MAL = [-1, 1, 3, 5, 4, 2, 2]
    const MAGNET_ICON = "https://i.imgur.com/nDFlstE.png";
    const DOWNLOAD_ICON = "https://i.imgur.com/WoWtY7Y.png";
    const NYAA_ICON = "https://i.imgur.com/c8dv9WI.png";
    const BETTER_ADK_LOGO = "https://i.imgur.com/wOQ3Mop.png";
    const NO_RESULT_IMAGE = "https://i.imgur.com/Fg9J6uA.png";
    const ZENRAC_AVATAR = "https://i.imgur.com/7UWLr6t.png";
    const MAV_ICON = "https://i.imgur.com/xSHwElF.png";
    const FRA_ICON  = "https://i.imgur.com/f9PElxF.png";
    const VOA_ICON  = "https://i.imgur.com/xqi8s1S.png";
    const MAL_ICON = "https://i.imgur.com/S9KpzW5.png";
    const NO_RESULT_PLAYER = `<div style="display:flex;justify-content: center;height: 500px;"><img src="${NO_RESULT_IMAGE}"/></div>`;

    const urlParams = new URLSearchParams(window.location.search);

    /**
    * Allows to wait for an element to exist
    */
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function getMostCompatibleMagnet() {
        let configNyaaShortcut = urlParams.get('nyaashortcut');
        let configMagnet = urlParams.get('magnetpriority');
        let searchClass = configNyaaShortcut == "download" ? "fa-download" : "fa-magnet";
        let magnetElements = document.getElementsByClassName(searchClass)
        if (magnetElements.length > 0) {
            if (configMagnet) {
                for (let words of configMagnet.split(',')) {
                    for (let magnet of magnetElements) {
                        let all_words = true;
                        for (let word of words.split(' ')) {
                            if (!magnet.parentNode.parentNode.parentNode.innerHTML.toString().toLowerCase().includes(word.toLowerCase())) {
                                all_words = false;
                            }
                        }
                        if (all_words) {
                            return magnet;
                        }
                    }
                }
            }
            return magnetElements[0];
        }
        else {
            alert('Aucun résulat trouvé sur Nyaa !');
        }

    }

    if (window.location.href.includes("mavanimes") && window.location.href.includes("adk=true")) {
        var r = document.getElementsByTagName('script');

        for (var i = (r.length-1); i >= 0; i--) {

            if(r[i].getAttribute('id') != 'a'){
                r[i].parentNode.removeChild(r[i]);
            }

        }
        let maviframes = document.getElementsByTagName("iframe");
        let text = "";
        if (maviframes.length < 1 || (maviframes.length == 1 && maviframes[0].src.includes("dailymotion"))) {
            document.body.innerHTML = NO_RESULT_PLAYER;
            document.body.parentNode.style.overflow = 'hidden';
            return;
        }
        for (let i = 0; i < maviframes.length; i++) {
            if (!maviframes[i].src.includes("dailymotion")) {
                text += maviframes[i].outerHTML;
            }
        }
        document.body.innerHTML = text;
        let mavframes = document.getElementsByTagName("iframe");
        for (let i = 0; i < mavframes.length; i++) {
            mavframes[i].style.width = "100%";
        }

        return;
    }
    else if (window.location.href.includes("nyaa.si") && window.location.href.includes("adk=true")) {
        let magnetElement = getMostCompatibleMagnet();
        magnetElement.click();

        return;
    }
    // small part designed for franime only
    else if (window.location.href.includes("franime.fr") && window.location.href.includes("adk=true")) {
        var monTimeout = setTimeout(function() {
            document.body.innerHTML = NO_RESULT_PLAYER;
        }, 3000);

        waitForElm('#play_button').then((elm) => {
            clearTimeout(monTimeout);
            elm.click();
        });
        waitForElm("iframe.aspect-video").then((elm) => {
            document.body.innerHTML = elm.outerHTML;
            let mavframes = document.getElementsByTagName("iframe");
            for (let i = 0; i < mavframes.length; i++) {
                mavframes[i].style.maxHeight = "100vh";
            }
        });
        waitForElm(".art-layer-play").then((elm) => {
            elm.click();
            waitForElm("video.art-video").then((elm) => {
                window.location.href = elm.src;
            });
        });

        return;
    }
    else if (window.location.href.includes("adkami")) {
        GM_config.init("BetterADK Configuration", {
            "syncadklist" : {
                "label" : "Synchronisation automatique entre liste ADKami et MAL-Sync",
                "type" : "checkbox",
                "default" : true
            },
            "removednswarning" : {
                "label" : "Retire le message rouge d'information sur le blocage DNS des lecteurs",
                "type" : "checkbox",
                "default" : true
            },
            "alreadywatchedonagenda" : {
                "label" : "Affiche par défaut seulement les animés en cours de visionnage dans l'agenda",
                "type" : "select",
                "options" : {
                    "yes" : "Oui",
                    "no" : "Non",
                    "disable" : "Désactivé"
                }
            },
            "addprofiletomenu" : {
                "label" : "Ajoute une option mon profile au menu en haut à droite",
                "type" : "checkbox",
                "default" : true
            },
            "removevfepisode" : {
                "label" : "Retirer les épisodes VF",
                "type" : "checkbox",
                "default" : true
            },
            "removevfagenda" : {
                "label" : "Retirer les épisodes VF sur l'agenda",
                "type" : "checkbox",
                "default" : true
            },
            "removeteamnames" : {
                "label" : "Retirer l'affichage des noms des teams de sub",
                "type" : "checkbox",
                "default" : true
            },
            "removeopedpv" : {
                "label" : "Retirer les ED, OP et PV des listes d'épisodes",
                "type" : "checkbox",
                "default" : true
            },
            "calculateRealEpisodeNumber" : {
                "label" : "Recalcul du numéro d'épisode à partir de 1 à chaque nouvelle saison",
                "type" : "checkbox",
                "default" : true
            },
            "malicon" : {
                "label" : "Afficher l'icone MAL",
                "type" : "select",
                "options" : {
                    "both" : "Les deux",
                    "main" : "Seulement page principale",
                    "anime" : "Seulement page animé",
                    "never" : "Jamais"
                }
            },
            "nyaaicon" : {
                "label" : "Afficher l'icone Nyaa",
                "type" : "select",
                "options" : {
                    "both" : "Les deux",
                    "main" : "Seulement page principale",
                    "anime" : "Seulement page animé",
                    "never" : "Jamais"
                }
            },
            "mavanime" : {
                "label" : "Ajouter Mavanime (sur les pages d'animé)",
                "type" : "select",
                "options" : {
                    "both" : "Les deux",
                    "icon" : "Seulement icone",
                    "player" : "Seulement lecteurs",
                    "never" : "Jamais"
                }
            },
            "franime" : {
                "label" : "Ajouter FRAnime (sur les pages d'animé)",
                "type" : "select",
                "options" : {
                    "both" : "Les deux",
                    "icon" : "Seulement icone",
                    "player" : "Seulement lecteurs",
                    "never" : "Jamais"
                }
            },
            "voiranime" : {
                "label" : "Ajouter Voiranime (sur les pages d'animé)",
                "type" : "select",
                "options" : {
                    "both" : "Les deux",
                    "icon" : "Seulement icone",
                    "player" : "Seulement lecteurs",
                    "never" : "Jamais"
                }
            },
            "customnyaasearch" : {
                "label" : "Filtre recherche Nyaa",
                "type" : "text",
                "default" : "(vostfr|multi) 1080p"
            },
            "removecomments" : {
                "label" : "Masquer par défaut les commentaires sur les pages d'animé",
                "type" : "select",
                "options" : {
                    "current" : "Seulement si en train de regarder",
                    "never" : "Jamais",
                    "always" : "Toujours"
                }
            },
            "magnetpriority" : {
                "label" : "Mots séparés par une virgule, dans l'odre de priorité, pour la selection automatique du magnet/téléchargement",
                "type" : "text",
                "default" : "Tsundere-Raws,Erai-Raws"
            },
            "nyaashortcut" : {
                "label" : "Raccourci préféré Nyaa",
                "type" : "select",
                "options" : {
                    "magnet" : "Magnet",
                    "download" : "Téléchargement",
                    "disable" : "Désactivé"
                }
            }
        },
                       'body { background-color: #99aab5 !important; } #saveBtn, #cancelBtn { background-color: white !important; color: black !important; }',
                       {
            save: function() { location.reload() },
        });

        addGlobalStyle(`
            #GM_config {
              height: 600px !important;
              width: 50% !important;
              opacity: 0.90 !important;

            }`)

        function openSettingPanel(event) {
            if (!event.ctrlKey) {
                event.preventDefault();
                GM_config.open();
            }
        }

        /**
    * Enables to add a custom global css style.
    */
        function addGlobalStyle(css) {
            var head, style;
            head = document.getElementsByTagName('head')[0];
            if (!head) {
                return;
            }
            style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            head.appendChild(style);
        }

        /**
    * Recalculates right episode number starting from 1 at each new season.
    */
        function recalculateEpisodeNumbers(type, adk_id) {
            let animeElement = malContent.filter(el => el["anime_id"] == adk_id && el["saison"] > 1);
            if (animeElement.length == 0) {
                // anime is not more than one season on mal, should not count from 0"
                return;
            }
            let seasonsList = document.getElementsByClassName("ul-episodes");
            if (seasonsList && seasonsList.length > 0) {
                let seasons = seasonsList[0].getElementsByClassName("saison-container");
                if (seasons && seasons.length > 0) {
                    for (let season of seasons) {
                        let seasonName = season.getElementsByClassName("saison")
                        if (seasonName && seasonName.length > 0) {
                            let seasonNameMatch = seasonName[0].innerText.toLowerCase().match(/saison (\d+)/);
                            let saisonNumber = seasonNameMatch ? parseInt(seasonNameMatch[1]) : "01";
                            let episodes = season.getElementsByTagName("a");
                            if (episodes && episodes.length > 0) {
                                let newEpisodeNumber = 1;
                                for (let episode of episodes) {
                                    if (episode.innerText.includes(type) || (type == "vostfr" && !episode.innerText.includes("vf"))) {
                                        let episodeNameMatch = episode.innerText.toLowerCase().match(/episode (\d+)/);
                                        let episodeNumber = episodeNameMatch ? parseInt(episodeNameMatch[1]) : "01";
                                        let oldEp = episodeNumber.toString().padStart(2, '0');
                                        if (oldEp == "00") {
                                            continue;
                                        }
                                        let newEp = newEpisodeNumber.toString().padStart(2, '0');
                                        episode.innerText = episode.innerText.replace(oldEp, newEp);
                                        if (episode.parentNode.classList.contains("actived")) {
                                            let currentPageTitle = document.getElementsByClassName("title-header-video");
                                            if (currentPageTitle && currentPageTitle.length > 0) {
                                                currentPageTitle[0].innerText = currentPageTitle[0].innerText.replace(episodeNumber, newEpisodeNumber);
                                            }
                                        }
                                        newEpisodeNumber++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function checkIfAllSeasonStartWithOne() {
            let check = true;
            let seasonsList = document.getElementsByClassName("ul-episodes");
            if (seasonsList && seasonsList.length > 0) {
                let seasons = seasonsList[0].getElementsByClassName("saison-container");
                if (seasons && seasons.length > 0) {
                    for (let season of seasons) {
                        let episodes = season.getElementsByTagName("ul");
                        let realEpisodes = season.getElementsByTagName("a");
                        if (realEpisodes && realEpisodes.length > 0) {
                            for (let ep of realEpisodes) {
                                if (ep.innerText.includes("Episode")) {
                                    let episodeNameMatch = ep.innerText.toLowerCase().match(/episode (\d+)/);
                                    let episodeNumber = episodeNameMatch ? parseInt(episodeNameMatch[1]) : 99;
                                    check = check && episodeNumber < 2;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return check;
        }

        function calculateEpisodeNumberFromActived(activedElement, multiLanguages) {
            var ulListElement = activedElement.parentNode;
            var i = 1;
            if (!activedElement.previousSibling && activedElement.innerHTML.includes('000')) {
                return 0;
            }
            while ((activedElement = activedElement.previousSibling) != null ) {
                if (activedElement.innerHTML.includes('Episode') && !activedElement.innerHTML.includes('000') && (!multiLanguages || activedElement.innerHTML.includes('vostfr'))) {
                    i++;
                }
            }
            return i;
        }

        function calculateEpisodeNumberFromEpAndSeason(ep, season) {
            var seasonContainer = document.getElementsByClassName("ul-episodes")[0];
            var i = 0;
            var currentIndexEpisode = 0;
            var currentIndexSeason = 1;
            if (season == 0) {
                return ep;
            }
            var seasonElements = seasonContainer.getElementsByClassName("saison-container");
            for (var seasonElement of seasonElements) {
                var currentSeasonNumber = seasonElements.getElementsByClassName("saison");
                var episodeElements = seasonElement.getElementsByTagName("li");
                if (!episodeElements) {
                    continue;
                }
                for (var episodeElement of episodeElements) {
                    if (episodeElement.innerHTML.includes('vostfr') && episodeElement.innerHTML.includes('Episode')) {
                        i++;
                    }
                }
                if (currentIndexSeason == season) {
                    break
                }
            }
            return i + ep;
        }

        function resizeMainPageToMatchRight() {
            var droite = document.querySelector("#col-droit")
            var gauche = document.getElementsByClassName("fiche-look")[0]

            if (droite && gauche) {
                gauche.style.height = Math.min(gauche.clientHeight, droite.clientHeight) + "px";
            }
        }

        /**
    * Enables to have a sweet animation on all players thanks to collapsibles.
    */
        function collapsePlayerAnimation() {
            var coll = document.getElementsByClassName("collapsible");
            var collComments = document.getElementsByClassName("collapsible-comments");
            var droite = document.querySelector("#col-droit")
            var gauche = document.getElementsByClassName("fiche-look")[0]
            var i;

            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function() {
                    this.classList.toggle("activedPlayer");
                    var content = this.nextElementSibling;
                    if (!content.classList.contains("content") && !content.classList.contains("commentscontent")) {
                        content = content.nextElementSibling;
                    }
                    if (this.classList.contains("collapsibleComments")) {
                        if (content.style.visibility != "hidden"){
                            content.style.visibility = "hidden";
                            content.style.maxHeight = "2500px";
                            let commentTitle = document.getElementById("collapsibleCommentTitle");
                            commentTitle.innerText = commentTitle.innerHTML.replace('Commentaires', 'Commentaires (cachés)');

                        } else {
                            content.style.visibility = "visible";
                            content.style.maxHeight = "initial"
                            let commentTitle = document.getElementById("collapsibleCommentTitle");
                            commentTitle.innerText = commentTitle.innerHTML.replace('Commentaires (cachés)', 'Commentaires');
                        }
                    }
                    else {
                        if (content.style.maxHeight != "0px"){
                            content.style.maxHeight = "0px";
                        } else {
                            content.style.maxHeight = "2500px";
                        }
                    }
                });

                if (GM_config.get('removednswarning')) {
                    if (coll[i].nextElementSibling.innerText.includes("DNS")) {
                        coll[i].nextElementSibling.remove();
                    }
                }
            }

            addGlobalStyle(`
			.collapsible {
			  background-color: #777;
			  color: white;
			  cursor: pointer;
			  padding: 18px;
			  width: 100%;
			  border: none;
			  text-align: left;
			  outline: none;
			  font-size: 15px;
			}
			.collapsible:after {
			  content: "\\2212";
			  color: white;
			  font-weight: bold;
			  float: right;
			  margin-left: 5px;
			}
			.activedPlayer:after {
              content: '\\002B';
			}
            .commentscontent {
              padding: 0px !important;
              margin: 0px !important;
			  overflow: hidden;
			  transition: max-height 0.2s ease-out;
			}
			.content {
              padding: 0px !important;
              margin: 0px !important;
			  max-height: 2500px;
			  overflow: hidden;
			  transition: max-height 0.2s ease-out;
			}`);
        }

        // --- CODE ---

        // All pages

        // auto redirect to www.
        if (!window.location.hostname.startsWith("www.")) {
            const newURL = "https://www." + window.location.hostname + window.location.pathname + window.location.search;
            window.location.replace(newURL);
        }

        var connected = document.getElementById("headerprofil") != null
        var malContent = null;

        // Remove VF animes from lists
        const elems = document.getElementsByClassName("video-item-list");
        let to_remove = [];
        for (let i = 0; i < elems.length; i++) {
            if (elems.item(i).textContent.toLocaleLowerCase().includes(' vf ')) {
                to_remove.push(elems.item(i));
            } else if (elems.item(i).textContent.toLocaleLowerCase().includes(' vostfr ')) {
                let epVostfr = elems.item(i).getElementsByClassName("episode").item(0);
                if (epVostfr) {
                    epVostfr.innerText = epVostfr.innerText.replace(' vostfr', '')
                }
            } else if (GM_config.get('removevfepisode') && elems.item(i).textContent.toLocaleLowerCase().includes(' multi ')) {
                let epMulti = elems.item(i).getElementsByClassName("episode").item(0);
                if (epMulti) {
                    epMulti.innerText = epMulti.innerText.replace(' multi', '')
                }
            }
        }

        if (GM_config.get('removevfepisode')) {
            to_remove.forEach(elem => {
                $(elem).remove();
            });
        }

        // Remove team name everywhere
        if (GM_config.get('removeteamnames')) {
            const elems_teams = document.getElementsByClassName("team");
            if (!window.location.href.toLowerCase().includes("/anime/")) {
                let to_remove_teams = [];
                for (let i = 0; i < elems_teams.length; i++) {
                    to_remove_teams.push(elems_teams.item(i));
                }
                to_remove_teams.forEach(elem => {
                    $(elems_teams).remove();
                });
            }
        }

        // Add custom icons (mandatory to have configuration panel)
        try {
            $(document.getElementsByClassName("toolbar")[0].getElementsByTagName("a")[0].getElementsByTagName("div")[0]).remove();
        } catch {
        }
        let newLogo = document.createElement('img');
        newLogo.style = "width: 195px; margin-top: 15px; float: left; margin-left: 10px;";
        newLogo.src = BETTER_ADK_LOGO;
        let beel = document.getElementById("beelzebub");
        beel.style = "background-size: contain; background-repeat: no-repeat;";

        addGlobalStyle(`@media screen and (min-width: 800px) { #beelzebub { background-image: url(${ZENRAC_AVATAR}) !important; }}`);
        addGlobalStyle('@media screen and (min-width: 800px) { #beelzebub:after { content: "EZ EZ EZ EZ" !important; bottom: 7px; }}');
        addGlobalStyle('#video { margin-bottom: 10px; }');

        let zenrac = document.createElement("a");
        zenrac.target = "_blank"
        zenrac.href = "https://zenrac.github.io/"
        zenrac.addEventListener("click", openSettingPanel);

        // display version
        document.getElementsByClassName("col-12 copy")[0].textContent += " - BetterADK v" + GM_info.script.version;
        beel.parentNode.insertBefore(zenrac, beel.nextSibling);
        zenrac.appendChild(beel);

        document.title = document.title.replace('ADKami', 'BetterADK');

        document.getElementsByClassName("toolbar")[0].getElementsByTagName("a")[0].appendChild(newLogo);

        if (GM_config.get('addprofiletomenu')) {
            var profileElement = document.getElementById("headerprofil");
            if (profileElement) {
                var profileContent = profileElement.getElementsByTagName("ul")[0];
                if (profileContent) {
                    var profileFirstChild = profileContent.getElementsByTagName("li")[0];
                    if (profileFirstChild) {
                        var newProfileElement = profileFirstChild.cloneNode(true);
                        var username = document.head.querySelector("[name~=pseudo_member][content]").content;
                        if (username) {
                            newProfileElement.firstChild.href = `https://${window.location.hostname}/profil/${username}`;
                            newProfileElement.firstChild.innerText = "Mon profile";
                            profileContent.insertBefore(newProfileElement, profileFirstChild)
                        }
                    }
                }
            }
        }

        // on main page
        if (elems.length > 0) {
            // add mal icons
            if (["both", "main"].includes(GM_config.get('malicon'))) {
                let req = new Request(`https://${window.location.hostname}/api/main?objet=adk-mal-all`, {
                    method: 'GET',
                    credentials: 'include',
                });
                fetch(req)
                    .then(response => response.json())
                    .then(data => {
                    if (data.data === undefined) return;
                    malContent = data.data;
                    for (let i = 0; i < elems.length; i++) {
                        let after = elems[i].getElementsByClassName(connected ? "right list-edition" : "look")[0];
                        let title = elems[i].getElementsByClassName("title")[0];
                        let episode = elems[i].getElementsByClassName("episode")[0];
                        let clickableNyaa = document.createElement("a");
                        let ep = episode.innerText.toLowerCase().match(/episode (\d+)/);
                        let saison = episode.innerText.toLowerCase().match(/saison (\d+)/);
                        let id = after.dataset["info"].split(",")[0];
                        let malElement = data.data.filter(el => el["anime_id"] == id);
                        if (saison) {
                            let malElementSeason = malElement.filter(el => el["saison"] == saison[1]);
                            if (malElementSeason && malElementSeason.length > 0) {
                                malElement = malElementSeason;
                            }
                        }
                        malElement = malElement[0];
                        if (malElement !== undefined) {
                            let clickable = document.createElement("a");
                            clickable.target = "_blank"
                            clickable.href = "https://myanimelist.net/anime/" + malElement["mal_id"];
                            clickable.classList.add("lecteur-icon");
                            clickable.classList.add("crunchyroll");
                            let el = document.createElement("img");
                            clickable.appendChild(el);
                            el.style = "width: 40px";
                            el.src = MAL_ICON;
                            elems[i].insertBefore(clickable, after.nextSibling);
                        }
                    }
                })
                    .catch(console.error);
            }

            if (["both", "main"].includes(GM_config.get('nyaaicon'))) {
                // add nyaa icons
                for (let i = 0; i < elems.length; i++) {
                    let after = elems[i].getElementsByClassName(connected ? "right list-edition" : "look")[0];
                    let title = elems[i].getElementsByClassName("title")[0];
                    let episode = elems[i].getElementsByClassName("episode")[0];
                    let clickableNyaa = document.createElement("a");
                    let ep = episode.innerText.toLowerCase().match(/episode (\d+)/);
                    let oav = episode.innerText.toLowerCase().match(/oav (\d+)/);
                    let saison = episode.innerText.toLowerCase().match(/saison (\d+)/);
                    title = title.textContent.replace(',', '').replace('.', '').split(':')[0].split('-')[0].trim()
                    title = encodeURIComponent(title)
                    if (ep) {
                        let epStr = parseInt(ep[1]).toString().padStart(2, '0');
                        let saisonStr = saison ? parseInt(saison[1]).toString().padStart(2, '0') : "01";
                        clickableNyaa.href = "https://nyaa.si/?q=" + title + ` (${epStr}|S${saisonStr}E${epStr}) ${GM_config.get('customnyaasearch')}`;
                    }
                    else if (oav) {
                        let epStr = parseInt(oav[1]).toString().padStart(2, '0');
                        let saisonStr = saison ? parseInt(saison[1]).toString().padStart(2, '0') : "01";
                        clickableNyaa.href = "https://nyaa.si/?q=" + title + ` (${epStr}|S${saisonStr}E${epStr}) ${GM_config.get('customnyaasearch')}`;
                    }
                    else {
                        clickableNyaa.href = "https://nyaa.si/?q=" + title + " " + GM_config.get('customnyaasearch');
                    }
                    clickableNyaa.target = "_blank"
                    let elNyaa = document.createElement("img");
                    clickableNyaa.appendChild(elNyaa);
                    clickableNyaa.classList.add("lecteur-icon");
                    clickableNyaa.classList.add("crunchyroll");
                    elNyaa.style = "width: 40px";
                    elNyaa.src = NYAA_ICON;
                    clickableNyaa.addEventListener('click', (event) => {
                        if (ep && saison) {
                            event.preventDefault();
                            var url = elems[i].getElementsByClassName("img")[0].href;
                            $.get(url, null, function(text) {
                                var actived = $(text).find('.actived')[0];
                                if (actived) {
                                    var newEp = calculateEpisodeNumberFromActived(actived, true);
                                    let newEpStr = newEp.toString().padStart(2, '0');
                                    let epStr = parseInt(ep[1]).toString().padStart(2, '0');
                                    let saisonStr = saison ? parseInt(saison[1]).toString().padStart(2, '0') : "01";
                                    if (epStr != newEpStr) {
                                        clickableNyaa.href = "https://nyaa.si/?q=" + title + ` (${newEpStr}|S${saisonStr}E${newEpStr}|${epStr}|S${saisonStr}E${epStr}) ${GM_config.get('customnyaasearch')}`;
                                    }
                                }

                                window.open(clickableNyaa.href, '_blank');
                            });
                        }
                    });
                    elems[i].insertBefore(clickableNyaa, after.nextSibling);

                    // Magnet or Download icon
                    let nyaaShortcutMod = GM_config.get('nyaashortcut');
                    if (nyaaShortcutMod != "disable") {
                        let clickableNyaaMagnet = document.createElement("img");
                        clickableNyaaMagnet.addEventListener('click', function() {
                            var alreadyIframe = clickableNyaaMagnet.getElementsByClassName("nyaaMagnet")[0];
                            var urlNyaa = "";
                            if (ep) {
                                let epBeforeStr = parseInt(ep[1]).toString().padStart(2, '0');
                                let saisonStr = saison ? parseInt(saison[1]).toString().padStart(2, '0') : "01";
                                let epStr = ep.toString().padStart(2, '0');
                                urlNyaa = "https://nyaa.si/?q=" + title + ` (${epStr}|S${saisonStr}E${epStr}) ${GM_config.get('customnyaasearch')}`;
                                if (epBeforeStr != epStr) {
                                    urlNyaa = "https://nyaa.si/?q=" + title + ` (${epStr}|S${saisonStr}E${epStr}|${epBeforeStr}|S${saisonStr}E${epBeforeStr}) ${GM_config.get('customnyaasearch')}`;
                                }
                            }
                            else if (oav) {
                                let saisonStr = saison ? parseInt(saison[1]).toString().padStart(2, '0') : "01";
                                let epStr = oav.toString().padStart(2, '0');
                                urlNyaa = "https://nyaa.si/?q=" + title + ` (${epStr}|S${saisonStr}E${epStr}) ${GM_config.get('customnyaasearch')}`;
                            }
                            else {
                                urlNyaa = "https://nyaa.si/?q=" + title + " " + GM_config.get('customnyaasearch');
                            }
                            urlNyaa += `&adk=true&nyaashortcut=${GM_config.get('nyaashortcut')}&magnetpriority=${GM_config.get('magnetpriority')}`;
                            let frameMagnet = document.createElement("iframe");
                            frameMagnet.src = urlNyaa;
                            frameMagnet.classList.add("nyaaMagnet");
                            if (alreadyIframe) {
                                clickableNyaaMagnet.replaceChild(frameMagnet, alreadyIframe);
                            }
                            else {
                                clickableNyaaMagnet.appendChild(frameMagnet);
                            }
                        });
                        clickableNyaaMagnet.classList.add("lecteur-icon");
                        clickableNyaaMagnet.style.marginRight = "5px";
                        clickableNyaaMagnet.style.opacity = ".6";
                        clickableNyaaMagnet.style.float = "right";
                        clickableNyaaMagnet.style.width = "40px";
                        clickableNyaaMagnet.style.cursor = "pointer";
                        clickableNyaaMagnet.src = nyaaShortcutMod == "download" ? DOWNLOAD_ICON : MAGNET_ICON;
                        elems[i].insertBefore(clickableNyaaMagnet, after.nextSibling);
                    }
                }
            }
        }

        // Any anime page
        if (window.location.href.toLowerCase().includes("/anime/")) {
            let res = window.location.href.match(/anime\/(\d+)/);

            if (res) {
                document.title = document.title.replace(' vostfr', '');

                try {
                    let lienNormal = document.getElementsByClassName("normal")
                    let titleLink = lienNormal.item(0).getElementsByTagName("li")
                    let titlevostfr = titleLink.item(titleLink.length - 1);
                    titlevostfr.getElementsByTagName("a").item(0).getElementsByTagName("span").item(0).textContent = titlevostfr.getElementsByTagName("a").item(0).getElementsByTagName("span").item(0).textContent.replace('vostfr', '');
                } catch {}
                try {
                    document.getElementById("find_episode").placeholder = document.getElementById("find_episode").placeholder.replace(' (77 vf)', '');
                } catch {}
                document.getElementsByClassName("title-header-video")[0].innerText = document.getElementsByClassName("title-header-video")[0].innerText.replace(' vostfr', '')
                try {
                    document.getElementById("after-video").getElementsByTagName("span")[0].innerText = document.getElementById("after-video").getElementsByTagName("span")[0].innerText.replace(' vostfr', '');
                    document.getElementById("before-video").getElementsByTagName("span")[0].innerText = document.getElementById("before-video").getElementsByTagName("span")[0].innerText.replace(' vostfr', '');
                    document.getElementsByClassName("normal")[0].getElementsByTagName("li")[2].getElementsByTagName("a")[0].getElementsByTagName("span")[0].innerText = document.getElementsByClassName("normal")[0].getElementsByTagName("li")[2].getElementsByTagName("a")[0].getElementsByTagName("span")[0].innerText.replace(' vostfr', '');
                } catch {}
                let lis = document.getElementsByClassName("os-content")[0].getElementsByTagName("li");

                // Add data to all episode
                let allEpisodes = document.getElementsByClassName("ul-episodes")[0].getElementsByTagName("li");
                for (let episodeFromList of allEpisodes) {
                    if (episodeFromList.firstElementChild && episodeFromList.firstElementChild.innerText.includes("Episode")) {
                        let episodeNumber = episodeFromList.firstElementChild.innerText.toLowerCase().match(/episode (\d+)/);
                        episodeFromList.dataset.epnumber = parseInt(episodeNumber[1]);
                    };
                }

                // Remove useless fake EPs (OP, PV, ED, "vostfr in name")
                let to_remove_again = [];
                for (let i = 0; i < lis.length; i++) {
                    let toEdit = lis.item(i).getElementsByTagName("a")[0];
                    if (toEdit !== undefined) {
                        toEdit.innerText = toEdit.innerText.replace(' vostfr', '');
                    }
                    if (GM_config.get('removevfepisode')) {
                        if (lis.item(i).textContent.toLocaleLowerCase().includes(' vf')) {
                            to_remove_again.push(lis.item(i));
                        }
                    }
                    if (GM_config.get('removeopedpv')) {
                        if (lis.item(i).textContent.includes('PV ') ||
                            lis.item(i).textContent.includes('Ending ') ||
                            lis.item(i).textContent.includes('Opening ')) {
                            to_remove_again.push(lis.item(i));
                        }
                    }
                }
                to_remove_again.forEach(elem => {
                    $(elem).remove();
                });
                let adk_id = res[1];

                // Mavanime.co
                let nb = document.getElementsByClassName("title-header-video")[0].innerText.split('-').length - 1;
                let title = document.getElementsByClassName("title-header-video")[0].innerText.replace(',', '').replace('.', '').split(':')[0].split('-').slice(0, nb).join('-').trim().toLowerCase().split(' ').join('-');
                let originalTitle = document.getElementsByClassName("title-header-video")[0].innerText.replace(',', '').replace('.', '').split(':')[0].split('-').slice(0, nb).join(' ').trim();

                originalTitle = encodeURIComponent(originalTitle)

                let ep = document.getElementsByClassName("title-header-video")[0].innerText.split('-')[nb].toLowerCase().match(/episode (\d+)/);
                let oav = document.getElementsByClassName("title-header-video")[0].innerText.split('-')[nb].toLowerCase().match(/oav (\d+)/);
                let saison = document.getElementsByClassName("title-header-video")[0].innerText.split('-')[nb].match(/saison (\d+)/);
                let film = document.getElementsByClassName("title-header-video")[0].innerText.split('-')[nb].match(/film (\d+)/);

                title = title.replace(/[^a-zA-Z0-9!?&'":-_]/g, "-");
                title = title.replace(/[^a-zA-Z0-9-]/g, '');

                let activedElement = document.getElementsByClassName("actived")[0];
                let newEpElement = calculateEpisodeNumberFromActived(activedElement, false);
                let ici = document.getElementsByClassName("anime-information-icon")[0];

                var currentSeason = 1
                if (saison) {
                    currentSeason = saison[1];
                }

                var allSeasonStartWithOne = checkIfAllSeasonStartWithOne();

                var seasonNumber = document.getElementById("watchlist-saison").dataset.max
                if (!seasonNumber) {
                    seasonNumber = document.getElementsByClassName("saison").length.toString()
                }

                // Build MAV url
                let titleMav = title;
                if (saison) {
                    titleMav += "-" + saison[1];
                }
                if (newEpElement) {
                    titleMav += "-" + (parseInt(newEpElement) > 9 ? parseInt(newEpElement) : "0" + parseInt(newEpElement));
                }
                if (oav) {
                    titleMav += "-oav-" + parseInt(oav[1]);
                }
                if (film) {
                    titleMav += "-film-" + parseInt(film[1]);
                }
                titleMav += "-vostfr";
                let urlNormalMav = "https://www.mavanimes.co/" + titleMav;
                let urlMav = urlNormalMav + "/?adk=true";

                // Build FRAnime url
                let titleFra = title;
                if (oav) {
                    titleFra += `-oav?s=${currentSeason}&ep=` + parseInt(oav[1]);
                }
                else if (film) {
                    titleFra += `-film?s=${currentSeason}&ep=` + parseInt(film[1]);
                }
                else {
                    titleFra += "?s=" + currentSeason;
                    if (newEpElement) {
                        titleFra += "&ep=" + parseInt(newEpElement);
                    }
                }
                titleFra += "&lang=vo"
                let urlNormalFra = "https://franime.fr/anime/" + titleFra;
                let urlFra = urlNormalFra + "&adk=true";

                // Build Voiranime url
                let titleVoa = title;
                if (currentSeason > 1) {
                    titleVoa += `-${currentSeason}/${title}-${currentSeason}`;
                } else {
                    titleVoa += "/" + title;
                }
                if (oav) {
                    titleVoa += `-oav` + parseInt(oav[1]);
                }
                else if (film) {
                    titleVoa += `-film` + parseInt(film[1]);
                }
                else if (newEpElement) {
                    titleVoa += "-" + (parseInt(newEpElement) > 9 ? parseInt(newEpElement) : "0" + parseInt(newEpElement));
                }
                titleVoa += "-vostfr"
                let urlNormalVoa = "https://v5.voiranime.com/anime/" + titleVoa;
                let urlVoa = urlNormalVoa; // + "/?adk=true";

                // Add MAL Icon

                if ((["both", "anime"].includes(GM_config.get('malicon'))) || GM_config.get('calculateRealEpisodeNumber') || GM_config.get('syncadklist')) {
                    let req = new Request(`https://${window.location.hostname}/api/main?objet=adk-mal-all`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    fetch(req)
                        .then(response => response.json())
                        .then(data => {
                        if (data.data === undefined) return;
                        malContent = data.data;
                        // recalculate episode number
                        if (GM_config.get('calculateRealEpisodeNumber')) {
                            if (seasonNumber > 1) {
                                recalculateEpisodeNumbers("vostfr", adk_id);
                                recalculateEpisodeNumbers("vf", adk_id);
                            }
                        }
                        if (!["both", "anime"].includes(GM_config.get('malicon'))) return;
                        let url = data.data.find(el => el["anime_id"] == adk_id);
                        let malElement = data.data.filter(el => el["anime_id"] == adk_id);
                        if (saison) {
                            let malElementSeason = malElement.filter(el => el["saison"] == saison[1]);
                            if (malElementSeason && malElementSeason.length > 0) {
                                malElement = malElementSeason;
                            }
                        }
                        malElement = malElement[0];
                        if (url !== undefined) {
                            let clickable = document.createElement("a");
                            clickable.id = "malicon";
                            clickable.target = "_blank";
                            clickable.href = "https://myanimelist.net/anime/" + malElement["mal_id"];
                            let el = document.createElement("img");
                            clickable.appendChild(el);
                            el.style = "width: 40px";
                            el.src = MAL_ICON;
                            ici.appendChild(clickable);
                        }
                    })
                        .catch(console.error);
                }

                // Add Nyaa.si Icon
                if (["both", "anime"].includes(GM_config.get('nyaaicon'))) {
                    // Nyaa icon
                    let clickableNyaa = document.createElement("a");
                    if (ep) {
                        let epBeforeStr = parseInt(ep[1]).toString().padStart(2, '0');
                        let saisonStr = saison ? parseInt(saison[1]).toString().padStart(2, '0') : "01";
                        let epStr = newEpElement.toString().padStart(2, '0');
                        clickableNyaa.href = "https://nyaa.si/?q=" + originalTitle + ` (${epStr}|S${saisonStr}E${epStr}) ${GM_config.get('customnyaasearch')}`;
                        if (epBeforeStr != epStr) {
                            clickableNyaa.href = "https://nyaa.si/?q=" + originalTitle + ` (${epStr}|S${saisonStr}E${epStr}|${epBeforeStr}|S${saisonStr}E${epBeforeStr}) ${GM_config.get('customnyaasearch')}`;
                        }
                    } else if (oav) {
                        let epBeforeStr = parseInt(oav[1]).toString().padStart(2, '0');
                        let saisonStr = saison ? parseInt(saison[1]).toString().padStart(2, '0') : "01";
                        let epStr = newEpElement.toString().padStart(2, '0');
                        clickableNyaa.href = "https://nyaa.si/?q=" + originalTitle + ` (${epStr}|S${saisonStr}E${epStr}) ${GM_config.get('customnyaasearch')}`;
                    }
                    else {
                        clickableNyaa.href = "https://nyaa.si/?q=" + originalTitle + " " + GM_config.get('customnyaasearch');
                    }
                    clickableNyaa.target = "_blank"
                    let elNyaa = document.createElement("img");
                    clickableNyaa.appendChild(elNyaa);
                    elNyaa.style = "width: 40px";
                    elNyaa.src = NYAA_ICON;
                    ici.appendChild(clickableNyaa);

                    // Magnet or Download icon
                    let nyaaShortcutMod = GM_config.get('nyaashortcut');
                    if (nyaaShortcutMod != "disable") {
                        let clickableNyaaMagnet = document.createElement("img");
                        clickableNyaaMagnet.addEventListener('click', function() {
                            var alreadyIframe = clickableNyaaMagnet.getElementsByClassName("nyaaMagnet")[0];
                            var urlNyaa = "";
                            if (ep) {
                                let epBeforeStr = parseInt(ep[1]).toString().padStart(2, '0');
                                let saisonStr = saison ? parseInt(saison[1]).toString().padStart(2, '0') : "01";
                                let epStr = newEpElement.toString().padStart(2, '0');
                                urlNyaa = "https://nyaa.si/?q=" + originalTitle + ` (${epStr}|S${saisonStr}E${epStr}) ${GM_config.get('customnyaasearch')}`;
                                if (epBeforeStr != epStr) {
                                    urlNyaa = "https://nyaa.si/?q=" + originalTitle + ` (${epStr}|S${saisonStr}E${epStr}|${epBeforeStr}|S${saisonStr}E${epBeforeStr}) ${GM_config.get('customnyaasearch')}`;
                                }
                            } else if (oav) {
                                let epBeforeStr = parseInt(oav[1]).toString().padStart(2, '0');
                                let saisonStr = saison ? parseInt(saison[1]).toString().padStart(2, '0') : "01";
                                let epStr = newEpElement.toString().padStart(2, '0');
                                urlNyaa = "https://nyaa.si/?q=" + originalTitle + ` (${epStr}|S${saisonStr}E${epStr}) ${GM_config.get('customnyaasearch')}`;
                                if (epBeforeStr != epStr) {
                                    urlNyaa = "https://nyaa.si/?q=" + originalTitle + ` (${epStr}|S${saisonStr}E${epStr}|${epBeforeStr}|S${saisonStr}E${epBeforeStr}) ${GM_config.get('customnyaasearch')}`;
                                }
                            }
                            else {
                                urlNyaa = "https://nyaa.si/?q=" + originalTitle + " " + GM_config.get('customnyaasearch');
                            }
                            urlNyaa += `&adk=true&nyaashortcut=${GM_config.get('nyaashortcut')}&magnetpriority=${GM_config.get('magnetpriority')}`;
                            let frameMagnet = document.createElement("iframe");
                            frameMagnet.src = urlNyaa;
                            frameMagnet.classList.add("nyaaMagnet");
                            if (alreadyIframe) {
                                clickableNyaaMagnet.replaceChild(frameMagnet, alreadyIframe);
                            }
                            else {
                                clickableNyaaMagnet.appendChild(frameMagnet);
                            }
                        });

                        clickableNyaaMagnet.style.width = "40px";
                        clickableNyaaMagnet.style.cursor = "pointer";
                        clickableNyaaMagnet.src = nyaaShortcutMod == "download" ? DOWNLOAD_ICON : MAGNET_ICON;
                        ici.appendChild(clickableNyaaMagnet);
                    }
                }

                function AddPlayer(title, urlNormal, url, openAtStart) {
                    let iframeLink = document.createElement("iframe");
                    let main = document.createElement("p");
                    main.classList.add("h-t-v-a");
                    let link = document.createElement("a");
                    link.target = "_blank"
                    link.href = urlNormal;
                    link.innerText = " " + title;
                    let team = document.createElement("a");
                    team.target = "_blank"
                    team.href = urlNormal;
                    team.innerText = "[BetterADK]";
                    team.classList.add("team");
                    main.appendChild(team);
                    main.appendChild(link);
                    iframeLink.classList.add("lecteur-video");
                    iframeLink.classList.add("row");
                    iframeLink.classList.add("active");
                    iframeLink.classList.add("external-players-betteradk");
                    iframeLink.classList.add("content");
                    iframeLink.setAttribute("allowfullscreen", "true");
                    iframeLink.src = url;
                    iframeLink.style.width = "100%";
                    iframeLink.style.height = "500px";
                    iframeLink.style.border = "none";
                    iframeLink.style.display = "none";
                    iframeLink.addEventListener("load", function() {
                        setTimeout(function() {
                            iframeLink.style.display = "block"; // Ou une autre valeur d'affichage appropriée
                        }, 1000); // 1s
                    });

                    // if 4 players or less and licensed or no player
                    if (openAtStart && (document.getElementsByClassName("h-t-v-a").length < 5 && document.getElementsByClassName("licensier-text")[0] !== undefined) || document.getElementsByClassName("h-t-v-a").length < 1) {
                        iframeLink.style.maxHeight = "2500px";
                    } else {
                        iframeLink.style.maxHeight = "0px";
                        main.classList.add("activedPlayer");
                    }

                    let video = document.getElementById("video");
                    let playerparent = document.createElement("div");
                    playerparent.appendChild(main);
                    playerparent.appendChild(iframeLink);
                    video.appendChild(playerparent);
                }

                function AddIcon(urlNormal, image) {
                    let clickable = document.createElement("a");
                    clickable.href = urlNormal;
                    clickable.target = "_blank"
                    let el = document.createElement("img");
                    clickable.appendChild(el);
                    el.style = "width: 40px";
                    el.src = image
                    ici.appendChild(clickable);
                }

                // Add Mav Icon
                if (['both', 'icon'].includes(GM_config.get('mavanime'))) {
                    AddIcon(urlNormalMav, MAV_ICON)
                }

                // Add MAV players
                if (['both', 'player'].includes(GM_config.get('mavanime'))) {
                    AddPlayer("Mavanimes.co", urlNormalMav, urlMav, true)
                }

                // Add FRAnime Icon
                if (['both', 'icon'].includes(GM_config.get('franime'))) {
                    AddIcon(urlNormalFra, FRA_ICON)
                }

                // Add FRAnime players
                if (['both', 'player'].includes(GM_config.get('franime'))) {
                    AddPlayer("FRAnime.fr", urlNormalFra, urlFra, true)
                }

                // Add Voiranime Icon
                if (['both', 'icon'].includes(GM_config.get('voiranime'))) {
                    AddIcon(urlNormalVoa, VOA_ICON)
                }

                // Add Voiranime players
                if (['both', 'player'].includes(GM_config.get('voiranime'))) {
                    AddPlayer("Voiranime.com", urlNormalVoa, urlVoa, !['both', 'player'].includes(GM_config.get('mavanime')) && !['both', 'icon'].includes(GM_config.get('franime')))
                }

                if (GM_config.get('syncadklist')) {
                    waitForElm('#malEpisodes').then((elm) => {
                        var adklistInput = document.getElementById("watchlist-episode");
                        var adklistSeasonInput = document.getElementById("watchlist-saison");
                        if (adklistInput) {
                            adklistInput.disabled = true;
                        }
                        if (adklistSeasonInput) {
                            adklistSeasonInput.disabled = true;
                        }
                        waitForElm('#watchlist-actuel').then((elmButton) => {
                            var newElem = elmButton.cloneNode(true);
                            var newElemRemove = elmButton.cloneNode(true);
                            elmButton.parentNode.replaceChild(newElem, elmButton);
                            newElem.parentNode.insertBefore(newElemRemove, newElem)
                            newElem.innerText = "+1 Episode";
                            newElemRemove.innerText = "-1 Episode";
                            newElemRemove.style.backgroundColor = "rgba(255,0,0,.65)";
                            newElem.addEventListener('click', function() {
                                let maxEpisodes = parseInt(document.getElementById("malTotal").innerText);
                                let toSet = Math.min(maxEpisodes, parseInt(elm.value) + 1)
                                if (elm.value != toSet) {
                                    elm.value = toSet;
                                    if (elm.value == maxEpisodes) {
                                        document.getElementById("malStatus").value = 2;
                                    }
                                    elm.dispatchEvent(new Event('change'));
                                }
                            });
                            newElemRemove.addEventListener('click', function() {
                                let toSet = Math.max(parseInt(elm.value) - 1, 0);
                                if (elm.value != toSet) {
                                    elm.value = toSet;
                                    elm.dispatchEvent(new Event('change'));
                                }

                            });
                        });
                        elm.addEventListener('change', (event) => {
                            adklistInput.value = Math.min(document.getElementById("watchlist-episode").dataset.max, event.target.value)
                            document.getElementById("watchlist").click()
                        });
                        setInterval(() => {
                            var toSave = false;
                            var valueToSet = Math.min(document.getElementById("watchlist-episode").dataset.max, elm.value)
                            if (adklistSeasonInput && adklistSeasonInput.type != "hidden" && valueToSet != 0) {
                                var seasonToSet = Math.min(document.getElementById("watchlist-saison").dataset.max, currentSeason);
                                if (adklistSeasonInput.value > currentSeason) {
                                    return;
                                }
                                if (adklistSeasonInput.value != seasonToSet && seasonToSet != 0) {
                                    adklistSeasonInput.value = seasonToSet
                                    toSave = true;
                                }
                            }
                            if (seasonToSet > 1 && !allSeasonStartWithOne) {
                                let activedElement = document.getElementsByClassName("actived")[0];
                                let episodesSameSeason = document.getElementsByClassName("actived")[0].parentNode.getElementsByTagName("li");
                                valueToSet = episodesSameSeason[valueToSet - 1].dataset.epnumber;
                            }
                            if (adklistInput.value != valueToSet && document.activeElement != elm && valueToSet != 0) {
                                adklistInput.value = valueToSet
                                toSave = true;
                            }
                            if (toSave) {
                                document.getElementById("watchlist").click()
                            }
                        }, 100);
                    });

                    waitForElm('#malStatus').then((elm) => {
                        var adklistInput = document.getElementById("watchlist_look");
                        var adklistSeasonInput = document.getElementById("watchlist-saison");
                        adklistInput.disabled = true;
                        elm.addEventListener('change', (event) => {
                            adklistInput.value = (elm.value != 23) ? CORRELATION_ADK_MAL[elm.value] : 1;
                            document.getElementById("watchlist").click()
                        });

                        setInterval(() => {
                            var valueToSet = (elm.value != 23) ? CORRELATION_ADK_MAL[elm.value] : 1
                            if (!document.querySelector("#AddMal") && valueToSet && valueToSet != -1 && adklistInput.value != valueToSet) {
                                if (adklistSeasonInput.value > currentSeason) {
                                    return;
                                }
                                adklistInput.value = valueToSet;
                                document.getElementById("watchlist").click()
                            }
                        }, 100);
                    });

                    waitForElm('#malUserRating').then((elm) => {
                        var adklistInput = document.getElementById("watchlist-note");
                        var adklistSeasonInput = document.getElementById("watchlist-saison");
                        adklistInput.disabled = true;

                        elm.addEventListener('change', (event) => {
                            adklistInput.value = Math.round(event.target.value / 10)
                            document.getElementById("watchlist").click()
                        });

                        setInterval(() => {
                            var valueToSet = Math.round(elm.value / 10)
                            if (adklistInput.value != valueToSet && document.activeElement != elm && valueToSet != 0) {
                                if (adklistSeasonInput.value > currentSeason) {
                                    return;
                                }
                                adklistInput.value = valueToSet
                                document.getElementById("watchlist").click()
                            }
                        }, 100);
                    });

                    waitForElm('#malRating').then((elm) => {
                        setInterval(() => {
                            if (elm && elm.href && elm.href.includes("myanimelist")) {
                                var malicon = document.getElementById("malicon");
                                if (malicon && malicon.href != elm.href) {
                                    malicon.href = elm.href;
                                    clearInterval(this)
                                }
                            }
                        }, 100);
                    });
                }

                // collapsible comments
                function transformCommentsToCollapsible(visible) {
                    var commentDiv = document.getElementById("comments");
                    if (commentDiv) {
                        commentDiv = commentDiv.getElementsByTagName("div")[0]
                        var titleComment = commentDiv.getElementsByClassName("title")[0];
                        titleComment.innerText = titleComment.innerText.replace("Commentaire", "Commentaires");
                        titleComment.classList.add("collapsible");
                        titleComment.classList.add("collapsibleComments");
                        titleComment.id = "collapsibleCommentTitle";
                        titleComment.style.marginLeft = "0px";
                        var formComment = commentDiv.getElementsByTagName("form")[0]
                        var commentsComment = commentDiv.getElementsByClassName("comm");
                        var divComment = document.createElement("div");
                        divComment.classList.add("commentscontent");
                        divComment.id = "commentsDiv";
                        commentDiv.insertBefore(divComment, formComment)
                        divComment.parentNode.insertBefore(formComment, divComment);
                        for (var com of commentsComment) {
                            divComment.appendChild(com);
                        }
                        if ((visible == null && (GM_config.get('removecomments') == "always"
                                                 || (GM_config.get('removecomments') == "current" && document.getElementById("watchlist_look") && document.getElementById("watchlist_look").value == 1))) || visible == false)
                        {
                            divComment.style.visibility = "hidden"
                            divComment.style.maxHeight = "2500px"
                            titleComment.innerText = titleComment.innerText.replace('Commentaires', 'Commentaires (cachés)');
                            titleComment.classList.toggle("activedPlayer");
                        }

                        var btnComment = document.getElementById("comm-add");
                        if (btnComment) {
                            btnComment.addEventListener('click', function() {
                                let visibleOrNot = !document.getElementById("comments").getElementsByClassName("title")[0].classList.contains("activedPlayer");
                                setInterval(() => {
                                    var elm = document.getElementById("collapsibleCommentTitle")
                                    if (!elm) {
                                        transformCommentsToCollapsible(visibleOrNot);
                                        collapsePlayerAnimation()
                                        clearInterval(this)
                                    }
                                }, 100);
                            });
                        }

                        var observer = new MutationObserver(function(mutationsList, observer) {
                            for (let mutation of mutationsList) {
                                if (mutation.type === 'attributes' && mutation.attributeName === 'data-token') {
                                    mutation.target.parentNode.dataset.token = mutation.target.dataset.token;
                                }
                            }
                        });

                        observer.observe(document.getElementById('commentsDiv'), { attributes: true, attributeOldValue: true, attributeFilter: ['data-token'] });
                    }
                }

                transformCommentsToCollapsible(null);

                // collapsible players
                let elemsHeader = document.getElementsByClassName("h-t-v-a");
                for (let u = 0; u < elemsHeader.length; u++) {
                    elemsHeader[u].classList.add("collapsible");
                }
                let videoBlocks = document.getElementsByClassName("video-block");
                for (let u = 0; u < videoBlocks.length; u++) {
                    videoBlocks[u].classList.add("content");
                }
                let redirectionBlocks = document.getElementsByClassName("lecteur-redirection");
                for (let u = 0; u < redirectionBlocks.length; u++) {
                    redirectionBlocks[u].classList.add("content");
                }

                let iframes = document.getElementsByClassName("lecteur-video");
                for (let u = 0; u < iframes.length; u++) {
                    iframes[u].classList.add("content");
                }

                collapsePlayerAnimation();
            }
        }

        // Agenda page
        if (window.location.href.toLowerCase().includes("agenda")) {
            const agenda = document.getElementsByClassName("col-12 episode");
            let to_delete = [];
            for (let u = 0; u < agenda.length; u++) {
                if (agenda.item(u).textContent.toLocaleLowerCase().includes(' vf')) {
                    to_delete.push(agenda.item(u));
                } else if (GM_config.get('removevfagenda') && agenda.item(u).textContent.toLocaleLowerCase().includes(' multi')) {
                    let titleAgendaEp = agenda.item(u).getElementsByClassName("epis");
                    if (titleAgendaEp && titleAgendaEp.length > 0) {
                        titleAgendaEp[0].innerText = titleAgendaEp[0].innerText.replace(' multi', '')
                    }
                }
            }
            if (GM_config.get('removevfagenda')) {
                to_delete.forEach(elem => {
                    $(elem).remove();
                });
            }

            if (GM_config.get('alreadywatchedonagenda') != "disable") {
                $.get(`https://${window.location.hostname}/api/main?objet=anime-list`, null, function(text){
                    if (text && text["data"] && text["data"]["items"]) {
                        var currentAnimes = text["data"]["items"];
                        var currentWatchingAnimes = currentAnimes.filter(m => !["4", "2"].includes(m["genre"]))
                        var currentWatchingAnimesIds = currentWatchingAnimes.map(m => m["anime"]);

                        var checkbox = document.getElementById("agenda-filter-watch").getElementsByTagName("input")[0];
                        checkbox.parentNode.id = "agenda-filter-watch-new";
                        var newCheckbox = checkbox.cloneNode(true);
                        checkbox.parentNode.replaceChild(newCheckbox, checkbox);
                        checkbox = newCheckbox;

                        // already viewed
                        var pannelList = document.getElementById("pannel-list");
                        var legendeDiv = document.getElementsByClassName("legende")[0];
                        var alreadyViewed = checkbox.parentNode.cloneNode(true);
                        alreadyViewed.id = "agenda-filter-watch-one";
                        alreadyViewed.innerHTML = alreadyViewed.innerHTML.replace("En visionnage", "Déjà vu");
                        alreadyViewed.title = "Afficher les épisodes déjà visionnés";
                        alreadyViewed.style.backgroundColor = "#ff7c2b";
                        alreadyViewed.style.display = "inline-flex";
                        alreadyViewed.style.alignItems = "center";
                        legendeDiv.insertBefore(alreadyViewed, pannelList);
                        alreadyViewed = alreadyViewed.firstElementChild;

                        alreadyViewed.addEventListener('change', function() {
                            for (let u = 0; u < agenda.length; u++) {
                                agenda.item(u).style.display = "initial";
                            }
                            var event = new Event('change');
                            checkbox.dispatchEvent(event);
                        });

                        // episode one
                        var epOne = checkbox.parentNode.cloneNode(true);
                        epOne.id = "agenda-filter-watch-one";
                        epOne.innerHTML = epOne.innerHTML.replace("En visionnage", "Premier episode");
                        epOne.title = "Toujours afficher les premiers épisodes (même si filtre)";
                        checkbox.parentNode.parentNode.insertBefore(epOne, checkbox.parentNode);
                        epOne = epOne.firstElementChild;

                        epOne.addEventListener('change', function() {
                            for (let u = 0; u < agenda.length; u++) {
                                agenda.item(u).style.display = "initial";
                            }
                            var event = new Event('change');
                            checkbox.dispatchEvent(event);
                        });

                        epOne.checked = checkbox.checked = GM_config.get('alreadywatchedonagenda') == "yes";
                        alreadyViewed.checked = true;

                        addGlobalStyle('.agenda a .episode.vu .date_hour::before { content: "" !important; }');

                        checkbox.addEventListener('change', function() {
                            if (this.checked) {
                                epOne.parentNode.style.display = "flex";
                                for (let u = 0; u < agenda.length; u++) {
                                    var animeId = agenda.item(u).dataset.info.split(',')[0];
                                    if (!currentWatchingAnimesIds.includes(animeId)) {
                                        if (epOne.checked && agenda.item(u).dataset.info.split(',')[1] == 1 && agenda.item(u).dataset.info.split(',')[3] == 1) {
                                            continue;
                                        }
                                        agenda.item(u).style.display = "none";
                                    }
                                    else {
                                        if (agenda.item(u).classList.contains("vu") && !alreadyViewed.checked) {
                                            agenda.item(u).style.display = "none";
                                        }
                                        var animeElement = currentAnimes.find(anime => anime["anime"] == animeId)
                                        if (animeElement && animeElement["genre"] == 3 && agenda.item(u).dataset.info.split(',')[2] > animeElement["saison"]) {
                                            agenda.item(u).style.display = "none";
                                        }
                                    }
                                }
                            } else {
                                epOne.parentNode.style.display = "none";
                                for (let u = 0; u < agenda.length; u++) {
                                    if (agenda.item(u).classList.contains("vu") && !alreadyViewed.checked) {
                                        agenda.item(u).style.display = "none";
                                    }
                                    else {
                                        agenda.item(u).style.display = "initial";
                                    }
                                }
                            }
                        });

                        for (let u = 0; u < agenda.length; u++) {
                            agenda.item(u).style.display = "initial";
                        }
                        var event = new Event('change');
                        checkbox.dispatchEvent(event);
                    }
                });
            }
        }
    }

})();

// ==UserScript==
// @name         BetterADK
// @namespace    http://tampermonkey.net/
// @version      1.38
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
// @downloadURL  https://raw.githubusercontent.com/Zenrac/Zenrac.github.io/main/scripts/BetterADK.user.js
// @updateURL  https://raw.githubusercontent.com/Zenrac/Zenrac.github.io/main/scripts/BetterADK.user.js
// @homepageURL  https://github.com/zenrac/Zenrac.github.io
// @supportURL   https://github.com/zenrac/Zenrac.github.io/issues
// @icon         https://www.google.com/s2/favicons?domain=adkami.com
// @require      https://greasyfork.org/scripts/1884-gm-config/code/GM_config.js?version=4836
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// ==/UserScript==
(function() {
    'use strict';

    var connected = document.getElementById("headerprofil") != null
    var statusCorrelationADKToMal = [-1, 1, 3, 5, 4, 2, 2]

    // small part designed for mavanime only
    if (document.location.href.includes("mavanimes") && document.location.href.includes("?adk=true")) {
        var r = document.getElementsByTagName('script');

        for (var i = (r.length-1); i >= 0; i--) {

            if(r[i].getAttribute('id') != 'a'){
                r[i].parentNode.removeChild(r[i]);
            }

        }
        let maviframes = document.getElementsByTagName("iframe");
        let text = "";
        if (maviframes.length < 1 || (maviframes.length == 1 && maviframes[0].src.includes("dailymotion"))) {
            document.body.innerHTML = "<div style=\"display:flex;justify-content: center;height: 500px;\"><img src=\"https://i.imgur.com/Fg9J6uA.png\" /></div>";
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
    else {
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
             "lecteursmav" : {
                "label" : "Ajouter lecteurs MAV",
                "type" : "checkbox",
                "default" : true
            },
            "addmalmain" : {
                "label" : "Icones MAL (sur la page principale)",
                "type" : "checkbox",
                "default" : true
            },
            "addnyaamain" : {
                "label" : "Icones Nyaa (sur la page principale)",
                "type" : "checkbox",
                "default" : true
            },
            "addmalanime" : {
                "label" : "Icones MAL (sur les pages d'animé)",
                "type" : "checkbox",
                "default" : true
            },
            "addnyaaanime" : {
                "label" : "Icones Nyaa (sur les pages d'animé)",
                "type" : "checkbox",
                "default" : true
            },
            "addmavanime" : {
                "label" : "Icones MAV (sur les pages d'animé)",
                "type" : "checkbox",
                "default" : true
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
                     "never" : "Jamais",
                     "always" : "Toujours",
                     "current" : "Seulement si en train de regarder"
                 }
             }
        },
        'body { background-color: grey !important; } #saveBtn, #cancelBtn { background-color: white !important; color: black !important; }',
        {
          save: function() { location.reload() },
        });

        addGlobalStyle(`
            #GM_config {
              height: 50% !important;
              width: 50% !important;
              opacity: 0.90 !important;
              background-color: grey !important;

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
        function recalculateEpisodeNumbers(type) {
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
                                    if (episode.innerText.includes(type)) {
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

        function calculateEpisodeNumberFromActived(activedElement) {
            var ulListElement = activedElement.parentNode;
            var i = 1;
            if (!activedElement.previousSibling && activedElement.innerHTML.includes('000')) {
                return 0;
            }
            while ((activedElement = activedElement.previousSibling) != null ) {
                if (!activedElement.innerHTML.includes('000') && activedElement.innerHTML.includes('vostfr')) {
                   i++;
                }
            }
            return i;
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

                        } else {
                            content.style.visibility = "visible";
                            content.style.maxHeight = "initial"
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

        // --- CODE ---

        // All pages
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
        $(document.getElementsByClassName("toolbar")[0].getElementsByTagName("a")[0].getElementsByTagName("div")[0]).remove();
        let newLogo = document.createElement('img');
        newLogo.style = "width: 195px; margin-top: 15px; float: left; margin-left: 10px;";
        newLogo.src = "https://i.imgur.com/wOQ3Mop.png";
        let beel = document.getElementById("beelzebub");
        beel.style = "background-size: contain; background-repeat: no-repeat;";

        addGlobalStyle('@media screen and (min-width: 800px) { #beelzebub { background-image: url(https://i.imgur.com/7UWLr6t.png) !important; }}');
        addGlobalStyle('@media screen and (min-width: 800px) { #beelzebub:after { content: "EZ EZ EZ EZ" !important; bottom: 7px; }}');

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
                        $.get('https://www.adkami.com/profil/', null, function(text){
                            var username = $(text).find('#username')[0].value;
                            newProfileElement.firstChild.href = `https://www.adkami.com/profil/${username}`;
                            newProfileElement.firstChild.innerText = "Mon profile";
                            profileContent.insertBefore(newProfileElement, profileFirstChild)
                        });
                    }
                }
            }
        }

        // on main page
        if (elems.length > 0) {
            // add mal icons
            if (GM_config.get('addmalmain')) {
                let req = new Request("https://www.adkami.com/api/main?objet=adk-mal-all")
                fetch(req)
                    .then(response => response.json())
                    .then(data => {
                    if (data.data === undefined) return;
                    for (let i = 0; i < elems.length; i++) {
                        let after = elems[i].getElementsByClassName(connected ? "right list-edition" : "look")[0];
                        let id = after.dataset["info"].split(",")[0];
                        let url = data.data.find(el => el["anime_id"] == id);
                        if (url !== undefined) {
                            let clickable = document.createElement("a");
                            clickable.target = "_blank"
                            clickable.href = "https://myanimelist.net/anime/" + url["mal_id"];
                            clickable.classList.add("lecteur-icon");
                            clickable.classList.add("crunchyroll");
                            let el = document.createElement("img");
                            clickable.appendChild(el);
                            el.style = "width: 40px";
                            el.src = "https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAiC8a86sHufn_jOI-JGtoCQ"
                            elems[i].insertBefore(clickable, after.nextSibling);
                        }
                    }
                })
                    .catch(console.error);
            }

            if (GM_config.get('addnyaamain')) {
                // add nyaa icons
                for (let i = 0; i < elems.length; i++) {
                    let after = elems[i].getElementsByClassName(connected ? "right list-edition" : "look")[0];
                    let title = elems[i].getElementsByClassName("title")[0];
                    let episode = elems[i].getElementsByClassName("episode")[0];
                    let clickableNyaa = document.createElement("a");
                    let ep = episode.innerText.toLowerCase().match(/episode (\d+)/);
                    let saison = episode.innerText.toLowerCase().match(/saison (\d+)/);
                    title = title.textContent.replace(',', '').replace('.', '').split(':')[0].split('-')[0].trim()
                    if (ep) {
                        let epStr = parseInt(ep[1]).toString().padStart(2, '0');
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
                    elNyaa.src = "https://i.imgur.com/c8dv9WI.png"
                    clickableNyaa.addEventListener('click', (event) => {
                        if (ep && saison) {
                            event.preventDefault();
                            var url = elems[i].getElementsByClassName("img")[0].href;
                            $.get(url, null, function(text) {
                                var actived = $(text).find('.actived')[0];
                                if (actived) {
                                    var newEp = calculateEpisodeNumberFromActived(actived);
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
                }
            }
        }

        // Any anime page
        if (window.location.href.toLowerCase().includes("/anime/")) {
            let res = window.location.href.match(/anime\/(\d+)/);

            if (res) {
                document.title = document.title.replace(' vostfr', '');
                let nbBeforeRecalculate = document.getElementsByClassName("title-header-video")[0].innerText.split('-').length - 1;
                let epBeforeRecalculate = document.getElementsByClassName("title-header-video")[0].innerText.split('-')[nbBeforeRecalculate].toLowerCase().match(/episode (\d+)/);
                if (epBeforeRecalculate) {
                    var epBeforeStr = parseInt(epBeforeRecalculate[1]).toString().padStart(2, '0');
                }

                // recalculate episode number
                if (GM_config.get('calculateRealEpisodeNumber')) {
                    recalculateEpisodeNumbers("vostfr");
                    recalculateEpisodeNumbers("vf");
                }

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

                // Add MAL Icon
                if (GM_config.get('addmalanime')) {
                    let req = new Request("https://www.adkami.com/api/main?objet=adk-mal-all");
                    fetch(req)
                        .then(response => response.json())
                        .then(data => {
                        if (data.data === undefined) return;
                        let url = data.data.find(el => el["anime_id"] == adk_id);
                        let ici = document.getElementsByClassName("anime-information-icon")[0];
                        if (url !== undefined) {
                            let clickable = document.createElement("a");
                            clickable.id = "malicon";
                            clickable.target = "_blank";
                            clickable.href = "https://myanimelist.net/anime/" + url["mal_id"];
                            let el = document.createElement("img");
                            clickable.appendChild(el);
                            el.style = "width: 40px";
                            el.src = "https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAiC8a86sHufn_jOI-JGtoCQ"
                            ici.appendChild(clickable);
                        }
                    })
                        .catch(console.error);
                }

                // Mavanime.co
                let nb = document.getElementsByClassName("title-header-video")[0].innerText.split('-').length - 1;
                let title = document.getElementsByClassName("title-header-video")[0].innerText.replace(',', '').replace('.', '').split(':')[0].split('-').slice(0, nb).join('-').trim().toLowerCase().split(' ').join('-');
                let originalTitle = document.getElementsByClassName("title-header-video")[0].innerText.replace(',', '').replace('.', '').split(':')[0].split('-').slice(0, nb).join(' ').trim();


                let ep = document.getElementsByClassName("title-header-video")[0].innerText.split('-')[nb].toLowerCase().match(/episode (\d+)/);
                let oav = document.getElementsByClassName("title-header-video")[0].innerText.split('-')[nb].toLowerCase().match(/oav (\d+)/);
                let saison = document.getElementsByClassName("title-header-video")[0].innerText.split('-')[nb].match(/saison (\d+)/);
                let film = document.getElementsByClassName("title-header-video")[0].innerText.split('-')[nb].match(/film (\d+)/);

                title = title.replace(/[^a-zA-Z0-9!?:-_]/g, "-");

                if (saison) {
                    title += "-" + saison[1];
                }
                if (ep) {
                    title += "-" + (parseInt(ep[1]) > 9 ? parseInt(ep[1]) : "0" + parseInt(ep[1]));
                }
                if (oav) {
                    title += "-oav-" + parseInt(oav[1]);
                }
                if (film) {
                    title += "-film-" + parseInt(film[1]);
                }
                title += "-vostfr";
                let urlNormal = "https://www.mavanimes.co/" + title;
                let url = urlNormal + "/?adk=true";
                let ici = document.getElementsByClassName("anime-information-icon")[0];

                var currentSeason = 1
                if (saison) {
                    currentSeason = saison[1];
                }

                // Add Nyaa.si Icon
                if (GM_config.get('addnyaaanime')) {
                    let clickableNyaa = document.createElement("a");
                    if (ep) {
                        let epStr = parseInt(ep[1]).toString().padStart(2, '0');
                        let saisonStr = saison ? parseInt(saison[1]).toString().padStart(2, '0') : "01";
                        clickableNyaa.href = "https://nyaa.si/?q=" + originalTitle + ` (${epStr}|S${saisonStr}E${epStr}|${epBeforeStr}|S${saisonStr}E${epBeforeStr}) ${GM_config.get('customnyaasearch')}`;
                    }
                    else {
                        clickableNyaa.href = "https://nyaa.si/?q=" + originalTitle + " " + GM_config.get('customnyaasearch');
                    }
                    clickableNyaa.target = "_blank"
                    let elNyaa = document.createElement("img");
                    clickableNyaa.appendChild(elNyaa);
                    elNyaa.style = "width: 40px";
                    elNyaa.src = "https://i.imgur.com/c8dv9WI.png"
                    ici.appendChild(clickableNyaa);
                }

                // Add Mav Icon
                if (GM_config.get('addmavanime')) {
                    let clickable = document.createElement("a");
                    clickable.href = urlNormal;
                    clickable.target = "_blank"
                    let el = document.createElement("img");
                    clickable.appendChild(el);
                    el.style = "width: 40px";
                    el.src = "https://i.imgur.com/xSHwElF.png"
                    ici.appendChild(clickable);
                }

                // Add MAV players
                if (GM_config.get('lecteursmav')) {
                    let iframeLink = document.createElement("iframe");
                    let main = document.createElement("p");
                    main.classList.add("h-t-v-a");
                    let link = document.createElement("a");
                    link.target = "_blank"
                    link.href = urlNormal;
                    link.innerText = " Mavanimes.co";
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
                    iframeLink.classList.add("content");
                    iframeLink.setAttribute("allowfullscreen", "true");
                    iframeLink.src = url;
                    iframeLink.style = "width: 100%; height: 500px; border: none;";

                    // if 4 players or less and licensed or no player
                    if ((document.getElementsByClassName("h-t-v-a").length < 5 && document.getElementsByClassName("licensier-text")[0] !== undefined) || document.getElementsByClassName("h-t-v-a").length < 1) {
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
                            adklistInput.value = (elm.value != 23) ? statusCorrelationADKToMal[elm.value] : 1;
                            document.getElementById("watchlist").click()
                        });

                        setInterval(() => {
                            var valueToSet = (elm.value != 23) ? statusCorrelationADKToMal[elm.value] : 1
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
                                if (malicon.href != elm.href) {
                                    malicon.href = elm.href;
                                    clearInterval(this)
                                }
                            }
                        }, 100);
                    });
                }

                // collapsible comments
                var commentDiv = document.getElementById("comments");
                if (commentDiv) {
                    commentDiv = commentDiv.getElementsByTagName("div")[0]
                    var titleComment = commentDiv.getElementsByClassName("title")[0];
                    titleComment.innerText = titleComment.innerText.replace("Commentaire", "Commentaires");
                    titleComment.classList.add("collapsible");
                    titleComment.classList.add("collapsibleComments");
                    titleComment.style.marginLeft = "0px";
                    var formComment = commentDiv.getElementsByTagName("form")[0]
                    var commentsComment = commentDiv.getElementsByClassName("comm");
                    var divComment = document.createElement("div");
                    divComment.classList.add("commentscontent");
                    commentDiv.insertBefore(divComment, formComment)
                    divComment.appendChild(formComment);
                    for (var com of commentsComment) {
                        divComment.appendChild(com);
                    }
                    if (GM_config.get('removecomments') == "always"
                        || (GM_config.get('removecomments') == "current" && document.getElementById("watchlist_look") && document.getElementById("watchlist_look").value == 1))
                    {
                        divComment.style.visibility = "hidden"
                        divComment.style.maxHeight = "2500px"
                        titleComment.classList.toggle("activedPlayer");
                    }
                }

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
                $.get('https://www.adkami.com/api/main?objet=anime-list', null, function(text){
                    if (text && text["data"] && text["data"]["items"]) {
                        var currentAnimes = text["data"]["items"]
                        var currentWatchingAnimes = currentAnimes.filter(m => !["4", "2"].includes(m["genre"]))
                        var currentWatchingAnimesIds = currentWatchingAnimes.map(m => m["anime"]);

                        var checkbox = document.getElementById("agenda-filter-watch").getElementsByTagName("input")[0];
                        checkbox.parentNode.id = "agenda-filter-watch-new";
                        var newCheckbox = checkbox.cloneNode(true);
                        checkbox.parentNode.replaceChild(newCheckbox, checkbox);
                        checkbox = newCheckbox;

                        var epOne = checkbox.parentNode.cloneNode(true);
                        epOne.id = "agenda-filter-watch-one";
                        epOne.innerHTML = epOne.innerHTML.replace("En visionnage", "Premier episode")
                        epOne.title = "Toujours afficher les premiers épisodes (même si filtre)"
                        checkbox.parentNode.parentNode.insertBefore(epOne, checkbox.parentNode.nextSibling);
                        epOne = epOne.firstElementChild;

                        checkbox.checked = GM_config.get('alreadywatchedonagenda') == "yes";
                        epOne.checked = GM_config.get('alreadywatchedonagenda') == "yes";

                        epOne.addEventListener('change', function() {
                            for (let u = 0; u < agenda.length; u++) {
                                agenda.item(u).style.display = "initial";
                            }
                            var event = new Event('change');
                            checkbox.dispatchEvent(event);
                        });

                        var pannelList = document.getElementById("pannel-list");
                        var legendeDiv = document.getElementsByClassName("legende")[0];
                        var newElementLegende = legendeDiv.firstElementChild.cloneNode(true);
                        newElementLegende.id = "already-seen-legend";
                        newElementLegende.innerText = "Déjà vu";
                        newElementLegende.style.backgroundColor = "#ff7c2b";
                        legendeDiv.insertBefore(newElementLegende, pannelList);

                        addGlobalStyle('.agenda a .episode.vu .date_hour::before { content: "" !important; }');

                        checkbox.addEventListener('change', function() {
                            if (this.checked) {
                                for (let u = 0; u < agenda.length; u++) {
                                    var animeId = agenda.item(u).dataset.info.split(',')[0];
                                    if (!currentWatchingAnimesIds.includes(animeId)) {
                                        if (epOne.checked && agenda.item(u).dataset.info.split(',')[1] == 1 && agenda.item(u).dataset.info.split(',')[3] == 1) {
                                            continue;
                                        }
                                        agenda.item(u).style.display = "none";
                                    }
                                    else {
                                        var animeElement = currentAnimes.find(anime => anime["anime"] == animeId)
                                        if (animeElement && animeElement["genre"] == 3 && agenda.item(u).dataset.info.split(',')[2] > animeElement["saison"]) {
                                            agenda.item(u).style.display = "none";
                                        }
                                    }
                                }
                            } else {
                                for (let u = 0; u < agenda.length; u++) {
                                    agenda.item(u).style.display = "initial";
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

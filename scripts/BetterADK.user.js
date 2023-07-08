// ==UserScript==
// @name         BetterADK
// @namespace    http://tampermonkey.net/
// @version      1.31
// @description  Removes VF from ADKami, also add MAL buttons, Mavanimes links, new fancy icons and cool stuff!
// @author       Zenrac
// @match        https://www.adkami.com/*
// @match        https://www.adkami.com/*
// @match        https://m.adkami.com/*
// @match        http://www.adkami.com/*
// @match        http://m.adkami.com/*
// @match        https://adkami.com/*
// @match        http://adkami.com/*
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
                "default" : "(vostfr|multi)"
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
            console.log("recalculate ep")
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
                                    console.log(episode)
                                    if (episode.innerText.includes(type)) {
                                        console.log(episode.innerText)
                                        console.log(type)
                                        let episodeNameMatch = episode.innerText.toLowerCase().match(/episode (\d+)/);
                                        let episodeNumber = episodeNameMatch ? parseInt(episodeNameMatch[1]) : "01";
                                        let oldEp = episodeNumber.toString().padStart(2, '0');
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

        /**
    * Enables to have a sweet animation on all players thanks to collapsibles.
    */
        function collapsePlayerAnimation() {
            var coll = document.getElementsByClassName("collapsible");
            var i;

            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function() {
                    this.classList.toggle("activedPlayer");
                    var content = this.nextElementSibling;
                    if (content.style.maxHeight != "0px"){
                        content.style.maxHeight = "0px";
                    } else {
                        content.style.maxHeight = "1000px";
                    }
                });
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
			.content {
			  max-height: 1000px;
			  overflow: hidden;
			  transition: max-height 0.2s ease-out;
			}`);
        }

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
                        let after = elems[i].getElementsByClassName("right list-edition")[0];
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
                    let after = elems[i].getElementsByClassName("right list-edition")[0];
                    let title = elems[i].getElementsByClassName("title")[0];
                    let episode = elems[i].getElementsByClassName("episode")[0];
                    let clickableNyaa = document.createElement("a");
                    let ep = episode.innerText.toLowerCase().match(/episode (\d+)/);
                    let saison = episode.innerText.toLowerCase().match(/saison (\d+)/);
                    if (ep) {
                        let epStr = parseInt(ep[1]).toString().padStart(2, '0');
                        let saisonStr = saison ? parseInt(saison[1]).toString().padStart(2, '0') : "01";
                        clickableNyaa.href = "https://nyaa.si/?q=" + title.textContent + ` (${epStr}|S${saisonStr}E${epStr}) ${GM_config.get('customnyaasearch')}`;
                    }
                    else {
                        clickableNyaa.href = "https://nyaa.si/?q=" + title.textContent + " " + GM_config.get('customnyaasearch');
                    }
                    clickableNyaa.target = "_blank"
                    let elNyaa = document.createElement("img");
                    clickableNyaa.appendChild(elNyaa);
                    clickableNyaa.classList.add("lecteur-icon");
                    clickableNyaa.classList.add("crunchyroll");
                    elNyaa.style = "width: 40px";
                    elNyaa.src = "https://i.imgur.com/c8dv9WI.png"
                    elems[i].insertBefore(clickableNyaa, after.nextSibling);
                }
            }
        }

        // Any anime page
        if (window.location.href.toLowerCase().includes("/anime/")) {
            let res = window.location.href.match(/anime\/(\d+)/);
            if (res) {
                document.title = document.title.replace(' vostfr', '');

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
                            clickable.target = "_blank"
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

                // Add Nyaa.si Icon
                if (GM_config.get('addnyaaanime')) {
                    let clickableNyaa = document.createElement("a");
                    if (ep) {
                        let epStr = parseInt(ep[1]).toString().padStart(2, '0');
                        let saisonStr = saison ? parseInt(saison[1]).toString().padStart(2, '0') : "01";
                        clickableNyaa.href = "https://nyaa.si/?q=" + originalTitle + ` (${epStr}|S${saisonStr}E${epStr}) ${GM_config.get('customnyaasearch')}`;
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
                        iframeLink.style.maxHeight = "1000px";
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
            }
        }

        // Remove VF from Agenda
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
        }
        else {
            // collapsible players
            let elemsHeader = document.getElementsByClassName("h-t-v-a");
            for (let u = 0; u < elemsHeader.length; u++) {
                elemsHeader[u].classList.add("collapsible");
            }
            let videoBlocks = document.getElementsByClassName("video-block");
            for (let u = 0; u < videoBlocks.length; u++) {
                videoBlocks[u].classList.add("content");
            }

            let iframes = document.getElementsByClassName("lecteur-video");
            for (let u = 0; u < iframes.length; u++) {
                iframes[u].classList.add("content");
            }

            collapsePlayerAnimation();
        }
    }

})();

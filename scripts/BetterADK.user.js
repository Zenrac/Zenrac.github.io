// ==UserScript==
// @name         BetterADK
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Removes VF from ADKami, also add MAL buttons, Mavanimes links, new fancy icons and cool stuff!
// @author       Zenrac
// @match        https://www.adkami.com/*
// @match        https://www.adkami.com/*
// @match        https://m.adkami.com/*
// @match        http://www.adkami.com/*
// @match        http://m.adkami.com/*
// @downloadURL  https://raw.githubusercontent.com/Zenrac/Zenrac.github.io/main/scripts/BetterADK.user.js
// @homepageURL  https://github.com/zenrac/Zenrac.github.io
// @supportURL   https://github.com/zenrac/Zenrac.github.io/issues
// @icon         https://www.google.com/s2/favicons?domain=adkami.com
// @grant        none
// @license      MIT
// ==/UserScript==
(function() {
    'use strict';

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
    const elems = document.getElementsByClassName("video-item-list")
    let to_remove = [];
    for (let i = 0; i < elems.length; i++) {
        if (elems.item(i).textContent.toLocaleLowerCase().includes(' vf ')) {
            to_remove.push(elems.item(i));
        }
    }
    to_remove.forEach(elem => {
        $(elem).remove();
    });

    $(document.getElementsByClassName("toolbar")[0].getElementsByTagName("a")[0].getElementsByTagName("div")[0]).remove();
    let newLogo = document.createElement('img');
    newLogo.style = "width: 195px; margin-top: 15px; float: left; margin-left: 10px;";
    newLogo.src = "https://i.imgur.com/wOQ3Mop.png";
    let beel = document.getElementById("beelzebub");
    beel.style = "background-size: contain; background-repeat: no-repeat;";

    addGlobalStyle('@media screen and (min-width: 800px) { #beelzebub { background-image: url(https://i.imgur.com/7UWLr6t.png) !important; }}');
    addGlobalStyle('@media screen and (min-width: 800px) { #beelzebub:after { content: "EZ EZ EZ EZ" !important; bottom: 7px; }}');

    let paypal = document.createElement("a");
    paypal.href = "https://www.paypal.com/paypalme/ZenracZenrac"
    beel.parentNode.insertBefore(paypal, beel.nextSibling);
    paypal.appendChild(beel);

    document.title = document.title.replace('ADKami', 'BetterADK');

    document.getElementsByClassName("toolbar")[0].getElementsByTagName("a")[0].appendChild(newLogo);
    if (elems.length > 0) {
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
                        clickable.href = "https://myanimelist.net/anime/" + url["mal_id"];
                        clickable.classList.add("lecteur-icon");
                        clickable.classList.add("crunchyroll");
                        let el = document.createElement("img");
                        clickable.appendChild(el);
                        el.style = "width: 40px";
                        el.src = "https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAiC8a86sHufn_jOI-JGtoCQ"
                        elems[i].insertBefore(clickable, after.nextSibling.nextSibling.nextSibling);
                    }
                }
            })
            .catch(console.error);
    }

    if (window.location.href.toLowerCase().includes("/anime/")) {
        let res = window.location.href.match(/anime\/(\d+)/);
        // Any anime page
        if (res) {
            document.title = document.title.replace(' vostfr', '');
            try {
                document.getElementById("find_episode").placeholder = document.getElementById("find_episode").placeholder.replace(' (77 vf)', '');
            } catch {}
            document.getElementsByClassName("title-header-video")[0].innerText = document.getElementsByClassName("title-header-video")[0].innerText.replace(' vostfr', '')
            try {
                document.getElementById("after-video").getElementsByTagName("span")[0].innerText = document.getElementById("after-video").getElementsByTagName("span")[0].innerText.replace(' vostfr', '');
                document.getElementById("before-video").getElementsByTagName("span")[0].innerText = document.getElementById("before-video").getElementsByTagName("span")[0].innerText.replace(' vostfr', '');
                document.getElementsByClassName("normal")[0].getElementsByTagName("li")[2].getElementsByTagName("a")[0].getElementsByTagName("span")[0].innerText = document.getElementsByClassName("normal")[0].getElementsByTagName("li")[2].getElementsByTagName("a")[0].getElementsByTagName("span")[0].innerText.replace(' vostfr', '');
            } catch {}
            let lis = document.getElementsByClassName("os-content")[0].getElementsByTagName("ul")[0].getElementsByTagName("li");

            // Remove useless fake EPs (OP, PV, ED, "vostfr in name")

            let to_remove_again = [];
            for (let i = 0; i < lis.length; i++) {
                let toEdit = lis.item(i).getElementsByTagName("a")[0];
                if (toEdit !== undefined) {
                    toEdit.innerText = toEdit.innerText.replace(' vostfr', '');
                }
                if (lis.item(i).textContent.toLocaleLowerCase().includes(' vf') ||
                    lis.item(i).textContent.includes('PV ') ||
                    lis.item(i).textContent.includes('Ending ') ||
                    lis.item(i).textContent.includes('Opening ')) {
                    to_remove_again.push(lis.item(i));
                }
            }
            to_remove_again.forEach(elem => {
                $(elem).remove();
            });
            let adk_id = res[1];

            // Add MAL Icon

            let req = new Request("https://www.adkami.com/api/main?objet=adk-mal-all");
            fetch(req)
                .then(response => response.json())
                .then(data => {
                    if (data.data === undefined) return;
                    let url = data.data.find(el => el["anime_id"] == adk_id);
                    let ici = document.getElementsByClassName("anime-information-icon")[0];
                    if (url !== undefined) {
                        let clickable = document.createElement("a");
                        clickable.href = "https://myanimelist.net/anime/" + url["mal_id"];
                        let el = document.createElement("img");
                        clickable.appendChild(el);
                        el.style = "width: 40px";
                        el.src = "https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAiC8a86sHufn_jOI-JGtoCQ"
                        ici.appendChild(clickable);
                    }
                })
                .catch(console.error);

            // Mavanime.co
            let nb = document.getElementsByClassName("title-header-video")[0].innerText.split('-').length - 1;
            let title = document.getElementsByClassName("title-header-video")[0].innerText.replace(',', '').replace('.', '').split(':')[0].split('-').slice(0, nb).join('-').trim().toLowerCase().split(' ').join('-');


            let ep = document.getElementsByClassName("title-header-video")[0].innerText.split('-')[nb].toLowerCase().match(/episode (\d+)/)
            let saison = document.getElementsByClassName("title-header-video")[0].innerText.split('-')[nb].match(/saison (\d+)/)

            if (saison) {
                title += "-saison-" + saison[1];
            }
            title += "-" + (parseInt(ep[1]) > 9 ? parseInt(ep[1]) : "0" + parseInt(ep[1])) + "-vostfr";
            let url = "https://www.mavanimes.co/" + title;
            let ici = document.getElementsByClassName("anime-information-icon")[0];

            // Add Mav Icon
            let clickable = document.createElement("a");
            clickable.href = url;
            let el = document.createElement("img");
            clickable.appendChild(el);
            el.style = "width: 40px";
            el.src = "https://i.imgur.com/xSHwElF.png"
            ici.appendChild(clickable);

            if (document.getElementsByClassName("h-t-v-a").length < 2 && document.getElementsByClassName("licensier-text")[0] !== undefined) {
                $(".lecteur-video")[0]?.remove();
                let iframeLink = document.createElement("iframe");
                let main = document.createElement("p");
                main.classList.add("h-t-v-a");
                let link = document.createElement("a");
                link.href = url;
                link.innerText = " Mavanimes.co";
                let team = document.createElement("a");
                team.href = url;
                team.innerText = "[BetterADK]";
                team.classList.add("team");
                main.appendChild(team);
                main.appendChild(link);
                iframeLink.classList.add("lecteur-video");
                iframeLink.classList.add("row");
                iframeLink.classList.add("active");
                iframeLink.src = url;
                iframeLink.style = "width: 100%; height: 1000px;";
                let video = document.getElementById("video");
                video.appendChild(main);
                video.appendChild(iframeLink);
            }
        }
    }

    if (window.location.href.toLowerCase().includes("agenda")) {
        const agenda = document.getElementsByClassName("col-12 episode");
        let to_delete = [];
        for (let u = 0; u < agenda.length; u++) {
            if (agenda.item(u).textContent.toLocaleLowerCase().includes(' vf')) {
                to_delete.push(agenda.item(u));
            }
        }
        to_delete.forEach(elem => {
            $(elem).remove();
        });
    }
})();

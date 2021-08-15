// ==UserScript==
// @name         BetterADK (Remove VF & Mal Buttons)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       Zenrac
// @match        https://www.adkami.com/*
// @match        https://www.adkami.com/*
// @match        https://m.adkami.com/*
// @match        http://www.adkami.com/*
// @match        http://m.adkami.com/*
// @downloadURL  https://raw.githubusercontent.com/Zenrac/Zenrac.github.io/main/js/adkVfRemover.user.js
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
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    const elems = document.getElementsByClassName("video-item-list")
    var to_remove = [];
    for (var i = 0; i < elems.length; i++) {
        if (elems.item(i).textContent.toLocaleLowerCase().includes(' vf ')) {
            to_remove.push(elems.item(i));
        }
    }
    to_remove.forEach(elem => {
        $(elem).remove();
    });

    $(document.getElementsByClassName("toolbar")[0].getElementsByTagName("a")[0].getElementsByTagName("div")[0]).remove();
    var newLogo = document.createElement('img');
    newLogo.style = "height: 40px; width: 195px; margin-top: 10px; float: left; margin-left: 10px;";
    newLogo.src = "https://i.imgur.com/wOQ3Mop.png";
    var beel = document.getElementById("beelzebub");
    beel.style = "background-size: contain; background-repeat: no-repeat;";

    addGlobalStyle('@media screen and (min-width: 800px) { #beelzebub { background-image: url(https://i.imgur.com/7UWLr6t.png) !important; }}');
    addGlobalStyle('@media screen and (min-width: 800px) { #beelzebub:after { content: "EZ EZ EZ EZ" !important; bottom: 7px; }}');
    document.title = document.title.replace('ADKami', 'BetterADK');

    document.getElementsByClassName("toolbar")[0].getElementsByTagName("a")[0].appendChild(newLogo);
    if (elems.length > 0) {
        let req = new Request("https://www.adkami.com/api/main?objet=adk-mal-all")
        fetch(req)
            .then(response => response.json())
            .then(data => {
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
        var res = window.location.href.match(/anime\/(\d+)/);
        if (res) {
            document.title = document.title.replace(' vostfr', '');
            try {
            document.getElementById("find_episode").placeholder = document.getElementById("find_episode").placeholder.replace(' (77 vf)', '');
            } catch {
            }
            document.getElementsByClassName("title-header-video")[0].innerText = document.getElementsByClassName("title-header-video")[0].innerText.replace(' vostfr', '')
            try {
            document.getElementById("after-video").getElementsByTagName("span")[0].innerText = document.getElementById("after-video").getElementsByTagName("span")[0].innerText.replace(' vostfr', '');
            document.getElementById("before-video").getElementsByTagName("span")[0].innerText = document.getElementById("before-video").getElementsByTagName("span")[0].innerText.replace(' vostfr', '');
            document.getElementsByClassName("normal")[0].getElementsByTagName("li")[2].getElementsByTagName("a")[0].getElementsByTagName("span")[0].innerText
                = document.getElementsByClassName("normal")[0].getElementsByTagName("li")[2].getElementsByTagName("a")[0].getElementsByTagName("span")[0].innerText.replace(' vostfr', '');
            } catch {
            }
            var lis = document.getElementsByClassName("os-content")[0].getElementsByTagName("ul")[0].getElementsByTagName("li");
            var to_remove_again = [];
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
            var adk_id = res[1];
            let req = new Request("https://www.adkami.com/api/main?objet=adk-mal-all");
            fetch(req)
                .then(response => response.json())
                .then(data => {
                    let url = data.data.find(el => el["anime_id"] == adk_id);
                    var ici = document.getElementsByClassName("anime-information-icon")[0];
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
        }
    }

    if (window.location.href.toLowerCase().includes("agenda")) {
        const agenda = document.getElementsByClassName("col-12 episode");
        var to_delete = [];
        for (var u = 0; u < agenda.length; u++) {
            if (agenda.item(u).textContent.toLocaleLowerCase().includes(' vf')) {
                to_delete.push(agenda.item(u));
            }
        }
        to_delete.forEach(elem => {
            $(elem).remove();
        });
    }
})();

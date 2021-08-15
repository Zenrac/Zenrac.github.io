// ==UserScript==
// @name         BetterADK (Remove VF & Mal Buttons)
// @namespace    http://tampermonkey.net/
// @version      0.2
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
        if (res) { // episode page
            var lis = document.getElementsByClassName("os-content")[0].getElementsByTagName("ul")[0].getElementsByTagName("li");
            var to_remove_again = [];
            for (let i = 0; i < lis.length; i++) {
                lis.item(i).textContent.replace(' vostfr', '');
                if (lis.item(i).textContent.toLocaleLowerCase().includes(' vf') ||
                    lis.item(i).textContent.toLocaleLowerCase().includes('pv ') ||
                    lis.item(i).textContent.toLocaleLowerCase().includes('ending ') ||
                    lis.item(i).textContent.toLocaleLowerCase().includes('opening ')) {
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

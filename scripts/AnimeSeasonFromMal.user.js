// ==UserScript==
// @name         Copy Season Anime from MAL
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extracts anime data from MyAnimeList and copies it to clipboard in JSON format.
// @author       Zenrac
// @license      MIT
// @match        https://myanimelist.net/anime/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myanimelist.net
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    function showToast(message, duration = 2500) {
        const toast = document.createElement("div");
        toast.textContent = message;
        toast.style.position = "fixed";
        toast.style.top = "50px";
        toast.style.right = "10px";
        toast.style.backgroundColor = "rgba(0,0,0,0.8)";
        toast.style.color = "white";
        toast.style.padding = "10px 20px";
        toast.style.borderRadius = "4px";
        toast.style.fontSize = "14px";
        toast.style.zIndex = 100000;
        toast.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.3s ease";

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = "1";
        });

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.addEventListener("transitionend", () => {
                toast.remove();
            });
        }, duration);
    }

    window.getElementsFromMal = function(exceptions = []) {
        if (!Array.isArray(exceptions)) {
            exceptions = exceptions.split(',').map(e => e.trim());
        }
        var videos = document.getElementsByClassName("js-anime-type-1");
        var videoList = [];

        for (const video of videos) {
            const member = video.querySelectorAll("div.scormem-item.member");
            const memberCount = member[0].innerText.trim();
            let count = 0;
            const title = video.querySelectorAll(".link-title")[0].innerText;

            if (memberCount.includes('K')) {
                count = parseFloat(memberCount.replace("K", "")) * 1000;
            } else if (memberCount.includes('M')) {
                count = parseFloat(memberCount.replace("M", "")) * 1000000;
            } else {
                count = parseInt(memberCount);
            }

            const isException = exceptions.some(exception => title.toLowerCase().includes(exception.toLowerCase()));

            if (isException || count > 3000) {
                const date = video.getElementsByClassName('prodsrc')[0]
                                .getElementsByClassName('info')[0]
                                .getElementsByClassName('item')[0].innerHTML;
                const animeDate = new Date(date);
                const lastYearDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));

                if (isException || animeDate > lastYearDate) {
                    const imgDiv = video.querySelectorAll("img")[0];
                    const img = imgDiv.src;
                    const url = imgDiv.parentNode.href;

                    if (img && img.trim().length !== 0) {
                        videoList.push({
                            img: img,
                            title: title,
                            url: url,
                            count: count
                        });
                    }
                }
            }
        }

        videoList.sort((a, b) => b.count - a.count);

        const finalList = videoList.map(video => ({
            img: video.img,
            title: video.title,
            url: video.url
        }));

        const jsonOutput = JSON.stringify(finalList, null, 2);

        console.log(jsonOutput);
        showToast("MAL data copied to clipboard and logged in console!", 3000);
        GM_setClipboard(jsonOutput, "text");

        return finalList;
    };

    const btn = document.createElement("button");
    btn.textContent = "Extract MAL Data";
    btn.style.position = "fixed";
    btn.style.top = "10px";
    btn.style.right = "10px";
    btn.style.zIndex = 10000;
    btn.style.padding = "8px 12px";
    btn.style.backgroundColor = "#0078D7";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "4px";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "14px";
    btn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Exceptions, splited by commas";
    input.style.position = "fixed";
    input.style.top = "10px";
    input.style.right = "150px";
    input.style.zIndex = 10000;
    input.style.width = "250px";
    input.style.padding = "6px";
    input.style.fontSize = "14px";
    input.title = "Ex: One, Love";
    input.id = "mal-exceptions-input";

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            btn.click();
        }
    });

    document.body.appendChild(input);

    btn.addEventListener("click", () => {
        let exceptions = [];
        if (input.value.trim().length > 0) {
            exceptions = input.value.split(",").map(s => s.trim()).filter(s => s.length > 0);
        }
        getElementsFromMal(exceptions);
    });

    document.body.appendChild(btn);
})();
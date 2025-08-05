// ==UserScript==
// @name         Copy Season Anime from MAL
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Extract anime data from MyAnimeList and copies it to clipboard in JSON format, supports season and single anime pages.
// @author       Zenrac
// @license      MIT
// @match        https://myanimelist.net/anime/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myanimelist.net
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    function showToast(message, duration = 2500) {
        const toast = document.createElement("div");
        toast.textContent = message;
        Object.assign(toast.style, {
            position: "fixed",
            top: "50px",
            right: "10px",
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "4px",
            fontSize: "14px",
            zIndex: 100000,
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            opacity: "0",
            transition: "opacity 0.3s ease"
        });
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.style.opacity = "1");
        setTimeout(() => {
            toast.style.opacity = "0";
            toast.addEventListener("transitionend", () => toast.remove());
        }, duration);
    }

    function isSingleAnimePage() {
        return !!document.querySelector("h1.title-name");
    }

    function extractSingleAnime() {
        const titleElement = document.querySelector("h1.title-name strong");
        const imgElement = document.querySelector('a[href*="/pics"] img');
        if (!titleElement || !imgElement) {
            showToast("Anime title or image not found on this page!", 3000);
            return;
        }

        const title = titleElement.textContent.trim();
        const img = imgElement.src;
        const url = window.location.href;

        const data = [{
            img: img,
            title: title,
            url: url
        }];

        const jsonOutput = JSON.stringify(data, null, 2);
        console.log(jsonOutput);
        GM_setClipboard(jsonOutput, "text");
        showToast("Single anime data copied to clipboard!", 3000);
    }

    window.getElementsFromMal = function (exceptions = []) {
        if (!Array.isArray(exceptions)) {
            exceptions = exceptions.split(',').map(e => e.trim());
        }

        if (isSingleAnimePage()) {
            extractSingleAnime();
            return;
        }

        const videos = document.getElementsByClassName("js-anime-type-1");
        const videoList = [];

        for (const video of videos) {
            const member = video.querySelectorAll("div.scormem-item.member");
            const memberCount = member[0]?.innerText?.trim() ?? "0";
            const title = video.querySelector(".link-title")?.innerText ?? "";
            let count = 0;

            if (memberCount.includes('K')) {
                count = parseFloat(memberCount.replace("K", "")) * 1000;
            } else if (memberCount.includes('M')) {
                count = parseFloat(memberCount.replace("M", "")) * 1000000;
            } else {
                count = parseInt(memberCount) || 0;
            }

            const isException = exceptions.some(exception => title.toLowerCase().includes(exception.toLowerCase()));
            if (isException || count > 3000) {
                const dateDiv = video.querySelector('.prodsrc .info .item');
                const date = dateDiv?.innerHTML;
                const animeDate = date ? new Date(date) : null;
                const lastYearDate = new Date();
                lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);

                if (isException || (animeDate && animeDate > lastYearDate)) {
                    const img = video.querySelector("img")?.src ?? "";
                    const url = video.querySelector("a")?.href ?? "";

                    if (img && img.trim().length !== 0) {
                        videoList.push({ img, title, url, count });
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
        GM_setClipboard(jsonOutput, "text");
        showToast("MAL season data copied to clipboard and logged in console!", 3000);

        return finalList;
    };

    const btn = document.createElement("button");
    btn.textContent = "Extract MAL Data";
    Object.assign(btn.style, {
        position: "fixed",
        top: "10px",
        right: "10px",
        zIndex: 10000,
        padding: "8px 12px",
        backgroundColor: "#0078D7",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
    });

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Exceptions, splited by commas";
    input.title = "Ex: One, Love";
    input.id = "mal-exceptions-input";
    Object.assign(input.style, {
        position: "fixed",
        top: "10px",
        right: "150px",
        zIndex: 10000,
        width: "250px",
        padding: "6px",
        fontSize: "14px"
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            btn.click();
        }
    });

    btn.addEventListener("click", () => {
        let exceptions = [];
        if (input.value.trim().length > 0) {
            exceptions = input.value.split(",").map(s => s.trim()).filter(s => s.length > 0);
        }
        getElementsFromMal(exceptions);
    });

    document.body.appendChild(input);
    document.body.appendChild(btn);
})();

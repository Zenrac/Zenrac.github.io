// ==UserScript==
// @name         BetterMav
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Navigate to previous and next episode with smart detection and useful shortcuts
// @author       Zenrac
// @match        http://www.mavanimes.co/*
// @match        https://www.mavanimes.co/*
// @downloadURL  https://raw.githubusercontent.com/Zenrac/Zenrac.github.io/main/scripts/BetterMav.user.js
// @updateURL    https://raw.githubusercontent.com/Zenrac/Zenrac.github.io/main/scripts/BetterMav.user.js
// @homepageURL  https://github.com/Zenrac/Zenrac.github.io
// @supportURL   https://github.com/Zenrac/Zenrac.github.io/issues
// @icon         https://www.google.com/s2/favicons?domain=mavanimes.co
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    const isAnimePage = !!document.querySelector('article header.entry-header a[href*="-v"]');

    if (isAnimePage) {
        const firstEpisodeLink = [...document.querySelectorAll('article header.entry-header a[href*="-v"]')]
            .map(a => ({ a, ep: (a.href.match(/-(\d+)-v/) || [])[1] }))
            .filter(e => e.ep)
            .sort((a, b) => a.ep - b.ep)[0];

        if (firstEpisodeLink) {
            const btnFirst = document.createElement("button");
            btnFirst.className = "bettermav-btn";
            btnFirst.textContent = `Aller à l'épisode ${firstEpisodeLink.ep}`;
            btnFirst.onclick = () => window.location.href = firstEpisodeLink.a.href;

            const css = `
                .bettermav-btn {
                    margin: 10px 6px;
                    background: #820303;
                    color: #fff;
                    padding: 5px 14px;
                    font-size: 16px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background-color 0.3s ease, box-shadow 0.3s ease;
                    box-shadow: 0 0 5px transparent;
                }
                .bettermav-btn:hover {
                    background-color: #a40404;
                    box-shadow: 0 0 8px #a40404;
                }
                .bettermav-btn.uncertain {
                    background: #b35e04;
                    box-shadow: 0 0 6px #b35e04;
                }
                .bettermav-btn.uncertain:hover {
                    background-color: #d47206;
                    box-shadow: 0 0 8px #d47206;
                }
                #nav-message {
                    font-size: 14px;
                    color: #b35e04;
                    font-style: italic;
                    margin-top: 4px;
                    user-select: none;
                }
            `;
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);

            const title = document.querySelector(".entry-title") || document.querySelector("h1");
            if (title) {
                title.appendChild(document.createElement("br"));
                title.appendChild(btnFirst);
            }
        }
        return;
    }

    const btnNext = document.createElement("button");
    const btnPrevious = document.createElement("button");
    const navMsg = document.createElement("div");
    navMsg.id = "nav-message";

    btnNext.classList.add("bettermav-btn");
    btnPrevious.classList.add("bettermav-btn");

    const css = `
        .bettermav-btn {
            margin: 10px 6px;
            background: #820303;
            color: #fff;
            padding: 5px 14px;
            font-size: 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 0 5px transparent;
        }
        .bettermav-btn:hover {
            background-color: #a40404;
            box-shadow: 0 0 8px #a40404;
        }
        .bettermav-btn.uncertain {
            background: #b35e04;
            box-shadow: 0 0 6px #b35e04;
        }
        .bettermav-btn.uncertain:hover {
            background-color: #d47206;
            box-shadow: 0 0 8px #d47206;
        }
        #nav-message {
            font-size: 14px;
            color: #b35e04;
            font-style: italic;
            margin-top: 4px;
            user-select: none;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    function updateEpisode(delta) {
        const match = window.location.href.match(/(\d+)-v/);
        if (!match) return;
        const ep = parseInt(match[1]);
        const newEp = ep + delta;
        if (newEp < 0) return;
        const padded = (newEp < 10 ? "0" : "") + newEp.toString();
        const newUrl = window.location.href.replace(/(\d+)-v/, padded + "-v");
        window.location = newUrl;
    }

    function getEpisodeNumberFromUrl(url) {
        const m = url.match(/-(\d+)-v/);
        if (m) return parseInt(m[1]);
        return null;
    }

    const currentMatch = window.location.href.match(/(\d+)-v/);
    if (!currentMatch) return;
    const currentEp = parseInt(currentMatch[1]);
    const nextEp = currentEp + 1;
    const prevEp = currentEp - 1;

    const titleElem = document.querySelector('.entry-title');
    if (titleElem && !titleElem.querySelector('a')) {
        const currentUrl = window.location.href;
        const epNum = currentMatch ? currentMatch[1] : null;
        let mainUrl = currentUrl;
        if (epNum) {
            mainUrl = currentUrl.replace(new RegExp(`-${epNum}(?=-v)`), '');
        }
        const link = document.createElement('a');
        link.href = mainUrl;
        link.textContent = titleElem.textContent.trim();
        link.title = "Page principale de l'anime";
        link.style.color = 'inherit';
        link.style.textDecoration = 'none';
        titleElem.textContent = ''; // on vide le titre
        titleElem.appendChild(link);
    }

    let prevDetected = true;
    let nextDetected = true;

    const select = document.querySelector("select[onchange*='window.open']");
    if (select) {
        const options = Array.from(select.options).filter(opt => opt.value && opt.value !== "");
        const epSet = new Set();
        options.forEach(opt => {
            const epNum = getEpisodeNumberFromUrl(opt.value);
            if (epNum !== null) epSet.add(epNum);
        });
        prevDetected = epSet.has(prevEp);
        nextDetected = epSet.has(nextEp);
    }

    if (prevEp >= 0) {
        btnPrevious.innerText = `< Épisode ${prevEp}${!prevDetected ? " ?" : ""}`;
        if (!prevDetected) {
            btnPrevious.classList.add("uncertain");
            btnPrevious.title = `Épisode ${prevEp} non listé, peut exister`;
        }
        btnPrevious.onclick = () => updateEpisode(-1);
    } else {
        btnPrevious.style.display = "none";
    }

    if (nextEp >= 0) {
        btnNext.innerText = `Épisode ${nextEp}${!nextDetected ? " ?" : ""} >`;
        if (!nextDetected) {
            btnNext.classList.add("uncertain");
            btnNext.title = `Épisode ${nextEp} non listé, peut exister`;
        }
        btnNext.onclick = () => updateEpisode(1);
    } else {
        btnNext.style.display = "none";
    }

    if (select && (!prevDetected || !nextDetected)) {
        const msg = [];
        if (!prevDetected && prevEp >= 0) msg.push(`Épisode ${prevEp}`);
        if (!nextDetected && nextEp >= 0) msg.push(`Épisode ${nextEp}`);
        if(msg.length)
          navMsg.textContent = `${msg.join(" et ")} non listé${msg.length > 1 ? "s" : ""}, navigation incertaine`;
    }

    const title = document.querySelector(".entry-title");
    if (title) {
        title.appendChild(document.createElement("br"));
        title.appendChild(btnPrevious);
        title.appendChild(btnNext);
        title.appendChild(navMsg);
    }

    try {
        var imgs = document.getElementsByClassName("col-sm-3 col-xs-12");
        Array.prototype.forEach.call(imgs, function(img) {
            img.querySelectorAll("img").forEach(im => {
                im.src = im.src.replace(/^http:/, "https:");
            });
        });
    } catch {}
})();

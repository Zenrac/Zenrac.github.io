// ==UserScript==
// @name         MavAnime next previous
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Zenrac
// @match        http://www.mavanimes.co/*
// @match        https://www.mavanimes.co/*
// @icon         https://www.google.com/s2/favicons?domain=mavanimes.co
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var btnNext = document.createElement("button");
    btnNext.innerText = "Episode suivant >";

    var btnPrevious = document.createElement("button");
    btnPrevious.innerText = "< Episode précedent";
    btnNext.style = "margin: 10px";

    btnNext.onclick = function () {
        var ep = window.location.href.match(/(\d+)-v/)[1];
        var url = window.location.href.replace(ep, ((parseInt(ep) + 1 < 10) ? "0" : "") + ((parseInt(ep) + 1).toString()));
        window.location = url;
    };

    btnPrevious.onclick = function () {
        var ep = window.location.href.match(/(\d+)-v/)[1];
        var url = window.location.href.replace(ep, ((parseInt(ep) - 1 < 10) ? "0" : "") + ((parseInt(ep) - 1).toString()));
        if ((parseInt(ep) - 1) > 0) {
            window.location = url;
        }
    };

    document.getElementsByClassName("entry-title")[0].appendChild(document.createElement("br"));
    document.getElementsByClassName("entry-title")[0].appendChild(btnPrevious);
    document.getElementsByClassName("entry-title")[0].appendChild(btnNext);
})();

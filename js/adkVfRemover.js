// ==UserScript==
// @name         Remove VF animes from ADKami
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Zenrac
// @match        https://www.adkami.com/
// @match        https://m.adkami.com/
// @match        http://www.adkami.com/
// @match        http://m.adkami.com/
// @match        https://www.adkami.com/page*
// @match        https://m.adkami.com/page*
// @match        http://www.adkami.com/page*
// @match        http://m.adkami.com/page*
// @match        https://www.adkami.com/agenda
// @match        https://m.adkami.com/agenda
// @match        http://www.adkami.com/agenda
// @match        http://m.adkami.com/agenda
// @downloadURL  https://raw.githubusercontent.com/zenrac/zenrac.github.io/master/js/adkVfRemover.js
// @homepageURL  https://github.com/zenrac/zenrac.github.io
// @supportURL   https://github.com/zenrac/zenrac.github.io/issues
// @icon         https://www.google.com/s2/favicons?domain=adkami.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const animes = document.getElementsByClassName("video-item-list")
    var to_remove = [];
    for (var i = 0; i < animes.length; i++) {
        if (animes.item(i).textContent.toLocaleLowerCase().includes(' vf ')) {
            to_remove.push(animes.item(i));
        }
    }
    to_remove.forEach(elem => {
        $(elem).remove();
    });
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
})();

// ==UserScript==
// @name         YouTube Live Chat W/L Counter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Counts W and L in YTB chat with a reset button
// @author       Zenrac
// @match        https://www.youtube.com/live_chat?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let wCount = 0;
    let lCount = 0;

    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '9999',
        backgroundColor: '#000',
        color: '#0f0',
        fontSize: '18px',
        padding: '10px 15px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        userSelect: 'none',
    });

    const counterDisplay = document.createElement('div');
    counterDisplay.textContent = `W: 0 | L: 0`;

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    Object.assign(resetBtn.style, {
        cursor: 'pointer',
        fontSize: '16px',
        padding: '2px 8px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#0f0',
        color: '#000',
        fontWeight: 'bold',
    });

    resetBtn.addEventListener('click', () => {
        wCount = 0;
        lCount = 0;
        counterDisplay.textContent = `W: 0 | L: 0`;
    });

    container.appendChild(counterDisplay);
    container.appendChild(resetBtn);
    document.body.appendChild(container);

    const countMessage = el => {
        if (el.dataset.counted) return;
        el.dataset.counted = 'true';
        const textEl = el.querySelector('#message');
        if (!textEl) return;
        const text = textEl.textContent.toLowerCase();
        const wMatches = text.match(/\bw+\b/g) || [];
        const lMatches = text.match(/\bl+\b/g) || [];
        wCount += wMatches.length;
        lCount += lMatches.length;
        counterDisplay.textContent = `W: ${wCount} | L: ${lCount}`;
    };

    const mutationHandler = mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    if (node.tagName.toLowerCase() === 'yt-live-chat-text-message-renderer') {
                        countMessage(node);
                    } else {
                        node.querySelectorAll('yt-live-chat-text-message-renderer').forEach(countMessage);
                    }
                }
            }
        }
    };

    const waitForItems = () => {
        const items = document.querySelector('#items');
        if (items) {
            console.log('✅ #items found, starting observer');
            new MutationObserver(mutationHandler).observe(items, { childList: true, subtree: true });
        } else {
            console.log('🔁 #items not found, retrying...');
            setTimeout(waitForItems, 500);
        }
    };

    waitForItems();

})();

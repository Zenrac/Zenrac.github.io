// ==UserScript==
// @name         YouTube Live Chat W/L Counter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Counts W and L in YTB chat with a reset button
// @author       Zenrac
// @match        https://www.youtube.com/live_chat?*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// ==/UserScript==

(function() {
  'use strict';

  let wCount = 0;
  let lCount = 0;

  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'fixed',
    top: '3px',
    left: '54%',
    transform: 'translateX(-50%)',
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
    cursor: 'grab',
    whiteSpace: 'nowrap',
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
    userSelect: 'none',
  });

  resetBtn.addEventListener('click', () => {
    wCount = 0;
    lCount = 0;
    counterDisplay.textContent = `W: 0 | L: 0`;
  });

  container.appendChild(counterDisplay);
  container.appendChild(resetBtn);
  document.body.appendChild(container);

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  container.addEventListener('mousedown', e => {
    if (e.target === resetBtn) return;
    isDragging = true;
    offsetX = e.clientX - container.getBoundingClientRect().left;
    offsetY = e.clientY - container.getBoundingClientRect().top;
    container.style.cursor = 'grabbing';
    const rect = container.getBoundingClientRect();
    container.style.left = rect.left + 'px';
    container.style.top = rect.top + 'px';
    container.style.transform = 'none';
    e.preventDefault();
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      container.style.cursor = 'grab';
    }
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const rect = container.getBoundingClientRect();
    if (newLeft < 0) newLeft = 0;
    else if (newLeft + rect.width > winW) newLeft = winW - rect.width;
    if (newTop < 0) newTop = 0;
    else if (newTop + rect.height > winH) newTop = winH - rect.height;
    container.style.left = newLeft + 'px';
    container.style.top = newTop + 'px';
    container.style.right = 'auto';
    container.style.bottom = 'auto';
  });

  const countMessage = el => {
    if (el.dataset.counted) return;
    el.dataset.counted = 'true';
    const textEl = el.querySelector('#message');
    if (!textEl) return;
    const text = textEl.textContent.toLowerCase();
    const words = text.split(/\s+/);
    const hasW = words.some(word => /^[w]+$/i.test(word));
    const hasL = words.some(word => /^[l]+$/i.test(word));
    if (hasW) {
      wCount += 1;
      counterDisplay.textContent = `W: ${wCount} | L: ${lCount}`;
      el.style.backgroundColor = 'rgba(0,255,0,0.2)';
    } else if (hasL) {
      lCount += 1;
      counterDisplay.textContent = `W: ${wCount} | L: ${lCount}`;
      el.style.backgroundColor = 'rgba(255,0,0,0.2)';
    }
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
      new MutationObserver(mutationHandler).observe(items, { childList: true, subtree: true });
    } else {
      setTimeout(waitForItems, 500);
    }
  };

  waitForItems();

})();

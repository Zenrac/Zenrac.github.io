const achievementData = {
  "detective": {
    icon: "fa fa-magnifying-glass",
    title: "Inspector Gadget",
    text: "Clicked so many things, you're basically a detective now.",
    rarity: "EpicAchievement",
  },
  "blind": {
    icon: "fa fa-glasses",
    title: "Colorblind",
    text: "You may need to wear sunglasses after this one!",
    rarity: "CommonAchievement",
  },
  "grave_digger": {
    icon: "fa fa-book-skull",
    title: "Tomb Raider",
    text: "You dug up one of my oldest projects... brave soul.",
    rarity: "CommonAchievement",
  },
  "friendship": {
    icon: "fa fa-door-open",
    title: "An Open Door",
    text: "You're here. But are you welcome?",
    rarity: "UncommonAchievement",
  },
  "cat": {
    icon: "fa fa-cat",
    title: "Cat Nap",
    text: "You disturbed the sleepy cat. Proceed with caution.",
    rarity: "RareAchievement",
  },
  "completed": {
    icon: "fa fa-trophy",
    title: "Master of the Pointless",
    text: "You got 'em all! Or maybe...",
    rarity: "LegendaryAchievement",
  },
  "konami": {
    icon: "fa fa-gamepad",
    title: "Konami Fanboy",
    text: "You cracked the not-so-secret Konami code!",
    rarity: "EpicAchievement",
  },
  "celebrate": {
    secret: true,
    icon: "fa-solid fa-meteor",
    title: "Celebration Time",
    text: "Your powers are now unmatched! Press C to celebrate anywhere.",
    rarity: "MythicAchievement",
  },
  "skin": {
    secret: true,
    icon: "fa-solid fa-shirt",
    title: "Metamorphosis",
    text: "You've reached maximum potential! Press S to change your skin anytime.",
    rarity: "MythicAchievement",
  },
  "bronze": {
    secret: true,
    icon: "fa-solid fa-medal",
    title: "Prestige",
    text: "After a long journey, you came back to where it all started. Congratulations, I have nothing more to offer.",
    rarity: "SecretAchievement",
  },
};

const rarityOrder = {
  'CommonAchievement': 1,
  'UncommonAchievement': 2,
  'RareAchievement': 3,
  'EpicAchievement': 4,
  'LegendaryAchievement': 5,
  'MythicAchievement': 6,
  'SecretAchievement': 7,
};

const rarityColors = {
  CommonAchievement: '#9e9e9e',
  UncommonAchievement: '#4caf50',  
  RareAchievement: '#2196f3',
  EpicAchievement: '#9c27b0',
  LegendaryAchievement: '#ffb84e',
  MythicAchievement: '#ff4500',
  SecretAchievement: '#ff69b4',
};

const rarityToSkin = {
  'CommonAchievement': 'bronze',
  'UncommonAchievement': 'bronze',
  'RareAchievement': 'silver',
  'EpicAchievement': 'silver',
  'LegendaryAchievement': 'gold',
  'MythicAchievement': 'mythic',
  'SecretAchievement': 'secret',
};


const sortedAchievements = Object.entries(achievementData)
  .sort(([, a], [, b]) => rarityOrder[a.rarity] - rarityOrder[b.rarity])
  .reduce((obj, [key, val]) => {
    obj[key] = val;
    return obj;
  }, {});

const konamiSequences = [
  ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'],
  ['w', 'w', 's', 's', 'a', 'd', 'a', 'd', 'b', 'a'], // QWERTY
  ['z', 'z', 's', 's', 'q', 'd', 'q', 'd', 'b', 'a']  // AZERTY
];

let lastMousePos = { x: 0, y: 0 };

let celebrationCount = 0;

let isZoomed = false;

let inputBuffer = [];

function renderAchievementIcon(id, unlocked, isNew = false) {
  const data = achievementData[id] || {
    icon: "fa fa-trophy",
    text: "Achievement unlocked!",
    rarity: "CommonAchievement"
  };

  const iconColor = unlocked ? '#fff' : '#666';
  const bgColor = unlocked ? '#14171c' : '#333';

  return `
    <div style="position: relative; display: inline-block;">
      <div class="AchievementIconWrapper ${data.rarity}">
        <div class="AchievementIconGlowContainerRoot">
          <div class="AchievementIconGlowContainer">
            <div class="AchievementIconGlow"></div>
          </div>
        </div>
        <div class="ani_icon" style="background-color: ${bgColor};">
          <i class="${data.icon} glyphicon-size" style="color: ${iconColor};"></i>
        </div>
      </div>
      ${isNew ? '<div class="newly-viewed-dot"></div>' : ''}
    </div>
  `;
}

function getUnviewedAchievements() {
  const unlocked = getUnlockedAchievements();
  const viewed = JSON.parse(localStorage.getItem('viewedAchievements')) || {};

  const unviewed = [];

  for (const id in unlocked) {
    if (!viewed[id]) {
      unviewed.push(id);
    }
  }

  return unviewed;
}

function updateAchievementCount() {
  const unviewed = getUnviewedAchievements();
  const count = unviewed.length;
  $('#achievement-count').text(count);

  const badge = document.getElementById("achievement-count");
  if (!badge) return;

  if (count > 0) {
    badge.textContent = count;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}

function openSkinSelector() {
  const skins = [
    { value: 'bronze', label: 'Bronze', iconClass: 'fa fa-trophy bronze' },
    { value: 'silver', label: 'Silver', iconClass: 'fa fa-trophy silver' },
    { value: 'gold', label: 'Gold', iconClass: 'fa fa-trophy gold' },
    { value: 'mythic', label: 'Mythic', iconClass: 'fa fa-trophy mythic' },
  ];

  if (getUnlockedAchievements()['bronze']) {
    skins.push({ value: 'secret', label: 'Secret', iconClass: 'fa fa-trophy secret' });
  }

  const skinsHTML = skins.map(skin => `
    <div class="skin-option" data-skin="${skin.value}" title="${skin.label}">
      <i class="${skin.iconClass}" style="font-size: 48px;"></i>
      <div style="text-align:center; margin-top:4px;">${skin.label}</div>
    </div>
  `).join('');

  Swal.fire({
    title: 'Choose your Skin',
    html: `<div style="display:flex; justify-content:space-around; flex-wrap:wrap; gap:15px;">
            ${skinsHTML}
           </div>`,
    showConfirmButton: false,
    showCloseButton: true,
    onOpen: () => {
      document.querySelectorAll('.skin-option').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
          const selectedSkin = el.getAttribute('data-skin');
          applyTrackerSkin(selectedSkin);
          if (selectedSkin === 'bronze') {
            achievementUnlocked('bronze');
          }
          Swal.close();
        });
      });
    }
  });
}

function applyTrackerSkin(skin) {
  const tracker = document.getElementById('achievement-tracker');
  if (!tracker) return;

  tracker.classList.remove('bronze', 'silver', 'gold', 'mythic', 'secret');

  tracker.classList.add(skin);

  localStorage.setItem('achievementTrackerSkin', skin);
}

function openAchievementList() {
  const unlocked = getUnlockedAchievements();

  const viewed = JSON.parse(localStorage.getItem('viewedAchievements') || '{}');

  const newlyViewed = {};

  for (const id in unlocked) {
    if (!(id in viewed)) {
      newlyViewed[id] = unlocked[id];
    }
  }

  localStorage.setItem('viewedAchievements', JSON.stringify(unlocked));

  updateAchievementCount();

  const allIds = Object.keys(sortedAchievements);
  const allUnlocked = allIds.filter(id => !achievementData[id].secret).every(id => unlocked[id]);

  const achievementsHTML = allIds.map(id => {
    const data = achievementData[id];
    const isUnlocked = !!unlocked[id];

    const iconHtml = renderAchievementIcon(id, isUnlocked, id in newlyViewed);

    if (data.secret && !isUnlocked) {
      return '';
    }
    return `
      <div class="swal-achievement achievement-${id} ${isUnlocked ? 'unlocked' : 'locked'}" style="display:flex; align-items:center; margin-bottom: 10px;">
        ${iconHtml}
        <div class="achieve-text" style="margin-left: 12px;">
          <div class="achieve-title" style="color: ${isUnlocked ? rarityColors[data.rarity] : '#999'}; font-weight: ${isUnlocked ? '700' : '400'};">
            ${isUnlocked ? data.title : '???'}
          </div>
          ${isUnlocked ? data.text : '<div class="achieve-locked" style="color:#555; font-style: italic; font-size: 12px;">Locked</div>'}
        </div>
      </div>
    `;
  }).join('');

  prestigeCount = getPrestigeCount();
  prestigeHtml = prestigeCount > 0 ? ' - ' + `<div class="prestige-count" style="color: #ffb84e; margin-left: 5px">Prestige ${prestigeCount}</div>` : ''; 

  Swal.fire({
    title: allUnlocked ? `🎉 All Achievements Unlocked!${prestigeHtml}` : `Your Achievements${prestigeHtml}`,
    html: `<div style="text-align:left;">${achievementsHTML}</div>`,
    width: 480,
    customClass: {
      popup: 'achievement-popup',
      title: 'achievement-title',
      content: 'achievement-content',
    },
    showCloseButton: true,
    focusConfirm: false,
    confirmButtonText: 'Close',
    showCancelButton: allUnlocked,
    cancelButtonText: unlocked['skin'] ? 'Change skin' : 'Celebrate!',
    cancelButtonColor: '#B28E00',
    buttonsStyling: true,
  }).then((result) => {
    if (isZoomed) {
      document.body.style.transform = "scale(1)";
      document.body.style.transformOrigin = "";
      isZoomed = false;
    }
    let unlocked = getUnlockedAchievements();
    if (result.dismiss == "cancel") {
      if (unlocked['skin']) {
        openSkinSelector();
      }
      else {
          createConfetti();
        }
    }
  });
}

function getHighestUnlockedSkin() {
  const unlocked = getUnlockedAchievements();
  if (!unlocked) return 'bronze';

  let highestRarityLevel = 0;
  let highestRarity = 'CommonAchievement';

  for (const id in unlocked) {
    if (unlocked[id]) {
      const rarity = achievementData[id]?.rarity || 'CommonAchievement';
      const level = rarityOrder[rarity] || 1;
      if (level > highestRarityLevel) {
        highestRarityLevel = level;
        highestRarity = rarity;
      }
    }
  }

  return rarityToSkin[highestRarity] || 'bronze';
}

function getUnlockedAchievements() {
  const data = localStorage.getItem('achievements');
  return data ? JSON.parse(data) : {};
}

function setUnlockedAchievements(obj) {
  localStorage.setItem('achievements', JSON.stringify(obj));
  updateAchievementCount();
}

function checkAllAchievementsUnlocked() {
  const allIds = Object.keys(achievementData).filter(id => id !== 'completed' && !achievementData[id].secret);
  const unlocked = getUnlockedAchievements();

  const allUnlocked = allIds.every(id => unlocked[id]);

  if (allUnlocked) {
    achievementUnlocked('completed');
  }
}

function getUnlockDuration(unlocked) {
  const timestamps = Object.values(unlocked);
  if (timestamps.length === 0) return 0;

  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);

  return maxTime - minTime;
}

function getPrestigeCount() {
  return parseInt(localStorage.getItem('prestigeCount')) || 0;
}

function setPrestigeCount(count) {
  localStorage.setItem('prestigeCount', count);
}

function prestige() {
  unlockedAchievements = {};
  currentSkin = 'bronze';
  applyTrackerSkin(currentSkin);
  setUnlockedAchievements(unlockedAchievements);
  updateAchievementCount();
  let count = getPrestigeCount();
  count++;
  setPrestigeCount(count);
  Swal.fire({
    title: 'Prestige Complete!',
    text: 'Your achievements and skins have been reset. How fast can you get back to where you were?',
    icon: 'success',
    confirmButtonText: 'Great!'
  });
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return seconds + "s";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + "m " + (seconds % 60) + "s";

  const hours = Math.floor(minutes / 60);
  return hours + "h " + (minutes % 60) + "m";
}

function createConfetti(onCursor = false, nuke = false) {

  let originY = 0.6;
  let originX = null;

  if (onCursor) {
    originX = lastMousePos.x / window.innerWidth;
    originY = lastMousePos.y / window.innerHeight;
  }

  celebrationCount++;
  if (celebrationCount >= 7) {
    achievementUnlocked('celebrate');
  }
  if (celebrationCount >= 77) {
    achievementUnlocked('skin');
  }

  confetti({
    particleCount: nuke ? 1000 : 150,
    spread: nuke ? 200 : 70,
    origin: { x: originX, y: originY }
  });

  setTimeout(() => {
    document.querySelectorAll('canvas').forEach(canvas => {
      const style = getComputedStyle(canvas);
      const isConfettiCanvas =
        style.position === 'fixed' &&
        style.pointerEvents === 'none' &&
        !canvas.id;

      if (isConfettiCanvas) {
        canvas.style.zIndex = '10001';
      }
    });
  }, 0);
}

function achievementUnlocked(id) {
  const unlocked = getUnlockedAchievements();
  if (unlocked[id]) return;

  unlocked[id] = Date.now();
  setUnlockedAchievements(unlocked);

  applyTrackerSkin(getHighestUnlockedSkin());

  let data = achievementData[id] || {
    "icon": "fa fa-trophy",
    "text": "Achievement unlocked!",
  };
  $('<div id="temp" class="ani_div grad">' +
      renderAchievementIcon(id, false) +
      '<div class="content">' +
        '<span class="title">Achievement Unlocked!</span>' +
        '<span class="description">' + data.text + '</span>' +
      '</div>' +
    '</div>').appendTo(document.body);

  $(".ani_icon").css("background-color", "#14171c");
  $(".glyphicon-size").css("color", "#fff");

  setTimeout(function () {
    $('#temp').remove();
    if (id != 'completed') {
      checkAllAchievementsUnlocked();
    }
  }, 5950);

}

jQuery(document).ready(function($) {
  // Remove url text on mouseover for icons links
  $('a').each(function() {
    $(this).attr('onclick', 'window.location.href="' + $(this).attr('href') + '"');
    $(this).removeAttr('href');
  });
});

jQuery(document).ready(function($) {
  /**
   * Set footer always on the bottom of the page
   */
  function footerAlwayInBottom(footerSelector) {
    var docHeight = $(window).height();
    if (footerSelector.position() != undefined && $('footer').is(":visible")) {
      var footerTop = footerSelector.position().top + footerSelector.height();
      if (footerTop < docHeight) {
        footerSelector.css("margin-top", (docHeight - footerTop) + "px");
      } else {
        footerSelector.css('margin-top', '0px');
      }
    }
  }

  // Page loaded

  updateAchievementCount();

  checkAllAchievementsUnlocked();

  const savedSkin = localStorage.getItem('achievementTrackerSkin');

  if (savedSkin) {
    applyTrackerSkin(savedSkin);
  } else {
    const defaultSkin = getHighestUnlockedSkin();
    applyTrackerSkin(defaultSkin);
  }

  footerAlwayInBottom($("#footer"));

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'c') {
      const unlocked = getUnlockedAchievements();
      if (unlocked['celebrate']) {
        createConfetti(true);
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 's') {
      const unlocked = getUnlockedAchievements();
      if (unlocked['skin']) {
        openSkinSelector();
      }
    }
  });

  $('#achievement-tracker').on('click', () => {
    openAchievementList();
  });

  $('body').on('click', '.ani_div', () => {
    openAchievementList();
  });

  $(document).on('click', '.achievement-grave_digger', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['grave_digger']) {
      Swal.fire({
        title: isZoomed ? "Nothing to see here Detective" : "An easter egg into an easter egg? Really?",
        width: 500,
        html:
        '<iframe width="80%" height:"auto" src="https://www.youtube.com/embed/7y9tpd4Pj20?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
      }).then((result) => { openAchievementList(); });
    }
  });

  $(document).on('click', '.achievement-friendship', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['friendship']) {
      Swal.fire({
        title: isZoomed ? "Nothing to see here Detective" : "An easter egg into an easter egg? Really?",
        width: 500,
        html:
        '<iframe width="80%" height:"auto" src="https://www.youtube.com/embed/J7BiQPD6qUg?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
      }).then((result) => { openAchievementList(); });
    }
  });

  $(document).on('click', '.achievement-cat', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['cat']) {
      Swal.fire({
        title: isZoomed ? "Nothing to see here Detective" : "An easter egg into an easter egg? Really?",
        width: 500,
        html:
        '<iframe width="80%" height:"auto" src="https://www.youtube.com/embed/pM7KJxz5i00?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
      }).then((result) => { openAchievementList(); });
    }
  });

  $(document).on('click', '.achievement-blind', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['blind']) {
      Swal.fire({
        title: isZoomed ? "Nothing to see here Detective" : "An easter egg into an easter egg? Really?",
        width: 500,
        html:
        '<iframe width="80%" height:"auto" src="https://www.youtube.com/embed/-iwYHk_SwNA?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
      }).then((result) => { openAchievementList(); });
    }
  });

  $(document).on('click', '.achievement-konami', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['konami']) {
      Swal.fire({
        title: isZoomed ? "Nothing to see here Detective" : "An easter egg into an easter egg? Really?",
        width: 500,
        html:
        '<iframe width="80%" height:"auto" src="https://www.youtube.com/embed/_MnCeDBSbzA?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
      }).then((result) => { openAchievementList(); });
    }
  });

  $(document).on('click', '.achievement-completed', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['completed']) {
      Swal.fire({
        title: isZoomed ? "Congratulation Detective! You're on the right way!" : "Congratulations! You unlocked all achievements!",
        text: isZoomed ? "Thanks to your detective skills you understand that you may need to celebrate..." : "I mean all of them without talking about the secret ones, right?",
        width: 500,
        confirmButtonText: isZoomed ? 'Celebrate!' : 'If only I had my manifying glass...',
        confirmButtonColor: isZoomed ? '#B28E00' : ''
      }).then((result) => { 
        if (isZoomed && result.value) {
          createConfetti(); 
          document.body.style.transform = "scale(1)";
          document.body.style.transformOrigin = "";
          isZoomed = false;
        }
      });
    }
  });

  $(document).on('click', '.achievement-detective', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['detective']) {
      if (!isZoomed) {
        document.body.style.transform = "scale(1.5)";
        document.body.style.transformOrigin = "top left";
      } else {
        document.body.style.transform = "scale(1)";
        document.body.style.transformOrigin = "";
      }
      isZoomed = !isZoomed;
    }
  });

  $(document).on('click', '.achievement-celebrate', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['celebrate']) {
      createConfetti(false, true);
    }
  });

  $(document).on('click', '.achievement-skin', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['skin']) {
      openSkinSelector();
    }
  });

  $(document).on('click', '.achievement-bronze', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['bronze']) {
      const durationMs = getUnlockDuration(unlocked);
      const readableDuration = formatDuration(durationMs);
      Swal.fire({
        title: "Do you want to prestige?",
        width: 500,
        text: `You took ${readableDuration} to reach this point. This will reset all your achievements and skins. You will be able to unlock them again.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Prestige!',
        cancelButtonText: 'No, I changed my mind',
        confirmButtonColor: '#B28E00',
      }).then((result) => { 
        if (result.value == true)
          prestige();
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    inputBuffer.push(key);

    if (inputBuffer.length > 10) {
      inputBuffer.shift();
    }

    for (const sequence of konamiSequences) {
      if (inputBuffer.join(',') === sequence.join(',')) {
        achievementUnlocked('konami');
        inputBuffer = [];
        break;
      }
    }
  });

  document.addEventListener('mousemove', (e) => {
    lastMousePos.x = e.clientX;
    lastMousePos.y = e.clientY;
  });

  // Apply when page is fully loaded
  $(window).on("load", function() {
    footerAlwayInBottom($("#footer"));
    $(window).trigger('resize');
  });

  // Apply when page is resizing
  $(window).resize(function() {
    footerAlwayInBottom($("#footer"));
  });

  // Apply every 25 ms
  window.setInterval(function() {
    footerAlwayInBottom($("#footer"));
  }, 25);

  $('body').on('click', '.play', function(e) {
	  if ($('iframe').length < 1) {
		  var iframe = document.createElement('iframe')
		  iframe.src = './0x40/?song=WRLD&autoSong=loop&autoSongDelay=3';
		  iframe.classList.add('fullscreen');
		  $('body').prepend(iframe)
		  $('.play').html($('.play').html().replace('fa-play', 'fa-stop').replace('Play', 'Stop'))
		  $('#footer').addClass('hidden');
		  var hideButton = $('.play').clone();
		  hideButton.html(hideButton.html().replace('fa-stop', 'fa-eye-slash').replace('Stop', 'Hide'))
		  hideButton.removeClass('play')
      hideButton.removeClass('hover')
      hideButton.removeClass('rasberry-dropshadow')
		  hideButton.addClass('hideInterface')
      $('.player').css('opacity', '0.8')
		  $('.player').append(hideButton);
      // Hack to simulate a click on the preloader 0x40
      const interval = setInterval(() => {
        const iframe = document.querySelector("iframe.fullscreen");
        if (!iframe || !iframe.contentDocument) return;

        const preloader = iframe.contentDocument.querySelector(".hues-preloader");
        const clickable = iframe.contentDocument.querySelector(".hues-preloader__subtext");

        if (!preloader || !clickable) return;

        if (preloader.classList.contains("hues-preloader--loaded")) {
          clearInterval(interval);
        } else if (clickable.textContent.toLowerCase().includes("to start")) {
          preloader.click();
        }
      }, 100);
	  } else {
      $('iframe').remove();
      $('.hideInterface').remove();
      $('.play').html($('.play').html().replace('fa-stop', 'fa-play').replace('Stop', 'Play'))
      $('#footer').removeClass('hidden');
      $('.player').css('opacity', '1')
      if (!$('.mainblock').is(":visible")) {
        $('.mainblock').show();
      }
      achievementUnlocked('blind');

	  }
  });

  $('.github-corner').on('mouseenter', function () {
    achievementUnlocked('cat');
  });

  $('body').on('click', '.hideInterface', function(e) {
    if ($('.mainblock').is(":visible")) {
      $('.hideInterface').html($('.hideInterface').html().replace('Hide', 'Show').replace('fa-eye-slash', 'fa-eye'));
	    $('.mainblock').hide();
    } else {
      $('.hideInterface').html($('.hideInterface').html().replace('Show', 'Hide').replace('fa-eye', 'fa-eye-slash'));
      $('.mainblock').show();
    }
  });
  $('.docsbots').on('click', function(e) {
    achievementUnlocked('grave_digger');
    Swal.fire({
      width: 600,
      html: "<div class='botimgs'><figure class='btn hover animation'><a href='https://watorabot.github.io'><img class='botwatora' src='./images/watora.png'/><figcaption class='figcapwatora'> Watora </figcaption></a></figure><figure class='btn hover animation'><a href='https://meetcord.github.io'><img class='botmeet' src='./images/meetcord.png'/><figcaption class='figcapmeet'> meetcord </figcaption></a></figure></div>",
      imageWidth: 500,
      imageAlt: 'My bots image',
      background: '#202225',
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: false,
    })
  });
  $('.docs').on('click', function(e) {
    achievementUnlocked('friendship');
    Swal.fire({
      title: 'Nice!',
      width: 700,
      text: 'I may refuse your friend request btw!',
      imageUrl: './images/discord.png',
      imageAlt: 'My discord image',
      background: '#202225',
      confirmButtonText:
      '<i class="fa fa-thumbs-up"></i> Great!',
      confirmButtonAriaLabel: 'Thumbs up, great!',
      cancelButtonText:
      '<i class="fa fa-thumbs-down"></i> Fuck you!',
      cancelButtonAriaLabel: 'Thumbs down',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
    }).then((result) => {
      if (result.dismiss == "cancel") {

        swal.fire({
          title: "YOU GOT RICK ROLLED",
          background: '#202225',
          width: '500px',
          confirmButtonText:
          '<i class="fa fa-thumbs-up"></i> I got destroyed!',
          cancelButtonText:
          '<i class="fa fa-thumbs-down"></i> Ahaha, predictable kid.',
          showCloseButton: true,
          showCancelButton: true,
          html:
          '<iframe width="80%" height:"auto" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
        }).then((result) => {
          if (result.dismiss == "cancel") {
            Swal.fire({
              title: "CAN'T YOU ADMIT?",
              html: "<a href='https://zenrac.wixsite.com/souriredeberserk-fs'><img src=https://i.imgur.com/ZngZTjQ.png /></a>",
              imageAlt: "BERSERK",
              confirmButtonText:
              '<i class="fa fa-thumbs-up"></i> I am sorry!',
              confirmButtonAriaLabel: 'Thumbs up, great!',
            }).then((result) => {
              if (!result.dismiss) {
                Swal.fire({
                  title: "You're not sorry! You're a user! Gotcha",
                  width: '500px',
                  html:
                  '<iframe width="80%" height:"auto" src="https://www.youtube.com/embed/K5JLIdAPfdc?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
                })
                achievementUnlocked('detective');
              }
            })
          }
        })
      }
    })
  });
});



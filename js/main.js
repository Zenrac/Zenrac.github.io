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
    text: "You might need sunglasses after this one!",
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
    text: "You got 'em all! Or did you...?",
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
    text: "Your powers are now unmatched! Press C to celebrate.",
    rarity: "MythicAchievement",
  },
  "skin": {
    secret: true,
    icon: "fa-solid fa-shirt",
    title: "Metamorphosis",
    text: "You've reached maximum potential! Press S to change your skin.",
    rarity: "MythicAchievement",
  },
  "bronze": {
    secret: true,
    icon: "fa-solid fa-medal",
    title: "Cycle Completed",
    text: "After a long journey, you came back to where it all started.",
    rarity: "SecretAchievement",
  },
  "prestigious": {
    secret: true,
    icon: "fa-solid fa-repeat",
    title: "Master of the Loop",
    text: "You mastered the art of looping back to the beginning.",
    rarity: "PrestigeAchievement",
  },
  'L': {
    secret: true,
    icon: "fa-solid fa-user-secret",
    title: "Lawliet",
    text: "Your mind sees what others miss. Always one step ahead.",
    rarity: "PrestigeAchievement",
  },
  'edgy': {
    secret: true,
    icon: "fa-solid fa-crow",
    title: "Edgy Crow",
    group: 'evilorgood',
    text: "You ventured into the shadows, and they welcomed you.",
    rarity: "SecretAchievement",
  },
  'berserk': {
    secret: true,
    icon: "fa-solid fa-smile",
    title: "They are Watching",
    group: 'evilorgood',
    text: "Who are they? Why are they smiling? What's so funny?!",
    rarity: "SecretAchievement",
  },
  'weakened': {
    secret: true,
    icon: "fa-solid fa-heart-crack",
    title: "Evil Weakened",
    group: 'evilorgood',
    text: "You shattered the evil's strength. The end is near.",
    rarity: "SecretAchievement",
  },
  'evil': {
    secret: true,
    icon: "fa-solid fa-mask",
    group: 'evilorgood',
    title: "Berserker Brother",
    text: "You embraced the rage and became one with madness.",
    rarity: "PrestigeAchievement",
  },
  'good': {
    secret: true,
    icon: "fa-solid fa-dove",
    group: 'evilorgood',
    title: "Berserker no More",
    text: "You calmed the chaos and restored the balance.",
    rarity: "PrestigeAchievement",
  },
  'rng': {
    secret: true,
    icon: "fa-solid fa-clover",
    title: "RNG Carried",
    text: "Some people never struggle.",
    rarity: "PrestigeAchievement",
  },
  'unlucky': {
    secret: true,
    icon: "fa-solid fa-dice",
    title: "The Dice Are Rigged",
    text: "You beat my highest failstack spent on PEN Blackstar.",
    rarity: "PrestigeAchievement",
  },
  'arsha': {
    secret: true,
    icon: "fa-solid fa-droplet",
    title: "Red Flag",
    text: "2x more resources this run, but there was a 10% chance of wasting everything.",
    rarity: "RareAchievement",
  },
  'dead': {
    secret: true,
    icon: "fa-solid fa-skull-crossbones",
    title: "Got PKed",
    text: "You got PKed and lost all your resources. Better read a PvP guide next time!",
    rarity: "RareAchievement",
  }
};

const rarityOrder = {
  'CommonAchievement': 1,
  'UncommonAchievement': 2,
  'RareAchievement': 3,
  'EpicAchievement': 4,
  'LegendaryAchievement': 5,
  'MythicAchievement': 6,
  'SecretAchievement' : 7,
  'PrestigeAchievement': 8
};

const rarityColors = {
  CommonAchievement: '#9e9e9e',
  UncommonAchievement: '#4caf50',  
  RareAchievement: '#2196f3',
  EpicAchievement: '#9c27b0',
  LegendaryAchievement: '#ffb84e',
  MythicAchievement: '#ff4500',
  SecretAchievement: '#ff69b4',
  PrestigeAchievement: 'white'
};

const rarityToSkin = {
  'CommonAchievement': 'bronze',
  'UncommonAchievement': 'bronze',
  'RareAchievement': 'silver',
  'EpicAchievement': 'silver',
  'LegendaryAchievement': 'gold',
  'MythicAchievement': 'mythic',
  'SecretAchievement': 'secret',
  'PrestigeAchievement': 'prestige'
};

const defaultGameData = {
  viewedAchievements: {},
  customPrestige: null,
  achievementTrackerSkin: 'bronze',
  achievements: {},
  prestigeCount: 0,
  cronStone: 0,
  failstack: 150,
  durability: 200,
  magicalStone: 0
};

const MAGIC_NUMBER = 7;
const CELEBRATION_MAX = 77;
const STEAM_POPUP_TIMEOUT = 5950;

const STORAGE_KEY = 'easterEggs';

const berserkSrc = 'https://i.imgur.com/ZngZTjQ.png';

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

let currentZoom = 1;

let inputBuffer = [];

const axeUrl = "https://bdocodex.com/items/new_icon/06_pc_equipitem/00_common/01_weapon/00690563.webp";
const cronUrl = "https://bdocodex.com/items/new_icon/03_etc/00016080.webp";
const stoneUrl = "https://bdocodex.com/items/new_icon/03_etc/00752021.webp";
const memoryFragmentUrl = "https://bdocodex.com/items/new_icon/03_etc/04_dropitem/00044195.webp";
const healthPotionUrl = "https://bdocodex.com/items/new_icon/03_etc/08_potion/00040712.webp";

const GAME_DATA_KEYS = Object.freeze({
  VIEWED_ACHIEVEMENTS: 'viewedAchievements',
  CUSTOM_PRESTIGE: 'customPrestige',
  ACHIEVEMENT_TRACKER_SKIN: 'achievementTrackerSkin',
  ACHIEVEMENTS: 'achievements',
  PRESTIGE_COUNT: 'prestigeCount'
});

Object.values(GAME_DATA_KEYS).forEach(key => {
  localStorage.removeItem(key);
});

function getGameData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : { ...defaultGameData };
}

function setGameData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getPrestigeCount() {
  return getGameData().prestigeCount || 0;
}

function setPrestigeCount(count) {
  const data = getGameData();
  data.prestigeCount = count;
  setGameData(data);
}

function getUnviewedAchievements() {
  const unlocked = getUnlockedAchievements();
  const viewed = getGameData().viewedAchievements || {};

  const unviewed = [];

  for (const id in unlocked) {
    if (!viewed[id]) {
      unviewed.push(id);
    }
  }

  return unviewed;
}

function getHighestUnlockedSkin() {
  const unlocked = getUnlockedAchievements();
  if (!unlocked) return 'bronze';

  let highestRarityLevel = 0;
  let highestRarity = 'CommonAchievement';

  for (const id in unlocked) {
    if (unlocked[id]) {
      const rarity = achievementData[id]?.rarity || 'CommonAchievement';
      if (rarity == 'PrestigeAchievement' && (!unlocked['skin'] || !unlocked['prestigious'])) {
        continue;
      }
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
  return getGameData().achievements || {};
}

function setUnlockedAchievements(obj) {
  const data = getGameData();
  data.achievements = obj;
  setGameData(data);
  updateAchievementCount();
}

function resetEverything() {
    setGameData(defaultGameData);
    updateAchievementCount();
}

function askReset() {
    Swal.fire({
    title: 'Reset Everything?',
    text: 'All progression will be lost. This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Reset',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
    reverseButtons: true
  }).then((result) => {
    if (result && result.value) {
      resetEverything();
    }
  });
}

function loadCustomPrestigeSkin() {
  const tracker = document.getElementById('achievement-tracker');
  if (!tracker) return;

  const saved = getGameData().customPrestige;
  if (!saved) return;

  try {

    const icon = tracker.querySelector('i');

    if (!icon) return;

    icon.style.animation = `${saved.animation} 2s infinite`;
    icon.style.color = saved.color;

    tracker.classList.add('prestige');
  } catch  {
  }
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

function getUnlockDuration(unlocked) {
  const timestamps = Object.values(unlocked);
  if (timestamps.length === 0) return 0;

  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);

  return maxTime - minTime;
}

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

function changeZoom(value) {
  currentZoom = value;

  if (value === 1) {
    document.body.classList.remove('zoomed');
    document.body.style.transform = "";
  } else {
    document.body.classList.add('zoomed');
    document.body.style.transform = `scale(${value})`;
  }
}

function toggleZoom() {
    if (isZoomed) {
      changeZoom(1);
    } else {
      changeZoom(1.5);
    }
    isZoomed = !isZoomed;
}

function openSkinSelector() {
  const skins = [
    { value: 'bronze', label: 'Bronze', iconClass: 'fa fa-trophy bronze' },
    { value: 'silver', label: 'Silver', iconClass: 'fa fa-trophy silver' },
    { value: 'gold', label: 'Gold', iconClass: 'fa fa-trophy gold' },
    { value: 'mythic', label: 'Mythic', iconClass: 'fa fa-trophy mythic' },
  ];

  const unlockedAchievements = getUnlockedAchievements();

  const hasSecretAchievement = Object.entries(unlockedAchievements).some(([id, unlocked]) =>
    unlocked && (achievementData[id]?.rarity === 'SecretAchievement')
  );

  if (hasSecretAchievement) skins.push({ value: 'secret', label: 'Secret', iconClass: 'fa fa-trophy secret' });

  if (getUnlockedAchievements()['prestigious']) {
    skins.push({ value: 'prestige', label: 'Prestige', iconClass: 'fa fa-trophy prestige' });
  }

  const savedSkin = getGameData().achievementTrackerSkin || 'bronze';
  let prestigeSettings = { animation: 'bronzeGlow', color: '#ff0077' };
  try {
    const savedPrestige = getGameData().customPrestige;
    if (savedPrestige && savedPrestige.animation && savedPrestige.color) {
      prestigeSettings = savedPrestige;
    }
  } catch {}

  const skinsHTML = skins.map(skin => {
    let style = '';
    if (skin.value === 'prestige') {
      style = `color: ${prestigeSettings.color}; animation: ${prestigeSettings.animation} 2s infinite; font-size:48px;`;
    } else {
      style = 'font-size: 48px;';
    }
    const selectedClass = skin.value === savedSkin ? 'selected' : '';

    return `
      <div class="skin-option ${selectedClass}" data-skin="${skin.value}" title="${skin.label}" style="cursor:pointer;">
        <i class="${skin.iconClass}" style="${style}"></i>
        <div style="text-align:center; margin-top:4px;">
          ${skin.label}
          ${savedSkin === skin.value ? '<div style="font-size:12px; color:#888;">Current</div>' : ''}
        </div>
      </div>
    `;
  }).join('');

  Swal.fire({
    title: 'Choose your Skin',
    html: `<div style="display:flex; justify-content:space-around; flex-wrap:wrap; gap:15px;">
            ${skinsHTML}
           </div>`,
    showConfirmButton: false,
    customClass: {
      popup: 'skin-popup',
      title: 'skin-title',
      content: 'skin-content',
    },
    showCloseButton: true,
    onOpen: () => {
      document.querySelectorAll('.skin-option').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
          const selectedSkin = el.getAttribute('data-skin');
          if (selectedSkin === 'prestige') {
            openPrestigeCustomizationPopup();
          } else {
            applyTrackerSkin(selectedSkin);
            if (selectedSkin === 'bronze') {
              achievementUnlocked('bronze');
            }
            Swal.close();
          }
        });
      });
    }
  });
}

function openPrestigeCustomizationPopup() {
  const availableAnimations = [
    'bronzeGlow', 'silverGlow', 'goldGlow',
    'mythicGlow', 'secretGlow', 'secretGlitchShift', 'prestigeGlow'
  ];

  const animationLabels = {
    bronzeGlow: 'Bronze',
    silverGlow: 'Silver',
    goldGlow: 'Gold',
    mythicGlow: 'Mythic',
    secretGlow: 'Secret',
    secretGlitchShift: 'Secret Glitch',
    prestigeGlow: 'Prestige'
  };

  let savedSettings = getGameData().customPrestige;
  let defaultColor = '#ff0077';
  let defaultAnimation = 'bronzeGlow';

  if (savedSettings) {
    try {
      if (savedSettings.color) defaultColor = savedSettings.color;
      if (savedSettings.animation && availableAnimations.includes(savedSettings.animation)) {
        defaultAnimation = savedSettings.animation;
      }
    } catch {
    }
  }

  let chosenColor = defaultColor;


  Swal.fire({
    title: 'Customize Your Prestige Skin',
    customClass: {
      popup: 'prestige-popup',
      title: 'prestige-title',
      content: 'prestige-content',
    },
    html: `
      <div style="text-align: center;">
        <div id="prestige-preview" style="
          font-size: 48px;
          margin-bottom: 12px;
          padding: 16px;
          border-radius: 12px;
          display: inline-block;
          animation: ${defaultAnimation} 2s infinite;
          color: ${defaultColor};
        ">
          <i class="fa fa-trophy"></i>
        </div>

        <div id="prestige-color-picker" style="margin-bottom: 10px;"></div>

        <label for="prestige-animation">Animation:</label><br>
        <select id="prestige-animation" style="margin-bottom: 10px; color: black; background-color: white;">
          ${availableAnimations.map(anim => `<option value="${anim}" ${anim === defaultAnimation ? 'selected' : ''}>${animationLabels[anim] || anim}</option>`).join('')}
        </select>
      </div>
    `,
    showConfirmButton: true,
    confirmButtonText: 'Apply',
    showCloseButton: true,
    onOpen: () => {
      const preview = document.getElementById('prestige-preview');
      const animSelect = document.getElementById('prestige-animation');

      const pickr = Pickr.create({
        el: '#prestige-color-picker',
        default: defaultColor,
        components: {
          preview: true,
          opacity: false,
          hue: true,
          interaction: {
            hex: true,
            input: true,
            save: true
          }
        }
      });

      pickr.on('change', (color) => {
        chosenColor = color.toHEXA().toString();
        preview.style.color = chosenColor;
      });

      animSelect.addEventListener('change', () => {
        const animation = animSelect.value;
        preview.style.animation = `${animation} 2s infinite`;
      });

      pickr.on('save', () => {
        pickr.hide();
      });
    },
    preConfirm: () => {
      return {
        color: chosenColor,
        animation: document.getElementById('prestige-animation').value
      };
    }
  }).then(result => {
    if (result && result.value) {
      const { animation, color } = result.value;
      applyPrestigeSkin(animation, color);
    }
  });
}

function startBossMusic() {
  if ($('.fullscreen').length < 1) {
    const playButton = document.querySelector('.play');
    if (playButton) {
      const ctrlClickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        altKey: true,
        ctrlKey: true
      });
      playButton.dispatchEvent(ctrlClickEvent);
    }
  }
}

function stopBossMusic() {
  if ($('.fullscreen').length > 0) {
    const playButton = document.querySelector('.play');
    if (playButton) {
      const ctrlClickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      playButton.dispatchEvent(ctrlClickEvent);
    }
  }
}

function startBoss(pathChoosen) {

  startBossMusic();

  if ($('.mainblock').is(":visible")) {
    $('.hideInterface').html($('.hideInterface').html().replace('Hide', 'Show').replace('fa-eye-slash', 'fa-eye'));
    $('.mainblock').hide();
  } else {
    $('.hideInterface').html($('.hideInterface').html().replace('Show', 'Hide').replace('fa-eye', 'fa-eye-slash'));
    $('.mainblock').show();
  }

  setTimeout(function () {
    bossBattle(pathChoosen);  
  }, pathChoosen == 'impossible' ? 0 : 2000);

}

function bossBattle(pathChoosen) {

  let bossHP = 100;
  let playerHP = 100;
  let canAttack = true;
  let bossAttackInterval;

  const unlocked = getUnlockedAchievements();
  const penBs = unlocked['rng'];

  Swal.fire({
    title: 'A giant berserk smile attacks!',
    width: 600,
    background: '#111',
    color: '#fff',
    html: `
      <div style="margin-top: 15px;">

        <!-- Player HP -->
        <div id="player-hp-label">Your HP: 100%</div>
        <div style="background: #333; border-radius: 8px; overflow: hidden; height: 20px; margin: 5px 0;">
          <div id="player-hp-bar" style="background: limegreen; width: 100%; height: 100%; transition: width 0.3s;"></div>
        </div>

        <!-- Boss HP -->
        <div id="boss-hp-label">Boss HP: 100%</div>
        <div style="background: #333; border-radius: 8px; overflow: hidden; height: 20px; margin: 5px 0;">
          <div id="boss-hp-bar" style="background: red; width: 100%; height: 100%; transition: width 0.3s;"></div>
        </div>

        <!-- Weapon display and attack button -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 10px;">

          <button id="attack-btn" style="padding: 6px 12px; background: crimson; color: white; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
            <span class="relative">
              <img src="${axeUrl}" width="60" alt="Blackstar IV">
              <span class="enhance-level text-lg">${penBs ? 'V' : 'IV'}</span>
            </span>
            <span>Attack!</span>
          </button>

          <button id="heal-btn" style="padding: 6px 12px; background: green; color: white; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
            <img src="${healthPotionUrl}" width="60" alt="Potion">
            <span>Heal!</span>
          </button>
        </div>
      </div>
    `,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      const attackBtn = document.getElementById('attack-btn');
      const healBtn = document.getElementById('heal-btn');
      const hpBar = document.getElementById('boss-hp-bar');
      const hpLabel = document.getElementById('boss-hp-label');

      const playerHpBar = document.getElementById('player-hp-bar');
      const playerHpLabel = document.getElementById('player-hp-label');

      attackBtn.addEventListener('click', () => {
        if (!canAttack) return;

        canAttack = false;
        attackBtn.disabled = true;
        const beforeAttack = attackBtn.innerHTML;
        attackBtn.innerHTML = attackBtn.innerHTML.replace('Attack!', 'Attacking...');

        let dmg = Math.floor(Math.random() * 5 + 5);
        if (penBs) dmg *= 2;

        bossHP = Math.max(0, bossHP - dmg);
        hpBar.style.width = `${bossHP}%`;
        hpLabel.innerText = `Boss HP: ${bossHP}%`;

        if (bossHP <= 0) {
          stopBossMusic();
          clearInterval(bossAttackInterval);
          Swal.fire({
            title: '🎉 Victory!',
            text: 'You defeated the boss!',
            icon: 'success',
            background: '#111',
            color: '#0f0',
            confirmButtonText: 'Ez trash noob',
            didOpen: () => {
              const confirmBtn = Swal.getConfirmButton();
              const cancelBtn = Swal.getCancelButton();

              if (confirmBtn) confirmBtn.disabled = true;
              if (cancelBtn) cancelBtn.disabled = true;

              setTimeout(() => {
                if (confirmBtn) confirmBtn.disabled = false;
                if (cancelBtn) cancelBtn.disabled = false;
              }, 1000); // 1 second delay
            }
          }).then(() => achievementUnlocked(pathChoosen));
          return;
        }

        setTimeout(() => {
          canAttack = true;
          attackBtn.disabled = false;
          attackBtn.innerHTML = beforeAttack;
        }, 1000);
      });

      healBtn.addEventListener('click', () => {
        if (playerHP >= 100) return;

        var beforeHeal = healBtn.innerHTML;

        playerHP = Math.min(100, playerHP + 10);
        playerHpBar.style.width = `${playerHP}%`;
        playerHpLabel.textContent = `Your HP: ${playerHP}%`;

        healBtn.disabled = true;
        healBtn.innerHTML = healBtn.innerHTML.replace('Heal!', 'Healing...');

        setTimeout(() => {
          healBtn.disabled = false;
          healBtn.innerHTML = beforeHeal;
        }, 2000);
      });

      bossAttackInterval = setInterval(() => {
        var dmg = Math.floor(Math.random() * 10 + 5);
        if (pathChoosen == 'impossible') dmg = 9999;
        playerHP = Math.max(0, playerHP - dmg);
        playerHpBar.style.width = `${playerHP}%`;
        playerHpLabel.innerText = `Your HP: ${playerHP}%`;

        if (playerHP <= 0) {
          stopBossMusic();
          clearInterval(bossAttackInterval);
          Swal.fire({
            title: '💀 You Died!',
            text: 'The boss defeated you...' + ((pathChoosen == 'impossible') ? 'There is no way you can win in the glitched zone.' : 'Maybe try to enhance your weapon?'),
            icon: 'error',
            background: '#111',
            color: '#f00',
            confirmButtonText: (pathChoosen == 'impossible') ? 'This was a stupid idea..' : 'Retry',
            showCancelButton: (pathChoosen != 'impossible'),
            cancelButtonColor: 'red',
            cancelButtonText: 'Escape',
            didOpen: () => {
              const confirmBtn = Swal.getConfirmButton();
              const cancelBtn = Swal.getCancelButton();

              if (confirmBtn) confirmBtn.disabled = true;
              if (cancelBtn) cancelBtn.disabled = true;

              setTimeout(() => {
                if (confirmBtn) confirmBtn.disabled = false;
                if (cancelBtn) cancelBtn.disabled = false;
              }, 1000);
            }
          }).then((result) => {
            if ((pathChoosen == 'impossible') || (result.isDismissed)) { 
              location.reload() 
            };
            startBoss(pathChoosen)
          });
        }
      }, 1000);
    }
  });
}

function choosePath(event) {
  const unlocked = getUnlockedAchievements();
  if (!unlocked['berserk'] || unlocked['good'] || unlocked['evil']) return;
  event.stopImmediatePropagation();
  event.preventDefault();
  Swal.fire({
    title: 'You need to choose your path',
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    closeButtonHtml: null,
    html: `
      <button id="evilBtn">Evil</button>
      <button id="goodBtn">Good</button>
    `,
    onOpen: () => {
      const popup = Swal.getPopup();
      const evilBtn = popup.querySelector('#evilBtn');
      const goodBtn = popup.querySelector('#goodBtn');

      if (evilBtn) {
        evilBtn.addEventListener('click', () => {
          Swal.fire({
            title: 'EMBRACE EVIL?',
            text: "Do you want to embrace evil? There's no turning back!",
            confirmButtonColor: '#8B0000',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'BERSERK',
            cancelButtonText: 'Cancel'
          }).then(result => {
            if (result && result.value) {
              startBoss('evil')
            }
            else {
              choosePath(event);
            }
          });
        });
      }
      if (goodBtn) {
        goodBtn.addEventListener('click', () => {
          Swal.fire({
            title: 'ERASE EVIL?',
            text: "Do you want to erase evil? There's no turning back!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            confirmButtonText: 'JUSTICE',
            cancelButtonText: 'Cancel'
          }).then(result => {
            if (result && result.value) {
              startBoss('good');
            }
            else {
              choosePath(event);
            }
          });
        });
      }
    }
  });
}

function applyPrestigeSkin(animation, color) {
  const data = getGameData();
  data.customPrestige = { animation, color };
  setGameData(data);
  applyTrackerSkin('prestige');
}

function applyTrackerSkin(skin) {
  const tracker = document.getElementById('achievement-tracker');
  const unlocked = getUnlockedAchievements();
  if (!tracker) return;

  const icon = tracker.querySelector('i');

  tracker.classList.remove('bronze', 'silver', 'gold', 'mythic', 'secret', 'prestige');
  if (icon) icon.style.animation = '';
  if (icon) icon.style.color = '';

  tracker.classList.add(skin);

  if (skin === 'prestige' && unlocked['prestigious']) {
    loadCustomPrestigeSkin();
  } else {
    tracker.classList.remove('prestige');
    tracker.style.removeProperty('--prestige-color');
  }

  const data = getGameData();
  data.achievementTrackerSkin = skin;
  setGameData(data);
}

function generateAchievementHtmlContent(allIds, unlocked, newlyViewed, lockedGroups) {
  return allIds.map(id => {
    const data = achievementData[id];
    const isUnlocked = !!unlocked[id];

    const iconHtml = renderAchievementIcon(id, isUnlocked, id in newlyViewed);

    if (data.secret && !isUnlocked) {
      return '';
    }

    if (id == 'edgy' && !unlocked['berserk']) {
      data.title = '???';
      data.text = `<div class='glitch-text'>${data.text}</div>`;
    }

    if (
      data.group &&
      lockedGroups.has(data.group) &&
      (!isUnlocked || data.rarity !== 'PrestigeAchievement')
    ) {
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
}

function openAchievementList() {
  const unlocked = getUnlockedAchievements();
  const viewed = getGameData().viewedAchievements || {};
  const newlyViewed = {};

  for (const id in unlocked) {
    if (!(id in viewed)) {
      newlyViewed[id] = unlocked[id];
    }
  }

  const data = getGameData();
  data.viewedAchievements = unlocked;
  setGameData(data);

  updateAchievementCount();

  const allIds = Object.keys(sortedAchievements);
  const allUnlocked = allIds.filter(id => !achievementData[id].secret).every(id => unlocked[id]);

  const lockedGroups = new Set();

  for (const id in unlocked) {
    const data = achievementData[id];
    if (data && data.rarity === 'PrestigeAchievement' && data.group) {
      lockedGroups.add(data.group);
    }
  }

  const achievementsHTML = generateAchievementHtmlContent(allIds, unlocked, newlyViewed, lockedGroups);

    const prestigeCount = getPrestigeCount();
    const prestigeHtml = prestigeCount > 0 ? `<div class="prestige-count" style="color: #ffb84e; margin-left: 5px">Prestige ${prestigeCount}</div>` : ''; 

    Swal.fire({
      title: allUnlocked ? `🎉 All Achievements Unlocked!${prestigeHtml}` : `Your Achievements${prestigeHtml}`,
      html: `<div style="text-align:left;">${achievementsHTML}</div>`,
      width: 600,
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
        toggleZoom();
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

function checkAllAchievementsUnlocked() {
  const allIds = Object.keys(achievementData).filter(id => id !== 'completed' && !achievementData[id].secret);
  const unlocked = getUnlockedAchievements();

  const allUnlocked = allIds.every(id => unlocked[id]);

  if (allUnlocked) {
    achievementUnlocked('completed');
  }
}

function prestige() {
  let unlockedAchievements = getUnlockedAchievements();
  const filteredAchievements = {};
  for (const key in unlockedAchievements) {
    if (achievementData[key]) {
      if (achievementData[key]?.rarity == 'PrestigeAchievement') {
        filteredAchievements[key] = unlockedAchievements[key];
      }
    }
  }
  unlockedAchievements = filteredAchievements;
  celebrationCount = 0;
  applyTrackerSkin('bronze');
  setUnlockedAchievements(unlockedAchievements);
  var data = getGameData();
  let count = data.prestigeCount ?? 0;
  data.prestigeCount = ++count;
  let stone = data.magicalStone ?? 0;
  data.magicalStone = stone + (unlockedAchievements['arsha'] ? 20 : 10);
  setGameData(data);
  Swal.fire({
    title: 'Prestige Complete!',
    text: 'Your achievements and skins have been reset. How fast can you get back to where you were?',
    icon: 'success',
    confirmButtonText: 'Great!'
  });
  checkPrestigeCount();
  updateAchievementCount();
}

function checkPrestigeCount() {
  const count = getPrestigeCount();
  if (count >= MAGIC_NUMBER) {
    achievementUnlocked('prestigious');
  }
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

  var game = getGameData();
  var durability = (game.durability ?? 200);

  const unlocked = getUnlockedAchievements();

  game.durability = Math.min(durability + (unlocked['arsha'] ? 2 : 1), 200);
  setGameData(game);

  if (onCursor) {
    originX = lastMousePos.x / window.innerWidth;
    originY = lastMousePos.y / window.innerHeight;
  }

  celebrationCount++;
  if (celebrationCount >= MAGIC_NUMBER) {
    achievementUnlocked('celebrate');
  }
  if (celebrationCount >= CELEBRATION_MAX) {
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

  const gameData = getGameData();
  var cron = gameData.cronStone ?? 0;
  var rarityLevel = rarityOrder[achievementData[id]?.rarity] ?? 1;
  var bonusCron = (100 * (rarityLevel * rarityLevel));
  cron += unlocked['arsha'] ? bonusCron * 2 : bonusCron;
  gameData.cronStone = cron;
  setGameData(gameData);

  const savedSkin = getGameData().achievementTrackerSkin || 'bronze';
  if (savedSkin != 'prestige') {
    applyTrackerSkin(getHighestUnlockedSkin());
  }

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
  }, STEAM_POPUP_TIMEOUT);

}

function openBdoEnchant() {
  let failstack = getGameData().failstack ?? 150;;
  const valksBonus = 13;
  const prestigeCount = getPrestigeCount();
  const permanentBonus = Math.min(Math.max(prestigeCount + 2, 2), 5);
  let durability = getGameData().durability ?? 200;
  let cronStones = getGameData().cronStone ?? 0;
  let magicalStone = getGameData().magicalStone ?? 10;

  const baseChance = 0.2;

  const getTotalChance = () => baseChance + failstack * 0.02;
  const getCurrentChance = () => failstack + valksBonus + permanentBonus;

  const showPopup = (feedback = null) => {
    const totalChance = getTotalChance();
    const currentChance = getCurrentChance();

    Swal.fire({
      width: 500,
      customClass: {
        popup: 'enchant-popup',
        title: 'enchant-title',
        content: 'enchant-content',
      },
      title: 'You need to enhance a PEN Blackstar Axe',
      background: '#121212',
      color: '#e0e0e0',
      html: `
        <div style="font-family: sans-serif; color: #ccc; display: flex; flex-direction: column; align-items: center;">
        
          <div style="margin-top: 10px; display: flex; align-items: center; gap: 20px; background: #1c1c1c; padding: 15px 20px; border-radius: 8px;">
            <img src="${stoneUrl}" width="50" alt="Enhancement Stone">
            <div style="text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #80ffff;">${totalChance.toFixed(3)}%</div>
              <div style="font-size: 14px; color: #aaa;">(+${currentChance})</div>
            </div>
            <div class="relative">
              <img src="${axeUrl}" width="60" alt="Blackstar IV"></img>
              <span class="enhance-level text-lg">IV</span>
            </div>
          </div>

          <div style="margin-top: 15px; font-size: 14px; background: #111; padding: 10px; border-radius: 6px; width: 100%; max-width: 320px;">
            <p>🔼 Additional Enhancement Chance: <strong>+${failstack}</strong></p>
            <p>🔁 Valks Enhancement Chance: <strong>+${valksBonus}</strong></p>
            <p>⭐ Permanent Enhancement Chance: <strong>+${permanentBonus}</strong></p>
            <hr style="border: 1px solid #333;">
            <div style="align-self: flex-center; align-items: center; gap: 6px;">
              <img src="${memoryFragmentUrl}" width="30" alt="Memory Fragment">
              <span><strong>Durability: ${durability} / 200</span>
            </div>
            <div style="align-self: flex-center; align-items: center; gap: 6px;">
              <img src="${cronUrl}" width="30" alt="Cron Stones">
              <span><strong>Cron Stones: ${cronStones}</strong> / 3670</span>
            </div>
            <div style="align-self: flex-center; align-items: center; gap: 6px;">
              <img src="${stoneUrl}" width="30" alt="Magical Stone">
              <span><strong>Magical Stones: ${magicalStone}</strong></span>
            </div>

              <div style="margin-top: 8px; font-size: 12px; color: #888; text-align: center; user-select: none;">
                Press , anytime to get back here
              </div>
          </div>

          <!-- Feedback message -->
          ${feedback ? `<div style="margin-top: 10px; color: ${feedback.color}; font-weight: bold;">${feedback.message}</div>` : ''}

          <button id="enchantBtn" style="margin-top: 15px; background: #0a0; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
            Enchant
          </button>
        </div>
      `,
      showConfirmButton: false,
      didOpen: () => {
        $('#enchantBtn').off('click').on('click', () => {
          if (durability < 20 || cronStones < 3670 || magicalStone < 1) {
            Swal.fire({
              icon: 'warning',
              title: 'Insufficient Materials',
              html: `<div style="font-size: 15px; font-weight: bold;">You need <div style="color: orange">3670 cron stones</div><div style="color: orange">20 durability</div><div style="color: orange">1 magical stone</div> per attempt.</div>
              <br><div style="text-decoration: underline;">How to uptain:</div><div>Cron Stones with achievements</div><div>Magical stones by going prestige</div><div>Durability by celebrating!</div>`,
              background: '#111',
              confirmButtonText: 'Go back to grind...',
              color: '#fff'
            }).then(() => showPopup());
            return;
          }

          cronStones -= 3670;
          magicalStone--;

          const success = Math.random() < (totalChance / 100);

          var data = getGameData();

          if (success) {
            Swal.fire({
              icon: 'success',
              title: 'OMG RNG CARRIED?!!',
              html: `           
              <div>Your Blackstar Axe is now PEN (V)!</div> 
              <div>You used a failstack of <span style="font-weight: bold">${failstack}!</span></div>
              <br>
              <div class="relative">
                <img src="${axeUrl}" width="60" alt="Blackstar V"></img>
                <span class="enhance-level text-lg">V</span>
              </div>`,
              imageHeight: 100,
              confirmButtonText: 'EZ GAME',
              background: '#000',
              color: '#0f0'
            });
            data.magicalStone = magicalStone;
            data.cronStone = cronStones;
            data.failstack = 150;
            setGameData(data);
            achievementUnlocked('rng');
          } else {
            failstack += 6;
            durability -= 20;
            showPopup({
              message: '❌ Enhancement failed...',
              color: '#ff4444'
            });
          data.magicalStone = magicalStone;
          data.cronStone = cronStones;
          data.durability = durability;
          data.failstack = failstack;
          setGameData(data);
          
          if (failstack > 349)
            achievementUnlocked('unlucky');
          }
        });
      }
    });
  };

  showPopup();
}

function tryOpenBdoEnchant() {
  const unlocked = getUnlockedAchievements();
  const prestigeCount = getPrestigeCount();
  if (unlocked['skin'] || prestigeCount > 0) {
    openBdoEnchant();
  } else {
    Swal.fire({
      icon: 'info',
      title: "Erm actually...",
      html: `
        You're not skilled enough to go here, come back later and I'll give you free <div style="color: orange">Advice of Valk +150</div><br><br>
        <img src="https://bdocodex.com/items/new_icon/09_cash/00017800.webp" alt="Advice of Valk +150" style="width:80px; height:auto;">
      `,
      confirmButtonText: 'Got it'
    });
  }
}

function openDiscordPopup() {
  achievementUnlocked('friendship');
  Swal.fire({
    title: 'Nice!',
    width: 700,
    text: 'I may refuse your friend request btw!',
    imageUrl: './images/discord.png',
    imageAlt: 'My discord image',
    background: '#202225',
    confirmButtonText: 'Great!',
    cancelButtonText: 'Fuck you!',
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
  }).then((result) => {
    if (result.dismiss == "cancel") {
      swal.fire({
        title: "YOU GOT RICK ROLLED",
        background: '#202225',
        width: '500px',
        confirmButtonText: 'I got destroyed!',
        cancelButtonText: 'Ahaha, predictable kid.',
        showCloseButton: true,
        showCancelButton: true,
        html:
        '<iframe width="80%" height:"auto" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
      }).then((result) => {
        if (result.dismiss == "cancel") {
          Swal.fire({
            title: "CAN'T YOU ADMIT?",
            html: "<a href='https://zenrac.wixsite.com/souriredeberserk-fs'><img id='evil' src=https://i.imgur.com/ZngZTjQ.png /></a>",
            imageAlt: "BERSERK",
            confirmButtonText: 'I am sorry!',
            confirmButtonAriaLabel: 'Thumbs up, great!',
          }).then((result) => {
            if (!result.dismiss) {
              Swal.fire({
                title: "Erm actually...",
                text: "You're not 'sorry', you're a user!",
                width: '500px',
                imageUrl: 'https://i.imgur.com/ycg38JT.png',
                customClass: { image: 'nerd' },
                confirmButtonText: 'Let me out of this nightmare...',
              })
              achievementUnlocked('detective');
            }
          })
        }
      })
    }
  })
}

jQuery(document).ready(function($) {
  $('a').each(function() {
    $(this).attr('onclick', 'window.location.href="' + $(this).attr('href') + '"');
    $(this).removeAttr('href');
  });

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

  const savedSkin = getGameData().achievementTrackerSkin;

  const unlockedAch = getUnlockedAchievements();

  if (savedSkin && (savedSkin != 'prestige' || unlockedAch['prestigious']) && unlockedAch['bronze']) {
    applyTrackerSkin(savedSkin);
  } else {
    const defaultSkin = getHighestUnlockedSkin();
    applyTrackerSkin(defaultSkin);
  }

  checkPrestigeCount();

  footerAlwayInBottom($("#footer"));

  $('body').keydown((e) => {
    if (e.key.toLowerCase() === 'c') {
      const allunlockedAch = getUnlockedAchievements();
      if (e.altKey) {
        if (allunlockedAch['arsha'] || allunlockedAch['dead']) return;
        if (Math.random() < 0.10) {
          achievementUnlocked('dead');
          var data = getGameData();
          data.cronStone = 0;
          data.magicalStone = 0;
          data.durability = 0;
          setGameData(data);
        } else {
          achievementUnlocked('arsha'); 
        }
      }
      const unlocked = getUnlockedAchievements();
      if (unlocked['celebrate']) {
        createConfetti(true);
      }
    }
  });

  $('body').keypress((e) => {
    if (e.key.toLowerCase() === ',' || e.key.toLowerCase() === '?') {
      const enchantSwal = document.querySelector('.enchant-popup');
      if (enchantSwal && Swal.isVisible()) {
        Swal.close();
      } else {
        tryOpenBdoEnchant();
      }
    }
  });

  $('body').keydown((e) => {
    if (e.key.toLowerCase() === 'r') {
      if (e.altKey) {
        askReset();
      }
    }
  });

  $('body').keypress((e) => {
    if (e.key.toLowerCase() === 's') {
      const unlocked = getUnlockedAchievements();
      if (unlocked['skin']) {
        const skinSwal = document.querySelector('.skin-popup');
        if (skinSwal && Swal.isVisible()) {
          Swal.close();
        } else {
          openSkinSelector();
        }
      }
    }
  });

  $('body').keypress((e) => {
    if (e.key.toLowerCase() === 'p') {
      const unlocked = getUnlockedAchievements();
      if (unlocked['prestigious'] && unlocked['skin']) {
        const prestigeSwal = document.querySelector('.prestige-popup');
        if (prestigeSwal && Swal.isVisible()) {
          Swal.close();
        } else {
          openPrestigeCustomizationPopup();
        }
      }
    }
  });

  $('body').keypress((e) => {
    if (e.key.toLowerCase() === 'o') {
      const achievementSwal = document.querySelector('.achievement-popup');
      if (achievementSwal && Swal.isVisible()) {
        Swal.close();
      } else {
        openAchievementList();
      }
    }
  });

  $('#achievement-tracker').on('click', (event) => {
    const unlocked = getUnlockedAchievements();
    if (event.ctrlKey && unlocked["completed"]) {
      createConfetti();
    } else {
      openAchievementList();
    }
  });

  $('body').on('click', '.ani_div', () => {
    openAchievementList();
  });

  $('body').on('click', '.nerd', () => {
    tryOpenBdoEnchant();
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
        title: isZoomed ? "What do you think of Nova on BDO?" : "An easter egg into an easter egg? Really?",
        width: 500,
        html:
        isZoomed ? "Nova released as a heavy tank class with a giant door shield. But did you know that Nova awakening was so broken that everyone though they were using 'cheat codes'..? Funny isnt it?" :
        '<iframe width="80%" height:"auto" src="https://www.youtube.com/embed/J7BiQPD6qUg?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
      }).then((result) => { openAchievementList(); });
    }
  });

  $(document).on('click', '.achievement-cat', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['cat']) {
      Swal.fire({
        title: isZoomed ? "A funfact about cats" : "An easter egg into an easter egg? Really?",
        width: 500,
        html:
        isZoomed ? "Did you know that according to different cultures cats have 9 or 7 lives..? And by the way, you should try to reach for 7 on some things here..." :
        '<iframe width="80%" height:"auto" src="https://www.youtube.com/embed/pM7KJxz5i00?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
      }).then((result) => { openAchievementList(); });
    }
  });

  $(document).on('click', '.achievement-L', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['L']) {
      Swal.close();

      const playButton = document.querySelector('.play');
      if (playButton) {
        const ctrlClickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
          altKey: true,
          ctrlKey: isZoomed
        });
        ctrlClickEvent.isSecret = true;
        playButton.dispatchEvent(ctrlClickEvent);
      }
    }
  });

  $(document).on('click', '.achievement-prestigious', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['prestigious'] && unlocked['skin']) {
      openPrestigeCustomizationPopup();
    }
  });

  $(document).on('click', '.achievement-edgy', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['edgy']) {
      if (!isZoomed) {
        $('body').empty();
        document.body.background = "https://i.imgur.com/ZngZTjQ.png";
        setTimeout(() => {
          Swal.fire({
            title: 'Warning',
            text: 'Do not click this ever again. And never look at it too closely.',
            icon: 'error',
            confirmButtonText: 'I am sorry'
          }).then(() => location.reload());
        }, 1000);
      } else {
        document.querySelectorAll('*').forEach(el => {
          el.classList.add('glitch-text');
        });
      }
    }
  });

  $(document).on('click', '.achievement-weakened', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['weakened']) {
      if (!isZoomed) {
        $('body').empty();
        document.body.background = "https://i.imgur.com/ZngZTjQ.png";
        setTimeout(() => {
        alert('Do not click this ever again. And never look at it too closely.')
        }, 1000);
        setTimeout(() => {
          location.reload();
        }, 3000);
      } else {
        document.querySelectorAll('*').forEach(el => {
          el.classList.add('glitch-text');
        });
      }
    }
  });

  $(document).on('click', '.achievement-berserk', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['berserk']) {


      if (isZoomed) {
          toggleZoom();
          const container = document.querySelector('.achievement-content');
          container.querySelectorAll('img').forEach(img => {
            img.src = berserkSrc;
          });
          container.querySelectorAll('i').forEach(icon => {
            if (!icon.classList.contains('fa-play')) {
              const img = document.createElement('img');
              img.src = berserkSrc;
              img.style.width = icon.style.width;
              img.style.height = icon.style.height;
              img.classList = icon.classList;
              img.style.minWidth = "60px";
              icon.replaceWith(img);
            }

            container.querySelectorAll(`img[src="${berserkSrc}"]`).forEach(img => {
              const parent = img.closest('.swal-achievement');
              if (parent) {
                  parent.addEventListener('click', event => {
                    event.stopImmediatePropagation();
                    event.preventDefault();  
                    img.remove();

                  const remaining = container.querySelectorAll(`img[src="${berserkSrc}"]`).length;
                  if (remaining === 0) {
                    Swal.update({
                      title: 'Good job!',
                      showCancelButton: false,
                      html: '<div class="glitch-text">The source of evil is now weakened!</div>',
                      icon: 'success',
                      confirmButtonText: "Time to end this!",
                      confirmButtonColor: 'red'
                    });
                    achievementUnlocked('weakened');
                  }
                });
              }
            });
          });
      } else {
        document.querySelectorAll('*').forEach(el => {
          el.classList.add('glitch-text');
        });

        const playButton = document.querySelector('.play')
        if (playButton) {
          playButton.disabled = true;

          setTimeout(() => {
            playButton.disabled = false;
            const ctrlClickEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
              altKey: true
            });
            playButton.dispatchEvent(ctrlClickEvent);
          }, 3000);
        }
      }
    }
  });

  $(document).on('click', '#evil', (event) => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['weakened']) {
      choosePath(event);
    } else {
      if (unlocked['good'] || unlocked['evil']) return;
      event.stopImmediatePropagation();
      event.preventDefault();
      if (!unlocked['edgy']) {
        Swal.fire({
          title: "Fight for your life?",
          text: 'This a very strong opponent. You may need to come equiped.',
          showConfirmButton: true,
          confirmButtonText: 'I have no fear'
        }).then((result) => 
          { 
            const prestigeCount = getPrestigeCount();
            if (unlocked['skin'] || prestigeCount > 0) {
              achievementUnlocked('edgy') 
              Swal.fire({
                title: 'Defeat?',
                text: 'You have not defeated the evil but you may have found a way to weaken it.',
                icon: 'success',
                confirmButtonText: 'Awesome!'
              });
            }
            else {
              Swal.fire({
                title: 'Defeat!',
                text: "You get absolutely blasted, you don't stand a chance...",
                icon: 'error',
                confirmButtonText: 'I will come back later'
              }).then(() => {
                restartGame();
              });
            }
          });
      } else {
        Swal.fire({
          title: "There's no chance",
          text: "You need to weaken evil before trying to fight it, you currently can't win..",
          showConfirmButton: true,
          confirmButtonText: 'Where should I go..'
        })
      }
    }
  });

  $(document).on('click', '.achievement-blind', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['blind']) {
      Swal.fire({
        title: isZoomed ? "Is this a hint ?" : "An easter egg into an easter egg? Really?",
        width: 500,
        html:
        isZoomed ? 'Thanks to your detective skills you understand that you may need to repeat what you did but with more "control" or was it the other one..?' :
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
        text: isZoomed ? "Thanks to your detective skills you understand that you may need to celebrate and that you can use your 'control' on your trophy for that..." : "I mean all of them without talking about the secret ones, right?",
        width: 500,
        confirmButtonText: isZoomed ? 'Celebrate!' : 'If only I had my magnifying glass...',
        confirmButtonColor: isZoomed ? '#B28E00' : ''
      }).then((result) => { 
        if (isZoomed && result.value) {
          createConfetti(); 
          document.body.style.transform = "";
          document.body.style.transformOrigin = "";
          isZoomed = false;
        }
      });
    }
  });

  $(document).on('click', '.achievement-detective', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['detective']) {
      toggleZoom();
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

  $('body').keydown((e) => {
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
	  if ($('.fullscreen').length < 1) {
		  var iframe = document.createElement('iframe');
      var firstSong = 'WRLD';
      var params = '&autoSong=loop&autoSongDelay=3';
      if (e.altKey) {
        firstSong = 'L';
      }
      if (e.ctrlKey && e.altKey) {
        firstSong = 'NOAH';
        params = '&respacks=BerserkImage.zip&firstImage=Berserk&fullAuto=false&autoSong=loop';
        if (e.originalEvent.isSecret) {
          Swal.fire({
            title: 'Is that a boss music?',
            text: 'This is the song that will play during the boss battle, but where\'s the boss? I already saw this big smile somewhere..',
            confirmButtonText: 'Umh okay?',
            icon: 'question',
            allowOutsideClick: false,
            allowEscapeKey: false,
          });
        }
      }
      if (document.body.classList.contains('glitch-text')) {
        iframe.classList.add('glitch-text');
        firstSong = 'NOAH';
        if (e.altKey)
          firstSong = 'Clockmaker'
        else {
          Swal.fire({
            title: 'The boss is here!',
            text: "You can't win in this glitched zone, you better run for your life!",
            confirmButtonText: 'I NEVER RUN',
            cancelButtonColor: 'red',
            cancelButtonText: 'Escape',
            icon: 'warning',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true
          }).then(result => {
            if (result.isConfirmed) {
              startBoss('impossible');
            } else if (result.isDismissed) {
              location.reload();
            }
          });
        }
        params = '&respacks=BerserkImage.zip&firstImage=Berserk&fullAuto=false&autoSong=loop';
        achievementUnlocked('berserk');
      }
  
      if (firstSong == 'L')
        achievementUnlocked('L');
      
      iframe.src = `./0x40/?song=${firstSong}${params}`;
		  iframe.classList.add('fullscreen');
		  $('body').prepend(iframe)
		  $('.play').html($('.play').html().replace('fa-play', 'fa-stop').replace('Play', 'Stop'))
		  $('#footer').addClass('hidden');
      $('#achievement-tracker').css('bottom', '10px');
		  var hideButton = $('.play').clone();
		  hideButton.html(hideButton.html().replace('fa-stop', 'fa-eye-slash').replace('Stop', 'Hide Interface'))
		  hideButton.removeClass('play')
      hideButton.removeClass('hover')
      hideButton.removeClass('rasberry-dropshadow')
		  hideButton.addClass('hideInterface')
      $('#achievement-tracker').css('opacity', '0.8')
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
      $('.fullscreen').remove();
      $('.hideInterface').remove();
      $('.play').html($('.play').html().replace('fa-stop', 'fa-play').replace('Stop', 'Play'))
      $('#footer').removeClass('hidden');
      $('#achievement-tracker').css('bottom', '100px');
      $('.player').css('opacity', '1')
      $('#achievement-tracker').css('opacity', '1')
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
  
  $('.discord').on('click', function(e) {
    openDiscordPopup();
  });
});



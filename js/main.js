(function() {
const achievementData = {
  "detective": {
    icon: "fa fa-magnifying-glass",
    title: "Detective Andy",
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
    icon: "fa-solid fa-spider",
    title: "Darkness",
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
  },
  'crow': {
    secret: true,
    icon: "fa-solid fa-crow",
    title: "Ultra Instinct Crow",
    text: "You captured the strongest crow.",
    rarity: "UltraAchievement",
  },
  'cheater': {
    secret: true,
    icon: "fa-solid fa-terminal",
    title: "Cheater",
    text: "There's no way to get to this point without cheating.. right?",
    rarity: "SupremeAchievement",
  },
  '???': {
    secret: true,
    icon: "fa-solid fa-crow",
    title: "Roka",
    text: " ??????? ???? ??? ?????? ?? ??? ????? ???",
    rarity: "???Achievement",
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
  'PrestigeAchievement': 8,
  'UltraAchievement': 9,
  'SupremeAchievement': 10,
  '???Achievement': 99
};

const rarityColors = {
  CommonAchievement: '#9e9e9e',
  UncommonAchievement: '#4caf50',  
  RareAchievement: '#2196f3',
  EpicAchievement: '#9c27b0',
  LegendaryAchievement: '#ffb84e',
  MythicAchievement: '#ff4500',
  SecretAchievement: '#ff69b4',
  PrestigeAchievement: 'white',
  UltraAchievement: '#4B7AF2',
  SupremeAchievement: '#74b9ff',
  "???Achievement": '#990099'
};

const rarityToSkin = {
  'CommonAchievement': 'bronze',
  'UncommonAchievement': 'bronze',
  'RareAchievement': 'silver',
  'EpicAchievement': 'silver',
  'LegendaryAchievement': 'gold',
  'MythicAchievement': 'mythic',
  'SecretAchievement': 'secret',
  'PrestigeAchievement': 'prestige',
  'UltraAchievement': 'ultra',
  'SupremeAchievement': 'supreme',
  '???Achievement': '???'
};

const crowRarity = {
  'normal': 1,
  'bronze': 2,
  'silver': 5,
  'gold': 10,
  'mythic': 20,
  'secret': 50,
  'ultra': 100,
  'supreme' : 200,
  'divine' : 500,
  'transcendent': 1000,
  'ascended': 2500,
  'eternal': 5000,
  'godslayer': 10000,
  '???': 99999
}

function getCurrentRarity() {
  const total = getCapturedCrow();
  if (total >= 100) return 'PrestigeAchievement';
  if (total >= 50) return 'MythicAchievement';
  if (total >= 20) return 'LegendaryAchievement';
  if (total >= 10) return 'EpicAchievement';
  if (total >= 6) return 'RareAchievement';
  if (total >= 3) return 'UncommonAchievement';
  return 'CommonAchievement';
}

const defaultGameData = {
  viewedAchievements: {},
  customPrestige: null,
  achievementTrackerSkin: 'bronze',
  achievements: {},
  prestigeCount: 0,
  cronStone: 0,
  failstack: 150,
  durability: 200,
  magicalStone: 0,
  primordialStone: 0,
  capturedGlitch: 0,
  crow: 0,
  blackstar: 0,
  sovereign: {
    level: 0,
    durability: 200,
    failstack: 50,
  }
};

const SOVEREIGN_FAILSTACKS = [20, 30, 50, 75, 100, 150, 175, 200, 250, 300]
const SOVEREIGN_CRONS = [0, 320, 560, 780, 970, 1350, 1550, 2250, 2760, 3920]
const SOVEREIGN_BASE_CHANCE = [8.55, 4.12, 2, 0.91, 0.469, 0.273, 0.16, 0.1075, 0.04845, 0.0242]
const SOVEREIGN_INCREASE = [0.855, 0.412, 0.2, 0.091, 0.047, 0.027, 0.016, 0.0105, 0.00455, 0.0018]
const SOVEREIGN_LEVELS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const ENCHANT_TO_DEC = {
  'I': 'PRI',
  'II': 'DUO',
  'III': 'TRI',
  'IV': 'TET',
  'V': 'PEN',
  'VI': 'HEX',
  'VII': 'SEP',
  'VIII': 'OCT',
  'IX': 'NOV',
  'X': 'DEC'
};

const MAGIC_NUMBER = 7;
const CELEBRATION_MAX = 77;
const STEAM_POPUP_TIMEOUT = 5950;
const STORAGE_KEY = 'easterEggs';

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

let lastMousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

let celebrationCount = 0;

let isZoomed = false;

let currentZoom = 1;

let inputBuffer = [];

let ultraInstinctBlocked = false;

const crowDialogues = ["OMG", "EZ", "LOL", "OUTPLAYED!", "EZ TRASH NOOB", "GGEZ", "BOT?", "COOP VS IA??", "XDDDD"];
const crowDialoguesCry = ["WAIT?", "WTF?", "CHEAT?", "STOP!", "PLEASE STOP", "SORRY", "IT WAS A JOKE", "I BEG YOU", "WE ARE SORRY"];

let dialoguePool = [];

const berserkSrc = './images/berserk.png';
const axeUrl = "./images/blackstar_axe.png";
const sovereignAxeUrl = "./images/sovereign_axe.png";
const cronUrl = "./images/cron.png";
const magicalStoneUrl = "./images/magical_stone.png";
const primordialStoneUrl = "./images/primordial_stone.png";
const memoryFragmentUrl = "./images/memory_fragment.png";
const healthPotionUrl = "./images/health_potion.png";
const valkUrl = "./images/valk.png";

const followerCrows = [];

const DEFAULT_PRESTIGE_SKIN = { animation: 'prestigeGlow', color: '#0069FD' }

const crowHowlAudio = new Audio('./sounds/crow.wav');
crowHowlAudio.volume = 0.3;

function getWeaponImage(gameData, showSovereign = false, isEnchanting = false) {
  const penBs = gameData.achievements['rng'] && !isEnchanting;
  const sovereign = (gameData.blackstar ?? 0) >= 2 && showSovereign;
  const imgUrl = sovereign ? sovereignAxeUrl : axeUrl;
  const enchantLevel = sovereign ? (SOVEREIGN_LEVELS[gameData?.sovereign?.level ?? 0]) : (penBs ? 'V' : 'IV'); 
  const altText = sovereign ? `${enchantLevel} Sovereign Axe` : `${enchantLevel} Blackstar Axe`;
  return `<span class="relative">
            <img src="${imgUrl}" width="60" alt="${altText}">
            ${enchantLevel != '' ? `<span class="enhance-level text-lg">${enchantLevel}</span>` : ''}
          </span>`
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getNextDialogue(alternative = false) {
  dialogues = alternative ? crowDialoguesCry : crowDialogues;
  if (dialoguePool.length === 0) {
    dialoguePool = dialogues.map((_, i) => i);
    shuffleArray(dialoguePool);
  }
  return dialogues[dialoguePool.pop()];
}

function toBase64(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode('0x' + p1)
  ));
}
function fromBase64(str) {
  return decodeURIComponent(Array.prototype.map.call(atob(str), c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));
}

function setGameData(data) {
  const json = JSON.stringify(data);
  const encoded = toBase64(json);
  localStorage.setItem(STORAGE_KEY, encoded);
}

function getGameData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { ...defaultGameData };
  try {
    const json = fromBase64(raw);
    return JSON.parse(json);
  } catch {
    try {
      const data = JSON.parse(raw);
      setGameData(data);
      return data;
    } catch {
      return { ...defaultGameData };
    }
  }
}

function teleportCrowGlitch(crow, wrapper, speed = 1) {
  if (crow.parentNode !== document.body) {
    document.body.appendChild(crow);
  }
  crow.style.position = 'fixed';

  requestAnimationFrame(() => {
    function jump() {
      const crowWidth = crow.offsetWidth || 40;
      const crowHeight = crow.offsetHeight || 40;
      const margin = 10;
      const minX = margin;
      const minY = margin;
      const maxX = window.innerWidth - crowWidth - margin;
      const maxY = window.innerHeight - crowHeight - margin;

      const x = minX + Math.random() * (maxX - minX);
      const y = minY + Math.random() * (maxY - minY);

      crow.style.left = x + 'px';
      crow.style.top = y + 'px';
      crow.style.transition = 'none';
      crow.style.transform = `scale(1.2) rotate(${Math.random() * 360}deg)`;
      setTimeout(() => {
        crow.style.transform = `scale(1) rotate(${Math.random() * 360}deg)`;
      }, speed >= 10 ? 0 : 80);
      if (speed >= 10) {
        requestAnimationFrame(jump)
      }
      else {
        setTimeout(jump, (120 + Math.random() * 120) / speed);
      }
    }
    if (speed > 10) {
      requestAnimationFrame(jump);
    }
    else {
      jump();
    }
  });
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
      if ((rarityOrder[rarity] >= 8) && (!unlocked['skin'] || !unlocked['prestigious'])) {
        continue;
      }
      const level = Math.min(rarityOrder[rarity], 8) || 1;
      if (level > highestRarityLevel) {
        highestRarityLevel = level;
        highestRarity = rarity;
      }
    }
  }

  return rarityToSkin[highestRarity] || 'bronze';
}

function increasePrimordialStone(countToAdd = 1) {
  const data = getGameData();  
  data.sovereign ??= {}
  var primordialStoneCount = data.sovereign.primordialStone ?? 0;
  data.sovereign.primordialStone = primordialStoneCount + countToAdd;
  setGameData(data);
}

function getCapturedCrow() {
  return getGameData().crow || 0;
}

function increaseCapturedCrow(countToAdd = 1) {
  var count = getCapturedCrow();
  const unlocked = getUnlockedAchievements();
  increasePrimordialStone(unlocked['arsha'] ? countToAdd * 2 : countToAdd);
  setCapturedCrow(count + countToAdd);
  updateCrowIcons();
}

function setCapturedCrow(count) {
  const data = getGameData();
  data.crow = count;
  setGameData(data);
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
    location.reload();
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

  let saved = DEFAULT_PRESTIGE_SKIN;
  try {
    const savedPrestige = getGameData().customPrestige;
    if (savedPrestige && savedPrestige.animation && savedPrestige.color) {
      saved = savedPrestige;
    }
  } catch {}

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

function unZoom() {
    if (isZoomed) {
    toggleZoom();
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
  unZoom();
  const unlockedAchievements = getUnlockedAchievements();

  const skins = [
    { value: 'bronze', label: 'Bronze', iconClass: 'fa fa-trophy bronze' },
    { value: 'silver', label: 'Silver', iconClass: 'fa fa-trophy silver' },
    { value: 'gold', label: 'Gold', iconClass: 'fa fa-trophy gold' },
    { value: 'mythic', label: 'Mythic', iconClass: 'fa fa-trophy mythic' },
  ];

  const rareTiers = [
    { rarity: 'SecretAchievement', value: 'secret', label: 'Secret' },
    { rarity: 'UltraAchievement', value: 'ultra', label: 'Ultra' },
    { rarity: 'SupremeAchievement', value: 'supreme', label: 'Supreme' },
  ];

  rareTiers.forEach(({ rarity, value, label }) => {
    const hasThisRarity = Object.entries(unlockedAchievements).some(
      ([id, unlocked]) => unlocked && achievementData[id]?.rarity === rarity
    );
    if (hasThisRarity) {
      skins.push({ value, label, iconClass: `fa fa-trophy ${value}` });
    }
  });


  if (getUnlockedAchievements()['prestigious']) {
    skins.push({ value: 'prestige', label: 'Prestige', iconClass: 'fa fa-trophy prestige' });
  }

  const savedSkin = getGameData().achievementTrackerSkin || 'bronze';
  let prestigeSettings = DEFAULT_PRESTIGE_SKIN;
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
  unZoom();
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
  let defaultColor = DEFAULT_PRESTIGE_SKIN.color;
  let defaultAnimation = DEFAULT_PRESTIGE_SKIN.animation;

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

function decomposeCrowsLimited(total, maxIcons = 10) {
  let remaining = total;
  const result = [];

  const rarities = Object.entries(crowRarity).sort((a,b) => b[1] - a[1]);

  for (const [rarity, value] of rarities) {
    if (remaining >= value) {
      const maxCount = maxIcons - result.reduce((acc, cur) => acc + cur.count, 0);
      if(maxCount <= 0) break;

      const count = Math.min(Math.floor(remaining / value), maxCount);
      if(count > 0) {
        remaining -= count * value;
        result.push({ rarity, count, value });
      }
    }
  }

  return { decomposition: result, remainder: remaining };
}

function startBossMusic(pathChoosen) {
  const playButton = document.querySelector('.play');
  if (playButton) {
    const ctrlClickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    ctrlClickEvent.pathChoosen = pathChoosen;
    if ($('.fullscreen').length > 0) {
      playButton.dispatchEvent(ctrlClickEvent);
    }
    playButton.dispatchEvent(ctrlClickEvent);
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

  startBossMusic(pathChoosen);

  if ($('.mainblock').is(":visible")) {
    $('.hideInterface').html($('.hideInterface').html().replace('Hide', 'Show').replace('fa-eye-slash', 'fa-eye'));
    $('.mainblock').hide();
  } else {
    $('.hideInterface').html($('.hideInterface').html().replace('Show', 'Hide').replace('fa-eye', 'fa-eye-slash'));
    $('.mainblock').show();
  }

  if (pathChoosen == 'crow') {
    $('#crow-perch').removeClass('hidden');
  }

  setTimeout(function () {
    bossBattle(pathChoosen);  
  }, pathChoosen == 'impossible' ? 0 : 2000);

}

function bossBattle(pathChoosen) {
  let bossHP = 100;
  let playerHP = 100;
  let canAttack = true;
  let BossesAttackInterval;

  const data = getGameData();

  const unlocked = getUnlockedAchievements();
  const penBs = unlocked['rng'];

  Swal.fire({
    title: pathChoosen === 'crow' ? 'A swift crow challenges you!' : 'A giant berserk smile attacks!',
    width: 600,
    background: '#111',
    color: '#fff',
      customClass: {
        popup: 'boss-popup',
        title: 'boss-title',
        content: 'boss-content',
      },
    html: `
      <div style="margin-top: 15px; text-align: center;">

        ${pathChoosen === 'crow' ? `
          <div style="font-size: 100px; color: black; margin: 10px 0;">
            <i class="fas fa-crow ultra-instinct" style="color: black" title="Ultra Instinct Crow"></i>
          </div>
          <div id="boss-label" style="color: #888;">The crow dodges all your attacks!</div>
        ` : ''}

        <div id="player-hp-label">Your HP: 100%</div>
        <div style="background: #333; border-radius: 8px; overflow: hidden; height: 20px; margin: 5px 0;">
          <div id="player-hp-bar" style="background: limegreen; width: 100%; height: 100%; transition: width 0.3s;"></div>
        </div>
        
        <div id="boss-hp-label">Boss HP: 100%</div>
        <div style="background: #333; border-radius: 8px; overflow: hidden; height: 20px; margin: 5px 0;">
          <div id="boss-hp-bar" style="background: red; width: 100%; height: 100%; transition: width 0.3s;"></div>
        </div>

        <!-- Weapon display and attack button -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 10px;">
          <button id="attack-btn" style="padding: 6px 12px; background: crimson; color: white; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
            ${getWeaponImage(getGameData(), true)}
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
      const hpLabel = document.getElementById('boss-hp-label');
      const bossLabel = document.getElementById('boss-label');
      const hpBar = document.getElementById('boss-hp-bar');

      const playerHpBar = document.getElementById('player-hp-bar');
      const playerHpLabel = document.getElementById('player-hp-label');

      attackBtn.addEventListener('click', () => {
        if (!canAttack) return;

        canAttack = false;
        attackBtn.disabled = true;
        const beforeAttack = attackBtn.innerHTML;
        attackBtn.innerHTML = attackBtn.innerHTML.replace('Attack!', 'Attacking...');

        let dmg = Math.floor(Math.random() * 5 + 3);

        const sovereign = (data.blackstar ?? 0) >= 2;
        const enchantLevel = sovereign ? (SOVEREIGN_LEVELS[data?.sovereign?.level ?? 0]) : (penBs ? 'V' : 'IV'); 

        let dmgMulti = (sovereign ? Math.max(Object.values(ENCHANT_TO_DEC).indexOf(ENCHANT_TO_DEC[enchantLevel]), 2) : (penBs ? 2 : 1));
        dmg *= dmgMulti;

        if (pathChoosen == 'crow') dmg = Math.floor(dmg / 10);

        if (pathChoosen === 'crow') {
          if (data?.sovereign?.level >= MAGIC_NUMBER) {
            showCrowDialogueOnPerch(true);
            bossLabel.innerText = 'The crow does not dodge your attack!';

          }
          else {
            showCrowDialogueOnPerch();
            bossLabel.innerText = 'The crow swiftly dodges your attack!';
            dmg = 0;
          }
        }

        bossHP = Math.max(0, bossHP - dmg);
        if (hpBar) hpBar.style.width = `${bossHP}%`;
        hpLabel.innerText = `Boss HP: ${bossHP}%`;

        if (bossHP <= 0) {
          stopBossMusic();
          clearInterval(BossesAttackInterval);
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
              }, 1000);
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

        const beforeHeal = healBtn.innerHTML;

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

      BossesAttackInterval = setInterval(() => {
        let dmg = Math.floor(Math.random() * 10 + 5);
        if (pathChoosen == 'crow') dmg = Math.floor(Math.random() * 2 + 5);
        if (pathChoosen == 'impossible') dmg = 9999;
        playerHP = Math.max(0, playerHP - dmg);
        playerHpBar.style.width = `${playerHP}%`;
        playerHpLabel.innerText = `Your HP: ${playerHP}%`;

        if (playerHP <= 0) {
          stopBossMusic();
          clearInterval(BossesAttackInterval);
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
            if (pathChoosen === 'impossible') {
              location.reload();
            } else if (result.isConfirmed) {
              startBoss(pathChoosen);
            }
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
    var gameData = getGameData();
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

    if (id == '???' ) {
      if (document.getElementsByClassName('freed').length > 0) {
        return '';
      }
      if (gameData.capturedGlitch >= 1) {
        data.title = 'Hyperactive Crow';
        data.text = `You freed the poor crow, only to capture it again (A total of ${gameData.capturedGlitch} times). <div class='flex glitch-text'>The crow will remember this.</div>`;
      }
      else {
        data.title = '???';
        data.text = `<div class='glitch-text'>${data.text}</div>`;
      }
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
      unZoom();
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

function showCatHint() {
  if (document.querySelector('.cat-hint')) return;

  const hint = document.createElement('div');
  hint.textContent = 'Quick! The cat will help you!';
  hint.className = 'cat-hint';
  document.body.appendChild(hint);

  const cat = document.querySelector('.github-cat');
  const rect = cat.getBoundingClientRect();
  hint.style.position = 'fixed';
  hint.style.right = `10px`;
  hint.style.top = `80px`;
}

function removeCatHint() {
  document.querySelector('.cat-hint')?.remove();
}

function spawnFollowerCrow() {
  showCatHint();

  const wrapper = document.createElement('span');
  wrapper.className = 'crow-wrapper';

  const crow = document.createElement('i');
  crow.className = 'fas fa-crow follower-crow';

  wrapper.appendChild(crow);
  document.body.appendChild(wrapper);

  const offsetX = Math.floor(Math.random() * 100 - 50);
  const offsetY = Math.floor(Math.random() * 100 - 50);

  const entrySides = ['top', 'bottom', 'left', 'right'];
  const side = entrySides[Math.floor(Math.random() * entrySides.length)];

  let startX, startY;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  switch (side) {
    case 'top':
      startX = Math.random() * screenWidth;
      startY = -100;
      break;
    case 'bottom':
      startX = Math.random() * screenWidth;
      startY = screenHeight + 100;
      break;
    case 'left':
      startX = -100;
      startY = Math.random() * screenHeight;
      break;
    case 'right':
      startX = screenWidth + 100;
      startY = Math.random() * screenHeight;
      break;
  }

  wrapper.style.transform = `translate(${startX}px, ${startY}px)`;

  followerCrows.push({
    el: wrapper,
    x: startX,
    y: startY,
    offsetX,
    offsetY
  });

  startHowling(wrapper);
}

function startHowling(element, interval = 1000) {
  const crowSound = 0.8 + Math.random() * 0.4;

  element._howlInterval = setInterval(() => {
    if (!document.body.contains(element)) {
      clearInterval(element._howlInterval);
      element._howlInterval = null;
      return;
    }

    const crowOffset = Math.random() * 1000;
    setTimeout(() => {
      playCrowHowl(crowSound);
    }, crowOffset);
  }, interval);
}

function playCrowHowl(playbackRate = null) {
  const audioClone = crowHowlAudio.cloneNode();
  audioClone.playbackRate = playbackRate || (0.8 + Math.random() * 0.4);
  audioClone.play();
}

let startTime = performance.now();

function animateFollowers() {
  const now = performance.now();
  const elapsed = (now - startTime) / 1000;

  followerCrows.forEach((crow, i) => {
    if (crow.absorbed) return;
    const radius = 50 + crow.offsetX;
    const speed = 1 + (crow.offsetY / 100);
    const angle = speed * elapsed + i * (Math.PI * 2 / followerCrows.length);

    const targetX = lastMousePos.x + radius * Math.cos(angle);
    const targetY = lastMousePos.y + radius * Math.sin(angle);

    const dx = targetX - crow.x;
    const dy = targetY - crow.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const lerpSpeed = 0.1;

    if (dist > 1) {
      const moveDist = Math.min(dist, 5);
      crow.x += (dx / dist) * moveDist;
      crow.y += (dy / dist) * moveDist;
    }

    const flip = (crow.x > lastMousePos.x) ? -1 : 1;

    crow.el.style.transform = `translate(${crow.x}px, ${crow.y}px) scaleX(${flip})`;
  });

  requestAnimationFrame(animateFollowers);
}

function getSafeDodge(crow, currentLeft, currentTop) {
  const rect = crow.getBoundingClientRect();
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  let dodgeX = (Math.random() < 0.5 ? -1 : 1) * (40 + Math.random() * 7);
  let dodgeY = (Math.random() < 0.5 ? -1 : 1) * (80 + Math.random() * 4);

  let newLeft = currentLeft + dodgeX;
  let newTop = currentTop + dodgeY;

  const margin = 5;

  if (newLeft < margin) {
    dodgeX = margin - currentLeft;
  } else if (newLeft + rect.width > screenWidth - margin) {
    dodgeX = screenWidth - margin - rect.width - currentLeft;
  }

  if (newTop < margin) {
    dodgeY = margin - currentTop;
  } else if (newTop + rect.height > screenHeight - margin) {
    dodgeY = screenHeight - margin - rect.height - currentTop;
  }

  return { dodgeX, dodgeY };
}

function ultraInstinctCrow(crow, stay = false) {
  if (!crow._ultra) {
    crow._ultra = {
      remaining: 12,
      totalEsquives: 0,
      timeoutId: null,
      animating: false,
      invincible: false
    };
  }

  if (crow._ultra.invincible) {
    return;
  }

  if (crow._ultra.remaining <= 0) {
    startBoss('crow');
    if (!stay) crow.remove();
    return;
  }

  crow._ultra.invincible = true;

  showCrowDialogueOnPerch(stay);

  crow.classList.add('ultra-instinct');

  if (crow._ultra.timeoutId) {
    clearTimeout(crow._ultra.timeoutId);
    crow._ultra.timeoutId = null;
  }

  const esquiveIndex = crow._ultra.totalEsquives;
  if (esquiveIndex < 12) {
    const audio = new Audio(`./sounds/ultra-${esquiveIndex}.wav`);
    audio.play().catch(() => {});
  }

  crow._ultra.remaining--;

  if (crow._ultra.remaining <= 0) {
    startBoss('crow');
    if (!stay) crow.remove();
    return;
  }

  crow._ultra.totalEsquives++;

  if (stay) {
    crow._ultra.invincible = false; 
    return; 
  }
  crow._ultra.animating = true;

  const crowRect = crow.getBoundingClientRect();
  const currentLeft = crowRect.left;
  const currentTop = crowRect.top;

  crow.style.animation = 'none';
  crow.style.transition = 'none';

  crow.style.position = 'fixed';
  crow.style.left = `${currentLeft}px`;
  crow.style.top = `${currentTop}px`;
  crow.style.transform = 'none';

  crow.offsetHeight;

  const { dodgeX, dodgeY } = getSafeDodge(crow, currentLeft, currentTop);

  crow.style.transition = 'transform 40ms ease-out';
  crow.style.transform = `translate(${dodgeX}px, ${dodgeY}px)`;

  setTimeout(() => {
    crow._ultra.invincible = false;
  }, 200);

  setTimeout(() => {
    crow._ultra.animating = false;
    crow.style.transition = 'none';
    crow.style.transform = 'none';

    const newLeft = currentLeft + dodgeX;
    const newTop = currentTop + dodgeY;

    crow.style.left = `${newLeft}px`;
    crow.style.top = `${newTop}px`;

    crow._ultra.timeoutId = setTimeout(() => {
      crow._ultra.timeoutId = null;
      if (crow._ultra.animating) return;
      restartFlyAcrossFromPosition(crow, newLeft, newTop);
    }, 2000);
  }, 200);
}

function restartFlyAcrossFromPosition(crow, startLeft, startTop) {
  const endLeft = window.innerWidth * 1.1;
  const distance = endLeft - startLeft;
  const speed = 300;
  const duration = distance / speed * 1000;

  const animationId = `fly-across-from-${startLeft.toFixed(0)}-${Date.now()}`;

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes ${animationId} {
      0% { left: ${startLeft}px; }
      100% { left: ${endLeft}px; }
    }
  `;
  document.head.appendChild(style);

  crow.style.position = 'fixed';
  crow.style.top = `${startTop}px`;

  crow.style.animation = `${animationId} ${duration}ms linear forwards, flap 0.6s ease-in-out infinite`;
}

function spawnCrow() {
  const crow = document.createElement('i');
  crow.className = 'fas fa-crow';

  const maxY = window.innerHeight * 0.8;
  const minY = window.innerHeight * 0.1;
  const randomTop = Math.floor(minY + Math.random() * (maxY - minY));
  crow.style.position = 'fixed';
  crow.style.left = '-100px';
  crow.style.top = `${randomTop}px`;
  crow.style.fontSize = '40px';
  crow.style.color = 'black';
  crow.style.zIndex = 9999;
  crow.style.cursor = 'pointer';

  document.body.appendChild(crow);
  requestAnimationFrame(() => {
    crow.classList.add('crow');
  });

  crow.addEventListener('click', () => {
    if (crow.classList.contains('ultra-instinct')) {
      ultraInstinctCrow(crow);
      return;
    }
    if (crow.classList.contains('captured')) return;
    const capturedCrowIcons = document.querySelectorAll('#crow-perch .crow-icon');
    const unlocked = getUnlockedAchievements();
    if (!unlocked['crow']) {
      if (!ultraInstinctBlocked && (capturedCrowIcons.length > 3 && Math.random() < 0.30) && !document.querySelector('.ultra-instinct')) {
        ultraInstinctBlocked = true;
        ultraInstinctCrow(crow);
        return;
      }
    }
    crow.classList.add('captured');

    crow.removeEventListener('animationend', removeIfNotClicked);

    const perch = document.getElementById('crow-perch');
    if (!perch) return;

    const crowX = lastMousePos.x;
    const crowY = lastMousePos.y;

    const perchRect = perch.getBoundingClientRect();
    const targetX = perchRect.left + perchRect.width / 2;
    const targetY = perchRect.top + perchRect.height / 2;

    const deltaX = targetX - crowX;
    const deltaY = targetY - crowY;

    crow.style.position = 'fixed';
    crow.style.left = `${crowX}px`;
    crow.style.top = `${crowY}px`;
    crow.style.transform = 'none';
    crow.style.transition = 'none';

    crow.offsetHeight;

    crow.style.transition = 'transform 2s ease-in-out';
    crow.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    playCrowHowl();
    
    if (Math.random() < 0.20 && followerCrows.length == 0) {
      const count = 5 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) spawnFollowerCrow(i);
    }

    crow.addEventListener('transitionend', () => {
      increaseCapturedCrow(1);
      ultraInstinctBlocked = false;
      crow.remove();
    }, { once: true });
  });

  function removeIfNotClicked() {
  if (crow.classList.contains('ultra-instinct')) {
    ultraInstinctBlocked = true;
  }
    crow.remove();
  }

  crow.addEventListener('animationend', removeIfNotClicked);
}

function randomSpawnLoop(firstSkipped = false) {
  if (document.visibilityState === 'visible') {
    const bossSwall = document.querySelector('.boss-popup');
    if (!bossSwall) {
      if (firstSkipped) {
        const random = Math.random();

        if (random < 0.25) {
          showSwarmWarning();
          setTimeout(() => {
            spawnCrowSwarm();
          }, 5000);
        } else {
          spawnCrow();
        }
      }
    }
  }

  const delay = 30000 + Math.random() * 90000;
  setTimeout(() => randomSpawnLoop(true), delay);
}

function spawnCrowSwarm() {
  const numberOfCrows = 10 + Math.floor(Math.random() * 10);
  for (let i = 0; i < numberOfCrows; i++) {
    setTimeout(() => spawnCrow(), i * 100);
  }
}

function showSwarmWarning() {
  const warning = document.createElement('div');
  warning.textContent = 'A SWARM OF CROWS IS APPROACHING!';
  warning.style.position = 'fixed';
  warning.style.bottom = '120px';
  warning.style.left = '50%';
  warning.style.transform = 'translateX(-50%)';
  warning.style.padding = '12px 24px';
  warning.style.background = 'rgba(0,0,0,0.85)';
  warning.style.color = 'white';
  warning.style.fontSize = '20px';
  warning.style.fontWeight = 'bold';
  warning.style.zIndex = 9999;
  warning.style.border = '2px solid white';
  warning.style.borderRadius = '8px';
  warning.style.boxShadow = '0 0 10px white';

  document.body.appendChild(warning);

  setTimeout(() => warning.remove(), 5000);
}

function absorbCrowsIntoCat() {
  removeCatHint();
  const cat = document.querySelector('.octo-body');
  const rect = cat.getBoundingClientRect();
  const targetX = rect.left + rect.width / 3;
  const targetY = rect.top + rect.height / 3;

  followerCrows.forEach((crow, i) => {
    setTimeout(() => {
      crow.el.style.transition = 'transform 2s ease-in';
      crow.el.style.transform = `translate(${targetX}px, ${targetY}px) scale(0.4) rotate(${Math.random() * 360}deg)`;
    }, i * 50);

    if (crow.el._howlInterval) {
      clearInterval(crow.el._howlInterval);
      crow.el._howlInterval = null;
    }
    crow.absorbed = true;
  });

  setTimeout(() => {
    increaseCapturedCrow(followerCrows.length);
    followerCrows.forEach(c => c.el.remove());
    followerCrows.length = 0;
  }, 2300);
}

function prestige() {
  let unlockedAchievements = getUnlockedAchievements();
  const filteredAchievements = {};
  for (const key in unlockedAchievements) {
    if (achievementData[key]) {
      if (rarityOrder[achievementData[key]?.rarity] >= 8)  {
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

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function showCrowDialogueOnPerch(alternative = false) {
  const capturedCrowIcons = document.querySelectorAll('#crow-perch .crow-icon:not(.ultra-instinct)');
  if (capturedCrowIcons.length === 0) return;

  const crowIcon = capturedCrowIcons[Math.floor(Math.random() * capturedCrowIcons.length)];
  var phrase = getNextDialogue(alternative);

  const bubble = document.createElement('div');
  bubble.className = 'crow-dialogue-bubble';

  if (crowIcon.classList.contains("???")) {
    bubble.classList.add('glitch-text');
    phrase = "???";
  }

  bubble.textContent = phrase;

  const rect = crowIcon.getBoundingClientRect();
  const padding = 10;
  const bubbleWidth = phrase.length > 5 ? 160 : 120; 
  const bubbleHeight = 32;

  const headRatio = 0.65;
  let left = rect.left + rect.width * headRatio - bubbleWidth / 2;
  let top = rect.top - bubbleHeight - 10;

  left = Math.max(padding, Math.min(left, window.innerWidth - bubbleWidth - padding));
  top = Math.max(padding, top);

  bubble.style.position = 'fixed';
  bubble.style.left = `${left}px`;
  bubble.style.top = `${top}px`;
  bubble.style.width = `${bubbleWidth}px`;
  bubble.style.height = `${bubbleHeight}px`;
  bubble.style.lineHeight = `${bubbleHeight}px`;
  bubble.style.textAlign = 'center';
  bubble.style.padding = '0 10px';
  bubble.style.borderRadius = '15px';
  bubble.style.boxShadow = '0 0 6px rgba(0,0,0,0.5)';
  bubble.style.fontWeight = 'bold';
  bubble.style.fontSize = '16px';
  bubble.style.color = 'white';
  bubble.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  bubble.style.pointerEvents = 'none';
  bubble.style.opacity = '1';
  bubble.style.transition = 'opacity 0.5s ease';
  bubble.style.zIndex = '10000';
  bubble.style.overflow = 'visible';
  bubble.style.userSelect = 'none';

  // Calcul position flèche dans la bulle (distance en px depuis le bord gauche de la bulle)
  const crowHeadX = rect.left + rect.width * headRatio;
  const arrowLeft = crowHeadX - left;

  // Clamp de la flèche pour ne pas sortir de la bulle
  const maxArrowLeft = bubbleWidth - 10; // marge droite
  const clampedArrowLeft = Math.min(Math.max(arrowLeft, 10), maxArrowLeft);

  bubble.style.setProperty('--arrow-left', `${clampedArrowLeft}px`);

  document.body.appendChild(bubble);

  setTimeout(() => {
    bubble.style.opacity = '0';
    setTimeout(() => bubble.remove(), 500);
  }, 1500);
}

function updateCrowIcons() {
  const unlocked = getUnlockedAchievements();
  ensureCrowPerchContainer();

  const perch = document.getElementById('crow-perch');
  const totalCaptured = getCapturedCrow();
  perch.innerHTML = '';

  const { decomposition, remainder } = decomposeCrowsLimited(totalCaptured, 5);

  for (const {rarity, count, value} of decomposition) {
    const skinClass = rarity;

    for (let i = 0; i < count; i++) {
      const divCrow = document.createElement('div');
      const icon = document.createElement('i');
      icon.className = `fas fa-crow crow-icon ${skinClass}`;
      icon.title = `${capitalizeFirstLetter(rarity)} crow with a value of ${value} crow${value !== 1 ? 's' : ''}. Total captured: ${totalCaptured}`;      
      icon.addEventListener('click', () => {
        if (skinClass == "???") {
          divCrow.classList.add("glitch-text")
          achievementUnlocked('???');
          for (let i = 0; i < MAGIC_NUMBER; i++) {
            setTimeout(() => {
              playCrowHowl(2 + Math.random() * 10);
            }, Math.random() * 100);
          }
        } else {
          playCrowHowl();
        }
      });
      if (skinClass == "???") {
        divCrow.classList.add("glitch-text")
      }
      divCrow.append(icon)
      perch.appendChild(divCrow);
    }
  }
  if (unlocked['crow'])  {
    const icon = document.createElement('i');
    icon.className = `fas fa-crow crow-icon ultra-instinct`;
    icon.title = `Ultra Instinct crow. Total captured: ${totalCaptured}`;      
    icon.addEventListener('click', () => {
      ultraInstinctCrow(icon, true);
    });
    perch.appendChild(icon);
  }
}

function ensureCrowPerchContainer() {
  if (!document.getElementById('crow-perch')) {
    const perch = document.createElement('div');
    perch.id = 'crow-perch';
    perch.classList.add('skin-option');
    document.body.appendChild(perch);
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
  game.sovereign ??= {}

  var durability = (game.durability ?? 200);
  var sovereignDurability = (game.sovereign.durability ?? 200)

  const unlocked = getUnlockedAchievements();

  game.durability = Math.min(durability + (unlocked['arsha'] ? 10 : 5), 200);
  game.sovereign.durability = Math.min(sovereignDurability + (unlocked['arsha'] ? 2 : 1), 200);
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

function startBossOrSong(mode) {
  const unlocked = getUnlockedAchievements();
  if (unlocked[mode]) {
    Swal.close();
    if (isZoomed) {
      startBossMusic(mode);
    }
    else {
      startBoss(mode);
    }
  }
}

function changeLevelSovereign() {
  unZoom();
  const data = getGameData();
  const currentLevel = data.sovereign?.level ?? 1;

  Swal.fire({
    title: 'Change Level of Sovereign Weapon',
    html: `
      ${getWeaponImage(data, true)}
      <label for="downgrade-level" style="display:block; margin-bottom:8px; font-weight:bold; color:#eee;">
        Select new Sovereign level:
      </label>
      <select id="downgrade-level" class="swal2-select" style="width: 100%; padding: 8px; font-size: 16px;">
        <option value="0" ${currentLevel === 0 ? 'selected' : ''}>Base</option>
        <option value="1" ${currentLevel === 1 ? 'selected' : ''}>PRI (I)</option>
        <option value="2" ${currentLevel === 2 ? 'selected' : ''}>DUO (II)</option>
        <option value="3" ${currentLevel === 3 ? 'selected' : ''}>TRI (III)</option>
        <option value="4" ${currentLevel === 4 ? 'selected' : ''}>TET (IV)</option>
        <option value="5" ${currentLevel === 5 ? 'selected' : ''}>PEN (V)</option>
        <option value="6" ${currentLevel === 6 ? 'selected' : ''}>HEX (VI)</option>
        <option value="7" ${currentLevel === 7 ? 'selected' : ''}>SEP (VII)</option>
        <option value="8" ${currentLevel === 8 ? 'selected' : ''}>OCT (VIII)</option>
        <option value="9" ${currentLevel === 9 ? 'selected' : ''}>NOV (IX)</option>
        <option value="10" ${currentLevel === 10 ? 'selected' : ''}>DEC (X)</option>
      </select>
    `,
    background: '#121212',
    color: '#e0e0e0',
    showCancelButton: true,
    confirmButtonText: 'Change',
    cancelButtonText: 'Cancel',
    preConfirm: () => {
      const select = Swal.getPopup().querySelector('#downgrade-level');
      return parseInt(select.value);
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = getGameData();
      data.sovereign = data.sovereign || {};
      data.sovereign.level = result.value;
      setGameData(data);
      Swal.fire({
        icon: 'success',
        title: `Changed Sovereign weapon to level ${result.value == 0 ? 'BASE' : `${ENCHANT_TO_DEC[SOVEREIGN_LEVELS[result.value]]} (${SOVEREIGN_LEVELS[result.value]})`} successfully!`,
        html: getWeaponImage(getGameData(), true),
        background: '#121212',
        color: '#0f0'
      });
    }
  });
}

function openBdoEnchant() {
  const unlocked = getUnlockedAchievements();
  let blackstar = getGameData().blackstar ?? (unlocked['rng'] ? 1 : 0);
  let sovereignLevel = getGameData().sovereign?.level ?? 0;
  let showSovereign = (blackstar >= 2) && (sovereignLevel < 10);

  const showPopup = (feedback = null) => {
    const unlocked = getUnlockedAchievements();

    let blackstar = getGameData().blackstar ?? (unlocked['rng'] ? 1 : 0);
    let sovereignLevel = getGameData().sovereign?.level ?? 0;

    const valksBonus = 13;
    const prestigeCount = getPrestigeCount();
    const permanentBonus = Math.min(Math.floor(prestigeCount / 2), 5);
    
    let cronStones = getGameData().cronStone ?? 0;

    let magicalStone = getGameData().magicalStone ?? 10;
    if (showSovereign) magicalStone = getGameData().sovereign?.primordialStone ?? 0;

    let durability = getGameData().durability ?? 200;
    if (showSovereign) durability = getGameData().sovereign?.durability ?? 200;

    if (showSovereign && sovereignLevel >= 10) {
      changeLevelSovereign();
      return;
    }

    let failstack = getGameData().failstack ?? Math.min(150 + (50 * blackstar));
    if (showSovereign) failstack = getGameData().sovereign?.failstack ?? SOVEREIGN_FAILSTACKS[sovereignLevel];

    let chance_gain = 0.02;
    if (showSovereign) chance_gain = SOVEREIGN_INCREASE[sovereignLevel];
    let baseChance = 0.2;
    if (showSovereign) baseChance = SOVEREIGN_BASE_CHANCE[sovereignLevel];

    let cronCost = 3670;
    if (showSovereign) cronCost = SOVEREIGN_CRONS[sovereignLevel];

    let failstack_gain = 6;
    if (showSovereign) failstack_gain = sovereignLevel + 2;

    const enchantLevel = showSovereign ? (SOVEREIGN_LEVELS[sovereignLevel + 1]) : 'V'; 

    const getTotalChance = () => baseChance + getCurrentChance() * chance_gain;
    const getCurrentChance = () => failstack + valksBonus + permanentBonus;

    const totalChance = getTotalChance();
    const currentChance = getCurrentChance();

    Swal.fire({
      width: 500,
      customClass: {
        popup: 'enchant-popup',
        title: 'enchant-title',
        content: 'enchant-content',
      },
      title: `Enhance a${unlocked['rng'] && !showSovereign ? 'nother' : ''} ${ENCHANT_TO_DEC[enchantLevel]} (${enchantLevel}) ${showSovereign ? 'Sovereign' : 'Blackstar'} Axe`,
      background: '#121212',
      color: '#e0e0e0',
      html: `
        <div style="font-family: sans-serif; color: #ccc; display: flex; flex-direction: column; align-items: center;">
        
          <div style="margin-top: 10px; display: flex; align-items: center; gap: 20px; background: #1c1c1c; padding: 15px 20px; border-radius: 8px;">
            <img src="${showSovereign ? primordialStoneUrl : magicalStoneUrl}" width="50" alt="Enhancement Stone">
            <div style="text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #80ffff;">${totalChance.toFixed(3)}%</div>
              <div style="font-size: 14px; color: #aaa;">(+${currentChance})</div>
            </div>
            ${getWeaponImage(getGameData(), showSovereign, true)}
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
              <img src="${cronUrl}" width="30" title="Super Cron Stones that still give all fallstacks when protecting! How convenient!" alt="Cron Stones">
              <span><strong>Cron Stones: ${cronStones}</strong> / ${cronCost}</span>
            </div>
            <div style="align-self: flex-center; align-items: center; gap: 6px;">
              <img src="${showSovereign ? primordialStoneUrl : magicalStoneUrl}" width="30" alt="${showSovereign ? 'Primordial Stone' : 'Magical Stone'}">
              <span><strong>${showSovereign ? 'Primordial Stones' : 'Magical Stones'}: ${magicalStone}</strong></span>
            </div>

              <div style="margin-top: 8px; font-size: 12px; color: #888; text-align: center; user-select: none;">
                Press , anytime to get back here
              </div>
          </div>

          <!-- Feedback message -->
          ${feedback ? `<div style="margin-top: 10px; color: ${feedback.color}; font-weight: bold;">${feedback.message}</div>` : ''}
          <div class="flex flex-col">
            ${blackstar >= 2 ? `
              <button id="changeWeaponBtn" style="margin-top: 10px; background: #444; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                ${showSovereign ? 'Enchant Blackstar' : (sovereignLevel >= 10) ? 'Change Sovereign Level' : 'Enchant Sovereign'}
              </button>` : ''}
      
            <button id="enchantBtn" style="margin-top: 15px; background: #0a0; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
              Enchant
            </button>
          </div>
        </div>
      `,
      showConfirmButton: false,
      didOpen: () => {
        $('#enchantBtn').off('click').on('click', () => {
          if (durability < 20 || cronStones < cronCost || magicalStone < 1) {
            Swal.fire({
              icon: 'warning',
              title: 'Insufficient Materials',
              html: `<div style="font-size: 15px; font-weight: bold;">You need <div style="color: orange">${cronCost} cron stones</div><div style="color: orange">20 durability</div><div style="color: orange">1 ${showSovereign ? 'primordial stone' : 'magical stone'}</div> per attempt.</div>
              <br><div style="text-decoration: underline;">How to uptain:</div><div>Cron Stones with achievements</div><div>${showSovereign ? 'Primordial stone by capturing crows' : 'Magical stones by going prestige'}</div><div>Durability by celebrating!</div>`,
              background: '#111',
              confirmButtonText: 'Go back to grind...',
              color: '#fff'
            }).then(() => showPopup());
            return;
          }

          cronStones -= cronCost;
          magicalStone--;

          const success = Math.random() < (totalChance / 100);

          var data = getGameData();
          data.sovereign ??= {};

          if (success) {
            data.cronStone = cronStones;
            if (showSovereign) {
              data.primordialStone = magicalStone;
              data.sovereign.level = sovereignLevel + 1;
              data.sovereign.failstack = null;
              setGameData(data);
              if (data.sovereign.level >= 10) {
                achievementUnlocked('cheater');
              }
            }
            else {
              data.failstack = null;
              data.magicalStone = magicalStone;
              data.durability = 200;
              data.blackstar = blackstar + 1;
              showSovereign = data.blackstar >= 2;
              setGameData(data);
              achievementUnlocked('rng');
            }
            Swal.fire({
              icon: 'success',
              title: 'OMG RNG CARRIED?!!',
              html: `           
              <div>Your ${showSovereign ? 'Sovereign' : 'Blackstar'} Axe is now ${ENCHANT_TO_DEC[enchantLevel]} (${enchantLevel})!</div> 
              <div>You used a failstack of <span style="font-weight: bold">${failstack}!</span></div>
              <br>
              ${getWeaponImage(getGameData(), showSovereign, false)}`,
              imageHeight: 100,
              confirmButtonText: 'EZ GAME',
              background: '#000',
              color: '#0f0'
            }).then(() => showPopup());
          } else {
            failstack += failstack_gain;
            durability -= 20;
            data.cronStone = cronStones;
            if (showSovereign) {
              data.sovereign.primordialStone = magicalStone;
              data.sovereign.durability = durability;
              data.sovereign.failstack = failstack;
            } else {
              data.magicalStone = magicalStone;
              data.durability = durability;
              data.failstack = failstack;
            }
            setGameData(data);
            showPopup({
              message: '❌ Enhancement failed...',
              color: '#ff4444'
            });
            if (!showSovereign && failstack > 349)
              achievementUnlocked('unlucky');
            }
        });
        if (blackstar >= 2) {
          $('#changeWeaponBtn').off('click').on('click', () => {
            showSovereign = !showSovereign;
            showPopup();
          });
        }
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
        <img src="${valkUrl}" alt="Advice of Valk +150" style="width:80px; height:auto;">
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
            html: "<a href='https://zenrac.wixsite.com/souriredeberserk-fs'><img id='evil' src=./images/berserk.png /></a>",
            imageAlt: "BERSERK",
            confirmButtonText: 'I am sorry!',
            confirmButtonAriaLabel: 'Thumbs up, great!',
          }).then((result) => {
            if (!result.dismiss) {
              Swal.fire({
                title: "Erm actually...",
                text: "You're not 'sorry', you're a user!",
                width: '500px',
                imageUrl: './images/nerdface.png',
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

  $('a').each(function () {
    const href = $(this).attr('href');
    const target = $(this).attr('target');

    if (href) {
      $(this).attr('onclick', target === '_blank'
        ? 'window.open("' + href + '", "_blank", "noopener,noreferrer")'
        : 'window.location.href="' + href + '"'
      );
      $(this).removeAttr('href');
    }
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

  updateCrowIcons();

  $('body').keydown((e) => {
    if (e.key.toLowerCase() === 'c') {
      const allunlockedAch = getUnlockedAchievements();
      if (e.altKey) {
        if (allunlockedAch['arsha'] || allunlockedAch['dead']) return;
        if (Math.random() < 0.10) {
          achievementUnlocked('dead');
          var data = getGameData();
          data.sovereign ??= {}
          data.cronStone = 0;
          data.magicalStone = 0;
          data.durability = 0;
          data.sovereign.primordialStone = 0;
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

  $('body').keypress((e) => {
    if (e.key.toLowerCase() === 'r') {
      if (e.shiftKey) {
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

  $(document).on('click', '[class*="AchievementIconWrapper"][class*="???Achievement"]', function () {
    const unlocked = getUnlockedAchievements();
    if (unlocked['???'] && !$(this).hasClass('freed')) {
      $(this).addClass('freed');
      var data = getGameData();
      teleportCrowGlitch(this, $(this)[0], Math.max(data.capturedGlitch, 1));
    }
  });

  $('body').on('click', '.freed', function() {
    this._glitchActive = false;
    $(this).remove();
    var data = getGameData();
    data.capturedGlitch = ((data.capturedGlitch ?? 0) + 1)
    setGameData(data);
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
        title: isZoomed ? (unlocked['konami'] ? "Good job Detective!" : "What do you think of Nova on BDO?") : "An easter egg into an easter egg? Really?",
        width: 500,
        html:
        isZoomed ? (unlocked['konami'] ? "It was indeed the famous Konami Code!" : "Nova was released as a heavy tank class with a giant door shield. But did you know that Nova awakening was so broken that everyone thought they were using <span class='bold'>*cheat codes*</span>?<br><br>Did you try to use the most famous one on the main page by the way?") :
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
        unZoom();
        const prestigeCount = getPrestigeCount();
        ctrlClickEvent.isSecret = true;
        ctrlClickEvent.isSkilled = (unlocked['skin'] || prestigeCount > 0);
        ctrlClickEvent.isDone = (unlocked['good'] || unlocked['evil']);
        if ($('.fullscreen').length > 0) {
          playButton.dispatchEvent(ctrlClickEvent);
        }
        playButton.dispatchEvent(ctrlClickEvent);
      }
    }
  });

  $(document).on('click', '.achievement-prestigious', () => {
    unZoom();
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
      if (!isZoomed || unlocked['rng']) {
        Swal.fire({
          title: 'Good job!',
          showCancelButton: false,
          html: '<div class="glitch-text">The source of evil is now weakened!</div>',
          icon: 'success',
          confirmButtonText: "Time to end this!",
          confirmButtonColor: 'red'
        })
      } else {
          Swal.fire({
          title: 'Good job!',
          showCancelButton: false,
          html: 'You have weakened the source of evil, now you can try to defeat it, maybe you should try to enhance your axe first?',
          icon: 'success',
          confirmButtonText: "Time to end this!",
          confirmButtonColor: 'red'
        })
      }
      unZoom();
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
            if ($('.fullscreen').length > 0) {
              playButton.dispatchEvent(ctrlClickEvent);
            }
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
        title: isZoomed ? (unlocked['L'] ? "Good job Detective!" : "Is this a hint ?") : "An easter egg into an easter egg? Really?",
        width: 500,
        html:
        isZoomed ? (unlocked['L'] ? "It was indeed the ALT key!" : 'You may need to repeat what you did to get this achievement, but this time try to put more <span class="bold">*control*</span> on it, or was it the other one..?') :
        '<iframe width="80%" height:"auto" src="https://www.youtube.com/embed/-iwYHk_SwNA?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
      }).then((result) => { openAchievementList(); });
    }
  });

  $(document).on('click', '.achievement-konami', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['konami']) {
      Swal.fire({
        title: isZoomed ? ((unlocked['arsha'] || unlocked['dead']) ? "Good job Detective!" : "It's time for du-du-duel!") : "An easter egg into an easter egg? Really?",
        width: 500,
        html: isZoomed ? ((unlocked['arsha'] || unlocked['dead']) ? 'Looks like you found the BDO shortcut to enable PvP (ALT-C)' : "Do you know the BDO shortcut to enable PvP?") :
        '<iframe width="80%" height:"auto" src="https://www.youtube.com/embed/_MnCeDBSbzA?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>',
      }).then((result) => { openAchievementList(); });
    }
  });

  $(document).on('click', '.achievement-completed', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['completed']) {
      Swal.fire({
        title: isZoomed ? (unlocked['celebrate'] ? "Congratulation Detective!" : "Congratulation Detective! You're on the right way!") : "Congratulations! You unlocked all achievements!",
        text: isZoomed ? (unlocked['celebrate'] ? "You correctly celebrated more than 7 times!" : "Thanks to your detective skills you understand that you may need to celebrate and that you can use your 'control' on your trophy for that...")
         : "I mean all of them without talking about the secret ones, right?",
        width: 500,
        confirmButtonText: isZoomed ? 'Celebrate!' : 'If only I had my magnifying glass...',
        confirmButtonColor: isZoomed ? '#B28E00' : ''
      }).then((result) => { 
        if (isZoomed && result.value) {
          createConfetti(); 
        }
        unZoom();
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

  $(document).on('click', '.achievement-good', () => {
    startBossOrSong('good');
  });

  $(document).on('click', '.achievement-crow', () => {
    startBossOrSong('crow');
  });

  $(document).on('click', '.achievement-evil', () => {
    startBossOrSong('evil');
  });

  $(document).on('click', '.achievement-rng', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['rng']) {
      openBdoEnchant();
    }
  });

  $(document).on('click', '.achievement-unlucky', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['unlucky']) {
      openBdoEnchant();
    }
  });

  $(document).on('click', '.achievement-cheater', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['cheater']) {
      changeLevelSovereign();
    }
  });

  $(document).on('click', '.achievement-bronze', () => {
    const unlocked = getUnlockedAchievements();
    if (unlocked['bronze']) {
      const durationMs = getUnlockDuration(unlocked);
      const readableDuration = formatDuration(durationMs);
      unZoom();
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

  animateFollowers();
  randomSpawnLoop();

  document.addEventListener('mousemove', (e) => {
    lastMousePos.x = e.clientX;
    lastMousePos.y = e.clientY;
  });

  document.addEventListener('mousemove', (e) => {
    followerCrows.forEach((crow, i) => {
      const offsetX = parseInt(crow.el.dataset.offsetX);
      const offsetY = parseInt(crow.el.dataset.offsetY);

      crow.el.style.left = `${e.clientX + offsetX}px`;
      crow.el.style.top = `${e.clientY + offsetY}px`;
    });
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
    e.preventDefault();
	  if ($('.fullscreen').length < 1) {
		  var iframe = document.createElement('iframe');
      var firstSong = 'WRLD';
      var params = '&autoSong=loop&autoSongDelay=3';
      if (e.altKey) {
        firstSong = 'L';
      }
      if (e.ctrlKey && e.altKey) {
        firstSong = 'NOAH';
        params = '&respacks=BossesA.zip,SongsD.zip&firstImage=Berserk&fullAuto=false&autoSong=loop';
        if (e.originalEvent.isSecret) {
          if (e.originalEvent.isDone) {
            Swal.fire({
              title: 'You did it!',
              text: 'You already have defeated the boss!',
              confirmButtonText: 'Let\'s go!',
              icon: 'success',
              allowOutsideClick: false,
              allowEscapeKey: false,
            });
          }
          else {
            Swal.fire({
              title: 'Is that a boss music?',
              text: 'This is the song that will play during the boss battle, but where\'s the boss? I already saw this big smile somewhere..' + ((!e.originalEvent.isSkilled) ? ' You may need to be more skilled to win this fight. Maybe at least able to achieve metamorphosis..' : ''),
              confirmButtonText: 'Umh okay?',
              icon: 'question',
              allowOutsideClick: false,
              allowEscapeKey: false,
            });
          }
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
        params = '&respacks=BossesA.zip,SongsD.zip&firstImage=Berserk&fullAuto=false&autoSong=loop';
        achievementUnlocked('berserk');
      }
      if (e.originalEvent.pathChoosen == 'evil' || e.originalEvent.pathChoosen == 'good') {
        firstSong = 'NOAH';
        params = '&respacks=BossesA.zip&firstImage=Berserk&fullAuto=false&autoSong=loop';
      }
      if (e.originalEvent.pathChoosen == 'crow') {
        firstSong = 'Ultra';
        params = '&respacks=BossesA.zip&firstImage=UltraCrow&fullAuto=false&autoSong=loop';
      }
  
      if (firstSong == 'L')
        achievementUnlocked('L');
      
      iframe.src = `./0x40/?song=${firstSong}${params}`;
		  iframe.classList.add('fullscreen');
		  $('body').prepend(iframe)
		  $('.play').html($('.play').html().replace('fa-play', 'fa-stop').replace('Play', 'Stop'))
		  $('#footer').addClass('hidden');
      $('#crow-perch').addClass('hidden');
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
      $('#crow-perch').removeClass('hidden');
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
    absorbCrowsIntoCat();
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
})();
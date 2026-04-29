const ANILIST_USERNAME = "Zenrac";
const ANILIST_ENDPOINT = "https://graphql.anilist.co";
const WATCHING_PAGE_SIZE = 6;
const WATCHING_COMPACT_PAGE_SIZE = 2;

let watchingPage = 0;
let latestAniListData = null;
let isAniListExpanded = false;

const anilistQuery = `
query ($name: String) {
  User(name: $name) {
    siteUrl
    statistics {
      anime {
        minutesWatched
        statuses {
          status
          count
        }
      }
    }
  }
  MediaListCollection(userName: $name, type: ANIME, status: CURRENT, sort: UPDATED_TIME_DESC) {
    lists {
      entries {
        progress
        score(format: POINT_10_DECIMAL)
        media {
          id
          siteUrl
          format
          episodes
          averageScore
          coverImage {
            large
          }
          title {
            romaji
            english
          }
          nextAiringEpisode {
            episode
            timeUntilAiring
          }
        }
      }
    }
  }
}
`;

const $widget = document.querySelector("[data-anilist-widget]");
const $content = document.getElementById("content");

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));
}

function compactNumber(value) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value || 0);
}

function formatWatchTime(minutes) {
  const days = Math.floor((minutes || 0) / 1440);
  return `${compactNumber(days)} days`;
}

function formatNextEpisode(seconds) {
  if (!seconds) return "No air date";

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return "soon";
}

function flattenEntries(collection) {
  return (collection?.lists || [])
    .flatMap((list) => list.entries || [])
    .filter((entry) => entry?.media);
}

function getCompletedCount(stats) {
  return stats.statuses?.find((entry) => entry.status === "COMPLETED")?.count || 0;
}

function getNextMilestone(value) {
  if (value < 100) return Math.ceil((value + 1) / 10) * 10;
  return Math.ceil((value + 1) / 500) * 500;
}

function getWatchingPageSize() {
  return window.matchMedia("(max-width: 750px), (max-height: 760px)").matches
    ? WATCHING_COMPACT_PAGE_SIZE
    : WATCHING_PAGE_SIZE;
}

function renderWatchingPage(watching, user) {
  const pageSize = getWatchingPageSize();
  const pageCount = Math.max(Math.ceil(watching.length / pageSize), 1);
  watchingPage = Math.min(Math.max(watchingPage, 0), pageCount - 1);

  const pageEntries = watching.slice(
    watchingPage * pageSize,
    (watchingPage + 1) * pageSize
  );

  const cards = pageEntries.map((entry) => {
    const media = entry.media;
    const title = media.title.english || media.title.romaji;
    const episodeText = media.episodes
      ? `Ep ${entry.progress}/${media.episodes}`
      : `Ep ${entry.progress}`;
    const nextEpisode = media.nextAiringEpisode
      ? `Next ${media.nextAiringEpisode.episode} in ${formatNextEpisode(media.nextAiringEpisode.timeUntilAiring)}`
      : media.format || "Anime";
    const score = media.averageScore ? `${media.averageScore}%` : "";

    return `
      <a class="aw-card" href="${escapeHtml(media.siteUrl)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(title)}">
        <img src="${escapeHtml(media.coverImage.large)}" alt="${escapeHtml(title)} cover" loading="lazy">
        <span class="aw-card-copy">
          <strong>${escapeHtml(title)}</strong>
          <small>
            <span>${escapeHtml(episodeText)}</span>
            <span>${escapeHtml(nextEpisode)}</span>
          </small>
        </span>
        ${score ? `<b aria-label="Average score">${score}</b>` : ""}
      </a>
    `;
  }).join("");

  return `
    <div class="aw-track">
      ${cards || `
        <a class="aw-empty" href="${escapeHtml(user.siteUrl)}" target="_blank" rel="noopener noreferrer">
          No current shows listed. Open AniList profile.
        </a>
      `}
    </div>
    ${watching.length > pageSize ? `
      <div class="aw-pager" aria-label="Watching pagination">
        <button type="button" class="aw-page-btn" data-aw-page="prev" ${watchingPage === 0 ? "disabled" : ""} aria-label="Previous anime page">
          <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
        </button>
        <span>${watchingPage + 1}/${pageCount}</span>
        <button type="button" class="aw-page-btn" data-aw-page="next" ${watchingPage >= pageCount - 1 ? "disabled" : ""} aria-label="Next anime page">
          <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
    ` : ""}
  `;
}

function renderLoading() {
  if (!$content) return;

  $content.innerHTML = `
    <div class="aw-loading">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
}

function renderError() {
  if (!$widget || !$content) return;

  $widget.classList.add("aw-error");
  $content.innerHTML = `
    <a class="aw-error-card" href="https://anilist.co/user/${ANILIST_USERNAME}/" target="_blank" rel="noopener noreferrer">
      <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
      <span>AniList is taking a break. Open profile instead.</span>
    </a>
  `;
}

function renderWidget(data) {
  if (!$widget || !$content) return;

  const user = data.User;
  const stats = user.statistics.anime;
  const watching = flattenEntries(data.MediaListCollection);
  const completedCount = getCompletedCount(stats);
  const nextMilestone = getNextMilestone(completedCount);
  const milestoneProgress = Math.min((completedCount / nextMilestone) * 100, 100);

  $widget.classList.remove("aw-error");
  $widget.classList.toggle("aw-expanded", isAniListExpanded);

  $content.innerHTML = `
    <div class="aw-head">
      <button class="aw-summary" type="button" aria-expanded="${isAniListExpanded}" aria-controls="aw-details">
        <span class="aw-summary-copy">
          <span class="aw-eyebrow"><i class="fa-solid si-anilist" aria-hidden="true"></i> AniList</span>
          <span class="aw-summary-stats" aria-label="Anime summary">
            <span>
              <strong>${watching.length || 0}</strong>
              <small>watching</small>
            </span>
            <span>
              <strong>${compactNumber(completedCount)}</strong>
              <small>completed</small>
            </span>
            <span>
              <strong>${formatWatchTime(stats.minutesWatched)}</strong>
              <small>watch time</small>
            </span>
          </span>
          <span class="aw-goal">
            <span>Goal ${compactNumber(nextMilestone)} completed anime</span>
            <span>${Math.floor(milestoneProgress)}%</span>
          </span>
          <span class="aw-goal-bar" aria-hidden="true">
            <span style="width:${milestoneProgress}%"></span>
          </span>
        </span>
        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
      </button>
    </div>

    <div id="aw-details" class="aw-details" ${isAniListExpanded ? "" : "hidden"}>
      <div class="aw-now">
        <div class="aw-section-title">
          <span>Watching now - ${watching.length || 0}</span>
          <em>${watchingPage + 1}/${Math.max(Math.ceil(watching.length / getWatchingPageSize()), 1)}</em>
        </div>
        ${renderWatchingPage(watching, user)}
      </div>
    </div>
  `;

  $content.querySelector(".aw-summary")?.addEventListener("click", () => {
    isAniListExpanded = !isAniListExpanded;
    renderWidget(data);
  });

  $content.querySelectorAll("[data-aw-page]").forEach((button) => {
    button.addEventListener("click", () => {
      watchingPage += button.dataset.awPage === "next" ? 1 : -1;
      renderWidget(data);
    });
  });
}

async function loadAniListWidget() {
  if (!$widget || !$content) return;

  renderLoading();

  try {
    const response = await fetch(ANILIST_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        query: anilistQuery,
        variables: { name: ANILIST_USERNAME }
      })
    });

    if (!response.ok) throw new Error(`AniList returned ${response.status}`);

    const json = await response.json();
    if (!json?.data?.User) throw new Error("AniList response was missing user data");

    latestAniListData = json.data;
    renderWidget(json.data);
  } catch (error) {
    console.error(error);
    renderError();
  }
}

loadAniListWidget();

let resizeFrame = 0;

window.addEventListener("resize", () => {
  if (!latestAniListData) return;

  window.cancelAnimationFrame(resizeFrame);
  resizeFrame = window.requestAnimationFrame(() => renderWidget(latestAniListData));
});

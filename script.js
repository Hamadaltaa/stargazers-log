const list = document.querySelector("#starred");
const status = document.querySelector("#status");

const dateFormat = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeZone: "UTC",
});
const REPO_NAME = /^[\w.-]+\/[\w.-]+$/;

async function loadStarred() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const repos = await response.json();
    if (!Array.isArray(repos)) throw new Error("Unexpected data format");

    const fragment = document.createDocumentFragment();

    for (const repo of repos) {
      if (typeof repo?.name !== "string" || !REPO_NAME.test(repo.name)) continue;

      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `https://github.com/${repo.name}`;
      link.textContent = repo.name;
      item.append(link);

      const date = new Date(repo.starred);
      if (!Number.isNaN(date.getTime())) {
        const time = document.createElement("time");
        time.dateTime = repo.starred;
        time.textContent = dateFormat.format(date);
        item.append(" — starred ", time);
      }

      fragment.append(item);
    }

    list.replaceChildren(fragment);
    const count = list.children.length;
    status.textContent = count
      ? `${count} starred ${count === 1 ? "repository" : "repositories"}.`
      : "No starred repositories yet.";
  } catch (error) {
    console.error(error);
    status.textContent =
      "Couldn't load the list of starred repositories. Please try again later.";
  }
}

loadStarred();

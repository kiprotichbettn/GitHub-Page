const username = "kiprotichbettn"; 
const GITHUB_TOKEN = ""; 

async function githubFetch(endpoint) {
  const res = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      Authorization: GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : undefined,
      Accept: 'application/vnd.github.v3+json',
    }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `GitHub API error: ${res.status}`);
  }

  return res.json();
}

async function fetchUser(username) {
  try {
    const user = await githubFetch(`/users/${username}`);
    displayUser(user);
  } catch (err) {
    document.getElementById("profile").innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

async function fetchRepos(username) {
  try {
    const repos = await githubFetch(`/users/${username}/repos`);
    displayRepos(repos);
  } catch (err) {
    document.getElementById("repo-list").innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

function displayUser(user) {
  const profile = document.getElementById("profile");
  profile.innerHTML = `
    <img src="${user.avatar_url}" alt="${user.name || user.login}" />
    <h2>${user.name || user.login}</h2>
    <p>${user.bio || "No bio provided."}</p>
    <a href="${user.html_url}" target="_blank">View GitHub Profile</a>
  `;
}

function displayRepos(repos) {
  const container = document.getElementById("repo-list");
  container.innerHTML = ""; // to cleear before adding

  if (repos.length === 0) {
    container.innerHTML = "<p>No repositories found.</p>";
    return;
  }

  repos.forEach(repo => {
    const div = document.createElement("div");
    div.className = "repo";
    div.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || "No description."}</p>
      <a href="${repo.html_url}" target="_blank">View Repo</a>
    `;
    container.appendChild(div);
  });
}


fetchUser(username);
fetchRepos(username);



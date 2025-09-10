let searchBtn = document.querySelector(".search");
let usernameinp = document.querySelector(".usernameinp");
let card = document.querySelector(".card");

// Fetch user profile data
function getProfileData(username) {
  return fetch(`https://api.github.com/users/${username}`).then((raw) => {
    if (!raw.ok) throw new Error("User not found");
    return raw.json();
  });
}

// Fetch user repos
function getRepos(username) {
  return fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=8`).then(
    (raw) => {
      if (!raw.ok) throw new Error("Failed to fetch repos...");
      return raw.json();
    }
  );
}

// Render profile + repos
function decorateProfileData(details, repos) {
  let data = `
    <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
      <!-- Avatar -->
      <img 
        src="${details.avatar_url}" 
        alt="User Avatar" 
        class="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg hover:scale-105 transition-transform"
      >

      <!-- Info -->
      <div class="flex-1">
        <h2 class="text-3xl font-bold flex items-center gap-2">
          ${details.name || "No Name"} 
          <span class="text-sm text-gray-400 font-normal">@${details.login}</span>
        </h2>
        <p class="mt-2 text-gray-300">
          ${details.bio || "No bio available."}
        </p>

        <!-- Stats Grid -->
        <div class="mt-4 grid grid-cols-3 gap-4 text-center">
          <div class="bg-white/10 p-3 rounded-xl">
            <p class="text-xl font-semibold">${details.public_repos}</p>
            <p class="text-gray-400 text-sm">Repos</p>
          </div>
          <div class="bg-white/10 p-3 rounded-xl">
            <p class="text-xl font-semibold">${details.followers}</p>
            <p class="text-gray-400 text-sm">Followers</p>
          </div>
          <div class="bg-white/10 p-3 rounded-xl">
            <p class="text-xl font-semibold">${details.following}</p>
            <p class="text-gray-400 text-sm">Following</p>
          </div>
        </div>

        <!-- Extra Info -->
        <div class="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-gray-300">
          <p>📍 Location: ${details.location || "Not available"}</p>
          <p>🏢 Company: ${details.company || "Not available"}</p>
          <p>🔗 Blog: <a href="${details.blog || "#"}" target="_blank" class="text-blue-400 hover:underline">
            ${details.blog || "Not available"}</a></p>
          <p>🌐 Profile: <a href="${details.html_url}" target="_blank" class="text-blue-400 hover:underline">
            ${details.html_url}</a></p>
        </div>
      </div>
    </div>
  `;

  // Add repos BELOW profile details
  if (repos && repos.length > 0) {
    data += `
      <div class="mt-10">
        <h3 class="text-2xl font-semibold mb-4">📂 Latest Repositories</h3>
        <div class="flex flex-wrap gap-4">
          ${repos
            .map(
              (repo) => `
              <a href="${repo.html_url}" target="_blank" 
                 class="px-5 py-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 hover:border-blue-500 transition hover:scale-105 hover:shadow-lg w-fit">
                <h4 class="font-bold text-blue-400">${repo.name}</h4>
                <p class="text-gray-400 text-xs">${repo.language || "N/A"} • ⭐ ${repo.stargazers_count}</p>
              </a>
            `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  card.innerHTML = data;
}

// Handle search button click
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  let username = usernameinp.value.trim();
  if (username.length > 0) {
    Promise.all([getProfileData(username), getRepos(username)])
      .then(([details, repos]) => {
        decorateProfileData(details, repos);
      })
      .catch((err) => {
        card.innerHTML = `<p class="text-center text-red-400">${err.message}</p>`;
      });
  } else {
    alert("Please enter a GitHub username!");
  }
});

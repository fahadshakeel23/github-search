const API_URL = 'https://api.github.com/users/'

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

async function getUser (username) {
    try {
       const { data } = await axios(API_URL + username)

       createUserCard(data)
       getRepos(username)
    } catch (err) {
        if(err.respone.status === 404) {
            createErrorCard('No Profile With This Username')
        }
    }
}

async function getRepos(username) {
    try {
        const { data } = await axios (API_URL + username + '/repos?sort=created')
        addReposToCard(data)
    } catch (err) {
        if (err.response.status === 404) {
            createErrorCard('Problem Fetching Repos')
        }
    }
}


function createUserCard(user) {
    const userId = user.name || user.login 
    const userBio = user.bio ? `<p>${user.bio}</p>` : ''
    const cardHTML = `
    <div class="card">
        <div>
            <img src="${user.avatar_url}" class="avatar">
        </div>
        <div class="user-info">
            <h2>${userId}</h2>
            ${userBio}

            <ul>
                <li>${user.followers} Followers</li>
                <li>${user.following} Following</li>
                <li>${user.public_repos} Public Repos</li>
            </ul>
            <div id="repos">
            </div>
        </div>
    </div> 
    `
    main.innerHTML = cardHTML
}

// creating error card
function createErrorCard(msg) {
    const cardHTML = `
    <div class="card">
    <h1>${msg}</h1>
    </div>
    `
    main.innerHTML = cardHTML
}

// adding repos to card 

function addReposToCard(repos) {
    const reposElement = document.getElementById('repos')
    repos.slice(0, 5).forEach(repo => {
        const repoEl = document.createElement('a')
        repoEl.classList.add('repo')
        repoEl.href = repo.html
        repoEl.target = "_blank"
        repoEl.innerText = repo.name

        reposElement.appendChild(repoEl)
    })
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    // user typed input
    const username = search.value

    if(username) {
        getUser(username)

        search.value = ''
    }
})
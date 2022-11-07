const APIKEY = '04c35731a5ee918f014970082a0088b1';
const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query="

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

// Initial Get Movies
getMovies(APIURL);

// Fetch Movie Data from API
async function getMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();

    showMovies(respData.results);

    return respData;
}

// Show Movie Data
function showMovies(movies) {
    // Clear Main
    main.innerHTML = '';

    movies.forEach((movie) => {
        const { poster_path, title, overview, vote_average } = movie;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img src="${poster_path != null ? (IMGPATH + poster_path) : './not_found.png'}" alt="${title}" />
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Summary:</h3>
                ${overview}
            </div>
        `;
        main.appendChild(movieEl);
    });
}

// Change Rating color based on Rating
function getClassByRate(vote) {
    if(vote > 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

// Search bar functionality
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if(searchTerm) {
        getMovies(SEARCHAPI + searchTerm)

        search.value = '';
    }
});
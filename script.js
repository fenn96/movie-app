const APIKEY = '04c35731a5ee918f014970082a0088b1';
const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const genres = [
    {"id":28,"name":"Action"},
    {"id":12,"name":"Adventure"},
    {"id":16,"name":"Animation"},
    {"id":35,"name":"Comedy"},
    {"id":80,"name":"Crime"},
    {"id":99,"name":"Documentary"},
    {"id":18,"name":"Drama"},
    {"id":10751,"name":"Family"},
    {"id":14,"name":"Fantasy"},
    {"id":36,"name":"History"},
    {"id":27,"name":"Horror"},
    {"id":10402,"name":"Music"},
    {"id":9648,"name":"Mystery"},
    {"id":10749,"name":"Romance"},
    {"id":878,"name":"Science Fiction"},
    {"id":10770,"name":"TV Movie"},
    {"id":53,"name":"Thriller"},
    {"id":10752,"name":"War"},
    {"id":37,"name":"Western"}
]


const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const heading = document.getElementById('heading');

const pagination = document.getElementById('pagination');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');
const tagsEl = document.getElementById('tags');

var selectedGenre = [];

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages  = 100;

setGenre();
// Set the correct genre infomation
function setGenre() {
    tagsEl.innerHTML = '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0) {
                selectedGenre.push(genre.id);
            } else {
                if(selectedGenre.includes(genre.id)) {
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id) {
                            selectedGenre.splice(idx, 1);
                        }
                    })
                } else {
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre);
            getMovies(APIURL + '&with_genres=' + selectedGenre.join(','));
            highlightSelection();
        })
        tagsEl.append(t);
    })
}

// Highlight tags that are selected
function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight');
    })
    clearBtn();
    if(selectedGenre.length != 0) {
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add('highlight');
        })
    }
}

// Show Clear Button if there are tags highlighted
function clearBtn() {
    let clearBtn = document.getElementById('clear');
    if(clearBtn) {
        clearBtn.classList.add('highlight');
    } else {
        let clear = document.createElement('div');
        clear.classList.add('tag', 'highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear x';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();
            getMovies(APIURL);
        })
        tagsEl.append(clear);
    }
}

// Initial Get Movies
getMovies(APIURL);

// Fetch Movie Data from API
async function getMovies(url) {
    lastUrl = url;
    const resp = await fetch(url);
    const respData = await resp.json();
    pagination.classList.remove('hidden');

    showMovies(respData.results);

    console.log(respData);

    currentPage = respData.page;
    nextPage = respData.page + 1;
    prevPage = respData.page - 1;
    totalPages = respData.total_pages;

    current.innerText = currentPage;

    if(currentPage <= 1) {
        prev.classList.add('disabled');
        next.classList.remove('disabled');
    } else if(currentPage >= totalPages) {
        prev.classList.remove('disabled');
        next.classList.add('disabled');
    } else if(totalPages == 1 || totalPages == 0) {
        prev.classList.add('disabled');
        next.classList.add('disabled');
    } else {
        prev.classList.remove('disabled');
        next.classList.remove('disabled');
    }

    return respData;
}

// Show Movie Data
function showMovies(movies) {
    // Clear Main
    main.innerHTML = '';

    if (movies.length > 0) {
        // Set Each Movie
        movies.forEach((movie) => {
            const { poster_path, title, overview, vote_average } = movie;

            const movieEl = document.createElement('div');
            movieEl.classList.add('movie');

            // Set Movie Info(If no poster for movie found, set poster to "Not Found" image)
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
    } else {
        // If no movies are found show "No results found."
        main.innerHTML = `<h1 class="heading">No results found.</h1>`;
        pagination.classList.add('hidden');
    }
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
    selectedGenre = [];
    setGenre();

    if(searchTerm) {
        getMovies(SEARCHAPI + searchTerm);

        search.value = '';
    } else {
        getMovies(APIURL);
    }
});

// Reset Movies on Logo Click
heading.addEventListener('click', () => {
    getMovies(APIURL);
});

// Go to Next Page on Next Page Button Click
next.addEventListener('click', () => {
    if(nextPage <= totalPages) {
        pageCall(nextPage);
    }
});

// // Go to Previous Page on Previous Page Button Click
prev.addEventListener('click', () => {
    if(prevPage > 0) {
        pageCall(prevPage);
    }
});

// Get correct page
function pageCall(page) {
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length - 1].split('=');
    if(key[0] != 'page') {
        let url = lastUrl + '&page=' + page;
        getMovies(url);
    } else {
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length - 1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] + '?' + b;
        getMovies(url);
        
    }
}
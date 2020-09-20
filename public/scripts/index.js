import graphPan from './graphpan.js';
import DATABASE_WORKER from './database.js';
import SPOTIFY_WORKER from './spotify.js';

// Execute system level functions on load
window.onload = async () => {

    // Get DOM entities
    let graph = document.querySelector('.graph');
    let controller = document.querySelector('.controller');
    let formContainer = document.querySelector('.submission-container');
    let form = document.querySelector('.submission-form');
    let searchBar = document.querySelector('.search-input');
    let formClose = document.querySelector('.form-close');

    // Buffer variable for recording keypress in serach
    let buffer = '';
    let timer;

    // Async call to collect data from database
    let data = await DATABASE_WORKER.getData();
    data.map(item => {
        createMemory(item, graph.clientWidth, graph.clientHeight);
    });

    // Instantiate graph pan
    window.addEventListener('mousemove', e => {
        graphPan.pan(
            controller.clientWidth,
            controller.clientHeight,
            { x: e.x, y: e.y },
            1.0,
            graph
        );
    });

    // Trigger form on click
    graph.addEventListener('click', e => {
        // Listen for clicks on empty space only
        if (e.target.nodeName !== "IMG") {
            formContainer.classList.add('subform-container-active');
            form.classList.add('form-active');
        }
    });

    // Close submission form
    formClose.onclick = () => {
        formContainer.classList.remove('subform-container-active');
        form.classList.remove('form-active');
        clearResults();
    }

    // Record keypress to create buffer to send to API
    searchBar.addEventListener('input', e => {

        // Check if the search bar is showing, display if not
        let resultBox = document.querySelector('.search-results');
        resultBox.style.display = 'block';

        // Clear the timeout interval after each press;
        clearTimeout(timer);
        // Set timer again to send buffer after 500ms
        timer = setTimeout(() => {
            // Execute search query
            searchQuery(buffer);
        }, 500);

        // Set buffer to be the current value of the search input;
        buffer = searchBar.value;
    });
}

// Append nodes based on data from firebase
let createMemory = (data, width, height) => {

    let img = document.createElement('img');
    let div = document.createElement('div');
    img.src = data.url;

    div.style.left = data.x + 'px';
    div.style.top = data.y + 'px';
    div.classList.add('node');

    div.appendChild(img);

    div.dataset.info = data;

    div.onclick = () => {
        console.log(div.dataset.info);
    }

    let graph = document.querySelector('.graph');
    graph.appendChild(div);
}

// Async throttle call
async function searchQuery(buffer) {
    let query = await SPOTIFY_WORKER.throttle(buffer);
    renderResults(query);
}

// Render results in search bar
function renderResults(data) {

    let temp = document.querySelector('.result-template');
    clearResults();

    data.forEach(node => {
        let result = document.createElement('div');
        let resultImage = document.createElement('img');
        let resultSong = document.createElement('h6');
        let resultArtist = document.createElement('span');

        result.appendChild(resultImage);
        result.appendChild(resultSong);
        result.appendChild(resultArtist);

        result.classList.add('result');

        resultImage.src = node.image;
        resultSong.innerHTML = node.name;
        resultArtist.innerHTML = node.artist[0];

        result.onclick = () => {
            document.querySelector('.search-results').style.display = 'none';
        }

        temp.appendChild(result);
    });
}

function clearResults() {
    let temp = document.querySelector('.result-template');
    temp.innerHTML = '';
}
import graphPan from './graphpan.js';
import DATABASE_WORKER from './database.js';


// Execute system level functions on load
window.onload = async () => {
    
    // Get DOM entities
    let graph = document.querySelector('.graph');
    let controller = document.querySelector('.controller');
    let formContainer = document.querySelector('.submission-container');
    let form = document.querySelector('.submission-form');

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
            {x: e.x, y: e.y},
            1.0,
            graph
        );
    });

    // Trigger form on click
    graph.addEventListener('click', e => {
        // Listen for clicks on empty space only
        if(e.target.nodeName !== "IMG") {
            formContainer.classList.add('subform-container-active');
            form.classList.add('form-active');
        }
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


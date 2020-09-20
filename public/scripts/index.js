import graphPan from './graphpan.js';
import DATABASE_WORKER from './database.js';

window.onload = async () => {
    
    let graph = document.querySelector('.graph');
    let controller = document.querySelector('.controller');
    let formContainer = document.querySelector('.submission-container');
    let form = document.querySelector('.submission-form');

    let data = await DATABASE_WORKER.getData();
    data.map(item => {
        createMemory(item, graph.clientWidth, graph.clientHeight);
    });

    window.addEventListener('mousemove', e => {
        graphPan.pan(
            controller.clientWidth,
            controller.clientHeight,
            {x: e.x, y: e.y},
            1.0,
            graph
        );
    });

    graph.addEventListener('click', e => {
        if(e.target.nodeName !== "IMG") {
            formContainer.classList.add('subform-container-active');
            form.classList.add('form-active');
        }
    });
}

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


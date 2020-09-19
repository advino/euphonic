import spotify_worker from './spotify.js';
import graphPan from './graphpan.js';

window.onload = () => {
    
    let graph = document.querySelector('.graph');
    let controller = document.querySelector('.controller');
    
    
    spotify_worker.getArchive('http://localhost:8000/euphonic')
    .then(res => {
        let songs = spotify_worker.filterArchive(res.items);
        songs.map(x => {
            spotify_worker.createMemory(x.url, graph.clientWidth, graph.clientHeight);
        })
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

}


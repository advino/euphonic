let spotify_worker = {};

spotify_worker.getArchive = (url) => {
    
    return fetch(url, {method: 'GET', mode: 'no-cors'})
    .then(response => {
        return response.json();
    })
    .then(result => {
        return result;
    });
}

spotify_worker.filterArchive = (archive) => {
    
    let items = archive.map(x => {
        return {
            name: x.track.name,
            url: x.track.album.images[1].url
        }
    });

    return items;
}

spotify_worker.createMemory = (url, width, height) => {

    let img = document.createElement('img');
    let div = document.createElement('div');
    img.src = url;

    div.style.top = Math.random() * width + 'px';
    div.style.left = Math.random() * height + 'px';
    div.classList.add('node');

    div.appendChild(img);

    let graph = document.querySelector('.graph');

    graph.appendChild(div);
}

export default spotify_worker;
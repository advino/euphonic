let graphPan = {};

graphPan.pan = (width, height, location, scale, elt) => {
    
    let loc = graphPan.mapLocation(width, height, location);
    let mapLoc = graphPan.scaleDelta(loc, scale);
    elt.style.transform = `translate(${-mapLoc[0]}px, ${-mapLoc[1]}px)`;
}

graphPan.scaleDelta = (location, scale) => {

    return location.map(x => x * scale);
}

graphPan.mapLocation = (width, height, location) => {

    let mapX = location.x - (width/2);
    let mapY = location.y - (height/2);
    return [mapX, mapY];
}

export default graphPan;
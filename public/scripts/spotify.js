let SPOTIFY_WORKER = {};

SPOTIFY_WORKER.throttle = async (keyword) => {
    try {
        let response = await fetch(`http://localhost:8000/spotifysearch?q=${keyword}`, {method: 'GET', mode: 'no-cors'});
        let result = await response.json();
        return result;
    } catch(err) {
        console.log("Failed to retrieve data");
        console.error(err);
    }
}

export default SPOTIFY_WORKER;
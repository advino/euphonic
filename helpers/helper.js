let request = require('request');

// Generate Spotify one-time token for web search
function generateToken(options) {
    // Create token variable
    let token;
    // Post request to URL to retrieve token
    request.post(options, (error, response, body) => {
        // Assign response body value
        token = body.access_token;
    });

    // Return Promise containing token
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(token)
        }, 1000);
    });
}

// Clean data to retrieve relevant information for search
function cleanData(data) {
    // Get tracks from search query
    let results = data.tracks;
    // Check if there are items in the query result
    if (results.items) {
        // Map over results for specific metdata
        cleanedResults = results.items.map(item => {
            // Retrieve artist names as array
            let artists = item.artists.map(artist => {
                return artist.name;
            });

            // Return cleaned object with specific information
            return {
                name: item.name,
                artist: artists,
                album: item.album.name,
                image: item.album.images[2].url,
            }
        });

        return cleanedResults;
    } else {
        // Put in a fall back result here
    }   


    return cleanedResults;
}

module.exports = {
    generateToken,
    cleanData
};
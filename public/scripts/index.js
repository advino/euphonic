

window.onload = () => {
    fetch('http://localhost:8000/login', {method: 'GET', mode: 'no-cors', redirect: 'follow'})
    .then(result => {
        return result
    }).then(result => {
        console.log(result);
        console.log(window.location);
    });
}
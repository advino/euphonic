let DATABASE_WORKER = {};

DATABASE_WORKER.getData = async () => {
    let response = await fetch('http://localhost:8000/submissions', {methods: 'GET', mode: 'no-cors'});
    let result = await response.json();
    
    return result;
}

export default DATABASE_WORKER;
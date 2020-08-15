const express = require('express');
const app = express();
const port = 8000;
const server = app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

app.use(express.static(__dirname + "/public"));

app.get('/login', (req,res,next) => {
    console.log("Login requested");
});


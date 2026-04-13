import express from 'express';

const app = express();
const port = 8000;

app.get('/', (req,res) => {
    res.send('hello server');
});

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});
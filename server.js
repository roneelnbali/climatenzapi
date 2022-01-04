if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const res = require('express/lib/response')

const PORT = process.env.PORT || 5000
const newsSites = [
    {
        name: 'Stuff NZ',
        address: process.env.STUFFNZ_CLIMATE
    },
    {
        name: 'NZ Herald',
        address: process.env.NZHERALD_CLIMATE
    },
    {
        name: 'News Talk ZB',
        address: process.env.NEWSTALK
    }
]
const articles = []

newsSites.forEach(newsSite => {
    axios(newsSite.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        

        $('a:contains("climate")', html).each(function() {
            const title = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                title,
                url,
                source: newsSite.name
            })
        })
    })
    
})

const app = express()

app.get('/', (req,res) => {
    res.json(articles)
})



app.listen(PORT, () => console.log(`server listening on ${PORT}`))
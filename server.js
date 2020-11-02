
const express = require('express')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()
const port = 3000;
const {Restaurant, Menu, Item} = require('./modules');

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.use(express.static('styles'));
app.use(express.static('views/images'));
app.engine('handlebars', handlebars);
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.post('/restaurants/:id/edit', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    await restaurant.update(req.body)
    res.redirect('/');
})

app.post('/restaurant/add', async (req, res) => {
    await Restaurant.create(req.body)
    res.redirect('/')
})

app.post('/restaurant/:id/delete', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    await restaurant.destroy()
    res.redirect('/')
})

app.get('/', async (req, res) => {
    const restaurants = await Restaurant.findAll({
        include: [{model: Menu, as: 'menus'}],
        nest: true
    });
    res.render('restaurants', {restaurants})
});

app.get('/menu/:id', async (req, res) => {
    const menu = await Menu.findOne({
        where: {
            id: req.params.id
        },
        include: [{model: Item, as: 'items'}],
        nest: true
    });
    console.log('Menu', menu);
    res.render('menu', {menu})
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
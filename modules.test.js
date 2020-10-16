const {Restaurant, Menu, Item, sequelize} = require('./modules')

describe('Restauraunt app', () =>{
    beforeAll(async () => {
        await sequelize.sync()
    })

    test('new restaurants are created with an id', async () => {
        const restaurant = await Restaurant.create({name: 'Bayroot', image: "image.url"})
        expect(restaurant.id).toBe(1)
    })
    test('new menus are created with an id', async () => {
        const menu = await Menu.create({title: 'Lunch', icon: "@"})
        expect(menu.id).toBe(1)
    })
    test('new items are created with an id', async () => {
        const item = await Item.create({name: 'Pancakes', price: 6.5})
        expect(item.id).toBe(1)
    })

})
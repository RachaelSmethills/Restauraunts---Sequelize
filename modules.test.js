const {Restaurant, Menu, Item, sequelize} = require('./modules'),
    resturantData = require('./restaurants.json');

describe('Restauraunt app', () =>{
    beforeAll(async () => {
        await sequelize
            .sync()
            .then(async () => {
                const taskQueue = resturantData.map(async (json_restaurant) => {
                        const restaurant = await Restaurant.create({name: json_restaurant.name, image: json_restaurant.image})
                        const menus = await Promise.all(json_restaurant.menus.map(async (_menu) => {
                            const items = await Promise.all(_menu.items.map(({name, price}) => Item.create({name, price})))
                            const menu = await Menu.create({title: _menu.title})
                            return menu.setItems(items)
                        }))
                        return await restaurant.setMenus(menus)
                    })
                return Promise.all(taskQueue)
            })
    })

    test('added menus to expected restarurant', async () => {
        const restaurant = await Restaurant.findOne({
            where: {
                name: 'Bayroot'
            },
            include: Menu
        });
        expect(restaurant.menus.length).toEqual(2)
    })

    test('added items to expected grill menu', async () => {
        const menu = await Menu.findOne({
            where: {
                title: 'Grill'
            },
            include: Item
        });

        expect(menu.items.length).toEqual(4)
    })

})
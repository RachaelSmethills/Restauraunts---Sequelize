const { Sequelize, Model, DataTypes } = require('sequelize'),
    sequelize = new Sequelize('sqlite::memory:', {
        logging: false
    }),
    resturantData = require('./restaurants.json');

class Restaurant extends Model {}
class Menu extends Model {}
class Item extends Model {}

Restaurant.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING
}, { sequelize, modelName: 'restaurant' })

Menu.init({
    title: DataTypes.STRING,
    icon: DataTypes.STRING
}, { sequelize, modelName: 'menu' })

Item.init({
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL
}, { sequelize, modelName: 'item' })

Restaurant.hasMany(Menu);
Menu.belongsTo(Restaurant);

Menu.hasMany(Item);
Item.belongsTo(Menu);

sequelize.sync().then(async () => {
    const taskQueue = resturantData.map(async (json_restaurant) => {
            const restaurant = await Restaurant.create({name: json_restaurant.name, image: json_restaurant.image})
            const menus = await Promise.all(json_restaurant.menus.map(async (_menu) => {
                const items = await Promise.all(_menu.items.map(({name, price}) => Item.create({name, price})))
                const menu = await Menu.create({title: _menu.title})
                return menu.setItems(items)
            }))
            return await restaurant.setMenus(menus)
        })
    await Promise.all(taskQueue).then(restaurants => {
        console.log('WOOOOOOOO', JSON.stringify(restaurants, null, 2))
    }).catch(console.error)
})

module.exports = {
    Restaurant,
    Menu,
    Item,
    sequelize
}
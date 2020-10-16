const { Sequelize, Model, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:', {
    logging: false
})

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

module.exports = {
    Restaurant,
    Menu,
    Item,
    sequelize
}
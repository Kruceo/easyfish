/**
 * Return only the "allowNull:true" attributes
 * @param {import("sequelize").ModelStatic<Model<any, any>>} table 
 * @returns {string[]}
 */

export function getOnlyNecessaryAttributes(table) {
    return Object.values(table.getAttributes()).filter((each) => {
        if (!each.allowNull &&
            !each.autoIncrement &&
            !each._autoGenerated &&
            each.defaultValue == undefined)
            return each
    }).map(each => each.field)
}

/**
 * Return the referenciedModels of table
 * @param {import("sequelize").ModelStatic<Model<any, any>>} table 
 * @returns {{type:"HasMany"|"BelongsTo",model:import("sequelize").ModelStatic<Model<any, any>>}[]}
 */
export function getAssociatedModels(table) {
    const attributes = Object.entries(table.associations)
    const selected = attributes.map(each => {
        return { type: each[1].associationType, model: each[1].target }
    })

    return selected
}

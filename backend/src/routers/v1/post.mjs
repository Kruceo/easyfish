import tables from "../../database/tables.mjs";
import statusCodes from "../../utils/statusCode.mjs";
import { upperCaseLetter } from "../../utils/stringUtils.mjs";
import { getOnlyNecessaryAttributes } from "../../utils/tableUtils.mjs";

/**
 * V1 request handler to be used in Routers 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @returns 
 */
export default async function postRequestHandler(req, res) {
    const tableName = upperCaseLetter(req.params.table, 0)
    let body = req.body
    const table = tables[tableName]
    if (!table) return;
    const tableNecessaryAttributes = getOnlyNecessaryAttributes(table)

    console.log(body)

    if (!Array.isArray(body)) {
        body = [req.body]
    }
    console.log(body)
    //Check the attributes

    for (const item of body) {
        if (!checkAttributes(item, tableNecessaryAttributes))
            return res.status(statusCodes.BadRequest)
                .json({
                    error: true, message: "Existem campos não preenchidos."
                })
    }

    //Wipe the attributes that can't appears in table 

    for (let i = 0; i < body.length; i++) {
        body[i] = wipeNoTableAttributes(body[i], table)
    }

    // case exist only 1 itens in body
    if (body.length === 1) {
        const data = await table.create(body[0])
        res.json({ data, message: "O item foi criado com sucesso." })
        return;
    }
    // case exist more than 1 itens in body
    const data = await table.bulkCreate(body)
    res.json({ data, message: "Os itens foram criados com sucesso." })
    return;

}

function checkAttributes(item, tableAttributes) {
    for (const attr of tableAttributes) {
        if (!item[attr]) {
            console.log(attr)
            return false
        }
    }
    return true
}

function wipeNoTableAttributes(item, table) {
    const allAttrs = Object.keys(table.getAttributes())
    const newItem = {}
    Object.keys(item).forEach(attr => {
        if (allAttrs.includes(attr)) {
            newItem[attr] = item[attr]
        }
    })
    console.log("new item", newItem)
    return newItem
}

import { useContext, useEffect, useState } from "react";
import Bar from "../../Layout/Bar";
import Content from "../../Layout/Content";
import SideBar from "../../Layout/SideBar";
import backend from "../../../constants/backend/backend";
import CreationForm from "./FormProducts";

import Table, { TableOrderEvent } from "../../table/Table";
import { bDate } from "../../../constants/dateUtils";
import TableToolBar from "../../table/TableToolBar";
import { GlobalPopupsContext } from "../../GlobalContexts/PopupContext";
import { TableEngineContext } from "../../GlobalContexts/TableEngineContext";
import beautyNumber from "../../../constants/numberUtils";

export default function ViewProducts() {

    const { setGlobalPopupByKey, simpleSpawnInfo } = useContext(GlobalPopupsContext)
    const { defaultDataGet, defaultDataDelete } = useContext(TableEngineContext)

    const [data, setData] = useState<produtoProps[]>([]);
    const [update, setUpdate] = useState(true)
    const [where, setWhere] = useState<any>({})

    const [loadingData,setLoadingData] = useState<boolean>(false)

    const setWhereKey = (key: string, value: string) => {
        const mockup = { ...where }
        mockup[key] = value
        setWhere(mockup)
    }

    const table_to_manage = "produto"

    useEffect(() => {
        setLoadingData(true)
        defaultDataGet(table_to_manage, where, setData)
        .then(()=>setLoadingData(false))
    }, [update])


    // Quando é alterado a ordem
    const orderHandler = (e: TableOrderEvent) => {
        setWhereKey("order", `${e.key},${e.order.toUpperCase()}`)
        setUpdate(!update)
    }

    // Quando é clicado no botão "pesquisar"
    const searchHandler = (search: string) => {
        setWhereKey("nome", "^" + search)
        setUpdate(!update)
    }

    // Quando é clicado no botão "criar"
    const createHandler = () => {
        setGlobalPopupByKey("CreateForm",
            <CreationForm
                key={"FormProdutos"}
                mode="creation"
                onCancel={() => setGlobalPopupByKey("CreateForm", null)}
                afterSubmit={() => setUpdate(!update)}
            />
        )
    }

    // Quando é clicado no botão "editar"
    const editHandler = (id: number) => {
        const search = backend.utils.filterUsingID(data, id) as produtoProps
        if (!search)
            return simpleSpawnInfo("Não é possivel selecionar o item escolhido.");

        const { nome, preco, tipo } = search
        setGlobalPopupByKey("EditForm",
            <CreationForm
                key={'editingForm'}
                mode="editing"
                defaultValues={{ id, nome, preco, tipo }}
                onCancel={() => setGlobalPopupByKey("EditForm", null)}
                afterSubmit={() => setUpdate(!update)}
            />
        )
    }

    // Quando é clicado no botão "deletar"
    const deleteHandler = (id: number) => defaultDataDelete(table_to_manage, id)
        .then(() => setUpdate(!update))


    const tableContextMenuButtons = [
        { element: <><i>&#xe905;</i>Editar</>, handler: editHandler },
        { element: <><i>&#xe9ac;</i>Remover</>, handler: deleteHandler }
    ]

    return <>
        <Bar />
        <SideBar />
        <Content includeSubTopBar>
            <TableToolBar
                createHandler={createHandler}
                searchHandler={searchHandler}
            />
            <div className="w-full h-full">
                <Table loading={loadingData}
                    contextMenu={{ buttons: tableContextMenuButtons }}
                    onOrderChange={orderHandler}
                    data={data}
                    disposition={[1, 6, 4, 4]}
                    tableItemHandler={(item) => [
                        item.id, item.nome,
                        <p className="text-right">{beautyNumber(item.preco ?? -1)}</p>,
                        bDate(item.updatedAt),
                        <div className="text-right">{item.tipo ? <i title="Saída" className="text-red-600">&#xea3f;</i> : <i title="Entrada" className="text-green-600">&#xea3b;</i>}</div>
                    ]}
                    tableOrderKeys={["id", "nome", "preco", "updatedAt","tipo"]}
                    tableHeader={[
                        "ID", "Nome", "Preço", "Ultima Atualização","T"
                    ]}
                />
            </div>
        </Content>
    </>
}
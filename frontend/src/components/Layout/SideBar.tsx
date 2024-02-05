import React, { AnchorHTMLAttributes, useState } from "react"
import { Link } from "react-router-dom"

export default function SideBar() {
    return <>
        <header className="bg-sidebar border-r border-borders w-44 mt-14 h-full fixed left-0 top-0 flex flex-col shadow-lg z-50">
            <DropButton
                title="Registro"
                dropDownContent={<>
                    <PanelLink href="/view/produto">Produtos</PanelLink>
                    <PanelLink href="/view/fornecedor">Fornecedores</PanelLink>
                    <PanelLink href="/view/bote">Botes</PanelLink>
                </>}>
                <i>&#xe905;</i> Registro
            </DropButton>
            <DropButton
                title="Entradas"
                dropDownContent={<>
                    <PanelLink href="/create/entrada">Nova Entrada</PanelLink>
                    <PanelLink href="/view/entrada">Listagem</PanelLink>
                </>}>
                <i>&#xe935;</i> Entrada
            </DropButton>
            <DropButton
                title="Relatórios"
                dropDownContent={<>
                    <PanelLink href="/relatorio">Comparativo de Preços</PanelLink>
                </>}>

                <i>&#xe99c;</i> Relatório
            </DropButton>
        </header>

    </>
}

interface DropButtonAttributes extends React.HTMLAttributes<HTMLDivElement> {
    dropDownContent: React.ReactNode | React.ReactNode[],
    title: string
}

function DropButton(props: DropButtonAttributes) {
    const [focused, setFocused] = useState(false)
    const [hover, setHover] = useState(false)
    const [isMouseOverSubPanel, setIsMouseOverSubPanel] = useState(false)
    return <>
        <button className={props.className + " h-14 relative focus:bg-[#0002] hover:bg-[#0001] transition-colors"}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <p className="gap-2 flex px-4 w-full">
                {props.children}
                <span className="ml-auto">&gt;</span>
            </p>
            {
                (focused || isMouseOverSubPanel) ?
                    <header onMouseOver={() => setIsMouseOverSubPanel(true)}
                        onMouseLeave={() => setIsMouseOverSubPanel(false)}
                        className="bg-subpanel outline outline-1 outline-borders min-w-28 w-fit h-fit absolute top-0 left-full flex flex-col text-nowrap shadow-xl">
                        {props.dropDownContent}
                    </header>
                    : null
            }
            {/* {
                hover&&!focused ?
                    <strong className="absolute top-0 left-full p-4 h-full bg-white z-10">{props.title.toUpperCase()}</strong>
                    : null
            } */}
        </button >
    </>
}

function PanelLink(props: React.HTMLAttributes<HTMLAnchorElement> & { href: string }) {
    return <Link className="hover:bg-[#0002] text-zinc-800 text-left h-14 flex items-center px-4" to={props.href}>{props.children}</Link>
}
import React, { useContext, useEffect, useRef, useState } from "react"
import { TableEngineContext } from "../GlobalContexts/TableEngineContext"
import { DefaultFormInput, defaultKeyUpHandler } from "./FormInput"

interface FormPrevisionInputAttributes extends DefaultFormInput {
    placeholder?: string,
    className?: string,
    errored?: boolean,
    name?: string
    searchInTable: allTableNames,
    autoFocus?: boolean,
    where: Object,
    defaultValue?: number
    onChange?: (item: any | null) => void
    onSubmit: () => void,
    itemHandler: (item: any) => React.ReactNode
}

export default function FormPrevisionInput(props: FormPrevisionInputAttributes) {
    const { defaultDataGet } = useContext(TableEngineContext)
    const visibleInputRef = useRef<HTMLInputElement>(null)
    const { where, searchInTable, errored, next, placeholder, autoFocus, name, onChange, itemHandler, className } = props

    const onBlurHandler: EventListener = (e: unknown) => {
        const t = e as React.FocusEvent<HTMLInputElement>
        if (t.target.value == '' || !includeJustNumbers(t.target.value)) {
            setSelectedData([])
            return
        }

        defaultDataGet(searchInTable, { ...where, id: t.target.value }, setSelectedData)
    }
    const inputHandler = () => {

        if (!visibleInputRef.current) return;
        const w: any = {}
        const v = visibleInputRef.current.value
        if (v == "") return;
        if (includeJustNumbers(v))
            w['id'] = v
        else w['nome'] = "^" + v
        defaultDataGet(searchInTable, { ...where, ...w }, setSugestionData)
    }
    const [selectedData, setSelectedData] = useState<Object[]>([])
    const [sugestionData, setSugestionData] = useState<Object & { id: number }[]>([])
    const [inputVisible, setInputVisible] = useState(true)
    const [inputFocus, setInputFocus] = useState(true)


    useEffect(() => {
        visibleInputRef.current?.addEventListener("blur", onBlurHandler)
        visibleInputRef.current?.addEventListener("blur", () => setInputFocus(false))
        visibleInputRef.current?.addEventListener("focus", () => setInputFocus(true))
        onChange ? onChange(props.defaultValue) : null
        
    }, [])

    useEffect(() => {

        if (selectedData.length > 0) setInputVisible(false)
        if (inputFocus) setInputVisible(true)
        if (selectedData.length == 0 || visibleInputRef.current?.value == '') setInputVisible(true)

        if (selectedData.length > 0) {
            onChange ?
                onChange((selectedData[0]))
                : null
        }
        else {
            onChange ?
                onChange(null)
                : null
        }

    }, [selectedData, inputFocus])

    return <div className={`relative box-border top-0 bg-transparent px-3 py-2 border-borders border-input-default rounded-input-default outline-none ${className} ${errored ? " border-red-600" : ""}`}>
        <div className="relative">
            <input className={"w-full bg-transparent outline-none " + (inputVisible ? "" : "fixed -top-64")}
                onInput={inputHandler}
                ref={visibleInputRef}
                name={name}
                placeholder={placeholder}
                type="text"
                autoComplete="off"
                autoCorrect="off"
                autoFocus={autoFocus}
                onKeyUp={(e) => defaultKeyUpHandler(e, next)}
                defaultValue={props.defaultValue}
            />
            <p className={"w-full"}
                style={{ display: inputVisible ? "none" : "block" }}
                tabIndex={1}
                onClick={() => { visibleInputRef.current?.focus() }}
            > {selectedData.map(each => itemHandler(each))}
            </p>
        </div>
        {/* //SEARCH BOX */}
        <Sugestions isVisible={inputFocus} data={sugestionData} inputRef={visibleInputRef} setter={setSelectedData} itemHandler={itemHandler}></Sugestions>
    </div >
}

function Sugestions(props: { data: Object & { id: number }[], itemHandler: (item: Object & { id: number }) => React.ReactNode, inputRef: React.RefObject<HTMLInputElement>, isVisible: boolean, setter: (item: any) => void }) {
    const [hovering, setHovering] = useState(false)
    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        props.inputRef.current?.addEventListener("focus", () => {
            setClicked(false)
        })
    })

    return <div className={`bg-subpanel border-borders border z-40 shadow-lg max-h-96 h-fit overflow-y-auto absolute top-full left-0 w-full flex flex-col justify-start m-o ${(props.isVisible || hovering) && (!clicked && props.data.length > 0) ? "visible" : "invisible"}`}
        onMouseOver={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
    >
        {
            props.data.map(each => <div className="p-4 hover:bg-hovers"
                key={each.id} onClick={() => {
                    if (props.inputRef.current)
                        props.inputRef.current.value = each.id + ''
                    props.setter([each])
                    setClicked(true)
                }}>{props.itemHandler(each)}</div>)
        }
    </div>
}

function includeJustNumbers(s: string) {
    // Percorre cada caractere da string
    for (const char of s) {
        // Se o caractere não for um dígito
        if (isNaN(parseInt(char))) {
            return false;
        }
    }
    // Se todos os caracteres forem dígitos
    return true;
}
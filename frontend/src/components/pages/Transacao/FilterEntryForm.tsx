import { useEffect, useState } from "react";
import FormSelection from "../../OverPageForm/FormSelection";
import OverPageForm, { OverPageFormAttributes, RequiredLabel } from "../../OverPageForm/OverPageForm";
import { TRANSACTION_CLOSED, TRANSACTION_INVALID, TRANSACTION_OPEN } from "../../../constants/codes";
import FormInput from "../../OverPageForm/FormInput";

export default function FilterEntryForm(props: OverPageFormAttributes & { whereSetter: (value: any) => any }) {

    const {whereSetter,...restProps} = props

    const [where, setWhere] = useState<any>({})
    const [maxDate, setMaxDate] = useState<Date>()
    const [minDate, setMinDate] = useState<Date>()
    const setWhereKey = (key: string, val: any) => {
        let mockup: any = where
        if (!val) mockup[key] = ">0"
        else mockup[key] = val
        setWhere({ ...mockup, createdAt: genDateString() })
    }
    useEffect(() => {
        setWhere({ ...where, createdAt: genDateString() })
    }, [ minDate, maxDate])
    const genDateString = () => {
        if (!minDate && !maxDate) return undefined
        let clauses: string[] = []
        if (minDate) clauses.push(">" + minDate.toISOString())
        if (maxDate) clauses.push("<" + maxDate.toISOString())
        return clauses.toString()
    }
    
    return <OverPageForm title="teste" {...props} onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-4">
            <FormSelection useTable="fornecedor" onChange={(e) => setWhereKey('bote.fornecedor.id', e.currentTarget.value)}>
                <option className="bg-background" value={""}>Qualquer Fornecedor</option>
            </FormSelection>
            <FormSelection useTable="bote" onChange={(e) => setWhereKey('bote.id', e.currentTarget.value)}>
                <option className="bg-background" value={""}>Qualquer Bote</option>
            </FormSelection>
            <FormSelection useTable="usuario" onChange={(e) => setWhereKey('usuario.id', e.currentTarget.value)}>
                <option className="bg-background" value={""}>Qualquer Usuário</option>
            </FormSelection>
            <FormSelection onChange={(e) => setWhereKey('status', e.currentTarget.value)}>
                <option className="bg-background" value={TRANSACTION_OPEN}>Em Aberto</option>
                <option className="bg-background" value={""}>Qualquer Status</option>
                <option className="bg-background" value={TRANSACTION_INVALID}>Inválida</option>
                <option className="bg-background" value={TRANSACTION_CLOSED}>Fechada</option>
            </FormSelection>

            <div className="flex gap-4 items-center">
                <FormInput type="date"
                    onChange={(e) => setMinDate(e.currentTarget.valueAsDate ?? undefined)}></FormInput>
                    <p>Até</p>
                <FormInput type="date"
                    onChange={(e) => setMaxDate(e.currentTarget.valueAsDate ?? undefined)}></FormInput>
            </div>
            <FormInput onClick={() => { whereSetter(where); props.onCancel() }} type="submit" value={"Pronto"} />

        </div>
    </OverPageForm>
}
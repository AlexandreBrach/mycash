import { FC, useState } from "react";
import { ExtraitLine } from "../interfaces/extraits";

interface Props {
    onProcess: (note: string) => void;
    abort: () => void;
    line: ExtraitLine | undefined;

}

const EditNote: FC<Props> = ({ onProcess, line, abort }) => {
    const [value, setValue] = useState<string>(line === undefined ? '' : line.note)

    const send = () => {
        onProcess(value);
    };

    return line === undefined ? <></> : <>
        <h1>Edit Notes</h1>
        Notes:
        <textarea value={value} onChange={(e) => setValue(e.target.value)} />
        <button onClick={send}>
            Valider
        </button>
        <button onClick={(e) => abort()}>
            Annuler
        </button>
    </>
}

export default EditNote;
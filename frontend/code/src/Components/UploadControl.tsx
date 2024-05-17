import { FC, useState } from "react";
import factory from "../services/Factory";

interface Props {
    onProcess: () => void;
}

const UploadControl: FC<Props> = ({ onProcess }) => {

    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

    const fileUpload = () => {
        void extraitService.uploadExtraits(selectedFile!);
        onProcess();
    };

    const extraitService = factory.getExtraitsService();

    return (<>
        <input type="file" onChange={(e) => { setSelectedFile(e.target.files![0]) }} />
        {selectedFile === undefined || <p>File Name: {selectedFile.name}</p>}
        {selectedFile === undefined && <p>Choose before Pressing the Upload button</p>}
        <button onClick={fileUpload}>
            Envoyer
        </button></>)
}

export default UploadControl;
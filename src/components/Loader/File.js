import React, { useState } from "react";

function File(props) {
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
    const { inputProps, label, id, name, onChange, disabled, required } = props;

    const debugReadProps = () => {
        console.log("Form.Input :: {Props} = ", props);
    };

    // debugReadProps();

    return (
        <div className="input-field">
            <label className="input-field-label" htmlFor={id ?? `file-input`}>
                <p>{label ?? name}</p>
                <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                />
                <input
                    type="file"
                    className={`input-field-file`}
                    name={name ?? `file-input`}
                    key={id ?? `file-input`}
                    id={id ?? `file-input`}
                    value={selectedFile}
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    required={required ?? ""}
                    disabled={disabled ?? ""}
                />
            </label>
        </div>
    );
}

export default File;

import { Divider } from 'primereact/divider';
import { Password } from 'primereact/password';
import React from 'react'
import "../Components/Styles/PasswordValidation.css";
const PasswordConfig = {
    minLength: 7,
    numberRegex: /\d/,
    specialCharRegex: /[`!@#$%^&*()_+\-=\\[\\]{};':"\\|,.<>\/?~]/,
    overallRegexPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/
}

const PasswordValidation = ({ password, setUserPassword, onBlurFunc }) => {
    const header = <div className="font-bold mb-3">Pick a password</div>;
    const footer = (
        <>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>At least 8 characters</li>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
                <li>Special characters (e.g. !@#$%^&*)</li>
            </ul>
        </>
    );

    // const isNumberIncluded = (value) => {
    //     return PasswordConfig.numberRegex.test(value);
    // };

    // const isSpecialCharIncluded = (value) => {
    //     return PasswordConfig.specialCharRegex.test(value);
    // };

    return (
        <div className="card flex justify-content-center">
            <Password style={{ border: "unset !important" }} value={password} onChange={(e) => setUserPassword(e.target.value)} header={header} footer={footer} onBlur={onBlurFunc} strongRegex={PasswordConfig.overallRegexPattern} toggleMask />
        </div>
    )
}

export default PasswordValidation

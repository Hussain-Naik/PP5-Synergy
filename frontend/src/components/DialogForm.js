import React, { useState } from 'react'
import { axiosReq } from '../api/axiosDefaults'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useCurrentUser } from '../contexts/CurrentUserContext';

const DialogForm = ({url, title, preset, inputData, setInputData, visible, setVisible, setAttribute, edit }) => {
    const currentUser = useCurrentUser()
    const [errors, setErrors] = useState({})


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(edit) {
                const { data } = await axiosReq.put(url, inputData);
                setAttribute(data.name);
                console.log('edit')
                
            }
            else {
                const { data } = await axiosReq.post(url, inputData);
                setAttribute((prevState) => ({
                    ...prevState,
                    results: [data, ...prevState.results],
                }));
                console.log('create')
            }
            
            
        } catch (err) {
            setErrors(err.response?.data);
        }
        setVisible(false)
    }

    const handleChange = (event) => {
        setInputData({
            ...inputData,
            [event.target.name]: event.target.value,
            })
    };

    return (
        <Dialog
                visible={visible}
                modal
                onHide={() => {if (!visible) return; setVisible(false); 
                    setInputData(inputData); }}
                content={({ hide }) => (
                    <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                        <div className="inline-flex flex-column gap-2">
                            <h3 className="text-primary-50 font-semibold">{title}</h3>
                        { Object.entries(inputData).map(([key, value]) => (
                            <>
                            <label htmlFor={key} className="text-primary-50 font-semibold capitalize">
                                {key}
                            </label>
                            <InputText value={value} onChange={handleChange} id={key} label={key} name={key} className="bg-white-alpha-20 border-none p-3 text-primary-50"></InputText>
                            </>
                            )) }  
                            
                        </div>
                        <div className="flex align-items-center gap-2">
                            <Button label="Submit" onClick={handleSubmit} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                            <Button label="Cancel" onClick={(e) => hide(e)} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        </div>
                    </div>
                )}
            ></Dialog>
    )
}

export default DialogForm

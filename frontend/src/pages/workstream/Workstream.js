import React, { useEffect, useState } from 'react'
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { axiosReq } from '../../api/axiosDefaults';

const Workstream = () => {
    const currentUser = useCurrentUser();
    const [errors, setErrors] = useState({});

    const [workstream , setWorkstream] = useState({ results: [] })

    useEffect(() => {
        const handleMount = async () => {
          try {
            const [{ data: workstream }] = await Promise.all([
              axiosReq.get(`api/workstream/${currentUser.default_workstream_id}`),
            ]);
            setWorkstream({ results: [workstream] });
            console.log(workstream);
          } catch (err) {
            console.log(err);
          }
        };
    
        handleMount();
      }, []);

    const [visible, setVisible] = useState(false);
    
    const [inputData, setInputData] = useState({
        name: "",
        other: ""
    });
    const { name, other } = inputData;


    const handleChange = (event) => {
        setInputData({
          ...inputData,
          [event.target.name]: event.target.value,
        });
    };
    
    return (
        <>
        <h2>Workstream</h2>
        <div>
            <h4>Active Workstream</h4>
        </div>
        <div>
            <h4>Available Workstream <Button icon="pi pi-plus" rounded text raised severity="primary" aria-label="Add Workstream" onClick={() => setVisible(true)}/></h4> 
            <h5>list</h5>

        </div>
        <Dialog
                visible={visible}
                modal
                onHide={() => {if (!visible) return; setVisible(false); 
                    setInputData({
                    name: ""
                  }); }}
                content={({ hide }) => (
                    <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                        <div className="inline-flex flex-column gap-2">
                            <label htmlFor="name" className="text-primary-50 font-semibold">
                                Name
                            </label>
                            <InputText value={name} onChange={handleChange} id="name" label="name" name='name' className="bg-white-alpha-20 border-none p-3 text-primary-50"></InputText>
                        </div>
                        <div className="flex align-items-center gap-2">
                            <Button label="Submit" onClick={(e) => hide(e)} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                            <Button label="Cancel" onClick={(e) => hide(e)} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        </div>
                    </div>
                )}
            ></Dialog>
        </>
    )
}

export default Workstream

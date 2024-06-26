import React, { useEffect, useState } from 'react'
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { axiosReq } from '../../api/axiosDefaults';
import axios from "axios";
import Workstream from './Workstream';
import WorkstreamList from './WorkstreamList';

const WorkstreamPage = () => {
    const currentUser = useCurrentUser();
    const [errors, setErrors] = useState({});

    const [workstream , setWorkstream] = useState({ results: [] })
    const [workstreamList , setWorkstreamList] = useState({ results: [] })

    const legendTemplate = (
      <div className="flex align-items-center gap-2 px-2">
          <span className="font-bold">Switchable</span>
          <span className='pi pi-sync text-xl'/>
      </div>
  );

    useEffect(() => {
        const handleMount = async () => {
          try {
            if(currentUser?.default_workstream_id){
              const [{ data: workstreamList },{ data: workstream }] = await Promise.all([
                axiosReq.get(`api/workstream/`),
                axiosReq.get(`api/workstream/${currentUser?.default_workstream_id}`),
              ]);
              setWorkstream({ results: [workstream] });
              setWorkstreamList(workstreamList);
            } else {
              const [{ data: workstreamList }] = await Promise.all([
                axiosReq.get(`api/workstream/`),
              ]);
              setWorkstreamList(workstreamList);
            }
            
            
            console.log(workstream, workstreamList);
          } catch (err) {
            console.log(err);
          }
        };
    
        handleMount();
      }, []);

    const [visible, setVisible] = useState(false);
    
    const [inputData, setInputData] = useState({name: ""});
    const { name } = inputData;


    const handleChange = (event) => {
        setInputData({
          ...inputData,
          [event.target.name]: event.target.value,
        });
    };

    const handleCreate = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axiosReq.post("/api/workstream/", inputData);
        console.log(data)
      } catch (err) {
          setErrors(err.response?.data);
          console.log(errors)
      }
      setVisible(false)
    }

    const btnGroup = (
      <div className={workstream.results.length ? "flex justify-content-center align-items-center gap-2 -my-3" : "flex justify-content-center align-items-center gap-2 -mb-3 mt-1"}>
          <Button icon="pi pi-plus" rounded severity="primary" aria-label="Create Workstream" onClick={() => setVisible(true)}/>
          <Button icon="pi pi-send" rounded severity="primary" aria-label="Send Workstream Join request" />
      </div>
    );
    
    return (
        <>
        { workstream.results.length ? (
          workstream.results.map((object, idx) => (
            <Workstream {...object} key={idx}/>
          ))
        ) : (
          btnGroup
        )}
        { workstream.results.length 
        ? btnGroup
        : null
        }
        <Fieldset style={{height: "70vh"}} className='mx-2 mt-2 text-sm' legend={legendTemplate} toggleable pt={{ legend: { className: "bg-surface p-1 text-md" }, toggler: { className: "p-0" }}}>
          { workstreamList.results.length ? (
            workstreamList.results.map((ws, idx) => (
              ws.id === workstream.results[0]?.id
              ? null
              : (<WorkstreamList {...ws} key={idx}/>)
            ))
          ) : null
          }
        </Fieldset>
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
                            <Button label="Submit" onClick={handleCreate} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                            <Button label="Cancel" onClick={(e) => hide(e)} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        </div>
                    </div>
                )}
            ></Dialog>
        </>
    )
}

export default WorkstreamPage

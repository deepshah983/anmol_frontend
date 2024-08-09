import React from 'react'
import { useState } from 'react';
import DeleteModal from "../../components/Common/DesableEnableModal";

const HideShowSection = () => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [checked, setChecked] = useState(true);
    
    const handelCheck= ()=>{
      if(checked){
        setDeleteModal(true)
      }
      else{
        setChecked(true)
      }
    }
    const handelDeleteClick= ()=>{
      setChecked(false);
      setDeleteModal(false);
    }
    const handelCloseClick= ()=>{
      setChecked(true);
      setDeleteModal(false);
    }

  return (
    <>
    <div></div>
    {/* <div className="form-check form-switch">
        <input className="form-check-input" type="checkbox" role="switch" checked={checked} onChange={() => handelCheck()}
     />
    </div>
    <DeleteModal
        show={deleteModal}
        onDeleteClick={()=> handelDeleteClick()}
        onCloseClick={() => handelCloseClick()}
      /> */}
    </>
  )
}

export default HideShowSection
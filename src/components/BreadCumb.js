import React from 'react';
import { BreadCrumb } from 'primereact/breadcrumb';
import { useUserContext } from "src/contexts/userContext";


export default function BasicDemo() {
    const { user } = useUserContext();
    return (
        <div className="breadcrumb-header justify-content-between">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              {user.current.menuName}
            </li>
          </ol>
        </nav>
      </div>
  
    )
}
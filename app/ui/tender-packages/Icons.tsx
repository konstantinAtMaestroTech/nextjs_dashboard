'use client'

import { Dispatch, SetStateAction } from 'react';
import {ChatIcon, ProductionTag, ComponentsTable, TenderPackageSchema, CurrentSelection, ViewAndPublish } from '@/app/ui/tender-packages/buttons/IconButtons';

interface Viewport {
  activeMenu: string;
  setActiveMenu: Dispatch<SetStateAction<string>>;  
}

export default function Icons({activeMenu, setActiveMenu}: {activeMenu: string, setActiveMenu: Dispatch<SetStateAction<string>>}) {
    return (
        <div
          id="independent-element"
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            top: '10px',
            left: '10px',
            backgroundColor: 'transparent',
            zIndex: 1000,
          }}
        >
          <ProductionTag activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
          <ComponentsTable activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
          <TenderPackageSchema activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
          <CurrentSelection activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
          <ViewAndPublish activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
          <ChatIcon activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
        </div>
    )
}
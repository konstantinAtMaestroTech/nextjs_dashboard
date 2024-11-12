'use client'

import { Dispatch, SetStateAction } from 'react';
import {SupersetData, StatusController} from '@/app/ui/assembly-control/Buttons';
import {SupersetIcon} from '@/app/ui/projects/client/buttons/show-superset';
import {CreateSuperset} from '@/app/ui/projects/client/buttons/show-tools';
import { Session } from 'next-auth';

export interface IconProps {
    activeMenu: string | undefined;
    setActiveMenu: Dispatch<SetStateAction<string | undefined>>;
}

export interface IconsProps {
  activeMenu: string | undefined;
  setActiveMenu: Dispatch<SetStateAction<string | undefined>>;
  session: Session | null
}

export default function Icons({activeMenu, setActiveMenu, session}: IconsProps) {
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
          {/* <Scanner activeMenu={activeMenu} setActiveMenu={setActiveMenu}/> */}
          {session && <CreateSuperset activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>}
          <SupersetIcon activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
          <SupersetData activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
          {session && <StatusController activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>}
        </div>
    )
}
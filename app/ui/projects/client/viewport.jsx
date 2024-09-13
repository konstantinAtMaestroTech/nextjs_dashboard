'use client'

import { initViewer, loadModel } from '@/app/lib/AutodeskViewer/viewer';
import React, { useEffect, useState, useRef } from 'react';
import {ChatIcon} from '@/app/ui/projects/client/buttons/show-chat';
import {SupersetIcon} from '@/app/ui/projects/client/buttons/show-superset';
import {CreateSuperset} from '@/app/ui/projects/client/buttons/show-tools';
import { useSession } from 'next-auth/react';


const Viewport = (props) => {

  const {setViewer, urn, activeMenu, setActiveMenu} = props;

  const session = useSession();
  console.log('This is the session object from the Viewport component ', session)

  // Step 1: Create a ref
  const previewRef = useRef(null);
  const [notification, setNotification] = useState('');

  async function statusCheck(viewer, urn) {
    if (window.statusCheckTimout) {
        clearTimeout(window.statusCheckTimout);
        delete window.statusCheckTimout;
    }
    try {
        const resp = await fetch(`/api/models/${urn}/status`);
        if (!resp.ok) {
            throw new Error(await resp.text());
        }
        const status = await resp.json();
        switch (status.status) {
            case 'n/a':
                showNotification(`Model has not been translated.`);
                break;
            case 'inprogress':
                showNotification(`Model is being translated (${status.progress})...`);
                window.statusCheckTimout = setTimeout(statusCheck, 5000, viewer, urn);
                break;
            case 'failed':
                showNotification(`Translation failed. <ul>${status.messages.map(msg => `<li>${JSON.stringify(msg)}</li>`).join('')}</ul>`);
                break;
            default:
                clearNotification();
                loadModel(viewer, urn);
                break; 
        }
    } catch (err) {
        alert('Could not load model. See the console for more details.');
        console.error(err);
    }
  }

  const showNotification = (message) => {
    setNotification(message);
  };

  const clearNotification = () => {
    setNotification('');
  };

  useEffect(() => {
    // Step 3: Use the ref to pass the container to initViewer
    if (previewRef.current) {
      initViewer(previewRef.current).then(viewer => {
        setViewer(viewer)
        statusCheck(viewer, urn)
      });
    }
  }, []); // Empty dependency array to run only once on mount

  return (
    // Step 2: Attach the ref to the container element
    <>
      <div id="preview" ref={previewRef} style={{ width: '100%', height: '100%' }}>
      </div>
      <div
          id="overlay"
          style={{
            display: notification ? 'flex' : 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          {notification && (
            <div className="notification">
              {notification}
            </div>
          )}
        </div>
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
          <ChatIcon activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
          <SupersetIcon activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
        </div>
        {session?.data?.user?.role === "MaestroTeam" && (<div
          id="independent-element"
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            top: '120px',
            left: '10px',
            backgroundColor: 'transparent',
            zIndex: 1000,
          }}
        >
          <CreateSuperset activeMenu={activeMenu} setActiveMenu={setActiveMenu}/>
        </div>)}
    </>
  );
};

export default Viewport;
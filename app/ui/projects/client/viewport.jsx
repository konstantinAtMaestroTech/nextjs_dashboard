'use client'

import { initViewer, loadModel } from '@/app/lib/AutodeskViewer/viewer';
import React, { useEffect, useState, useRef } from 'react';

const Viewport = (props) => {

  const {setViewer} = props;

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
        statusCheck(viewer, props.urn)
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
    </>
  );
};

export default Viewport;
declare const THREE: typeof import('three');

import { GeometryDataParsed } from '@/app/lib/db/data';
import {useState, useActionState, useEffect, Dispatch, SetStateAction} from 'react';
import {createGeometryData} from '@/app/lib/db/actions';

interface StatusController {
    activeMenu: string | undefined;
    geometryData: GeometryDataParsed;
    setGeometryData: Dispatch<SetStateAction<GeometryDataParsed>>;
    setShowStatus: Dispatch<SetStateAction<boolean>>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    viewer: any;
    room: string;
}

export function getLeafNodes( model: any, dbIds: number[] ): Promise<number[]> {

    return new Promise( ( resolve, reject ) => {

      try {

        const instanceTree = model.getData().instanceTree

        dbIds = dbIds || instanceTree.getRootId();

        const dbIdArray = Array.isArray( dbIds ) ? dbIds : [dbIds]
        let leafIds: number[] = [];

        const getLeafNodesRec = ( id:number ) => {
          let childCount = 0;

          instanceTree.enumNodeChildren( id, ( childId ) => {
              getLeafNodesRec( childId );

              ++childCount;
            })

          if( childCount == 0 ) {
            leafIds.push( id );
          }
        }

        for( let i = 0; i < dbIdArray.length; ++i ) {
          getLeafNodesRec( dbIdArray[i] );
        }

        return resolve( leafIds );

      } catch (ex) {

        return reject(ex)
      }
  })
}

const statusOptions = ['M', 'D'];

export function getColorForStatus(status: string) {

    switch (status) {
        case statusOptions[0]:
            return new THREE.Vector4(0.0, 1.0, 0.0, 1.0);
        case statusOptions[1]:
            return new THREE.Vector4(1.0, 1.0, 0.0, 1.0);
        // Add more cases as needed
        default:
            return
    }
};

export default function StatusController({activeMenu, geometryData, setGeometryData, viewer, room, setShowStatus, setIsLoading}: StatusController) {

    const [selectedNodes, setSelectedNodes] = useState<number[]>([])
    // the problem with this state declaration that if the user first selects the 
    // geometries and them opens the window the component does not recognize the
    // already selected geometries. This is easy to fix maybe i will do it later
    const initialState = {message:null, errors: {}};
    const [state, formAction] = useActionState(createGeometryData, initialState);
    const [status, setStatus] = useState<string>('');
    const [instanceTree, setInstanceTree] = useState<any | undefined>(viewer.model.getData().instanceTree)
    const [shouldSubmit, setShouldSubmit] = useState(false); // i am not sure that the way i submit things is right

    useEffect(() => {
        if (viewer) {
          viewer.addEventListener(window.Autodesk.Viewing.SELECTION_CHANGED_EVENT, onSelectionChanged);
        }
        return () => { 
            viewer.removeEventListener(window.Autodesk.Viewing.SELECTION_CHANGED_EVENT, onSelectionChanged)
        }
    }, [viewer]);

    useEffect(() => {
        if (shouldSubmit) {
            document.getElementById("create-geometry-data")?.requestSubmit();
            setShouldSubmit(false);
        }
    }, [shouldSubmit]);

    useEffect(() => {
        setShowStatus(true);
        return () => {
            setShowStatus(false);
        }
    }, []);

    // here we need to check one more little, There are some geometries that 
    // do not fit in our nested blocks logic and are embedded directly inside of
    // the rootNode (node ID is 1). So when they get accidentially selected the root
    // id gets selected as well which causes the whole model to be painted. To fix it at 
    // this stage I will just hardcode to exclude the 1 id

    function onSelectionChanged(event: any) {
        const parentsArray: number[] = event.dbIdArray
            .map((dbid: number) => instanceTree.getNodeParentId(dbid))
            .filter((parentId: number) => parentId !== 1);
        const uniqueParents = [...new Set(parentsArray)];
        setSelectedNodes(uniqueParents);
    }


    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(event.target.value); 
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setGeometryData((prevState) => {
            const newGeometryState = {...prevState.geometry_state}
            selectedNodes.forEach((dbid) => {
                newGeometryState[dbid] = status;
            });
            return {
                geometry_state: newGeometryState
            }
        });
        setShouldSubmit(true)
    }

    

    return (
        <form
            action={formAction}
            id='create-geometry-data'
        >
            <div id='superset' className='absolute bg-white'
            style={{ 
                left: 56,
                top: 10,
                zIndex: 1001, 
                overflow: 'auto',
                maxWidth: '200px', // Set the maximum width
            }}
            >
                <div className='flex flex-col'>
                    <div id='header' className='flex p-4 items-center bg-gray-300'>
                        <span id='headertitle' className='text-white text-lg font-semibold'>
                            UPDATE STATUS
                        </span>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <div className="break-words text-center">
                            {`The number of elements selected is ${selectedNodes.length}`}
                        </div>
                        <select id="options" value={status} onChange={handleStatusChange}>
                            <option value="">Select an option</option>
                            {statusOptions.map((status, index) => {
                                let displayName;
                                switch (status) {
                                    case 'M':
                                        displayName = 'Mounted';
                                        break;
                                    case 'D':
                                        displayName = 'Delivered';
                                        break;
                                    default:
                                        displayName = status;
                                }
                                return (
                                    <option key={index} value={status}>
                                        {displayName}
                                    </option>
                                );
                            })}
                        </select>
                        <input 
                            type='text'
                            name='geometry-data'
                            value={JSON.stringify(geometryData)}
                            readOnly
                            hidden
                        />
                        <input 
                            type='text'
                            name='client-view-id'
                            value={room}
                            readOnly
                            hidden
                        />
                    </div>
                    <div 
                        className='flex w-full p-4 items-center justify-center bg-gray-100 hover:bg-[rgba(255,60,0)] hover:text-white'
                        id='view_default'
                    >
                        <button 
                            id='default' 
                            className='text-lg font-semibold'
                            type='button'
                            onClick={handleClick}
                        >
                            UPDATE STATUS
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )

}
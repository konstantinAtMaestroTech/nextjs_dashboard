'use client'

import {useState, Dispatch, SetStateAction, FormEvent} from 'react';
import clsx from 'clsx';

interface ProductionTag {
    leafNode: string;
    setLeafNode: Dispatch<SetStateAction<string>>;
    activeMenu: string;
}

export default function ProductionTag({leafNode, activeMenu, setLeafNode}: ProductionTag): JSX.Element {

    const [productionTagInput, setProductionTagInput] = useState('')
    
    const handleProductionTag = (e: FormEvent) => {
        e.preventDefault();
        setLeafNode(productionTagInput);
        setProductionTagInput('');
    }

    return (
        <div id='production_tag' className={clsx('absolute bg-white', {
            'hidden': activeMenu !== "production_tag"
        })} style={{ 
            height: 'calc(70vh - 104.5px)', // i leave it this way as a reminder about the workaround i had to do to calculate the height of the element when it was full-width
            width: '25%',
            left: 56,
            top: 10,
            right: 0,
            bottom: 0,
            zIndex: 1001, 
            overflow: 'auto'
        }}>
            <div className="flex flex-col p-2 gap-2">
                <span className="flex justify-center items-center p-2"> <strong>PRODUCTION TAG</strong> </span>
                <span> Current Production Tag is: {leafNode} </span>
                <form onSubmit={handleProductionTag}>
                    <input
                        type='text'
                        placeholder='Please enter the Production Tag'
                        value={productionTagInput}
                        onChange={(e) => setProductionTagInput(e.target.value)}
                        className="border p-2"
                    />
                    <button className="border">
                        Set
                    </button>
                </form>
            </div>
        </div>
    )
}
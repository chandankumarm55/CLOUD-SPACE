import { addDoc, collection } from 'firebase/firestore';
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { firestore } from '../firebase';
import { FaFolderPlus } from "react-icons/fa";
import { addFolder } from '../store/file';
import './AddFolder.css';

const AddFolder = ({ setCurrentFolder }) => {
    const { currentFolder } = useSelector((state) => state.files);
    const [isOpen, setIsOpen] = useState(false);
    const folders = useSelector((state) => state.files.folders);
    const [folderName, setFolderName] = useState('');
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const formRef = useRef(null);

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!folderName || !user) return;

        const folderDoc = {
            name: folderName,
            userId: user?.uid,
            parent: currentFolder?.id,
            path: currentFolder.path === 'root' ? folderName : `${currentFolder.path}/${folderName}`
        };

        try {
            const docRef = await addDoc(collection(firestore, 'folders'), folderDoc);
            dispatch(addFolder({ ...folderDoc, id: docRef.id }));
            toast.success('Folder created successfully');
            setFolderName('');
            setIsOpen(false);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <>
            <div className='add-folder'>
                <button onClick={ () => setIsOpen(!isOpen) }> <FaFolderPlus size={ 30 } /></button>
                { isOpen && (
                    <div className='modal-overlay'>
                        <form className='folder-form' ref={ formRef }>
                            <input
                                type='text'
                                value={ folderName }
                                placeholder='New Folder Name'
                                onChange={ e => setFolderName(e.target.value) }
                            />
                            <button onClick={ handleCreateFolder }>Create Folder</button>
                        </form>
                    </div>
                ) }
            </div>
        </>
    );
};

export default AddFolder;

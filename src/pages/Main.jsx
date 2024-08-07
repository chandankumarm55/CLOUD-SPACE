import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState, useRef } from 'react';
import { auth, firestore, storage } from '../firebase';
import { setUser } from '../store/user';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { FaFile } from "react-icons/fa";
import { addFiles, setCurrentFolder, setFiles, setFolder } from '../store/file';
import Folder from '../components/AddFolder';
import Navbar from '../components/Navbar';
import ShowFileFolder from '../components/ShowFile&Folder';
import Breadrumbs from '../components/Breadrumbs';
import './login&register.css'

const Main = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const { currentFolder } = useSelector((state) => state.files);
    const { user } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const [fileToUpload, setFileToUpload] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            dispatch(setUser(user));
            if (!user) {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [user, dispatch, navigate]);

    useEffect(() => {
        if (!user) return;
        setLoading(true)
        const fetchFilesAndFolders = async () => {
            const folderQuery = query(collection(firestore, 'folders'), where('userId', '==', user.uid));
            const fileQuery = query(collection(firestore, 'files'), where('userId', '==', user.uid));

            try {
                const filesSnapshot = await getDocs(fileQuery);
                const foldersSnapshot = await getDocs(folderQuery);

                const fetchedFiles = filesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const fetchedFolders = foldersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                dispatch(setFiles(fetchedFiles));
                dispatch(setFolder(fetchedFolders));
                setLoading(false)
            } catch (error) {
                console.error(error.message);
                toast.error(error.message);
                setLoading(false)
            }
        };

        fetchFilesAndFolders();
    }, [user, dispatch]);

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!fileToUpload) return;
        const folderPath = currentFolder.path === 'root' ? '' : `${currentFolder.path}/`;
        const storageRef = ref(storage, `files/${user.uid}/${folderPath}${fileToUpload.name}`);
        const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

        uploadTask.on('state_changed',
            (snapshot) => { },
            (error) => {
                console.error("Error uploading file: ", error);
                toast.error("Error uploading file: " + error.message);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                const fileDoc = {
                    name: fileToUpload?.name,
                    url: downloadURL,
                    userId: user?.uid,
                    folder: currentFolder?.id,
                };

                await addDoc(collection(firestore, 'files'), fileDoc);
                dispatch(addFiles(fileDoc));
                setFileToUpload(null);
                setIsOpen(false)
                toast.success('File uploaded');
            }
        );
    };

    const handleFileChange = (e) => {
        setFileToUpload(e.target.files[0]);
    };

    const handleClickOutside = (e) => {
        if (formRef.current && !formRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
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
        <div className="home-container">
            <Navbar />
            {
                loading ? (
                    <div className='loading'>
                        <div class="loader"></div>
                    </div>

                ) : (
                    <>
                        <div className="folder-file">
                            <div className="file">
                                <button onClick={ () => setIsOpen(!isOpen) }><FaFile size={ 30 } /></button>
                                { isOpen && (
                                    <div className="modal-overlay">
                                        <form onSubmit={ handleFileUpload } className='file-open' ref={ formRef }>
                                            <input type='file' onChange={ handleFileChange } />
                                            <button type='submit'>Upload file</button>
                                        </form>
                                    </div>
                                ) }
                            </div>
                            <Folder currentFolder={ currentFolder } />
                        </div>
                        <Breadrumbs setCurrentFolder={ (folder) => dispatch(setCurrentFolder(folder)) } />
                        <ShowFileFolder setCurrentFolder={ (folder) => dispatch(setCurrentFolder(folder)) } />
                    </>
                )
            }


        </div>
    );
}

export default Main;

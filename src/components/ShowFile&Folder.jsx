import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './ShowFile_Folder.css'
import toast from 'react-hot-toast'
import { firestore, storage } from '../firebase'
import { removeFolder, removeFile } from '../store/file'
import { doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'

const ShowFile_Folder = ({ setCurrentFolder }) => {
    const dispatch = useDispatch()
    const files = useSelector((state) => state.files.files)
    const currentFolder = useSelector((state) => state.files.currentFolder);
    const { folders } = useSelector(state => state.files)
    const [openMenuId, setOpenMenuId] = useState(null)
    const menuRef = useRef(null);

    const getIconUrl = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'];
        const pdfExtensions = ['pdf'];
        const docExtensions = ['doc', 'docx'];
        const pptExtensions = ['ppt', 'pptx'];
        const xlsExtensions = ['xls', 'xlsx'];

        if (imageExtensions.includes(extension)) {
            return "https://icones.pro/wp-content/uploads/2021/06/icone-d-image-rouge.png";
        } else if (pdfExtensions.includes(extension)) {
            return "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg";
        } else if (docExtensions.includes(extension)) {
            return "https://icones.pro/wp-content/uploads/2021/06/icone-d-image-rouge.png";
        } else if (pptExtensions.includes(extension)) {
            return "https://upload.wikimedia.org/wikipedia/commons/8/87/Presentation_file_icon.svg";
        } else if (xlsExtensions.includes(extension)) {
            return "https://upload.wikimedia.org/wikipedia/commons/8/87/Spreadsheet_file_icon.svg";
        } else {
            return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn8m-njkuCtIAeknwBN9lXZSHmx7gqQiIhrw&s";
        }
    };

    const copyLink = (fileUrl) => {
        try {
            navigator.clipboard.writeText(fileUrl)
            toast.success('Link Copied To Clipboard')
        } catch (error) {
            toast.error('Failed to Copy Link')
        }
    }

    const handleDeleteFolder = async (folder) => {
        try {
            // First, delete all files in this folder
            const filesQuery = query(
                collection(firestore, 'files'),
                where('folder', '==', folder.id)
            );
            const filesSnapshot = await getDocs(filesQuery);

            // Delete each file from Firestore and Storage
            const fileDeletePromises = filesSnapshot.docs.map(async (fileDoc) => {
                const fileData = fileDoc.data();
                // Delete file from Storage
                const fileRef = ref(storage, fileData.url);
                await deleteObject(fileRef);

                // Delete file document from Firestore
                await deleteDoc(doc(firestore, 'files', fileDoc.id));

                // Remove file from Redux store
                dispatch(removeFile(fileDoc.id));
            });

            await Promise.all(fileDeletePromises);

            // Delete the folder document
            await deleteDoc(doc(firestore, 'folders', folder.id));

            // Remove folder from Redux store
            dispatch(removeFolder(folder.id));

            toast.success('Folder and its contents Deleted Successfully');
            setOpenMenuId(null);
        } catch (error) {
            console.error('Error deleting folder:', error);
            toast.error('Failed to Delete Folder');
        }
    }

    const handleDeleteFile = async (file) => {
        try {
            // Delete file from Storage
            const fileRef = ref(storage, file.url);
            await deleteObject(fileRef);

            // Delete file document from Firestore
            await deleteDoc(doc(firestore, 'files', file.id));

            // Remove file from Redux store
            dispatch(removeFile(file.id));

            toast.success('File Deleted Successfully');
            setOpenMenuId(null);
        } catch (error) {
            console.error('Error deleting file:', error);
            toast.error('Failed to Delete File');
        }
    }

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    }

    useEffect(() => {
        const handleClicks = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null)
            }
        }
        document.addEventListener('mousedown', handleClicks);
        return () => {
            document.removeEventListener('mousedown', handleClicks)
        }
    }, [menuRef])

    return (
        <div>
            <div className="file-folder-list">
                <div className='all-folders'>
                    {
                        folders.filter(folder => folder.parent === currentFolder.id).map((folder, index) => (
                            <div className='folders' key={ index }>
                                <span onClick={ (e) => { e.stopPropagation(); toggleMenu(folder.id); } }>⋮</span>
                                {
                                    openMenuId === folder.id && (
                                        <div ref={ menuRef } className='options-menu'>
                                            <p onClick={ () => handleDeleteFolder(folder) }>Delete Folder</p>
                                        </div>
                                    )
                                }
                                <h4 onClick={ () => setCurrentFolder(folder) }>{ folder.name }</h4>
                            </div>
                        ))
                    }
                </div>

                <div className='all-files'>
                    {
                        files.filter(file => file.folder === currentFolder.id).map((file, index) => (
                            <div key={ index } className='files-photo'>
                                <span onClick={ (e) => { e.stopPropagation(); toggleMenu(file.id); } }>⋮</span>
                                {
                                    openMenuId === file.id && (
                                        <div ref={ menuRef } className='options-menu'>
                                            <p onClick={ () => copyLink(file.url) }>Share Link</p>
                                            <p onClick={ () => handleDeleteFile(file) }>Delete</p>
                                        </div>
                                    )
                                }
                                <img src={ getIconUrl(file.url) } alt={ file.name } onClick={ () => window.open(file.url) } />
                                <h4 onClick={ () => window.open(file.url) }>{ file.name }</h4>
                            </div>
                        ))
                    }{
                        files.length === 0 && folders.length === 0 && currentFolder.id === 'root' && (
                            <div className='nofile-nofolder'>
                                <p>Let's get started, add a new file or create a new folder</p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ShowFile_Folder
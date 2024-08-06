import React from 'react';
import { useSelector } from 'react-redux';
import './Bread.css';

const Breadcrumbs = ({ setCurrentFolder }) => {
    const { folders } = useSelector((state) => state.files);
    const { currentFolder } = useSelector((state) => state.files);

    const currentFolderObject = folders.find(f => f.id === currentFolder?.id);

    const getPath = (folder) => {
        const path = [];
        let current = folder;
        while (current && current.name !== 'root') {
            path.unshift({ name: current.name, id: current.id });
            current = folders.find(f => f.id === current.parent);
        }
        return [{ name: 'Root', id: 'root' }, ...path];
    };

    return (
        <div className='breadcrumbs'>
            { currentFolderObject ? (
                getPath(currentFolderObject).map((folder, index) => {
                    const handleClick = () => {
                        setCurrentFolder(folder);
                    };

                    return (
                        <span key={ folder.id }>
                            <p onClick={ handleClick }>
                                { folder.name }
                                { index < getPath(currentFolderObject).length - 1 && ' / ' }
                            </p>
                        </span>
                    );
                })
            ) : (
                'Root'
            ) }
        </div>
    );
};

export default Breadcrumbs;

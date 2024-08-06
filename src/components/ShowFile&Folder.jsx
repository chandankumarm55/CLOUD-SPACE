import React from 'react'
import { useSelector } from 'react-redux'
import './ShowFile_Folder.css'

const ShowFile_Folder = ({ setCurrentFolder }) => {
    const files = useSelector((state) => state.files.files)
    const currentFolder = useSelector((state) => state.files.currentFolder);
    const { folders } = useSelector(state => state.files)

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

    return (
        <div>
            <div className="file-folder-list">
                <div className='all-folders'>
                    {
                        folders.filter(folder => folder.parent === currentFolder.id).map((folder, index) => (
                            <div className='folders' key={ index } onClick={ () => setCurrentFolder(folder) }>
                                <h4>{ folder.name }</h4>
                            </div>
                        ))
                    }
                </div>

                <div className='all-files'>
                    {

                        files.filter(file => file.folder === currentFolder.id).map((file, index) => (
                            <div key={ index } className='files-photo' onClick={ () => window.open(file.url) }>
                                <img src={ getIconUrl(file.url) } alt={ file.name } />
                                <h4>{ file.name }</h4>
                            </div>
                        ))
                    }{
                        files.length === 0 && folders.length === 0 && (
                            <div className='nofile-nofolder'>

                                <p>Let's get  starts , add new file or create new folder</p>


                            </div>

                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ShowFile_Folder

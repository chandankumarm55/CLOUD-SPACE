import { createSlice } from "@reduxjs/toolkit";

const fileSlice = createSlice({
    name: 'files',
    initialState: {
        files: [],
        folders: [],
        currentFolder: { id: 'root', path: 'root' }
    },
    reducers: {
        setFiles: (state, action) => {
            state.files = action.payload
        },
        setFolder: (state, action) => {
            state.folders = action.payload
        },
        addFiles: (state, action) => {
            state.files.push(action.payload)
        },
        addFolder: (state, action) => {
            state.folders.push(action.payload)
        },
        setCurrentFolder: (state, action) => {
            state.currentFolder = action.payload;
        }
    }
})

export const { setFiles, setFolder, addFiles, addFolder, setCurrentFolder } = fileSlice.actions;
export default fileSlice.reducer;
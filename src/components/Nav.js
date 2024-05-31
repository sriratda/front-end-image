import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";
import { FaRegPenToSquare } from "react-icons/fa6";
import { FaFileDownload, FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import data from './data'; // Assuming data is exported from data.js
const apiUrl = process.env.REACT_APP_API_BASE_URL;


export default function Nav({ setShowContent, setKey }) {
    const [setting, setSetting] = useState(false);
    const [selectedProcess, setSelectedProcess] = useState(0);
    const [files, setFiles] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState(1);
    const [editingProcessId, setEditingProcessId] = useState(null);
    const [renameValue, setRenameValue] = useState(""); // State for storing input value

    const date = new Date();
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);

    const handleDragOver = (e) => {
        e.preventDefault(); // Prevent the default behavior
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const newFiles = e.dataTransfer.files;
        setFiles(currentFiles => [...currentFiles, ...newFiles]);

        // Display preview of the first image
        if (newFiles.length > 0 && newFiles[0].type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(newFiles[0]);
        }
    };

    const showContent = (id) => {
        setSelectedProcess(id);
        console.log(id)

        // fetch data here
    }

    const handleFileSelect = (e) => {
        e.preventDefault();
        const newFiles = e.target.files;
        setFiles(currentFiles => [...currentFiles, ...newFiles]);

        // Display preview of the first image
        if (newFiles.length > 0 && newFiles[0].type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(newFiles[0]);
        }
    };

    const processImg = async (e) => {
        e.preventDefault();

        // Ensure that files array has at least one file
        if (files.length > 0) {
            const formData = new FormData();
            formData.append('image', files[0]); // Assuming only one file is selected
            formData.append('size', selectedSize); // Include selected size in the form data

            alert("Wait Processing...");
            try {
                const response = await fetch(`${apiUrl}/`, {
                    method: 'POST',
                    body: formData, // Send formData as the request body
                });
                const result = await response.json();
                console.log('Server response:', result);
                alert("Process success!");
    
                // Save the base64 images and message in local storage
                if (result.image1_base64 && result.image2_base64) {
                    localStorage.setItem('image1_base64', result.image1_base64);
                    localStorage.setItem('image2_base64', result.image2_base64);
                    localStorage.setItem('uploadMessage', result.message);
                
                    // Update the state to show Content.js
                    setShowContent(true);
                    setKey(prevKey => prevKey + 1); // increment key to force re-render of Content
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const handleReset = () => {
        setFiles([]);
        setPreviewImage(null);
    };

    const showSetting = (id) => {
        setSetting(id === selectedProcess ? !setting : true);
    }

    const toggleEditForm = (id) => {
        if (id === editingProcessId) {
            setEditingProcessId(null);
            setRenameValue(""); // Reset rename value when closing edit form
        } else {
            const process = data.find(process => process.id === id);
            setEditingProcessId(id);
            setRenameValue(process.title); // Set rename value to process title when opening edit form
        }
    };

    const handleRename = (id, newName) => {
        console.log(`Renaming process with id ${id} to ${newName}`);
        setEditingProcessId(null); // Close edit form
        setRenameValue(""); // Reset rename value
    }

    const handleDelete = (id, title) => {
        const confirmed = window.confirm(`You want to delete '${title}'`);

        if(confirmed){
            console.log(`Deleting process with id ${id}`);
        }
    }

    const todayProcesses = data.filter(process => process.timeStamp.includes(date.toDateString()));
    const previousProcesses = data.filter(process => !process.timeStamp.includes(date.toDateString()) && !process.timeStamp.includes(yesterday.toDateString()));

    return (
        <nav>
            <div className='logo'>
                {/* <img src='/OIG4.png' alt="logo" /> */}
                <h1>PHUSIT LAB</h1>
                <p class="version">demo v 0.0.1</p>
            </div>
            <div className='nav-link'>
                <div className='row'>
                    <p className={`nav-list ${selectedProcess === 0 ? 'active' : 'hide'}`} onClick={() => showContent(0)}>New process <FaRegPenToSquare /></p>
                    <div className={`content new-tab ${selectedProcess === 0 ? 'show' : 'hide'}`}>
                        <form className="row" onSubmit={processImg}>
                            <div className="row-content">
                                <p>Size :</p>
                                <select name="size" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                                    <option value={1}>1 In</option>
                                    <option value={1.5}>1.5 In</option>
                                    <option value={3}>3 In</option>
                                </select>
                            </div>
                            <div
                                className="preview"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >
                                {previewImage ? (
                                    <div className="preview-file">
                                        <img src={previewImage} alt="Preview" />
                                        <p type="reset" onClick={handleReset} className="clear-btn"><TiDelete /></p>
                                    </div>
                                ) : (
                                    <div className="input-file">
                                        <FaFileDownload className="icon-file" />
                                        <p>Drag & Drop File<i> (jpg, png, jpeg)</i>.</p>
                                        <input type="file" onChange={handleFileSelect} accept=".jpg, .png, .jpeg" />
                                    </div>
                                )}
                            </div>
                            <div className="row-content process">
                                <button type="submit">Process</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='row'>
                    <p className="h-title">วันนี้</p>
                    {todayProcesses.map(process => (
                        <div key={process.id}>
                        <div className={`nav-list ${selectedProcess === process.id ? 'active' : 'hide'}`} onClick={() => showContent(process.id)}>
                        <p className="title">{process.title}</p>
                        <div className={`setting-btn ${selectedProcess === process.id ? 'show-setting' : 'hide-setting'}`}>
                            <div className="edit">
                                <FaPen onClick={() => toggleEditForm(process.id)} className="edit-btn"/>
                                {editingProcessId === process.id && (
                                    <form className={`edit-form`}>
                                        <input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
                                        <div className="action-btn">
                                        <button onClick={() => handleRename(process.id, renameValue)}>Rename</button>
                                        <button onClick={() => toggleEditForm(process.id)} className="cancle-btn">Cancel</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                            <div className="delete delete-btn" onClick={() => handleDelete(process.id, process.title)}><MdDelete /></div>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                <div className='row'>
                    <p className="h-title">ก่อนหน้า</p>
                    {previousProcesses.map(process => (
                        <div key={process.id}>
                            <div className={`nav-list ${selectedProcess === process.id ? 'active' : 'hide'}`} onClick={() => showContent(process.id)}>
                            <p className="title">{process.title}</p>
                            <div className={`setting-btn ${selectedProcess === process.id ? 'show-setting' : 'hide-setting'}`}>
                                <div className="edit">
                                    <FaPen onClick={() => toggleEditForm(process.id)} className="edit-btn"/>
                                    {editingProcessId === process.id && (
                                        <form className={`edit-form`}>
                                            <input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
                                            <div className="action-btn">
                                            <button onClick={() => handleRename(process.id, renameValue)}>Rename</button>
                                            <button onClick={() => toggleEditForm(process.id)} className="cancle-btn">Cancel</button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                                <div className="delete delete-btn" onClick={() => handleDelete(process.id, process.title)}><MdDelete /></div>
                            </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </nav>
    );
}

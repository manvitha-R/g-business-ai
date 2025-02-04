// import React, { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/router";
// import axios from "axios";
// import { Pie, Bar, Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
// } from "chart.js";
// import { FaPlay, FaEdit, FaTrash, FaFileUpload, FaPen, FaTimes, FaUpload, FaCaretDown, FaCaretUp } from "react-icons/fa";
// import { useDropzone } from "react-dropzone";
// import Header from "./Header";
// import Table from "./Table";
// import styles from '../styles/Content.module.css';

// ChartJS.register(
//   ArcElement,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement
// );

// const Content = ({ currentCase }) => {
//   const router = useRouter();
//   const { mainboardId, boardId, tableId } = router.query;

//   const textareaRef = useRef(null);
//   const [data, setData] = useState([]);
//   const [showCharts, setShowCharts] = useState(false);
//   const [aiDocsFiles, setAiDocsFiles] = useState([]);
//   const [view, setView] = useState("manage-tables");
//   const [activeTab, setActiveTab] = useState("Manage Prompts");
//   const [prompts, setPrompts] = useState([]);
//   const [isAddingPrompt, setIsAddingPrompt] = useState(false);
//   const [isEditingPrompt, setIsEditingPrompt] = useState(false);
//   const [newPromptName, setNewPromptName] = useState("");
//   const [editPromptId, setEditPromptId] = useState(null);
//   const [runResult, setRunResult] = useState(null);
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editRow, setEditRow] = useState(null);
//   const [formData, setFormData] = useState({
//     tableName: "",
//     tableDescription: "",
//   });
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedTableId, setSelectedTableId] = useState(null);
//   const [isResultModalOpen, setIsResultModalOpen] = useState(false);
//   const [selectedPrompt, setSelectedPrompt] = useState("");
//   const [loadingManagePrompts, setLoadingManagePrompts] = useState(false);
//   const [loadingManageTables, setLoadingManageTables] = useState(false);
//   const [loadingPromptPlay, setLoadingPromptPlay] = useState(null);
//   const [loadingPromptsRepository, setLoadingPromptsRepository] = useState(null);
//   const [expandedRow, setExpandedRow] = useState(null);
//   const [editRowId, setEditRowId] = useState(null);
//   const [editValues, setEditValues] = useState({});
//   const [docId, setDocId] = useState(null);

//   const handleToggleDropdown = (id) => {
//     setExpandedRow(expandedRow === id ? null : id);
//   };

//   const handleInputChange = (e) => {
//     setNewPromptName(e.target.value);
//     const textarea = textareaRef.current;
//     if (textarea) {
//       textarea.style.height = "auto";
//       textarea.style.height = textarea.scrollHeight + "px";
//     }
//   };

//   const onDrop = (acceptedFiles) => {
//     setSelectedFile(acceptedFiles[0]);
//   };

//   const handleMonthChange = (event) => {
//     setSelectedMonth(event.target.value);
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: ".csv",
//     multiple: false,
//   });

//   useEffect(() => {
//     const fetchPrompts = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `https://llm-backend-lcrqhjywba-uc.a.run.app/main-boards/boards/prompts/boards/${boardId}`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch prompts");
//         }
//         const data = await response.json();
//         setPrompts(data);
//       } catch (error) {
//         console.error("Error fetching prompts:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (boardId) {
//       fetchPrompts();
//     }
//   }, [boardId]);

//   const handleAddPrompt = () => {
//     setIsAddingPrompt(true);
//     setNewPromptName("");
//     setIsEditingPrompt(false);
//   };

//   const handleEditPrompt = (prompt) => {
//     setIsEditingPrompt(true);
//     setIsAddingPrompt(false);
//     setNewPromptName(prompt.prompt_text);
//     setEditPromptId(prompt.id);
//   };

//   const handleSavePrompt = async (e) => {
//     e.preventDefault();

//     if (!newPromptName || newPromptName.length > 255) {
//       console.error("Prompt must be between 1 and 255 characters");
//       return;
//     }

//     if (!boardId) {
//       console.error("boardId is undefined");
//       return;
//     }

//     const promptData = {
//       board_id: boardId,
//       prompt_text: newPromptName,
//       prompt_out: "out_string",
//       user_name: "Shashi Raj",
//     };

//     console.log("Sending prompt data:", promptData);

//     try {
//       const response = isEditingPrompt
//         ? await fetch(
//           `https://llm-backend-lcrqhjywba-uc.a.run.app/main-boards/boards/prompts/${editPromptId}`,
//           {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(promptData),
//           }
//         )
//         : await fetch(
//           `https://llm-backend-lcrqhjywba-uc.a.run.app/main-boards/boards/prompts/`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(promptData),
//           }
//         );

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Error details:", errorData);
//         throw new Error("Failed to save new prompt: " + errorData.message);
//       }

//       const newPromptData = await response.json();
//       if (isEditingPrompt) {
//         setPrompts((prevPrompts) =>
//           prevPrompts.map((prompt) =>
//             prompt.id === editPromptId ? newPromptData : prompt
//           )
//         );
//       } else {
//         setPrompts((prevPrompts) => [...prevPrompts, newPromptData]);
//       }
//       handleCancelPrompt();
//     } catch (error) {
//       console.error("Error saving new prompt:", error);
//     }
//   };

//   const handleDeletePrompt = async (promptId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this prompt?"
//     );
//     if (!confirmDelete) return;

//     try {
//       const response = await fetch(
//         `https://llm-backend-lcrqhjywba-uc.a.run.app/main-boards/boards/prompts/${promptId}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Error details:", errorData);
//         throw new Error("Failed to delete prompt: " + errorData.message);
//       }

//       setPrompts((prevPrompts) =>
//         prevPrompts.filter((prompt) => prompt.id !== promptId)
//       );
//       console.log("Prompt deleted successfully");
//     } catch (error) {
//       console.error("Error deleting prompt:", error);
//     }
//   };

//   const handleRunnPrompt = async (promptText) => {
//     if (!promptText) {
//       console.error("Prompt cannot be empty");
//       return;
//     }

//     try {
//       const url = new URL(
//         "https://llm-backend-lcrqhjywba-uc.a.run.app/main-boards/boards/prompts/run_prompt_v2"
//       );

//       url.searchParams.append("input_text", promptText);
//       url.searchParams.append("board_id", boardId.toString());
//       url.searchParams.append("user_name", "Shashi Raj");
//       url.searchParams.append("use_cache", "true");

//       console.log("Making request to:", url.href);

//       const response = await axios.post(url.href, {
//         input_text: promptText,
//         board_id: boardId,
//         user_name: "Shashi Raj",
//         use_cache: true,
//       });

//       if (response?.data) {
//         console.log("Prompt run successfully:", response.data);
//         setRunResult(response.data);
//       } else {
//         console.error("API response is not valid.");
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error(
//           "Error running prompt:",
//           error.response?.data || error.message
//         );
//       } else {
//         console.error("Unexpected error:", error);
//       }
//     }
//   };

//   const handlePlayClick = async (prompt) => {
//     setLoadingPromptPlay(prompt.id);
//     const promptText =
//       typeof prompt === "object" && prompt.prompt_text
//         ? prompt.prompt_text
//         : prompt;

//     console.log("Play button clicked, opening modal for prompt:", promptText);
//     setSelectedPrompt(promptText);

//     try {
//       await handleRunnPrompt(promptText);
//       setIsResultModalOpen(true);
//       console.log("Is modal open:", isResultModalOpen);
//     } catch (error) {
//       console.error("error running prompt", error);
//     } finally {
//       setLoadingPromptPlay(null);
//     }
//   };

//   const closeResultModal = () => {
//     setIsResultModalOpen(false);
//     setRunResult(null);
//   };

//   const handleRePrompt = async () => {
//     try {
//       const response = await axios.post(
//         'https://llm-backend-lcrqhjywba-uc.a.run.app/main-boards/boards/prompts/re_prompt',
//         null,
//         {
//           params: {
//             input_text: newPromptName,
//             board_id: boardId,
//           },
//         }
//       );

//       console.log('API Response:', response.data);

//       const fetchedPromptName = response.data.newPromptName || response.data;

//       setNewPromptName(fetchedPromptName);

//       if (textareaRef.current) {
//         textareaRef.current.focus();
//       }
//     } catch (error) {
//       console.error('Error fetching the prompt:', error.response ? error.response.data : error.message);
//     }
//   };

//   const handleEdit = (row) => {
//     setEditRow(row);
//     setFormData({
//       tableName: row.table_name,
//       tableDescription: row.table_description,
//     });
//     setIsModalOpen(true);
//   };

//   const handleDeletes = async (row) => {
//     const confirmDelete = window.confirm(
//       `Are you sure you want to delete the table "${row.table_name}"?`
//     );
//     if (!confirmDelete) return;

//     try {
//       const response = await fetch(
//         `https://llm-backend-lcrqhjywba-uc.a.run.app/main-boards/boards/data-management-table/${row.id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Error details:", errorData);
//         throw new Error("Failed to delete table: " + errorData.message);
//       }

//       setRows((prevRows) => prevRows.filter((item) => item.id !== row.id));
//     } catch (error) {
//       console.error("Error deleting table:", error);
//     }
//   };

//   const handleOpenModal = () => {
//     setIsModalOpen(true);
//     setEditRow(null);
//     setFormData({ tableName: "", tableDescription: "" });
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditRow(null);
//     setFormData({ tableName: "", tableDescription: "" });
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `https://llm-backend-lcrqhjywba-uc.a.run.app/main-boards/boards/data-management-table/get_all_tables_with_files`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }
//         const data = await response.json();

//         const filteredData = data.filter(
//           (row) => row.board_id === parseInt(boardId)
//         );
//         setRows(filteredData);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (view === "manage-tables" && boardId) {
//       fetchData();
//     }
//   }, [view, boardId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.tableName || formData.tableName.length > 255) {
//       console.error("Table Name must be between 1 and 255 characters");
//       return;
//     }

//     const tableData = {
//       board_id: boardId,
//       table_name: formData.tableName,
//       table_description: formData.tableDescription,
//       table_column_type_detail: "",
//     };

//     try {
//       const response = editRow
//         ? await fetch(
//           `https://llm-backend-lcrqhjywba-uc.a.run.app/main-boards/boards/data-management-table/${editRow.id}`,
//           {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(tableData),
//           }
//         )
//         : await fetch(
//           `https://llm-backend-lcrqhjywba-uc.a.run.app/main-boards/boards/data-management-table/create`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(tableData),
//           }
//         );

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Error details:", errorData);
//         throw new Error("Failed to save or update table: " + errorData.message);
//       }

//       const newTableData = await response.json();

//       if (editRow) {
//         setRows(
//           (prevRows) =>
//             prevRows.map((row) => (row.id === editRow.id ? newTableData : row))
//         );
//       } else {
//         setRows((prevRows) => [...prevRows, newTableData]);
//       }

//       setIsModalOpen(false);
//       setFormData({ tableName: "", tableDescription: "" });
//       setEditRow(null);
//     } catch (error) {
//       console.error("Error saving or updating table:", error);
//     }
//   };

//   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

//   const handleOpenUploadModal = (id) => {
//     setSelectedTableId(id);
//     setIsUploadModalOpen(true);
//   };

//   const handleCloseUploadModal = () => {
//     setIsUploadModalOpen(false);
//   };

//   const handleSubmitfile = async (e) => {
//     e.preventDefault();

//     if (!selectedMonth || !selectedFile) {
//       alert("Please select a month and a file to upload.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("month_year", selectedMonth);
//     formData.append("file", selectedFile);

//     try {
//       const response = await fetch(
//         `https://llm-backend-lcrqhjywba-uc.a.run.app/main-boards/boards/data-management-table/status/upload/${selectedTableId}`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Upload success:", data);
//         alert("File uploaded successfully!");
//         handleCloseUploadModal();
//       } else {
//         console.error("Upload failed");
//         alert("Failed to upload the file.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("An error occurred during the upload.");
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "https://llm-backend-lcrqhjywba-uc.a.run.app/main-boards/boards/ai-documentation/"
//         );

//         console.log("Fetched Data:", response.data);

//         const filteredData = response.data.filter((item) => String(item.board_id) === String(boardId));

//         console.log("Filtered Data:", filteredData);

//         setData(filteredData);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching the AI documentation:", error);
//         setLoading(false);
//       }
//     };

//     if (boardId) {
//       fetchData();
//     }
//   }, [boardId]);

//   const handleEditClick = (id, item) => {
//     setDocId(id);
//     setEditRowId(id);
//     setEditValues(item.configuration_details);
//   };

//   const handleSaveClick = async (id) => {
//     try {
//       const updatedData = {
//         configuration_details: editValues,
//       };

//       console.log("editValues:", editValues);
//       console.log("Payload being sent:", updatedData);

//       const response = await fetch(`https://llm-backend-lcrqhjywba-uc.a.run.app/main-boards/boards/ai-documentation/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedData),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setData((prevData) =>
//           prevData.map((item) => (item.id === id ? { ...item, configuration_details: editValues } : item))
//         );
//         setEditRowId(null);
//       } else {
//         const errorData = await response.json();
//         console.error("Error updating data:", response.statusText, errorData);
//       }
//     } catch (error) {
//       console.error("Error updating data:", error);
//     }
//   };

//   const handleChanges = (key, value) => {
//     setEditValues((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleViewChange = (newView) => {
//     setView(newView);
//   };

//   const renderTabContent = () => {
//     if (loading) {
//       return (
//         <div className={styles.loadingOverlay}>
//           <div className={styles.spinner}></div>
//         </div>
//       );
//     }
//     switch (activeTab) {
//       case "Manage Prompts":
//         if (loadingManagePrompts) {
//           return (
//             <div className={styles.loadingOverlay}>
//               <div className={styles.spinner}></div>
//             </div>
//           );
//         }
//         return (
//           <div className={styles.managePrompts}>
//             <div className={styles.headerContainer}>
//               <button className={styles.newPromptBtn} onClick={handleAddPrompt}>
//                 New Prompts +
//               </button>
//             </div>

//             {prompts.length > 0 && (
//               <div
//                 style={{
//                   display: "flex",
//                   gap: "10px",
//                   flexWrap: "wrap",
//                   width: "100%",
//                 }}
//               >
//                 {prompts.map((prompt, index) => (
//                   <div key={prompt.id} className={styles.promptCard}>
//                     <p>
//                       <strong>
//                         {index + 1}. "{prompt.prompt_text}"
//                       </strong>
//                     </p>
//                     <div className={styles.promptFooter}>
//                       <div>
//                         <p className={styles.createdBy}>
//                           Created By: {prompt.user_name}
//                         </p>
//                         <p className={styles.updatedAt}>
//                           Updated at: {new Date().toLocaleDateString()}
//                         </p>
//                       </div>
//                       <hr className={styles.underline} />
//                       <div className={styles.icons}>
//                         <button
//                           className={styles.iconBtn}
//                           onClick={() => handlePlayClick(prompt)}
//                         >
//                           <FaPlay />
//                         </button>
//                         <button
//                           className={styles.iconBtn}
//                           onClick={() => handleEditPrompt(prompt)}
//                         >
//                           <FaEdit />
//                         </button>
//                         <button
//                           className={styles.iconBtn}
//                           onClick={() => handleDeletePrompt(prompt.id)}
//                         >
//                           <FaTrash />
//                         </button>
//                       </div>
//                       {loadingPromptPlay === prompt.id && (
//                         <div className={styles.loadingOverlay}>
//                           <div className={styles.spinner}></div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         );

//       case "Prompts Repository":
//         if (loadingPromptsRepository) {
//           return (
//             <div className={styles.loadingOverlay}>
//               <div className={styles.spinner}></div>
//             </div>
//           );
//         }
//         return (
//           <div className={styles.promptRepository}>
//             <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
//               {prompts.length > 0 &&
//                 prompts.map((prompt, index) => (
//                   <div
//                     key={prompt.id}
//                     className={styles.promptCard}
//                     onClick={() => handlePlayClick(prompt)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     <p>
//                       <strong>
//                         {index + 1}. "{prompt.prompt_text}"
//                       </strong>
//                     </p>
//                     <div className={styles.promptFooter}>
//                       <div>
//                         <p className={styles.createdBy}>
//                           Created By: {prompt.user_name}
//                         </p>
//                         <p className={styles.updatedAt}>
//                           Updated at: {new Date().toLocaleDateString()}
//                         </p>
//                       </div>
//                       {loadingPromptPlay === prompt.id && (
//                         <div className={styles.loadingOverlay}>
//                           <div className={styles.spinner}></div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         );
//       case "Manage Tables":
//         if (loadingManageTables) {
//           return (
//             <div className={styles.loadingOverlay}>
//               <div className={styles.spinner}></div>
//             </div>
//           );
//         }
//         return (
//           <div>
//             {currentCase === "Prompts Repository" ? (
//               <div>
//                 <h3>Prompts Repository</h3>
//                 <p>Here you can view and import prompts from the repository.</p>
//               </div>
//             ) : (
//               <div>
//                 <div className={styles.container}>
//                   <div className={styles.tableContainer}>
//                     <div className={styles.header}>
//                       <h2>Manage Tables</h2>
//                       <button className={styles.newBtn} onClick={handleOpenModal}>
//                         + New
//                       </button>
//                     </div>
//                     <table className={styles.table}>
//                       <thead>
//                         <tr>
//                           <th>Table Name</th>
//                           <th>Table Description</th>
//                           <th>Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {loading ? (
//                           <tr>
//                             <td colSpan="3">Loading...</td>
//                           </tr>
//                         ) : error ? (
//                           <tr>
//                             <td colSpan="3">Error: {error}</td>
//                           </tr>
//                         ) : rows.length > 0 ? (
//                           rows.map((row) => (
//                             <tr key={row.id}>
//                               <td>{row.table_name}</td>
//                               <td>{row.table_description}</td>
//                               <td>
//                                 <button
//                                   className={styles.actionBtn}
//                                   onClick={() => handleEdit(row)}
//                                 >
//                                   <FaPen />
//                                 </button>
//                                 <button
//                                   className={styles.actionBtn}
//                                   onClick={() => handleDeletes(row)}
//                                 >
//                                   <FaTrash />
//                                 </button>
//                                 <button
//                                   className={styles.actionBtn}
//                                   onClick={() => handleOpenUploadModal(row.id)}
//                                 >
//                                   <FaFileUpload />
//                                 </button>
//                                 <button
//                                   className={styles.actionBtn}
//                                   onClick={toggleDropdown}
//                                 >
//                                   {isDropdownOpen ? (
//                                     <FaCaretUp />
//                                   ) : (
//                                     <FaCaretDown />
//                                   )}
//                                 </button>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan="3">
//                               No tables available for this board.
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                       {isDropdownOpen && (
//                         <tr>
//                           <td colSpan="3">
//                             <div className={styles.dropdownTable}>
//                               <table className={styles.table}>
//                                 <thead>
//                                   <tr>
//                                     <th>Month Year</th>
//                                     <th>File Name</th>
//                                     <th>Created On</th>
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {rows.map((row) =>
//                                     row.files.map((file) => (
//                                       <tr key={file.id}>
//                                         <td>{file.month_year}</td>
//                                         <td>{file.filename}</td>
//                                         <td>
//                                           {new Date(file.created_at).toLocaleDateString()}
//                                         </td>
//                                       </tr>
//                                     ))
//                                   )}
//                                 </tbody>
//                               </table>
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </table>
//                   </div>

//                   {isUploadModalOpen && (
//                     <div className={styles.modalOverlays}>
//                       <div className={styles.modals}>
//                         <h3>Upload File</h3>
//                         <form onSubmit={handleSubmitfile}>
//                           <div className={styles.formGroup}>
//                             <label htmlFor="monthPicker">
//                               Select Month Year:
//                             </label>
//                             <input
//                               type="month"
//                               id="monthPicker"
//                               name="month"
//                               value={selectedMonth}
//                               onChange={handleMonthChange}
//                               className={styles.border}
//                               required
//                             />
//                           </div>
//                           <div className={styles.formGroup}>
//                             <label htmlFor="fileInput">Select File</label>
//                             <div
//                               {...getRootProps()}
//                               className={`${styles.border} ${isDragActive ? styles.bgGray100 : ""
//                                 }`}
//                             >
//                               <input
//                                 {...getInputProps()}
//                                 id="fileInput"
//                                 name="file"
//                               />
//                               <FaUpload
//                                 className={styles.textGray500}
//                                 size={24}
//                               />
//                               <p className={styles.textSm}>
//                                 {isDragActive
//                                   ? "Drop the file here..."
//                                   : selectedFile
//                                     ? `Selected File: ${selectedFile.name}`
//                                     : "Click or drag file to this area to upload"}
//                               </p>
//                               <p className={styles.textXs}>
//                                 Upload CSV file with less than 50Mb size
//                               </p>
//                             </div>
//                           </div>
//                           <div className={styles.modalActions}>
//                             <button
//                               type="button"
//                               className={styles.closeBtn}
//                               onClick={handleCloseUploadModal}
//                             >
//                               <FaTimes />
//                             </button>
//                             <button type="submit" className={styles.uploadBtn}>
//                               Upload
//                             </button>
//                           </div>
//                         </form>
//                       </div>
//                     </div>
//                   )}
//                   {isModalOpen && (
//                     <div className={styles.modalOverlays}>
//                       <div className={styles.modals}>
//                         <form onSubmit={handleSubmit}>
//                           <div className={styles.formGroup}>
//                             <label>Table Name</label>
//                             <input
//                               type="text"
//                               name="tableName"
//                               value={formData.tableName}
//                               onChange={handleChange}
//                               required
//                             />
//                           </div>
//                           <div className={styles.formGroup}>
//                             <label>Table Description</label>
//                             <input
//                               type="text"
//                               name="tableDescription"
//                               value={formData.tableDescription}
//                               onChange={handleChange}
//                               required
//                             />
//                           </div>
//                           <div className={styles.modalActionss}>
//                             <button type="submit" className={styles.saveBtns}>
//                               Save
//                             </button>
//                             <button
//                               type="button"
//                               className={styles.closeBtns}
//                               onClick={handleCloseModal}
//                             >
//                               <FaTimes />
//                             </button>
//                           </div>
//                         </form>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       case "AI Documentation":
//         return (
//           <div>
//             <h3>AI Documentation</h3>
//             <p>Adjust your master settings here.</p>

//             <table className={styles.minWFull}>
//               <thead>
//                 <tr className={styles.bgGray200}>
//                   <th className={styles.px4}>
//                     <input type="checkbox" />
//                   </th>
//                   <th className={styles.px4}>Name</th>
//                   <th className={styles.px4}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody className={styles.textGray700}>
//                 {data.length > 0 ? (
//                   data.map((item) => {
//                     const isDropdownOpen = expandedRow === item.id;
//                     return (
//                       <React.Fragment key={item.id}>
//                         <tr className={styles.borderB}>
//                           <td className={styles.px4}>
//                             <input type="checkbox" />
//                           </td>
//                           <td className={styles.px4}>
//                             <input
//                               type="text"
//                               value={item.name}
//                               className={styles.border}
//                               readOnly
//                             />
//                           </td>
//                           <td className={styles.px4}>
//                             <div className={styles.flex}>
//                               <button
//                                 onClick={() => handleToggleDropdown(item.id)}
//                                 className={styles.textBlue500}
//                               >
//                                 {isDropdownOpen ? <FaCaretUp /> : <FaCaretDown />}
//                               </button>
//                               <button
//                                 onClick={() => handleEditClick(item.id, item)}
//                                 className={styles.textBlue500}
//                               >
//                                 <FaPen />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>

//                         {isDropdownOpen && (
//                           <tr className={styles.bgGray50}>
//                             <td></td>
//                             <td colSpan="2">
//                               <table className={styles.minWFull}>
//                                 <thead>
//                                   <tr className={styles.bgGray200}>
//                                     <th className={styles.px4}>Key</th>
//                                     <th className={styles.px4}>Description</th>
//                                     <th className={styles.px4}>Actions</th>
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {Object.entries(item.configuration_details).map(
//                                     ([key, description], index) => (
//                                       <tr key={index} className={styles.borderB}>
//                                         <td className={styles.px4}>
//                                           {editRowId === item.id ? (
//                                             <input
//                                               type="text"
//                                               value={key}
//                                               className={styles.border}
//                                               readOnly
//                                               style={{ width: '350px' }}
//                                             />
//                                           ) : (
//                                             <input
//                                               type="text"
//                                               value={key}
//                                               className={styles.border}
//                                               readOnly
//                                               style={{ width: '350px' }}
//                                             />
//                                           )}
//                                         </td>
//                                         <td className={styles.px4}>
//                                           {editRowId === item.id ? (
//                                             <input
//                                               type="text"
//                                               value={editValues[key]}
//                                               onChange={(e) => handleChanges(key, e.target.value)}
//                                               className={styles.border}
//                                               style={{ width: '550px' }}
//                                             />
//                                           ) : (
//                                             <input
//                                               type="text"
//                                               value={description}
//                                               className={styles.border}
//                                               readOnly
//                                               style={{ width: '550px' }}
//                                             />
//                                           )}
//                                         </td>
//                                         <td className={styles.px4}>
//                                           {editRowId === item.id ? (
//                                             <button
//                                               onClick={() => handleSaveClick(item.id)}
//                                               className={styles.textGreen500}
//                                             >
//                                               Save
//                                             </button>
//                                           ) : (
//                                             <button className={styles.textBlue500}>
//                                               <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className={styles.h5}
//                                                 viewBox="0 0 20 20"
//                                                 fill="currentColor"
//                                               >
//                                                 <path d="M17.414 2.586a2 2 0 010 2.828l-9 9a2 2 0 01-.707.414l-3 1a1 1 0 01-1.265-1.265l1-3a2 2 0 01.414-.707l9-9a2 2 0 012.828 0zm-3.5 3.5L8 11l-1.293-1.293a1 1 0 00-1.414 1.414L8 13l6.707-6.707a1 1 0 00-1.414-1.414z" />
//                                               </svg>
//                                               Edit
//                                             </button>
//                                           )}
//                                         </td>
//                                       </tr>
//                                     )
//                                   )}
//                                 </tbody>
//                               </table>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td className={styles.px4} colSpan="5">
//                       No data available for the selected board.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         );

//       case "Master Settings":
//         return (
//           <div>
//             <h3>Master Settings</h3>
//             <p>Adjust your master settings here.</p>
//           </div>
//         );
//       case "Timeline Settings":
//         return (
//           <div>
//             <h3>Timeline Settings</h3>
//             <p>Manage your timeline settings here.</p>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className={styles.dashboard}>
//       <Header />
//       <div className={styles.contentContainer}>
//         <div className={styles.content}>
//           <div className={styles.tabsContainer}>
//             <div className={styles.tabs}>
//               {[
//                 "Manage Prompts",
//                 "Prompts Repository",
//                 "Manage Tables",
//                 "AI Documentation",
//                 "Master Settings",
//                 "Timeline Settings",
//               ].map((tab) => (
//                 <button
//                   key={tab}
//                   className={activeTab === tab ? styles.active : ""}
//                   onClick={() => setActiveTab(tab)}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {renderTabContent()}
//         </div>
//       </div>

//       {isResultModalOpen && (
//   <div className="result-modal">
//     <div className="result-modal-content">
//       <span className="close-btn" onClick={closeResultModal}>
//         &times;
//       </span>

//       <h3>Prompt</h3>
//       <textarea
//         value={selectedPrompt || ""}
//         readOnly
//         rows="4"
//         className="prompt-input"
//       />

//       <h3>Run Result</h3>
//       {runResult ? (
//         <>
//           {/* Display the message */}
//           {typeof runResult.message === "string" ? (
//             <div>
//               <h4>Message:</h4>
//               <p>{runResult.message}</p>
//             </div>
//           ) : Array.isArray(runResult.message) &&
//             runResult.message.length > 0 ? (
//             <div>
//               <h4>Message:</h4>
//               <p>{runResult.message[0]}</p>
//             </div>
//           ) : (
//             <p>No message found.</p>
//           )}

//           {/* Display the table if it exists in runResult */}
//           {runResult.table?.columns?.length > 0 ? (
//             <div className="mt-4">
//               <h4>Table Data:</h4>
//               <table className="min-w-full border border-gray-300">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     {runResult.table.columns.map((col, index) => (
//                       <th key={index} className="border px-4 py-2">
//                         {col}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {runResult.table.data?.length > 0 ? (
//                     runResult.table.data.map((row, rowIndex) => (
//                       <tr key={rowIndex} className="border-b">
//                         {row.map((cell, cellIndex) => (
//                           <td key={cellIndex} className="border px-4 py-2">
//                             {cell}
//                           </td>
//                         ))}
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan={runResult.table.columns.length}
//                         className="text-center"
//                       >
//                         No data available.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p>No table data found.</p>
//           )}
//         </>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   </div>
// )}
import { useEffect, useState, useRef } from "react";
import { api, setAuthToken } from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { Folder, Plus, Edit2, Trash2, FolderOpen, ArrowLeft, X, Save, Upload, Download, FileText, File as FileIcon, Image as ImageIcon } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Folders() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [editingFolder, setEditingFolder] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [message, setMessage] = useState("");
  const [highlightId, setHighlightId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useDarkMode();
  const { t } = useLanguage();
  const folderRefs = useRef({});

  const [folderFormData, setFolderFormData] = useState({ name: "" });

  useEffect(() => {
    loadFolders();
    
    const params = new URLSearchParams(location.search);
    const highlight = params.get("highlight");
    if (highlight) {
      setHighlightId(highlight);
      setTimeout(() => {
        const element = folderRefs.current[highlight];
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      setTimeout(() => setHighlightId(null), 1500);
    }
  }, [location]);

  useEffect(() => {
    if (selectedFolder) {
      loadFiles(selectedFolder._id);
    }
  }, [selectedFolder]);

  const loadFolders = () => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    api.get("/folders")
      .then(res => setFolders(res.data))
      .catch(err => {
        console.log(err);
        setMessage(t("error"));
      });
  };

  const loadFiles = (folderId) => {
    api.get(`/files/folder/${folderId}`)
      .then(res => setFiles(res.data))
      .catch(err => {
        console.log(err);
        setMessage(t("error"));
      });
  };

  const handleFolderSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingFolder) {
        await api.put(`/folders/${editingFolder._id}`, folderFormData);
        setMessage(t("folderUpdated"));
      } else {
        await api.post("/folders", folderFormData);
        setMessage(t("folderCreated"));
      }
      
      loadFolders();
      closeFolderModal();
    } catch (err) {
      setMessage(err.response?.data?.error || t("error"));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedFolder) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", selectedFolder._id);

    try {
      await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage(t("fileUploaded"));
      loadFiles(selectedFolder._id);
    } catch (err) {
      setMessage(err.response?.data?.error || t("error"));
    } finally {
      setUploadingFile(false);
      e.target.value = "";
    }
  };

  const handleFileDownload = async (fileId, originalName) => {
    try {
      const response = await api.get(`/files/download/${fileId}`, {
        responseType: "blob"
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setMessage(t("error"));
    }
  };

  const handleDeleteFolder = (id) => {
    setFolderToDelete(id);
    setShowDeleteFolderModal(true);
  };

  const confirmDeleteFolder = async () => {
    if (!folderToDelete) return;

    try {
      await api.delete(`/folders/${folderToDelete}`);
      setMessage(t("folderDeleted"));
      loadFolders();
      if (selectedFolder && selectedFolder._id === folderToDelete) {
        setSelectedFolder(null);
      }
      setShowDeleteFolderModal(false);
      setFolderToDelete(null);
    } catch (err) {
      setMessage(err.response?.data?.error || t("error"));
      setShowDeleteFolderModal(false);
      setFolderToDelete(null);
    }
  };

  const handleDeleteFile = (id) => {
    setFileToDelete(id);
    setShowDeleteFileModal(true);
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;

    try {
      await api.delete(`/files/${fileToDelete}`);
      setMessage(t("fileDeleted"));
      loadFiles(selectedFolder._id);
      setShowDeleteFileModal(false);
      setFileToDelete(null);
    } catch (err) {
      setMessage(err.response?.data?.error || t("error"));
      setShowDeleteFileModal(false);
      setFileToDelete(null);
    }
  };

  const openAddFolderModal = () => {
    setFolderFormData({ name: "" });
    setEditingFolder(null);
    setShowAddFolderModal(true);
  };

  const openEditFolderModal = (folder) => {
    setFolderFormData({ name: folder.name || "" });
    setEditingFolder(folder);
    setShowAddFolderModal(true);
  };

  const closeFolderModal = () => {
    setShowAddFolderModal(false);
    setEditingFolder(null);
    setFolderFormData({ name: "" });
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith("image/")) return <ImageIcon className="w-5 h-5" />;
    if (mimetype.includes("pdf")) return <FileText className="w-5 h-5" />;
    return <FileIcon className="w-5 h-5" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", { 
      day: "2-digit", 
      month: "short", 
      year: "numeric"
    });
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'}`}>
      <Navbar title={selectedFolder ? selectedFolder.name : t("myFolders")} subtitle={selectedFolder ? `${files.length} ${t("files")}` : `${folders.length} ${t("foldersSaved")}`} />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <div className="flex items-center justify-start gap-4 mb-6">
          <button
            onClick={() => selectedFolder ? setSelectedFolder(null) : navigate("/dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              isDarkMode
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">{selectedFolder ? t("backToFolders") : t("back")}</span>
          </button>

          {!selectedFolder && (
            <button
              onClick={openAddFolderModal}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">{t("addFolder")}</span>
            </button>
          )}

          {selectedFolder && (
            <label className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer">
              <Upload className="w-5 h-5" />
              <span className="font-semibold">{uploadingFile ? t("uploading") : t("uploadFile")}</span>
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploadingFile}
              />
            </label>
          )}
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes(t("success")) || message.includes("erfolgreich") || message.includes("successfully")
              ? isDarkMode ? "bg-green-500/20 text-green-200 border border-green-400/30" : "bg-green-100 text-green-700 border border-green-300"
              : isDarkMode ? "bg-red-500/20 text-red-200 border border-red-400/30" : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {message}
          </div>
        )}

        {!selectedFolder && (
          <>
            {folders.length === 0 ? (
              <div className="text-center py-20 mt-16">
                <Folder className={`w-20 h-20 mx-auto mb-4 opacity-50 ${isDarkMode ? 'text-yellow-300' : 'text-gray-400'}`} />
                <h3 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t("noFolders")}
                </h3>
                <p className={`mb-6 ${isDarkMode ? 'text-yellow-200' : 'text-gray-600'}`}>
                  {t("addFirstFolder")}
                </p>
                <button
                  onClick={openAddFolderModal}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                >
                  {t("addFolder")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-16">
                {folders.map(folder => (
                  <div
                    key={folder._id}
                    ref={el => folderRefs.current[folder._id] = el}
                    onClick={() => setSelectedFolder(folder)}
                    className={`group rounded-lg p-4 border transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${
                      highlightId === folder._id
                        ? isDarkMode 
                          ? 'bg-yellow-500/30 border-yellow-400 shadow-2xl shadow-yellow-500/50 scale-105'
                          : 'bg-yellow-100 border-yellow-400 shadow-2xl shadow-yellow-300/50 scale-105'
                        : isDarkMode
                          ? 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15'
                          : 'bg-white border-gray-200 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 group-hover:from-yellow-500 group-hover:to-yellow-700' 
                          : 'bg-gradient-to-br from-yellow-500 to-yellow-700 group-hover:from-yellow-600 group-hover:to-yellow-800'
                      }`}>
                        <FolderOpen className="w-8 h-8 text-white" />
                      </div>

                      <h3 className={`text-sm font-bold mb-1 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {folder.name}
                      </h3>

                      {folder.createdAt && (
                        <p className={`text-xs mb-3 ${isDarkMode ? 'text-yellow-200' : 'text-gray-500'}`}>
                          {t("created")}: {formatDate(folder.createdAt)}
                        </p>
                      )}

                      <div className="flex gap-1.5 w-full">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditFolderModal(folder);
                          }}
                          className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md transition-all duration-200 border text-xs ${
                            isDarkMode
                              ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 border-yellow-400/30'
                              : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-600 border-yellow-200'
                          }`}
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolder(folder._id);
                          }}
                          className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md transition-all duration-200 border text-xs ${
                            isDarkMode
                              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-200 border-red-400/30'
                              : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
                          }`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {selectedFolder && (
          <div className="mt-16">
            {files.length === 0 ? (
              <div className="text-center py-20">
                <FileIcon className={`w-20 h-20 mx-auto mb-4 opacity-50 ${isDarkMode ? 'text-yellow-300' : 'text-gray-400'}`} />
                <h3 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t("noFiles")}
                </h3>
                <p className={`mb-6 ${isDarkMode ? 'text-yellow-200' : 'text-gray-600'}`}>
                  {t("uploadFirstFile")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map(file => (
                  <div
                    key={file._id}
                    className={`rounded-lg p-4 border transition-all duration-300 hover:shadow-lg ${
                      isDarkMode
                        ? 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15'
                        : 'bg-white border-gray-200 shadow hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isDarkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {getFileIcon(file.mimetype)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {file.originalName}
                          </h4>
                          <p className={`text-xs ${isDarkMode ? 'text-yellow-200' : 'text-gray-500'}`}>
                            {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleFileDownload(file._id, file.originalName)}
                          className={`p-2 rounded-lg transition-all ${
                            isDarkMode
                              ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200'
                              : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-600'
                          }`}
                          title={t("download")}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file._id)}
                          className={`p-2 rounded-lg transition-all ${
                            isDarkMode
                              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-200'
                              : 'bg-red-50 hover:bg-red-100 text-red-600'
                          }`}
                          title={t("delete")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showAddFolderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl p-8 max-w-md w-full shadow-2xl border animate-fade-in ${
            isDarkMode
              ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-white/20'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {editingFolder ? t("editFolder") : t("newFolder")}
              </h2>
              <button onClick={closeFolderModal} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
              </button>
            </div>

            <form onSubmit={handleFolderSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-yellow-200' : 'text-gray-700'}`}>
                  {t("folderName")} *
                </label>
                <input
                  type="text"
                  value={folderFormData.name}
                  onChange={(e) => setFolderFormData({ ...folderFormData, name: e.target.value })}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-yellow-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-yellow-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent`}
                  placeholder="z.B. Uni Semester 1"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeFolderModal}
                  className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                    isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                >
                  <Save className="w-5 h-5" />
                  {editingFolder ? t("update") : t("add")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteFolderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl p-8 max-w-md w-full shadow-2xl border animate-fade-in ${
            isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-white/20' : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t("delete")} {t("folders").slice(0, -1)}?</h2>
            <p className={`mb-8 ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
              {t("deleteFolderConfirm")}
            </p>
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteFolderModal(false); setFolderToDelete(null); }} className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                {t("cancel")}
              </button>
              <button onClick={confirmDeleteFolder} className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold">
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteFileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl p-8 max-w-md w-full shadow-2xl border animate-fade-in ${
            isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 border-white/20' : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t("delete")} File?</h2>
            <p className={`mb-8 ${isDarkMode ? 'text-blue-200' : 'text-gray-600'}`}>
              {t("deleteFileConfirm")}
            </p>
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteFileModal(false); setFileToDelete(null); }} className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                {t("cancel")}
              </button>
              <button onClick={confirmDeleteFile} className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold">
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>

      <Footer />
    </div>
  );
}
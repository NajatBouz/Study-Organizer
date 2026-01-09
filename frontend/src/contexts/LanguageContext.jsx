import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "de";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === "de" ? "en" : "de");
  };

  const t = (key) => {
    const translation = translations[language]?.[key];
    if (translation === undefined) {
      console.warn(`Missing translation for key: ${key} in language: ${language}`);
      return key;
    }
    return translation;
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Übersetzungen
const translations = {
  de: {
    // Navigation
    dashboard: "Dashboard",
    contacts: "Kontakte",
    links: "Links",
    events: "Termine",
    folders: "Ordner",
    search: "Suche",
    logout: "Abmelden",
    deleteAccount: "Account löschen",
    memberSince: "Mitglied seit",
    back: "Zurück",
    
    // Dashboard
    welcomeBack: "Willkommen zurück",
    hereIsYourOverview: "Hier ist deine Übersicht",
    nextEvent: "NÄCHSTER TERMIN",
    allEvents: "Alle Termine",
    statistics: "Statistiken",
    recentActivities: "Letzte Aktivitäten",
    noActivitiesYet: "Noch keine Aktivitäten vorhanden",
    manageContacts: "Verwalte deine Kontakte",
    organizeLinks: "Organisiere deine Links",
    planEvents: "Plane deine Termine",
    structureFiles: "Strukturiere deine Dateien",
    contactAdded: "Kontakt hinzugefügt",
    linkAdded: "Link hinzugefügt",
    eventAdded: "Termin hinzugefügt",
    folderCreated: "Ordner erstellt",
    justNow: "Gerade eben",
    minutesAgo: "vor {0} Min.",
    hoursAgo: "vor {0} Std.",
    daysAgo: "vor {0} Tag",
    daysAgoPlural: "vor {0} Tagen",
    inDays: "in {0} Tag",
    inDaysPlural: "in {0} Tagen",
    inHours: "in {0} Stunde",
    inHoursPlural: "in {0} Stunden",
    soon: "Bald",
    
    // Contacts
    myContacts: "Meine Kontakte",
    contactsSaved: "Kontakte gespeichert",
    addContact: "Kontakt hinzufügen",
    editContact: "Kontakt bearbeiten",
    newContact: "Neuer Kontakt",
    noContacts: "Keine Kontakte vorhanden",
    addFirstContact: "Füge deinen ersten Kontakt hinzu!",
    name: "Name",
    email: "E-Mail",
    phone: "Telefon",
    role: "Rolle / Position",
    category: "Kategorie",
    edit: "Bearbeiten",
    delete: "Löschen",
    cancel: "Abbrechen",
    save: "Speichern",
    update: "Aktualisieren",
    add: "Hinzufügen",
    deleteContactConfirm: "Möchtest du diesen Kontakt wirklich löschen?",
    contactDeleted: "Kontakt erfolgreich gelöscht!",
    contactUpdated: "Kontakt erfolgreich aktualisiert!",
    contactCreated: "Kontakt erfolgreich hinzugefügt!",
    
    // Links
    myLinks: "Meine Links",
    linksSaved: "Links gespeichert",
    addLink: "Link hinzufügen",
    editLink: "Link bearbeiten",
    newLink: "Neuer Link",
    noLinks: "Keine Links vorhanden",
    addFirstLink: "Füge deinen ersten Link hinzu!",
    title: "Titel",
    url: "URL",
    note: "Notiz",
    visit: "Besuchen",
    deleteLinkConfirm: "Möchtest du diesen Link wirklich löschen?",
    linkDeleted: "Link erfolgreich gelöscht!",
    linkUpdated: "Link erfolgreich aktualisiert!",
    linkCreated: "Link erfolgreich hinzugefügt!",
    
    // Events
    myEvents: "Meine Termine",
    eventsSaved: "Termine gespeichert",
    addEvent: "Termin hinzufügen",
    editEvent: "Termin bearbeiten",
    newEvent: "Neuer Termin",
    noEvents: "Keine Termine vorhanden",
    addFirstEvent: "Füge deinen ersten Termin hinzu!",
    startTime: "Startzeit",
    endTime: "Endzeit",
    description: "Beschreibung",
    upcoming: "Anstehend",
    deleteEventConfirm: "Möchtest du diesen Termin wirklich löschen?",
    eventDeleted: "Termin erfolgreich gelöscht!",
    eventUpdated: "Termin erfolgreich aktualisiert!",
    eventCreated: "Termin erfolgreich hinzugefügt!",
    
    // Folders
    myFolders: "Meine Ordner",
    foldersSaved: "Ordner gespeichert",
    addFolder: "Ordner hinzufügen",
    editFolder: "Ordner umbenennen",
    newFolder: "Neuer Ordner",
    noFolders: "Keine Ordner vorhanden",
    addFirstFolder: "Füge deinen ersten Ordner hinzu!",
    folderName: "Ordnername",
    uploadFile: "Datei hochladen",
    uploading: "Lädt hoch...",
    noFiles: "Keine Dateien vorhanden",
    uploadFirstFile: "Lade deine erste Datei hoch!",
    files: "Dateien",
    backToFolders: "Zurück zu Ordnern",
    download: "Download",
    deleteFolderConfirm: "Möchtest du diesen Ordner wirklich löschen? Alle Dateien werden gelöscht!",
    deleteFileConfirm: "Möchtest du diese Datei wirklich löschen?",
    folderDeleted: "Ordner erfolgreich gelöscht!",
    folderUpdated: "Ordner erfolgreich aktualisiert!",
    fileDeleted: "Datei erfolgreich gelöscht!",
    fileUploaded: "Datei erfolgreich hochgeladen!",
    created: "Erstellt",
    
    // Search
    searchPlaceholder: "Suche nach Kontakten, Links, Terminen...",
    resultsFound: "Ergebnis",
    resultsFoundPlural: "Ergebnisse",
    noResults: "Keine Ergebnisse gefunden",
    tryDifferentSearch: "Versuche eine andere Suchanfrage",
    
    // Common
    loading: "Lädt...",
    error: "Fehler",
    success: "Erfolg"
  },
  
  en: {
    // Navigation
    dashboard: "Dashboard",
    contacts: "Contacts",
    links: "Links",
    events: "Events",
    folders: "Folders",
    search: "Search",
    logout: "Logout",
    deleteAccount: "Delete Account",
    memberSince: "Member since",
    back: "Back",
    
    // Dashboard
    welcomeBack: "Welcome back",
    hereIsYourOverview: "Here is your overview",
    nextEvent: "NEXT EVENT",
    allEvents: "All Events",
    statistics: "Statistics",
    recentActivities: "Recent Activities",
    noActivitiesYet: "No activities yet",
    manageContacts: "Manage your contacts",
    organizeLinks: "Organize your links",
    planEvents: "Plan your events",
    structureFiles: "Structure your files",
    contactAdded: "Contact added",
    linkAdded: "Link added",
    eventAdded: "Event added",
    folderCreated: "Folder created",
    justNow: "Just now",
    minutesAgo: "{0} min. ago",
    hoursAgo: "{0} hrs. ago",
    daysAgo: "{0} day ago",
    daysAgoPlural: "{0} days ago",
    inDays: "in {0} day",
    inDaysPlural: "in {0} days",
    inHours: "in {0} hour",
    inHoursPlural: "in {0} hours",
    soon: "Soon",
    
    // Contacts
    myContacts: "My Contacts",
    contactsSaved: "contacts saved",
    addContact: "Add Contact",
    editContact: "Edit Contact",
    newContact: "New Contact",
    noContacts: "No contacts available",
    addFirstContact: "Add your first contact!",
    name: "Name",
    email: "Email",
    phone: "Phone",
    role: "Role / Position",
    category: "Category",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    update: "Update",
    add: "Add",
    deleteContactConfirm: "Do you really want to delete this contact?",
    contactDeleted: "Contact successfully deleted!",
    contactUpdated: "Contact successfully updated!",
    contactCreated: "Contact successfully added!",
    
    // Links
    myLinks: "My Links",
    linksSaved: "links saved",
    addLink: "Add Link",
    editLink: "Edit Link",
    newLink: "New Link",
    noLinks: "No links available",
    addFirstLink: "Add your first link!",
    title: "Title",
    url: "URL",
    note: "Note",
    visit: "Visit",
    deleteLinkConfirm: "Do you really want to delete this link?",
    linkDeleted: "Link successfully deleted!",
    linkUpdated: "Link successfully updated!",
    linkCreated: "Link successfully added!",
    
    // Events
    myEvents: "My Events",
    eventsSaved: "events saved",
    addEvent: "Add Event",
    editEvent: "Edit Event",
    newEvent: "New Event",
    noEvents: "No events available",
    addFirstEvent: "Add your first event!",
    startTime: "Start Time",
    endTime: "End Time",
    description: "Description",
    upcoming: "Upcoming",
    deleteEventConfirm: "Do you really want to delete this event?",
    eventDeleted: "Event successfully deleted!",
    eventUpdated: "Event successfully updated!",
    eventCreated: "Event successfully added!",
    
    // Folders
    myFolders: "My Folders",
    foldersSaved: "folders saved",
    addFolder: "Add Folder",
    editFolder: "Rename Folder",
    newFolder: "New Folder",
    noFolders: "No folders available",
    addFirstFolder: "Add your first folder!",
    folderName: "Folder Name",
    uploadFile: "Upload File",
    uploading: "Uploading...",
    noFiles: "No files available",
    uploadFirstFile: "Upload your first file!",
    files: "files",
    backToFolders: "Back to Folders",
    download: "Download",
    deleteFolderConfirm: "Do you really want to delete this folder? All files will be deleted!",
    deleteFileConfirm: "Do you really want to delete this file?",
    folderDeleted: "Folder successfully deleted!",
    folderUpdated: "Folder successfully updated!",
    fileDeleted: "File successfully deleted!",
    fileUploaded: "File successfully uploaded!",
    created: "Created",
    
    // Search
    searchPlaceholder: "Search contacts, links, events...",
    resultsFound: "result",
    resultsFoundPlural: "results",
    noResults: "No results found",
    tryDifferentSearch: "Try a different search term",
    
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success"
  }
};
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';

import { 
  CheckSquare, 
  LayoutDashboard, 
  Globe, 
  LogOut, 
  Plus, 
  RotateCcw, 
  Check, 
  UserCheck, 
  Calendar, 
  Filter, 
  ShieldCheck,
  Share2,
  User, 
  Clock, 
  Smartphone,
  Cloud,
  UserPlus,
  Users,
  Key,
  Trash2,
  Settings
} from 'lucide-react';

// FIREBASE CLOUD INITIALIZATION FOR REALTIME MULTI-DEVICE SYNC
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : { apiKey: "demo", authDomain: "demo", projectId: "demo" };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'azubi-praxis-app';

// Multi-language Translation Objects
const TRANSLATIONS = {
  de: {
    title: "Azubi Tages- & Wochenaufgaben",
    checklistTab: "Checkliste",
    dashboardTab: "Leitung Dashboard",
    usersTab: "Verwaltung (Nutzer & PINs)",
    language: "Sprache",
    todayTasks: "Tägliche Aufgaben",
    weeklyTasks: "Wöchentliche Aufgaben",
    allTasks: "Alle Aufgaben",
    taskType: "Turnus",
    typeDaily: "Täglich",
    typeWeekly: "Wöchentlich",
    addTask: "Aufgabe hinzufügen",
    taskPlaceholder: "Neue Aufgabe eingeben...",
    taskCategory: "Kategorie",
    categoryStock: "Auffüllen",
    categoryClean: "Reinigung",
    categoryPrep: "Vorbereitung",
    categoryGeneral: "Allgemein",
    completedBy: "Erledigt von",
    atTime: "um",
    resetDay: "Tagesstand zurücksetzen",
    noTasks: "Keine Aufgaben vorhanden.",
    check: "Abhaken",
    uncheck: "Rückgängig machen",
    filterDate: "Datum wählen",
    filterTrainee: "Azubi filtern",
    allTrainees: "Alle Azubis",
    completionRate: "Erfüllungsquote",
    totalCompleted: "Erledigte Aufgaben",
    activeTrainees: "Aktive Azubis",
    activityLog: "Aktivitätsprotokoll",
    logTime: "Uhrzeit",
    logTrainee: "Azubi",
    logTask: "Aufgabe",
    logStatus: "Status",
    statusDone: "Erledigt",
    statusUndone: "Zurückgesetzt",
    yesterday: "Gestern",
    today: "Heute",
    noLogsForDate: "Keine Aktivitäten für den ausgewählten Tag gefunden.",
    loginTitle: "Anmeldung",
    loginSubtitle: "Wähle deinen Namen aus und gib deine PIN ein",
    selectUser: "Wer bist du?",
    pinPlaceholder: "PIN / Passwort",
    loginBtn: "Anmelden",
    loginError: "Falsche PIN für diesen Benutzer!",
    logout: "Abmelden",
    roleInstructor: "Leitung",
    roleTrainee: "Auszubildender",
    instructorPinNotice: "Zugang mit persönlicher PIN",
    syncing: "Echtzeit Cloud aktiv",
    addUserTitle: "Neuen Nutzer anlegen",
    userName: "Vollständiger Name",
    userTag: "Kürzel (z.B. AB)",
    userRole: "Rolle",
    userPin: "PIN / Passwort",
    addUserBtn: "Nutzer speichern",
    userListTitle: "Registrierte Nutzer & PINs"
  },
  en: {
    title: "Trainee Daily & Weekly Tasks",
    checklistTab: "Checklist",
    dashboardTab: "Management Dashboard",
    usersTab: "User Management",
    language: "Language",
    todayTasks: "Daily Tasks",
    weeklyTasks: "Weekly Tasks",
    allTasks: "All Tasks",
    taskType: "Frequency",
    typeDaily: "Daily",
    typeWeekly: "Weekly",
    addTask: "Add Task",
    taskPlaceholder: "Enter new task...",
    taskCategory: "Category",
    categoryStock: "Restock",
    categoryClean: "Cleaning",
    categoryPrep: "Preparation",
    categoryGeneral: "General",
    completedBy: "Completed by",
    atTime: "at",
    resetDay: "Reset Status",
    noTasks: "No tasks available.",
    check: "Check",
    uncheck: "Undo",
    filterDate: "Select Date",
    filterTrainee: "Filter Trainee",
    allTrainees: "All Trainees",
    completionRate: "Completion Rate",
    totalCompleted: "Completed Tasks",
    activeTrainees: "Active Trainees",
    activityLog: "Activity Log",
    logTime: "Time",
    logTrainee: "Trainee",
    logTask: "Task",
    logStatus: "Status",
    statusDone: "Done",
    statusUndone: "Reset",
    yesterday: "Yesterday",
    today: "Today",
    noLogsForDate: "No activities found for the selected date.",
    loginTitle: "Login",
    loginSubtitle: "Select your name and enter your PIN",
    selectUser: "Who are you?",
    pinPlaceholder: "PIN / Password",
    loginBtn: "Log In",
    loginError: "Incorrect PIN for selected user!",
    logout: "Log Out",
    roleInstructor: "Management",
    roleTrainee: "Trainee",
    instructorPinNotice: "Access with personal PIN",
    syncing: "Realtime Sync Active",
    addUserTitle: "Add New User",
    userName: "Full Name",
    userTag: "Initials (e.g. AB)",
    userRole: "Role",
    userPin: "PIN / Password",
    addUserBtn: "Save User",
    userListTitle: "Registered Users & PINs"
  },
  fr: {
    title: "Tâches quotidiennes et hebdomadaires",
    checklistTab: "Liste de contrôle",
    dashboardTab: "Tableau de bord Direction",
    usersTab: "Gestion des utilisateurs",
    language: "Langue",
    todayTasks: "Tâches quotidiennes",
    weeklyTasks: "Tâches hebdomadaires",
    allTasks: "Toutes les tâches",
    taskType: "Fréquence",
    typeDaily: "Quotidien",
    typeWeekly: "Hebdomadaire",
    addTask: "Ajouter une tâche",
    taskPlaceholder: "Saisir une nouvelle tâche...",
    taskCategory: "Catégorie",
    categoryStock: "Réapprovisionnement",
    categoryClean: "Nettoyage",
    categoryPrep: "Préparation",
    categoryGeneral: "Général",
    completedBy: "Terminé par",
    atTime: "à",
    resetDay: "Réinitialiser les statuts",
    noTasks: "Aucune tâche disponible.",
    check: "Cocher",
    uncheck: "Annuler",
    filterDate: "Choisir la date",
    filterTrainee: "Filtrer l'apprenti",
    allTrainees: "Tous les apprentis",
    completionRate: "Taux d'achèvement",
    totalCompleted: "Tâches terminées",
    activeTrainees: "Apprentis actifs",
    activityLog: "Journal d'activité",
    logTime: "Heure",
    logTrainee: "Apprenti",
    logTask: "Tâche",
    logStatus: "Statut",
    statusDone: "Fait",
    statusUndone: "Réinitialisé",
    yesterday: "Hier",
    today: "Aujourd'hui",
    noLogsForDate: "Aucune activité trouvée pour la date sélectionnée.",
    loginTitle: "Connexion",
    loginSubtitle: "Sélectionnez votre nom et entrez votre code PIN",
    selectUser: "Qui êtes-vous ?",
    pinPlaceholder: "PIN / Mot de passe",
    loginBtn: "Se connecter",
    loginError: "Code PIN incorrect pour cet utilisateur !",
    logout: "Déconnexion",
    roleInstructor: "Direction",
    roleTrainee: "Apprenti",
    instructorPinNotice: "Accès avec PIN personnel",
    syncing: "Sync en temps réel",
    addUserTitle: "Ajouter un utilisateur",
    userName: "Nom complet",
    userTag: "Initiales (ex. AB)",
    userRole: "Rôle",
    userPin: "Code PIN",
    addUserBtn: "Enregistrer l'utilisateur",
    userListTitle: "Utilisateurs enregistrés"
  },
  ru: {
    title: "Ежедневные и еженедельные задачи",
    checklistTab: "Чек-лист",
    dashboardTab: "Панель руководства",
    usersTab: "Управление пользователями",
    language: "Язык",
    todayTasks: "Ежедневные задачи",
    weeklyTasks: "Еженедельные задачи",
    allTasks: "Все задачи",
    taskType: "Периодичность",
    typeDaily: "Ежедневно",
    typeWeekly: "Еженедельно",
    addTask: "Добавить задачу",
    taskPlaceholder: "Введите новую задачу...",
    taskCategory: "Категория",
    categoryStock: "Пополнение",
    categoryClean: "Уборка",
    categoryPrep: "Подготовка",
    categoryGeneral: "Общее",
    completedBy: "Выполнено",
    atTime: "в",
    resetDay: "Сбросить статус",
    noTasks: "Нет доступных задач.",
    check: "Отметить",
    uncheck: "Отменить",
    filterDate: "Выбрать дату",
    filterTrainee: "Фильтр стажеров",
    allTrainees: "Все стажеры",
    completionRate: "Уровень выполнения",
    totalCompleted: "Выполненные задачи",
    activeTrainees: "Активные стажеры",
    activityLog: "Журнал активности",
    logTime: "Время",
    logTrainee: "Стажер",
    logTask: "Задача",
    logStatus: "Статус",
    statusDone: "Готово",
    statusUndone: "Сброшено",
    yesterday: "Вчера",
    today: "Сегодня",
    noLogsForDate: "За выбранную дату активности не найдены.",
    loginTitle: "Вход в систему",
    loginSubtitle: "Выберите свое имя и введите PIN-код",
    selectUser: "Кто вы?",
    pinPlaceholder: "PIN / Пароль",
    loginBtn: "Войти",
    loginError: "Неверный PIN-код для этого пользователя!",
    logout: "Выйти",
    roleInstructor: "Руководство",
    roleTrainee: "Стажер",
    instructorPinNotice: "Вход по персональному PIN-коду",
    syncing: "Синхронизация",
    addUserTitle: "Добавить пользователя",
    userName: "Полное имя",
    userTag: "Инициалы (напр. AB)",
    userRole: "Роль",
    userPin: "PIN-код",
    addUserBtn: "Сохранить",
    userListTitle: "Зарегистрированные пользователи"
  }
};

// Default Initial Users configuration
const DEFAULT_USER_PROFILES = [
  { tag: "LEITUNG", name: "Leitung", role: "INSTRUCTOR", pin: "2025" },
  { tag: "YS", name: "Yelyzeveta Stankevych", role: "TRAINEE", pin: "YS05" },
  { tag: "CN", name: "Claudine Nininahazwe", role: "TRAINEE", pin: "CN94" },
  { tag: "SI", name: "Synthia Izere", role: "TRAINEE", pin: "SI03" },
  { tag: "IH", name: "Iris Haverlach", role: "TRAINEE", pin: "IH09" },
  { tag: "JS", name: "Jacqueline Sandmann", role: "TRAINEE", pin: "JS84" }
];

// Initial Seed Tasks with frequency type
const INITIAL_TASKS = [
  {
    id: "task_1",
    title: {
      de: "Überprüfen aller Desinfektionsmittelflaschen/-spender",
      en: "Check all disinfectant bottles/dispensers",
      fr: "Vérifier tous les flacons/distributeurs de désinfectant",
      ru: "Проверка всех флаконов/дозаторов дезинфицирующих средств"
    },
    category: "categoryPrep",
    frequency: "daily",
    isCompleted: false,
    completedBy: null,
    completedAt: null
  },
  {
    id: "task_2",
    title: {
      de: "Überprüfen aller Seifenspender",
      en: "Check all soap dispensers",
      fr: "Vérifier tous les distributeurs de savon",
      ru: "Проверка всех дозаторов мыла"
    },
    category: "categoryPrep",
    frequency: "daily",
    isCompleted: false,
    completedBy: null,
    completedAt: null
  },
  {
    id: "task_3",
    title: {
      de: "Überprüfen aller Elektrodensprays",
      en: "Check all electrode sprays",
      fr: "Vérifier tous les sprays pour électrodes",
      ru: "Проверка всех спреев для электродов"
    },
    category: "categoryPrep",
    frequency: "daily",
    isCompleted: false,
    completedBy: null,
    completedAt: null
  },
  {
    id: "task_4",
    title: {
      de: "Überprüfen ob genug Klebeelektroden da sind (Funktion 1,2 und DMP V)",
      en: "Check adhesive electrodes supply (Function 1,2 & DMP V)",
      fr: "Vérifier le stock d'électrodes adhésives (Fonction 1,2 et DMP V)",
      ru: "Проверка наличия клеящихся электродов (Функция 1,2 и DMP V)"
    },
    category: "categoryStock",
    frequency: "daily",
    isCompleted: false,
    completedBy: null,
    completedAt: null
  },
  {
    id: "task_5",
    title: {
      de: "Überprüfen ob genügend Nasenbrillen da sind (Polygraphie)",
      en: "Check nasal cannula supply (Polygraphy)",
      fr: "Vérifier le stock de lunettes nasales (Polygraphie)",
      ru: "Проверка наличия назальных канюль (Полиграфия)"
    },
    category: "categoryStock",
    frequency: "daily",
    isCompleted: false,
    completedBy: null,
    completedAt: null
  },
  {
    id: "task_6",
    title: {
      de: "Überprüfen der Batterien (voll geladen)",
      en: "Check batteries (fully charged)",
      fr: "Vérifier les piles/batteries (pleinement chargées)",
      ru: "Проверка батарей (полностью заряжены)"
    },
    category: "categoryPrep",
    frequency: "daily",
    isCompleted: false,
    completedBy: null,
    completedAt: null
  },
  {
    id: "task_7",
    title: {
      de: "Überprüfen der Drucker (genügend Papier)",
      en: "Check printers (sufficient paper)",
      fr: "Vérifier les imprimantes (papier suffisant)",
      ru: "Проверка принтеров (достаточно бумаги)"
    },
    category: "categoryPrep",
    frequency: "daily",
    isCompleted: false,
    completedBy: null,
    completedAt: null
  },
  {
    id: "task_8",
    title: {
      de: "Alle Flächen desinfizieren",
      en: "Disinfect all surfaces",
      fr: "Désinfecter toutes les surfaces",
      ru: "Дезинфекция всех поверхностей"
    },
    category: "categoryClean",
    frequency: "daily",
    isCompleted: false,
    completedBy: null,
    completedAt: null
  },
  {
    id: "task_9",
    title: {
      de: "Alle Türklinken desinfizieren",
      en: "Disinfect all door handles",
      fr: "Désinfecter toutes les poignées de porte",
      ru: "Дезинфекция всех дверных ручек"
    },
    category: "categoryClean",
    frequency: "daily",
    isCompleted: false,
    completedBy: null,
    completedAt: null
  },
  {
    id: "task_10",
    title: {
      de: "Alle Mülleimer ausleeren",
      en: "Empty all trash cans",
      fr: "Vider toutes les poubelles",
      ru: "Опорожнить все мусорные корзины"
    },
    category: "categoryClean",
    frequency: "daily",
    isCompleted: false,
    completedBy: null,
    completedAt: null
  },
  {
    id: "task_11",
    title: {
      de: "Alle Fenster schließen",
      en: "Close all windows",
      fr: "Fermer toutes les fenêtres",
      ru: "Закрыть все окна"
    },
    category: "categoryGeneral",
    frequency: "daily",
    isCompleted: false,
    completedBy: null,
    completedAt: null
  },
  {
    id: "task_12",
    title: {
      de: "Alle PCs runterfahren",
      en: "Shut down all PCs",
      fr: "Éteindre tous les ordinateurs",
      ru: "Выключить все ПК"
    },
    category: "categoryGeneral",
    frequency: "daily",
    isCompleted: false,
    completedBy: null,
    completedAt: null
  },
  {
    id: "task_13",
    title: {
      de: "Wartebereich aufräumen",
      en: "Tidy up waiting area",
      fr: "Ranger la salle d'attente",
      ru: "Убраться в зоне ожидания"
    },
    category: "categoryClean",
    frequency: "daily",
    isCompleted: false,
    completedBy: null,
    completedAt: null
  },
  {
    id: "task_14",
    title: {
      de: "Briefkasten leeren",
      en: "Empty mailbox",
      fr: "Vider la boîte aux lettres",
      ru: "Очистить почтовый ящик"
    },
    category: "categoryGeneral",
    frequency: "daily",
    isCompleted: false,
    completedBy: null,
    completedAt: null
  },
  {
    id: "task_15",
    title: {
      de: "Überprüfen von Liegenpapier in allen Zimmern",
      en: "Check couch paper rolls in all rooms",
      fr: "Vérifier le papier d'examen dans toutes les salles",
      ru: "Проверка бумаги для кушеток во всех кабинетах"
    },
    category: "categoryStock",
    frequency: "daily",
    isCompleted: false,
    completedBy: null,
    completedAt: null
  },
  {
    id: "task_16",
    title: {
      de: "Verbrauchsmaterial in allen Zimmern überprüfen (z.B. Holzspatel, Handschuhe, Ohrentrichter)",
      en: "Check medical supplies in all rooms (e.g. wooden spatulas, gloves, specula)",
      fr: "Vérifier le matériel consommable (spatules, gants, spéculums)",
      ru: "Проверка расходных материалов во всех кабинетах (деревянные шпатели, перчатки, воронки)"
    },
    category: "categoryStock",
    frequency: "daily",
    isCompleted: false,
    completedBy: null,
    completedAt: null
  }
];

export default function App() {
  const [lang, setLang] = useState('de');
  const [activeTab, setActiveTab] = useState('checklist'); 
  const [taskFilter, setTaskFilter] = useState('all');
  const [copied, setCopied] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [selectedUserTag, setSelectedUserTag] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [currentUserSession, setCurrentUserSession] = useState(null);
  const [user, setUser] = useState(null);

  // App Data State (Synced with Cloud)
  const [userProfiles, setUserProfiles] = useState(DEFAULT_USER_PROFILES);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [logs, setLogs] = useState([]);

  // Dashboard Filters
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterTrainee, setFilterTrainee] = useState('ALL');

  // New task form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('categoryGeneral');
  const [newTaskFrequency, setNewTaskFrequency] = useState('daily');

  // New User Form State (For Management Only)
  const [newUserName, setNewUserName] = useState('');
  const [newUserTag, setNewUserTag] = useState('');
  const [newUserRole, setNewUserRole] = useState('TRAINEE');
  const [newUserPin, setNewUserPin] = useState('');

  const t = TRANSLATIONS[lang] || TRANSLATIONS.de;

  // 1. Firebase Authentication Effect
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth Error:", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Realtime Cloud Sync Effect (Tasks, Logs & Users)
  useEffect(() => {
    if (!user) return;

    // Realtime Users Listener
    const usersColl = collection(db, 'artifacts', appId, 'public', 'data', 'users');
    const unsubscribeUsers = onSnapshot(usersColl, (snapshot) => {
      if (!snapshot.empty) {
        const cloudUsers = snapshot.docs.map(doc => doc.data());
        setUserProfiles(cloudUsers);
      } else {
        // Initialize cloud database with default users
        DEFAULT_USER_PROFILES.forEach(u => {
          setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', u.tag), u);
        });
      }
    }, (error) => console.error("Users Listener Error:", error));

    // Realtime Tasks Listener
    const tasksColl = collection(db, 'artifacts', appId, 'public', 'data', 'tasks');
    const unsubscribeTasks = onSnapshot(tasksColl, (snapshot) => {
      if (!snapshot.empty) {
        const cloudTasks = snapshot.docs.map(doc => doc.data());
        setTasks(cloudTasks);
      } else {
        INITIAL_TASKS.forEach(task => {
          setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'tasks', task.id), task);
        });
      }
    }, (error) => console.error("Tasks Listener Error:", error));

    // Realtime Logs Listener
    const logsColl = collection(db, 'artifacts', appId, 'public', 'data', 'logs');
    const unsubscribeLogs = onSnapshot(logsColl, (snapshot) => {
      if (!snapshot.empty) {
        const cloudLogs = snapshot.docs.map(doc => doc.data());
        cloudLogs.sort((a, b) => b.timestamp - a.timestamp);
        setLogs(cloudLogs);
      }
    }, (error) => console.error("Logs Listener Error:", error));

    return () => {
      unsubscribeUsers();
      unsubscribeTasks();
      unsubscribeLogs();
    };
  }, [user]);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!selectedUserTag) {
      setAuthError('Bitte wähle zuerst deinen Namen aus!');
      return;
    }

    const pinInput = loginPin.trim();

    const userProfile = userProfiles.find(
      (u) => u.tag === selectedUserTag && u.pin.toUpperCase() === pinInput.toUpperCase()
    );

    if (userProfile) {
      const session = { name: userProfile.name, role: userProfile.role, tag: userProfile.tag };
      setCurrentUserSession(session);
      setActiveTab(userProfile.role === 'INSTRUCTOR' ? 'dashboard' : 'checklist');
      setLoginPin('');
      return;
    }

    setAuthError(t.loginError);
  };

  const handleLogout = () => {
    setCurrentUserSession(null);
    setSelectedUserTag('');
    setLoginPin('');
    setAuthError('');
  };

  // Add / Edit User (Leitung Only)
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserTag.trim() || !newUserPin.trim()) return;

    const formattedTag = newUserTag.trim().toUpperCase();
    const newUserObj = {
      tag: formattedTag,
      name: newUserName.trim(),
      role: newUserRole,
      pin: newUserPin.trim()
    };

    // Update locally
    setUserProfiles(prev => [...prev.filter(u => u.tag !== formattedTag), newUserObj]);

    setNewUserName('');
    setNewUserTag('');
    setNewUserPin('');

    // Save Live to Cloud
    if (user) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', formattedTag), newUserObj);
      } catch (err) {
        console.error("Error saving user to cloud:", err);
      }
    }
  };

  // Delete User (Leitung Only)
  const handleDeleteUser = async (userTagToDelete) => {
    if (userTagToDelete === 'LEITUNG') return; // Protect main account
    setUserProfiles(prev => prev.filter(u => u.tag !== userTagToDelete));

    if (user) {
      try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', userTagToDelete);
        await setDoc(docRef, { tag: userTagToDelete, _deleted: true });
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  // Toggle Task Status with Realtime Cloud Write
  const handleToggleTask = async (task) => {
    if (!currentUserSession) return;

    const nextState = !task.isCompleted;
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let titleText = '';
    if (typeof task.title === 'string') {
      titleText = task.title;
    } else if (task.title && typeof task.title === 'object') {
      titleText = task.title[lang] || task.title['de'] || Object.values(task.title)[0] || '';
    }

    const updatedTask = {
      ...task,
      isCompleted: nextState,
      completedBy: nextState ? currentUserSession.name : null,
      completedAt: nextState ? now.toISOString() : null
    };

    // Update locally immediately for smooth UI
    setTasks(prev => prev.map(tItem => tItem.id === task.id ? updatedTask : tItem));

    // Save to Cloud Realtime DB
    if (user) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'tasks', task.id), updatedTask);

        // Add Log Entry to Cloud
        const logId = "log_" + Date.now();
        const newLog = {
          id: logId,
          taskId: task.id,
          taskTitle: titleText,
          trainee: currentUserSession.name,
          action: nextState ? 'COMPLETED' : 'RESET',
          date: formattedDate,
          time: formattedTime,
          timestamp: now.getTime()
        };
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'logs', logId), newLog);
      } catch (e) {
        console.error("Error saving task toggle:", e);
      }
    }
  };

  // Add Custom Task with Realtime Cloud Write
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTaskId = "task_" + Date.now();
    const newTask = {
      id: newTaskId,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      frequency: newTaskFrequency,
      isCompleted: false,
      completedBy: null,
      completedAt: null
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');

    // Push new task live to all devices via Firestore
    if (user) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'tasks', newTaskId), newTask);
      } catch (e) {
        console.error("Error adding new task to cloud:", e);
      }
    }
  };

  // Reset All Tasks with Realtime Cloud Write
  const handleResetAllTasks = async () => {
    const resetTasksList = tasks.map((tItem) => ({
      ...tItem,
      isCompleted: false,
      completedBy: null,
      completedAt: null
    }));

    setTasks(resetTasksList);

    if (user) {
      try {
        for (const rTask of resetTasksList) {
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'tasks', rTask.id), rTask);
        }
      } catch (e) {
        console.error("Error resetting tasks in cloud:", e);
      }
    }
  };

  // Calculated Dashboard Stats & Filtered Data
  const displayedTasks = tasks.filter((tItem) => {
    if (taskFilter === 'daily') return tItem.frequency === 'daily';
    if (taskFilter === 'weekly') return tItem.frequency === 'weekly';
    return true;
  });

  const filteredLogs = logs.filter((log) => {
    const matchesDate = log.date === filterDate;
    const matchesTrainee = filterTrainee === 'ALL' || log.trainee === filterTrainee;
    return matchesDate && matchesTrainee;
  });

  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((tItem) => tItem.isCompleted).length;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const traineesList = userProfiles.filter((u) => u.role === 'TRAINEE').map((u) => u.name);


  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Azubi Praxis Checkliste',
        text: 'Tägliche & Wöchentliche Aufgaben Checkliste',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-16">
      {/* Header Mobile Optimized */}
      <header className="bg-indigo-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="bg-indigo-700 p-2 rounded-xl flex-shrink-0">
              <CheckSquare className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base tracking-tight leading-tight">{t.title}</h1>
              <div className="flex items-center gap-1.5 text-[11px] text-indigo-300">
                <Cloud className="w-3 h-3 text-emerald-400" />
                <span>{currentUserSession ? currentUserSession.name : t.syncing}</span>
              </div>
            </div>
          </div>

          {/* Controls: Share, Language & Logout */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              title="Link teilen"
              className="flex items-center gap-1 bg-indigo-800 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border border-indigo-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Kopiert!' : 'Teilen'}</span>
            </button>

            <div className="flex items-center bg-indigo-800/80 rounded-xl p-1 border border-indigo-500/30">
              <Globe className="w-4 h-4 ml-1.5 mr-1 text-indigo-200" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                aria-label={t.language}
                className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="de" className="text-slate-800">DE</option>
                <option value="en" className="text-slate-800">EN</option>
                <option value="fr" className="text-slate-800">FR</option>
                <option value="ru" className="text-slate-800">RU</option>
              </select>
            </div>

            {currentUserSession && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-indigo-800 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border border-indigo-700"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        {currentUserSession && (
          <div className="max-w-4xl mx-auto px-3 flex border-t border-indigo-800/60 overflow-x-auto">
            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors flex-shrink-0 ${
                activeTab === 'checklist' 
                  ? 'border-white text-white bg-indigo-800/40' 
                  : 'border-transparent text-indigo-300 hover:text-white'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              {t.checklistTab}
            </button>
            
            {currentUserSession.role === 'INSTRUCTOR' ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-1 py-2 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors flex-shrink-0 ${
                    activeTab === 'dashboard' 
                      ? 'border-white text-white bg-indigo-800/40' 
                      : 'border-transparent text-indigo-300 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t.dashboardTab}
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex-1 py-2 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors flex-shrink-0 ${
                    activeTab === 'users' 
                      ? 'border-white text-white bg-indigo-800/40' 
                      : 'border-transparent text-indigo-300 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  {t.usersTab}
                </button>
              </>
            ) : (
              <div className="flex-1 py-2 text-xs font-medium text-indigo-400/60 flex items-center justify-center gap-1 cursor-not-allowed flex-shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Dashboard & Leitung</span>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-3 pt-4">

        {/* SIMPLIFIED LOGIN SCREEN */}
        {!currentUserSession ? (
          <div className="max-w-sm mx-auto my-4 sm:my-8">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-5 sm:p-7">
              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-2.5 text-indigo-600">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">{t.loginTitle}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{t.loginSubtitle}</p>
              </div>

              {authError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold text-center">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.selectUser}
                  </label>
                  <select
                    value={selectedUserTag}
                    onChange={(e) => {
                      setSelectedUserTag(e.target.value);
                      setAuthError('');
                    }}
                    required
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 text-slate-800"
                  >
                    <option value="">-- Bitte Namen auswählen --</option>
                    {userProfiles.filter(u => !u._deleted).map((profile) => (
                      <option key={profile.tag} value={profile.tag}>
                        {profile.name} {profile.role === 'INSTRUCTOR' ? '(Leitung)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Passwort / PIN
                  </label>
                  <input
                    type="password"
                    value={loginPin}
                    onChange={(e) => {
                      setLoginPin(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="z. B. PIN eingeben"
                    required
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-sm font-bold transition-all shadow-md"
                >
                  {t.loginBtn}
                </button>
              </form>

              {/* Mobile Installation Guide Card */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowInstallGuide(!showInstallGuide)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center justify-center gap-1 mx-auto"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Als Handy-App installieren?</span>
                </button>

                {showInstallGuide && (
                  <div className="mt-3 text-left bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
                    <p className="font-bold text-slate-800">📱 Auf dem Handy speichern:</p>
                    <p><strong>iOS (Safari):</strong> Teilen-Symbol ➔ „Zum Home-Bildschirm“</p>
                    <p><strong>Android (Chrome):</strong> 3-Punkte-Menü ➔ „App installieren“</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* VIEW 1: CHECKLIST TAB */}
            {activeTab === 'checklist' && (
              <div className="space-y-4">

                {/* Add New Task Form */}
                {currentUserSession.role === 'INSTRUCTOR' && (
                  <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 space-y-3">
                    <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-indigo-600" />
                      <span>{t.addTask}</span>
                    </h2>

                    <form onSubmit={handleAddTask} className="space-y-2.5">
                      <input
                        type="text"
                        placeholder={t.taskPlaceholder}
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={newTaskCategory}
                          onChange={(e) => setNewTaskCategory(e.target.value)}
                          aria-label={t.taskCategory}
                          className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none"
                        >
                          <option value="categoryStock">{t.categoryStock}</option>
                          <option value="categoryClean">{t.categoryClean}</option>
                          <option value="categoryPrep">{t.categoryPrep}</option>
                          <option value="categoryGeneral">{t.categoryGeneral}</option>
                        </select>
                        <select
                          value={newTaskFrequency}
                          onChange={(e) => setNewTaskFrequency(e.target.value)}
                          aria-label={t.taskType}
                          className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none font-semibold text-indigo-700"
                        >
                          <option value="daily">{t.typeDaily}</option>
                          <option value="weekly">{t.typeWeekly}</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        {t.addTask}
                      </button>
                    </form>
                  </div>
                )}

                {/* Filter Tabs */}
                <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
                  <div className="flex bg-slate-200/80 p-1 rounded-xl gap-1 text-xs w-full sm:w-auto">
                    <button
                      onClick={() => setTaskFilter('all')}
                      className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        taskFilter === 'all'
                          ? 'bg-white text-indigo-900 shadow-xs'
                          : 'text-slate-600'
                      }`}
                    >
                      {t.allTasks} ({tasks.length})
                    </button>
                    <button
                      onClick={() => setTaskFilter('daily')}
                      className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        taskFilter === 'daily'
                          ? 'bg-white text-indigo-900 shadow-xs'
                          : 'text-slate-600'
                      }`}
                    >
                      {t.todayTasks} ({tasks.filter(tItem => tItem.frequency === 'daily').length})
                    </button>
                    <button
                      onClick={() => setTaskFilter('weekly')}
                      className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        taskFilter === 'weekly'
                          ? 'bg-white text-indigo-900 shadow-xs'
                          : 'text-slate-600'
                      }`}
                    >
                      {t.weeklyTasks} ({tasks.filter(tItem => tItem.frequency === 'weekly').length})
                    </button>
                  </div>

                  {currentUserSession.role === 'INSTRUCTOR' && (
                    <button
                      onClick={handleResetAllTasks}
                      className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 font-semibold transition-colors flex-shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t.resetDay}</span>
                    </button>
                  )}
                </div>

                {/* Task Cards */}
                <div className="space-y-2.5">
                  {displayedTasks.length === 0 ? (
                    <div className="bg-white p-6 text-center text-slate-400 text-xs rounded-2xl border border-slate-200">
                      {t.noTasks}
                    </div>
                  ) : (
                    displayedTasks.map((task) => {
                      let displayTitle = '';
                      if (typeof task.title === 'string') {
                        displayTitle = task.title;
                      } else if (task.title && typeof task.title === 'object') {
                        displayTitle = task.title[lang] || task.title['de'] || Object.values(task.title)[0] || '';
                      }
                      displayTitle = String(displayTitle);

                      const categoryLabel = t[task.category] || t.categoryGeneral;
                      const frequencyLabel = task.frequency === 'weekly' ? t.typeWeekly : t.typeDaily;
                      const formattedTime = task.completedAt ? new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

                      return (
                        <div
                          key={task.id}
                          onClick={() => handleToggleTask(task)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 active:scale-[0.99] ${
                            task.isCompleted
                              ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                              : 'bg-white border-slate-200 shadow-xs active:bg-slate-50'
                          }`}
                        >
                          <button
                            type="button"
                            className={`mt-0.5 w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                              task.isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'border-2 border-slate-300 bg-white'
                            }`}
                          >
                            {task.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                          </button>
                          
                          <div className="flex-1">
                            <p className={`text-xs sm:text-sm font-semibold leading-snug ${
                              task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                            }`}>
                              {displayTitle}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                task.frequency === 'weekly' 
                                  ? 'bg-purple-100 text-purple-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {frequencyLabel}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                {categoryLabel}
                              </span>
                              
                              {task.isCompleted && (
                                <div className="w-full mt-1 text-[11px] text-emerald-800 font-medium flex items-center gap-1 bg-emerald-100/60 px-2 py-1 rounded-lg">
                                  <User className="w-3 h-3 flex-shrink-0 text-emerald-600" />
                                  <span>{t.completedBy}</span>
                                  <strong className="font-bold">{String(task.completedBy || '')}</strong>
                                  <span>({formattedTime})</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            )}

            {/* VIEW 2: LEITUNG DASHBOARD */}
            {activeTab === 'dashboard' && currentUserSession.role === 'INSTRUCTOR' && (
              <div className="space-y-4">

                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 space-y-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-indigo-600" />
                      {t.dashboardTab}
                    </h2>
                    <p className="text-xs text-slate-500">Kalender-Protokoll & Live-Auswertung</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFilterDate(new Date().toISOString().split('T')[0])}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        filterDate === new Date().toISOString().split('T')[0]
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.today}
                    </button>
                    <button
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() - 1);
                        setFilterDate(d.toISOString().split('T')[0]);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        filterDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.yesterday}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        aria-label={t.filterDate}
                        className="bg-transparent text-slate-800 font-bold focus:outline-none w-full"
                      />
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs">
                      <Filter className="w-4 h-4 text-slate-400" />
                      <select
                        value={filterTrainee}
                        onChange={(e) => setFilterTrainee(e.target.value)}
                        aria-label={t.filterTrainee}
                        className="bg-transparent text-slate-700 font-medium focus:outline-none w-full"
                      >
                        <option value="ALL">{t.allTrainees}</option>
                        {traineesList.map(tName => (
                          <option key={tName} value={tName}>{tName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Quote</p>
                    <p className="text-lg sm:text-xl font-extrabold text-indigo-600 mt-0.5">{completionPercentage}%</p>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Erledigt</p>
                    <p className="text-lg sm:text-xl font-extrabold text-emerald-600 mt-0.5">{completedTasksCount}</p>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Azubis</p>
                    <p className="text-lg sm:text-xl font-extrabold text-amber-600 mt-0.5">{traineesList.length}</p>
                  </div>
                </div>

                {/* Log List */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{String(t.activityLog)} ({String(filterDate)})</span>
                    </h3>
                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full font-bold text-slate-600">
                      {filteredLogs.length}
                    </span>
                  </div>

                  {filteredLogs.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      {String(t.noLogsForDate)}
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {filteredLogs.map((log) => {
                        const taskTitleText = typeof log.taskTitle === 'object'
                          ? String(log.taskTitle[lang] || log.taskTitle['de'] || Object.values(log.taskTitle)[0] || '')
                          : String(log.taskTitle || '');

                        return (
                          <div key={log.id} className="p-3 hover:bg-slate-50 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800">{String(log.trainee)}</span>
                              <span className="text-[10px] font-mono text-slate-400">{String(log.time)}</span>
                            </div>
                            <p className="text-slate-700 leading-snug">{taskTitleText}</p>
                            <div className="pt-0.5">
                              <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                log.action === 'COMPLETED' 
                                  ? 'bg-emerald-100 text-emerald-700' 
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {log.action === 'COMPLETED' ? String(t.statusDone) : String(t.statusUndone)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* VIEW 3: LEITUNG USER MANAGEMENT (NUTZER & PINS) */}
            {activeTab === 'users' && currentUserSession.role === 'INSTRUCTOR' && (
              <div className="space-y-4">
                
                {/* Add User Card */}
                <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 space-y-3">
                  <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-indigo-600" />
                    <span>{t.addUserTitle}</span>
                  </h2>

                  <form onSubmit={handleAddUser} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">{t.userName}</label>
                        <input
                          type="text"
                          required
                          placeholder="z. B. Erika Muster"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">{t.userTag}</label>
                        <input
                          type="text"
                          required
                          placeholder="z. B. EM01"
                          value={newUserTag}
                          onChange={(e) => setNewUserTag(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 uppercase"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">{t.userRole}</label>
                        <select
                          value={newUserRole}
                          onChange={(e) => setNewUserRole(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none font-medium"
                        >
                          <option value="TRAINEE">{t.roleTrainee}</option>
                          <option value="INSTRUCTOR">{t.roleInstructor}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">{t.userPin}</label>
                        <input
                          type="text"
                          required
                          placeholder="z. B. EM99"
                          value={newUserPin}
                          onChange={(e) => setNewUserPin(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{t.addUserBtn}</span>
                    </button>
                  </form>
                </div>

                {/* Users & PIN List */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-slate-600" />
                      <span>{t.userListTitle}</span>
                    </h3>
                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full font-bold text-slate-600">
                      {userProfiles.filter(u => !u._deleted).length}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {userProfiles.filter(u => !u._deleted).map((uProfile) => (
                      <div key={uProfile.tag} className="p-3 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                            uProfile.role === 'INSTRUCTOR' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {uProfile.tag}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 leading-tight">{uProfile.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {uProfile.role === 'INSTRUCTOR' ? t.roleInstructor : t.roleTrainee}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700">
                            <Key className="w-3 h-3 text-slate-400" />
                            <span>{uProfile.pin}</span>
                          </div>

                          {uProfile.tag !== 'LEITUNG' && (
                            <button
                              onClick={() => handleDeleteUser(uProfile.tag)}
                              title="Nutzer löschen"
                              className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}
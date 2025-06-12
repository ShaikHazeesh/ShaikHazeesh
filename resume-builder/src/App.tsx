import React, { useState, useEffect } from 'react';
import './App.css';
import PersonalInfoForm from './components/PersonalInfoForm';
import CareerObjectiveForm from './components/CareerObjectiveForm';
import EducationForm, { EducationEntry } from './components/EducationForm';
import TechnicalSkillsForm from './components/TechnicalSkillsForm';
import AcademicProjectsForm, { ProjectEntry } from './components/AcademicProjectsForm';
import ProfessionalExperienceForm, { ExperienceEntry } from './components/ProfessionalExperienceForm';
import CertificationsForm, { CertificationEntry } from './components/CertificationsForm';
import AchievementsForm, { AchievementEntry } from './components/AchievementsForm';
import ExtracurricularActivitiesForm, { ActivityEntry } from './components/ExtracurricularActivitiesForm';

function App() {
  // Personal Info
  const [name, setNameState] = useState(''); // Renaming to avoid conflict with HTML property
  const [nameError, setNameError] = useState('');
  const [email, setEmailState] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phone, setPhoneState] = useState(''); // Renaming for consistency
  // Phone error state could be added: const [phoneError, setPhoneError] = useState('');
  const [linkedin, setLinkedinState] = useState(''); // Renaming
  const [linkedInUrlError, setLinkedInUrlError] = useState('');
  const [github, setGithubState] = useState(''); // Renaming
  const [githubUrlError, setGithubUrlError] = useState('');

  // Career Objective
  const [objective, setObjectiveState] = useState(''); // Renaming
  const [careerObjectiveError, setCareerObjectiveError] = useState('');
  const MAX_OBJECTIVE_LENGTH = 500;

  // Education
  const initialEducationEntry: EducationEntry = { degree: '', institution: '', cgpa: '', year: '' };
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([initialEducationEntry]);
  const [educationErrors, setEducationErrors] = useState<Array<Partial<Record<keyof EducationEntry, string>>>>([{}]);

  const handleAddEducation = () => {
    setEducationEntries([...educationEntries, { ...initialEducationEntry }]);
    setEducationErrors([...educationErrors, {}]); // Add empty error object for the new entry
  };
  const handleRemoveEducation = (index: number) => {
    setEducationEntries(educationEntries.filter((_, i) => i !== index));
    setEducationErrors(educationErrors.filter((_, i) => i !== index)); // Remove corresponding errors
  };
  const handleUpdateEducation = (index: number, updatedEntry: EducationEntry) => {
    const newEntries = [...educationEntries];
    newEntries[index] = updatedEntry;
    setEducationEntries(newEntries);
    // Optionally, re-validate on update or clear specific errors
    // For now, validation is primarily on blur.
  };
  const handleEducationFieldBlur = (index: number, fieldName: keyof EducationEntry, value: string) => {
    const newErrors = [...educationErrors];
    if (!newErrors[index]) newErrors[index] = {}; // Ensure error object exists

    let message = '';
    value = value.trim();
    if (!value) {
      message = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
    } else if (fieldName === 'year' && !/^\d{4}$/.test(value)) {
      message = 'Year must be a 4-digit number.';
    }

    newErrors[index][fieldName] = message;
    setEducationErrors(newErrors);
  };


  // Technical Skills
  const [programmingLanguages, setProgrammingLanguagesState] = useState('');
  const [programmingLanguagesError, setProgrammingLanguagesError] = useState('');
  const [frameworks, setFrameworks] = useState('');
  const [databases, setDatabases] = useState('');

  const handleProgrammingLanguagesChange = (value: string) => {
    setProgrammingLanguagesState(value);
    if (value.trim()) setProgrammingLanguagesError(''); // Clear error if user starts typing
  };
  const handleProgrammingLanguagesBlur = () => {
    if (!programmingLanguages.trim()) {
      setProgrammingLanguagesError('At least one programming language is recommended.');
    } else {
      setProgrammingLanguagesError('');
    }
  };

  // Academic Projects
  const initialProjectEntry: ProjectEntry = { title: '', description: '', techStack: '', githubLink: '' };
  const [projectEntries, setProjectEntries] = useState<ProjectEntry[]>([initialProjectEntry]);
  const [projectErrors, setProjectErrors] = useState<Array<Partial<Record<keyof ProjectEntry, string>>>>([{}]);

  const handleAddProject = () => {
    setProjectEntries([...projectEntries, { ...initialProjectEntry }]);
    setProjectErrors([...projectErrors, {}]);
  };
  const handleRemoveProject = (index: number) => {
    setProjectEntries(projectEntries.filter((_, i) => i !== index));
    setProjectErrors(projectErrors.filter((_, i) => i !== index));
  };
  const handleUpdateProject = (index: number, updatedEntry: ProjectEntry) => {
    const newEntries = [...projectEntries];
    newEntries[index] = updatedEntry;
    setProjectEntries(newEntries);
    // Clear "required" error for a field if it's being updated and now has content
    const fieldUpdated = Object.keys(updatedEntry).find(key =>
      newEntries[index][key as keyof ProjectEntry] !== projectEntries[index]?.[key as keyof ProjectEntry] && updatedEntry[key as keyof ProjectEntry]
    ) as keyof ProjectEntry | undefined;

    if (fieldUpdated && updatedEntry[fieldUpdated]?.trim() && projectErrors[index]?.[fieldUpdated]) {
      const newErrors = [...projectErrors];
      if(newErrors[index]) newErrors[index][fieldUpdated] = '';
      setProjectErrors(newErrors);
    }
  };
  const handleProjectFieldBlur = (index: number, fieldName: keyof ProjectEntry, value: string) => {
    const newErrors = [...projectErrors];
    if (!newErrors[index]) newErrors[index] = {};
    let message = '';
    if (!value.trim()) {
      message = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
    }
    // Add other specific validations for project fields if needed
    newErrors[index][fieldName] = message;
    setProjectErrors(newErrors);
  };

  // Professional Experience
  const initialExperienceEntry: ExperienceEntry = { companyName: '', role: '', duration: '', responsibilities: '' };
  const [experienceEntries, setExperienceEntries] = useState<ExperienceEntry[]>([initialExperienceEntry]);
  const [experienceErrors, setExperienceErrors] = useState<Array<Partial<Record<keyof ExperienceEntry, string>>>>([{}]);

  const handleAddExperience = () => {
    setExperienceEntries([...experienceEntries, { ...initialExperienceEntry }]);
    setExperienceErrors([...experienceErrors, {}]);
  };
  const handleRemoveExperience = (index: number) => {
    setExperienceEntries(experienceEntries.filter((_, i) => i !== index));
    setExperienceErrors(experienceErrors.filter((_, i) => i !== index));
  };
  const handleUpdateExperience = (index: number, updatedEntry: ExperienceEntry) => {
    const newEntries = [...experienceEntries];
    newEntries[index] = updatedEntry;
    setExperienceEntries(newEntries);

    const fieldUpdated = Object.keys(updatedEntry).find(key =>
      newEntries[index][key as keyof ExperienceEntry] !== experienceEntries[index]?.[key as keyof ExperienceEntry] && updatedEntry[key as keyof ExperienceEntry]
    ) as keyof ExperienceEntry | undefined;

    if (fieldUpdated && updatedEntry[fieldUpdated]?.trim() && experienceErrors[index]?.[fieldUpdated]) {
      const newErrors = [...experienceErrors];
      if(newErrors[index]) newErrors[index][fieldUpdated] = '';
      setExperienceErrors(newErrors);
    }
  };
  const handleExperienceFieldBlur = (index: number, fieldName: keyof ExperienceEntry, value: string) => {
    const newErrors = [...experienceErrors];
    if (!newErrors[index]) newErrors[index] = {};
    let message = '';
    if (!value.trim()) {
      message = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
    }
    // Add other specific validations for experience fields if needed
    newErrors[index][fieldName] = message;
    setExperienceErrors(newErrors);
  };

  // Certifications
  const initialCertificationEntry: CertificationEntry = { name: '', organization: '', year: '' };
  const [certificationEntries, setCertificationEntries] = useState<CertificationEntry[]>([initialCertificationEntry]);
  const [certificationErrors, setCertificationErrors] = useState<Array<Partial<Record<keyof CertificationEntry, string>>>>([{}]);

  const handleAddCertification = () => {
    setCertificationEntries([...certificationEntries, { ...initialCertificationEntry }]);
    setCertificationErrors([...certificationErrors, {}]);
  };
  const handleRemoveCertification = (index: number) => {
    setCertificationEntries(certificationEntries.filter((_, i) => i !== index));
    setCertificationErrors(certificationErrors.filter((_, i) => i !== index));
  };
  const handleUpdateCertification = (index: number, updatedEntry: CertificationEntry) => {
    const newEntries = [...certificationEntries];
    newEntries[index] = updatedEntry;
    setCertificationEntries(newEntries);
    // Clear "required" error for a field if it's being updated
    const fieldUpdated = Object.keys(updatedEntry).find(key =>
      newEntries[index][key as keyof CertificationEntry] !== certificationEntries[index]?.[key as keyof CertificationEntry] && updatedEntry[key as keyof CertificationEntry]
    ) as keyof CertificationEntry | undefined;

    if (fieldUpdated && updatedEntry[fieldUpdated]?.trim() && certificationErrors[index]?.[fieldUpdated]) {
      const newErrors = [...certificationErrors];
      if(newErrors[index]) newErrors[index][fieldUpdated] = '';
      setCertificationErrors(newErrors);
    }
  };
  const handleCertificationFieldBlur = (index: number, fieldName: keyof CertificationEntry, value: string) => {
    const newErrors = [...certificationErrors];
    if (!newErrors[index]) newErrors[index] = {};
    let message = '';
    value = value.trim();
    if (!value) {
      message = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
    } else if (fieldName === 'year' && !/^\d{4}$/.test(value)) {
      message = 'Year must be a 4-digit number.';
    }
    newErrors[index][fieldName] = message;
    setCertificationErrors(newErrors);
  };

  // Achievements
  const initialAchievementEntry: AchievementEntry = { description: '' };
  const [achievementEntries, setAchievementEntries] = useState<AchievementEntry[]>([initialAchievementEntry]);
  const [achievementErrors, setAchievementErrors] = useState<Array<Partial<Record<keyof AchievementEntry, string>>>>([{}]);

  const handleAddAchievement = () => {
    setAchievementEntries([...achievementEntries, { ...initialAchievementEntry }]);
    setAchievementErrors([...achievementErrors, {}]);
  };
  const handleRemoveAchievement = (index: number) => {
    setAchievementEntries(achievementEntries.filter((_, i) => i !== index));
    setAchievementErrors(achievementErrors.filter((_, i) => i !== index));
  };
  const handleUpdateAchievement = (index: number, updatedEntry: AchievementEntry) => {
    const newEntries = [...achievementEntries];
    newEntries[index] = updatedEntry;
    setAchievementEntries(newEntries);
    if (updatedEntry.description.trim() && achievementErrors[index]?.description) {
      const newErrors = [...achievementErrors];
      if(newErrors[index]) newErrors[index].description = '';
      setAchievementErrors(newErrors);
    }
  };
  const handleAchievementFieldBlur = (index: number, fieldName: keyof AchievementEntry, value: string) => {
    const newErrors = [...achievementErrors];
    if (!newErrors[index]) newErrors[index] = {};
    let message = '';
    if (!value.trim()) {
      message = `Description is required.`;
    }
    // Max length is handled by textarea attribute, but error message could be set here too if needed
    newErrors[index][fieldName] = message;
    setAchievementErrors(newErrors);
  };

  // Extracurricular Activities
  const initialActivityEntry: ActivityEntry = { description: '', role: '' };
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>([initialActivityEntry]);
  const [activityErrors, setActivityErrors] = useState<Array<Partial<Record<keyof ActivityEntry, string>>>>([{}]);

  const handleAddActivity = () => {
    setActivityEntries([...activityEntries, { ...initialActivityEntry }]);
    setActivityErrors([...activityErrors, {}]);
  };
  const handleRemoveActivity = (index: number) => {
    setActivityEntries(activityEntries.filter((_, i) => i !== index));
    setActivityErrors(activityErrors.filter((_, i) => i !== index));
  };
  const handleUpdateActivity = (index: number, updatedEntry: ActivityEntry) => {
    const newEntries = [...activityEntries];
    newEntries[index] = updatedEntry;
    setActivityEntries(newEntries);
    const fieldUpdated = Object.keys(updatedEntry).find(key =>
      newEntries[index][key as keyof ActivityEntry] !== activityEntries[index]?.[key as keyof ActivityEntry] && updatedEntry[key as keyof ActivityEntry]
    ) as keyof ActivityEntry | undefined;

    if (fieldUpdated && updatedEntry[fieldUpdated]?.trim() && activityErrors[index]?.[fieldUpdated]) {
      const newErrors = [...activityErrors];
      if(newErrors[index]) newErrors[index][fieldUpdated] = '';
      setActivityErrors(newErrors);
    }
  };
  const handleActivityFieldBlur = (index: number, fieldName: keyof ActivityEntry, value: string) => {
    const newErrors = [...activityErrors];
    if (!newErrors[index]) newErrors[index] = {};
    let message = '';
    if (!value.trim()) {
      message = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
    }
    newErrors[index][fieldName] = message;
    setActivityErrors(newErrors);
  };

  // --- Validation Handlers ---
  const handleNameChange = (value: string) => {
    setNameState(value);
    if (value.trim()) setNameError(''); // Clear error as user types if field becomes non-empty
  };
  const handleNameBlur = () => {
    if (!name.trim()) {
      setNameError('Name is required.');
    } else {
      setNameError('');
    }
  };

  const validateEmail = (emailValue: string): boolean => {
    if (!emailValue.trim()) { // Also check trim for required
      setEmailError('Email is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError('Invalid email format.');
      return false;
    }
    setEmailError('');
    return true;
  };
  const handleEmailChange = (value: string) => {
    setEmailState(value);
    validateEmail(value); // Validate on change for immediate feedback
  };
  const handleEmailBlur = () => {
    validateEmail(email); // Re-validate on blur, especially for empty check
  };

  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

  const handleLinkedinChange = (value: string) => {
    setLinkedinState(value);
    if (value.trim() && !urlPattern.test(value)) { // Only validate if not empty
      setLinkedInUrlError('Invalid URL format.');
    } else {
      setLinkedInUrlError('');
    }
  };
  const handleLinkedinBlur = () => {
    if (linkedin.trim() && !urlPattern.test(linkedin)) {
      setLinkedInUrlError('Invalid URL format.');
    } else {
      setLinkedInUrlError(''); // Clear error if empty or valid
    }
  };

  const handleGithubChange = (value: string) => {
    setGithubState(value);
    if (value.trim() && !urlPattern.test(value)) { // Only validate if not empty
      setGithubUrlError('Invalid URL format.');
    } else {
      setGithubUrlError('');
    }
  };
  const handleGithubBlur = () => {
    if (github.trim() && !urlPattern.test(github)) {
      setGithubUrlError('Invalid URL format.');
    } else {
      setGithubUrlError(''); // Clear error if empty or valid
    }
  };

  // --- End Validation Handlers ---
  // (Validation handlers for Name, Email, URLs, Objective remain here)
  // ... and handlers for Education, Skills, Projects, Experience, Certifications, Achievements, Activities ...

  const handleObjectiveChange = (value: string) => {
    setObjectiveState(value);
    if (value.length > MAX_OBJECTIVE_LENGTH) {
      setCareerObjectiveError(`Max ${MAX_OBJECTIVE_LENGTH} characters exceeded.`);
    } else if (!value.trim()) { // Check if required and show error immediately if cleared
        setCareerObjectiveError('Career objective is required.');
    } else { // Clear error if valid and not over limit
        setCareerObjectiveError('');
    }
  };
   const handleObjectiveBlur = () => {
    if (!objective.trim()) {
      setCareerObjectiveError('Career objective is required.');
    } else if (objective.length <= MAX_OBJECTIVE_LENGTH) { // Clear specific length error if now valid
       setCareerObjectiveError('');
    }
    // If over length, onChange already set the error, so no need to repeat here unless logic changes
  };

  // PDF Preview/Download state (from previous subtask)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // General error for PDF ops

  // --- Local Storage Logic ---
  const LOCAL_STORAGE_KEY = 'btechResumeData';

  const getResumeDataForStorage = () => ({
    name, email, phone, linkedin, github, // PersonalInfo
    objective, // CareerObjective
    educationEntries,
    technicalSkills: { programmingLanguages, frameworks, databases },
    projectEntries,
    experienceEntries,
    certificationEntries,
    achievementEntries,
    activityEntries,
    // Note: Error states and isLoading/previewUrl are not saved
  });

  // Auto-Save to Local Storage
  useEffect(() => {
    const timer = setInterval(() => {
      const currentFormData = getResumeDataForStorage();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentFormData));
      console.log('Resume data auto-saved to local storage.');
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(timer);
  }, [name, email, phone, linkedin, github, objective, educationEntries,
      programmingLanguages, frameworks, databases, projectEntries, experienceEntries,
      certificationEntries, achievementEntries, activityEntries]); // Dependency on all form data states

  // Rehydrate from Local Storage on Load
  useEffect(() => {
    const savedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedDataString) {
      try {
        const savedData = JSON.parse(savedDataString);
        console.log('Restoring data from local storage:', savedData);

        // Personal Info
        if (savedData.name !== undefined) setNameState(savedData.name);
        if (savedData.email !== undefined) setEmailState(savedData.email);
        if (savedData.phone !== undefined) setPhoneState(savedData.phone);
        if (savedData.linkedin !== undefined) setLinkedinState(savedData.linkedin);
        if (savedData.github !== undefined) setGithubState(savedData.github);

        // Career Objective
        if (savedData.objective !== undefined) setObjectiveState(savedData.objective);

        // Education
        if (savedData.educationEntries && Array.isArray(savedData.educationEntries) && savedData.educationEntries.length > 0) {
          setEducationEntries(savedData.educationEntries);
          setEducationErrors(Array(savedData.educationEntries.length).fill({})); // Reset errors array
        } else { // Ensure there's at least one entry if saved data is missing/empty for this
          setEducationEntries([{ ...initialEducationEntry }]);
          setEducationErrors([{}]);
        }

        // Technical Skills
        if (savedData.technicalSkills) {
          if (savedData.technicalSkills.programmingLanguages !== undefined) setProgrammingLanguagesState(savedData.technicalSkills.programmingLanguages);
          if (savedData.technicalSkills.frameworks !== undefined) setFrameworks(savedData.technicalSkills.frameworks);
          if (savedData.technicalSkills.databases !== undefined) setDatabases(savedData.technicalSkills.databases);
        }

        // Multi-entry sections: Projects, Experience, Certifications, Achievements, Activities
        // Similar pattern: check if array exists and has items, else provide initial entry
        // And reset corresponding error arrays
        const multiEntryFields: Array<{
          stateSetter: React.Dispatch<React.SetStateAction<any[]>>;
          errorSetter: React.Dispatch<React.SetStateAction<any[]>>;
          savedKey: string;
          initialEntry: any;
        }> = [
          { stateSetter: setProjectEntries, errorSetter: setProjectErrors, savedKey: 'projectEntries', initialEntry: initialProjectEntry },
          { stateSetter: setExperienceEntries, errorSetter: setExperienceErrors, savedKey: 'experienceEntries', initialEntry: initialExperienceEntry },
          { stateSetter: setCertificationEntries, errorSetter: setCertificationErrors, savedKey: 'certificationEntries', initialEntry: initialCertificationEntry },
          { stateSetter: setAchievementEntries, errorSetter: setAchievementErrors, savedKey: 'achievementEntries', initialEntry: initialAchievementEntry },
          { stateSetter: setActivityEntries, errorSetter: setActivityErrors, savedKey: 'activityEntries', initialEntry: initialActivityEntry },
        ];

        multiEntryFields.forEach(field => {
          if (savedData[field.savedKey] && Array.isArray(savedData[field.savedKey]) && savedData[field.savedKey].length > 0) {
            field.stateSetter(savedData[field.savedKey]);
            field.errorSetter(Array(savedData[field.savedKey].length).fill({}));
          } else {
            field.stateSetter([{ ...field.initialEntry }]);
            field.errorSetter([{}]);
          }
        });

        console.log('Data restored from local storage.');
      } catch (e) {
        console.error('Failed to parse or restore data from local storage:', e);
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
      }
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Cleanup effect for previewUrl (remains unchanged)
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  // --- Manual Save/Load/Clear Buttons Logic ---
  const manualSave = () => {
    const currentFormData = getResumeDataForStorage();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentFormData));
    alert('Data saved to Local Storage!');
    console.log('Manual save to local storage:', currentFormData);
  };

  const manualLoad = () => {
    // This will effectively re-run the rehydration logic by re-triggering the load useEffect.
    // A more direct way is to just call the load logic again.
    // For simplicity here, we'll just alert and let the user refresh if they want to see effect after clearing.
    // Or, better, extract load logic into a function and call it.
    // For now, this just serves as a placeholder.
    const savedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedDataString) {
       // Re-applying the load logic here for immediate effect
      try {
        const savedData = JSON.parse(savedDataString);
        // (Duplicate of rehydration logic for brevity in this example - ideally extract to a function)
        if (savedData.name !== undefined) setNameState(savedData.name);
        if (savedData.email !== undefined) setEmailState(savedData.email);
        if (savedData.phone !== undefined) setPhoneState(savedData.phone);
        if (savedData.linkedin !== undefined) setLinkedinState(savedData.linkedin);
        if (savedData.github !== undefined) setGithubState(savedData.github);
        if (savedData.objective !== undefined) setObjectiveState(savedData.objective);
        if (savedData.educationEntries && savedData.educationEntries.length > 0) {
            setEducationEntries(savedData.educationEntries);
            setEducationErrors(Array(savedData.educationEntries.length).fill({}));
        } else { setEducationEntries([{...initialEducationEntry}]); setEducationErrors([{}]); }
        if (savedData.technicalSkills) {
            if (savedData.technicalSkills.programmingLanguages !== undefined) setProgrammingLanguagesState(savedData.technicalSkills.programmingLanguages);
            if (savedData.technicalSkills.frameworks !== undefined) setFrameworks(savedData.technicalSkills.frameworks);
            if (savedData.technicalSkills.databases !== undefined) setDatabases(savedData.technicalSkills.databases);
        }
        const multiEntryFieldsConfig: Array<{stateSetter: React.Dispatch<React.SetStateAction<any[]>>; errorSetter: React.Dispatch<React.SetStateAction<any[]>>; savedKey: string; initialEntry: any;}> = [ { stateSetter: setProjectEntries, errorSetter: setProjectErrors, savedKey: 'projectEntries', initialEntry: initialProjectEntry }, { stateSetter: setExperienceEntries, errorSetter: setExperienceErrors, savedKey: 'experienceEntries', initialEntry: initialExperienceEntry }, { stateSetter: setCertificationEntries, errorSetter: setCertificationErrors, savedKey: 'certificationEntries', initialEntry: initialCertificationEntry }, { stateSetter: setAchievementEntries, errorSetter: setAchievementErrors, savedKey: 'achievementEntries', initialEntry: initialAchievementEntry }, { stateSetter: setActivityEntries, errorSetter: setActivityErrors, savedKey: 'activityEntries', initialEntry: initialActivityEntry }, ];
        multiEntryFieldsConfig.forEach(field => { if (savedData[field.savedKey] && Array.isArray(savedData[field.savedKey]) && savedData[field.savedKey].length > 0) { field.stateSetter(savedData[field.savedKey]); field.errorSetter(Array(savedData[field.savedKey].length).fill({})); } else { field.stateSetter([{ ...field.initialEntry }]); field.errorSetter([{}]); } });
        alert('Data loaded from Local Storage!');
        console.log('Manual load from local storage applied.');
      } catch (e) {
        alert('Failed to load or parse data from Local Storage.');
        console.error('Manual load error:', e);
      }
    } else {
      alert('No data found in Local Storage.');
    }
  };

  const manualClear = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    // Reset all form states to initial values
    setNameState(''); setNameError('');
    setEmailState(''); setEmailError('');
    setPhoneState('');
    setLinkedinState(''); setLinkedInUrlError('');
    setGithubState(''); setGithubUrlError('');
    setObjectiveState(''); setCareerObjectiveError('');
    setEducationEntries([{ ...initialEducationEntry }]); setEducationErrors([{}]);
    setProgrammingLanguagesState(''); setProgrammingLanguagesError('');
    setFrameworks('');
    setDatabases('');
    setProjectEntries([{ ...initialProjectEntry }]); setProjectErrors([{}]);
    setExperienceEntries([{ ...initialExperienceEntry }]); setExperienceErrors([{}]);
    setCertificationEntries([{ ...initialCertificationEntry }]); setCertificationErrors([{}]);
    setAchievementEntries([{ ...initialAchievementEntry }]); setAchievementErrors([{}]);
    setActivityEntries([{ ...initialActivityEntry }]); setActivityErrors([{}]);
    alert('Local Storage cleared and form reset!');
    console.log('Local storage cleared and form reset.');
  };
  // --- End Local Storage Logic ---


  const handlePreviewPdf = async () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setIsLoading(true);
    setError(null);

    const formData = { NAME: name, EMAIL: email, PHONE: phone /* Add all other form data here */ };
    console.log('Preview PDF clicked. Data:', formData);

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      if (blob.type !== 'application/pdf') throw new Error('Received file is not a PDF.');
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      setError(err.message);
      alert(`Error previewing PDF: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsLoading(true);
    setError(null);
    const formData = { NAME: name, EMAIL: email, PHONE: phone /* Add all other form data here */ };
    console.log('Download PDF clicked. Data:', formData);

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      if (blob.type !== 'application/pdf') throw new Error('Received file is not a PDF.');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
      alert(`Error downloading PDF: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Resume Builder</h1>
      </header>
      <main style={{ padding: '20px' }}>
        <PersonalInfoForm
          name={name} onNameChange={handleNameChange} onNameBlur={handleNameBlur} nameError={nameError}
          email={email} onEmailChange={handleEmailChange} onEmailBlur={handleEmailBlur} emailError={emailError}
          phone={phone} onPhoneChange={setPhoneState} /* Add onPhoneBlur if specific phone validation is added */
          linkedin={linkedin} onLinkedinChange={handleLinkedinChange} onLinkedinBlur={handleLinkedinBlur} linkedInUrlError={linkedInUrlError}
          github={github} onGithubChange={handleGithubChange} onGithubBlur={handleGithubBlur} githubUrlError={githubUrlError}
        />
        <hr />
        <CareerObjectiveForm
          objective={objective}
          onObjectiveChange={handleObjectiveChange}
          onObjectiveBlur={handleObjectiveBlur}
          objectiveError={careerObjectiveError}
          maxLength={MAX_OBJECTIVE_LENGTH}
        />
        <hr />
        <EducationForm
          entries={educationEntries}
          onAddEntry={handleAddEducation}
          onRemoveEntry={handleRemoveEducation}
          onUpdateEntry={handleUpdateEducation}
          errors={educationErrors}
          onBlurField={handleEducationFieldBlur}
        />
        <hr />
        <TechnicalSkillsForm
          programmingLanguages={programmingLanguages}
          onProgrammingLanguagesChange={handleProgrammingLanguagesChange}
          onProgrammingLanguagesBlur={handleProgrammingLanguagesBlur}
          programmingLanguagesError={programmingLanguagesError}
          frameworks={frameworks} onFrameworksChange={setFrameworks}
          databases={databases} onDatabasesChange={setDatabases}
        />
        <hr />
        <AcademicProjectsForm
          entries={projectEntries}
          onAddEntry={handleAddProject}
          onRemoveEntry={handleRemoveProject}
          onUpdateEntry={handleUpdateProject}
          errors={projectErrors}
          onBlurField={handleProjectFieldBlur}
        />
        <hr />
        <ProfessionalExperienceForm
          entries={experienceEntries}
          onAddEntry={handleAddExperience}
          onRemoveEntry={handleRemoveExperience}
          onUpdateEntry={handleUpdateExperience}
          errors={experienceErrors}
          onBlurField={handleExperienceFieldBlur}
        />
        <hr />
        <CertificationsForm
          entries={certificationEntries}
          onAddEntry={handleAddCertification}
          onRemoveEntry={handleRemoveCertification}
          onUpdateEntry={handleUpdateCertification}
          errors={certificationErrors}
          onBlurField={handleCertificationFieldBlur}
        />
        <hr />
        <AchievementsForm
          entries={achievementEntries}
          onAddEntry={handleAddAchievement}
          onRemoveEntry={handleRemoveAchievement}
          onUpdateEntry={handleUpdateAchievement}
          errors={achievementErrors}
          onBlurField={handleAchievementFieldBlur}
        />
        <hr />
        <ExtracurricularActivitiesForm
          entries={activityEntries}
          onAddEntry={handleAddActivity}
          onRemoveEntry={handleRemoveActivity}
          onUpdateEntry={handleUpdateActivity}
          errors={activityErrors}
          onBlurField={handleActivityFieldBlur}
        />
        <hr />

        <div style={{ marginTop: '20px', marginBottom: '10px', padding: '10px', border: '1px dashed #ccc'}}>
          <h4>Local Storage Controls (for testing)</h4>
          <button onClick={manualSave} style={{ marginRight: '10px' }}>Save Manually</button>
          <button onClick={manualLoad} style={{ marginRight: '10px' }}>Load Manually</button>
          <button onClick={manualClear}>Clear & Reset Form</button>
        </div>
        <hr />

        <div style={{ marginTop: '30px', marginBottom: '20px', borderTop: '2px solid #282c34', paddingTop: '20px' }}>
          <button onClick={handlePreviewPdf} disabled={isLoading} style={{ marginRight: '10px' }}>
            {isLoading ? 'Loading...' : 'Preview PDF'}
          </button>
          <button onClick={handleDownloadPdf} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Download PDF'}
          </button>
        </div>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
        {previewUrl && (
          <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <h3>PDF Preview:</h3>
            <iframe
              src={previewUrl}
              title="PDF Preview"
              width="100%"
              height="700px"
              style={{ border: '1px solid #ddd' }}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

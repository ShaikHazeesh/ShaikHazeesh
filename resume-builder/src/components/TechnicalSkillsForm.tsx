import React from 'react';

interface TechnicalSkillsFormProps {
  programmingLanguages: string;
  frameworks: string;
  databases: string;
  programmingLanguagesError?: string;
  onProgrammingLanguagesChange: (value: string) => void;
  onProgrammingLanguagesBlur?: () => void;
  onFrameworksChange: (value: string) => void;
  // onFrameworksBlur, frameworkError etc. could be added
  onDatabasesChange: (value: string) => void;
  // onDatabasesBlur, databaseError etc. could be added
}

const TechnicalSkillsForm: React.FC<TechnicalSkillsFormProps> = ({
  programmingLanguages,
  frameworks,
  databases,
  programmingLanguagesError,
  onProgrammingLanguagesChange,
  onProgrammingLanguagesBlur,
  onFrameworksChange,
  onDatabasesChange,
}) => {
  return (
    <form>
      <h3>Technical Skills</h3>
      <div>
        <label htmlFor="programmingLanguages">Programming Languages (comma-separated): <span className="required-indicator">*</span></label>
        <input
          type="text"
          id="programmingLanguages"
          value={programmingLanguages}
          onChange={(e) => onProgrammingLanguagesChange(e.target.value)}
          onBlur={onProgrammingLanguagesBlur}
          required
        />
        {programmingLanguagesError && <div className="error-message">{programmingLanguagesError}</div>}
      </div>
      <div>
        <label htmlFor="frameworks">Frameworks/Libraries (comma-separated): <span className="required-indicator">*</span></label>
        <input
          type="text"
          id="frameworks"
          value={frameworks}
          onChange={(e) => onFrameworksChange(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="databases">Databases (comma-separated): <span className="required-indicator">*</span></label>
        <input
          type="text"
          id="databases"
          value={databases}
          onChange={(e) => onDatabasesChange(e.target.value)}
          required
        />
      </div>
    </form>
  );
};

export default TechnicalSkillsForm;

import React from 'react';

export interface ProjectEntry {
  title: string;
  description: string;
  techStack: string;
  githubLink: string;
}

interface AcademicProjectsFormProps {
  entries: ProjectEntry[];
  onUpdateEntry: (index: number, entry: ProjectEntry) => void;
  onAddEntry: () => void;
  onRemoveEntry: (index: number) => void;
  errors?: Array<Partial<Record<keyof ProjectEntry, string>>>;
  onBlurField?: (index: number, fieldName: keyof ProjectEntry, value: string) => void;
}

const AcademicProjectsForm: React.FC<AcademicProjectsFormProps> = ({
  entries,
  onUpdateEntry,
  onAddEntry,
  onRemoveEntry,
  errors = [],
  onBlurField,
}) => {
  const handleChange = (index: number, field: keyof ProjectEntry, value: string) => {
    const updatedEntry = { ...entries[index], [field]: value };
    onUpdateEntry(index, updatedEntry);
  };

  return (
    <div>
      <h3>Academic Projects</h3>
      {entries.map((entry, index) => (
        <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee' }}>
          <h4>Project #{index + 1}</h4>
          <div>
            <label htmlFor={`projectTitle-${index}`}>Project Title: <span className="required-indicator">*</span></label>
            <input
              type="text"
              id={`projectTitle-${index}`}
              value={entry.title}
              onChange={(e) => handleChange(index, 'title', e.target.value)}
              onBlur={(e) => onBlurField?.(index, 'title', e.target.value)}
              required
            />
            {errors[index]?.title && <div className="error-message">{errors[index]?.title}</div>}
          </div>
          <div>
            <label htmlFor={`projectDescription-${index}`}>Description: <span className="required-indicator">*</span></label>
            <textarea
              id={`projectDescription-${index}`}
              value={entry.description}
              onChange={(e) => {
                handleChange(index, 'description', e.target.value);
                // Also call onBlur logic here if we want to clear "required" error as user types,
                // or rely on App.tsx's handleUpdateProject to do it.
                // For simplicity, main validation on blur.
              }}
              onBlur={(e) => onBlurField?.(index, 'description', e.target.value)}
              rows={3}
              required
              maxLength={1000}
            />
            <div className="char-counter">
              {entry.description.length}/1000
            </div>
            {errors[index]?.description && <div className="error-message">{errors[index]?.description}</div>}
          </div>
          <div>
            <label htmlFor={`projectTechStack-${index}`}>Tech Stack (comma-separated): <span className="required-indicator">*</span></label>
            <input
              type="text"
              id={`projectTechStack-${index}`}
              value={entry.techStack}
              onChange={(e) => handleChange(index, 'techStack', e.target.value)}
              onBlur={(e) => onBlurField?.(index, 'techStack', e.target.value)}
              required
            />
            {errors[index]?.techStack && <div className="error-message">{errors[index]?.techStack}</div>}
          </div>
          <div>
            <label htmlFor={`projectGithubLink-${index}`}>GitHub Link:</label>
            <input
              type="url"
              id={`projectGithubLink-${index}`}
              value={entry.githubLink}
              onChange={(e) => handleChange(index, 'githubLink', e.target.value)}
              onBlur={(e) => onBlurField?.(index, 'githubLink', e.target.value)}
            />
            {errors[index]?.githubLink && <div className="error-message">{errors[index]?.githubLink}</div>}
          </div>
          <button type="button" onClick={() => onRemoveEntry(index)} style={{ marginTop: '5px' }}>
            Remove Project #{index + 1}
          </button>
        </div>
      ))}
      <button type="button" onClick={onAddEntry} style={{ marginTop: '10px' }}>
        Add Project
      </button>
    </div>
  );
};

export default AcademicProjectsForm;

import React from 'react';

export interface ExperienceEntry {
  companyName: string;
  role: string;
  duration: string;
  responsibilities: string;
}

interface ProfessionalExperienceFormProps {
  entries: ExperienceEntry[];
  onUpdateEntry: (index: number, entry: ExperienceEntry) => void;
  onAddEntry: () => void;
  onRemoveEntry: (index: number) => void;
  errors?: Array<Partial<Record<keyof ExperienceEntry, string>>>;
  onBlurField?: (index: number, fieldName: keyof ExperienceEntry, value: string) => void;
}

const ProfessionalExperienceForm: React.FC<ProfessionalExperienceFormProps> = ({
  entries,
  onUpdateEntry,
  onAddEntry,
  onRemoveEntry,
  errors = [],
  onBlurField,
}) => {
  const handleChange = (index: number, field: keyof ExperienceEntry, value: string) => {
    const updatedEntry = { ...entries[index], [field]: value };
    onUpdateEntry(index, updatedEntry);
  };

  return (
    <div>
      <h3>Professional Experience</h3>
      {entries.map((entry, index) => (
        <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee' }}>
          <h4>Experience #{index + 1}</h4>
          <div>
            <label htmlFor={`companyName-${index}`}>Company Name: <span className="required-indicator">*</span></label>
            <input
              type="text"
              id={`companyName-${index}`}
              value={entry.companyName}
              onChange={(e) => handleChange(index, 'companyName', e.target.value)}
              onBlur={(e) => onBlurField?.(index, 'companyName', e.target.value)}
              required
            />
            {errors[index]?.companyName && <div className="error-message">{errors[index]?.companyName}</div>}
          </div>
          <div>
            <label htmlFor={`role-${index}`}>Role: <span className="required-indicator">*</span></label>
            <input
              type="text"
              id={`role-${index}`}
              value={entry.role}
              onChange={(e) => handleChange(index, 'role', e.target.value)}
              onBlur={(e) => onBlurField?.(index, 'role', e.target.value)}
              required
            />
            {errors[index]?.role && <div className="error-message">{errors[index]?.role}</div>}
          </div>
          <div>
            <label htmlFor={`duration-${index}`}>Duration (e.g., Jan 2020 - Present): <span className="required-indicator">*</span></label>
            <input
              type="text"
              id={`duration-${index}`}
              value={entry.duration}
              onChange={(e) => handleChange(index, 'duration', e.target.value)}
              onBlur={(e) => onBlurField?.(index, 'duration', e.target.value)}
              required
            />
            {errors[index]?.duration && <div className="error-message">{errors[index]?.duration}</div>}
          </div>
          <div>
            <label htmlFor={`responsibilities-${index}`}>Responsibilities: <span className="required-indicator">*</span></label>
            <textarea
              id={`responsibilities-${index}`}
              value={entry.responsibilities}
              onChange={(e) => {
                handleChange(index, 'responsibilities', e.target.value);
                // Add similar logic to AcademicProjectsForm for clearing error on type if desired
              }}
              onBlur={(e) => onBlurField?.(index, 'responsibilities', e.target.value)}
              rows={4}
              required
              maxLength={1500}
            />
            <div className="char-counter">
              {entry.responsibilities.length}/1500
            </div>
            {errors[index]?.responsibilities && <div className="error-message">{errors[index]?.responsibilities}</div>}
          </div>
          <button type="button" onClick={() => onRemoveEntry(index)} style={{ marginTop: '5px' }}>
            Remove Experience #{index + 1}
          </button>
        </div>
      ))}
      <button type="button" onClick={onAddEntry} style={{ marginTop: '10px' }}>
        Add Experience
      </button>
    </div>
  );
};

export default ProfessionalExperienceForm;

import React from 'react';

export interface EducationEntry {
  degree: string;
  institution: string;
  cgpa: string;
  year: string;
}

interface EducationFormProps {
  entries: EducationEntry[];
  onUpdateEntry: (index: number, entry: EducationEntry) => void;
  onAddEntry: () => void;
  onRemoveEntry: (index: number) => void;
  errors?: Array<Partial<Record<keyof EducationEntry, string>>>;
  onBlurField?: (index: number, fieldName: keyof EducationEntry, value: string) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({
  entries,
  onUpdateEntry,
  onAddEntry,
  onRemoveEntry,
  errors = [], // Default to empty array if errors prop is not provided
  onBlurField,
}) => {
  const handleChange = (index: number, field: keyof EducationEntry, value: string) => {
    const updatedEntry = { ...entries[index], [field]: value };
    onUpdateEntry(index, updatedEntry);
  };

  return (
    <div>
      <h3>Education</h3>
      {entries.map((entry, index) => (
        <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee' }}>
          <h4>Entry #{index + 1}</h4>
          <div>
            <label htmlFor={`degree-${index}`}>Degree: <span className="required-indicator">*</span></label>
            <input
              type="text"
              id={`degree-${index}`}
              value={entry.degree}
              onChange={(e) => handleChange(index, 'degree', e.target.value)}
              onBlur={(e) => onBlurField?.(index, 'degree', e.target.value)}
              required
            />
            {errors[index]?.degree && <div className="error-message">{errors[index]?.degree}</div>}
          </div>
          <div>
            <label htmlFor={`institution-${index}`}>Institution: <span className="required-indicator">*</span></label>
            <input
              type="text"
              id={`institution-${index}`}
              value={entry.institution}
              onChange={(e) => handleChange(index, 'institution', e.target.value)}
              onBlur={(e) => onBlurField?.(index, 'institution', e.target.value)}
              required
            />
            {errors[index]?.institution && <div className="error-message">{errors[index]?.institution}</div>}
          </div>
          <div>
            <label htmlFor={`cgpa-${index}`}>CGPA/Percentage:</label>
            <input
              type="text"
              id={`cgpa-${index}`}
              value={entry.cgpa}
              onChange={(e) => handleChange(index, 'cgpa', e.target.value)}
              // onBlur={(e) => onBlurField?.(index, 'cgpa', e.target.value)} // CGPA is optional for now
            />
            {/* {errors[index]?.cgpa && <div className="error-message">{errors[index]?.cgpa}</div>} */}
          </div>
          <div>
            <label htmlFor={`year-${index}`}>Year of Completion: <span className="required-indicator">*</span></label>
            <input
              type="text"
              id={`year-${index}`}
              value={entry.year}
              onChange={(e) => handleChange(index, 'year', e.target.value)}
              onBlur={(e) => onBlurField?.(index, 'year', e.target.value)}
              required
            />
            {errors[index]?.year && <div className="error-message">{errors[index]?.year}</div>}
          </div>
          <button type="button" onClick={() => onRemoveEntry(index)} style={{ marginTop: '5px' }}>
            Remove Entry #{index + 1}
          </button>
        </div>
      ))}
      <button type="button" onClick={onAddEntry} style={{ marginTop: '10px' }}>
        Add Education
      </button>
    </div>
  );
};

export default EducationForm;

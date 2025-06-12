import React from 'react';

export interface ActivityEntry {
  description: string;
  role: string;
}

interface ExtracurricularActivitiesFormProps {
  entries: ActivityEntry[];
  onUpdateEntry: (index: number, entry: ActivityEntry) => void;
  onAddEntry: () => void;
  onRemoveEntry: (index: number) => void;
  errors?: Array<Partial<Record<keyof ActivityEntry, string>>>;
  onBlurField?: (index: number, fieldName: keyof ActivityEntry, value: string) => void;
}

const ExtracurricularActivitiesForm: React.FC<ExtracurricularActivitiesFormProps> = ({
  entries,
  onUpdateEntry,
  onAddEntry,
  onRemoveEntry,
  errors = [],
  onBlurField,
}) => {
  const handleChange = (index: number, field: keyof ActivityEntry, value: string) => {
    const updatedEntry = { ...entries[index], [field]: value };
    onUpdateEntry(index, updatedEntry);
  };

  return (
    <div>
      <h3>Extracurricular Activities</h3>
      {entries.map((entry, index) => (
        <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee' }}>
          <h4>Activity #{index + 1}</h4>
          <div>
            <label htmlFor={`activityDescription-${index}`}>Activity/Organization: <span style={{ color: 'red' }}>*</span></label>
            <input
              type="text"
              id={`activityDescription-${index}`}
              value={entry.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              onBlur={(e) => onBlurField?.(index, 'description', e.target.value)}
              required
            />
            {errors[index]?.description && <div className="error-message">{errors[index]?.description}</div>}
          </div>
          <div>
            <label htmlFor={`activityRole-${index}`}>Role/Position: <span className="required-indicator">*</span></label>
            <input
              type="text"
              id={`activityRole-${index}`}
              value={entry.role}
              onChange={(e) => handleChange(index, 'role', e.target.value)}
              onBlur={(e) => onBlurField?.(index, 'role', e.target.value)}
              required
            />
            {errors[index]?.role && <div className="error-message">{errors[index]?.role}</div>}
          </div>
          <button type="button" onClick={() => onRemoveEntry(index)} style={{ marginTop: '5px' }}>
            Remove Activity #{index + 1}
          </button>
        </div>
      ))}
      <button type="button" onClick={onAddEntry} style={{ marginTop: '10px' }}>
        Add Activity
      </button>
    </div>
  );
};

export default ExtracurricularActivitiesForm;

import React from 'react';

export interface CertificationEntry {
  name: string;
  organization: string;
  year: string;
}

interface CertificationsFormProps {
  entries: CertificationEntry[];
  onUpdateEntry: (index: number, entry: CertificationEntry) => void;
  onAddEntry: () => void;
  onRemoveEntry: (index: number) => void;
  errors?: Array<Partial<Record<keyof CertificationEntry, string>>>;
  onBlurField?: (index: number, fieldName: keyof CertificationEntry, value: string) => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({
  entries,
  onUpdateEntry,
  onAddEntry,
  onRemoveEntry,
  errors = [],
  onBlurField,
}) => {
  const handleChange = (index: number, field: keyof CertificationEntry, value: string) => {
    const updatedEntry = { ...entries[index], [field]: value };
    onUpdateEntry(index, updatedEntry);
  };

  return (
    <div>
      <h3>Certifications</h3>
      {entries.map((entry, index) => (
        <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee' }}>
          <h4>Certification #{index + 1}</h4>
          <div>
            <label htmlFor={`certName-${index}`}>Certificate Name: <span className="required-indicator">*</span></label>
            <input
              type="text"
              id={`certName-${index}`}
              value={entry.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              onBlur={(e) => onBlurField?.(index, 'name', e.target.value)}
              required
            />
            {errors[index]?.name && <div className="error-message">{errors[index]?.name}</div>}
          </div>
          <div>
            <label htmlFor={`certOrg-${index}`}>Issuing Organization: <span className="required-indicator">*</span></label>
            <input
              type="text"
              id={`certOrg-${index}`}
              value={entry.organization}
              onChange={(e) => handleChange(index, 'organization', e.target.value)}
              onBlur={(e) => onBlurField?.(index, 'organization', e.target.value)}
              required
            />
            {errors[index]?.organization && <div className="error-message">{errors[index]?.organization}</div>}
          </div>
          <div>
            <label htmlFor={`certYear-${index}`}>Year: <span className="required-indicator">*</span></label>
            <input
              type="text"
              id={`certYear-${index}`}
              value={entry.year}
              onChange={(e) => handleChange(index, 'year', e.target.value)}
              onBlur={(e) => onBlurField?.(index, 'year', e.target.value)}
              required
            />
            {errors[index]?.year && <div className="error-message">{errors[index]?.year}</div>}
          </div>
          <button type="button" onClick={() => onRemoveEntry(index)} style={{ marginTop: '5px' }}>
            Remove Certification #{index + 1}
          </button>
        </div>
      ))}
      <button type="button" onClick={onAddEntry} style={{ marginTop: '10px' }}>
        Add Certification
      </button>
    </div>
  );
};

export default CertificationsForm;

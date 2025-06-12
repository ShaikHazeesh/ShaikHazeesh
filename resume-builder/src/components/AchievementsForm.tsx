import React from 'react';

export interface AchievementEntry {
  description: string;
}

interface AchievementsFormProps {
  entries: AchievementEntry[];
  onUpdateEntry: (index: number, entry: AchievementEntry) => void;
  onAddEntry: () => void;
  onRemoveEntry: (index: number) => void;
  errors?: Array<Partial<Record<keyof AchievementEntry, string>>>;
  onBlurField?: (index: number, fieldName: keyof AchievementEntry, value: string) => void;
}

const AchievementsForm: React.FC<AchievementsFormProps> = ({
  entries,
  onUpdateEntry,
  onAddEntry,
  onRemoveEntry,
  errors = [],
  onBlurField,
}) => {
  const handleChange = (index: number, field: keyof AchievementEntry, value: string) => {
    const updatedEntry = { ...entries[index], [field]: value };
    onUpdateEntry(index, updatedEntry);
  };

  return (
    <div>
      <h3>Achievements/Awards</h3>
      {entries.map((entry, index) => (
        <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee' }}>
          <h4>Achievement #{index + 1}</h4>
          <div>
            <label htmlFor={`achievementDescription-${index}`}>Description: <span className="required-indicator">*</span></label>
            <textarea
              id={`achievementDescription-${index}`}
              value={entry.description}
              onChange={(e) => {
                handleChange(index, 'description', e.target.value);
                // Logic to clear "required" error on type can be added here or in App.tsx's update handler
              }}
              onBlur={(e) => onBlurField?.(index, 'description', e.target.value)}
              rows={3}
              required
              maxLength={500}
            />
            <div className="char-counter">
              {entry.description.length}/500
            </div>
            {errors[index]?.description && <div className="error-message">{errors[index]?.description}</div>}
          </div>
          <button type="button" onClick={() => onRemoveEntry(index)} style={{ marginTop: '5px' }}>
            Remove Achievement #{index + 1}
          </button>
        </div>
      ))}
      <button type="button" onClick={onAddEntry} style={{ marginTop: '10px' }}>
        Add Achievement
      </button>
    </div>
  );
};

export default AchievementsForm;

import React from 'react';

interface CareerObjectiveFormProps {
  objective: string;
  onObjectiveChange: (value: string) => void;
  onObjectiveBlur?: () => void;
  objectiveError?: string;
  maxLength: number;
}

const CareerObjectiveForm: React.FC<CareerObjectiveFormProps> = ({
  objective,
  onObjectiveChange,
  onObjectiveBlur,
  objectiveError,
  maxLength,
}) => {
  return (
    <form>
      <h3>Career Objective</h3>
      <div>
        <label htmlFor="careerObjective">Career Objective: <span className="required-indicator">*</span></label>
        <textarea
          id="careerObjective"
          value={objective}
          onChange={(e) => onObjectiveChange(e.target.value)}
          onBlur={onObjectiveBlur}
          rows={4}
          required
          maxLength={maxLength}
        />
        <div className="char-counter">
          {objective.length}/{maxLength}
        </div>
        {objectiveError && <div className="error-message">{objectiveError}</div>}
      </div>
    </form>
  );
};

export default CareerObjectiveForm;

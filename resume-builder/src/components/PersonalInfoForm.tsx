import React from 'react';

interface PersonalInfoFormProps {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  nameError?: string;
  emailError?: string;
  // phoneError?: string; // If phone validation is added
  linkedInUrlError?: string;
  githubUrlError?: string;
  onNameChange: (value: string) => void;
  onNameBlur?: () => void;
  onEmailChange: (value: string) => void;
  onEmailBlur?: () => void;
  onPhoneChange: (value: string) => void;
  // onPhoneBlur?: () => void;
  onLinkedinChange: (value: string) => void;
  onLinkedinBlur?: () => void;
  onGithubChange: (value: string) => void;
  onGithubBlur?: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  name,
  email,
  phone,
  linkedin,
  github,
  nameError,
  emailError,
  // phoneError,
  linkedInUrlError,
  githubUrlError,
  onNameChange,
  onNameBlur,
  onEmailChange,
  onEmailBlur,
  onPhoneChange,
  // onPhoneBlur,
  onLinkedinChange,
  onLinkedinBlur,
  onGithubChange,
  onGithubBlur,
}) => {
  return (
    <form>
      <h3>Personal Information</h3>
      <div>
        <label htmlFor="name">Name: <span className="required-indicator">*</span></label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={onNameBlur}
          required
        />
        {nameError && <div className="error-message">{nameError}</div>}
      </div>
      <div>
        <label htmlFor="email">Email: <span className="required-indicator">*</span></label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onBlur={onEmailBlur}
          required
        />
        {emailError && <div className="error-message">{emailError}</div>}
      </div>
      <div>
        <label htmlFor="phone">Phone: <span className="required-indicator">*</span></label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          // onBlur={onPhoneBlur} // Add if phone validation/blur handler is implemented
          required
        />
        {/* {phoneError && <div className="error-message">{phoneError}</div>} */}
      </div>
      <div>
        <label htmlFor="linkedin">LinkedIn URL:</label>
        <input
          type="url"
          id="linkedin"
          value={linkedin}
          onChange={(e) => onLinkedinChange(e.target.value)}
          onBlur={onLinkedinBlur}
        />
        {linkedInUrlError && <div className="error-message">{linkedInUrlError}</div>}
      </div>
      <div>
        <label htmlFor="github">GitHub URL:</label>
        <input
          type="url"
          id="github"
          value={github}
          onChange={(e) => onGithubChange(e.target.value)}
          onBlur={onGithubBlur}
        />
        {githubUrlError && <div className="error-message">{githubUrlError}</div>}
      </div>
    </form>
  );
};

export default PersonalInfoForm;

import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Extract configuration from the rows (simple row-based approach)
  let title = 'Get a gold loan at low interest rates'; // Default
  let actionUrl = '';
  let ctaButtonText = 'Apply Now'; // Default
  let showNameField = true;
  let showMobileField = true;
  let showPincodeField = true;
  let showIndianResidentField = false;
  let showEmploymentTypeField = false;

  // Parse configuration from block rows
  // Expected format: Label | Value pairs
  rows.forEach(row => {
    if (row.children.length >= 2) {
      const label = row.children[0].textContent.trim().toLowerCase();
      const value = row.children[1].textContent.trim();
      
      switch (label) {
        case 'title':
        case 'form title':
          if (value) title = value;
          break;
        case 'actionurl':
        case 'form action url':
          if (value) actionUrl = value;
          break;
        case 'ctabuttontext':
        case 'cta button text':
          if (value) ctaButtonText = value;
          break;
        case 'shownamefield':
        case 'show name field':
          showNameField = value.toLowerCase() === 'true';
          break;
        case 'showmobilefield':
        case 'show mobile number field':
          showMobileField = value.toLowerCase() === 'true';
          break;
        case 'showpincodefield':
        case 'show pincode field':
          showPincodeField = value.toLowerCase() === 'true';
          break;
        case 'showindianresidentfield':
        case 'show indian resident field':
          showIndianResidentField = value.toLowerCase() === 'true';
          break;
        case 'showemploymenttypefield':
        case 'show employment type field':
          showEmploymentTypeField = value.toLowerCase() === 'true';
          break;
      }
    }
  });

  // Create the main form container
  const formContainer = document.createElement('div');
  formContainer.className = 'lead-form-container';

  // Create form content wrapper
  const formContent = document.createElement('div');
  formContent.className = 'form-content';

  // Create form section
  const formSection = document.createElement('div');
  formSection.className = 'form-section';

  // Create title
  const titleElement = document.createElement('h2');
  titleElement.className = 'form-title';
  titleElement.textContent = title;
  formSection.appendChild(titleElement);

  // Create form
  const form = document.createElement('form');
  form.className = 'lead-form-form';
  form.method = 'POST';
  if (actionUrl) {
    form.action = actionUrl;
  }

  // Create form fields container
  const formFields = document.createElement('div');
  formFields.className = 'form-fields';

  // Define all possible form fields with their configurations
  const fieldConfigurations = {
    name: {
      name: 'name', 
      placeholder: 'Name*', 
      type: 'text', 
      required: true,
      show: showNameField
    },
    mobile: {
      name: 'mobile', 
      placeholder: 'Mobile Number*', 
      type: 'tel', 
      required: true,
      show: showMobileField
    },
    pincode: {
      name: 'pincode', 
      placeholder: 'Pincode*', 
      type: 'text', 
      required: true,
      show: showPincodeField
    },
    indianResident: {
      name: 'indianResident',
      label: 'Are you an Indian Resident*',
      type: 'select',
      required: true,
      show: showIndianResidentField,
      options: [
        { value: '', text: 'Are you an Indian Resident*' },
        { value: 'yes', text: 'Yes' },
        { value: 'no', text: 'No' }
      ]
    },
    employmentType: {
      name: 'employmentType',
      label: 'Employment Type*',
      type: 'select',
      required: true,
      show: showEmploymentTypeField,
      options: [
        { value: '', text: 'Employment Type*' },
        { value: 'self-employed-business', text: 'Self Employed Business' },
        { value: 'doctor', text: 'Doctor' },
        { value: 'chartered-accountant', text: 'Chartered Accountant' },
        { value: 'architect', text: 'Architect' },
        { value: 'engineer', text: 'Engineer' }
      ]
    }
  };

  // Create form fields based on configuration
  Object.keys(fieldConfigurations).forEach((fieldKey) => {
    const fieldConfig = fieldConfigurations[fieldKey];
    if (!fieldConfig.show) return;

    // Create form field wrapper
    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'form-field-wrapper';

    if (fieldConfig.type === 'select') {
      // Create select element with placeholder as first option
      const select = document.createElement('select');
      select.name = fieldConfig.name;
      select.id = fieldConfig.name;
      select.required = fieldConfig.required;
      select.className = 'form-select';

      // Add placeholder as first disabled option
      const placeholderOption = document.createElement('option');
      placeholderOption.value = '';
      placeholderOption.textContent = fieldConfig.label;
      placeholderOption.disabled = true;
      placeholderOption.selected = true;
      select.appendChild(placeholderOption);

      // Add actual options (skip first placeholder option)
      fieldConfig.options.slice(1).forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        select.appendChild(optionElement);
      });

      fieldWrapper.appendChild(select);
    } else {
      // Create input element for text/tel fields
      const input = document.createElement('input');
      input.type = fieldConfig.type;
      input.name = fieldConfig.name;
      input.placeholder = fieldConfig.placeholder;
      input.required = fieldConfig.required;
      input.className = 'form-input';

      fieldWrapper.appendChild(input);
    }

    formFields.appendChild(fieldWrapper);
  });

  // Create submit button
  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'form-button';
  button.textContent = ctaButtonText;

  // Add fields and button to form
  form.appendChild(formFields);
  form.appendChild(button);

  // Build the structure
  formSection.appendChild(form);
  formContent.appendChild(formSection);
  formContainer.appendChild(formContent);

  // Move instrumentation from original block
  moveInstrumentation(block, formContainer);

  // Replace block content
  block.textContent = '';
  block.appendChild(formContainer);
}
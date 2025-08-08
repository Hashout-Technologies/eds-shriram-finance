import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Extract configuration from the rows
  let title = 'Get a gold loan at low interest rates'; // Default
  let actionUrl = '';
  let ctaButtonText = 'Apply Now'; // Default
  let selectedFields = ['name', 'mobile', 'pincode']; // Default fields

  // Parse the configuration from block rows
  // Row 1: Title
  if (rows[0] && rows[0].children[0]) {
    const titleContent = rows[0].children[0].textContent.trim();
    if (titleContent) {
      title = titleContent;
    }
  }

  // Row 2: Action URL
  if (rows[1] && rows[1].children[0]) {
    const urlContent = rows[1].children[0].textContent.trim();
    if (urlContent) {
      actionUrl = urlContent;
    }
  }

  // Row 3: CTA Button Text
  if (rows[2] && rows[2].children[0]) {
    const ctaContent = rows[2].children[0].textContent.trim();
    if (ctaContent) {
      ctaButtonText = ctaContent;
    }
  }

  // Row 4: Selected Fields (comma-separated)
  if (rows[3] && rows[3].children[0]) {
    const fieldsContent = rows[3].children[0].textContent.trim();
    if (fieldsContent) {
      selectedFields = fieldsContent.split(',').map(field => field.trim());
    }
  }

  // Create the main form container (matching Figma structure)
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
    },
    mobile: {
      name: 'mobile', 
      placeholder: 'Mobile Number*', 
      type: 'tel', 
      required: true,
    },
    pincode: {
      name: 'pincode', 
      placeholder: 'Pincode*', 
      type: 'text', 
      required: true,
    },
    indianResident: {
      name: 'indianResident',
      label: 'Are you an Indian Resident*',
      type: 'select',
      required: true,
      options: [
        { value: '', text: 'Select an option' },
        { value: 'yes', text: 'Yes' },
        { value: 'no', text: 'No' }
      ]
    },
    employmentType: {
      name: 'employmentType',
      label: 'Employment Type*',
      type: 'select',
      required: true,
      options: [
        { value: '', text: 'Select employment type' },
        { value: 'self-employed-business', text: 'Self Employed Business' },
        { value: 'doctor', text: 'Doctor' },
        { value: 'chartered-accountant', text: 'Chartered Accountant' },
        { value: 'architect', text: 'Architect' },
        { value: 'engineer', text: 'Engineer' }
      ]
    }
  };

  // Create form fields based on selection
  selectedFields.forEach((fieldKey) => {
    const fieldConfig = fieldConfigurations[fieldKey];
    if (!fieldConfig) return;

    // Create form field wrapper
    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'form-field-wrapper';

    if (fieldConfig.type === 'select') {
      // Create label for select fields
      const label = document.createElement('label');
      label.className = 'form-label';
      label.textContent = fieldConfig.label;
      label.setAttribute('for', fieldConfig.name);
      fieldWrapper.appendChild(label);

      // Create select element
      const select = document.createElement('select');
      select.name = fieldConfig.name;
      select.id = fieldConfig.name;
      select.required = fieldConfig.required;
      select.className = 'form-select';

      // Add options
      fieldConfig.options.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        if (option.value === '') {
          optionElement.disabled = true;
          optionElement.selected = true;
        }
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
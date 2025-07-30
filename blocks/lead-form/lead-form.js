import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Extract title and action URL from the rows
  let title = 'Get a gold loan at low interest rates'; // Default
  let actionUrl = '';

  // First row should contain title
  if (rows[0] && rows[0].children[0]) {
    const titleContent = rows[0].children[0].textContent.trim();
    if (titleContent) {
      title = titleContent;
    }
  }

  // Second row should contain action URL
  if (rows[1] && rows[1].children[0]) {
    const urlContent = rows[1].children[0].textContent.trim();
    if (urlContent) {
      actionUrl = urlContent;
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

  // Create form fields
  const fields = [
    {
      name: 'name', placeholder: 'Name*', type: 'text', required: true,
    },
    {
      name: 'mobile', placeholder: 'Mobile Number*', type: 'tel', required: true,
    },
    {
      name: 'pincode', placeholder: 'Pincode*', type: 'text', required: true,
    },
  ];

  fields.forEach((field) => {
    // Create form field wrapper (matching Figma structure)
    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'form-field-wrapper';

    // Create actual input element
    const input = document.createElement('input');
    input.type = field.type;
    input.name = field.name;
    input.placeholder = field.placeholder;
    input.required = field.required;
    input.className = 'form-input';

    fieldWrapper.appendChild(input);
    formFields.appendChild(fieldWrapper);
  });

  // Create submit button (keeping it as a functional button)
  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'form-button';
  button.textContent = 'Apply Now';

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

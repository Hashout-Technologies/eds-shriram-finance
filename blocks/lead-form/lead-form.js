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

  // Create the form container
  const formContainer = document.createElement('div');
  formContainer.className = 'lead-form-container';

  // Create title
  const titleElement = document.createElement('h2');
  titleElement.className = 'form-title';
  titleElement.textContent = title;
  formContainer.appendChild(titleElement);

  // Create form
  const form = document.createElement('form');
  form.className = 'lead-form-form';
  form.method = 'POST';
  if (actionUrl) {
    form.action = actionUrl;
  }

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
    const input = document.createElement('input');
    input.type = field.type;
    input.name = field.name;
    input.placeholder = field.placeholder;
    input.required = field.required;
    input.className = 'form-input';
    form.appendChild(input);
  });

  // Create submit button
  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'form-button';
  button.textContent = 'Apply Now';
  form.appendChild(button);

  formContainer.appendChild(form);

  // Move instrumentation from original block
  moveInstrumentation(block, formContainer);

  // Replace block content
  block.textContent = '';
  block.appendChild(formContainer);
}

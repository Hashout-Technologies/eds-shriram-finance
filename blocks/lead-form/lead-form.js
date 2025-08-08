import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Transform first row p to title
  if (rows[0] && rows[0].querySelector('p')) {
    rows[0].querySelector('p').className = 'form-title';
  }

  // Read boolean configs from DOM
  let showIndianResident = false;
  let showEmploymentType = false;

  if (rows[6] && rows[6].querySelector('p')) {
    showIndianResident = rows[6].querySelector('p').textContent.trim() === 'true';
    rows[6].style.display = 'none';
  }

  if (rows[7] && rows[7].querySelector('p')) {
    showEmploymentType = rows[7].querySelector('p').textContent.trim() === 'true';
    rows[7].style.display = 'none';
  }

  // Create basic form structure
  const formContainer = document.createElement('div');
  formContainer.className = 'lead-form-container';

  const formContent = document.createElement('div'); 
  formContent.className = 'form-content';

  const formSection = document.createElement('div');
  formSection.className = 'form-section';

  const form = document.createElement('form');
  form.className = 'lead-form-form';

  const formFields = document.createElement('div');
  formFields.className = 'form-fields';

  // Always add name, mobile, pincode
  const fields = [
    { name: 'name', type: 'text', placeholder: 'Name*' },
    { name: 'mobile', type: 'tel', placeholder: 'Mobile Number*' },
    { name: 'pincode', type: 'text', placeholder: 'Pincode*' }
  ];

  fields.forEach(field => {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-field-wrapper';
    const input = document.createElement('input');
    input.type = field.type;
    input.name = field.name;
    input.placeholder = field.placeholder;
    input.required = true;
    input.className = 'form-input';
    wrapper.appendChild(input);
    formFields.appendChild(wrapper);
  });

  // Add Indian resident if enabled
  if (showIndianResident) {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-field-wrapper';
    const select = document.createElement('select');
    select.name = 'indianResident';
    select.className = 'form-select';
    select.required = true;

    ['Are you an Indian Resident*', 'Yes', 'No'].forEach((text, i) => {
      const option = document.createElement('option');
      option.value = i === 0 ? '' : (i === 1 ? 'yes' : 'no');
      option.textContent = text;
      if (i === 0) {
        option.disabled = true;
        option.selected = true;
      }
      select.appendChild(option);
    });

    wrapper.appendChild(select);
    formFields.appendChild(wrapper);
  }

  // Add employment type if enabled
  if (showEmploymentType) {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-field-wrapper';
    const select = document.createElement('select');
    select.name = 'employmentType';
    select.className = 'form-select';
    select.required = true;

    ['Employment Type*', 'Self Employed Business', 'Doctor', 'Chartered Accountant', 'Architect', 'Engineer'].forEach((text, i) => {
      const option = document.createElement('option');
      option.value = i === 0 ? '' : text.toLowerCase().replace(/\s+/g, '-');
      option.textContent = text;
      if (i === 0) {
        option.disabled = true;
        option.selected = true;
      }
      select.appendChild(option);
    });

    wrapper.appendChild(select);
    formFields.appendChild(wrapper);
  }

  // Add button
  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'form-button';
  button.textContent = 'Apply Now';

  form.appendChild(formFields);
  form.appendChild(button);
  formSection.appendChild(form);
  formContent.appendChild(formSection);
  formContainer.appendChild(formContent);

  block.appendChild(formContainer);
  moveInstrumentation(block, formContainer);
}
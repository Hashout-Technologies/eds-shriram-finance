import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Read configuration from existing DOM structure - don't replace anything
  let title = 'Get a gold loan at low interest rates';
  let actionUrl = '';
  let ctaButtonText = 'Apply Now';
  let showNameField = true;
  let showMobileField = true;
  let showPincodeField = true;
  let showIndianResidentField = false;
  let showEmploymentTypeField = false;

  // Extract values from the existing row structure
  if (rows[0] && rows[0].querySelector('p')) {
    const titleText = rows[0].querySelector('p').textContent.trim();
    if (titleText) title = titleText;
  }

  if (rows[1] && rows[1].querySelector('p')) {
    const urlText = rows[1].querySelector('p').textContent.trim();
    if (urlText) actionUrl = urlText;
  }

  if (rows[2] && rows[2].querySelector('p')) {
    const ctaText = rows[2].querySelector('p').textContent.trim();
    if (ctaText) ctaButtonText = ctaText;
  }

  if (rows[3] && rows[3].querySelector('p')) {
    const nameFieldText = rows[3].querySelector('p').textContent.trim();
    showNameField = nameFieldText.toLowerCase() === 'true';
  }

  if (rows[4] && rows[4].querySelector('p')) {
    const mobileFieldText = rows[4].querySelector('p').textContent.trim();
    showMobileField = mobileFieldText.toLowerCase() === 'true';
  }

  if (rows[5] && rows[5].querySelector('p')) {
    const pincodeFieldText = rows[5].querySelector('p').textContent.trim();
    showPincodeField = pincodeFieldText.toLowerCase() === 'true';
  }

  if (rows[6] && rows[6].querySelector('p')) {
    const indianResidentText = rows[6].querySelector('p').textContent.trim();
    showIndianResidentField = indianResidentText.toLowerCase() === 'true';
  }

  if (rows[7] && rows[7].querySelector('p')) {
    const employmentTypeText = rows[7].querySelector('p').textContent.trim();
    showEmploymentTypeField = employmentTypeText.toLowerCase() === 'true';
  }

  // Transform the existing first row's <p> into the form title (don't replace it)
  if (rows[0] && rows[0].querySelector('p')) {
    const titleP = rows[0].querySelector('p');
    titleP.className = 'form-title';
    titleP.textContent = title;
  }

  // Hide configuration rows (rows 1-7) but don't remove them
  for (let i = 1; i < rows.length; i++) {
    if (rows[i]) {
      rows[i].style.display = 'none';
    }
  }

  // Create form container and add it after the title row
  const formContainer = document.createElement('div');
  formContainer.className = 'lead-form-container';

  const formContent = document.createElement('div');
  formContent.className = 'form-content';

  const formSection = document.createElement('div');
  formSection.className = 'form-section';

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

  // Define field configurations
  const fieldConfigurations = [
    {
      name: 'name',
      placeholder: 'Name*',
      type: 'text',
      required: true,
      show: showNameField
    },
    {
      name: 'mobile',
      placeholder: 'Mobile Number*',
      type: 'tel',
      required: true,
      show: showMobileField
    },
    {
      name: 'pincode',
      placeholder: 'Pincode*',
      type: 'text',
      required: true,
      show: showPincodeField
    },
    {
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
    {
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
  ];

  // Create form fields
  fieldConfigurations.forEach((fieldConfig) => {
    if (!fieldConfig.show) return;

    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'form-field-wrapper';

    if (fieldConfig.type === 'select') {
      const select = document.createElement('select');
      select.name = fieldConfig.name;
      select.required = fieldConfig.required;
      select.className = 'form-select';

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

  // Build form structure
  form.appendChild(formFields);
  form.appendChild(button);
  formSection.appendChild(form);
  formContent.appendChild(formSection);
  formContainer.appendChild(formContent);

  // Add the form after the title row, don't replace anything
  block.appendChild(formContainer);

  // Move instrumentation
  moveInstrumentation(block, formContainer);
}
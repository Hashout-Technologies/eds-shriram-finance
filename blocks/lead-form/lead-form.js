import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Read configuration from the block structure
  let title = 'Get a gold loan at low interest rates';
  let actionUrl = '';
  let ctaButtonText = 'Apply Now';
  let showNameField = true;
  let showMobileField = true;
  let showPincodeField = true;
  let showIndianResidentField = false;
  let showEmploymentTypeField = false;

  // Extract values from the existing row structure
  // Row 0: Title
  if (rows[0] && rows[0].querySelector('p')) {
    const titleText = rows[0].querySelector('p').textContent.trim();
    if (titleText) title = titleText;
  }

  // Row 1: Action URL
  if (rows[1] && rows[1].querySelector('p')) {
    const urlText = rows[1].querySelector('p').textContent.trim();
    if (urlText) actionUrl = urlText;
  }

  // Row 2: CTA Button Text
  if (rows[2] && rows[2].querySelector('p')) {
    const ctaText = rows[2].querySelector('p').textContent.trim();
    if (ctaText) ctaButtonText = ctaText;
  }

  // Row 3: Show Name Field
  if (rows[3] && rows[3].querySelector('p')) {
    const nameFieldText = rows[3].querySelector('p').textContent.trim();
    showNameField = nameFieldText.toLowerCase() === 'true';
  }

  // Row 4: Show Mobile Field
  if (rows[4] && rows[4].querySelector('p')) {
    const mobileFieldText = rows[4].querySelector('p').textContent.trim();
    showMobileField = mobileFieldText.toLowerCase() === 'true';
  }

  // Row 5: Show Pincode Field
  if (rows[5] && rows[5].querySelector('p')) {
    const pincodeFieldText = rows[5].querySelector('p').textContent.trim();
    showPincodeField = pincodeFieldText.toLowerCase() === 'true';
  }

  // Row 6: Show Indian Resident Field
  if (rows[6] && rows[6].querySelector('p')) {
    const indianResidentText = rows[6].querySelector('p').textContent.trim();
    showIndianResidentField = indianResidentText.toLowerCase() === 'true';
  }

  // Row 7: Show Employment Type Field
  if (rows[7] && rows[7].querySelector('p')) {
    const employmentTypeText = rows[7].querySelector('p').textContent.trim();
    showEmploymentTypeField = employmentTypeText.toLowerCase() === 'true';
  }

  // Create the form HTML structure
  const formContainer = document.createElement('div');
  formContainer.className = 'lead-form-container';

  const formContent = document.createElement('div');
  formContent.className = 'form-content';

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

  // Define field configurations
  const fieldConfigurations = [
    {
      key: 'name',
      name: 'name',
      placeholder: 'Name*',
      type: 'text',
      required: true,
      show: showNameField
    },
    {
      key: 'mobile',
      name: 'mobile',
      placeholder: 'Mobile Number*',
      type: 'tel',
      required: true,
      show: showMobileField
    },
    {
      key: 'pincode',
      name: 'pincode',
      placeholder: 'Pincode*',
      type: 'text',
      required: true,
      show: showPincodeField
    },
    {
      key: 'indianResident',
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
      key: 'employmentType',
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

  // Create form fields based on configuration
  fieldConfigurations.forEach((fieldConfig) => {
    if (!fieldConfig.show) return;

    // Create form field wrapper
    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'form-field-wrapper';

    if (fieldConfig.type === 'select') {
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
      // Create input element
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

  // Clear the block content but preserve the structure for authoring
  const blockClone = block.cloneNode(true);
  
  // Clear block content and add form
  block.innerHTML = '';
  block.appendChild(formContainer);
  
  // For authoring mode, preserve the original structure
  if (document.body.classList.contains('editor') || window.location.href.includes('editor')) {
    // Keep original rows for authoring
    blockClone.style.display = 'none';
    block.appendChild(blockClone);
  }

  // Move instrumentation
  moveInstrumentation(block, formContainer);
}
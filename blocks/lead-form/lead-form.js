import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Read from actual DOM structure - handle empty divs properly
  let title = '';
  let actionUrl = '';
  let ctaButtonText = '';
  let showNameField = true;
  let showMobileField = true;
  let showPincodeField = true;
  let showIndianResidentField = false;
  let showEmploymentTypeField = false;

  // Row 0: Title - has <p>Get a gold loan at low interest rates</p>
  if (rows[0]) {
    const titleP = rows[0].querySelector('p');
    if (titleP) {
      title = titleP.textContent.trim();
      titleP.className = 'form-title'; // Transform existing p to form title
    }
  }

  // Rows 1-5: Empty divs - skip them
  // Row 6: Has <p>true</p>
  if (rows[6]) {
    const row6P = rows[6].querySelector('p');
    if (row6P && row6P.textContent.trim()) {
      showIndianResidentField = row6P.textContent.trim().toLowerCase() === 'true';
    }
  }

  // Row 7: Has <p>false</p>
  if (rows[7]) {
    const row7P = rows[7].querySelector('p');
    if (row7P && row7P.textContent.trim()) {
      showEmploymentTypeField = row7P.textContent.trim().toLowerCase() === 'true';
    }
  }

  // Hide the configuration rows (6, 7) but keep title row visible
  if (rows[6]) rows[6].style.display = 'none';
  if (rows[7]) rows[7].style.display = 'none';

  // Create form and add after existing content
  const form = document.createElement('form');
  form.className = 'lead-form-form';
  form.method = 'POST';

  const formFields = document.createElement('div');
  formFields.className = 'form-fields';

  // Add name field if enabled
  if (showNameField) {
    const nameWrapper = document.createElement('div');
    nameWrapper.className = 'form-field-wrapper';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'name';
    nameInput.placeholder = 'Name*';
    nameInput.required = true;
    nameInput.className = 'form-input';
    nameWrapper.appendChild(nameInput);
    formFields.appendChild(nameWrapper);
  }

  // Add mobile field if enabled  
  if (showMobileField) {
    const mobileWrapper = document.createElement('div');
    mobileWrapper.className = 'form-field-wrapper';
    const mobileInput = document.createElement('input');
    mobileInput.type = 'tel';
    mobileInput.name = 'mobile';
    mobileInput.placeholder = 'Mobile Number*';
    mobileInput.required = true;
    mobileInput.className = 'form-input';
    mobileWrapper.appendChild(mobileInput);
    formFields.appendChild(mobileWrapper);
  }

  // Add pincode field if enabled
  if (showPincodeField) {
    const pincodeWrapper = document.createElement('div');
    pincodeWrapper.className = 'form-field-wrapper';
    const pincodeInput = document.createElement('input');
    pincodeInput.type = 'text';
    pincodeInput.name = 'pincode';
    pincodeInput.placeholder = 'Pincode*';
    pincodeInput.required = true;
    pincodeInput.className = 'form-input';
    pincodeWrapper.appendChild(pincodeInput);
    formFields.appendChild(pincodeWrapper);
  }

  // Add Indian resident field if enabled
  if (showIndianResidentField) {
    const residentWrapper = document.createElement('div');
    residentWrapper.className = 'form-field-wrapper';
    const residentSelect = document.createElement('select');
    residentSelect.name = 'indianResident';
    residentSelect.required = true;
    residentSelect.className = 'form-select';
    
    const residentOptions = [
      { value: '', text: 'Are you an Indian Resident*' },
      { value: 'yes', text: 'Yes' },
      { value: 'no', text: 'No' }
    ];
    
    residentOptions.forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      if (option.value === '') {
        optionElement.disabled = true;
        optionElement.selected = true;
      }
      residentSelect.appendChild(optionElement);
    });
    
    residentWrapper.appendChild(residentSelect);
    formFields.appendChild(residentWrapper);
  }

  // Add employment type field if enabled
  if (showEmploymentTypeField) {
    const employmentWrapper = document.createElement('div');
    employmentWrapper.className = 'form-field-wrapper';
    const employmentSelect = document.createElement('select');
    employmentSelect.name = 'employmentType';
    employmentSelect.required = true;
    employmentSelect.className = 'form-select';
    
    const employmentOptions = [
      { value: '', text: 'Employment Type*' },
      { value: 'self-employed-business', text: 'Self Employed Business' },
      { value: 'doctor', text: 'Doctor' },
      { value: 'chartered-accountant', text: 'Chartered Accountant' },
      { value: 'architect', text: 'Architect' },
      { value: 'engineer', text: 'Engineer' }
    ];
    
    employmentOptions.forEach((option) => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      if (option.value === '') {
        optionElement.disabled = true;
        optionElement.selected = true;
      }
      employmentSelect.appendChild(optionElement);
    });
    
    employmentWrapper.appendChild(employmentSelect);
    formFields.appendChild(employmentWrapper);
  }

  // Add submit button
  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'form-button';
  button.textContent = 'Apply Now';

  form.appendChild(formFields);
  form.appendChild(button);

  // Add form to the block (don't replace anything)
  block.appendChild(form);

  moveInstrumentation(block, form);
}
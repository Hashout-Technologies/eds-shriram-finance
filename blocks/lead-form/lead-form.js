import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // NO DEFAULTS AT ALL - only read what's actually in DOM
  let showNameField = false;
  let showMobileField = false;
  let showPincodeField = false;
  let showIndianResidentField = false;
  let showEmploymentTypeField = false;

  // Row 0: Title - transform existing p tag
  if (rows[0] && rows[0].querySelector('p')) {
    const titleP = rows[0].querySelector('p');
    titleP.className = 'form-title';
  }

  // Check what fields are actually configured in DOM
  // Only show fields that are explicitly set to 'true' in the DOM
  if (rows[6] && rows[6].querySelector('p')) {
    const row6Text = rows[6].querySelector('p').textContent.trim().toLowerCase();
    showIndianResidentField = (row6Text === 'true');
  }

  if (rows[7] && rows[7].querySelector('p')) {
    const row7Text = rows[7].querySelector('p').textContent.trim().toLowerCase();
    showEmploymentTypeField = (row7Text === 'true');
  }

  // Hide config rows
  if (rows[6]) rows[6].style.display = 'none';
  if (rows[7]) rows[7].style.display = 'none';

  // Only create form if we have at least one field to show
  const hasAnyField = showNameField || showMobileField || showPincodeField || showIndianResidentField || showEmploymentTypeField;
  
  if (hasAnyField) {
    const form = document.createElement('form');
    form.className = 'lead-form-form';
    form.method = 'POST';

    const formFields = document.createElement('div');
    formFields.className = 'form-fields';

    // Only add fields that are enabled in DOM
    if (showNameField) {
      const wrapper = document.createElement('div');
      wrapper.className = 'form-field-wrapper';
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'name';
      input.placeholder = 'Name*';
      input.required = true;
      input.className = 'form-input';
      wrapper.appendChild(input);
      formFields.appendChild(wrapper);
    }

    if (showMobileField) {
      const wrapper = document.createElement('div');
      wrapper.className = 'form-field-wrapper';
      const input = document.createElement('input');
      input.type = 'tel';
      input.name = 'mobile';
      input.placeholder = 'Mobile Number*';
      input.required = true;
      input.className = 'form-input';
      wrapper.appendChild(input);
      formFields.appendChild(wrapper);
    }

    if (showPincodeField) {
      const wrapper = document.createElement('div');
      wrapper.className = 'form-field-wrapper';
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'pincode';
      input.placeholder = 'Pincode*';
      input.required = true;
      input.className = 'form-input';
      wrapper.appendChild(input);
      formFields.appendChild(wrapper);
    }

    if (showIndianResidentField) {
      const wrapper = document.createElement('div');
      wrapper.className = 'form-field-wrapper';
      const select = document.createElement('select');
      select.name = 'indianResident';
      select.required = true;
      select.className = 'form-select';
      
      const options = [
        { value: '', text: 'Are you an Indian Resident*' },
        { value: 'yes', text: 'Yes' },
        { value: 'no', text: 'No' }
      ];
      
      options.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        if (option.value === '') {
          optionElement.disabled = true;
          optionElement.selected = true;
        }
        select.appendChild(optionElement);
      });
      
      wrapper.appendChild(select);
      formFields.appendChild(wrapper);
    }

    if (showEmploymentTypeField) {
      const wrapper = document.createElement('div');
      wrapper.className = 'form-field-wrapper';
      const select = document.createElement('select');
      select.name = 'employmentType';
      select.required = true;
      select.className = 'form-select';
      
      const options = [
        { value: '', text: 'Employment Type*' },
        { value: 'self-employed-business', text: 'Self Employed Business' },
        { value: 'doctor', text: 'Doctor' },
        { value: 'chartered-accountant', text: 'Chartered Accountant' },
        { value: 'architect', text: 'Architect' },
        { value: 'engineer', text: 'Engineer' }
      ];
      
      options.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        if (option.value === '') {
          optionElement.disabled = true;
          optionElement.selected = true;
        }
        select.appendChild(optionElement);
      });
      
      wrapper.appendChild(select);
      formFields.appendChild(wrapper);
    }

    form.appendChild(formFields);

    // NO BUTTON - only add if explicitly configured
    // Don't add button unless there's button text in DOM

    block.appendChild(form);
    moveInstrumentation(block, form);
  }
}
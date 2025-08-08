import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  console.log('Lead Form JS Running');
  
  // Read ALL field configurations from rows
  let showName = false;
  let showMobile = false;  
  let showPincode = false;
  let showIndianResident = false;
  let showEmploymentType = false;
  let buttonText = 'Apply Now'; // DEFAULT

  // Row 1: Name field toggle
  try {
    if (block.children[1] && block.children[1].children[0]) {
      const p = block.children[1].children[0].querySelector('p');
      if (p) {
        showName = p.textContent.trim() === 'true';
        console.log('Show Name:', showName);
      }
    }
  } catch (e) { console.log('Row 1 error:', e); }

  // Row 2: Mobile field toggle  
  try {
    if (block.children[2] && block.children[2].children[0]) {
      const p = block.children[2].children[0].querySelector('p');
      if (p) {
        showMobile = p.textContent.trim() === 'true';
        console.log('Show Mobile:', showMobile);
      }
    }
  } catch (e) { console.log('Row 2 error:', e); }

  // Row 3: Pincode field toggle
  try {
    if (block.children[3] && block.children[3].children[0]) {
      const p = block.children[3].children[0].querySelector('p');
      if (p) {
        showPincode = p.textContent.trim() === 'true';
        console.log('Show Pincode:', showPincode);
      }
    }
  } catch (e) { console.log('Row 3 error:', e); }

  // Row 5: Button text (authorable) - defaults to "Apply Now"
  try {
    if (block.children[5] && block.children[5].children[0]) {
      const p = block.children[5].children[0].querySelector('p');
      if (p && p.textContent.trim().length > 0) {
        buttonText = p.textContent.trim();
        console.log('Button Text:', buttonText);
      }
    }
  } catch (e) { console.log('Row 5 error:', e); }

  // Row 6: Indian Resident field toggle
  try {
    if (block.children[6] && block.children[6].children[0]) {
      const p = block.children[6].children[0].querySelector('p');
      if (p) {
        showIndianResident = p.textContent.trim() === 'true';
        console.log('Show Indian Resident:', showIndianResident);
      }
    }
  } catch (e) { console.log('Row 6 error:', e); }

  // Row 7: Employment Type field toggle  
  try {
    if (block.children[7] && block.children[7].children[0]) {
      const p = block.children[7].children[0].querySelector('p');
      if (p) {
        showEmploymentType = p.textContent.trim() === 'true';
        console.log('Show Employment Type:', showEmploymentType);
      }
    }
  } catch (e) { console.log('Row 7 error:', e); }

  // Transform title
  try {
    if (block.children[0] && block.children[0].children[0]) {
      const titleP = block.children[0].children[0].querySelector('p');
      if (titleP) {
        titleP.className = 'form-title';
        console.log('Title found:', titleP.textContent);
      }
    }
  } catch (e) { console.log('Title error:', e); }

  // Hide config rows
  for (let i = 1; i < block.children.length; i++) {
    if (block.children[i]) {
      block.children[i].style.display = 'none';
    }
  }

  // Create form HTML with conditional fields
  let formHTML = `
    <div class="lead-form-container">
      <div class="form-content">  
        <div class="form-section">
          <form class="lead-form-form">
            <div class="form-fields">`;

  // Add Name field if enabled
  if (showName) {
    formHTML += `
              <div class="form-field-wrapper">
                <input type="text" name="name" placeholder="Name*" class="form-input">
              </div>`;
  }

  // Add Mobile field if enabled
  if (showMobile) {
    formHTML += `
              <div class="form-field-wrapper">
                <input type="tel" name="mobile" placeholder="Mobile Number*" class="form-input">
              </div>`;
  }

  // Add Pincode field if enabled  
  if (showPincode) {
    formHTML += `
              <div class="form-field-wrapper">
                <input type="text" name="pincode" placeholder="Pincode*" class="form-input">
              </div>`;
  }

  // Add Indian Resident field if enabled
  if (showIndianResident) {
    formHTML += `
              <div class="form-field-wrapper">
                <select name="indianResident" class="form-select">
                  <option value="" disabled selected>Are you an Indian Resident*</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>`;
  }

  // Add Employment Type field if enabled
  if (showEmploymentType) {
    formHTML += `
              <div class="form-field-wrapper">
                <select name="employmentType" class="form-select">
                  <option value="" disabled selected>Employment Type*</option>
                  <option value="self-employed-business">Self Employed Business</option>
                  <option value="doctor">Doctor</option>
                  <option value="chartered-accountant">Chartered Accountant</option>
                  <option value="architect">Architect</option>
                  <option value="engineer">Engineer</option>
                </select>
              </div>`;
  }

  formHTML += `
            </div>`;

  // Always add button with text (either custom or default "Apply Now")
  formHTML += `<button type="submit" class="form-button">${buttonText}</button>`;

  formHTML += `
          </form>
        </div>
      </div>
    </div>
  `;

  // Add the form HTML
  block.insertAdjacentHTML('beforeend', formHTML);
  
  console.log('Form added with fields:', {
    name: showName,
    mobile: showMobile, 
    pincode: showPincode,
    indianResident: showIndianResident,
    employmentType: showEmploymentType,
    buttonText: buttonText
  });
}

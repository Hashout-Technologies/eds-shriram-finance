import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  console.log('Lead Form JS Running');
  
  // Read config - handle nested div structure properly
  let showIndianResident = false;
  let showEmploymentType = false;

  // Row 6: Check for Indian Resident
  try {
    if (block.children[6] && block.children[6].children[0]) {
      const p = block.children[6].children[0].querySelector('p');
      if (p) {
        showIndianResident = p.textContent.trim() === 'true';
        console.log('Indian Resident:', showIndianResident);
      }
    }
  } catch (e) {
    console.log('Row 6 error:', e);
  }

  // Row 7: Check for Employment Type  
  try {
    if (block.children[7] && block.children[7].children[0]) {
      const p = block.children[7].children[0].querySelector('p');
      if (p) {
        showEmploymentType = p.textContent.trim() === 'true';
        console.log('Employment Type:', showEmploymentType);
      }
    }
  } catch (e) {
    console.log('Row 7 error:', e);
  }

  // Create super simple form HTML
  let formHTML = `
    <div class="lead-form-container">
      <div class="form-content">  
        <div class="form-section">
          <form class="lead-form-form">
            <div class="form-fields">
              <div class="form-field-wrapper">
                <input type="text" name="name" placeholder="Name*" class="form-input">
              </div>
              <div class="form-field-wrapper">
                <input type="tel" name="mobile" placeholder="Mobile Number*" class="form-input">
              </div>
              <div class="form-field-wrapper">
                <input type="text" name="pincode" placeholder="Pincode*" class="form-input">
              </div>`;

  // Add conditional fields
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
            </div>
            <button type="submit" class="form-button">Apply Now</button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Just add the form HTML to the block
  block.insertAdjacentHTML('beforeend', formHTML);
  
  console.log('Form added successfully');
}

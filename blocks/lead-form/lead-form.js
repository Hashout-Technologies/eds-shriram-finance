import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Get title from first row
  const titleRow = block.children[0];
  if (titleRow && titleRow.children[0] && titleRow.children[0].querySelector('p')) {
    titleRow.children[0].querySelector('p').className = 'form-title';
  }

  // Get boolean values from rows 6 and 7
  let showIndianResident = false;
  let showEmploymentType = false;

  // Row 6 check
  if (block.children[6] && block.children[6].children[0] && block.children[6].children[0].querySelector('p')) {
    const row6Text = block.children[6].children[0].querySelector('p').textContent.trim();
    showIndianResident = row6Text === 'true';
    block.children[6].style.display = 'none';
  }

  // Row 7 check  
  if (block.children[7] && block.children[7].children[0] && block.children[7].children[0].querySelector('p')) {
    const row7Text = block.children[7].children[0].querySelector('p').textContent.trim();
    showEmploymentType = row7Text === 'true';
    block.children[7].style.display = 'none';
  }

  // Create simple form HTML
  const formHTML = `
    <div class="lead-form-container">
      <div class="form-content">
        <div class="form-section">
          <form class="lead-form-form" method="POST">
            <div class="form-fields">
              <div class="form-field-wrapper">
                <input type="text" name="name" placeholder="Name*" required class="form-input">
              </div>
              <div class="form-field-wrapper">
                <input type="tel" name="mobile" placeholder="Mobile Number*" required class="form-input">
              </div>
              <div class="form-field-wrapper">
                <input type="text" name="pincode" placeholder="Pincode*" required class="form-input">
              </div>
              ${showIndianResident ? `
              <div class="form-field-wrapper">
                <select name="indianResident" required class="form-select">
                  <option value="" disabled selected>Are you an Indian Resident*</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              ` : ''}
              ${showEmploymentType ? `
              <div class="form-field-wrapper">
                <select name="employmentType" required class="form-select">
                  <option value="" disabled selected>Employment Type*</option>
                  <option value="self-employed-business">Self Employed Business</option>
                  <option value="doctor">Doctor</option>
                  <option value="chartered-accountant">Chartered Accountant</option>
                  <option value="architect">Architect</option>
                  <option value="engineer">Engineer</option>
                </select>
              </div>
              ` : ''}
            </div>
            <button type="submit" class="form-button">Apply Now</button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Add form to block
  block.insertAdjacentHTML('beforeend', formHTML);
}
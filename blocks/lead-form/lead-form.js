import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  console.log('Lead Form - Starting decoration');
  
  // Transform the block into proper form structure
  block.classList.add('lead-form-container');
  
  // Get title from first row and transform it
  let titleElement = null;
  if (block.children[0] && block.children[0].children[0]) {
    const firstCell = block.children[0].children[0];
    firstCell.classList.add('form-content');
    
    const titleP = firstCell.querySelector('p');
    if (titleP) {
      titleP.classList.add('form-title');
      titleElement = titleP;
      console.log('Title found:', titleP.textContent);
    }
  }
  
  // Read field configuration from rows 6 and 7
  let showIndianResident = false;
  let showEmploymentType = false;
  
  // Row 6: Indian Resident field toggle
  if (block.children[6] && block.children[6].children[0]) {
    const row6P = block.children[6].children[0].querySelector('p');
    if (row6P) {
      const value = row6P.textContent.trim().toLowerCase();
      showIndianResident = value === 'true';
      console.log('Indian Resident field:', showIndianResident);
      block.children[6].style.display = 'none';
    }
  }
  
  // Row 7: Employment Type field toggle  
  if (block.children[7] && block.children[7].children[0]) {
    const row7P = block.children[7].children[0].querySelector('p');
    if (row7P) {
      const value = row7P.textContent.trim().toLowerCase(); 
      showEmploymentType = value === 'true';
      console.log('Employment Type field:', showEmploymentType);
      block.children[7].style.display = 'none';
    }
  }
  
  // Hide all other config rows (1-5, and any beyond 7)
  for (let i = 1; i < block.children.length; i++) {
    if (i !== 6 && i !== 7 && block.children[i]) {
      block.children[i].style.display = 'none';
    }
  }
  
  // Create the form HTML structure
  const formHTML = `
    <div class="form-section">
      <form class="lead-form-form" method="POST" action="">
        <div class="form-fields">
          <!-- Always visible fields -->
          <div class="form-field-wrapper">
            <input type="text" name="name" placeholder="Name*" required class="form-input" />
          </div>
          <div class="form-field-wrapper">
            <input type="tel" name="mobile" placeholder="Mobile Number*" required class="form-input" />
          </div>
          <div class="form-field-wrapper">
            <input type="text" name="pincode" placeholder="Pincode*" required class="form-input" />
          </div>
          
          <!-- Conditional fields -->
          <div class="form-field-wrapper indian-resident-field ${showIndianResident ? 'show' : 'hide'}">
            <select name="indianResident" required class="form-select">
              <option value="" disabled selected>Are you an Indian Resident*</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          
          <div class="form-field-wrapper employment-type-field ${showEmploymentType ? 'show' : 'hide'}">
            <select name="employmentType" required class="form-select">
              <option value="" disabled selected>Employment Type*</option>
              <option value="self-employed-business">Self Employed Business</option>
              <option value="doctor">Doctor</option>
              <option value="chartered-accountant">Chartered Accountant</option>
              <option value="architect">Architect</option>
              <option value="engineer">Engineer</option>
            </select>
          </div>
        </div>
        
        <button type="submit" class="form-button">Apply Now</button>
      </form>
    </div>
  `;
  
  // Add the form to the first row (with title)
  if (block.children[0] && block.children[0].children[0]) {
    block.children[0].children[0].insertAdjacentHTML('beforeend', formHTML);
  }
  
  console.log('Lead Form - Decoration complete');
  
  // Move instrumentation
  moveInstrumentation(block, block.querySelector('.form-section'));
}

// Export for debugging
window.debugLeadForm = function(block) {
  console.log('Block structure:');
  for (let i = 0; i < block.children.length; i++) {
    const row = block.children[i];
    console.log(`Row ${i}:`, row);
    if (row.children[0]) {
      const cell = row.children[0];
      const p = cell.querySelector('p');
      console.log(`  Content: "${p ? p.textContent : 'no p tag'}"`);
    }
  }
};

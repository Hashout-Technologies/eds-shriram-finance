export default function decorate(block) {
  // SIMPLE TEST - Add red border to see if JS runs
  block.style.border = '5px solid red';
  
  console.log('LEAD FORM JS IS RUNNING!');
  console.log('Block children count:', block.children.length);
  
  // Log all rows content
  for (let i = 0; i < block.children.length; i++) {
    const row = block.children[i];
    if (row.children[0] && row.children[0].querySelector('p')) {
      console.log(`Row ${i}:`, row.children[0].querySelector('p').textContent);
    } else {
      console.log(`Row ${i}: empty`);
    }
  }
  
  // Add simple text to see if anything works
  const test = document.createElement('div');
  test.innerHTML = '<h1 style="color: green;">JAVASCRIPT IS WORKING!</h1>';
  block.appendChild(test);
}
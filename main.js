const lot = '<div class="lot"></div>';
const fence = '<div class="fence"></div>';


document.getElementById('street1').innerHTML = Array.from({length: 10}, () => lot).join(fence);
document.getElementById('street2').innerHTML = Array.from({length: 11}, () => lot).join(fence);
document.getElementById('street3').innerHTML = Array.from({length: 12}, () => lot).join(fence);


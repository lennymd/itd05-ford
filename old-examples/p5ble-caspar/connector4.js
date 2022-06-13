// const SERVICE_UUID = '19b10010-e8f2-537e-4f6c-d104768a1221';
const SERVICE_UUID = 'cee3e619-9134-407e-8110-9b3b17babab8';
const CHARACTERISTICS_UUID = {
  button: '19b10011-e8f2-537e-4f6c-d104768a1214',
  slider: '19b10011-e8f2-537e-4f6c-d104768a1215',
};

let canWrite = true;

let myBLE;

function BLE_Setup() {
  myBLE = new p5ble();
  document.getElementById('connect').addEventListener('click', () => {
    myBLE.connect(SERVICE_UUID, onConnected);
  });
}

/**
 * Function that runs when connected to a Bluetooth device
 * @param err
 * @param characteristics
 */
function onConnected(err, characteristics) {
  let connectBox = document.getElementById('connect-box');
  connectBox.style.display = 'none';

  myBLE.onDisconnected(() => {
    connectBox.style.display = 'inline-block';
  });

  if (err) {
    return console.error(err);
  }

  document.getElementById('input-container').style.display = 'block';

  for (const char of characteristics) {
    if (char.uuid === CHARACTERISTICS_UUID.button) {
      document.getElementById('go').addEventListener('click', () => {
        myBLE.write(char, 1);
      });
      // add the button function to the signal
      //myBLE.startNotifications(char, buttonHandler)
    }
    if (char.uuid === CHARACTERISTICS_UUID.slider) {
      const slider = document.getElementById('myRange');
      slider.addEventListener('change', () => {
        if (canWrite) {
          canWrite = false;
          setTimeout(() => {
            canWrite = true;
          }, 100);
          myBLE.write(char, slider.value);
        }
        document.getElementById('range-value').innerText = slider.value;
      });
      slider.addEventListener('touchmove', () => {
        if (canWrite) {
          canWrite = false;
          setTimeout(() => {
            canWrite = true;
          }, 100);
          myBLE.write(char, slider.value);
        }
        document.getElementById('range-value').innerText = slider.value;
      });
    }
  }
}

(() => {
  console.log('test');
  BLE_Setup();
})();

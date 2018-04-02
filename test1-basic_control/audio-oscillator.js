/**
* NOTE:
* Some of the features of the  Web Audio API currently only work on Chrome, hence the 'webkit' prefix!
*/

// Create audio (context) container
var audioContext = new (AudioContext || webkitAudioContext)();

// Table of notes with correspending keyboard codes. Frequencies are in hertz.
// The notes start from middle C
var notes = {
    65: { noteName: 'C4', frequency: 261.6, keyName: 'a' },
    83: { noteName: 'D4', frequency: 293.7, keyName: 's' },
    68: { noteName: 'E4', frequency: 329.6, keyName: 'd' },
    70: { noteName: 'F4', frequency: 349.2, keyName: 'f' },
    71: { noteName: 'G4', frequency: 392, keyName: 'g' },
    72: { noteName: 'A4', frequency: 440, keyName: 'h' },
    74: { noteName: 'B4', frequency: 493.9, keyName: 'j' },
    75: { noteName: 'C5', frequency: 523.3, keyName: 'k' },
    76: { noteName: 'D5', frequency: 587.3, keyName: 'l' },
    186: { noteName: 'E5', frequency: 659.3, keyName: ';' }
};

function Key(keyCode, noteName, keyName, frequency) {
    var keySound = new Sound(frequency, 'triangle');
    return { sound: keySound };
}

// functions to retrieve note value from name, name from value etc
function noteValue(note, octave) {
  // multiple octave by 12 and add position of note within that octave
  return octave * 12 + OCTAVE.indexOf(note);
}

function noteName(noteval) {
  // reverse of noteValue - finds note name from number
  // multiple octave by 12 and add position of note within that octave

  var octave = Math.floor(noteval/12);
  var index = noteval % 12;
  var notename = OCTAVE[index]
  //console.log(`${notename}${octave}`)
  return `${notename}${octave}`
}

function getNoteDistance(note1, octave1, note2, octave2) {
  return noteValue(note1, octave1) - noteValue(note2, octave2);
}

function flatToSharp(note) {
  // converts any flats inputted to their equivalent sharps
  switch (note) {
    case 'Bb': return 'A#';
    case 'Db': return 'C#';
    case 'Eb': return 'D#';
    case 'Gb': return 'F#';
    case 'Ab': return 'G#';
    default:   return note;
  }
}

// oscillator functions
function Sound(frequency, type) {
    this.osc = audioContext.createOscillator(); // Create oscillator node
    this.pressed = false; // flag to indicate if sound is playing

    /* Set default configuration for sound */
    if(typeof frequency !== 'undefined') {
        /* Set frequency. If it's not set, the default is used (440Hz) */
        this.osc.frequency.value = frequency;
    }

    /* Set waveform type. Default is actually 'sine' but triangle sounds better :) */
    this.osc.type = type || 'triangle';

    /* Start playing the sound. You won't hear it yet as the oscillator node needs to be
    piped to output (AKA your speakers). */
    this.osc.start(0);
};

Sound.prototype.play = function() {
    if(!this.pressed) {
        this.pressed = true;
        this.osc.connect(audioContext.destination);
        console.log('play')
    }
};

Sound.prototype.stop = function() {
    this.pressed = false;
    this.osc.disconnect();
    console.log('stop')
};

Sound.prototype.playstop = function(duration) {
    if(!this.pressed) {
        this.pressed = true;
        this.osc.connect(audioContext.destination);
        console.log('play')
        var that = this;

        setTimeout(function(){ that.pressed = false; that.osc.disconnect(); console.log('stop') }, duration);

    }
};

function createKeyboard(notes) {
    var sortedKeys = []; // Placeholder for keys to be sorted
    var waveFormSelector = document.getElementById('soundType');

    for(var keyCode in notes) {
        var note = notes[keyCode];

        /* Generate playable key */
        note.key = new Key(keyCode, note.noteName, note.keyName, note.frequency);
    }

    /* Sort keys by frequency so that they'll be added to the DOM in the correct order */
    /* sortedKeys = sortedKeys.sort(function(note1, note2) {
        if (note1.frequency < note2.frequency) return -1;
        if (note1.frequency > note2.frequency) return 1;

        return 0;
    });

    // Add those sorted keys to DOM
    for(var i = 0; i < sortedKeys.length; i++) {
        document.getElementById(containerId).appendChild(sortedKeys[i].key.html);
    }

    var playNote = function(event) {
        event.preventDefault();

        var keyCode = event.keyCode || event.target.getAttribute('data-key');

        if(typeof notesByKeyCode[keyCode] !== 'undefined') {
            // Pipe sound to output (AKA speakers)
            notesByKeyCode[keyCode].key.sound.play();

            // Highlight key playing
            notesByKeyCode[keyCode].key.html.className = 'key playing';
        }
    };

    var endNote = function(event) {
        var keyCode = event.keyCode || event.target.getAttribute('data-key');

        if(typeof notesByKeyCode[keyCode] !== 'undefined') {
            // Kill connection to output
            notesByKeyCode[keyCode].key.sound.stop();

            // Remove key highlight
            notesByKeyCode[keyCode].key.html.className = 'key';
        }
    };*/

    var setWaveform = function(event) {
        for(var keyCode in notes) {
            notes[keyCode].key.sound.osc.type = this.value;
        }

        // Unfocus selector so value is not accidentally updated again while playing keys
        this.blur();
    };

    // Check for changes in the waveform selector and update all oscillators with the selected type
    waveFormSelector.addEventListener('change', setWaveform);
}


// TO PLAY NOTES, CALL
// notes[keyCode].key.sound.play();

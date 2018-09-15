'use babel'

let err_sym = '|';

// Return the hindi consonant block corresponding to the given english
// consonant block.
function consonant_to_hindi(eng) {
  let aspiration = (eng.length == 2)?(eng[1] == 'h'):false;
  switch(eng) {
    case 'k':
      return 'क';
    case 'kh':
      return 'ख';
    case 'g':
      return 'ग';
    case 'gh':
      return 'घ';
    case 'D':
      return 'ङ';
    case 'c':
      return 'च';
    case 'ch':
      return 'छ';
    case 'j':
      return 'ज';
    case 'jh':
      return 'झ';
    case 'Nh': // Find better representation for 'nya'
      return 'ञ';
    case 'T':
      return 'ट';
    case 'Th':
      return 'ठ';
    case 'D':
      return 'ड';
    case 'Dh':
      return 'ढ';
    case 'N':
      return 'ण';
    case 't':
      return 'त';
    case 'th':
      return 'थ';
    case 'd':
      return 'द';
    case 'dh':
      return 'ध';
    case 'n':
      return 'न';
    case 'p':
      return 'प';
    case 'ph':
      return 'फ';
    case 'b':
      return 'ब';
    case 'bh':
      return 'भ';
    case 'y':
      return 'य';
    case 'r':
      return 'र';
    case 'rh':
      return 'ऱ';
    case 'l':
      return 'ल';
    case 'L':
      return 'ळ';
    case 'Lh':
      return 'ऴ';
    case 'm':
      return 'म'
    case 'v': case 'w':
      return 'व';
    case 'sh':
      return 'श';
    case 'Sh':
      return 'ष';
    case 's':
      return 'स';
    case 'h':
      return 'ह';
    case 'f':
      return 'फ़';
    case 'z':
      return 'ज़';
  }
  return err_sym;
}

function vowel_to_independent_hindi_vowel(eng) {
  switch (eng) {
    case 'a':
      return 'अ';
    case 'aa':
      return 'आ';
    case 'i':
      return 'इ';
    case 'ii':
      return 'ई';
    case 'u':
      return 'उ';
    case 'uu':
      return 'ऊ';
    case 'R':
      return 'ऋ';
    case 'ee': // Find better representation for short e
      return 'ऎ';
    case 'e':
      return 'ए';
    case 'ai':
      return 'ऐ';
    case 'eo': // Find better representation
      return 'ऑ';
    case 'ao': // Find better representation
      return 'ऒ';
    case 'o':
      return 'ओ';
    case 'au':
      return 'औ';
    default:
      return err_sym;
  }
}

function vowel_to_hindi_matra(eng) {
  switch (eng) {
    case 'a':
      return '';
    case 'aa':
      return 'ा';
    case 'i':
      return 'ि';
    case 'ii':
      return 'ी';
    case 'u':
      return 'ु';
    case 'uu':
      return 'ू';
    case 'R':
      return 'ॄ';
    // Handle some non-Hindi matras
    // Also handle 'r' ki matra
    case 'e':
      return 'े';
    case 'ee':
      return 'ॆ'
    case 'ai':
      return 'ै';
    case 'o':
      return 'ो';
    case 'au':
      return 'ौ';
    default:
      return err_sym;
  }
}

// Convert vowel to hindi matra, given whether or not there is space for a matra
function vowel_to_hindi(eng, space_for_matra) {
  if (space_for_matra) {
    return vowel_to_hindi_matra(eng);
  }
  else {
    return vowel_to_independent_hindi_vowel(eng);
  }
}

// Returns whether character is a vowel
function is_vowel(chr) {
  switch (chr) {
    case 'a': case 'e': case 'i': case 'o': case 'u': case 'R': return true;
    default: return false;
  }
}

function convert_word_to_hindi(eng) {
  if (eng == '')
    return '';

  // States of our state machine talking of the last (hindi unit) thing we read
  let STATE_BEGIN = 0;
  let STATE_CONSONANT = 1;
  let STATE_VOWEL = 2;
  let state = STATE_BEGIN;
  // Part of state. Denotes whether we have space for partial vowel
  let space_for_matra = false;

  // The hindi character we are constructing
  hin_chr_read = '';

  let end_char = "$";
  eng += end_char;

  hin = '';
  for (i = 0; i < eng.length; ++i) {
    chr = eng[i];
    if (false) {
      console.log('state=' + state + ", chr=" + chr +
        ", space_for_matra=" + space_for_matra + ", hin_chr_read=" + hin_chr_read
        + ", hin=" + hin);
    }
    switch (state) {
      case STATE_BEGIN:
        if (is_vowel(chr)) {
          hin_chr_read += chr;
          state = STATE_VOWEL;
        }
        else {
          hin_chr_read += chr;
          space_for_matra = true;
          state = STATE_CONSONANT;
        }
      break;

      case STATE_CONSONANT:
        if (chr == 'h') {
          if (hin_chr_read != '') {
            hin += consonant_to_hindi(hin_chr_read + 'h');
            hin_chr_read = '';
          }
          else
            hin += err_sym;
        }
        else if (is_vowel(chr)) {
          if (hin_chr_read != '') {
            hin += consonant_to_hindi(hin_chr_read);
            hin_chr_read = '';
          }
          hin_chr_read += chr;
          space_for_matra = true;
          state = STATE_VOWEL;
        }
        else if (chr == end_char) {
          if (hin_chr_read != '') {
            hin += consonant_to_hindi(hin_chr_read);
            hin += '्';
          }
        }
        else {
          if (hin_chr_read != '') {
            hin += consonant_to_hindi(hin_chr_read);
            hin_chr_read = '';
          }
          hin += '्';
          hin_chr_read += chr;
        }
      break;

      case STATE_VOWEL:
        if (is_vowel(chr)) {
          if (hin_chr_read != '') {
            let candidate_vowel = vowel_to_hindi(hin_chr_read + chr, space_for_matra);
            if (candidate_vowel == err_sym) {
              hin += vowel_to_hindi(hin_chr_read, space_for_matra);
              hin_chr_read = chr;
            }
            else {
              hin += candidate_vowel;
              hin_chr_read = '';
            }
            space_for_matra = false;
          }
          else {
            hin_chr_read += chr;
          }
        }
        else if (chr == '\'') {
          // Anuswara - could use a better interface
          if (hin_chr_read != '') {
            hin += vowel_to_hindi(hin_chr_read, space_for_matra);
            hin_chr_read = '';
          }
          hin += 'ं'
        }
        else if (chr == end_char) {
          if (hin_chr_read != '') {
            hin += vowel_to_hindi(hin_chr_read, space_for_matra);
          }
        }
        else {
          if (hin_chr_read != '') {
            hin += vowel_to_hindi(hin_chr_read, space_for_matra);
            hin_chr_read = '';
            space_for_matra = false;
          }
          hin_chr_read += chr;
          state = STATE_CONSONANT;
        }
      break;
    }
  }

  return hin;
}

function convert_digit_to_hindi(eng) {
  switch (eng) {
    case '0': return '०';
    case '1': return '१';
    case '2': return '२';
    case '3': return '३';
    case '4': return '४';
    case '5': return '५';
    case '6': return '६';
    case '7': return '७';
    case '8': return '८';
    case '9': return '९';
    default: return err_sym;
  }
}

export { convert_word_to_hindi, convert_digit_to_hindi };

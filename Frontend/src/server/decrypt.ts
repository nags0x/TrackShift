import crypto from 'crypto';

function buildIV(sessionSalt, seq) {
    const iv = new Uint8Array(12);
    iv.set(sessionSalt, 0);
    iv.set([
      (seq >> 24) & 0xff,
      (seq >> 16) & 0xff,
      (seq >> 8) & 0xff,
      seq & 0xff
    ], 8);
    return iv;
  }

function decrypt(){
    
}
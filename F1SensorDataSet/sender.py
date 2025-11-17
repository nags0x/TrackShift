import csv
import socket
import time
import struct
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

CSV_FILE = "telemetry.csv"

UDP_IP = "127.0.0.1"
UDP_PORT = 4443
ACK_PORT = 3001


AES_KEY = bytes.fromhex("00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff")
aesgcm = AESGCM(AES_KEY)

send_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
ack_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
ack_sock.bind(("0.0.0.0", ACK_PORT))
ack_sock.settimeout(0.3)

def send_salt():
    global SESSION_SALT, seq
    SESSION_SALT = os.urandom(8)
    pkt = struct.pack("!IB", 0, 99) + SESSION_SALT
    while True:
        send_sock.sendto(pkt, (UDP_IP, UDP_PORT))
        try:
            ack, _ = ack_sock.recvfrom(1024)
            ack_seq, ack_type = struct.unpack("!IB", ack[:5])
            if ack_seq == 1 and ack_type == 1:
                seq = 1
                return
        except:
            pass
        time.sleep(0.1)

def send_packet(packet_seq, plaintext):
    nonce = SESSION_SALT + packet_seq.to_bytes(4, "big")
    encrypted = aesgcm.encrypt(nonce, plaintext, None)
    pkt = struct.pack("!IB", packet_seq, 0) + encrypted
    retries = 0
    while True:
        send_sock.sendto(pkt, (UDP_IP, UDP_PORT))
        try:
            ack, _ = ack_sock.recvfrom(1024)
            ack_seq, ack_type = struct.unpack("!IB", ack[:5])
            if ack_seq == packet_seq + 1 and ack_type == 1:
                return
            send_salt()
            return
        except:
            retries += 1
            if retries >= 5:
                send_salt()
                return
        time.sleep(1)

seq = 0
send_salt()

with open(CSV_FILE, "r") as f:
    reader = csv.reader(f)
    next(reader)
    for row in reader:
        data = ",".join(row).encode()
        send_packet(seq, data)
        seq += 1
        time.sleep(0.2)

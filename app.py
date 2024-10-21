import socket
from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

pixels = [[0] * 128 for _ in range(128)]


def get_lcd_pixels():
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.sendto("GET".encode(), ('192.168.1.169', 65432))
        data, _ = s.recvfrom(65536)
        return json.loads(data.decode())


@app.route('/')
def home():
    print(get_lcd_pixels())
    return render_template('index.html', pixels=pixels)


@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    x, y = int(data.get('x')), int(data.get('y'))

    pixel = 1 if pixels[y][x] == 0 else 0
    pixels[y][x] = pixel
    
    send_to_lcd(x, y, pixel)

    return jsonify({'status': 'success',
                    'pixel_value': f"{pixel}", 'x': x, 'y': y})


def send_to_lcd(x, y, pixel):
    message = f"{x},{y},{pixel}"
    print(f"Sending to LCD: {message}")

    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.sendto(message.encode(), ('192.168.1.169', 65432))


if __name__ == '__main__':
    app.run(debug=True)

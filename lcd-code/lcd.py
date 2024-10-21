
import sys
import os
# picdir = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'pic')
# libdir = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'lib')
# if os.path.exists(libdir):
#     sys.path.append(libdir)

from waveshare_OLED import OLED_1in5
from PIL import Image,ImageDraw,ImageFont


class OLED():
    def __init__(self):
        self.disp = OLED_1in5.OLED_1in5()
        self.disp.Init()
        self.disp.clear()
        self.pixels_drawn_count = 0

        # Image for drawing to
        self.image1 = Image.new('L', (self.disp.width, self.disp.height), 0)
        self.pixels = self.image1.load()

    def show(self):
        # self.image1 = image1.rotate(0)
        self.disp.ShowImage(self.disp.getbuffer(self.image1))

    def set_pixel(self, x, y, value):
        self.pixels[x, y] = value

    def clear(self):
        self.disp.clear()
        self.image1 = Image.new('L', (self.disp.width, self.disp.height), 0)
        self.pixels = self.image1.load()

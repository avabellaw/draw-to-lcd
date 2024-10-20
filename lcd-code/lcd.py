
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

        # Image for drawing to
        self.image1 = Image.new('L', (self.disp.width, self.disp.height), 0)
        self.draw = ImageDraw.Draw(self.image1)

        # # Fonts
        # font = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 12)
        # font1 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 18)
        # font2 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 24)

        # self.font = [font, font1, font2]

    def line(self):
        self.draw.line([(0, 0), (127, 0)], fill=15)
        self.draw.line([(0, 0), (0, 127)], fill=15)
        self.draw.line([(0, 127), (127, 127)], fill=15)
        self.draw.line([(127, 0), (127, 127)], fill=15)

    # def text(self, text, font_size=0):
    #     self.draw.text((20, 0), text, font=self.font[font_size], fill=15)

    def show(self):
        # self.image1 = image1.rotate(0)
        self.disp.ShowImage(self.disp.getbuffer(self.image1))

    def rect(self):
        image1 = Image.new('L', (self.disp.width, self.disp.height), 0)
        draw = ImageDraw.Draw(image1)
        for i in range(0, 16):
            draw.rectangle([(0, 8*i), (128, 8*(i+1))], fill=i)

    # def image(self):
    #     Himage2 = Image.new('L', (self.disp.width, self.disp.height), 0) 
    #     bmp = Image.open(os.path.join(picdir, '1in5.bmp'))
    #     Himage2.paste(bmp, (0, 0))
    #     Himage2 = Himage2.rotate(0)

    def set_pixel(self, x, y, value):
        self.draw.point((x, y), fill=value)
        self.show()

    def clear(self):
        self.disp.clear()
